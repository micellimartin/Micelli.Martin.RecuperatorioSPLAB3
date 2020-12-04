import Anuncio_Mascota from '../js/entidades/anuncioMascota.js';

import {
    actualizarTabla
} from '../js/entidades/tabla.js';

let listaEntidades;
let frmEntidad;
let proximoId;
let tabla;

window.addEventListener("load", incializarManejadores);
btnAlta.addEventListener('click', altaAnuncio);
btnEliminar.addEventListener('click', bajaAnuncio);
btnModificar.addEventListener('click', modificarAnuncio);
btnCancelar.addEventListener('click', cancelar);
cmbAnimal.addEventListener('change', filtrarPorAnimal);

//Obtengo todos los checkboxes que se usan para filtrar la tabla por columnas
let checkBoxes = document.querySelectorAll( '.checkBoxInput' );

//A cada uno de ellos le asigno el mismo manejador de evento
checkBoxes.forEach(item => {
    item.addEventListener('change', filtrarPorColumnas);
})

async function incializarManejadores() 
{
    let listaEntidades = await obtenerAnunciosXhr();

    tabla = document.getElementById("divTabla");
    actualizarTabla(tabla, listaEntidades);

    frmEntidad = document.forms[0];
    frmEntidad.addEventListener("submit", e => {
        e.preventDefault();
    })
}

function obtenerAnuncio() 
{
    let nuevoAnuncio = null;

    if (!(document.querySelector("#txtTitulo").value == "") && !(document.querySelector("#txtDescripcion").value == "") && !(document.querySelector("#txtPrecio").value == "")
        && !(document.getElementById("txtRaza").value == "") && !(document.getElementById("txtFechaNacimiento").value == "") && !(document.getElementById("cmb").value == "")) {
        nuevoAnuncio = new Anuncio_Mascota(proximoId,
            document.querySelector("#txtTitulo").value,
            document.querySelector("#txtDescripcion").value,
            document.querySelector("#txtPrecio").value,
            frmEntidad.animal.value,
            document.getElementById("txtRaza").value,
            document.getElementById("txtFechaNacimiento").value,
            document.getElementById("cmb").value);
    }
    else {
        alert("Debe completar todos los campos para dar de alta un anuncio");
    }

    return nuevoAnuncio;
}

function cancelar() 
{
    document.getElementById("btnAlta").style.display = "block";
    document.getElementById("btnModificar").style.display = "none";
    document.getElementById("btnEliminar").style.display = "none";
    document.getElementById("btnCancelar").style.display = "none";

    document.forms[0].reset();
}

function obtenerAnunciosXhr() 
{
    return new Promise((resolve, reject) => {
        //Objeto que contiene la informacion de la peticion
        const xhr = new XMLHttpRequest();
        let datos;

        //Se dispara cada vez que cambia el estado de la peticion
        xhr.addEventListener('readystatechange', () => {
            //readyState = 4 : DONE	The operation is complete.
            if (xhr.readyState == 4) {
                //Status de la peticion: Successful responses (200–299), ->status text = okay
                if (xhr.status >= 200 && xhr.status < 300) {
                    //Capturo la respuesta del servidor y la paso de string a json
                    datos = JSON.parse(xhr.responseText);

                    //Instancio los anuncios de mascotas
                    const anuncios_mascotas = [];

                    //Cada elemento es un objeto json
                    datos.forEach(element => {
                        const nuevo_anuncio = new Anuncio_Mascota
                            (
                                element.id,
                                element.titulo,
                                element.descripcion,
                                element.precio,
                                element.animal,
                                element.raza,
                                element.fechaNacimiento,
                                element.vacuna
                            );
                        anuncios_mascotas.push(nuevo_anuncio);
                    });

                    //Retorno la promesa cumplida y con el array de anuncios
                    //returns a Promise object that is resolved with a given value
                    resolve(anuncios_mascotas);
                }
                else {
                    let mensaje = xhr.statusText || "Se produjo un ERROR";
                    //Retorno la promesa rechazada
                    reject({ status: xhr.status, statusText: mensaje });
                }
            }
        });

        //Declaro una peticion de tipo get para obtener todos los anuncios
        xhr.open('GET', "http://localhost:3000/anuncios");

        //Envio la peticion
        xhr.send();
    })
}

async function altaAnuncio() 
{
    let resultado = await altaAnuncioXhr();
}

function altaAnuncioXhr() 
{
    const nuevoAnuncio = obtenerAnuncio();

    if (nuevoAnuncio != null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        let datos = JSON.parse(xhr.responseText);

                        //Retorno la promesa cumplida y con la respuesta del servidor
                        //returns a Promise object that is resolved with a given value
                        resolve(datos);
                    }
                    else {
                        let mensaje = xhr.statusText || "Se produjo un error";
                        //Retorno la promesa rechazada
                        reject({ status: xhr.status, statusText: mensaje });
                    }
                }
            });

            xhr.open("POST", "http://localhost:3000/anuncios");

            //Le paso tipo de contenido
            xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");

            //Le mando la info a transmitir, el anuncio en texto dentro de un json
            xhr.send(JSON.stringify(nuevoAnuncio));
        });
    }
}

