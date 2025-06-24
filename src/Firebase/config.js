import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCH5fQBFHEKsYM6JwSTPcGNytv1lznpJP4",
  authDomain: "chargingstationdashboard.firebaseapp.com",
  projectId: "chargingstationdashboard",
  storageBucket: "chargingstationdashboard.firebasestorage.app",
  messagingSenderId: "282963370411",
  appId: "1:282963370411:web:311a543242a332057232ee"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);