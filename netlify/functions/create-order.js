const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set");
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (err) {
  throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_JSON: " + err.message);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: serviceAccount.project_id + ".firebasestorage.app",
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kays.apparel@gmail.com";
const ORDERS_COLLECTION = "orders";
const RECEIPTS_COLLECTION = "receipts";

function badRequest(message) {
  return { statusCode: 400, body: JSON.stringify({ error: message }) };
}

function serverError(message) {
  return { statusCode: 500, body: JSON.stringify({ error: message }) };
}

function generateOrderConfirmationEmail(order) {
  const orderDate = order.createdAt
    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
    : "Unknown";
  const items = order.items
    .map(
      (item) => `
    <div style="border-bottom:1px solid #eee;padding:15px 0;">
      <p><strong>${item.productName}</strong></p>
      <p>Size: ${item.size} | Color: ${item.color} | Quantity: ${item.quantity}</p>
      <p>Price: ₦${(item.price * item.quantity).toLocaleString()}</p>
    </div>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Order Confirmation</title></head>
    <body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
      <div style="max-width:600px;margin:0 auto;padding:20px;">
        <div style="background-color:#6B4C3B;color:white;padding:30px;text-align:center;">
          <h1>Order Confirmation</h1>
          <p>Thank you for shopping with KaysApparel!</p>
        </div>
        <div style="padding:30px;background-color:#f9f9f9;">
          <p>Dear ${order.customerInfo?.firstName} ${order.customerInfo?.lastName},</p>
          <p>We've received your order and are processing it.</p>
          <div style="background-color:white;padding:20px;margin:20px 0;border-radius:8px;">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <h3>Items Ordered</h3>
            ${items}
            <p style="font-size:18px;font-weight:bold;color:#6B4C3B;text-align:right;margin-top:20px;">
              Total: ₦${order.total.toLocaleString()}
            </p>
          </div>
          <div style="background-color:#fff3cd;padding:15px;border-radius:8px;margin:20px 0;">
            <h3>Payment Information</h3>
            <p><strong>Bank:</strong> Moniepoint MFB</p>
            <p><strong>Account Name:</strong> Kaysapparel Global Concept</p>
            <p><strong>Account Number:</strong> 5439334220</p>
            <p><strong>Amount:</strong> ₦${order.total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAdminOrderNotificationEmail(order) {
  const orderDate = order.createdAt
    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
    : "Unknown";
  const items = order.items
    .map(
      (item) => `
    <div style="border-bottom:1px solid #eee;padding:10px 0;">
      <p><strong>${item.productName}</strong></p>
      <p>Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}</p>
      <p>Price: ₦${item.price.toLocaleString()}</p>
    </div>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>New Order</title></head>
    <body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
      <div style="max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#6B4C3B;color:white;padding:20px;text-align:center;">
          <h1>New Order Received</h1>
          <p>Order #${order.id}</p>
        </div>
        <div style="background:#f9f9f9;padding:20px;">
          <p><strong>Order Date:</strong> ${orderDate}</p>
          <p><strong>Customer:</strong> ${order.customerInfo?.firstName} ${order.customerInfo?.lastName}</p>
          <p><strong>Email:</strong> ${order.customerInfo?.email}</p>
          <p><strong>Phone:</strong> ${order.customerInfo?.phone}</p>
          <p><strong>Address:</strong> ${order.customerInfo?.address}</p>
          <p><strong>Delivery Zone:</strong> ${order.customerInfo?.deliveryZone || "Not specified"}</p>
          <h3>Items:</h3>
          ${items}
          <p style="font-size:18px;font-weight:bold;color:#6B4C3B;">Total: ₦${order.total.toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) {
    console.log("Email skipped: RESEND_API_KEY not set");
    return false;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "KaysApparel <noreply@kaysapparel.com>",
        to: [to],
        subject,
        html,
        text: "",
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("Resend error:", result);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send email:", err);
    return false;
  }
}

async function sendEmails(order) {
  try {
    await Promise.allSettled([
      order.customerInfo?.email
        ? sendEmail(order.customerInfo.email, `Order Confirmation - KaysApparel #${order.id}`, generateOrderConfirmationEmail(order))
        : Promise.resolve(),
      sendEmail(ADMIN_EMAIL, `New Order Received - KaysApparel #${order.id}`, generateAdminOrderNotificationEmail(order)),
    ]);
  } catch (err) {
    console.error("Email send error:", err);
  }
}

function validateCustomerInfo(customerInfo) {
  if (!customerInfo) return "Customer information is required";
  if (!customerInfo.firstName?.trim()) return "First name is required";
  if (!customerInfo.lastName?.trim()) return "Last name is required";
  if (!customerInfo.phone?.trim()) return "Phone number is required";
  if (!customerInfo.address?.trim()) return "Delivery address is required";
  if (!customerInfo.deliveryZone?.trim()) return "Delivery location is required";
  return null;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return badRequest("Invalid JSON body");
  }

  const { customerInfo, items, subtotal, deliveryFee, total, receipt } = payload;

  const validationError = validateCustomerInfo(customerInfo);
  if (validationError) {
    return badRequest(validationError);
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return badRequest("Cart items are required");
  }

  try {
    const now = Timestamp.now();
    const orderData = {
      customerInfo: {
        firstName: customerInfo.firstName.trim(),
        lastName: customerInfo.lastName.trim(),
        email: customerInfo.email?.trim() || "",
        phone: customerInfo.phone.trim(),
        address: customerInfo.address.trim(),
        deliveryZone: customerInfo.deliveryZone.trim(),
        deliveryFee: deliveryFee || 0,
      },
      items,
      subtotal: subtotal || 0,
      deliveryFee: deliveryFee || 0,
      total: total || 0,
      status: "pending",
      paymentInfo: {
        bank: "Moniepoint MFB",
        accountName: "Kaysapparel Global Concept",
        accountNumber: "5439334220",
      },
      createdAt: now,
      updatedAt: now,
    };

    const orderRef = await db.collection(ORDERS_COLLECTION).add(orderData);
    const orderId = orderRef.id;
    const order = { id: orderId, ...orderData };

    // Upload receipt if provided
    if (receipt && receipt.data) {
      try {
        const base64Body = receipt.data.includes(",") ? receipt.data.split(",")[1] : receipt.data;
        const buffer = Buffer.from(base64Body, "base64");
        const fileName = `${Date.now()}_${receipt.name || "receipt"}`;
        const filePath = `receipts/${orderId}/${fileName}`;
        const file = bucket.file(filePath);
        await file.save(buffer, {
          metadata: { contentType: receipt.contentType || "image/jpeg" },
        });
        const [fileUrl] = await file.getSignedUrl({ action: "read", expires: "03-01-2500" });
        await db.collection(RECEIPTS_COLLECTION).add({
          orderId,
          fileName,
          fileUrl,
          uploadedAt: now,
        });
      } catch (receiptErr) {
        console.error("Receipt upload error:", receiptErr);
        // Order is still created even if receipt upload fails
      }
    }

    // Send emails in the background (do not block the response)
    sendEmails(order);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, order }),
    };
  } catch (err) {
    console.error("create-order error:", err);
    return serverError(err.message || "Internal server error");
  }
};
