import { orderService, Order, OrderItem } from './firebase-services'
import { useCartStore } from './store'
import { emailService } from './email-service'
import { validateOrderData, checkRateLimit } from './validation'

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
}

export interface PaymentInfo {
  bank: string
  accountName: string
  accountNumber: string
}

export async function createOrder(customerInfo: CustomerInfo): Promise<Order> {
  try {
    // Rate limiting check
    const rateLimitIdentifier = `order:${customerInfo.email}`;
    if (!checkRateLimit(rateLimitIdentifier)) {
      throw new Error('Too many order attempts. Please try again later.');
    }

    // Validate customer information
    const validationResult = validateOrderData(customerInfo);

    if (!validationResult.isValid) {
      const errorMessages = Object.values(validationResult.errors);
      throw new Error(errorMessages[0] || 'Invalid customer information');
    }

    // Use sanitized customer data
    const sanitizedCustomerInfo = validationResult.sanitizedData;

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

    // Calculate total
    const total = useCartStore.getState().getTotal()

    // Create order in Firebase with sanitized data
    const order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      customerInfo: sanitizedCustomerInfo,
      items: orderItems,
      total,
      status: 'pending',
      paymentInfo: {
        bank: 'Sterling Bank',
        accountName: 'Kaysapparel Global Concept',
        accountNumber: '0092419264'
      }
    }

    const createdOrder = await orderService.create(order)
    
    // Send order confirmation email
    try {
      await emailService.sendOrderConfirmation(createdOrder)
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the order if email fails
    }
    
    // Clear cart after order is created
    useCartStore.getState().clearCart()
    
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
    bank: 'Sterling Bank',
    accountName: 'Kaysapparel Global Concept',
    accountNumber: '0092419264'
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
