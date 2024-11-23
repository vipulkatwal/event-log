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

// Dynamic origin handling for CORS
const allowedOrigins = [
	"http://localhost:5173", // Local frontend
	"https://event-chain-chi.vercel.app", // Deployed frontend
];

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
	cors: {
		origin: allowedOrigins, // Allow connections from local and deployed origins
		methods: ["GET", "POST"], // Allow specified HTTP methods
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
		credentials: true, // Allow credentials to be sent with requests
	})
);
app.use(express.json()); // Parse incoming JSON payloads

// Store the io instance in the app for use in routes or middleware
app.set("io", io);

// MongoDB Connection
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("✅ MongoDB Connected")) // Log success message if connected
	.catch((err) => {
		console.error("MongoDB Connection Error:", err); // Log error if connection fails
		process.exit(1); // Exit process if connection fails
	});

// Basic route for testing API availability
app.get("/", (req, res) => {
	res.json({ message: "API is running" }); // Respond with a simple message
});

// API routes
app.use("/api/events", eventRoutes); // Mount event-related routes at '/api/events'

// Error handler middleware
app.use(errorHandler); // Handle errors globally using the custom error handler

// WebSocket connection
io.on("connection", (socket) => {
	console.log("Client connected"); // Log when a client connects to the server
	socket.on("disconnect", () => console.log("Client disconnected")); // Log when a client disconnects
});

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`); // Log the server start message with port
});
