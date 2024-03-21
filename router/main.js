const express = require('express');
const router = express.Router();//Crea el router

const Producto = require('../models/producto');
const Direccion = require('../models/direccion');
const { parseArgs } = require('util');

router.get('/',(req,resp)=>{
    resp.render('index');
});

router.get('/nosotros',(req,resp)=>{
    resp.render('nosotros');
});

// Peticion que en el JS la pedimos con un AJAX

router.get('/productos', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const tipo = req.query.tipo;
        const perPage = 10; // Número de productos por página
        const skip = (page - 1) * perPage;    

        // Para saber el total de productos
        /*const totalProductos = await Producto.countDocuments();*/

        if (tipo == 'todo'){
            const arregloProductosDB = await Producto.find({})
                .skip(skip)
                .limit(perPage)
                .exec();

            res.json(arregloProductosDB);
        }else{
            const productosEncontrados = await Producto.find({ tipo_de_producto: tipo })
                .skip(skip)
                .limit(perPage)
                .exec();

            res.json(productosEncontrados);
        }

    } catch (error) {
      console.log(error);
      res.status(500).send('Error al obtener productos');
    }
});

// Para la barra de busqueda
router.get('/buscar', async (req, res) => {
    const term = req.query.term;
    const resultados = await Producto.find({ titulo: { $regex: new RegExp(term, 'i') } });
    res.json(resultados);
});

router.get('/buscar-direcciones', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        try{
            console.log(`Busco el id: [${req.session.idUsuario}]`);
            const data = await Direccion.find({idUsuario: req.session.idUsuario}).exec();
            console.log(data);
            res.status(200).json(data);
        }catch(error){
            console.log(error);
            res.status(500).send('Error al realizar la búsqueda');
        }
    } else {
        res.status(401).send('No hay sesión iniciada');
    }
});


  
module.exports = router;