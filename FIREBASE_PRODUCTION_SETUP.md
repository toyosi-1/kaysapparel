# Firebase Production Setup Guide

## ⚠️ Important: Your Firebase Project is in Test Mode

When you created the Firebase project, it was likely set to **test mode**, which allows all reads and writes for 30 days. **This is not secure for production.**

You must update the security rules **before** launching your e-commerce site.

---

## 🔒 Step 1: Apply Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/project/kaysapparel-3250f/firestore/rules)
2. Replace the current rules with the contents of `firestore.rules` in this project
3. Click **Publish**

### What the rules do:
- **Products**: Anyone can view products (needed for shopping), only admins can add/edit/delete
- **Users**: Users can only access their own profile data, admins can access all users
- **Orders**: Authenticated users can create orders and view their own orders, admins can manage all orders
- **Categories**: Publicly readable, only admins can modify

---

## 📁 Step 2: Apply Storage Security Rules

1. Go to [Firebase Storage Rules](https://console.firebase.google.com/project/kaysapparel-3250f/storage/rules)
2. Replace the current rules with the contents of `storage.rules` in this project
3. Click **Publish**

### What the rules do:
- **Receipts**: Users can upload payment receipts (max 5MB, images only), admins can read them
- **Product Images**: Publicly viewable, only admins can upload
- **User Avatars**: Users can upload their own profile images

---

## 🔐 Step 3: Enable Authentication Methods

1. Go to [Firebase Authentication](https://console.firebase.google.com/project/kaysapparel-3250f/authentication)
2. Click **Get Started** if you haven't already
3. Enable **Email/Password** sign-in method
4. (Optional) Enable additional providers if needed later

---

## 📋 Step 4: Get Firebase Configuration

1. Go to [Project Settings](https://console.firebase.google.com/project/kaysapparel-3250f/settings/general)
2. Scroll down to "Your apps" section
3. Find the Firebase config values (or copy from the `firebase-config.txt` file you have locally)

You need these values:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 🔗 Step 5: Set Up Environment Variables for Netlify

In your Netlify dashboard:

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kaysapparel-3250f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kaysapparel-3250f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kaysapparel-3250f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
RESEND_API_KEY=your_resend_api_key
NODE_ENV=production
```

**Important:** Do not commit these values to GitHub. Use Netlify's environment variables instead.

---

## 👤 Step 6: Create an Admin User

To access the admin dashboard, you need to mark a user as admin in Firestore:

1. Register a user account on your website
2. Go to [Firestore Database](https://console.firebase.google.com/project/kaysapparel-3250f/firestore/data)
3. Find the user document in the `users` collection
4. Add a field: `isAdmin` with value `true`
5. Save the document

Alternatively, you can run this locally (requires Firebase Admin SDK setup).

---

## ✅ Production Checklist

### Before going live:
- [ ] Firestore rules applied and published
- [ ] Storage rules applied and published
- [ ] Email/Password authentication enabled
- [ ] Environment variables set in Netlify
- [ ] Admin user created in Firestore
- [ ] Test order placed successfully
- [ ] Test email received
- [ ] Mobile responsiveness verified

### After going live:
- [ ] Monitor Firebase usage
- [ ] Check Firestore security rules regularly
- [ ] Review Firebase billing
- [ ] Monitor email delivery rates

---

## 🚨 Test Mode Warning

**Do not leave your Firebase project in test mode.** Test mode allows anyone to read and write your entire database. Always use the production rules in `firestore.rules` and `storage.rules`.

---

## 📱 Firebase Project Details

- **Project ID:** `kaysapparel-3250f`
- **Console URL:** https://console.firebase.google.com/project/kaysapparel-3250f
- **Firestore:** https://console.firebase.google.com/project/kaysapparel-3250f/firestore
- **Storage:** https://console.firebase.google.com/project/kaysapparel-3250f/storage
- **Authentication:** https://console.firebase.google.com/project/kaysapparel-3250f/authentication

---

**Your Firebase backend is now ready for secure production use!** 🚀
