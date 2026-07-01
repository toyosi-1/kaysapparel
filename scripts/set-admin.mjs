import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleAuth } from 'google-auth-library';

// Use Firebase CLI's cached credentials via ADC
process.env.GOOGLE_CLOUD_PROJECT = 'kaysapparel-3250f';

initializeApp({ projectId: 'kaysapparel-3250f' });

const db = getFirestore();

const uid = 'p8lEeAG1rIahkToVDIUygrzkU702'; // kays.apparel@gmail.com

try {
  await db.collection('users').doc(uid).set({ isAdmin: true }, { merge: true });
  console.log('✅ isAdmin: true successfully set for kays.apparel@gmail.com');
} catch (e) {
  console.error('❌ Error:', e.message);
}
process.exit(0);
