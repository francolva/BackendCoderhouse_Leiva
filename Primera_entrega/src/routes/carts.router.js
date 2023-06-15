import { Router } from "express";
import { Cart, importCarts, cartHandler } from "../CartManager.js";
import { importProducts } from "../ProductManager.js";

const router = Router();
const carts = await importCarts();
const products = await importProducts();

router.post("/", async (req, res) => {
	const newEmptyCart = new Cart();
	const validation = await cartHandler.addCart(newEmptyCart);
	if (!validation) {
		return res.status(500).send("Unexpected error, cannot create cart");
	}
	res.status(200).send(`Created cart of ID: ${newEmptyCart.id}`);
});

router.get("/:cid", (req, res) => {
	const cartID = req.params.cid;
	const findCart = carts.find((cart) => cart.id === cartID);
	if (!findCart) {
		return res.status(404).send(`Cannot find cart with ID: ${cartID}`);
	}
	res.status(200).send(findCart.products);
});

router.post("/:cid/product/:pid", async (req, res) => {
	const cartID = req.params.cid;
	const productID = req.params.pid;
	const validation = await cartHandler.addProductToCart(
		cartID,
		productID,
		products
	);
    if (!validation) {
		return res.status(400).send(`Cannot add product ${productID} to cart ${cartID}`);
	}
	res.status(200).send(`Added product ${productID} cart of ID: ${cartID}`);
});

export default router;
