import { transectsArray } from "./transects";
import { hoursDictionary } from "./hours";


//Data Arrays
const transects = transectsArray;
export const hours = hoursDictionary;

// Variables
const initialTransect = 17.5;
const finalTransect = 58.5;
const starTime = 20; 
const endTime = 8; 
const numTurtles = 115;

var areaAnidacion;
var duracionArribada;
var periodosMuestreo;
var sumaLongitudes;
var totalTortugas;

//Methods;

function copyArray(array) {
    return JSON.parse(JSON.stringify(array));
}

//Gets the Index from an Array by Value 
function getIndexByValue(array,value) {
    return array.indexOf(array.find(element => {
       return element[value];
    }));
}

// Returns the Value by Index
export function getValueByIndex(arr,index) {
    for (let i = 0; i < arr.length; i++) {
         for (let key in arr[i]) {
             if (key == index) {
                 return arr[i][key]
             }
         }
     }
 }

// Returns the Value from the array index
function getValueByPosition(arr,position) {
    for (let i = 0; i < arr.length; i++) {
         for (const key in arr[i]) {
             if (i == position) {
                 return arr[i][key]
             }
         }
     }
 }

//Gets an sliced array from start index to end + 1;
function getSlicedArray(array,start,end) {
    return array.slice(
        getIndexByValue(array,start),
        getIndexByValue(array,end) + 1);
}

// Returns an array of Even elements
function getEvenElements(array) {
    const even = [];
    for (let i = 0; i < array.length; i++) {
       if (i % 2 == 0) even.push(array[i]);
    }
    return even;
}

// Returns an array of Odd elements
function getOddElements(array) {
    const odd = [];
    for (let i = 0; i < array.length; i++) {
       if (i % 2 != 0) odd.push(array[i]);
    }
    return odd;
}

//calculates the Sum of all the elements in the array
function calculateSum(array) {
    let total = 0;
    for (let index = 0; index < array.length ; index++) {
        let transect = array[index];
        for (let key in array[index]) {
           total += transect[key];
        }
    }
    return total;
}

// Formulas

//Formula para calcular el Área cuando los transectos son Impares
function formulaAreaImpar(y0,yn,impares,pares,extra){
    return ((50*((y0+yn)+(4*impares)+(2*pares)))/3)+extra;
}

///Formula para calcular el Área cuando los transectos son Pares
function formulaAreaPar(y0,yn,impares,pares){
    sumaLongitudes = y0 + yn + impares + pares;
   return (50*((y0+yn)+(4*impares)+(2*pares)))/3;
}

//Formula que calcula los minutos de la sesión a partir de una hora inicial y final
function formulaDuracionArribada(horaInicial, horaFinal) {
   return formulaPeriodosMuestreo(horaInicial,horaFinal) * 120;
}

//Formula que calcula los periodos de muestreo
export function formulaPeriodosMuestreo(horaInicial, horaFinal) {
    return (((getValueByIndex(hours,horaFinal) - getValueByIndex(hours,horaInicial)) / 2) + 1)
}

function formulaAnidacionesEstimadas(areaAnidacion,duracionArribada,periodosMuestreo,sumaLongitudes,totalTortugasDesovando) {
    return ((areaAnidacion*duracionArribada)/(2*1*periodosMuestreo*sumaLongitudes))*(totalTortugasDesovando/11.4);
 }

function calculoAreaPar(array) {
    //copiar arreglo
    let arregloAuxiliar = copyArray(array);
    //guardar primer y último elemento
    const y0 = getValueByPosition(arregloAuxiliar,0);
    const yn = getValueByPosition(arregloAuxiliar, arregloAuxiliar.length - 1);
    //quitar primer y último elemento
    arregloAuxiliar.shift();
    arregloAuxiliar.pop();
    //arreglo pares
    const sumaPares = calculateSum(getEvenElements(arregloAuxiliar));
    const sumaImpares = calculateSum(getOddElements(arregloAuxiliar));
    //Suma Longitudes
    sumaLongitudes = Math.round((y0 + yn + sumaImpares + sumaPares)*100)/100;
    //Resultado Area
   return Math.round(formulaAreaPar(y0,yn,sumaPares,sumaImpares)*100)/100;
}

function calculoAreaImpar(array) {
    //Copiar Arreglo
    const arregloAuxiliar = copyArray(array);
    //Guardar y quitar primer elemento
    const primerElemento = getValueByPosition(arregloAuxiliar,0);
    arregloAuxiliar.shift();
    //Guardar nuevo primer elemento y último
    const y0 = getValueByPosition(arregloAuxiliar,0);
    const yn = getValueByPosition(arregloAuxiliar, arregloAuxiliar.length - 1);
    //quitar nuevo y último elemento
    arregloAuxiliar.shift();
    arregloAuxiliar.pop();
    //Suma Pares
    const sumaPares = calculateSum(getEvenElements(arregloAuxiliar));
    //Suma Impares
    const sumaImpares = calculateSum(getOddElements(arregloAuxiliar));
    //Calcular Extra
    const areaExtra = ((primerElemento + y0) / 2) *50;
    //Suma Longitudes
    sumaLongitudes = Math.round((y0 + yn + sumaImpares + sumaPares + primerElemento)*100)/100;
    return Math.round(formulaAreaImpar(y0,yn,sumaPares,sumaImpares,areaExtra)*100)/100;
}

// ************************************************************
// METODO MAIN;

export function main(transectoInicial,transectoFinal,horaInicial,horaFinal,numeroTortugas) {

    const nuevosTransectos = getSlicedArray(transects,transectoInicial,transectoFinal);
    duracionArribada = formulaDuracionArribada(horaInicial,horaFinal);
    periodosMuestreo = formulaPeriodosMuestreo(horaInicial,horaFinal);


    if(nuevosTransectos.length % 2 == 0){
        //FORMULA PAR
        areaAnidacion = calculoAreaPar(nuevosTransectos);
        
    }
    else {
        //FORMULA IMPAR
        areaAnidacion = calculoAreaImpar(nuevosTransectos);
    }

    totalTortugas = Math.round(formulaAnidacionesEstimadas(areaAnidacion,duracionArribada,periodosMuestreo,sumaLongitudes,numeroTortugas));

    //Resultados
    // console.log("Area de anidación: ", areaAnidacion);
    // console.log("Duración de la arribada: ", duracionArribada);
    // console.log("Número de periodos muestreo: ", periodosMuestreo);
    // console.log("Suma de longitudes de muestreo: ", sumaLongitudes);
    // console.log("Total de tortugas desovando: ", totalTortugas);

}

//Getters

export function getAreaAnidacion() {return areaAnidacion}
export function getDuracionArribada() {return duracionArribada}
export function getPeriodosMuestreo() {return periodosMuestreo}
export function getSumaLongitudes() {return sumaLongitudes}
export function getTotalTortugas() {return totalTortugas}