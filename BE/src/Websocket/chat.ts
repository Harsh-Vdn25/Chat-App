import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { CheckRequest, decodeToken } from "./helpers/checks";
import { RoomModel } from "../models/roomModel";
import { TokenType } from "../middleware/auth";
import { checkDuplicateSockets } from "./helpers/handleDuplicates";

export interface SocketArrType {
  socket: WebSocket;
  userId: string;
}

export interface messageType {
  type: "join" | "chat";
  roomName?: string;
  message?: string;
  token?: string;
}

export const allSockets = new Map<string, SocketArrType[]>();

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
        if (!messageInfo.token || !messageInfo.roomName) {
          socket.send(
            JSON.stringify({ message: "Please give appropriate information" })
          );
          return;
        }
        const userId = decodeToken(messageInfo.token);

        if (allSockets.get(messageInfo.roomName)) {
          try {
            //private roomCheck  ignored for now
            if (checkDuplicateSockets(socket, messageInfo.roomName,messageInfo.token)) {
              return;
            }
            allSockets
              .get(messageInfo.roomName)
              ?.push({ socket: socket, userId: userId });
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
            allSockets.set(messageInfo.roomName, [{ socket, userId }]);
            socket.send(
              JSON.stringify({ message: "Successfully added to the room" })
            );
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
      //chat logic
      if (messageInfo.type === "chat") {
        if (!messageInfo.message) {
          socket.send(JSON.stringify("message field is blank"));
        }
        allSockets.forEach((sockets) => {
          sockets.map((sObj) =>
            sObj.socket.send(JSON.stringify(messageInfo.message))
          );
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
