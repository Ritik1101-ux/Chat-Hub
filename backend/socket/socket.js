import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
	origin: process.env.FRONT_END_URL, 
	methods: ['GET', 'POST'],
	credentials: true,
}));

const server = http.createServer(app);

// Socket.IO server setup
const io = new Server(server, {
	cors: {
		origin: process.env.FRONT_END_URL, 
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };
