import { signOut} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js';
import { auth, db} from './firebaseConfig.js'

const logout = document.querySelector('#logout')

logout.addEventListener('click', e =>{

    signOut(auth).then(() => {
        window.location.replace("login.html");
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
          <p> (TEA) Tasa Efectiva Anual (sin costes): ${recibo.tasaEfectivaSinCostes} <p>
          <p> (ND) Número de dias transcurridos: ${recibo.ND} <p>
          <p> (TE) Tasa Efectiva: ${recibo.tasaEfectivaPeriodo} <p>
          <p> (d) Tasa Descontada: ${recibo.tasaDescontada} <p>
          <p> (D) Descuento: ${recibo.descuento} <p>
          <p> (Rt) Retención: ${recibo.retencion} <p>
          <p> (CI) Costes Iniciales Totales: ${recibo.costesIniciales} <p>
          <p> (VNet) Valor Neto: ${recibo.valorNeto} <p>
          <p> (VR) Valor Total a Recibir: ${recibo.valorRecibido} <p>
          <p> (CF) Costes Finales Totales: ${recibo.costesFinales} <p>
          <p> (VE) Valor Total a Entregar: ${recibo.valorEntregado} <p>
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


