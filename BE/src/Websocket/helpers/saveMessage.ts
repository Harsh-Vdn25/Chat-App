import { messageModel } from "../../models/messageModel";

interface saveMessagesType{
    message:string;
    roomName:string;
    userSent:string;
}

export async function saveMessages({message,roomName,userSent}:saveMessagesType){
    if(!message||!roomName||!userSent)return;
    try{
        const response= await messageModel.create({
            message:message,
            roomName:roomName,
            userName:userSent
        })
        console.log(response);
        if(!response){
            return false;
        }
        return true;
    }catch(err){

    }
}