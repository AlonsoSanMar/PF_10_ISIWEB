
const jsConfetti = new JSConfetti();

// sticky header
window.onscroll = function() {pegajoso()};
let h = document.getElementById("menu-principal");
let s = h.offsetTop;

let carrito_total = parseFloat(localStorage.getItem('carrito_total')) || 0;

function pegajoso() {
  if (window.scrollY > s) {
    h.classList.add("sticky")
    h.style.opacity = '87%';
  } else {
    h.classList.remove("sticky");
    h.style.opacity = '100%';
  }
} 

// --------------------------------------

// Productos ------------------------------------------------------------------------

function removerNodos(id){
    let el = document.getElementById(id);
    while(el.hasChildNodes()){
            el.removeChild(el.firstChild);
    }
}

function agregaProducto(p){
    let divPrincipal = document.getElementById('pr');
    divPrincipal.appendChild(p);
}

function inicioSesion(){
    let boton = document.getElementById('img-user');
}

function cambiaActivo(n){
    let t = document.getElementById('menu-depas').childNodes;
    //console.log(t);
    
    for(let i=0; i < t.length; ++i){
        if(t[i].nodeName == "BUTTON" && t[i].classList.contains('activo')){
            t[i].classList.remove('activo');
        }
    }

    document.getElementById(n).classList.add('activo');

}

function departamento(d, page) {

    let paginacionContainer = document.getElementById('paginacion');
    let currentPage = page;

    paginacionContainer.style.display = 'flex'; //Esto se lo añadi por la busqueda

    removerNodos('pr');

    fetch(`/productos?page=${page}&tipo=${d}`)     // Aqui pedimos los datos en formato JSON a /router/index
        .then(response => response.json())
        .then(data => {

            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

            data.forEach(function (producto) {

                let div = document.createElement('div');
                div.classList.add("producto");

                let img = document.createElement('img');
                img.setAttribute('src', producto.url);

                let title = document.createElement('p');
                title.classList.add('titulo-producto');
                title.textContent = producto.titulo;

                let precio = document.createElement('p');
                precio.classList.add('precio');
                precio.textContent = "$" + producto.precio;

                let limiteCaracteres = 49;
                let descripcion = document.createElement('p');
                descripcion.classList.add('descripcion-producto');
                descripcion.textContent = producto.descripcion;

                if (descripcion.textContent.length > limiteCaracteres) {
                    let textoRecortado = descripcion.textContent.substring(0, limiteCaracteres) + " ...";
                    descripcion.textContent = textoRecortado;
                }

                let leerM = document.createElement('span');
                leerM.textContent = 'Leer más';
                leerM.classList.add('leerM');

                leerM.addEventListener('click', () => {
                    if (leerM.textContent == 'Leer más') {
                        descripcion.textContent = producto.descripcion;
                        leerM.textContent = "Leer menos";
                        leerM.style.color = 'red';
                    } else {
                        descripcion.textContent = descripcion.textContent.substring(0, limiteCaracteres) + " ...";
                        leerM.textContent = "Leer más";
                        leerM.style.color = 'blue';
                    }

                });

                let existe = false;
                let boton, btnFalso;

                for(let i=0; i < carrito.length; ++i){
                    if(carrito[i].nombre == producto.titulo && carrito[i].unidades > 0){

                        existe = true;
                        btnFalso = document.createElement('div');

                        btnFalso.classList = 'btnFalso';
                        let iMenos = document.createElement('i');
                        iMenos.classList += 'fa-solid fa-minus';

                        let number = document.createElement('p');
                        number.className = 'cantidad';
                        number.textContent = carrito[i].unidades;

                        let iMas = document.createElement('i');
                        iMas.classList += 'fa-solid fa-plus';

                        iMas.addEventListener('click', agregarUno);
                        iMenos.addEventListener('click', eliminaUno);

                        btnFalso.append(iMenos);
                        btnFalso.append(number);
                        btnFalso.append(iMas);
    
                    }
                }

                if(!existe){
                    boton = document.createElement('button');
                    boton.classList += 'btn-agregar';
                    boton.addEventListener('click', addToCart);
                    boton.textContent = "Agregar";
                }
                
                div.appendChild(img);
                div.appendChild(title);
                div.appendChild(precio);
                div.appendChild(descripcion);
                div.appendChild(leerM);

                if(existe){
                    div.appendChild(btnFalso);
                }else{
                    div.appendChild(boton);
                }
                agregaProducto(div);
            });
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });

    // Implementa controles de paginación
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            departamento(d, currentPage);
            console.log(currentPage);
        }
    })

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.addEventListener('click', () => {
        let max = 2;
        if(d == 'todo'){
            max = 10; // Cambiar al tener los productos finales
        }
        if (currentPage < max) {
            currentPage++;
            departamento(d, currentPage);
        }
    });

    paginacionContainer.innerHTML = '';
    paginacionContainer.appendChild(prevButton);
    paginacionContainer.appendChild(nextButton);
}


