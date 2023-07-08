import { Router } from "express";
import { importProducts } from "../ProductManager.js";

const router = Router();
const products = await importProducts();

router.get("/home", (req, res) => {
	let limit = parseInt(req.query.limit);
    let filteredProducts = []
	if (!limit || limit < 1 || limit > products.length) {
		filteredProducts = products;
	}
    else {
        filteredProducts = products.slice(0, limit);
        if (!Array.isArray(filteredProducts))
            return res.status(500).send("Unexpected error");
    };
	res.render("home", { products: filteredProducts });
});

router.get("/home/:pid", (req, res) => {
	const productID = req.params.pid;
	const findProduct = products.find((product) => product.id === productID);
	if (!findProduct) {
		return res
			.status(404)
			.send(`Cannot find product with ID: ${productID}`);
	}
    res.render("home", { products: {findProduct} });
});

router.get("/realtimeproducts", (req, res) => {
	res.render("realTimeProducts", { products });
});

export default router;
