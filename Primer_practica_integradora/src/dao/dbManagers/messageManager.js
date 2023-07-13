import { messageModel } from "../models/messages.js";

export default class Messages {
	async getUserMessages(user) {
		let userMessages;
		try {
			userMessages = await messageModel
				.findOne({ user: user }, { message: 1, _id: 0 })

			userMessages = userMessages ? userMessages.message : [];
		} catch (error) {
			console.log(error);
			userMessages = false;
		}
		return userMessages;
	}

	async saveUser(user) {
		let result;
		try {
			result = await messageModel.create({ user: user });
		} catch (error) {
			result = false;
		}
		return result;
	}

	async saveUserMessage(user, message) {
		let result;
		let userMessages = await this.getUserMessages(user);
		userMessages.push(message);
		result = await messageModel.findOneAndUpdate(
			{ user: user },
			{ message: userMessages }
		);
		return result;
	}
}
