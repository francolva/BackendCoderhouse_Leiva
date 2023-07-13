import { Router } from "express";
import Carts from "../dao/dbManagers/cartManager.js";
import Products from "../dao/dbManagers/productManager.js";

const router = Router();
const cartHandler = new Carts();

router.post("/", async (req, res) => {
	const newCart = await cartHandler.saveCart();
	if (!newCart) {
		return res.status(500).send("Unexpected error, cannot create cart");
	}
	res.status(200).send(`Created cart of ID: ${newCart._id}`);
});

router.get("/:cid", async (req, res) => {
	const cartID = req.params.cid;
	const cart = await cartHandler.getCartById(cartID);
	if (!cart) {
		return res.status(404).send(`Cannot find cart with ID: ${cartID}`);
	}
	res.status(200).send(cart.products);
});

router.post("/:cid/product/:pid", async (req, res) => {
	const cartID = req.params.cid;
	const productID = req.params.pid;
	const quantity = parseInt(req.query.quantity) || 1;
    console.log(quantity)
	const productHandler = new Products();
	const productList = await productHandler.getProducts();
	const result = await cartHandler.addProductToCart(
		cartID,
		productID,
		productList,
		quantity
	);
	if (!result) {
		return res
			.status(400)
			.send(`Cannot add product ${productID} to cart ${cartID}`);
	}
	res.status(200).send(`Added product ${productID} cart of ID: ${cartID}`);
});

export default router;
