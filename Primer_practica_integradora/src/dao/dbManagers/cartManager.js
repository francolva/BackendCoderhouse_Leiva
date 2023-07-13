import { cartModel } from "../models/carts.js";

export default class Carts {
	async getCarts(limit = false) {
		let carts;
		if (!limit || limit < 1 || isNaN(limit)) {
			carts = await cartModel.find().lean();
		} else {
			carts = await cartModel.find().limit(limit).lean();
		}
		return carts;
	}

	async getCartById(cartID) {
		let cart;
		try {
			cart = await cartModel.findById(cartID).lean();
		} catch (error) {
			cart = false;
		}
		return cart;
	}

	async saveCart() {
		let result;
		try {
			result = await cartModel.create({});
		} catch (error) {
			result = false;
		}
		return result;
	}

	async updateCartById(cartID, updateRequest) {
		let cart;
		try {
			cart = await cartModel.findByIdAndUpdate(cartID, updateRequest);
		} catch (error) {
			cart = false;
		}
		return cart;
	}

	async validateProduct(productID, products) {
		const findProduct = products.find(
			(product) => product._id.toString() === productID
		);
		return findProduct;
	}

	async getProductInCart(cart, productID) {
		const productInCart = cart.products.find(
			(product) => product._id.toString() === productID
		);
		return productInCart;
	}

	async addProductToCart(cartID, productID, productList, quantity = 1) {
		let result = true;
        quantity = quantity > 0 ? quantity : 1;
		const foundCart = await this.getCartById(cartID);
		const foundProduct = await this.validateProduct(productID, productList);
		if (!foundProduct || !foundCart || quantity > foundProduct.stock) {
			return (result = false);
		}
		const productInCart = await this.getProductInCart(foundCart, productID);
		let newProduct = { _id: productID, quantity: quantity };
		if (!productInCart) {
			const newProducts = [...foundCart.products, newProduct];
			Object.assign(foundCart.products, newProducts);
			await this.updateCartById(cartID, foundCart);
			console.log(`Added product ${productID} to cart ${cartID}`);
			return result;
		}
		newProduct.quantity = productInCart.quantity + quantity;
		Object.assign(productInCart, newProduct);
		await this.updateCartById(cartID, foundCart);
		console.log(`Added product ${productID} to cart ${cartID}`);
		return result;
	}

	async deleteCartById(cartID) {
		let result;
		try {
			result = await cartModel.deleteOne({ _id: cartID });
		} catch (error) {
			result = false;
		}
		return result;
	}
}
