import { WebSocketServer, WebSocket } from "ws";
import { decodeToken } from "./utils/decodeToken";
import { requiredInfo } from "../config/utils";
import { getRoom, checkUser } from "../models/roomModel";

const socket_port: number = parseInt(requiredInfo.SOCKET_PORT);
const wss = new WebSocketServer({ port: socket_port });

const allSockets = new Map<string, WebSocket[]>();


wss.on("connection", async (socket, request) => {

  // Handle messages
  socket.on("message", (message) => {
  });

  // Handle close
  socket.on("close", () => {
  });
});
