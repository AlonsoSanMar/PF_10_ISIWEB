document.getElementById('btn-atras').addEventListener('click', ()=>{
    window.location.replace('/');
});

document.getElementById('btn-iniciar').addEventListener('click', recogerDatos);
document.getElementById('btn-registrar').addEventListener('click', recogeDatosRegistro);
document.getElementsByName('registro-password')[0].addEventListener('input', verificarPassword);
document.getElementsByName('registro-password-confirmation')[0].addEventListener('input', confirmaPassword);

function verificarPassword(e){
    let lbl_error = document.querySelector('#password-error');
    let actual = e.target.value;

    if(actual.length <= 5){
        lbl_error.textContent = 'La contraseña debe contener al menos 6 caracteres';
    }else{
        lbl_error.textContent = '';
        let  mayuscula = false;
        for(let i=0;i<actual.length; ++i){
            if(actual[i] == actual[i].toUpperCase()){
                mayuscula = true;
            }
        }

        if(!mayuscula){
            lbl_error.textContent = 'La contraseña debe contener al menos una letra mayúscula';
        }else{
            lbl_error.textContent = '';
        }
    }
}

function confirmaPassword(e){
    let password_confirmation = e.target.value;
    let password = document.getElementsByName('registro-password')[0].value;
    let lbl_error = document.getElementById('password-confirmation-error');

    if(password_confirmation != password){
        lbl_error.textContent = 'Las contraseñas no coinciden';
    }else{
        lbl_error.textContent = '';
    }
}

function recogerDatos(){
    const correo = document.getElementById('iniciar-correo').value;
    const password = document.getElementById('iniciar-password').value;

    if(correo && password){
        iniciarSesion(correo, password);
    }else{
        alert('Debes ingresar todos los datos');
    }
}

function iniciarSesion(usuario, password){
    const url = 'usuario/login';

    const data = {
        correo: usuario,
        password: password,
    };

    fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
    }).then(response => {
        if(response.status == 200){
            window.location.replace('/usuario');

        }else if(response.status == 401){
            alert('Credenciales Incorrectas');
        }else{
            alert('Error desconocido, contacte al administrador');
        }
    }).catch(error => {
        console.log(error);
    });
}

function recogeDatosRegistro(){
    
    let nombre = document.getElementsByName('registro-nombre')[0].value;
    let apellido = document.getElementsByName('registro-apellido')[0].value;
    let correo = document.getElementsByName('registro-correo')[0].value;
    let password = document.getElementsByName('registro-password')[0].value;
    
    let lbl_error = document.getElementById('password-error').textContent;
    let lbl_confirmation_error = document.getElementById('password-confirmation-error').textContent;

    if(lbl_error != '' || lbl_confirmation_error != ''){
        alert('Resuelve los problemas');
        return;
    }

    if(!nombre || !apellido || !correo || !password){
        alert('Rellena todos los campos');
        return;
    }

    registroUsuario(nombre, apellido, correo, password, '1');
}

function registroUsuario(nombre, apellido, correo, password, imagen){
    const data = {
        nombre : nombre,
        apellido: apellido, 
        correo: correo,
        password : password,
        imagen, imagen
    };

    const url = 'usuario/signup';

    fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
    }).then(response => {
        if(response.status == 200){
            window.location.replace('/usuario');
        }else if(response.status == 401){
            alert('¡Ya existe un usuario registrado con ese correo!');
        }else{
            alert('Error desconocido, contacte al administrador');
        }
    }).catch(error => {
        console.log('Error al hacer la petición');
        console.log(error);
    });
}
