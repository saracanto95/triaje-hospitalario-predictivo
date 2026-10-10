var express = require("express");
var app = express();

var cors = require("cors");
app.use(cors())

app.use(express.json());

// Lanzar Flask
const fetch = require('node-fetch');
const { spawn } = require('child_process');

const flaskProcess = spawn('python', ['modelo_service.py'], {
    stdio: 'inherit' // muestra los logs de Flask en la misma terminal
});

flaskProcess.on('error', function(err) {
    console.error('No se pudo arrancar Flask:', err);
});

process.on('exit', function() {
    flaskProcess.kill(); // cierra Flask cuando cierras Node
});

var mysql = require("mysql");
var database = {
    host: "localhost",
    user: "root",
    password: "",
    database: "app_triaje",
    port: 3306
};

app.use("/appTriaje", express.static("./cliente_rest"));

var conexion = mysql.createConnection(database);
console.log("Conectando con la base de datos...");
conexion.connect(function (err) {
    if (err) {
        console.log("Se ha producido un error al conectar a la base de datos", err);
        process.exit();
    } else {
        console.log("Base de datos conectada correctamente!!!");
    }
});

app.get("/api/estado-hospitales", function(req, res){
    var tipoDia = req.query.tipo_dia;
    var hora = req.query.hora;

    if(!tipoDia || !hora){
        return res.status(400).json({ error: "Faltan tipo dia u hora" });
    }

    var sql = `
        SELECT h.*, e.*
        FROM hospitales h, estado_hospital e
        WHERE h.idHospital = e.idHospital
        AND e.tipo_dia = ?
        AND ? BETWEEN e.hora_inicio AND e.hora_fin
        ORDER BY h.nombre ASC
    `;
    conexion.query(sql, [tipoDia, hora], function(err, hospitales){
        if(err){
            console.log(err);
            return res.status(500).json({ error: "Error al consultar el estado de los hospitales" });
        }else{
            res.status(200).json(hospitales);
        }
    });
});


app.get("/api/hospitales/:id/estado", function(req, res){
    var idHospital = req.params.id;
    var tipoDia = req.query.tipo_dia;
    var hora = req.query.hora;

    if(!tipoDia || !hora){
        return res.status(400).json({ error: "Faltan tipo_dia u hora" });
    }

    var sql = `
        SELECT h.*, e.*
        FROM hospitales h, estado_hospital e
        WHERE h.idHospital = e.idHospital
        AND h.idHospital = ?
        AND e.tipo_dia = ?
        AND ? BETWEEN e.hora_inicio AND e.hora_fin
    `;

    conexion.query(sql, [idHospital, tipoDia, hora], function(err, resultados){
        if(err){
            console.log(err);
            return res.status(500).json({ error: "Error al consultar el hospital" });
        }else{
            if(resultados.length > 0){
                res.status(200).json(resultados[0]);
            }else{
                res.status(404).json({ error: "No hay datos para ese hospital en esa franja" });
            }
        }
    });
});


