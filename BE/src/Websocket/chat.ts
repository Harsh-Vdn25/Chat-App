import { WebSocketServer, WebSocket } from "ws";
import { decodeToken } from "./utils/decodeToken";
import { requiredInfo } from "../config/utils";
import { getRoom, checkUser } from "../models/roomModel";

const socket_port: number = parseInt(requiredInfo.SOCKET_PORT);
const wss = new WebSocketServer({ port: socket_port });

const allSockets = new Map<string, WebSocket[]>();

const getTokenFromQuery = (url?: string): string | null => {
  if (!url) return null;
  const fullUrl = new URL(url, "ws://localhost");
  return fullUrl.searchParams.get("token");
};

wss.on("connection", async (socket, request) => {
  const token = getTokenFromQuery(request.url);
  const userId = decodeToken(token);

  if (!userId) {
    console.log("Connection rejected: invalid or missing token");
    socket.close(4001, "Unauthorized");
    return;
  }


  // Handle messages
  socket.on("message", (message) => {
  });

  // Handle close
  socket.on("close", () => {
  });
});
