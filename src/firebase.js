// ==========================================
// FIREBASE CONFIG
// FILE: firebase.js
// ==========================================

import {
  initializeApp,
} from 'firebase/app';

import {
  getAuth,
} from 'firebase/auth';

import {
  getFirestore,
} from 'firebase/firestore';

const firebaseConfig = {

  apiKey:
    "AIzaSyADKEuZMmobcO1Z1TkRmvD-LUkp89La-5c",

  authDomain:
    "aigym26.firebaseapp.com",

  projectId:
    "aigym26",

  storageBucket:
    "aigym26.appspot.com",

  messagingSenderId:
    "894882190752",

  appId:
    "1:894882190752:web:bdaa7e5c688092d76480c5",

};
const app =
  initializeApp(
    firebaseConfig
  );

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);