import { Router } from "express";
import { Product, importProducts, productHandler } from "../ProductManager.js";

const router = Router();
const products = await importProducts();

router.get("/", (req, res) => {
	let limit = parseInt(req.query.limit);
	if (!limit || limit < 1 || limit > products.length) {
		return res.status(200).send(products);
	}
	const filteredProducts = products.slice(0, limit);
	if (!Array.isArray(filteredProducts))
		return res.status(500).send("Unexpected error");
	res.status(200).send({ filteredProducts });
});

router.get("/:pid", (req, res) => {
	const productID = req.params.pid;
	const findProduct = products.find((product) => product.id === productID);
	if (!findProduct) {
		return res
			.status(404)
			.send(`Cannot find product with ID: ${productID}`);
	}
	res.status(200).send(findProduct);
});

router.post("/", async (req, res) => {
	const productRequest = req.body;
	const parsedProduct = new Product(productRequest);
	const validation = await productHandler.addProduct(parsedProduct);
	if (!validation) {
		return res
			.status(400)
			.send(
				"Cannot create product, there is and invalid or missing value"
			);
	}
	res.status(200).send(
		`Created product "${parsedProduct.title}" of ID: ${parsedProduct.id}`
	);
});

router.put("/:pid", async (req, res) => {
	const productID = req.params.pid;
	const updateProductRequest = req.body;
	const validation = await productHandler.updateProduct(
		productID,
		updateProductRequest
	);
	if (!validation) {
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
	const validation = await productHandler.deleteProduct(productID);
	if (!validation) {
		return res
			.status(404)
			.send(`Cannot delete inexistent product. Check ID: ${productID}`);
	}
	res.status(200).send(`Deleted product of ID: ${productID}`);
});

export default router;
