document.querySelector('#btn-atras').addEventListener('click', ()=>{
    window.location.replace("/usuario/mis-direcciones");
    console.log('Entre\n');
});


// Para el formulario de editar direccion

const formularioEditar = document.querySelector('#formulario-editar');
        formularioEditar.addEventListener('submit',async (e)=>{
            e.preventDefault();
            const calle =formularioEditar.elements['calle'].value;
            const numero =formularioEditar.elements['numero'].value;
            const colonia =formularioEditar.elements['colonia'].value;
            const ciudad= formularioEditar.elements['ciudad'].value;
            const estado= formularioEditar.elements['estado'].value;
            const cp= formularioEditar.elements['cp'].value;
            const id = formularioEditar.dataset.id;
                const dato = await fetch(`/usuario/actualizar-dir/${id}`, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({calle, numero, colonia, ciudad, estado, cp})
                });
                const res = await dato.json();
                if(res.estado){
                    alert('La dirección se actualizo de forma correcta');
                    window.location.href='/usuario/mis-direcciones';
                }else{
                    alert('No se pudo actualizar');
                    console.log(res);
                }
});