import { WebSocket } from "ws";
import { allSockets } from "../chat";
export const checkDuplicateSockets = (socket: WebSocket, roomInfo: string,userId:string) => {
  const isDuplicate = allSockets.get(roomInfo)?.find((sObj) => sObj.userId===userId);
  if (isDuplicate) {
    socket.send(JSON.stringify({ error: "You are already part of the room" }));
    return true;
  }
  return false;
};

