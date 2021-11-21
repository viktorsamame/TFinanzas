import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';
import { auth} from './firebaseConfig.js'

const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    const email = document.querySelector('#login__username').value;
    const password = document.querySelector('#login__password').value;

     // Authenticate the User
     signInWithEmailAndPassword(auth, email, password)
     .then((userCredential) => {
         console.log('login')
         window.location.replace("menu.html");
         // clear the form
         signUpForm.reset();
     });
 
})

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("signin");
  } else {
    console.log("signout");
  }
});