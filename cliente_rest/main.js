var seccionActual = "screen-bienvenida";
var seccionAnterior = "screen-bienvenida";
var latUsuario = null;
var lngUsuario = null;
var tipo_dia, hora = null;
var hospitalSelec = null;
var graficoSaturacion = null;
var prioridad_paciente = null;
var latHospRec = null;
var lngHospRec = null;

function cambiarSeccion(seccion) {
    var actual = document.getElementById(seccionActual);
    var nueva = document.getElementById(seccion);

    if (actual) {
        actual.classList.remove("activa");
    }
    if (nueva) {
        nueva.classList.add("activa");
    }

    seccionAnterior = seccionActual;
    seccionActual = seccion;
    console.log("Anterior: " + seccionAnterior + " Actual: " + seccionActual)
}

function obtenerDatosTriaje(){
   
    var sintomasMarcados = document.querySelectorAll('input[name="symptoms"]:checked');
    var sintomas = [];
     
    sintomasMarcados.forEach(function (checkbox) {
        sintomas.push(checkbox.value);
    });

    var ahora = new Date();
    var hh = String(ahora.getHours()).padStart(2, "0");
    var mm = String(ahora.getMinutes()).padStart(2, "0");
    var ss = String(ahora.getSeconds()).padStart(2, "0");
    hora =  hh + ":" + mm + ":" + ss;

    var dia = new Date().getDay();
    tipo_dia = (dia === 0 || dia === 6) ? "fin_de_semana_festivo" : "laborable";


    return {
        sex: document.querySelector('input[name="sex"]:checked')?.value,
        age: document.getElementById("age").value,
        mental: document.querySelector('input[name="mental"]:checked')?.value,
        injury: document.querySelector('input[name="injury"]:checked')?.value,
        pain: document.querySelector('input[name="pain"]:checked')?.value,
        sbp: document.getElementById("sbp").value,
        dbp: document.getElementById("dbp").value,
        hr: document.getElementById("hr").value,
        rr: document.getElementById("rr").value,
        bt: document.getElementById("bt").value,
        saturation_o2: document.getElementById("saturation").value,
        symptoms: sintomas,
        lat: latUsuario,
        lng: lngUsuario,
        tipo_dia: tipo_dia,
        hora:hora
    }
}

function mostrarResumen(){
    var form = document.getElementById("form-triaje1");

    if (!form.checkValidity()) {
        cambiarSeccion("screen-triaje1");
        form.reportValidity();
        return;
    }

    var datos = obtenerDatosTriaje();

    var mapaMental = {
    "1": "Alerta y consciente",
    "2": "Responde al hablarle",
    "3": "Responde solo ante estímulos dolorosos",
    "4": "No responde"
    };

    var mapaSintomas = {
        "Cardiovascular_Agudo": "Dolor en el pecho o palpitaciones",
        "Dificultad_Respiratoria": "Dificultad respiratoria",
        "Neurologico_Ictus": "Debilidad, hormigueo o dificultad para hablar",
        "Alteracion_Conciencia": "Confusión, desmayo, convulsiones o somnolencia",
        "Abdominal_Grave": "Dolor abdominal intenso o vómitos",
        "Cefalea_Mareo": "Cefalea intensa, mareo o vértigo",
        "Trauma_Accidente": "Trauma, herida, fractura o quemadura",
        "Infeccioso_Fiebre": "Fiebre o escalofríos",
        "Otros_Sintomas": "Otros síntomas"
    };

    var sintomasMarcados = document.querySelectorAll('input[name="symptoms"]:checked');
    var sintomasTexto = [];

    sintomasMarcados.forEach(function (checkbox) {
        sintomasTexto.push(mapaSintomas[checkbox.value]);
    });

    document.getElementById("resumen-contenido").innerHTML = `
        <p><strong>Sexo:</strong> ${datos.sex == 0 ? "Hombre" : "Mujer"}</p>
        <p><strong>Edad:</strong> ${datos.age}</p>
        <p><strong>Nivel de respuesta:</strong> ${mapaMental[datos.mental] || "No indicado"}</p>
        <p><strong>Lesión/traumatismo:</strong> ${datos.injury == 1 ? "Sí" : "No"}</p>
        <p><strong>Dolor:</strong> ${datos.pain == 1 ? "Sí" : "No"}</p>
        <p><strong>SBP:</strong> ${datos.sbp}</p>
        <p><strong>DBP:</strong> ${datos.dbp}</p>
        <p><strong>HR:</strong> ${datos.hr}</p>
        <p><strong>RR:</strong> ${datos.rr}</p>
        <p><strong>BT:</strong> ${datos.bt}</p>
        <p><strong>Saturación:</strong> ${datos.saturation_o2}</p>
        <p><strong>Síntomas:</strong> ${sintomasTexto.join(", ") || "Ninguno"}</p>
    `;
    cambiarSeccion("screen-resumen");
}

