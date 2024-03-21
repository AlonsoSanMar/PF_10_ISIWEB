const express = require('express');
const session = require('express-session');

const aplicacion = express();
const puerto = 3000;

aplicacion.set('view engine','ejs');
aplicacion.set('views',__dirname+'/views');

aplicacion.use(express.static(__dirname+'/public'));

aplicacion.use(session({
  secret: 'palabra_secreta',
  resave: false,
  saveUninitialized: true
}));

//CONEXION CON LA BASE DE DATOS:
    const bodyParser = require('body-parser');
    // obtener de un formulario
    aplicacion.use(bodyParser.urlencoded({ extended: false }));
    // enviar en formato json
    aplicacion.use(bodyParser.json());
    const mongoose = require('mongoose');
    const usuario= 'ale';
    const password='olakase';
    const nombreBD='Pantera-Abarrotera';

    const uri=`mongodb+srv://${usuario}:${password}@cluster.db582wf.mongodb.net/${nombreBD}?retryWrites=true&w=majority`;

    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('Bien... estás conectado a la Base de Datos :D')) 
    .catch(e => console.log('error de conexión', e));

aplicacion.use('/usuario',require('./router/usuario'));
aplicacion.use('/nueva-Direccion',require('./router/direccion'));
aplicacion.use('/',require('./router/main'));


aplicacion.listen(puerto, ()=>{
    console.log('Escuchando las peticiones desde el puerto', puerto);

})


aplicacion.use((req,resp,next)=>{
  resp.status(404).render('404');
});
