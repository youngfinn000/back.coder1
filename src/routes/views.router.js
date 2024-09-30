import {Router} from "express";
import ProductManager from "../managers/productManager.js";

const viewsRouter = Router();

//Instanciamos nuestro manager de productos.
const manager = new ProductManager("./src/data/products/products.json");



viewsRouter.get("/products", async (req,res) => {
    try {
        const products = await manager.getProducts();
        if(products){
            return res.render("home", {products});
        } else {
            return res.send("No hay productos que mostrar")
        }
    } catch (error) {
        res.status(500).send("Hay un error del servidor");
        console.log(error);
    }
})

// Este router va a trabajar con websocket. para actualizar automaticamente la vista.

viewsRouter.get("/realtimeproducts", (req,res) => {
    try {
        return res.render("realTimeProducts");

    } catch (error) {
        res.status(500).send("Hay un error en el servidor, intente mas tarde");
    }
});






export default viewsRouter;