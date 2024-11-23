import { io } from "socket.io-client";
import { API_CONFIG } from "../config/api";

export const socket = io(API_CONFIG.wsUrl, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});
