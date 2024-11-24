import dotenv from "dotenv";

dotenv.config();

// Configuration object for the application
export const CONFIG = {
	mongodb: {
		// MongoDB connection URI and options
		uri: process.env.MONGO_URI || "mongodb://localhost:27017/eventchain",
		options: {
			useNewUrlParser: true, // Use the new URL string parser
			useUnifiedTopology: true, // Use the new server discovery and monitoring engine
			retryWrites: true, // Enable automatic retryable writes
			w: "majority", // Write concern ensuring majority acknowledgment
		},
	},
	server: {
		// Server configuration
		port: process.env.PORT || 3000, // Server listening port
		cors: {
			origin: "*", // Allow all origins; replace with specific origin in production for security
			methods: ["GET", "POST"], // HTTP methods allowed for CORS
			credentials: true, // Include credentials such as cookies in CORS requests
		},
	},
	api: {
		// API routes configuration
		routes: {
			events: "/api/events", // Endpoint for handling event operations
			search: "/api/events/search", // Endpoint for searching events
		},
	},
};
