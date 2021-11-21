import { signOut} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js';
import { auth, db} from './firebaseConfig.js'

//fd, fp y fe
const te = document.querySelector('#rxh__tasaEfectiva');
const fd = document.querySelector('#rxh__fechaDescuento');
const fp = document.querySelector('#rxh__fechaPago');
const tr = document.querySelector('#rxh__totalRecibir');
const retencion = document.querySelector('#rxh__retencion');
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

const ret = document.querySelector('#return')

ret.addEventListener('click', e =>{

    window.location.replace("menu.html");
})

const logout = document.querySelector('#logout')

logout.addEventListener('click', e =>{

    signOut(auth).then(() => {
        window.location.replace("login.html");
    })
})

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

var tasaDescontada;
var tasaEfectivaPeriodo;
var descuento;
var valorNeto;
var valorEntregado;
var valorRecibido;
var diasTranscurridos;
var valorNominal;
var costesIniciales;
var costesFinales;

form.addEventListener('submit', async (e)=> {
    
    e.preventDefault();
    var resultados =  Number(capturarDatos());
    auth.onAuthStateChanged( async (user) => {
        if (user) {
            await addDoc(collection(db, "resultados-recibo"),{
                TCEA: resultados,
                ND: diasTranscurridos,
                tasaDescontada: tasaDescontada,
                tasaEfectivaPeriodo: Number(tasaEfectivaPeriodo),
                descuento: descuento,
                valorNeto: valorNeto,
                valorEntregado: valorEntregado,
                valorRecibido: valorRecibido,
                valorNominal: valorNominal,
                costesIniciales: costesIniciales,
                costesFinales: costesFinales,
                retencion: Number(retencion.value),
                userId: user.uid
            });
            window.location.replace("menu.html");
        } else {
            console.log("No hay user")
        }
      });
})


function capturarDatos() {
    return primerCal(fp.value,parseFloat(te.value), fd.value);
}

function primerCal(fp, te, fd) {
    let fechafp = new Date(fp);
    let fechafd = new Date(fd);
    let resta = fechafd.getTime() - fechafp.getTime();
    diasTranscurridos = (Math.round(resta / (1000 * 60 * 60 * 24)))*-1;
    let tep = 0;
    tep = ((Math.pow(1 + (te / 100), diasTranscurridos / 360)) - 1) * 100;
    tasaEfectivaPeriodo = tep.toFixed(9);
    console.log(`Resultado 1: ${tep}`);
    console.log(`Tasa descontada: ${tasaEfectivaPeriodo}`);
    return segundoCal(tasaEfectivaPeriodo);
}

function segundoCal(tep) {
    let dN = 0;
    dN = (((tep / 100) / (1 + (tep / 100))) * 100)*-1;
    tasaDescontada = (dN.toFixed(9))*-1;
    console.log(`Resultado 2: ${dN}`);
    console.log(`TEP: ${tasaDescontada}`);
    return tercerCal(tasaDescontada);
}

function tercerCal(tep) {
    descuento = Math.round((parseFloat(tr.value) * (tep / 100)) * 100) / 100;
    valorNominal = parseFloat(tr.value);
    console.log(`Descuento: ${descuento}`);
    return cuartoCal(descuento);
}

function cuartoCal(descuento) {
    valorNeto = parseFloat(tr.value) - descuento;
    console.log(`Valor Neto: ${valorNeto}`);
    return quintoCal(valorNeto, Number(retencion.value));
}

function quintoCal(valorNeto, retencion) {
    valorRecibido = Math.round((valorNeto - parseFloat(valorCoste)) * 100) / 100;
    valorRecibido -= retencion;
    costesIniciales = parseFloat(valorCoste);
    valorEntregado = Math.round((parseFloat(tr.value) + parseFloat(valorCosteFin)) * 100) / 100; //aqui esta el sexto paso
    valorEntregado -= retencion;
    costesFinales = parseFloat(valorCosteFin);
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
    let tceaAlEjercicio = 0; 
    tcea = ((Math.pow(abajo, arriba)) - 1) * 100;
    return tceaAlEjercicio = tcea.toFixed(8);
}
