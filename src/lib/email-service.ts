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

  // Production email service using Resend API
  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      // Check if we're in development mode (using console logs)
      if (process.env.NODE_ENV === 'development' || !process.env.RESEND_API_KEY) {
        console.log('📧 [DEV MODE] Sending Email:', {
          to: data.to,
          subject: data.subject,
          timestamp: new Date().toISOString()
        });
        
        console.log('Email content preview:', data.html.substring(0, 200) + '...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('✅ [DEV MODE] Email sent successfully to:', data.to);
        return true;
      }

      // Production: Send via Resend API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'KaysApparel <noreply@kaysapparel.com>', // Update with your domain
          to: [data.to],
          subject: data.subject,
          html: data.html,
          text: data.text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend API error: ${error}`);
      }

      const result = await response.json();
      console.log('✅ Email sent successfully via Resend:', result.id);
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
              
              <div class="total">
                Total: ₦${order.total.toLocaleString()}
              </div>
            </div>
            
            <div class="payment-info">
              <h3>Payment Information</h3>
              <p>Please make payment to:</p>
              <p><strong>Bank:</strong> Sterling Bank</p>
              <p><strong>Account Name:</strong> Kaysapparel Global Concept</p>
              <p><strong>Account Number:</strong> 0092419264</p>
              <p><strong>Amount:</strong> ₦${order.total.toLocaleString()}</p>
              <p>Upload your payment receipt on the checkout page to complete your order.</p>
            </div>
            
            <div class="order-details">
              <h3>Delivery Information</h3>
              <p>${order.customerInfo?.address}</p>
              <p>Phone: ${order.customerInfo?.phone}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at kays.apparel@gmail.com or 08136642570</p>
            <p>Shop 45 Omololu Road, off Randle Avenue, Surulere, Lagos</p>
            <p>&copy; 2024 KaysApparel. All rights reserved.</p>
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

Total: ₦${order.total.toLocaleString()}

PAYMENT INFORMATION:
Bank: Sterling Bank
Account Name: Kaysapparel Global Concept
Account Number: 0092419264
Amount: ₦${order.total.toLocaleString()}

Please upload your payment receipt on the checkout page to complete your order.

Delivery Address:
${order.customerInfo?.address}
Phone: ${order.customerInfo?.phone}

Questions? Contact us at kays.apparel@gmail.com or 08136642570

© 2024 KaysApparel. All rights reserved.
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
              <p><strong>Total Paid:</strong> ₦${order.total.toLocaleString()}</p>
            </div>
            
            <p>We're now preparing your order for shipment. You'll receive another notification when your order ships.</p>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at kays.apparel@gmail.com or 08136642570</p>
            <p>&copy; 2024 KaysApparel. All rights reserved.</p>
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
Total Paid: ₦${order.total.toLocaleString()}

We're now preparing your order for shipment. You'll receive another notification when your order ships.

Questions? Contact us at kays.apparel@gmail.com or 08136642570

© 2024 KaysApparel. All rights reserved.
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
              <p><strong>Shipping Address:</strong> ${order.customerInfo?.address}</p>
            </div>
            
            <p>You can track your order status on our website using your order ID.</p>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at kays.apparel@gmail.com or 08136642570</p>
            <p>&copy; 2024 KaysApparel. All rights reserved.</p>
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
Shipping Address: ${order.customerInfo?.address}

You can track your order status on our website using your order ID.

Questions? Contact us at kays.apparel@gmail.com or 08136642570

© 2024 KaysApparel. All rights reserved.
    `;
  }
}

export const emailService = EmailService.getInstance();
