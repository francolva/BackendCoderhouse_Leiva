import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
	products: {
		type: Array,
		required: true,
		default: [],
	},
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
