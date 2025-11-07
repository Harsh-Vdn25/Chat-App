import mongoose, { Schema } from "mongoose";
import { promise } from "zod";

interface MessageType {
  _id: Schema.Types.ObjectId;
  message: string;
  userName: String;
  roomName: String;
  timestamp:Number;
}

const messageSchema = new Schema<MessageType>(
  {
    message: String,
    userName: { type:String, ref: "user" },
    roomName: { type: String, ref: "room" },
    timestamp:Number
  }
);

export const messageModel = mongoose.model("message", messageSchema);

export interface saveMessagesType{
    message:string;
    roomName:string;
    userSent:string;
    timestamp:Number;
}

export async function saveMessages(batch:saveMessagesType[]){
    if(!batch)return;
    console.log("DB readyState before insert:", mongoose.connection.readyState);
    try{
        const response=await Promise.all(
           batch.map(async (mObj)=>{
            await messageModel.insertOne({
                  userName:mObj.userSent,
                message:mObj.message,
                roomName:mObj.roomName,
                timestamp:mObj.timestamp
                })
           })
        )
        console.log("saved",response);
        if(!response){
            return false;
        }
        return true;
    }catch(err){
        console.log(err);
    }
}