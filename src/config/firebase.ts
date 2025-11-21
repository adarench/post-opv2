import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  projectId: 'postopv2-defb6',
  authDomain: 'postopv2-defb6.firebaseapp.com',
  storageBucket: 'postopv2-defb6.appspot.com',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
