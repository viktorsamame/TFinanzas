import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';
import { } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js';

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const username = document.querySelector('#login__name').value;
    const lastname = document.querySelector('#login__lastname').value;
    const dni = document.querySelector('#login__dni').value;
    const email = document.querySelector('#login__email').value;
    const password = document.querySelector('#login__password').value;

     // Authenticate the User
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        console.log('sign')
        window.location.replace("index.html");
        // clear the form
        signUpForm.reset();
    });


})
