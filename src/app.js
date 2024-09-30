import express from "express";
import { urlencoded } from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./managers/productManager.js";
const app = express();
const PORT = 8080;

// Routes
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

// Middleware
// Utilizaremos el formato Json.
app.use(express.json());
// para url complejas
app.use(urlencoded({extended:true}));
// Nuestros archivos estaticos
app.use(express.static("src/public"));



// Rutas
// Al utilizar estas rutas, evitamos repeticiones en el codigo de cada router.
app.use("/api/products", productRouter );
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

// Handlebars , configuracion.
app.engine("handlebars", engine());

// Renderizar los archivos que tengan esa extension.
app.set("view engine", "handlebars");

// Donde se encuentran los archivos a renderizar.
app.set("views", "./src/views");

// Manager para actualizar info productos
const manager = new ProductManager("./src/data/products/products.json");

app.get("/", (req,res) => {

res.send("Pagina de inicio, bienvenido 😁👌");
});

// Creamos nuestro servidor.
// utilizamos una referencia de nuestro servidor.
const httpServer = app.listen(PORT, () => {
    console.log(`servidor escuchando desde el puerto: http://localhost:${PORT}`);
});




// Configuramos el servidor con socket, io se recomienda para la instancia del backend.
const io = new Server(httpServer);

// abrimos el servidor con la conexion desde el back
// acuerdo de conexion. recibimos el socket de cliente como parametro para poder recibir y enviar mensajes.

io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado');

    // enviamos los productos al cliente.
    socket.emit("products", await manager.getProducts());

    // Eliminamos el producto.
    socket.on("productDelete", async (id) => {
        await manager.deleteProduct(id);

        // volvemos a enviar la lista actualizada.
        socket.emit("products", await manager.getProducts() );
    } );

    // recibimos el nuevo producto:
    socket.on("newProduct", async (data) => {
        await manager.addProduct(data);
        console.log(`Recibimos el siguiente producto: ${JSON.stringify(data)}`);

        // volvemos a enviar la lista actualizada.
        const updatedProducts = await manager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });


} );
