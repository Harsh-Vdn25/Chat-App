import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { z } from "zod";
import { CheckRequest, decodeToken } from "./helpers/checks";
import { RoomModel } from "../models/roomModel";
import { TokenType } from "../middleware/auth";
import { checkDuplicateSockets } from "./helpers/handleDuplicates";
import { checkIpRequest, joinType, chatType } from "./helpers/inputValidate";

export interface SocketArrType {
  socket: WebSocket;
  userId: string;
}

export const allSockets = new Map<string, SocketArrType[]>();

export const connectWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (socket) => {
    socket.on("message", async (message) => {
      const parsed = checkIpRequest(socket, message);

      if (!parsed || !parsed.success) {
        return;
      }
      const { type } = parsed.data;
      //for joining
      if (type === "join") {
        const joinData = <joinType>parsed.data;
        const { roomName, token } = joinData;
        const userId = decodeToken(token);

        if (allSockets.get(roomName)) {
          try {
            if (checkDuplicateSockets(socket, roomName, token)) {
              return;
            }
            allSockets.get(roomName)?.push({ socket: socket, userId: userId });
            socket.send(
              JSON.stringify({ message: "Successfully added to the room" })
            );
          } catch (err) {
            socket.send(JSON.stringify({ error: err }));
          }
        } else {
          try {
            const roomInfo = await CheckRequest(roomName, socket);
            if (Object.keys(roomInfo).length === 0) {
              return;
            }
            allSockets.set(roomName, [{ socket, userId }]);
            socket.send(
              JSON.stringify({ message: "Successfully added to the room" })
            );
          } catch (err) {
            socket.send(JSON.stringify({ message: "Failed to add " }));
          }
        }
        if (allSockets.has(roomName)) {
          try {
            const addedUser = await RoomModel.updateOne(
              {
                roomName: roomName,
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
      //chat logic
      if (type === "chat") {
        const chatData = <chatType>parsed.data;
        const { message } = chatData;
        allSockets.forEach((sockets) => {
          if (sockets.some((sObj) => sObj.socket === socket)) {
            sockets.forEach((sObj) => {
              sObj.socket.send(JSON.stringify({ message }));
            });
          }
        });
      }
    });

    // Handle close
    socket.on("close", () => {
      allSockets.forEach((sockets, roomName) => {
        const remaniningSockets = sockets.filter((s) => s.socket !== socket);
        allSockets.set(roomName, remaniningSockets);
      });
    });
  });
};
