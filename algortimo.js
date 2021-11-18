import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import { getAuth, signOut} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js';

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
const db = getFirestore();

const logout = document.querySelector('#logout')

logout.addEventListener('click', e =>{

    signOut(auth).then(() => {
        window.location.replace("index.html");
    })
})

const add = document.querySelector('#add')

add.addEventListener('click', e =>{

  signOut(auth).then(() => {
      window.location.replace("rxh.html");
  })
})

//Recibos
const recibosList = document.querySelector('#recibos')

const querySnapshot = await getDocs(collection(db, "resultados-recibo"));

const setupDocs = data =>{
  if (data.length){
    let html = '';
    data.forEach(doc => {
      const recibo = doc.data()
      console.log(recibo)
      const li = `
        <li class = "list-group-item list-group-item-action">
          <h5> (TCEA) Tasa de Coste Efectiva Anual: ${recibo.TCEA} </h5>
          <p> (ND) Número de dias transcurridos: ${recibo.ND} <p>
        </li>
      `;
      html += li;
    });
    recibosList.innerHTML = html
  } else {
    recibosList.innerHTML = '<p class="text-center">No hay nada</p>'
  }
}

auth.onAuthStateChanged((user) => {
    if (user) {
      setupDocs(querySnapshot.docs)
    } else {
      setupDocs([])
    }
  });


