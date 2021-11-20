import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js';
import { auth, db} from './firebaseConfig.js'

//fd, fp y fe
const te = document.querySelector('#rxh__tasaEfectiva');
const fd = document.querySelector('#rxh__fechaDescuento');
const fp = document.querySelector('#rxh__fechaPago');
const tr = document.querySelector('#rxh__totalRecibir');
const coste = document.querySelector('#rxh__valor');
const btnCoste = document.querySelector('#agregarCoste');
const inputCostes = document.querySelector('#rxh__valorCostes');
const costeFin = document.querySelector('#rxh__valorFin');
const btnCosteFin = document.querySelector('#agregarCosteFin');
const inputCostesFin = document.querySelector('#rxh__valorCostesFin');
const form = document.querySelector('#form1');
let costes = [];
let valorCoste = 0;
let costesFin = [];
let valorCosteFin = 0;

btnCoste.addEventListener('click', sumarCoste)

function sumarCoste() {
    costes = [parseFloat(coste.value), ...costes];
    let sumCostes = costes.reduce((a, b) => a + b);
    inputCostes.placeholder = sumCostes;
    inputCostes.value = sumCostes;
    valorCoste = inputCostes.value;
    console.log(valorCoste);
    return valorCoste;
}

form.addEventListener('submit', async (e)=> {
    
    e.preventDefault();
    var resultados =  Number(capturarDatos());
    var algo = 0
    auth.onAuthStateChanged( async (user) => {
        if (user) {
            await addDoc(collection(db, "resultados-recibo"),{
                    TCEA: resultados,
                ND: algo,
                userId: user.uid
            });
            window.location.replace("menu.html");
        } else {
            console.log("No hay user")
        }
      });
})
btnCosteFin.addEventListener('click', sumarCosteFin)

function sumarCosteFin() {
    costesFin = [parseFloat(costeFin.value), ...costesFin];
    let sumCostesFin = costesFin.reduce((a, b) => a + b);
    inputCostesFin.placeholder = sumCostesFin;
    inputCostesFin.value = sumCostesFin;
    valorCosteFin = inputCostesFin.value;
    console.log(valorCosteFin);
    return valorCosteFin;
}

function capturarDatos() {
    return primerCal(fp.value,parseFloat(te.value), fd.value);
}

function primerCal(fp, te, fd) {
    let fechafp = new Date(fp);
    let fechafd = new Date(fd);
    let restafecha = fechafd.getTime() - fechafp.getTime();
    let diasRe = Math.round(restafecha / (1000 * 60 * 60 * 24));
    let tep = 0;
    let tepAlEjercicio = 0;
    tep = (((Math.pow(1 + (te / 100), diasRe / 360)) - 1) * 100)*-1;
    tepAlEjercicio = (tep.toFixed(9))*-1;
    console.log(`Resultado 1: ${tep}`);
    console.log(`Tasa descontada: ${tepAlEjercicio}`);
    return segundoCal(tep);
}

function segundoCal(tep) {
    let dN = 0;
    let dNAlEjercicio = 0;
    dN = (((tep / 100) / (1 + (tep / 100))) * 100)*-1;
    dNAlEjercicio = (dN.toFixed(9))*-1;
    console.log(`Resultado 2: ${dN}`);
    console.log(`TEP: ${dNAlEjercicio}`);
    return tercerCal(tep);
}

function tercerCal(tep) {
    let descuento = 0;
    descuento = Math.round((parseFloat(tr.value) * (tep / 100)) * 100) / 100;
    console.log(`Descuento: ${descuento}`);
    return cuartoCal(descuento);
}

function cuartoCal(descuento) {
    let valorNeto = 0;
    valorNeto = parseFloat(tr.value) - descuento;
    console.log(`Valor Neto: ${valorNeto}`);
    return quintoCal(valorNeto);
}

function quintoCal(valorNeto) {
    let valorRecibido = 0;
    let valorEntregado = 0; //aqui esta el sexto paso
    valorRecibido = Math.round((valorNeto - parseFloat(valorCoste)) * 100) / 100;
    valorEntregado = Math.round((parseFloat(tr.value) + parseFloat(valorCosteFin)) * 100) / 100; //aqui esta el sexto paso
    console.log(`Valor-Entregado: ${parseFloat(valorEntregado)} Valor-Recibido: ${parseFloat(valorRecibido)},  `);
    return septimoPaso(parseFloat(valorEntregado), parseFloat(valorRecibido));
}

function septimoPaso(valorEntregado, valorRecibido) {
    let fechafpFin = new Date(fp.value);
    let fechafdFin = new Date(fd.value);
    let restafechaFin = fechafdFin.getTime() - fechafpFin.getTime();
    let diasReFin = Math.round(restafechaFin / (1000 * 60 * 60 * 24));
    let tcea = 0;
    let arriba = ((360 / diasReFin))*-1;
    let abajo = valorEntregado / valorRecibido;
    let tceaAlEjercicio = 0; //PARA DARLE LA RESPUESTA AL EJERCICIO
    /* tcea = valorEntregado / valorRecibido */
    tcea = ((Math.pow(abajo, arriba)) - 1) * 100;
    return tceaAlEjercicio = tcea.toFixed(8);
    console.log(`Arriba: ${arriba}  Abajo: ${abajo}`);
    console.log(`Resultado 7: ${tcea}`);
    console.log(`TCEA: ${tceaAlEjercicio}`);
    console.log(tcea);
}
