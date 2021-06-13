// import express from 'express';
const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//importar las variables.env
require('dotenv').config({path:'variables.env'});


//helpers con funciones
const helpers = require('./helpers');

//crear la conexion a la db
const db = require('./config/db');
//importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(()=>console.log('conectado al servidor'))
    .catch(error=>console.log(error));
// crear una app de express
const app = express();

//Habilitar la vista en la consola lo del formulario
app.use(bodyParser.urlencoded({extended: true}))

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pub
app.set('view engine','pug');

//Añadir carpeta de vistas
app.set('views',path.join(__dirname, './views'));

app.use(cookieParser());

// sessiones para navegar entre distintas paginas sin volvernos a autenticar
app.use(session({ 
    secret: "supersecreto", 
    resave: false, 
    saveUninitialized: false 
}));
;

app.use(passport.initialize());
app.use(passport.session());


//agrego flash messages
app.use(flash());

//VARIABLES LOCALES
//Pasar var dump a la aplicacion (Middleware)
app.use((req,res, next )=>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null; //guardo los datos del usuario logeado en la variable
    
    next();
});


app.use('/',routes());

//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, ()=>{
    console.log('El servidor esta funcionando')
});

