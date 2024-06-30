import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import OpenAI from "openai"
import dotenv from 'dotenv';
import User from "../models/user.model.js";

dotenv.config();

const openai = new OpenAI({
	baseURL: process.env.BASE_URL,
	apiKey: process.env.OPEN_AI_KEY
})

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		await Promise.all([conversation.save(), newMessage.save()]);

		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		const senderSocketId = getReceiverSocketId(senderId);
		if (senderSocketId) {
			io.to(senderSocketId).emit("newMessage", newMessage);
		}

		if (message.includes('@gpt')) {

			const gptUser = await  User.findOne({ username: 'gpt' });
			const gptId = gptUser._id;

			const gptResMessage = await getGptResponse(message.replace('@gpt', '').trim());


			const newGptMessage1 = new Message({
				senderId: gptId,
				receiverId: senderId,
				message: gptResMessage
			});

			const newGptMessage2 = new Message({
				senderId: gptId,
				receiverId,
				message: gptResMessage
			});

			conversation.messages.push(newGptMessage1._id);
			await Promise.all([conversation.save(), newGptMessage1.save(), newGptMessage2.save()]);

			if (senderSocketId) {
				io.to(senderSocketId).emit("newMessage", newGptMessage2);
			}

			if (receiverSocketId) {
				io.to(receiverSocketId).emit("newMessage", newGptMessage1);
			}


		}


		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};


async function getGptResponse(question) {
	const completion = await openai.chat.completions.create({
		model: "microsoft/phi-3-medium-4k-instruct", //"sao10k/l3-euryale-70b",
		messages: [
			{ role: "user", content: question }
		],
	})
	console.log(completion.choices);

	return (completion.choices[0].message.content)
}
