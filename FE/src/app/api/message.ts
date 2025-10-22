import api from "@/helpers/api";
import { createRoomReqType } from "./room";
import { ChatsType } from "../context/MessageProvider";

type messageType=Pick<createRoomReqType,'roomName'|'token'>;
interface saveMessagesType{
    roomName:string,
    token:string,
    activeChats:ChatsType[]
}

export  async function getMessages({roomName,token}:messageType){
    if(!roomName||!token){
        return;
    }
    try{
        const response = await api.get(`/message/${roomName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    );
    console.log(response);
    return response.data;
    }catch(err){
        console.log();
    }
}

export  async function saveMessages({roomName,token,activeChats}:saveMessagesType){
    if(!roomName||!token){
        return;
    }
    try{
        const response = await api.post(`/message/save`,{
            messages:activeChats,
            roomName:roomName,
        },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    );
    if(!response){
        return false;
    }
    return response.data;
    }catch(err){
        console.log("Failed to save the messages.")
        return ;
    }
}