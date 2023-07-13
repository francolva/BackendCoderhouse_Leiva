import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server as WebSocketServer } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";

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

// Set handlebars as view engine
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Initialize public static folder
app.use(express.static(__dirname + "/public"));

// Set routes
app.use("/", viewsRouter);

app.set("socketio", io);

// Messages will be stored on this list
let messages =[];

// Initialize io socket
io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	socket.on("client:userLogged", user => {
		socket.broadcast.emit("server:userLogged", {user:user});
		io.emit("messageLogs", messages);
	})

	socket.on("message", data => {
		messages.push(data);
		io.emit("messageLogs", messages);
	})

	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

server.listen(port, () => {
	console.log("Server starting on port", port);
});
