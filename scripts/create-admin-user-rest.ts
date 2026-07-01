import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
config({ path: resolve(projectRoot, ".env.local") });

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: npx tsx scripts/create-admin-user-rest.ts <email> <password>");
  process.exit(1);
}

if (!API_KEY || !PROJECT_ID) {
  console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local");
  process.exit(1);
}

async function createAdmin() {
  console.log("Creating admin user via Firebase REST API...");

  // 1. Sign up the user
  const signUpRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  if (!signUpRes.ok) {
    const error = await signUpRes.text();
    throw new Error(`Sign up failed: ${error}`);
  }

  const { localId, idToken } = await signUpRes.json();

  // 2. Create user document in Firestore with isAdmin: true
  const docUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${localId}`;
  const firestoreRes = await fetch(docUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      fields: {
        email: { stringValue: email },
        uid: { stringValue: localId },
        isAdmin: { booleanValue: true },
        createdAt: { timestampValue: new Date().toISOString() },
        updatedAt: { timestampValue: new Date().toISOString() },
      },
    }),
  });

  if (!firestoreRes.ok) {
    const error = await firestoreRes.text();
    throw new Error(`Firestore write failed: ${error}`);
  }

  console.log("Admin user created successfully:");
  console.log("  UID:", localId);
  console.log("  Email:", email);
}

createAdmin().catch((error) => {
  console.error("Failed to create admin user:", error.message);
  process.exit(1);
});
