"use client";
import { RefObject } from "react";

export interface sendMessageType {
  socketRef: RefObject<WebSocket | null>;
  roomName: string;
  token:string;
  message:string;
  isJoin: boolean;
  setisJoin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default async function sendMessage({
  socketRef,
  roomName,
  token,
  message,
  isJoin,
  setisJoin,
}: sendMessageType) {
  if(socketRef.current?.readyState===WebSocket.OPEN){
    if (isJoin) {
      
    socketRef.current?.send(
      JSON.stringify({
        type: "join",
        roomName: roomName,
        token: token,
      })
    );
    setisJoin(false);
  } else {
    socketRef.current?.send(
      JSON.stringify({
        type: "chat",
        roomName:roomName,
        message: message
      })
    );
  }
  }
}