//Inicio de sesion
document.getElementById('img-user').addEventListener('click',()=>{
    window.location.replace("/usuario");
})

// Para que al inicio ya esten los productos
departamento("todo", 1);
// ----------------------------------


// Eventos de los botones de distintos departamentos
document.getElementById('btn-frutasVerduras').addEventListener('click', function () {
    departamento("frutas y verduras", 1);
    cambiaActivo('btn-frutasVerduras');
});

document.getElementById('btn-vinosylicores').addEventListener('click', function () {
    departamento("vinos y licores", 1),
    cambiaActivo('btn-vinosylicores');
});

document.getElementById('btn-abarrotes').addEventListener('click', function () {
    departamento("abarrotes", 1),
    cambiaActivo('btn-abarrotes');
});

document.getElementById('btn-todo').addEventListener('click', function () {
    departamento("todo", 1),
    cambiaActivo('btn-todo');
});

document.getElementById('btn-limpieza').addEventListener('click', function () {
    departamento("productos de limpieza", 1),
    cambiaActivo('btn-limpieza');
});

document.getElementById('btn-salchichoneria').addEventListener('click', function () {
    departamento("salchichoneria", 1),
    cambiaActivo('btn-salchichoneria');
});


document.getElementById('btn-show-cart').addEventListener('click', showCart);
document.getElementById('btn-hide-cart').addEventListener('click', hideCart);

//--------------------------------------------------------------------------------------------

// Funcionalidad del carrito de compras

function addToCart(e){

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let elemento = e.target.parentElement;

    let producto = {
        nombre : elemento.querySelector('.titulo-producto').textContent,
        precio: parseFloat(elemento.querySelector('.precio').textContent.slice(1,-1)),
        imagen: elemento.getElementsByTagName('img')[0].src,
        unidades : 1
    }

    carrito.push(producto);
    carrito_total += producto.precio;
    localStorage.setItem('carrito_total', carrito_total);

    localStorage.setItem('carrito', JSON.stringify(carrito));

    let btnFalso = document.createElement('div');

    btnFalso.classList = 'btnFalso';
    let iMenos = document.createElement('i');
    iMenos.classList += 'fa-solid fa-minus';

    let number = document.createElement('p');
    number.className = 'cantidad';
    number.textContent = '1';

    let iMas = document.createElement('i');
    iMas.classList += 'fa-solid fa-plus';

    iMas.addEventListener('click', agregarUno);
    iMenos.addEventListener('click', eliminaUno);

    btnFalso.append(iMenos);
    btnFalso.append(number);
    btnFalso.append(iMas);
    
    
    e.target.remove();
    elemento.append(btnFalso);

}

