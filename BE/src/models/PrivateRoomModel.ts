import mongoose, { Schema, model } from "mongoose";

interface PrivateRoomMethod{
    roomId:Schema.Types.ObjectId;
    password:string;
}

const PrivateRoomSchema=new Schema<PrivateRoomMethod>({
    roomId:{type:Schema.Types.ObjectId,required:true,ref:'room'},
    password:String
})

export const PrivateRoomModel=mongoose.model('privateroom',PrivateRoomSchema);