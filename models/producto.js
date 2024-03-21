const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productoSchema = new Schema({
    titulo:String,
    url:String,
    precio:Number,
    tipo_de_producto:String,
    descripcion:String
});

const Producto = mongoose.model('Producto',productoSchema);

module.exports = Producto;