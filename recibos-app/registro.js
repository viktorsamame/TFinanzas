import { createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';
import { setDoc, collection, doc } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js';
import { auth, db} from './firebaseConfig.js'

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
    .then(async (userCredential) => {

        await setDoc(doc(collection(db, "users"), userCredential.user.uid), {
          name: username,
          lastname: lastname,
          dni: dni
        });
        
        console.log('sign')
        window.location.replace("login.html");
        // clear the form
        signUpForm.reset();
    })

})
