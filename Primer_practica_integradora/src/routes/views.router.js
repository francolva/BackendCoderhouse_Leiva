import { Router } from "express";
import Products from "../dao/dbManagers/productManager.js";

const router = Router();
const productHandler = new Products();

router.get("/home", async (req, res) => {
	const limit = parseInt(req.query.limit);
	const products = await productHandler.getProducts(limit);
	res.render("home", { products });
});

router.get("/home/:pid", async (req, res) => {
	const productID = req.params.pid;
	const product = await productHandler.getProductById(productID);
	if (!product) {
		return res
			.status(404)
			.send(`Cannot find product with ID: ${productID}`);
	}
	res.render("home", { product });
});

router.get("/realtimeproducts", async (req, res) => {
	const products = await productHandler.getProducts();
	res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
	res.render("chat", {});
});

export default router;
