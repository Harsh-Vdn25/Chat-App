import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { CheckRequest, decodeToken } from "./helpers/checks";
import { checkIpRequest, joinType, chatType } from "./helpers/inputValidate";
import {  PrivateRoomCheck } from "./helpers/RoomCheckAndEntry";
import { checkDuplicateSockets } from "./helpers/handleDuplicates";

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
        if(checkDuplicateSockets(socket,roomName,userId)){
          return ;
        }
        
        const roomInfo: any = await CheckRequest(roomName, socket);

        if(!roomInfo ||Object.keys(roomInfo).length===0){
          return ;
        }
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
        //if the room is empty then remove that room also
        if(remaniningSockets.length===0){
          return allSockets.delete(roomName)
        }else{
            allSockets.set(roomName, remaniningSockets);  
        }
      });
    });
  });
};