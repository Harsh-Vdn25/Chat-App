import WebSocket from "ws";
import { allSockets } from "../chat";

interface AddSocketType {
  roomName: string;
  userId: string;
  socket: WebSocket;
}

export const AddSocket = async ({
  roomName,
  socket,
  userId,
}: AddSocketType) => {
  if (allSockets.has(roomName)) {
    allSockets.get(roomName)?.push({ socket, userId });
    return true;
  } else {
    allSockets.set(roomName, [{ socket, userId }]);
    return true;
  }
};
