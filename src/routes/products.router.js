// Router de products
import ProductManager from "../managers/productManager.js" ;
import {Router} from "express";
const productRouter = Router();

//Instanciamos nuestro manager de productos.
const manager = new ProductManager("./src/data/products/products.json");


// GET

//http://localhost:8080/api/products?limit=(numero que da el limite a mostrar).
productRouter.get('/',async (req,res) => {
        const arrayProducts = await manager.getProducts();
        const limit = req.query.limit;
    // Aqui debemos renderizar los products.
        try {
                if(limit) {
                    res.send(arrayProducts.slice(0,limit));
                } else {
                    res.send(arrayProducts);
                }
        } catch (error) {
            res.status(500).send("Error del servidor");
            console.log(error);
        }
})


productRouter.get("/:pid", async (req,res) => {
    const {pid} = req.params;

    try {
        const productFound = await manager.getProductById(pid);
        if(!productFound) {
            res.send(`No hay productos con el id ${pid}`);
        } else {
            res.send(productFound);
        }
    } catch (error) {
        res.status(204).send("Error al buscar porductos con ese id")
    }
});

// POST

productRouter.post("/", async (req,res) => {
    const newProduct = req.body;

    try {
        if(!newProduct) {
            res.send("El producto que intenta crear esta vacio");
        } else {
            await manager.addProduct(newProduct);
            res.send("Se envio la solicitud exitosamente");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("No puede crearse el producto");
    }
});

// PUT

productRouter.put("/:pid", async (req, res) => {
    const {pid} = req.params;
    const updateProduct = req.body;

    try {
        if (!updateProduct) {
        res.status(400).send("Se encuentra vacia la informacion a actualizar");
        return;
    }
    const productFound = await manager.getProductById(pid);
    if (!productFound) {
        res.status(404).send(`No se encontró producto con el id ${pid}`);
        return;
    }
        await manager.updateProduct(pid, updateProduct);
        res.send("Producto actualizado con exito!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar el producto");
    }
});


// DELETE

productRouter.delete("/:pid", async (req,res) => {
    const {pid} = req.params;
    // Revisamos primero si hay un producto con ese id.
    const productFound = await manager.getProductById(pid);
    try {
        if(!pid){
            res.send("es necesario el id para poder eliminar el producto");
            return;
        }
        if(!productFound){
                res.status(404).send(`No se encontró producto con el id ${pid}`);
                return;
            } else {
                await manager.deleteProduct(pid);
                res.send("Producto eliminado de forma exitosa");
            }

    } catch (error) {
        res.send("No se pudo eliminar el producto");
    }
})

export default productRouter;