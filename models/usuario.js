const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre:String,
    apellido:String,
    correo:String,
    password:String,
    imagen: String
});

const Usuario = mongoose.model('Usuario',usuarioSchema);
//mongose busca la coleccion 'usuarios' en la base de datos de MongoDB

module.exports = Usuario;