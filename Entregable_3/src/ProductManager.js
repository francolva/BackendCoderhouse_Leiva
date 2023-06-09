import fs from 'fs';

export default class ProductManager {
	constructor(path) {
		this.products = [];
		this.path = path;
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, "[]");
		}
	}

	async getProducts() {
		const products = await fs.promises.readFile(this.path, "utf-8");
		if (products.length > 0) {
			this.products = JSON.parse(products);
			return this.products;
		}
		return [];
	}

	async getProductById(productID, products) {
		const findProduct = products.find(
			(product) => product.id === productID
		);
		if (!findProduct) {
			console.log("Product not found with ID", `${productID}`);
			return;
		}
		return findProduct;
	}

	async validateProduct(newProduct) {
		let falsyValue = Object.values(newProduct).some(
			(value) => !!value === false && value !== 0
		);
		if (falsyValue) {
			console.log("There is an invalid or missing value");
			return false;
		}
		const products = await this.getProducts();
		const findProduct = products.find(
			(product) => product.id === newProduct.id
		);
		if (findProduct) {
			console.log("ID already exists");
			return false;
		}
		return true;
	}

	async insertProducts(products) {
		await fs.promises.writeFile(
			this.path,
			JSON.stringify(products),
			(error) => {
				console.log(error);
			}
		);
	}

	async addProduct(product) {
		const validation = await this.validateProduct(product);
		if (!validation) {
			console.log("Invalid product");
			return false;
		}
		const products = await this.getProducts();
		const newProducts = [...products, product];
		await this.insertProducts(newProducts);
	}

	async updateProduct(productID, updatedProduct) {
		const products = await this.getProducts();
		const findProduct = await this.getProductById(productID, products);
		Object.assign(findProduct, updatedProduct);
		await this.insertProducts(products);
	}

	async deleteProduct(productID) {
		const products = await this.getProducts();
		const findProduct = await this.getProductById(productID, products);
		const productIndex = products.findIndex(
			(product) => product === findProduct
		);
		const removedProduct = products.splice(productIndex, 1);
		if (!removedProduct) {
			console.log("Error removing product", `${findProduct}`);
			return;
		}
		await this.insertProducts(products);
	}
}

class Product {
	constructor(title, description, price, thumbnail, stock) {
		this.id = Date.now().toString();;
		this.title = title;
		this.description = description;
		this.price = price;
		this.thumbnail = thumbnail;
		this.stock = stock;
	}
}

// const productHandler = new ProductManager('./products.json')

// const firstProduct = new Product('Smart TV', 'Televisor inteligente 4K', 210000, 'no', 2);
// const secondProduct = new Product('Smartphone', 'Celular inteligente', 90000, 'no', 12);
// const thirdProduct = new Product('Playstation', 'Consola de videojuegos', 550000, 'no', 5);

// productHandler.addProduct(firstProduct);
// productHandler.addProduct(secondProduct);
// productHandler.addProduct(thirdProduct);
