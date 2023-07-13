import { productModel } from "../models/products.js";

export default class Products {
	async getProducts(limit = false) {
		let products;
		if (!limit || limit < 1 || isNaN(limit)) {
			products = await productModel.find().lean();
		} else {
			products = await productModel.find().limit(limit).lean();
		}
		return products;
	}

	async getProductById(productID) {
		let product;
		try {
			product = await productModel.findById(productID).lean();
		} catch (error) {
			product = false;
		}
		return product;
	}

	async saveProducts(product) {
		let result;
		try {
			result = await productModel.create(product);
		} catch (error) {
			result = false;
		}
		return result;
	}

	async updateProductById(productID, updateRequest) {
		let product;
		try {
			product = await productModel.findByIdAndUpdate(
				productID,
				updateRequest
			);
		} catch (error) {
			product = false;
		}
		return product;
	}

	async deleteProductById(productID) {
		let result;
		try {
			result = await productModel.deleteOne({ _id: productID });
		} catch (error) {
			result = false;
		}
		return result;
	}
}
