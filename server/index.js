import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { CONFIG } from "./config/index.js";
import eventRoutes from "./routes/events.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config(); // Load environment variables from .env file

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
	"http://localhost:5173", // Local frontend
	"https://event-chain-chi.vercel.app", // Deployed frontend
];

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
	cors: {
		origin: allowedOrigins,
		methods: ["GET", "POST"],
	},
});

// Middleware configuration
app.use(
	cors({
		origin: (origin, callback) => {
			// Check if the request origin is in the allowed origins
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true); // Allow the request
			} else {
				callback(new Error("Not allowed by CORS")); // Reject the request
			}
		},
		credentials: true,
	})
);
app.use(express.json());

// Store the io instance in the app for use in routes or middleware
app.set("io", io);

// MongoDB Connection
mongoose
	.connect(CONFIG.mongodb.uri, CONFIG.mongodb.options)
	.then(() => console.log("✅ MongoDB Connected"))
	.catch((err) => {
		console.error("MongoDB Connection Error:", err);
		process.exit(1);
	});

// Basic route for testing API availability
app.get("/", (req, res) => {
	res.json({ message: "API is running" });
});

// API routes
app.use(CONFIG.api.routes.events, eventRoutes);

// Error handler middleware
app.use(errorHandler);

// WebSocket connection
io.on("connection", (socket) => {
	console.log("Client connected");
	socket.on("disconnect", () => console.log("Client disconnected"));
});

// Start the server
const PORT = CONFIG.server.port;
httpServer.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});
