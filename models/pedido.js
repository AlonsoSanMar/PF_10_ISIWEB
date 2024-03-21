const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    idUsuario:String,
    direccion:String,
    dia:String,
    mes:String,
    anyo:String,
    total: String
});

const Pedido = mongoose.model('Pedido',pedidoSchema);

module.exports = Pedido;