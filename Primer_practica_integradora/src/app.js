import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server as WebSocketServer } from "socket.io";
import http from "http";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import Products from "./dao/dbManagers/productManager.js";
import Messages from "./dao/dbManagers/messageManager.js";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const connection = mongoose.connect(
	"mongodb+srv://francolva:EF4AD31A9E5BBB88B717FB12885B61874932BB115533BA093CAC1D41D8D89548@codercluster.ek975pq.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

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

// Initialize manager instances
const productHandler = new Products();
const messageHandler = new Messages();

// Initialize message list
let messages = [];

// Begin socket management
io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	// Socket management for realTimeProducts view
	socket.on("client:newProduct", async (newProduct) => {
		const parsedProduct = await productHandler.saveProducts(newProduct);
		if (!parsedProduct) {
			console.log("Error creating the product, verify the input");
			return;
		} else {
			console.log("Form received");
			const updatedProducts = await productHandler.getProducts();
			socket.emit("server:renderProducts", updatedProducts);
		}
	});

	// Socket management for chat view
	socket.on("client:userLogged", user => {
		socket.broadcast.emit("server:userLogged", {user:user});
		messageHandler.saveUser(user);
		io.emit("messageLogs", messages);
	})

	socket.on("client:message", data => {
		messages.push(data);
		messageHandler.saveUserMessage(data.user, data.message)
		io.emit("server:messageLogs", messages);
	})

	// Socket disconnected
	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

// Server listening on given port
server.listen(port, () => {
	console.log("Server starting on port", port);
});
