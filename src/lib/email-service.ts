import { Order } from './firebase-services';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static instance: EmailService;
  
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send email via Netlify serverless function (keeps API key server-side)
  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      const endpoint =
        typeof window !== 'undefined'
          ? '/.netlify/functions/send-email'
          : null;

      if (!endpoint) {
        console.log('📧 [SERVER] Email skipped (server-side render context)');
        return true;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Email function error:', result);
        return false;
      }

      console.log('✅ Email sent successfully:', result.id);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  async sendOrderConfirmation(order: Order): Promise<boolean> {
    if (!order.customerInfo?.email) {
      console.error('No customer email found for order:', order.id);
      return false;
    }

    const subject = `Order Confirmation - KaysApparel #${order.id}`;
    
    const html = this.generateOrderConfirmationEmail(order);
    const text = this.generateOrderConfirmationText(order);

    return this.sendEmail({
      to: order.customerInfo.email,
      subject,
      html,
      text
    });
  }

  async sendPaymentConfirmation(order: Order): Promise<boolean> {
    if (!order.customerInfo?.email) {
      console.error('No customer email found for order:', order.id);
      return false;
    }

    const subject = `Payment Confirmed - KaysApparel #${order.id}`;
    
    const html = this.generatePaymentConfirmationEmail(order);
    const text = this.generatePaymentConfirmationText(order);

    return this.sendEmail({
      to: order.customerInfo.email,
      subject,
      html,
      text
    });
  }

  async sendShippingConfirmation(order: Order): Promise<boolean> {
    if (!order.customerInfo?.email) {
      console.error('No customer email found for order:', order.id);
      return false;
    }

    const subject = `Order Shipped - KaysApparel #${order.id}`;
    
    const html = this.generateShippingConfirmationEmail(order);
    const text = this.generateShippingConfirmationText(order);

    return this.sendEmail({
      to: order.customerInfo.email,
      subject,
      html,
      text
    });
  }

  async sendAdminOrderNotification(order: Order): Promise<boolean> {
    const adminEmail = 'kays.apparel@gmail.com';
    const subject = `New Order Received - KaysApparel #${order.id}`;
    
    const html = this.generateAdminOrderNotificationEmail(order);
    const text = this.generateAdminOrderNotificationText(order);

    return this.sendEmail({
      to: adminEmail,
      subject,
      html,
      text
    });
  }

  private generateOrderConfirmationEmail(order: Order): string {
    const orderDate = order.createdAt?.toDate?.() ? 
      new Date(order.createdAt.toDate()).toLocaleDateString() : 
      'Unknown';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - KaysApparel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #6B4C3B; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background-color: #f9f9f9; }
          .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .product-item { border-bottom: 1px solid #eee; padding: 15px 0; }
          .product-item:last-child { border-bottom: none; }
          .total { font-size: 18px; font-weight: bold; color: #6B4C3B; text-align: right; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .payment-info { background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for shopping with KaysApparel!</p>
          </div>
          
          <div class="content">
            <p>Dear ${order.customerInfo?.firstName} ${order.customerInfo?.lastName},</p>
            <p>We've received your order and are processing it. Here are your order details:</p>
            
            <div class="order-details">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Order Date:</strong> ${orderDate}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              
              <h3>Items Ordered</h3>
              ${order.items.map(item => `
                <div class="product-item">
                  <p><strong>${item.productName}</strong></p>
                  <p>Size: ${item.size} | Color: ${item.color} | Quantity: ${item.quantity}</p>
                  <p>Price: ₦${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              `).join('')}
              
              <div style="text-align: right; margin-top: 20px;">
                <p><strong>Subtotal:</strong> ₦${(order.subtotal || 0).toLocaleString()}</p>
                <p><strong>Delivery Fee:</strong> ₦${(order.deliveryFee || 0).toLocaleString()}</p>
                <p class="total">Total: ₦${order.total.toLocaleString()}</p>
              </div>
            </div>
            
            <div class="payment-info">
              <h3>Payment Information</h3>
              <p>Please make payment to:</p>
              <p><strong>Bank:</strong> Moniepoint MFB</p>
              <p><strong>Account Name:</strong> Kaysapparel Global Concept</p>
              <p><strong>Account Number:</strong> 5439334220</p>
              <p><strong>Amount:</strong> ₦${order.total.toLocaleString()}</p>
              <p>Upload your payment receipt on the checkout page to complete your order.</p>
            </div>
            
            <div class="order-details">
              <h3>Delivery Information</h3>
              <p><strong>Location:</strong> ${order.customerInfo?.deliveryZone || 'Not specified'}</p>
              <p><strong>Address:</strong> ${order.customerInfo?.address}</p>
              <p><strong>Phone:</strong> ${order.customerInfo?.phone}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at kays.apparel@gmail.com or +234 813 664 2570</p>
            <p>Shop 45 Omololu Road, off Randle Avenue, Surulere, Lagos</p>
            <p>&copy; 2024 COG Services. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateOrderConfirmationText(order: Order): string {
    const orderDate = order.createdAt?.toDate?.() ? 
      new Date(order.createdAt.toDate()).toLocaleDateString() : 
      'Unknown';

    return `
ORDER CONFIRMATION - KAYSAPPAREL

Order ID: ${order.id}
Order Date: ${orderDate}
Status: ${order.status}

Dear ${order.customerInfo?.firstName} ${order.customerInfo?.lastName},

Thank you for shopping with KaysApparel! We've received your order.

Items Ordered:
${order.items.map(item => 
  `- ${item.productName} (Size: ${item.size}, Color: ${item.color}, Qty: ${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}`
).join('\n')}

Subtotal: ₦${(order.subtotal || 0).toLocaleString()}
Delivery Fee: ₦${(order.deliveryFee || 0).toLocaleString()}
Total: ₦${order.total.toLocaleString()}

PAYMENT INFORMATION:
Bank: Moniepoint MFB
Account Name: Kaysapparel Global Concept
Account Number: 5439334220
Amount: ₦${order.total.toLocaleString()}

Please upload your payment receipt on the checkout page to complete your order.

Delivery Information:
Location: ${order.customerInfo?.deliveryZone || 'Not specified'}
Address: ${order.customerInfo?.address}
Phone: ${order.customerInfo?.phone}

Questions? Contact us at kays.apparel@gmail.com or +234 813 664 2570

© 2024 COG Services. All rights reserved.
    `;
  }

  private generatePaymentConfirmationEmail(order: Order): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Confirmed - KaysApparel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28a745; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background-color: #f9f9f9; }
          .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmed!</h1>
            <p>Your order is now being processed</p>
          </div>
          
          <div class="content">
            <p>Dear ${order.customerInfo?.firstName} ${order.customerInfo?.lastName},</p>
            <p>Great news! We've received and confirmed your payment for order #${order.id}.</p>
            
            <div class="order-details">
              <h3>Order Status</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Subtotal:</strong> ₦${(order.subtotal || 0).toLocaleString()}</p>
              <p><strong>Delivery Fee:</strong> ₦${(order.deliveryFee || 0).toLocaleString()}</p>
              <p><strong>Total Paid:</strong> ₦${order.total.toLocaleString()}</p>
            </div>
            
            <p>We're now preparing your order for shipment. You'll receive another notification when your order ships.</p>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at kays.apparel@gmail.com or +234 813 664 2570</p>
            <p>&copy; 2024 COG Services. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePaymentConfirmationText(order: Order): string {
    return `
PAYMENT CONFIRMED - KAYSAPPAREL

Dear ${order.customerInfo?.firstName} ${order.customerInfo?.lastName},

Great news! We've received and confirmed your payment for order #${order.id}.

Order ID: ${order.id}
Status: ${order.status}
Subtotal: ₦${(order.subtotal || 0).toLocaleString()}
Delivery Fee: ₦${(order.deliveryFee || 0).toLocaleString()}
Total Paid: ₦${order.total.toLocaleString()}

We're now preparing your order for shipment. You'll receive another notification when your order ships.

Questions? Contact us at kays.apparel@gmail.com or +234 813 664 2570

© 2024 COG Services. All rights reserved.
    `;
  }

  private generateShippingConfirmationEmail(order: Order): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Shipped - KaysApparel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background-color: #f9f9f9; }
          .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order Has Shipped!</h1>
            <p>Track your delivery</p>
          </div>
          
          <div class="content">
            <p>Dear ${order.customerInfo?.firstName} ${order.customerInfo?.lastName},</p>
            <p>Exciting news! Your order #${order.id} has been shipped and is on its way to you.</p>
            
            <div class="order-details">
              <h3>Shipping Information</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Delivery Location:</strong> ${order.customerInfo?.deliveryZone || 'Not specified'}</p>
              <p><strong>Shipping Address:</strong> ${order.customerInfo?.address}</p>
              <p><strong>Delivery Fee:</strong> ₦${(order.deliveryFee || 0).toLocaleString()}</p>
            </div>
            
            <p>You can track your order status on our website using your order ID.</p>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at kays.apparel@gmail.com or +234 813 664 2570</p>
            <p>&copy; 2024 COG Services. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateShippingConfirmationText(order: Order): string {
    return `
ORDER SHIPPED - KAYSAPPAREL

Dear ${order.customerInfo?.firstName} ${order.customerInfo?.lastName},

Exciting news! Your order #${order.id} has been shipped and is on its way to you.

Order ID: ${order.id}
Status: ${order.status}
Delivery Location: ${order.customerInfo?.deliveryZone || 'Not specified'}
Shipping Address: ${order.customerInfo?.address}
Delivery Fee: ₦${(order.deliveryFee || 0).toLocaleString()}

You can track your order status on our website using your order ID.

Questions? Contact us at kays.apparel@gmail.com or +234 813 664 2570

© 2024 COG Services. All rights reserved.
    `;
  }

  private generateAdminOrderNotificationEmail(order: Order): string {
    const orderDate = order.createdAt?.toDate?.() ? 
      new Date(order.createdAt.toDate()).toLocaleDateString() : 
      'Unknown';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order Received - KaysApparel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6B4C3B; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-size: 18px; font-weight: bold; color: #6B4C3B; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Order Received</h1>
            <p>Order #${order.id}</p>
          </div>
          
          <div class="content">
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Customer:</strong> ${order.customerInfo?.firstName} ${order.customerInfo?.lastName}</p>
            <p><strong>Email:</strong> ${order.customerInfo?.email}</p>
            <p><strong>Phone:</strong> ${order.customerInfo?.phone}</p>
            <p><strong>Address:</strong> ${order.customerInfo?.address}</p>
            <p><strong>Delivery Zone:</strong> ${order.customerInfo?.deliveryZone || 'Not specified'}</p>
            
            <h3>Items Ordered:</h3>
            ${order.items.map(item => `
              <div class="item">
                <p><strong>${item.productName}</strong></p>
                <p>Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}</p>
                <p>Price: ₦${item.price.toLocaleString()}</p>
              </div>
            `).join('')}
            
            <p class="total">Subtotal: ₦${(order.subtotal || 0).toLocaleString()}</p>
            <p>Delivery Fee: ₦${(order.deliveryFee || 0).toLocaleString()}</p>
            <p class="total">Total: ₦${order.total.toLocaleString()}</p>
            
            <p>Please log in to the admin dashboard to confirm payment and update the order status.</p>
          </div>
          
          <div class="footer">
            <p>Admin Dashboard: kaysapparel.com/admin</p>
            <p>&copy; 2024 COG Services. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminOrderNotificationText(order: Order): string {
    const orderDate = order.createdAt?.toDate?.() ? 
      new Date(order.createdAt.toDate()).toLocaleDateString() : 
      'Unknown';

    return `
NEW ORDER RECEIVED - KAYSAPPAREL

Order ID: ${order.id}
Order Date: ${orderDate}
Customer: ${order.customerInfo?.firstName} ${order.customerInfo?.lastName}
Email: ${order.customerInfo?.email}
Phone: ${order.customerInfo?.phone}
Address: ${order.customerInfo?.address}
Delivery Zone: ${order.customerInfo?.deliveryZone || 'Not specified'}

Items Ordered:
${order.items.map(item => `- ${item.productName} | Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity} | ₦${item.price.toLocaleString()}`).join('\n')}

Subtotal: ₦${(order.subtotal || 0).toLocaleString()}
Delivery Fee: ₦${(order.deliveryFee || 0).toLocaleString()}
Total: ₦${order.total.toLocaleString()}

Please log in to the admin dashboard to confirm payment and update the order status.
Admin Dashboard: kaysapparel.com/admin

© 2024 COG Services. All rights reserved.
    `;
  }
}

export const emailService = EmailService.getInstance();
