import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { CheckRequest, decodeToken } from "./helpers/checks";
import { checkIpRequest, joinType, chatType } from "./helpers/inputValidate";
import { PrivateRoomCheck } from "./helpers/RoomCheckAndEntry";
import { checkDuplicateSockets } from "./helpers/handleDuplicates";
import { redisClients } from "../server";

export interface SocketArrType {
  socket: WebSocket;
  userName: string;
}

function getClients(roomName:string){
  const hash=roomName.split('').reduce((acc,k)=>acc+k.charCodeAt(0),0);
  return redisClients[hash%redisClients.length];
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
        const userName = await decodeToken(token, socket);

        if (!userName) {
          return socket.send(
            JSON.stringify({ message: "User doesn't exist " })
          );
        }
        if (checkDuplicateSockets(socket, roomName, userName)) {
          return;
        }

        const roomInfo: any = await CheckRequest(roomName, socket);

        if (!roomInfo || Object.keys(roomInfo).length === 0) {
          return;
        }
        const isAdded = await PrivateRoomCheck(
          roomInfo,
          socket,
          roomName,
          userName,
          password
        );
        if (!isAdded) {
          return;
        }
        socket.send(
          JSON.stringify({ message: "Successfully added to the room" })
        );
      }
      //chat logic
      if (type === "chat") {
        const chatData = <chatType>parsed.data;
        const { roomName, message } = chatData;
        if (!allSockets.has(roomName)) {
          return socket.send(JSON.stringify({ error: "Room Not Found" }));
        }

        const roomSockets = allSockets.get(roomName);

        if (roomSockets?.some((sObj) => sObj.socket === socket)) {
          const userSent = roomSockets?.find(
            (sObj) => sObj.socket === socket
          )?.userName;
          if(!userSent)return;
          const redisClient=getClients(roomName);
          const payload={
          roomName,
          message,
          userSent,
          timestamp:Date.now()
        }
        await redisClient?.lPush("chat",JSON.stringify(payload));

          roomSockets.forEach((sObj) => {
            sObj.socket.send(
              JSON.stringify({
                message: message,
                userName: userSent,
              })
            );
          });
          return;
        } else {
          socket.send(JSON.stringify({ error: "Please join the room" }));
          return;
        }
      }

      if (type === "change") {
        const {roomName,token}=parsed.data;
        const JoiningRoom=allSockets.get(roomName);
        let check;
        const keys=allSockets.keys();
        keys.forEach((room) => {
          check=allSockets.get(room)?.find(sArr=>sArr.socket===socket);
          if(check){
            const newSocketArr=allSockets.get(room)?.filter(sArr=>sArr.socket!==socket);
            if(!newSocketArr){
              allSockets.delete(room);
              return;
            }
            allSockets.set(room,newSocketArr);
          }
        });
        const userName=await decodeToken(token,socket);
        if(!userName){
          return;
        }
        JoiningRoom?.push({socket,userName});
      }
    });

    socket.on("close", () => {
      allSockets.forEach((sockets, roomName) => {
        const remaniningSockets = sockets.filter((s) => s.socket !== socket);
        //if the room is empty then remove that room also
        if (remaniningSockets.length === 0) {
          return allSockets.delete(roomName);
        } else {
          allSockets.set(roomName, remaniningSockets);
        }
      });
    });
  });
};
