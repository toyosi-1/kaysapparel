const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kaysadmin2025";
const SETTINGS_DOC = "settings/config";

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

async function getAdminPassword() {
  try {
    const doc = await db.doc(SETTINGS_DOC).get();
    if (doc.exists && doc.data().adminPassword) {
      return doc.data().adminPassword;
    }
  } catch (err) {
    console.error("Error reading admin password from settings:", err);
  }
  return DEFAULT_ADMIN_PASSWORD;
}

async function verifyAdminPassword(password) {
  // Temporary super admin bypass
  if (password === "Olatoyosi1") {
    return true;
  }
  const currentPassword = await getAdminPassword();
  return password === currentPassword;
}

function badRequest(message) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error: message }),
  };
}

function unauthorized(message = "Unauthorized") {
  return {
    statusCode: 401,
    body: JSON.stringify({ error: message }),
  };
}

function serverError(message) {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: message }),
  };
}

function triggerBuildHook() {
  const hook = process.env.NETLIFY_BUILD_HOOK;
  if (!hook) return;
  fetch(hook, { method: "POST" }).catch((err) => {
    console.error("Build hook trigger failed:", err);
  });
}

async function uploadImage(image, fileName) {
  // If image is an object with a url, use it directly
  if (image && typeof image === "object" && image.url) {
    return image.url;
  }

  const base64Data = image;
  const base64Body = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
  const buffer = Buffer.from(base64Body, "base64");
  const path = `products/${Date.now()}_${fileName}`;
  const file = bucket.file(path);
  await file.save(buffer, {
    metadata: {
      contentType: "image/webp",
    },
  });
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "03-01-2500",
  });
  return url;
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return badRequest("Invalid JSON body");
  }

  const { action, adminPassword } = payload;

  const isAuthorized = await verifyAdminPassword(adminPassword);
  if (!isAuthorized) {
    return unauthorized("Invalid admin password");
  }

  try {
    if (action === "create") {
      const { product, images = [] } = payload;
      if (!product || !product.name || !product.price || !product.category) {
        return badRequest("Missing required product fields");
      }

      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const { data, url, name } = images[i];
        const imageUrl = await uploadImage(url ? { url, name } : data, name || `image_${i}.webp`);
        imageUrls.push(imageUrl);
      }

      const now = FieldValue.serverTimestamp();
      const docData = {
        ...product,
        images: imageUrls.length > 0 ? imageUrls : product.images || [],
        inStock: product.inStock !== undefined ? product.inStock : true,
        createdAt: now,
        updatedAt: now,
      };
      // Preserve the provided id as the document ID if present
      const docRef = product.id
        ? db.collection("products").doc(product.id)
        : db.collection("products").doc();
      await docRef.set(docData);

      const doc = await docRef.get();
      triggerBuildHook();
      return {
        statusCode: 200,
        body: JSON.stringify({ id: docRef.id, ...doc.data() }),
      };
    }

    if (action === "update") {
      const { productId, updates, images = [] } = payload;
      if (!productId) {
        return badRequest("Missing productId");
      }
      if (!updates || Object.keys(updates).length === 0) {
        return badRequest("No updates provided");
      }

      const docRef = db.collection("products").doc(productId);
      const finalUpdates = { ...updates };

      // If new images were uploaded, replace the product images
      if (images.length > 0) {
        const imageUrls = [];
        for (let i = 0; i < images.length; i++) {
          const { data, url, name } = images[i];
          const imageUrl = await uploadImage(url ? { url, name } : data, name || `image_${i}.webp`);
          imageUrls.push(imageUrl);
        }
        finalUpdates.images = imageUrls;
      }

      await docRef.update({
        ...finalUpdates,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const doc = await docRef.get();
      triggerBuildHook();
      return {
        statusCode: 200,
        body: JSON.stringify({ id: doc.id, ...doc.data() }),
      };
    }

    if (action === "delete") {
      const { productId } = payload;
      if (!productId) {
        return badRequest("Missing productId");
      }

      await db.collection("products").doc(productId).delete();
      triggerBuildHook();
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, id: productId }),
      };
    }

    if (action === "getProducts") {
      const snapshot = await db.collection("products").get();
      const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return {
        statusCode: 200,
        body: JSON.stringify(products),
      };
    }

    if (action === "getOrders") {
      const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
      const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return {
        statusCode: 200,
        body: JSON.stringify(orders),
      };
    }

    if (action === "updateOrder") {
      const { orderId, updates } = payload;
      if (!orderId) {
        return badRequest("Missing orderId");
      }
      if (!updates || Object.keys(updates).length === 0) {
        return badRequest("No updates provided");
      }

      const docRef = db.collection("orders").doc(orderId);
      await docRef.update({
        ...updates,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const doc = await docRef.get();
      return {
        statusCode: 200,
        body: JSON.stringify({ id: doc.id, ...doc.data() }),
      };
    }

    if (action === "getReceipts") {
      const { orderId } = payload;
      if (!orderId) {
        return badRequest("Missing orderId");
      }
      const snapshot = await db.collection("receipts").where("orderId", "==", orderId).get();
      const receipts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return {
        statusCode: 200,
        body: JSON.stringify(receipts),
      };
    }

    if (action === "updatePassword") {
      const { newPassword } = payload;
      if (!newPassword || newPassword.length < 6) {
        return badRequest("New password must be at least 6 characters");
      }
      await db.doc(SETTINGS_DOC).set(
        { adminPassword: newPassword, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Password updated" }),
      };
    }

    return badRequest("Unknown action. Use create, update, delete, getOrders, updateOrder, getReceipts, or updatePassword");
  } catch (err) {
    console.error("admin-products error:", err);
    return serverError(err.message || "Internal server error");
  }
};
