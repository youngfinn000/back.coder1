// Manager de carts
import {promises as fs} from "fs";



class CartManager {
    static uId = 1;

    constructor(cartPath, productsPath) {
        //Arreglo que almacenara los productos agregados al carrito.
        this.carts = [];
        this.cartPath = cartPath;
        this.productsPath = productsPath;
    }

    //hacemos una carga de los productos creados en el archivo products.json.

    async loadProducts() {
        try {
            const data = await fs.readFile(this.productsPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            return [];
        }
    }

    // Creamos un nuevo carrito.
    async createCart(){

        let newCartId = CartManager.uId;

        this.carts = await this.readFile();

        while(this.carts.some(cart => cart.id === newCartId)){
            newCartId++;
        }
        const newCart = {
            name: "Cart",
            id: newCartId,
            productsInCart: []
        };

        this.carts.push(newCart);
        console.log(this.carts);
        await this.saveFile(this.carts);

        return newCart;
    }

    // para agregar productos al carrito especifico.
    async addProductToCart(cartId, productId) {
        //Revisamos los carritos existentes
        this.carts = await this.readFile();
        // buscamos si hay un carrito con el id.
        const cart = this.carts.find(cart => cart.id === parseInt(cartId));


        // Si no lo hay , avisamos por consola que no existe.
        if (!cart) {
            console.log(`El carrito con el id ${cartId} no existe`);
            return;
        }

        // Buscamos entre nuestros productos creados que exista uno con ese id
        const products = await this.loadProducts();
        console.log(products);
        const product = products.find(item => item.id === parseInt(productId));
        console.log(product);
        
        // Si no hay en nuestra base de datos un producto con ese id, lo enviamos por consola.
        if(!product){
            console.log(`No existe un producto con el id ${productId}`);
            return;
        }

        //Aca revisamos si ya existe un producto con ese id en el carrito.
        const productInCart = cart.productsInCart.find(item => item.id === product.id);

        // Si el producto se encuentra en el carrito, solo aumentamos su cantidad en 1 unidad, caso contrario, tomamos el id del producto de nuestra base en un nuevo objeto con la propiedad cantidad en 1 unidad.
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.productsInCart.push({ id: product.id, quantity: 1 });
        }

        // Guardamos y actualizamos el carrito.
        await this.saveFile(this.carts);
        return this.carts;
    }

    // Mostrar el carrito
    async getCartById(id) {
        try {
            const arrayCarts = await this.readFile();
            const cartFound = arrayCarts.find(cart => cart.id === parseInt(id));

            if(!cartFound){
                console.log("Carrito no encontrado");
                return null;
            } else {
                console.log("Carrito encontrado");
                return cartFound;
            }
        } catch (error) {
            console.log("Error al bsucar el carrito", error);
        }
    }

// Métodos auxiliares para leer y guardar archivos
async readFile() {
    try {
        const response = await fs.readFile(this.cartPath, 'utf-8');
        if (!response) {
            console.log("El archivo se encuentra vacío");
            return [];
        } else {
            return JSON.parse(response);
        }
    } catch (err) {
        console.log("Hay un error al leer el archivo", err);
        return [];
    }
}

async saveFile(arrayCarts) {
    try {
        await fs.writeFile(this.cartPath, JSON.stringify(arrayCarts, null, 2));
        console.log(`Archivo guardado en ${this.cartPath}`);
    } catch (err) {
        console.log("Error al guardar el archivo", err);
    }
}
}


export default CartManager;





