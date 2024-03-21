document.querySelector('#btn-atras').addEventListener('click', ()=>{
    window.location.replace("/usuario");
    console.log('Entre\n');
});


document.getElementById('agregar').addEventListener('click', () => {
    window.location.replace("/usuario/nueva-direccion");
});

// JS para eliminar direcciones

const botonesEliminar =document.querySelectorAll('.botonEliminar');

botonesEliminar.forEach(function(btn){
    btn.addEventListener('click', async()=>{
        console.log("click");
        const id = btn.dataset.id;

        try{
            const dato=await fetch(`/usuario/${id}`,{method:'delete'});
            const res = await dato.json();
            if(res.estado){
                alert(res.mensaje);
                window.location.href='/usuario/mis-direcciones';
            }else{
                console.log(res);
            }
        }catch (error){
            console.log(error);
        }
    });
});
