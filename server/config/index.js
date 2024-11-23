import dotenv from "dotenv";
dotenv.config();

const FRONTEND_URL =
	process.env.NODE_ENV === "production"
		? "https://event-chain-chi.vercel.app"
		: "http://localhost:5173";

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
			origin: FRONTEND_URL,
			methods: ["GET", "POST"],
			credentials: true,
		},
		socket: {
			path: "/socket.io/",
			cors: {
				origin: FRONTEND_URL,
				methods: ["GET", "POST"],
				credentials: true,
			},
			transports: ["websocket", "polling"],
			allowEIO3: true,
		},
	},
	api: {
		routes: {
			events: "/api/events",
			search: "/api/events/search",
		},
	},
	isProduction: process.env.NODE_ENV === "production",
	isVercel: process.env.VERCEL || false,
};