async function bajaAnuncio() 
{
    //valido que no haya columnas filtradas
    let columnasOk = true;

    checkBoxes.forEach(element => {
        if(!element.checked)
        {
            columnasOk = false;
        }
    });
    
    if(columnasOk)
    {
        let resultado = await bajaAnuncioXhr();
    }
    else
    {
        alert("Para eliminar un anuncio remueva todos los filtros de columnas");
        cancelar();
    } 
}

function bajaAnuncioXhr() 
{
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let datos = JSON.parse(xhr.responseText);

                    resolve(datos);
                }
                else {
                    let mensaje = xhr.statusText || "Se produjo un error";
                    //Retorno la promesa rechazada
                    reject({ status: xhr.status, statusText: mensaje });
                }
            }
        });

        xhr.open("DELETE", "http://localhost:3000/anuncios/" + localStorage.getItem("idSeleccionado"));

        //Le paso tipo de contenido
        xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");

        xhr.send();
    })
}

async function modificarAnuncio() 
{
    //valido que no haya columnas filtradas
    let columnasOk = true;

    checkBoxes.forEach(element => {
        if(!element.checked)
        {
            columnasOk = false;
        }
    });

    if(columnasOk)
    {
        let resultado = await modificarAnuncioXhr();
    }
    else
    {
        alert("Para modificar un anuncio remueva todos los filtros de columnas");
        cancelar();
    }
}

function modificarAnuncioXhr() 
{
    let id = localStorage.getItem("idSeleccionado");

    const anuncioModificado = obtenerAnuncio();

    if (anuncioModificado !== null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        let datos = JSON.parse(xhr.responseText);
                        resolve(datos);
                    }
                    else {
                        let mensaje = xhr.statusText || "Se produjo un error";
                        //Retorno la promesa rechazada
                        reject({ status: xhr.status, statusText: mensaje });
                    }
                }
            });

            xhr.open("PUT", "http://localhost:3000/anuncios/" + id);

            xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");

            xhr.send(JSON.stringify(anuncioModificado));
        })
    }
}

async function filtrarPorAnimal() 
{
    if(cmbAnimal.value == "perro") 
    {
        //Filtro tabla
        listaEntidades = await obtenerAnunciosXhr();

        const anunciosPerro = listaEntidades.filter(anuncio => {
            return anuncio.animal === "perro";
        })

        actualizarTabla(tabla, anunciosPerro);

        //Obtengo los precios de todos los anuncios de perro
        const preciosPerro = anunciosPerro.map((anuncioPerro) => {
            //Convierto de string numero
            return parseFloat(anuncioPerro.precio);
        })

        //Obtengo la sumatoria de todos los precios de anuncios de perros
        let sumatoriaPreciosPerro = preciosPerro.reduce((prev, actual) => {
            return prev + actual;
        });

        //Obtengo el promedio de todos los precios de anuncios de perro
        let promedioPreciosPerro = sumatoriaPreciosPerro / preciosPerro.length;

        //Obtengo el maximo de los precios de anuncios perro
        let precioMaximo = encontrarMaximo(preciosPerro);

        //Obtengo el minimo de los precios de anuncios perro
        let precioMinimo = encontrarMinimo(preciosPerro);

        //Muestro el promedio
        document.querySelector("#txtPrecioPromedio").value = promedioPreciosPerro;
        
        //Muestro el maximo
        document.querySelector("#txtPrecioMaximo").value = precioMaximo;

        //Muestro el minimo
        document.querySelector("#txtPrecioMinimo").value = precioMinimo;

        //Obtengo porcentaje vacunados
        let porcentajeVacunados = encontrarPorcentajeVacunados(anunciosPerro);

        //Muestro porcentaje vacunados
        document.querySelector("#txtPrecioPorctenjaVacunados").value = porcentajeVacunados;
    }

    if(cmbAnimal.value == "gato") 
    {
        listaEntidades = await obtenerAnunciosXhr();

        const anunciosGato = listaEntidades.filter(anuncio => {
            //Triple = valida que sean del mismo tipo y mismo valor
            return anuncio.animal === "gato";
        })

        actualizarTabla(tabla, anunciosGato);

        //Obtengo los precios de todos los anuncios de gatos
        const preciosGato = anunciosGato.map((anuncioGato) => {
            //Convierto de string numero
            return parseFloat(anuncioGato.precio);
        })

        //Obtengo la sumatoria de todos los precios de anuncios de gatos
        let sumatoriaPreciosGato = preciosGato.reduce((prev, actual) => {
            return prev + actual;
        });

        //Obtengo el promedio de todos los precios de anuncios de gato
        let promedioPreciosGato = sumatoriaPreciosGato / preciosGato.length;

        //Muestro el promedio
        document.querySelector("#txtPrecioPromedio").value = promedioPreciosGato;

        //Obtengo el maximo de los precios de anuncios gato
        let precioMaximo = encontrarMaximo(preciosGato);

        //Obtengo el minimo de los precios de anuncios gato
        let precioMinimo = encontrarMinimo(preciosGato);

        //Muestro el maximo
        document.querySelector("#txtPrecioMaximo").value = precioMaximo;

        //Muestro el minimo
        document.querySelector("#txtPrecioMinimo").value = precioMinimo;

        //Obtengo porcentaje vacunados
        let porcentajeVacunados = encontrarPorcentajeVacunados(anunciosGato);

        //Muestro porcentaje vacunados
        document.querySelector("#txtPrecioPorctenjaVacunados").value = porcentajeVacunados;
    }

    if(cmbAnimal.value == "todos") 
    {
        let anunciosTodos = await obtenerAnunciosXhr();

        actualizarTabla(tabla, anunciosTodos);
        
        //Obtengo los precios de todos los anuncios
        const preciosTodos = anunciosTodos.map((anuncio) => {
        //Convierto de string numero
        return parseFloat(anuncio.precio);
        })
        
        //Obtengo la sumatoria de todos los precios de anuncios
        let sumatoriaPreciosTodos = preciosTodos.reduce((prev, actual) => {
        return prev + actual;
        });
        
        //Obtengo el promedio de todos los precios de anuncios
        let promedioPreciosTodos = sumatoriaPreciosTodos / preciosTodos.length;
        
        //Muestro el promedio
        document.querySelector("#txtPrecioPromedio").value = promedioPreciosTodos;

        //Obtengo el maximo de los precios de anuncios
        let precioMaximo = encontrarMaximo(preciosTodos);

        //Obtengo el minimo de los precios de anuncios
        let precioMinimo = encontrarMinimo(preciosTodos);

        //Muestro el maximo
        document.querySelector("#txtPrecioMaximo").value = precioMaximo;

        //Muestro el minimo
        document.querySelector("#txtPrecioMinimo").value = precioMinimo;

        //Obtengo porcentaje vacunados
        let porcentajeVacunados = encontrarPorcentajeVacunados(anunciosTodos);

        //Muestro porcentaje vacunados
        document.querySelector("#txtPrecioPorctenjaVacunados").value = porcentajeVacunados;
    }
}

