const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const direccionSchema = new Schema({
    idUsuario:String,
    calle:String,
    numero:String,
    colonia:String,
    ciudad:String,
    estado: String,
    cp : String
},{
    versionKey: false
});

const Direccion = mongoose.model('Direccion',direccionSchema);

module.exports = Direccion;