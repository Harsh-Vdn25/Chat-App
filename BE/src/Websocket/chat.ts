import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { CheckRequest, decodeToken } from "./utils/checks";
import { RoomModel } from "../models/roomModel";
import { TokenType } from "../middleware/auth";

const allSockets = new Map<string, WebSocket[]>();

export interface messageType {
  type: "join" | "chat";
  roomName: string;
  token?: string;
}

export const connectWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (socket, request) => {
    socket.on("message", async (message) => {
      const messageInfo: messageType | undefined = JSON.parse(
        message.toString()
      );
      if (!messageInfo) {
        socket.send("Invalid request");
        return;
      }
      //for joining
      if (messageInfo.type === "join") {
        if (!messageInfo.token) {
          socket.send(JSON.stringify({ message: "No Token" }));
          return;
        }
        const userId = decodeToken(messageInfo.token);
        
        if (allSockets.get(messageInfo.roomName)) {
          try {
            //private roomCheck  ignored for now
            allSockets.get(messageInfo.roomName)?.push(socket);

            socket.send(
              JSON.stringify({ message: "Successfully added to the room" })
            );
          } catch (err) {
            socket.send(JSON.stringify({ error: err }));
          }
        } else {
          try {
            const roomInfo = await CheckRequest(messageInfo.roomName, socket);
            if (Object.keys(roomInfo).length === 0) {
              return;
            }
            allSockets.set(messageInfo.roomName, [socket]);
          } catch (err) {}
        }
        if (allSockets.has(messageInfo.roomName)) {
          try {
            const addedUser = await RoomModel.updateOne(
              {
                roomName: messageInfo.roomName,
              },
              {
                $addToSet: { members: userId },
              }
            );
          } catch (err) {
            socket.send(JSON.stringify({ error: err }));
          }
        }
      }
    });

    // Handle close
    socket.on("close", () => {});
  });
};
