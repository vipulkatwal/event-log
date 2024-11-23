import dotenv from "dotenv"; // Load environment variables from a .env file

dotenv.config(); // Initialize dotenv to make variables from .env accessible via process.env

export const CONFIG = {
	mongodb: {
		uri: process.env.MONGO_URI || "mongodb://localhost:27017/eventchain",
		// MongoDB connection URI; falls back to a local instance if no environment variable is provided
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			retryWrites: true,
			w: "majority",
			// Configuration options for better performance and reliable write acknowledgments
		},
	},
	server: {
		port: process.env.PORT || 3000,
		// Server port configuration; defaults to 3000 if no environment variable is set
		cors: {
			origin: "*",
			// Allow all origins for development; replace with specific origins in production
			methods: ["GET", "POST"],
			credentials: true,
			// Allow cookies and credentials in cross-origin requests
		},
	},
	api: {
		routes: {
			events: "/api/events",
			search: "/api/events/search",
			// Define API routes for event-related operations
		},
	},
};
