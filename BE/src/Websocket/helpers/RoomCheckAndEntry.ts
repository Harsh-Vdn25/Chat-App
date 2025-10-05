import WebSocket from "ws";
import { passwordCheck } from "../../models/PrivateRoomModel";
import { allSockets } from "../chat";
import { AddUser, checkUser } from "../../models/roomModel";

export const PrivateRoomCheck = async (
  roomInfo: any,
  socket: WebSocket,
  roomName: string,
  userId: string,
  password: string | undefined
) => {
  const isPresent=await checkUser(userId,roomName);
  if (roomInfo.isPrivate&&!isPresent) {
    return AddToPrivateRoom(socket, roomName, userId, password,isPresent);
  } else {
    if (!isPresent) {
      await AddUser(roomName, userId);
    }
    if (allSockets.has(roomName)) {
      allSockets.get(roomName)?.push({ socket, userId });
      return true;
    } else {
      allSockets.set(roomName, [{ socket, userId }]);
      return true;
    }
  }
};

const AddToPrivateRoom = async (
  socket: WebSocket,
  roomName: string,
  userId: string,
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
      AddUser(roomName, userId);
    }
    if (allSockets.get(roomName)) {
      allSockets.get(roomName)?.push({ socket, userId });
      return true;
    } else {
      allSockets.set(roomName, [{ socket, userId }]);
      return true;
    }
  } catch (err) {
    socket.send(JSON.stringify({ error: "Failed to add to the room" }));
    console.log(err);
    return false;
  }
};