function mostrarResultado(respuesta) {
    var hospital = respuesta.hospital_recomendado;

    var prioridad = Number(respuesta.prioridad);
    var clasePrioridad = "prioridad-baja";

    if (prioridad === 1) {
        clasePrioridad = "prioridad-critica";
    } else if (prioridad === 2) {
        clasePrioridad = "prioridad-urgente";
    }

    var htmlPrioridad = `
        <div class="resultado-alerta ${clasePrioridad}">
            <h3>${respuesta.prioridad_texto}</h3>
            <p>${respuesta.mensaje}</p>
        </div>
    `;

    var htmlProbabilidades = "";

    if (respuesta.probabilidades) {
        var prob = respuesta.probabilidades;
        var clases = [
            { nombre: "Crítico", valor: prob.Critico, clase: "prob-critico" },
            { nombre: "Urgente", valor: prob.Urgente, clase: "prob-urgente" },
            { nombre: "No urgente", valor: prob.No_urgente, clase: "prob-baja" }
        ];

        var barras = clases.map(function(c) {
            var porcentaje = Math.round(c.valor * 100);
            return `
                 <div class="prob-row">
                    <div class="prob-top">
                        <span>${c.nombre}</span>
                        <strong class="${c.clase}">${porcentaje}%</strong>
                    </div>
                    <div class="prob-track">
                        <div class="prob-fill ${c.clase}" style="width:${porcentaje}%"></div>
                    </div>
                </div>

            `;
        }).join("");

        htmlProbabilidades = `
            <div class="prob-card">
                <h3>Probabilidad por clase</h3>
                ${barras}
            </div>
        `;
    }

    // Bloque hospital
    var htmlHospital = "";
    if (hospital) {
        htmlHospital = `
             <div class="hospital-card">
                <h3>🏥 Hospital sugerido</h3>
                <div class="hospital-info">
                    <div class="hospital-linea">
                        <strong>Nombre</strong>
                        <span class="hospital-dato">${hospital.nombre}</span>
                    </div>
                    <div class="hospital-linea">
                        <strong>Municipio</strong>
                        <span class="hospital-dato">${hospital.municipio}</span>
                    </div>
                    <div class="hospital-linea">
                        <strong>Espera estimada</strong>
                        <span class="hospital-dato">${hospital.t_espera} min</span>
                    </div>
                    <div class="hospital-linea">
                        <strong>Distancia aproximada</strong>
                        <span class="hospital-dato">${hospital.distancia_km} km</span>
                    </div>
                    <div class="hospital-linea">
                        <strong>Nivel de Saturación</strong>
                        <span class="hospital-dato">${hospital.nivel_saturacion}</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        htmlHospital = `<p>No se ha podido determinar un hospital recomendado.</p>`;
    }

    document.getElementById("resultado-contenido").innerHTML =
        htmlPrioridad + htmlProbabilidades + htmlHospital;
}

function procesarHospitales(hospitales, prioridadPaciente){
    var hospitalesProcesados = []; 
    //Para cada hospital 
    hospitales.forEach(function(h){
        //Calcular saturacion
        var nivel_saturacion = null;
        var saturacion = null;
        var subindicePersonal = null;
        var subindiceCamas = null;
        var distanciaKm = null;
        var a, c, dLat, dLon = null;

        subindicePersonal = 100 * (
            Number(h.pacientes_espera) +
            Number(h.pacientes_consulta) +
            Number(h.pacientes_observacion) +
            Number(h.pacientes_criticos)
        ) / (Number(h.medicos_disp) + Number(h.enfermeros_disp));

        subindiceCamas = 100 * (
            Number(h.pacientes_observacion) +
            Number(h.pacientes_criticos)
        ) / Number(h.camas_urg_estimadas);

        saturacion =  Math.max(subindicePersonal, subindiceCamas);
        if (isNaN(saturacion)) {
            console.error("La saturación es NaN", h);
        }
        else if(saturacion > 200){
            nivel_saturacion = "Saturación Extrema";
        }
        else if(saturacion <= 200 && saturacion > 100){
            nivel_saturacion = "Saturación Alta";
        }
        else if(saturacion == 100){
            nivel_saturacion = "Saturado";
        }
        else{
            nivel_saturacion = "No saturado";
        }

        //Calcular distancia
        var R = 6371;
        dLat = (h.latitud - latUsuario) * (Math.PI / 180);
        dLon = (h.longitud - lngUsuario) * (Math.PI / 180);
        
        a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(latUsuario * (Math.PI / 180)) *
        Math.cos(h.latitud * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distanciaKm = Number((R * c).toFixed(2));

        //Tiempo de desplazamiento
        var velMedia=70;
        var tiempo_desplazamiento = (distanciaKm/velMedia)*60;

        //Calcular tiempo de espera segun nivel de saturacion y prioridad_paciente
        var t_espera = calcularTiempoEspera(prioridadPaciente, nivel_saturacion);
        
        //Calcular tiempo total hasta la atencion hospitalaria
        var tiempo_total = tiempo_desplazamiento + t_espera
        //Guardar hospital procesado
        hospitalesProcesados.push({
            idHospital: h.idHospital,
            nombre: h.nombre,
            municipio: h.municipio,
            direccion: h.direccion,
            tipo_centro: h.tipo_centro,
            latitud: h.latitud,
            longitud: h.longitud,
            medicos_disp: h.medicos_disp,
            enfermeros_disp: h.enfermeros_disp,
            pacientes_espera: h.pacientes_espera,
            pacientes_consulta: h.pacientes_consulta,
            pacientes_observacion: h.pacientes_observacion,
            pacientes_criticos: h.pacientes_criticos,
            camas_urg_estimadas: h.camas_urg_estimadas,
            saturacion: Number(saturacion.toFixed(2)),
            nivel_saturacion: nivel_saturacion,
            distancia_km: distanciaKm, 
            t_espera: t_espera,
            t_desplazamiento: tiempo_desplazamiento,
            t_total: tiempo_total
        });

    });
    //¡¡¡¡Mirar lo de prioridad 1 o 2 para enviar al mas cercano !!!!
    hospitalesProcesados.sort(function(a, b) {
    if (a.t_total !== b.t_total) {
        return a.t_total - b.t_total; //primero el menor tiempo total
    }
    return a.distancia_km - b.distancia_km; //si empatan, el mas cercano
    });
    return hospitalesProcesados;
}
function continuarTriaje1() {
    var form = document.getElementById("form-triaje1");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    cambiarSeccion("screen-triaje2");
}

function evaluarTriaje() {
    var datos = obtenerDatosTriaje();

    if (latUsuario == null || lngUsuario == null) {
        navigator.geolocation.getCurrentPosition(
        function (posicion) {
            latUsuario = posicion.coords.latitude;
            lngUsuario = posicion.coords.longitude;

            rest.post("/api/triaje/evaluar", datos, function (estado, respuesta) {
                if (estado !== 200) {
                   console.log("Error evaluación:", estado, respuesta);
                    alert("Error al evaluar el triaje. Estado: " + estado + "\n" + JSON.stringify(respuesta));
                    return;
                }
                prioridad_paciente = respuesta.prioridad;
                rest.get(
                    "/api/estado-hospitales?tipo_dia=" + datos.tipo_dia + "&hora=" + datos.hora,
                    function (estado, hospitales) {
                        if (estado !== 200 || !hospitales || hospitales.length === 0) {
                            alert("No se pudo obtener el estado de los hospitales.");
                            return;
                        }
                        console.log(hospitales);
                        //En hospitales tengo el estado de cada hospital en la franja horaria determinada
                        var hospitalesProcesados = procesarHospitales(hospitales, respuesta.prioridad);
                        console.log(hospitalesProcesados);
                        var hospitalRecomendado = hospitalesProcesados[0];
                        latHospRec = hospitalRecomendado.latitud;
                        lngHospRec = hospitalRecomendado.longitud;
                        console.log(hospitalRecomendado);
                        ultimoResultado = {
                            prioridad: respuesta.prioridad,
                            prioridad_texto: respuesta.prioridad_texto,
                            mensaje: respuesta.mensaje,
                            probabilidades: respuesta.probabilidades,
                            hospital_recomendado: hospitalRecomendado,
                            hospitales: hospitalesProcesados
                        };

                        mostrarResultado(ultimoResultado);
                        cambiarSeccion("screen-resultado");
                });
            });
        }, function (error) {
            console.log("Error al obtener la ubicación:", error);
            alert("Error al obtener la ubicación")
        }
    );
        } else {
        var datos = obtenerDatosTriaje();

        rest.post("/api/triaje/evaluar", datos, function (estado, respuesta) {
            if (estado !== 200) {
                console.log("Error evaluación:", estado, respuesta);
                alert("Error al evaluar el triaje. Estado: " + estado + "\n" + JSON.stringify(respuesta));
                return;
            }

            prioridad_paciente = respuesta.prioridad;

            rest.get(
                "/api/estado-hospitales?tipo_dia=" + datos.tipo_dia + "&hora=" + datos.hora,
                function (estado, hospitales) {
                    if (estado !== 200 || !hospitales || hospitales.length === 0) {
                        alert("No se pudo obtener el estado de los hospitales.");
                        return;
                    }

                    var hospitalesProcesados = procesarHospitales(hospitales, prioridad_paciente);
                    var hospitalRecomendado = hospitalesProcesados[0];

                    ultimoResultado = {
                        prioridad: respuesta.prioridad,
                        prioridad_texto: respuesta.prioridad_texto,
                        mensaje: respuesta.mensaje,
                        probabilidades: respuesta.probabilidades,
                        hospital_recomendado: hospitalRecomendado,
                        hospitales: hospitalesProcesados
                    };

                    mostrarResultado(ultimoResultado);
                    cambiarSeccion("screen-resultado");
                }
            );
        });
    }

}


function verHospitales(){    
    if (!ultimoResultado || !ultimoResultado.hospitales || ultimoResultado.hospitales.length <= 1) {
        alert("Primero debes evaluar el triaje.");
        return;
    }

    hospitalSelec = null;

    cambiarSeccion("screen-mapa");

    setTimeout(function() {
        mostrarMapaHospitales(ultimoResultado.hospitales);
    }, 250);

    

}
    


function verDetalleHospital() {
    var detalleHospital = document.getElementById("detalleHospital");
    var btnDetalle = document.getElementById("btn-ver-detalle");

    if (!hospitalSelec) {
        alert("Primero debes seleccionar un hospital en el mapa.");
        return;
    }
    if (detalleHospital && detalleHospital.style.display === "block") {
        limpiarDetalleHospital();
        return;
    }

    rest.get(
        "/api/hospitales/" + hospitalSelec.idHospital + "/estado?tipo_dia=" + tipo_dia + "&hora=" + hora,
        function(estado, datosHospital) {
            if (estado === 200 && detalleHospital) {
                detalleHospital.style.display = "block";
                detalleHospital.innerHTML = `
                    <h3>${datosHospital.nombre}</h3>
                    <p><strong>Municipio:</strong> ${datosHospital.municipio}</p>
                    <p><strong>Tipo:</strong> ${datosHospital.tipo_centro}</p>
                    <p><strong>Dirección:</strong> ${datosHospital.direccion}</p>
                    <p><strong>Distancia:</strong> ${hospitalSelec.distancia_km} km</p>
                    <p><strong>Tiempo de espera:</strong> ${hospitalSelec.t_espera} min</p>
                    <p><strong>Nivel de saturación:</strong> ${hospitalSelec.nivel_saturacion}</p>
                `;
                btnDetalle.textContent = "Cerrar detalle";
                cargarEvolucionHospital(hospitalSelec.idHospital);
            } else {
                alert("No se pudo cargar el detalle del hospital.");
            }
        }
    );
}


function mostrarMapaHospitales(hospitales) {
    console.log("Hospitales recibidos en mapa:", hospitales.length, hospitales);
    
    limpiarDetalleHospital();
    hospitalSelec = null;

    if (latUsuario == null || lngUsuario == null) {
        alert("Primero debes obtener la ubicación.");
        return;
    }

    var contenedorMapa = document.getElementById("mapa");

    if (!contenedorMapa) {
        alert("No existe el contenedor del mapa.");
        return;
    }

    contenedorMapa.style.display = "block";


    if (!mostrarMapaHospitales._map) {
        mostrarMapaHospitales._map = L.map("mapa").setView([latUsuario, lngUsuario], 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(mostrarMapaHospitales._map);
    }
    //} else {
        //mostrarMapaHospitales._map.setView([latUsuario, lngUsuario], 11);
    //}

    if (mostrarMapaHospitales._markers) {
        mostrarMapaHospitales._markers.forEach(function(marker) {
            mostrarMapaHospitales._map.removeLayer(marker);
        });
    }
    mostrarMapaHospitales._markers = [];

    var bounds = [];

    var marcadorUsuario = L.circleMarker([latUsuario, lngUsuario], {
        radius: 8,
        color: "blue",
        fillColor: "blue",
        fillOpacity: 0.8
    }).addTo(mostrarMapaHospitales._map)
      .bindPopup("Usted está aquí");

    mostrarMapaHospitales._markers.push(marcadorUsuario);
    bounds.push([latUsuario, lngUsuario]);

    hospitales.forEach(function(hospital) {
        var marcadorHospital = L.marker([hospital.latitud, hospital.longitud])
            .addTo(mostrarMapaHospitales._map)
            .bindPopup(
                "<strong>" + hospital.nombre + "</strong><br>" +
                "Tiempo de Espera: " + hospital.t_espera + " min<br>" +
                "Distancia: " + hospital.distancia_km + " km<br>" +
                "Saturacion: " + hospital.nivel_saturacion
            );
        marcadorHospital.on("click", function() {
            limpiarDetalleHospital();
            hospitalSelec = hospital;

            var botonDetalle = document.getElementById("btn-ver-detalle");
            if (botonDetalle) {
                botonDetalle.style.display = "block";
                botonDetalle.textContent = "Ver detalle hospital";
            }
            var btnRuta = document.getElementById("btn-como-llegar");
            if (btnRuta) {
                btnRuta.style.display = "block";
            }

    });
    mostrarMapaHospitales._markers.push(marcadorHospital);
    bounds.push([hospital.latitud, hospital.longitud]);
    });
    

    setTimeout(function() {
        mostrarMapaHospitales._map.invalidateSize();
            var grupo = L.featureGroup(mostrarMapaHospitales._markers);
            mostrarMapaHospitales._map.fitBounds(grupo.getBounds(), {
                padding: [30, 30],
            });
    }, 400);
}

function cargarEvolucionHospital(idHospital) {
    rest.get(
        "/api/hospitales/" + idHospital + "/evolucion?tipo_dia=" + tipo_dia,
        function(estado, franjas) {
            if (estado !== 200 || !franjas || franjas.length === 0) {
                alert("No se pudo obtener la evolución del hospital.");
                return;
            }

            var datosGrafico = calcularSaturacionPorFranjas(franjas);
            console.log("Datos gráfico procesados:", datosGrafico);

            dibujarGraficoSaturacion(datosGrafico);
        }
    );
}

function calcularTiempoEspera(prioridad, nivelSaturacion){
    prioridad = Number(prioridad);

    var tiemposBase = {
        1: 10,  // Crítico: KTAS 1-2
        2: 30,  // Urgente: KTAS 3
        3: 90   // No urgente: KTAS 4-5
    };

    var multiplicadores = {
        "No saturado": 1.0,
        "Saturado": 1.2,
        "Saturación Alta": 1.5,
        "Saturación Extrema": 2.0
    };

    var tiempoBase = tiemposBase[prioridad] || 30;
    var multiplicador = multiplicadores[nivelSaturacion] || 1.0;

    var tiempo = Math.round(tiempoBase * multiplicador);

    // Para críticos, la saturación no debería disparar demasiado la espera
    if (prioridad === 1) {
        tiempo = Math.min(tiempo, 15);
    }

    return tiempo;

}

function calcularSaturacionPorFranjas(franjas) {
    var labels = [];
    var nivelesNumericos = [];
    var nivelesTexto = [];
    var tiemposEspera = [];

    franjas.forEach(function(f) {
        var subindicePersonal = 100 * (
            Number(f.pacientes_espera) +
            Number(f.pacientes_consulta) +
            Number(f.pacientes_observacion) +
            Number(f.pacientes_criticos)
        ) / (Number(f.medicos_disp) + Number(f.enfermeros_disp));

        var subindiceCamas = 100 * (
            Number(f.pacientes_observacion) +
            Number(f.pacientes_criticos)
        ) / Number(f.camas_urg_estimadas);

        var saturacion = Math.max(subindicePersonal, subindiceCamas);
        var nivelTxt = "No saturado";
        var nivelNumerico = 1;

        if (saturacion > 200) {
            nivelTxt = "Saturación Extrema";
            nivelNumerico = 4;
        } else if (saturacion > 100) {
            nivelTxt = "Saturación Alta";
            nivelNumerico = 3
        } else if (saturacion == 100) {
            nivelTxt = "Saturado";
            nivelNumerico=2;
        }

        console.log(prioridad_paciente,nivelTxt)

        var t_espera = calcularTiempoEspera(Number(prioridad_paciente), nivelTxt);

        labels.push(f.franja_hora);
        nivelesNumericos.push(nivelNumerico);
        nivelesTexto.push(nivelTxt);
        tiemposEspera.push(t_espera);
    });

    return {
        labels: labels,
        nivelesNumericos: nivelesNumericos,
        nivelesTexto: nivelesTexto,
        tiemposEspera: tiemposEspera
    };
}

function dibujarGraficoSaturacion(datos) {
    var bloqueGrafico = document.getElementById("bloqueGrafSat");
    var canvas = document.getElementById("graficoSat");
    console.log("Datos del gráfico:", datos);

    if (!canvas || !bloqueGrafico){
        console.log("No existe el canvas o el bloque del gráfico");
        return;
    }
    if (!datos || !datos.labels || !datos.nivelesNumericos || datos.labels.length === 0) {
        console.log("No hay datos para dibujar el gráfico");
        return;
    }

    bloqueGrafico.style.display = "block";

    if (graficoSaturacion) {
        graficoSaturacion.destroy();
        graficoSaturacion = null;
    }

    var franjaActual = null;
    var horaActual = new Date().getHours();

    if (horaActual >= 0 && horaActual < 8) franjaActual = "Madrugada (00:00h - 8:00h)";
    else if (horaActual >= 8 && horaActual < 11) franjaActual = "Mañana (8:00h - 11:00h) ";
    else if (horaActual >= 11 && horaActual < 16) franjaActual = "Mediodía (11:00h - 16:00h)";
    else if (horaActual >= 16 && horaActual < 21) franjaActual = "Tarde (16:00h - 21:00h)";
    else franjaActual = "Noche (21:00h - 00:00h)";

    var colores = datos.labels.map(function(label) {
        return label === franjaActual ? "#d9534f" : "#6fa8dc";
    });
    setTimeout(function(){

    
    graficoSaturacion = new Chart(canvas, {
        type: "bar",
        data: {
            labels: datos.labels,
            datasets: [{
                data: datos.nivelesNumericos, 
                backgroundColor: colores,
                borderRadius: 8,
                borderSkipped: false,
                barPercentage: 0.55,
                categoryPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var i = context.dataIndex;
                            return datos.nivelesTexto[i];
                        },
                        afterLabel: function(context) {
                            var i = context.dataIndex;
                            return "Espera estimada: " + datos.tiemposEspera[i] + " min";
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#555",
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    display: false,
                    min: 0,
                    max: 4.5,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
},50);
}

function abrirRutaHospital(hospital) {
    if (latUsuario == null || lngUsuario == null) {
        alert("No se ha podido obtener la ubicación del usuario.");
        return;
    }

    if (!hospital) {
        alert("No hay hospital disponible.");
        return;
    }


    var url =
        "https://www.google.com/maps/dir/?api=1" +
        "&origin=" + encodeURIComponent(latUsuario + "," + lngUsuario) +
        "&destination=" + encodeURIComponent(hospital.latitud + "," + hospital.longitud);

    window.open(url, "_blank");
}

function abrirRutaGoogleMapsRes() {
    abrirRutaHospital(ultimoResultado ? ultimoResultado.hospital_recomendado : null);
}

function abrirRutaGoogleMaps() {
    abrirRutaHospital(hospitalSelec);
}

function limpiarDetalleHospital() {
    var detalleHospital = document.getElementById("detalleHospital");
    if (detalleHospital) {
        detalleHospital.innerHTML = "";
        detalleHospital.style.display = "none";
    }

    if (graficoSaturacion) {
        graficoSaturacion.destroy();
        graficoSaturacion = null;
    }

    var bloqueGrafico = document.getElementById("bloqueGrafSat");
    if (bloqueGrafico) {
        bloqueGrafico.style.display = "none";
    }

    var btnDetalle = document.getElementById("btn-ver-detalle");
    if (btnDetalle) {
        btnDetalle.textContent = "Ver detalle hospital";
    }
}

function limpiarFormularios() {
    var formularios = document.querySelectorAll("form");

    formularios.forEach(function(formulario) {
        formulario.reset();
    });

    // Limpiar también checkboxes/radios por seguridad
    var checks = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    checks.forEach(function(check) {
        check.checked = false;
    });

    // Limpiar textos dinámicos
    var resumen = document.getElementById("resumen-contenido");
    if (resumen) resumen.innerHTML = "";

    var resultado = document.getElementById("resultado-contenido");
    if (resultado) resultado.innerHTML = "";

    var detalleHospital = document.getElementById("detalleHospital");
    if (detalleHospital) {
        detalleHospital.innerHTML = "";
        detalleHospital.style.display = "none";
    }

    var ubicacionTexto = document.getElementById("ubicacion-texto");
    if (ubicacionTexto) {
        ubicacionTexto.textContent = "Ubicación no obtenida todavía.";
    }

    if (graficoSaturacion) {
        graficoSaturacion.destroy();
        graficoSaturacion = null;
    }

    var bloqueGrafico = document.getElementById("bloqueGrafSat");
    if (bloqueGrafico) {
        bloqueGrafico.style.display = "none";
    }

    // Limpiar variables globales
    latUsuario = null;
    lngUsuario = null;
    ultimoResultado = null;
    tipo_dia = null;
    hora = null;
    hospitalSelec = null;
    prioridad_paciente = null;
}

function salir(){
    limpiarFormularios();
    cambiarSeccion("screen-bienvenida");
}
