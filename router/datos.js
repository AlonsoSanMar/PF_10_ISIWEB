const express = require('express');
const router = express.Router();

const Usuario = require('../models/usuario');

router.post('/',async(req,res)=>{
    //console.log(body);
    const {nombre, apellido, correo, password, imagen} = req.body;
   try{
        const usuarioDB=new Usuario({idUsuario:req.session.idUsuario, nombre: nombre, apellido: apellido, correo: correo, password: password, imagen: imagen});
        await usuarioDB.save();
        res.redirect('/usuario/mis-datos');
    }catch(error){
        consol.log('error',error);
    }
});
module.exports = router;