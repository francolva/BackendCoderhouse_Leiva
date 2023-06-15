import fs from "fs";

export class ProductManager {
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
			return false;
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
		return;
	}

	async addProduct(product) {
		let validation = await this.validateProduct(product);
		if (!validation) {
			console.log("Invalid product");
			return validation;
		}
		const products = await this.getProducts();
		const newProducts = [...products, product];
		await this.insertProducts(newProducts);
		console.log("Added product with ID", `${product.id}`)
		return validation;
	}

	async updateProduct(productID, updatedProduct) {
		let validation = await this.validateProduct(updatedProduct);
		if (!validation) {
			console.log("Invalid updated product");
			return validation;
		}
		const products = await this.getProducts();
		const findProduct = await this.getProductById(productID, products);
		if (!findProduct) {
			console.log("Error updating product", `${productID}`);
			return validation = false;
		}
		Object.assign(findProduct, updatedProduct);
		await this.insertProducts(products);
		console.log("Updated product with ID", `${productID}`)
		return validation;
	}

	async deleteProduct(productID) {
		let validation = true;
		const products = await this.getProducts();
		const findProduct = await this.getProductById(productID, products);
		if (!findProduct) {
			console.log("Error removing product", `${productID}`);
			return validation = false;
		}
		const productIndex = products.findIndex(
			(product) => product === findProduct
		);
		products.splice(productIndex, 1);
		await this.insertProducts(products);
		console.log("Deleted product with ID", `${productID}`)
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

// // Productos de ejemplo para crear el products.json:
// const smartTV = {
// 	title:"Smart TV",
// 	description:"Televisor inteligente 4K",
// 	code:"SMTV4K",
// 	price:210000,
// 	status:true,
// 	stock:4,
// 	category:"Electrónicos",
// 	thumbnail:"none",
// }

// const smartPhone = {
// 	title:"Smartphone",
// 	description:"Celular inteligente",
// 	code:"SMTPH",
// 	price:90000,
// 	status:true,
// 	stock:12,
// 	category:"Electrónicos",
// 	thumbnail:"none",
// }

// const gameConsole = {
// 	title:"Playstation 5",
// 	description:"Consola de videojuegos",
// 	code:"SNYPS5",
// 	price:550000,
// 	status:true,
// 	stock:5,
// 	category:"Electrónicos",
// 	thumbnail:"none",
// }

// // Esto devuelve el products.json con sólo el último producto (gameConsole):
// const productList = [smartTV, smartPhone, gameConsole]
// productList.forEach(element => {
// 	const product = new Product(element);
// 	productHandler.addProduct(product);
// });

// // Esto funciona si ejecuto de a un par de líneas por ejecución:
// Primera ejecución (luego comento)
// const firstProduct = new Product(smartTV);
// productHandler.addProduct(firstProduct);

// // Segunda ejecución (luego comento)
// const secondProduct = new Product(smartPhone);
// productHandler.addProduct(secondProduct);

// // Tercera ejecución
// const thirdProduct = new Product(gameConsole);
// productHandler.addProduct(thirdProduct);
