import { WebSocket, WebSocketServer } from "ws";

import { decodeToken } from "./utils/decodeToken";
import {requiredInfo} from '../config/utils';
import { getRoom,checkUser } from "../models/roomModel";

const socket_port: number = parseInt(requiredInfo.SOCKET_PORT);
const ws = new WebSocketServer({ port: socket_port });

// interface socketType{
//     roomId:string;
//     sockets:
// }

let allSockets = new Map<string, WebSocket[]>();

const getTokenFromQuery = (url: string | null): string | undefined => {
  if (!url) {
    return;
  }
  const fullUrl = new URL(url, "ws://localhost:8080");
  return fullUrl.searchParams.get("token") || "";
};

ws.on("connection", (req) => {
  const token = getTokenFromQuery(req.url);

  if (token?.length === 0) {
    throw new Error("No token");
  }
  const userId=decodeToken(token);
  const userValidated=checkUser(userId);

  if(!userValidated){
    throw new Error("Not valid user");
  }

  ws.on("message", (e) => {});

  ws.on("close", () => {});
});
