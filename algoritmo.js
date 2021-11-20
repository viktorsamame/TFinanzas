import { signOut} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js';
import { auth, db} from './firebaseConfig.js'

const logout = document.querySelector('#logout')

logout.addEventListener('click', e =>{

    signOut(auth).then(() => {
        window.location.replace("index.html");
    })
})

const add = document.querySelector('#add')

add.addEventListener('click', e =>{

    window.location.replace("rxh.html");
})

//Recibos
const recibosList = document.querySelector('#recibos')

const setupDocs = data =>{
  if (data.length){
    let html = '';
    data.forEach(doc => {
      const recibo = doc.data()
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

auth.onAuthStateChanged( async (user) => {
    if (user) {

      const q = query(collection(db, "resultados-recibo"), where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q);
      setupDocs(querySnapshot.docs)

    } else {
      setupDocs([])
    }
  });


