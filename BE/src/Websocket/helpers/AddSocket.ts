import WebSocket from "ws";
import { allSockets } from "../chat";

interface AddSocketType {
  roomName: string;
  userName: string;
  socket: WebSocket;
}

export const AddSocket = async ({
  roomName,
  socket,
  userName,
}: AddSocketType) => {
  if (allSockets.has(roomName)) {
    allSockets.get(roomName)?.push({ socket, userName });
    return true;
  } else {
    allSockets.set(roomName, [{ socket, userName }]);
    return true;
  }
};