function encontrarMaximo(array)
{
    const maximo = array.reduce(function(prev, actual) 
    {
        return (prev > actual) ? prev : actual
    })

    return maximo;
}

function encontrarMinimo(array)
{
    const maximo = array.reduce(function(prev, actual) 
    {
        return (prev < actual) ? prev : actual
    })

    return maximo;
}

function encontrarPorcentajeVacunados(anuncios)
{
    let totalAnimales = anuncios.length;

    const vacunados = anuncios.filter(anuncio =>{
        return anuncio.vacuna === "Si";
    })

    let totalVacunados = vacunados.length;

    return porcentaje(totalVacunados, totalAnimales);
}

function porcentaje(valorParcial, valorTotal) 
{
    return (100 * valorParcial) / valorTotal;
} 

async function filtrarPorColumnas()
{
    const columnasChequeadas = [];

    console.clear();
    checkBoxes.forEach(element => {
        if(element.checked)
        {
            columnasChequeadas.push(element.value)
        }
    });

    listaEntidades = await obtenerAnunciosXhr();

    const arrayGenerico = [];

    listaEntidades.forEach(anuncioMascota => {
        
        let anuncioFiltrado = new Object();
        anuncioFiltrado.id = anuncioMascota.id;

        for(let i=0; i<columnasChequeadas.length; i++)
        {   
            if(columnasChequeadas[i] == "titulo")
            {
                anuncioFiltrado.titulo = anuncioMascota.titulo;
            }

            if(columnasChequeadas[i] == "transaccion")
            {
                anuncioFiltrado.transaccion = anuncioMascota.transaccion;
            }

            if(columnasChequeadas[i] == "descripcion")
            {
                anuncioFiltrado.descripcion = anuncioMascota.descripcion;
            }

            if(columnasChequeadas[i] == "precio")
            {
                anuncioFiltrado.precio = anuncioMascota.precio;
            }

            if(columnasChequeadas[i] == "animal")
            {
                anuncioFiltrado.animal = anuncioMascota.animal;
            }

            if(columnasChequeadas[i] == "raza")
            {
                anuncioFiltrado.raza = anuncioMascota.raza;
            }

            if(columnasChequeadas[i] == "fechaNacimiento")
            {
                anuncioFiltrado.fechaNacimiento = anuncioMascota.fechaNacimiento;
            }

            if(columnasChequeadas[i] == "vacuna")
            {
                anuncioFiltrado.vacuna = anuncioMascota.vacuna;
            }

            arrayGenerico.push(anuncioFiltrado);
        }
    });

    //Remuevo repeticiones
    let miSet = new Set(arrayGenerico);
    //Transforme el set a un array que se puede recorrer con foreach
    let noRepetidos = [...miSet];

    console.clear();
    console.log(noRepetidos);

    actualizarTabla(tabla, noRepetidos);
}
