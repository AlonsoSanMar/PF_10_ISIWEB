//Aqui va desde el inicio de sesion hasta actualizar informacion del usuario
const express = require('express');
const router = express.Router();

const Usuario = require('../models/usuario');
const Direccion = require('../models/direccion');
const Pedido = require('../models/pedido');

router.get('/',async(req,res)=>{
    if(req.session && req.session.idUsuario){
        console.log("Id de la sesion: ", req.session.idUsuario);
        try{
            const usuario = await Usuario.findOne({_id: req.session.idUsuario});

            console.log(req.session.id);
            res.render('mi-cuenta',{
                usuario: usuario
            });

        }catch(error){
            console.log(error);
            res.render('404');
        }
    }else{
        res.render('iniciar-sesion');
    }
});

router.post('/login', async(req, res) =>{
    
    const {correo, password} = req.body;
    const usuario = await Usuario.findOne({correo : correo, password : password});

    if(usuario){
        req.session.idUsuario = usuario._id.toString();
        res.status(200).send('Inicio exitoso');

    }else{
        res.status(401).send('Credenciales incorrectas');
    }
});

router.post('/registrar-pedido', async(req, res) => {
    const {direccion, dia, mes, anyo, total} = req.body;

    console.log('Direccion ', direccion);
    console.log('total', total)
    Pedido.create({idUsuario : req.session.idUsuario, direccion : direccion, dia: dia, mes : mes, anyo: anyo, total:total}).then(pedido =>{
        console.log('Insertado: ', pedido);
        res.status(200).send('Exito');
    }).catch(err =>{
        res.status(402);
    });

});

router.post('/signup', async(req, res) => {
    const {nombre, apellido, correo, password, imagen} = req.body;
    const usuario = await Usuario.findOne({correo : correo});

    if(usuario){
        res.status(401).send('Ya existe un usuario con ese correo');
    }else{
        Usuario.create({nombre: nombre, apellido: apellido, correo: correo, password: password, imagen: imagen})
        .then(usuario => {
            req.session.idUsuario = usuario._id.toString();
            res.status(200).send('Registro exitoso');
        })
        .catch(err => {
            res.status(402).send('Error al insertar en la base de datos');
        });
    }
});

router.get('/logout', async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/'); // Redirigir a la página principal u otra página de inicio de sesión
        }
    });
});

router.get('/mis-pedidos', async(req, res) => {
    if(req.session && req.session.idUsuario){

        try{
            const data = await Pedido.find({idUsuario: req.session.idUsuario}).exec();
            console.log(data);
            res.render('mis-pedidos',{
                pedidos: data
            });

        }catch(error){
            console.log(error);
            res.render('404');
        }

    }else{
        res.redirect('/usuario');
    }
});

//Boton mis-datos
router.get('/mis-datos',async(req,res)=>{
    try{  
        const usuario = await Usuario.findOne({_id: req.session.idUsuario});
        res.render('mis-datos',{
            usuario: usuario 
        });

    }catch(error){
        console.log(error);
        res.render('404');
    }
    
});

router.put('/:id',async(req,res)=>{
    const id = req.params.id;
    const body = req.body;//Son los datos que se van a actualizar
    try{
        const usuarioBD = await Usuario.findByIdAndUpdate(id,body,{useFindAndModify:false});
        res.json({
            estado:true,
            mensaje:'Los datos se actualizaron'
        });
    }catch(error){
        console.log(error);
    }
});


//Boton mis-direcciones
router.get('/mis-direcciones',async(req,res)=>{
    try{  
        const direcciones = await Direccion.find({idUsuario: req.session.idUsuario});
        res.render('mis-direcciones',{
            direcciones: direcciones 
        });

    }catch(error){
        console.log(error);
        res.render('404');
    }
    
});

router.get('/nueva-direccion',(req,res)=>{
    res.render('nueva-direccion');
});

// borrar dirección
router.delete('/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        const direccionBD=await Direccion.findByIdAndDelete({_id:id});
        if(direccionBD){
            res.json({
                estado:true,
                mensaje:'Direccion eliminada'
            }); 
        }else{
            res.json({
                estado:false,
                mensaje:'Direccion no eliminada'
            });  
        }
    }catch(error){
        console.log(error);
    }
});

// Para actualizar
router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    try{
        const direccionBD=await Direccion.findOne({_id:id});
        res.render('editar-direccion',{
            direccion:direccionBD,
            error:false
        });
    }catch(error){
        console.log(error);
        res.render('404');
    }
});

router.put('/actualizar-dir/:id',async(req,res)=>{
    const id = req.params.id;
    const body = req.body;//Son los datos que se van a actualizar
    try{
        const direccionBD = await Direccion.findByIdAndUpdate(id,body,{useFindAndModify:false});
        res.json({
            estado:true,
            mensaje:'La dirección se actualizó'
        });
    }catch(error){
        console.log(error);
    }
});


module.exports = router;