app.post("/api/triaje/evaluar", function(req, res){
    console.log("Petición recibida en /api/triaje/evaluar");

    var datosPac = {
        sex: req.body.sex,
        age: req.body.age,
        mental: req.body.mental,
        injury: req.body.injury,
        pain: req.body.pain,
        sbp: req.body.sbp,
        dbp: req.body.dbp,
        hr: req.body.hr,
        rr: req.body.rr,
        bt: req.body.bt,
        saturation_o2: req.body.saturation_o2,
        symptoms: req.body.symptoms || []
    };

    if (
        datosPac.sex == null ||
        datosPac.age == null ||
        datosPac.mental == null ||
        datosPac.injury == null ||
        datosPac.pain == null ||
        datosPac.sbp == null ||
        datosPac.dbp == null ||
        datosPac.hr == null ||
        datosPac.rr == null ||
        datosPac.bt == null ||
        datosPac.saturation_o2 == null
    ) {
        return res.status(400).json({ error: "Faltan datos obligatorios del triaje" });
    }
    var rangos = [
        { campo: "age", nombre: "Edad", min: 0, max: 120 },
        { campo: "sbp", nombre: "Presión sistólica", min: 50, max: 260 },
        { campo: "dbp", nombre: "Presión diastólica", min: 20, max: 160 },
        { campo: "hr", nombre: "Frecuencia cardíaca", min: 20, max: 250 },
        { campo: "rr", nombre: "Frecuencia respiratoria", min: 4, max: 80 },
        { campo: "bt", nombre: "Temperatura corporal", min: 25, max: 45 },
        { campo: "saturation_o2", nombre: "Saturación de oxígeno", min: 50, max: 100 }
    ];

    var errores = [];

    rangos.forEach(function(r) {
        var valor = Number(datosPac[r.campo]);

        if (datosPac[r.campo] === "" || isNaN(valor)) {
            errores.push(r.nombre + " debe ser un número válido.");
        } else if (valor < r.min || valor > r.max) {
            errores.push(r.nombre + " debe estar entre " + r.min + " y " + r.max + ".");
        } else {
            datosPac[r.campo] = valor;
        }
    });

    if (Number(datosPac.dbp) >= Number(datosPac.sbp)) {
        errores.push("La presión diastólica debe ser menor que la sistólica.");
    }
    if (errores.length > 0) {
        return res.status(400).json({
            error: "Datos fuera de rango",
            detalles: errores
        });
    }
    
     // Llamada al servicio Flask
    fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosPac)
    })
    .then(function(r) { return r.json(); })
    .then(function(resultado) {

        // Mapear las 3 clases del modelo a prioridad 1-5 para el frontend
        var mapaPrioridad = {
            1: { 
                prioridad: 1,
                prioridad_texto: "Crítico",
                mensaje: "Necesitas atención médica pronto. Revisa el hospital recomendado. Si te encuentras muy mal o empeoras, llama al 112."
            },
            2: { 
                prioridad: 2,
                prioridad_texto: "Urgente",
                mensaje: "Conviene que te valore un médico pronto. La app te muestra un hospital cercano con menor espera estimada."
            },
            3: { 
                prioridad: 3,
                prioridad_texto: "No urgente",
                mensaje: "No parece una urgencia grave. Puedes pedir cita médica o acudir a tu centro de salud si lo necesitas."
            }
        };

        console.log("Resultado recibido de Flask:", resultado);

        var respuesta = mapaPrioridad[Number(resultado.clase)];

        if (!respuesta) {
            console.error("Clase no reconocida:", resultado);
            return res.status(500).json({
                error: "Clase no reconocida desde Flask",
                resultado: resultado
            });
        }

        respuesta.probabilidades = resultado.probabilidades;

        res.status(200).json(respuesta);
    })
    .catch(function(err) {
        console.error("Error al contactar Flask:", err);
        res.status(500).json({ error: "Error al contactar el servicio de predicción" });
    });
});

app.get("/api/hospitales/:id/evolucion", function(req, res){
    var idHospital = req.params.id;
    var tipoDia = req.query.tipo_dia;

    if (!tipoDia) {
        return res.status(400).json({ error: "Falta tipo_dia" });
    }

    var sql = `
        SELECT
            h.idHospital,
            h.nombre,
            h.camas_urg_estimadas,
            e.hora_inicio,
            e.hora_fin,
            e.medicos_disp,
            e.enfermeros_disp,
            e.pacientes_espera,
            e.pacientes_consulta,
            e.pacientes_observacion,
            e.pacientes_criticos,
            CASE
                WHEN e.hora_inicio = '08:00:00' THEN 'Mañana'
                WHEN e.hora_inicio = '11:00:00' THEN 'Mediodía'
                WHEN e.hora_inicio = '16:00:00' THEN 'Tarde'
                WHEN e.hora_inicio = '21:00:00' THEN 'Noche'
                WHEN e.hora_inicio = '00:00:00' THEN 'Madrugada'
                ELSE 'Franja'
            END AS franja_hora
        FROM hospitales h, estado_hospital e
        WHERE h.idHospital = e.idHospital
        AND h.idHospital = ?
        AND e.tipo_dia = ?
        ORDER BY
            CASE
                WHEN e.hora_inicio = '08:00:00' THEN 1
                WHEN e.hora_inicio = '11:00:00' THEN 2
                WHEN e.hora_inicio = '16:00:00' THEN 3
                WHEN e.hora_inicio = '21:00:00' THEN 4
                WHEN e.hora_inicio = '00:00:00' THEN 5
                ELSE 99
            END
    `;

    conexion.query(sql, [idHospital, tipoDia], function(err, resultados){
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error al consultar la evolución del hospital" });
        } else {
            if (resultados.length > 0) {
                res.status(200).json(resultados);
            } else {
                res.status(404).json({ error: "No hay datos de evolución para ese hospital" });
            }
        }
    });
});

app.listen(3000, function () {
    console.log("Servidor funcionando en http://localhost:3000");
});