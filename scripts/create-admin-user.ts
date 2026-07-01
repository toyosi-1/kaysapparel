import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
config({ path: resolve(projectRoot, ".env.local") });

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../src/lib/firebase";

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: npx tsx scripts/create-admin-user.ts <email> <password>");
  process.exit(1);
}

async function createAdmin() {
  console.log("Creating admin user...");
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await setDoc(doc(db, "users", uid), {
    email,
    uid,
    isAdmin: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  console.log("Admin user created successfully:");
  console.log("  UID:", uid);
  console.log("  Email:", email);
}

createAdmin().catch((error) => {
  console.error("Failed to create admin user:", error.message);
  process.exit(1);
});
