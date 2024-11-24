import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { CONFIG } from "./config/index.js";
import eventRoutes from "./routes/events.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables from .env file
dotenv.config();

const app = express(); // Create an Express application
const httpServer = createServer(app); // Create an HTTP server

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173", // Allowed origin for WebSocket connections
		methods: ["GET", "POST"], // Allowed HTTP methods for WebSocket
	},
});

// Middleware setup
app.use(
	cors({
		origin: "http://localhost:5173", // Enable CORS for the specified frontend URL
		credentials: true, // Allow cookies to be sent in cross-origin requests
	})
);
app.use(express.json()); // Parse JSON payloads in incoming requests

// Store io instance in the app for global access
app.set("io", io);

// Connect to MongoDB using Mongoose
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("✅ MongoDB Connected")) // Log success message
	.catch((err) => {
		console.error("MongoDB Connection Error:", err); // Log connection error
		process.exit(1); // Exit the application if unable to connect to MongoDB
	});

// Basic route for testing API availability
app.get("/", (req, res) => {
	res.json({ message: "API is running" }); // Respond with a simple JSON message
});

// API routes
app.use("/api/events", eventRoutes); // Route to handle event-related operations

// Error handler middleware
app.use(errorHandler); // Handles errors and sends appropriate responses

// WebSocket connection management
io.on("connection", (socket) => {
	console.log("Client connected"); // Log when a client connects
	socket.on("disconnect", () => console.log("Client disconnected")); // Log when a client disconnects
});

// Start the server
const PORT = process.env.PORT || 3000; // Use the environment-defined port or default to 3000
httpServer.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`); // Log the port where the server is running
});
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { CONFIG } from "./config/index.js";
import eventRoutes from "./routes/events.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables from .env file
dotenv.config();

const app = express(); // Create an Express application
const httpServer = createServer(app); // Create an HTTP server

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173", // Allowed origin for WebSocket connections
		methods: ["GET", "POST"], // Allowed HTTP methods for WebSocket
	},
});

// Middleware setup
app.use(
	cors({
		origin: "http://localhost:5173", // Enable CORS for the specified frontend URL
		credentials: true, // Allow cookies to be sent in cross-origin requests
	})
);
app.use(express.json()); // Parse JSON payloads in incoming requests

// Store io instance in the app for global access
app.set("io", io);

// Connect to MongoDB using Mongoose
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("✅ MongoDB Connected")) // Log success message
	.catch((err) => {
		console.error("MongoDB Connection Error:", err); // Log connection error
		process.exit(1); // Exit the application if unable to connect to MongoDB
	});

// Basic route for testing API availability
app.get("/", (req, res) => {
	res.json({ message: "API is running" }); // Respond with a simple JSON message
});

// API routes
app.use("/api/events", eventRoutes); // Route to handle event-related operations

// Error handler middleware
app.use(errorHandler); // Handles errors and sends appropriate responses

// WebSocket connection management
io.on("connection", (socket) => {
	console.log("Client connected"); // Log when a client connects
	socket.on("disconnect", () => console.log("Client disconnected")); // Log when a client disconnects
});

// Start the server
const PORT = process.env.PORT || 3000; // Use the environment-defined port or default to 3000
httpServer.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`); // Log the port where the server is running
});
