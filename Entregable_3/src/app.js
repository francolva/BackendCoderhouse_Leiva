import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const productHandler = new ProductManager("./products.json");

async function importProducts() {
	const products = await productHandler.getProducts();
	return products;
}

const products = await importProducts();

app.use(express.urlencoded({ extended: true }));

app.get("/products", (req, res) => {
	let limit = parseInt(req.query.limit);
	if (!limit || limit < 1 || limit > products.length)
		return res.send({ products });
	let filteredProducts = products.slice(0, limit);
	res.send({ filteredProducts });
});

app.get("/products/:pid", (req, res) => {
	const paramID = req.params.pid;
	const findProduct = products.find((product) => product.id === paramID);
    res.send(findProduct)
});

app.listen(8080, () => console.log("Servidor en línea"));
