import WebSocket from "ws";
import { passwordCheck } from "../../models/PrivateRoomModel";
import { AddUser, checkUser } from "../../models/roomModel";
import { AddSocket } from "./AddSocket";

export const PrivateRoomCheck = async (
  roomInfo: any,
  socket: WebSocket,
  roomName: string,
  userName: string,
  password: string | undefined
) => {
  const isPresent=await checkUser(userName,roomName);
  if (roomInfo.isPrivate&&!isPresent) {
    return AddToPrivateRoom(socket, roomName, userName, password,isPresent);
  } else {
    if (!isPresent) {
      await AddUser(roomName, userName);
    }
    return AddSocket({roomName,socket,userName});
  }
};

const AddToPrivateRoom = async (
  socket: WebSocket,
  roomName: string,
  userName: string,
  password: string | undefined,
  isPresent:boolean
) => {
  try {
    if (!password) {
      socket.send(JSON.stringify({ alert: "Please provide the password" }));
      return false;
    }
    const response = await passwordCheck(roomName, password);
    if (!response) {
      socket.send(JSON.stringify({ error: "Check the credentials" }));
      return false;
    }
    if (!isPresent){
      await AddUser(roomName, userName);
    }
    return AddSocket({roomName,socket,userName});
  } catch (err) {
    socket.send(JSON.stringify({ error: "Failed to add to the room" }));
    console.log(err);
    return false;
  }
};
