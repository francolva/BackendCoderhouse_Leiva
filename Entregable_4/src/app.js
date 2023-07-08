import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server as WebSocketServer } from "socket.io";
import http from "http";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { Product, importProducts, productHandler } from "./ProductManager.js";

// Initialize HTTP and Socket server
const app = express();
const port = 8080;
const server = http.createServer(app);
const io = new WebSocketServer(server, {
	cors: {
		origin: "http://localhost",
		methods: ["GET", "POST"],
		credentials: true,
		transports: ["websocket", "polling"],
	},
	allowEIO3: true,
});

// Initialize middleware for data processing methods
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set handlebars as view engine
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Initialize public static folder
app.use(express.static(__dirname + "/public"));

// Set routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.set("socketio", io);

io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	socket.on("Client: NewProduct", async (newProduct) => {
		const parsedProduct = new Product(newProduct);
		const validation = await productHandler.addProduct(parsedProduct);
		if (!validation) {
			console.log("Error creating the product, verify the input");
			return;
		} else {
			console.log("Form received");
			const updatedProducts = await importProducts();
			socket.emit("Server: RenderProducts", updatedProducts);
		}
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

server.listen(port, () => {
	console.log("Server starting on port", port);
});
