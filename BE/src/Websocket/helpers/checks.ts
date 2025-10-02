import { WebSocket } from "ws";
import { getRoom } from "../../models/roomModel";
import jwt from "jsonwebtoken";
import { requiredInfo } from "../../config/utils";
import { TokenType } from "../../middleware/auth";

export const CheckRequest = async (roomName: string, socket: WebSocket):Promise<Object> => {
  if (!roomName) {
    socket.send(JSON.stringify({ error: "Fill the required fields" }));
    return false;
  }
  try {
    const roomInfo = await getRoom(roomName);
    if (!roomInfo) {
      socket.send(JSON.stringify({ error: "Room doesnot exist"}));
      return {};
    }
    return roomInfo;
  } catch (err) {
    socket.send(JSON.stringify({error:err}));
    return {};
  }
};


export const decodeToken=(token:string)=>{
  if(!token){
    return '';
  }
  const userInfo=jwt.verify(token,requiredInfo.JWT_SECRET) as TokenType;
  if(!userInfo){
    return '';
  }
  return userInfo.id;
}
