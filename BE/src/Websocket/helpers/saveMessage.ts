import { messageModel } from "../../models/messageModel";

export interface saveMessagesType{
    message:string;
    roomName:string;
    userSent:string;
    timestamp:Number;
}

export async function saveMessages(batch:saveMessagesType[]){
    if(!batch)return;
    try{
        const response=await Promise.all(batch.map(async (mObj)=>{
            await messageModel.create({
                roomName:mObj.roomName,
                message:mObj.message,
                userName:mObj.userSent,
                timestamp:mObj.timestamp,
            })
        }))
        
        if(!response){
            return false;
        }
        return true;
    }catch(err){
        console.log(err);
    }
}