function agregarUno(e){

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let carta = e.target.parentElement.parentElement;
    let boton = e.target.parentElement;

    let nombre = carta.querySelector('.titulo-producto').textContent;

    let unidades = 1;
    for(let i = 0; i < carrito.length; ++i){
        if(nombre == carrito[i].nombre){
            carrito[i].unidades += 1;
            carrito_total += carrito[i].precio;
            localStorage.setItem('carrito_total', carrito_total);
            
            unidades = carrito[i].unidades;
            break;
        }
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));

    boton.querySelector('p').textContent = unidades;
}

function eliminaUno(e){

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    let carta = e.target.parentElement.parentElement;
    let botonFalso = e.target.parentElement;

    let nombre = carta.querySelector('.titulo-producto').textContent;

    let unidades;
    for(let i = 0; i < carrito.length; ++i){
        if(nombre == carrito[i].nombre){

            carrito[i].unidades -= 1;
            carrito_total -= carrito[i].precio;
            unidades = carrito[i].unidades;

            if(unidades == 0){
                carrito.splice(i, 1);
            }

            localStorage.setItem('carrito_total', carrito_total);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            
            break;
        }
    }

    if(unidades == 0){
        let boton = document.createElement('button');
        boton.classList += 'btn-agregar';
        boton.addEventListener('click', addToCart);
        boton.textContent = "Agregar";

        botonFalso.remove();
        carta.append(boton);
    }else{
        botonFalso.querySelector('p').textContent = unidades;
    }
}





let cartBody = document.querySelector('.cart-body');
let cartHeader = document.querySelector('.cart-header');
let cartFooter = document.querySelector('.cart-footer');
let cartTitle = document.querySelector('.cart-title');


function showCart(){

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let vacio = true;

    for(let i = 0; i < carrito.length; ++i){
        if(carrito[i].unidades > 0){
            vacio = false;
            break;
        }
    }
    if(vacio){
        document.querySelector('body').style.overflow = 'hidden';

        let container = document.querySelector('.cart-container');
    
        container.style.right = "0";

        cartBody.textContent = '';

        let contenedor = document.createElement('div');
        contenedor.classList += 'centrado';

        textoGrande = document.createElement('p');
        textoGrande.classList += 'texto-grande';
        textoGrande.textContent = '¡Tu carrito está vacío! Sigue explorando para encontrar ofertas increíbles';

    
        contenedor.append(textoGrande);
        cartBody.append(contenedor);

        cartFooter.innerHTML = '';

        return;
    }

    console.log('Muestra carrito');

    document.querySelector('body').style.overflow = 'hidden';

    let container = document.querySelector('.cart-container');

    container.style.right = "0";

    cartBody.innerHTML = '';
    cartFooter.innerHTML = '';
    cartTitle.textContent = 'Tu carrito de compras:';
    

    for(let i=0; i< carrito.length; ++i){

        if(carrito[i].unidades == 0) continue;
        let item = document.createElement('div');
        item.classList += 'cart-item';

        let divInfo = document.createElement('div');
        divInfo.classList = 'cart-item-info';

        let pnombre = document.createElement('p');
        pnombre.textContent = carrito[i].nombre;
        pnombre.classList = 'titulo-producto';

        let pprecio = document.createElement('p');
        pprecio.textContent = '$' + carrito[i].precio;
        pprecio.classList += 'precio';

        let pprecioTotal = document.createElement('p');
        pprecioTotal.textContent = '$' + (carrito[i].precio * carrito[i].unidades).toFixed(2);
        pprecioTotal.classList += 'precio-total';

        let img = document.createElement('img');
        img.setAttribute('src', carrito[i].imagen);
        
        divInfo.append(pnombre);
        divInfo.append(pprecio);
        divInfo.append(pprecioTotal);

        btnFalso = document.createElement('div');

        btnFalso.classList = 'btnFalso';
        let iMenos = document.createElement('i');
        iMenos.classList += 'fa-solid fa-minus';

        let number = document.createElement('p');
        number.className = 'cantidad';
        number.textContent = carrito[i].unidades;

        let iMas = document.createElement('i');
        iMas.classList += 'fa-solid fa-plus';

        iMas.addEventListener('click', insideAdd);
        iMenos.addEventListener('click', insideLess);

        btnFalso.append(iMenos);
        btnFalso.append(number);
        btnFalso.append(iMas);

        item.append(img);
        item.append(divInfo);
        item.append(btnFalso);

        cartBody.appendChild(item);
    }

    btnContinuar = document.createElement('button');
    btnContinuar.classList += 'btn-large';
    btnContinuar.textContent = 'Continuar';

    btnContinuar.addEventListener('click', muestraDirecciones)
    
    lblTotal = document.createElement('label');
    lblTotal.classList = 'lbl-total';
    lblTotal.textContent = 'Total: $' + carrito_total.toFixed(2);

    cartFooter.append(lblTotal);
    cartFooter.append(btnContinuar);
}

