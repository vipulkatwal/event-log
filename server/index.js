import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { CONFIG } from "./config/index.js";
import eventRoutes from "./routes/events.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, CONFIG.server.socket);

// Middleware configuration
app.use(cors(CONFIG.server.cors));
app.use(express.json());

// Store the io instance
app.set("io", io);

// MongoDB Connection with retry logic
const connectDB = async () => {
	try {
		await mongoose.connect(CONFIG.mongodb.uri, CONFIG.mongodb.options);
		console.log("✅ MongoDB Connected");
	} catch (err) {
		console.error("MongoDB Connection Error:", err);
		// Retry connection after 5 seconds
		setTimeout(connectDB, 5000);
	}
};

connectDB();

// Basic health check route
app.get("/", (req, res) => {
	res.json({ message: "API is running", timestamp: new Date().toISOString() });
});

// API routes
app.use(CONFIG.api.routes.events, eventRoutes);

// WebSocket connection handling
io.on("connection", (socket) => {
	console.log("Client connected:", socket.id);

	socket.on("error", (error) => {
		console.error("Socket error:", error);
	});

	socket.on("disconnect", (reason) => {
		console.log("Client disconnected:", socket.id, "Reason:", reason);
	});
});

// Error handler middleware
app.use(errorHandler);

// Start server based on environment
if (CONFIG.isVercel) {
	// Export app for Vercel
	export default app;
} else {
	// Start server for local development
	httpServer.listen(CONFIG.server.port, () => {
		console.log(`🚀 Server running on port ${CONFIG.server.port}`);
		console.log(`📡 WebSocket server is ready`);
		console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
	});
}
