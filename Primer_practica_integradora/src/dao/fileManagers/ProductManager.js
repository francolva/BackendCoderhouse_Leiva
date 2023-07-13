import fs from "fs";

export class ProductManager {
	constructor(path) {
		this.path = path;
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, "[]");
		}
	}

	async getProducts() {
		const products = await fs.promises.readFile(this.path, "utf-8");
		return products.length > 0 ? JSON.parse(products) : [];
	}

	async getProductById(productID, products) {
		const findProduct =
			products.find((product) => product.id === productID) || false;
		return findProduct;
	}

	async validateContent(newProduct) {
		const falsyValue = Object.values(newProduct).some(
			(value) => !!value === false && value !== 0
		);
		if (falsyValue) {
			console.error("There is an invalid or missing value");
			return false;
		}
		return true;
	}

	async validateID(newProduct, products) {
		const existingProduct = await this.getProductById(newProduct.id, products);
		if (existingProduct) {
			console.error("ID already exists");
			return false;
		}
		return true;
	}

	async insertProducts(products) {
		await fs.promises.writeFile(
			this.path,
			JSON.stringify(products),
			(error) => {
				console.error(error);
			}
		);
		return;
	}

	async addProduct(product) {
		const products = await this.getProducts();
		const validContent = await this.validateContent(product);
		const validID = await this.validateID(product, products);
		const validation = validContent && validID;
		if (!validation) {
			console.log("Invalid product");
			return validation;
		}
		const newProducts = [...products, product];
		await this.insertProducts(newProducts);
		console.log("Added product with ID", `${product.id}`);
		return validation;
	}

	async updateProduct(productID, updatedProduct) {
		const products = await this.getProducts();
		let validation = await this.validateContent(updatedProduct);
		if (!validation) {
			console.log("Invalid updated product");
			return validation;
		}
		const findProduct = await this.getProductById(productID, products);
		if (!findProduct) {
			console.log("Error updating product", `${productID}`);
			return (validation = false);
		}
		Object.assign(findProduct, updatedProduct);
		await this.insertProducts(products);
		console.log("Updated product with ID", `${productID}`);
		return validation;
	}

	async deleteProduct(productID) {
		const products = await this.getProducts();
		let validation = true;
		const findProduct = await this.getProductById(productID, products);
		if (!findProduct) {
			console.log("Error removing product", `${productID}`);
			return (validation = false);
		}
		const productIndex = products.findIndex(
			(product) => product === findProduct
		);
		products.splice(productIndex, 1);
		await this.insertProducts(products);
		console.log("Deleted product with ID", `${productID}`);
		return validation;
	}
}

export class Product {
	constructor({
		title,
		description,
		code,
		price,
		status,
		stock,
		category,
		thumbnail,
	}) {
		this.id = Date.now().toString();
		this.title = title;
		this.description = description;
		this.code = code;
		this.price = price;
		this.status = status;
		this.stock = stock;
		this.category = category;
		this.thumbnail = thumbnail;
	}
}

export const productHandler = new ProductManager("./products.json");

export async function importProducts() {
	const products = await productHandler.getProducts();
	return products;
}
