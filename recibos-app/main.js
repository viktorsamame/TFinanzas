import { signOut} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js';
import { auth, db} from './firebaseConfig.js'

//fd, fp y fe
const te = document.querySelector('#rxh__tasaEfectiva');
const fd = document.querySelector('#rxh__fechaDescuento');
const fp = document.querySelector('#rxh__fechaPago');
const tr = document.querySelector('#rxh__totalRecibir');
const plazoTasa = document.querySelector('#rxh__plazo');
const retencion = document.querySelector('#rxh__retencion');
const coste = document.querySelector('#rxh__valor');
const btnCoste = document.querySelector('#agregarCoste');
const inputCostes = document.querySelector('#rxh__valorCostes');
const costeFin = document.querySelector('#rxh__valorFin');
const btnCosteFin = document.querySelector('#agregarCosteFin');
const inputCostesFin = document.querySelector('#rxh__valorCostesFin');
const diasAnio = document.querySelector('#diasXanio');
const eleccionPlazo = document.querySelector('#cars');
const form = document.querySelector('#form1');
var tasaNominal = false;
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

const tipoTasa = document.querySelector('#tasaNominal')

tipoTasa.addEventListener('click', e =>{

    if(tasaNominal){
        document.getElementById("tasaNominal").innerHTML = "Cambiar a Tasa Nominal";
        document.getElementById("rxh__tasaEfectiva").placeholder = "Tasa Efectiva %";
        document.getElementById("label__tasaEfectiva").innerHTML = "TE";
        tasaNominal = false;
    } else {
        document.getElementById("tasaNominal").innerHTML = "Cambiar a Tasa Efectiva";
        document.getElementById("rxh__tasaEfectiva").placeholder = "Tasa Nominal %";
        document.getElementById("label__tasaEfectiva").innerHTML = "TN";
        tasaNominal = true;
    }
    console.log(plazoTasa.value)
    console.log(diasAnio.value)
})

diasAnio.addEventListener('change', e =>{

    if(diasAnio.value == 360){
        document.getElementById("rxh__diasXanio").value = 360;
    }
    if(diasAnio.value == 365){
        document.getElementById("rxh__diasXanio").value = 365;
    }

})

eleccionPlazo.addEventListener('change', e =>{

    if(eleccionPlazo.value == 'anual'){
        document.getElementById("rxh__plazo").value = diasAnio.value;
    }
    if(eleccionPlazo.value == 'semestral'){
        document.getElementById("rxh__plazo").value = 180;
    }
    if(eleccionPlazo.value == 'cuatrimestral'){
        document.getElementById("rxh__plazo").value = 120;
    }
    if(eleccionPlazo.value == 'trimestral'){
        document.getElementById("rxh__plazo").value = 90;
    }
    if(eleccionPlazo.value == 'bimestral'){
        document.getElementById("rxh__plazo").value = 60;
    }
    if(eleccionPlazo.value == 'mensual'){
        document.getElementById("rxh__plazo").value = 30;
    }
    if(eleccionPlazo.value == 'quincenal'){
        document.getElementById("rxh__plazo").value = 15;
    }
    if(eleccionPlazo.value == 'diario'){
        document.getElementById("rxh__plazo").value = 1;
    }
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
var tasaEfectivaSinCostes;

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
                tasaEfectivaSinCostes: Number(tasaEfectivaSinCostes),
                userId: user.uid
            });
            window.location.replace("menu.html");
        } else {
            console.log("No hay user")
        }
      });
})

function convertirTN(TN, d){
    
    let tep = 0;
    tep = ((Math.pow(1 + ((TN/100) / d), diasAnio.value)) - 1)*100;
    return tep
}

function modificarPlazo(TE, d){
    let tep = 0;
    tep = ((Math.pow((1+(TE/100)),(diasAnio.value/d)))-1)*100;
    return tep
}

function capturarDatos() {
    let TE = 0;
    if(tasaNominal){
        TE = convertirTN(parseFloat(te.value), parseFloat(plazoTasa.value));
        tasaEfectivaSinCostes = TE;
        return primerCal(fp.value, TE , fd.value);
    } else {
        if(plazoTasa.value != diasAnio.value){
            TE = modificarPlazo(parseFloat(te.value), parseFloat(plazoTasa.value));
        }
        tasaEfectivaSinCostes = TE;
        return primerCal(fp.value, TE, fd.value);
    }
}

function primerCal(fp, te, fd) {
    let fechafp = new Date(fp);
    let fechafd = new Date(fd);
    let resta = fechafd.getTime() - fechafp.getTime();
    diasTranscurridos = (Math.round(resta / (1000 * 60 * 60 * 24)))*-1;
    let tep = 0;
    tep = ((Math.pow(1 + (te / 100), diasTranscurridos / diasAnio.value)) - 1) * 100;
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
    let arriba = ((diasAnio.value / diasReFin))*-1;
    let abajo = valorEntregado / valorRecibido;
    let tceaAlEjercicio = 0; 
    tcea = ((Math.pow(abajo, arriba)) - 1) * 100;
    return tceaAlEjercicio = tcea.toFixed(8);
}
