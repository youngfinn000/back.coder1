// Js lado cliente
//  Aca vamos a instanciar nuestro socket del lado del cliente.

const socket = io();


// Elementos del DOM seleccionados
const productForm = document.querySelector(".productForm");
const productContainer = document.querySelector(".containerProducts");


// Recibimos los productos y renderizamos.
socket.on("products", (products) => {
    renderProducts(products);
});

//Actualizamos los datos con los nuevos productos.
socket.on("updateProducts", (productsUpdate)=> {
    renderProducts(productsUpdate);

});
// Funcion para renderizar los productos.

function renderProducts(array) {
    productContainer.innerHTML = '';

    array.forEach(product => {
        const productDiv = document.createElement("div");

        productDiv.classList.add("card");

        productDiv.id = product.id;

        productDiv.innerHTML = `
            <h3>Title: ${product.title}</h3>
            <p>Description: ${product.description}</p>
            <p>Price: ${product.price}</p>
            <button class="delete">Delete</button>
        `;
        productContainer.appendChild(productDiv);

        //boton para eliminar el producto.
        productDiv.querySelector("button").addEventListener("click", () => {
            productDelete(product.id);
        })

    });

}

// Funcion para eliminar productos.
function productDelete(id) {
    socket.emit("productDelete", id);
}

// Trabajamos con el formulario para poder crear un producto con el evento "submit".

productForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    
    //formData utiliza los datos del formulario en pares clave valor
    const formData = new FormData(productForm);
    // con object.fromEntries lo convertimos a un objeto de Js.
    const productData = Object.fromEntries(formData.entries());

    //Enviamos al servidor la informacion del nuevo producto.
    socket.emit("newProduct", productData);
    // reseteamos el formulario.
    productForm.reset();
});



