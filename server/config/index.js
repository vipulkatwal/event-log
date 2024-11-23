import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
	mongodb: {
		uri: process.env.MONGO_URI || "mongodb://localhost:27017/eventchain",
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			retryWrites: true,
			w: "majority",
		},
	},
	server: {
		port: process.env.PORT || 3000,
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
			credentials: true,
		},
	},
	api: {
		routes: {
			events: "/api/events",
		},
	},
};
