import fs from "fs";

export class CartManager {
	constructor(path) {
		this.carts = [];
		this.path = path;
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, "[]");
		}
	}

	async getCarts() {
		const carts = await fs.promises.readFile(this.path, "utf-8");
		if (carts.length > 0) {
			this.carts = JSON.parse(carts);
			return this.carts;
		}
		return [];
	}

	async getCartById(cartID, carts) {
		const findCart = carts.find((cart) => cart.id === cartID);
		if (!findCart) {
			return false;
		}
		return findCart;
	}

	async validateCart(newCart) {
		let falsyValue = Object.values(newCart).some(
			(value) => !!value === false
		);
		if (falsyValue) {
			console.log("There is an invalid or missing value");
			return false;
		}
		const carts = await this.getCarts();
		const findCart = carts.find((cart) => cart.id === newCart.id);
		if (findCart) {
			console.log("ID already exists");
			return false;
		}
		return true;
	}

	async validateProduct(productID, allProducts) {
		const findProduct = allProducts.find(
			(product) => product.id === productID
		);
		return findProduct;
	}

	async getProductInCart(productID, cart) {
		const productInCart = cart.products.find(
			(product) => product.id === productID
		);
		return productInCart;
	}

	async insertCarts(carts) {
		await fs.promises.writeFile(
			this.path,
			JSON.stringify(carts),
			(error) => {
				console.log(error);
			}
		);
		return;
	}

	async addCart(cart) {
		let validation = await this.validateCart(cart);
		if (!validation) {
			console.log("Invalid cart");
			return validation;
		}
		const carts = await this.getCarts();
		const newCarts = [...carts, cart];
		await this.insertCarts(newCarts);
		console.log("Added cart with ID", `${cart.id}`);
		return validation;
	}

	async addProductToCart(cartID, productID, allProducts) {
        let validation = true
		const carts = await this.getCarts();
		const foundCart = await this.getCartById(cartID, carts);
		const foundProduct = await this.validateProduct(productID, allProducts);
		if (!foundProduct || !foundCart) {
			return validation = false;
		}
		const productInCart = await this.getProductInCart(productID, foundCart);
        console.log("Prod en cart", productInCart);
        let newProduct = { id: productID, quantity: 1 };
		if (!productInCart) {
            const newProducts = [...foundCart.products, newProduct]
			Object.assign(foundCart.products, newProducts);
            await this.insertCarts(carts);
            console.log(`Added product ${productID} to cart ${cartID}`)
            return validation;
		}
        newProduct.quantity = productInCart.quantity + 1;
		Object.assign(productInCart, newProduct);
		await this.insertCarts(carts);
        console.log(`Added product ${productID} to cart ${cartID}`)
        return validation;
	}
}

export class Cart {
	constructor() {
		this.id = "CART" + Date.now().toString();
		this.products = [];
	}
}

export const cartHandler = new CartManager("./carts.json")

export async function importCarts() {
	const carts = await cartHandler.getCarts();
	return carts;
}
