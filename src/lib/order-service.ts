import { orderService, Order, OrderItem } from './firebase-services'
import { useCartStore } from './store'
import { emailService } from './email-service'
import { validateOrderData, checkRateLimit } from './validation'
import { getDeliveryPrice, isValidDeliveryZone, DeliveryZone } from './delivery'

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  deliveryZone: string
  deliveryFee?: number
}

export interface PaymentInfo {
  bank: string
  accountName: string
  accountNumber: string
}

export async function createOrder(customerInfo: CustomerInfo): Promise<Order> {
  try {
    // Rate limiting check (use email if available, otherwise phone)
    const rateLimitIdentifier = `order:${customerInfo.email || customerInfo.phone}`;
    if (!checkRateLimit(rateLimitIdentifier)) {
      throw new Error('Too many order attempts. Please try again later.');
    }

    // Validate delivery zone
    if (!customerInfo.deliveryZone || !isValidDeliveryZone(customerInfo.deliveryZone)) {
      throw new Error('Please select a valid delivery location');
    }

    // Validate customer information
    const validationResult = validateOrderData(customerInfo);

    if (!validationResult.isValid) {
      const errorMessages = Object.values(validationResult.errors);
      throw new Error(errorMessages[0] || 'Invalid customer information');
    }

    // Use sanitized customer data
    const sanitizedCustomerInfo = validationResult.sanitizedData;

    // Calculate delivery fee
    const deliveryZone = customerInfo.deliveryZone as DeliveryZone;
    const deliveryFee = getDeliveryPrice(deliveryZone);
    const sanitizedWithDelivery = {
      ...sanitizedCustomerInfo,
      deliveryZone,
      deliveryFee
    };

    const cartItems = useCartStore.getState().items
    
    if (cartItems.length === 0) {
      throw new Error('Cart is empty')
    }

    // Convert cart items to order items
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.product.price
    }))

    // Calculate subtotal and total with delivery fee
    const subtotal = useCartStore.getState().getTotal()
    const total = subtotal + deliveryFee

    // Create order in Firebase with sanitized data
    const order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      customerInfo: sanitizedWithDelivery,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      paymentInfo: {
        bank: 'Moniepoint MFB',
        accountName: 'Kaysapparel Global Concept',
        accountNumber: '5439334220'
      }
    }

    const createdOrder = await orderService.create(order)
    
    // Clear cart immediately after order is created
    useCartStore.getState().clearCart()
    
    // Send emails in the background so the redirect happens immediately
    // Don't await — if email fails, the order is still placed
    Promise.allSettled([
      emailService.sendOrderConfirmation(createdOrder),
      emailService.sendAdminOrderNotification(createdOrder)
    ]).then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Failed to send ${index === 0 ? 'customer' : 'admin'} email:`, result.reason)
        }
      })
    })
    
    return createdOrder
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  await orderService.updateStatus(orderId, status)
  
  // Send email notifications based on status change
  try {
    const order = await orderService.getById(orderId)
    
    if (order) {
      switch (status) {
        case 'paid':
          await emailService.sendPaymentConfirmation(order)
          break
        case 'shipped':
          await emailService.sendShippingConfirmation(order)
          break
        // Add more email types as needed
      }
    }
  } catch (error) {
    console.error('Failed to send status update email:', error)
    // Don't fail the status update if email fails
  }
}

export async function markOrderAsPaid(orderId: string): Promise<void> {
  await orderService.markAsPaid(orderId, {
    bank: 'Moniepoint MFB',
    accountName: 'Kaysapparel Global Concept',
    accountNumber: '5439334220'
  })
  
  // Send payment confirmation email
  try {
    const order = await orderService.getById(orderId)
    if (order) {
      await emailService.sendPaymentConfirmation(order)
    }
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error)
    // Don't fail the payment marking if email fails
  }
}

export async function getOrdersByCustomerEmail(email: string): Promise<Order[]> {
  // For now, we'll get all orders and filter by email
  // In a real app, you'd have a proper user system
  const allOrders = await orderService.getAll()
  return allOrders.filter(order => 
    order.customerInfo?.email === email
  )
}
