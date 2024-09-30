// Manager de productos.
import { promises as fs } from "fs";


class ProductManager {
    static uId = 1;

    constructor(path){
        this.products = [];
        this.path = path;
    }

    // Crear y agregar un producto nuevo.

    async addProduct({title,description, code, price, status= true, stock, category, thumbnails }){

        // Revisamos nuestro array primero.
        this.products = await this.readFile();
        console.log("nuestro array al iniciar la carga de un producto.");
        console.log(this.products);

        // Validaciones
        // Completar datos del producto.
    if(!title || !description || !code || !price || !stock || !category) {
        console.log('Es necesario completar todos los campos');
        return;
    }

    // Verficamos que no se repita el mismo producto.

    if(this.products.some(item => item.code === code)){
        console.log(`El codigo de producto debe ser unico. el codigo ${code} ya esta registrado en el sistema.`);
        return;
    }


    // Verificamos si existe un producto con el mismo ID
    let newProductId = ProductManager.uId;
    while (this.products.some(item => item.id === newProductId)) {
        newProductId++;
    }

    // Creamos el producto

    const newProduct = {
        id : newProductId,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    }


// Integramos el producto en el array **usando push**
    this.products.push(newProduct);

    //Aca vamos a crear un archivo para guardar esos productos.
    await this.saveFile(this.products);
    }

    // Metodo para obtener la lista de productos total

    async getProducts(){
        try {
            const arrayProducts = await this.readFile();
            return arrayProducts;
        } catch (error) {
            console.log("Error al leer el archivo" , error);
        }
    }

    // Metodo para obtener un producto por id

    async getProductById(id) {
        try {
            const arrayProducts = await this.readFile();
            const productFound = arrayProducts.find(product => product.id === parseInt(id));

            if(!productFound){
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado!");
                return productFound;
            }
        } catch (error) {
            console.log("Error al buscar el producto por id", error);
        }
    }

    // Actualizar informacion de un producto.

    async updateProduct(id, updateProduct){
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(product => product.id === parseInt(id));

            if(index >= 0){
                arrayProducts[index] = { ...arrayProducts[index], ...updateProduct };
                await this.saveFile(arrayProducts);
                console.log("Producto actualizado");
            } else {
                console.log("No se encuentra el producto");
            }

        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    // Eliminar un producto

    async deleteProduct(id){
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(product => product.id === parseInt(id));
    
            if (index >= 0) {
                arrayProducts.splice(index, 1);
                await this.saveFile(arrayProducts);
                console.log('Producto eliminado correctamente');
            } else {
                console.log(`El producto con el id ${id} no esta en el sistema`);
            }
        } catch (error) {
            console.log("Error al eliminar le producto", error);
        }
    }

    // Metodos auxiliares

    async readFile() {
        try{
            const response = await fs.readFile(this.path, "utf-8");
            if(!response){
                console.log("El archivo se encuentra vacio");
                return [];
            } else {
                const arrayProducts = await JSON.parse(response);
                return arrayProducts;
            }
        } catch(err) {
            console.log("Hay un error al leer el archivo", err);
        }

    }

    async saveFile(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
            console.log(`Archivo guardado en ${this.path}`);
        } catch (err) {
            console.log("Error al guardar el archivo", err);
        }
    }
}



export default ProductManager;