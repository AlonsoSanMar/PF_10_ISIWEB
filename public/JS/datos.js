document.querySelector('#btn-atras').addEventListener('click', ()=>{
    window.location.replace("/usuario");
    console.log('Entre\n');
});

function habilitarForm(){
    let inputs = document.getElementById('Datos-usuario').childNodes;
    for(let i=0; i< inputs.length; ++i){
        inputs[i].disabled = false;
    }
    let boton = document.getElementById('boton1');
    document.getElementById('Datos-usuario').removeChild(boton);

    let btnActualizar = document.getElementById('btn-modificar');
    btnActualizar.style.display = "block";
}

document.getElementById('boton1').addEventListener('click',habilitarForm);
document.getElementsByName('password')[0].addEventListener('input', verificarPassword);

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


const formularioEditar = document.querySelector('#Datos-usuario');
        
        formularioEditar.addEventListener('submit',async (e)=>{
            let lbl_error = document.getElementById('password-error').textContent;
            if(lbl_error != ''){
                alert('Inserta una contraseña válida');
                return;
            }
            e.preventDefault();
            const nombre =formularioEditar.elements['nombre'].value;
            const apellido =formularioEditar.elements['apellido'].value;
            const correo =formularioEditar.elements['correo'].value;
            const password= formularioEditar.elements['password'].value;
            const imagen= formularioEditar.elements['imagen'].value;
            const id = formularioEditar.dataset.id;
                const dato = await fetch(`/usuario/${id}`, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({nombre, apellido, correo, password, imagen})
                });
                const res = await dato.json();
                if(res.estado){
                    alert('Se actualizó de forma correcta');
                    window.location.href='/usuario/mis-datos';
                }else{
                    alert('No se pudo actualizar');
                    console.log(res);
                }
});
