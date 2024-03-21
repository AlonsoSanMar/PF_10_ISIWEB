document.querySelector('#btn-atras').addEventListener('click', ()=>{
    window.location.replace("/");
});

document.getElementById('btn-direcciones').addEventListener('click', ()=>{
    window.location.replace('/usuario/mis-direcciones');
});

document.getElementById('btn-misdatos').addEventListener('click', ()=>{
    window.location.replace('/usuario/mis-datos');
});

document.getElementById('btn-pedidos').addEventListener('click', ()=>{
    window.location.replace('/usuario/mis-pedidos');
})