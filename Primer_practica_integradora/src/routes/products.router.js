import { Router } from "express";
import Products from "../dao/dbManagers/productManager.js";

const router = Router();
const productHandler = new Products();

router.get("/", async (req, res) => {
	const limit = parseInt(req.query.limit);
	const products = await productHandler.getProducts(limit);
	return res.status(200).send(products);
});

router.get("/:pid", async (req, res) => {
	const productID = req.params.pid;
	const product = await productHandler.getProductById(productID);
	if (!product) {
		return res
			.status(404)
			.send(`Cannot find product with ID: ${productID}`);
	}
	return res.status(200).send(product);
});

router.post("/", async (req, res) => {
	const productRequest = req.body;
	const result = await productHandler.saveProducts(productRequest);
	if (!result) {
		return res
			.status(400)
			.send(
				"Cannot create product, there is and invalid or missing value"
			);
	}
	let msg = Array.isArray(result)
		? "Products created succesfully"
		: `Created product "${result.title}" of ID: ${result._id}`;
	return res.status(200).send(msg);
});

router.put("/:pid", async (req, res) => {
	const productID = req.params.pid;
	const updateProductRequest = req.body;
	const product = await productHandler.updateProductById(
		productID,
		updateProductRequest
	);
	if (!product) {
		return res
			.status(400)
			.send(
				`Cannot update product of ID: ${productID}, check the ID or the product values`
			);
	}
	res.status(200).send(`Updated product of ID: ${productID}`);
});

router.delete("/:pid", async (req, res) => {
	const productID = req.params.pid;
	const result = await productHandler.deleteProductById(productID);
	if (!result) {
		return res
			.status(404)
			.send(`Cannot delete inexistent product. Check ID: ${productID}`);
	}
	res.status(200).send(`Deleted product of ID: ${productID}`);
});

export default router;
