//Aqui va desde el inicio de sesion hasta actualizar informacion del usuario
const express = require('express');
const router = express.Router();

const Direccion = require('../models/direccion');


router.post('/',async(req,res)=>{
    //console.log(body);
    const {calle, numero, colonia, ciudad, estado, cp} = req.body;
   try{
        const direccionDB=new Direccion({idUsuario:req.session.idUsuario, calle: calle, numero: numero, colonia: colonia, ciudad: ciudad, estado: estado, cp: cp});
        await direccionDB.save();
        res.redirect('/usuario/mis-direcciones');
    }catch(error){
        consol.log('error',error);
    }
});


module.exports = router;