import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { CheckRequest, decodeToken } from "./helpers/checks";
import { checkIpRequest, joinType, chatType } from "./helpers/inputValidate";
import {  PrivateRoomCheck } from "./helpers/RoomCheckAndEntry";

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
        const { roomName, token, password } = joinData;
        const userId = decodeToken(token);
        const roomInfo: any = await CheckRequest(roomName, socket);

        const isAdded=await PrivateRoomCheck(roomInfo, socket, roomName, userId, password);
        if(!isAdded){
            return;
        }    
        socket.send(JSON.stringify({message:"Successfully added to the room"}));
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

    socket.on("close", () => {
      allSockets.forEach((sockets, roomName) => {
        const remaniningSockets = sockets.filter((s) => s.socket !== socket);
        allSockets.set(roomName, remaniningSockets);
      });
    });
  });
};