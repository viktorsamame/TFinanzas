import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqAL1391tXkK8dTBlR0CSRgaAg9Cv8A7k",
  authDomain: "impera-finanzas.firebaseapp.com",
  projectId: "impera-finanzas",
  storageBucket: "impera-finanzas.appspot.com",
  messagingSenderId: "306365676217",
  appId: "1:306365676217:web:872b391e9c31c524ff3968"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();