function insideAdd(e){

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let boton = e.target.parentElement;
    let carta = e.target.parentElement.parentElement;
    

    let nombre = carta.querySelector('.titulo-producto').textContent;

    let unidades = 1;

    for(let i = 0; i < carrito.length; ++i){
        if(nombre == carrito[i].nombre){
            carrito[i].unidades += 1;
            carrito_total += carrito[i].precio;
            localStorage.setItem('carrito_total', carrito_total);
            unidades = carrito[i].unidades;
            break;
        }
    }
    
    let productos = document.querySelectorAll('.producto');

    for(let i = 0; i < productos.length; ++i){
        let titulo = productos[i].querySelector('.titulo-producto').textContent;
        if(titulo == nombre){
            let lblboton = productos[i].querySelector('.cantidad');
            lblboton.textContent = unidades
            break;
        }
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    boton.querySelector('p').textContent = unidades;
    document.querySelector('.lbl-total').textContent = 'Total: $' + carrito_total.toFixed(2);
}

function insideLess(e){

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let boton = e.target.parentElement;
    let carta = e.target.parentElement.parentElement;
    

    let nombre = carta.querySelector('.titulo-producto').textContent;

    let unidades = 1;

    for(let i = 0; i < carrito.length; ++i){
        if(nombre == carrito[i].nombre){

            carrito[i].unidades -= 1;
            carrito_total -= carrito[i].precio;
            unidades = carrito[i].unidades;

            if(unidades == 0){
                carrito.splice(i, 1);
            }

            localStorage.setItem('carrito_total', carrito_total);
            localStorage.setItem('carrito', JSON.stringify(carrito));
        }
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    if(unidades == 0){
        let productos = document.querySelectorAll('.producto');
        for(let i = 0; i < productos.length; ++i){
            let titulo = productos[i].querySelector('.titulo-producto').textContent;
            if(titulo == nombre){
                let boton_nuevo = document.createElement('button');
                boton_nuevo.classList += 'btn-agregar';
                boton_nuevo.addEventListener('click', addToCart);
                boton_nuevo.textContent = "Agregar";

                botonFalso = productos[i].querySelector('.btnFalso');
                botonFalso.remove();

                productos[i].append(boton_nuevo);
                break;
            }
        }
        boton.parentElement.remove();

    }else{
        let productos = document.querySelectorAll('.producto');

        for(let i = 0; i < productos.length; ++i){
            let titulo = productos[i].querySelector('.titulo-producto').textContent;
            if(titulo == nombre){
                let lblboton = productos[i].querySelector('.cantidad');
                lblboton.textContent = unidades;
                break;
            }
        }
        boton.querySelector('p').textContent = unidades;
    }

    document.querySelector('.lbl-total').textContent = 'Total: $' + carrito_total.toFixed(2);
}

function hideCart(){

    console.log('Esconde carrito');

    //document.querySelector('body').style.height = 'auto';
    document.body.style.overflow = 'auto';

    let container = document.querySelector('.cart-container');
    container.style.right = "-100%";


}

/* FUNCIONALIDAD DEL CARRITO AL HACER UN PEDIDO */

let direccion_elegida;
let arr_direcciones = [];


function muestraDirecciones(){
    
    fetch('/buscar-direcciones')
    .then(response => {
        if (!response.ok) {
            //No se ha iniciado sesión
            cartTitle.textContent = 'Ups...';
            cartBody.innerHTML = '';

            let contenedor = document.createElement('div');
            contenedor.classList += 'centrado';

            textoGrande = document.createElement('p');
            textoGrande.classList += 'texto-grande';
            textoGrande.textContent = 'Parece que no has iniciado sesión :(';

            btnIniciar = document.createElement('button');
            btnIniciar.textContent = 'Ir al inicio de sesión';
            btnIniciar.classList += 'btn-large';

            btnIniciar.addEventListener('click', ()=>{
                window.location.replace('/usuario');
            });
            
            contenedor.append(textoGrande);
            contenedor.append(btnIniciar);

            cartBody.append(contenedor);

            cartFooter.innerHTML = '';
        }
        return response.json();
    })
    .then(data => {
        if (data.length == 0) {
            cartTitle.textContent = 'Escoge una de tus direcciones: ';
            cartBody.innerHTML = '';
            cartFooter.innerHTML = '';

            let contenedor = document.createElement('div');
            contenedor.classList += 'centrado';

            textoGrande = document.createElement('p');
            textoGrande.classList += 'texto-grande';
            textoGrande.textContent = 'No tienes ninguna dirección agregada :(, ¿Por qué no agregas una?';

            let link = document.createElement('a');
            link.setAttribute('href', 'usuario/mis-direcciones');
            link.textContent = 'Ir a mis direcciones';

            contenedor.append(textoGrande);
            contenedor.append(link);
            cartBody.append(contenedor);

            

        } else {
            console.log(data);

            cartTitle.textContent = 'Escoge una de tus direcciones: ';
            cartBody.innerHTML = '';
            cartFooter.innerHTML = '';

            for(let key in data){
                let direccion = data[key];
                
                if(key == 0){
                    direccion_elegida = direccion;
                }

                let  divDireccion = document.createElement('div');
                divDireccion.classList += 'direccion-item';

                if(key == 0){
                    divDireccion.setAttribute('id', 'selected');
                }

                divDireccion.innerHTML = `<p></strong>${direccion.calle}</strong> ${direccion.colonia} ${direccion.ciudad} ${direccion.estado} ${direccion.cp}</p>`;
                arr_direcciones.push(direccion);
                divDireccion.name = key;

                divDireccion.addEventListener('click', seleccionaDireccion);
                cartBody.append(divDireccion);
            }

            //Footer
            cartFooter.innerHTML += `
            <p>¿Deseas agregar o modificar alguna de tus direcciones? Ve a <a href="usuario/mis-direcciones">Mis direcciones</a></p>`;


            let btnAtras = document.createElement('button');
            let btnAdelante = document.createElement('button');

            btnAtras.classList = 'mitad';
            btnAdelante.classList = 'mitad';

            btnAtras.textContent = 'Atrás';
            btnAdelante.textContent = 'Continuar';
            btnAtras.addEventListener('click', showCart);
            btnAdelante.addEventListener('click', revisarOrden);

            cartFooter.append(btnAtras);
            cartFooter.append(btnAdelante);
            
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
}


function seleccionaDireccion(e){
    let elementos = document.querySelectorAll('.direccion-item');

    for(let i = 0; i< elementos.length;  ++i){
        if(elementos[i].id == 'selected'){
            elementos[i].id = '';
        }
    }

    e.currentTarget.id = 'selected';
    direccion_elegida = arr_direcciones[e.currentTarget.name];

}
function revisarOrden(){

    cartTitle.textContent = 'Este es el resumen de tu orden:';
    cartBody.innerHTML = '';
    cartFooter.innerHTML = '';

    let lblProductos = document.createElement('label');
    lblProductos.textContent = 'Tus productos: ';

    let divProductos = document.createElement('div');
    divProductos.classList += 'cart-revisar-productos';
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    for(let i = 0; i < carrito.length; ++i){
        let imgProducto = document.createElement('img');
        imgProducto.src = carrito[i].imagen;
        divProductos.append(imgProducto);
    }

    let lblDireccion = document.createElement('label');
    lblDireccion.textContent = 'Dirección de envio: ';
    
    let divDireccion = document.createElement('div');
    divDireccion.classList += 'direccion-item';

    divDireccion.innerHTML = `
    <p></strong>${direccion_elegida.calle}</strong> ${direccion_elegida.colonia} ${direccion_elegida.ciudad} ${direccion_elegida.estado} ${direccion_elegida.cp}</p>
    `;

    let lblMetodo = document.createElement('label')
    lblMetodo.textContent = 'Método de pago: ';

    let divMetodo = document.createElement('div');
    divMetodo.classList += 'cart-metodo';
    divMetodo.innerHTML = 
    '<i class="fa-solid fa-money-bills"></i> <p>Efectivo a contra-entrega';

    cartBody.append(lblProductos);
    cartBody.append(divProductos);
    cartBody.append(lblDireccion);
    cartBody.append(divDireccion);
    cartBody.append(lblMetodo);
    cartBody.append(divMetodo);


    let btnAtras = document.createElement('button');
    let btnAdelante = document.createElement('button');

    btnAtras.classList = 'mitad';
    btnAdelante.classList = 'mitad btngreen';

    btnAtras.textContent = 'Atrás';
    btnAdelante.textContent = 'Hacer pedido';
    btnAtras.addEventListener('click', muestraDirecciones);
    btnAdelante.addEventListener('click', succes);

    cartFooter.append(btnAtras);
    cartFooter.append(btnAdelante);
}

// Para la barra de busqueda
const searchInput = document.getElementById('barra-buscar');
const sugerencias = document.getElementById('sugerencias');

let lastFetch = null;   // Para evitar que cuando escribas rapido o borres rapido se acumulen las sugerencias repetidas

searchInput.addEventListener('input', async () => {
  const term = searchInput.value;
  sugerencias.innerHTML = '';

  // Cancela la solicitud anterior si aún no se ha completado
  if (lastFetch !== null) {
    lastFetch.abort();
  }

  if (term.length > 0) {
    lastFetch = new AbortController();
    const { signal } = lastFetch;

    try {
      const response = await fetch(`/buscar?term=${term}`, { signal });
      const data = await response.json();

      // Para que solo muestre 5 sugerencias y no todas
      const limiteSugerencias = 4;

      for (let i = 0; i < Math.min(limiteSugerencias, data.length); i++) {
        const producto = data[i];
        const suggestion = document.createElement('li');
        suggestion.textContent = producto.titulo;
  
        suggestion.addEventListener('click', () => {
          searchInput.value = suggestion.textContent;
          removerNodos('sugerencias');
        });
  
        sugerencias.appendChild(suggestion);
      }
      //----------------------------------------------

      /*
      data.forEach((producto) => {
        const suggestion = document.createElement('li');
        suggestion.textContent = producto.titulo;

        suggestion.addEventListener('click', () => {
          searchInput.value = suggestion.textContent;
          removerNodos('sugerencias');
        });

        sugerencias.appendChild(suggestion);
      });*/
    } catch (error) {
      if (error.name === 'AbortError') {ç
        //...
      }
    }
  }
});

function ocultaPaginacion(){
    let btns = document.getElementById('paginacion');
    btns.style.display = 'none';
}

function limpiaBarraBuscar(){
    document.getElementById('barra-buscar').value = '';
}

document.getElementById('btn-busca').addEventListener('click', async ()=>{
    if(searchInput.value.trim() !== ''){
        const term = searchInput.value;
        const response = await fetch(`/buscar?term=${term}`);
        const data = await response.json();

        if(data.length > 0){
            removerNodos('pr');
            removerNodos('sugerencias')
            limpiaBarraBuscar();

            ocultaPaginacion();

            data.forEach((producto) => {
                
                let div = document.createElement('div');
                div.classList.add("producto");

                let img = document.createElement('img');
                img.setAttribute('src', producto.url);

                let title = document.createElement('p');
                title.classList.add('titulo-producto');
                title.textContent = producto.titulo;

                let precio = document.createElement('p');
                precio.classList.add('precio');
                precio.textContent = "$" + producto.precio;

                let limiteCaracteres = 49;
                let descripcion = document.createElement('p');
                descripcion.classList.add('descripcion-producto');
                descripcion.textContent = producto.descripcion;

                if (descripcion.textContent.length > limiteCaracteres) {
                    let textoRecortado = descripcion.textContent.substring(0, limiteCaracteres) + " ...";
                    descripcion.textContent = textoRecortado;
                }

                let leerM = document.createElement('span');
                leerM.textContent = 'Leer más';
                leerM.classList.add('leerM');

                leerM.addEventListener('click', () => {
                    if (leerM.textContent == 'Leer más') {
                        descripcion.textContent = producto.descripcion;
                        leerM.textContent = "Leer menos";
                        leerM.style.color = 'red';
                    } else {
                        descripcion.textContent = descripcion.textContent.substring(0, limiteCaracteres) + " ...";
                        leerM.textContent = "Leer más";
                        leerM.style.color = 'blue';
                    }

                });

                let boton = document.createElement('button');
                boton.classList += 'btn-agregar';
                boton.addEventListener('click', addToCart);
                boton.textContent = "Agregar";

                div.appendChild(img);
                div.appendChild(title);
                div.appendChild(precio);
                div.appendChild(descripcion);
                div.appendChild(leerM);
                div.appendChild(boton);

                agregaProducto(div);


            });
        }
    }
});

async function succes(){
    cartTitle.textContent = '';
    cartBody.innerHTML = '';
    cartFooter.innerHTML = '';

    let dactual = direccion_elegida.calle + ', ' + 
    direccion_elegida.numero + ', ' + direccion_elegida.ciudad + ', ' + direccion_elegida.estado + ', ' + direccion_elegida.cp;

    let fechaActual = new Date();

    const data = {
        direccion: dactual,
        dia: fechaActual.getDate(),
        mes: fechaActual.getMonth() + 1,
        anyo: fechaActual.getFullYear(),
        total: carrito_total.toFixed(2).toString()
    }

    console.log(data);
    const url = 'usuario/registrar-pedido';

    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if(response.status != 200){
            alert('ERROR AL GENERAR EL PEDIDO');
        }
    }).catch(error => {
        alert('Hubo un error al procesar la solicitud, contacte al administrador');
        console.log(error);
    });

    let contenedor = document.createElement('div');
    contenedor.classList += 'centrado';

    textoGrande = document.createElement('p');
    textoGrande.classList += 'texto-grande verde';
    textoGrande.textContent = '¡Listo! Tu pedido se realizó con éxito y llegará de 2 - 5 días hábiles';


    let paloma = document.createElement('i');
    paloma.classList = 'fa-solid fa-circle-check verde gigante';

    contenedor.append(paloma);
    contenedor.append(textoGrande);
    cartBody.append(contenedor);

    jsConfetti.addConfetti();


    carrito = [];
    carrito_total = 0;

    //Cambiar todos los botones
    let botones = document.querySelectorAll('.btnFalso');
    for(let i = 0; i < botones.length; ++i){
        let padre = botones[i].parentElement;

        let boton = document.createElement('button');
        boton.classList += 'btn-agregar';
        boton.addEventListener('click', addToCart);
        boton.textContent = "Agregar";

        botones[i].remove();
        padre.append(boton);
    }

    localStorage.clear();   
}

// Boton para pagina ISIWeb
document.getElementById('btn-isiweb').addEventListener('click',()=>{
    window.location.replace("/nosotros");
})