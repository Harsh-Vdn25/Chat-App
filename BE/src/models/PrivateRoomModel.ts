import mongoose, { Schema, model } from "mongoose";

interface PrivateRoomMethod{
    roomName:Schema.Types.ObjectId;
    password:string;
}

const PrivateRoomSchema=new Schema<PrivateRoomMethod>({
    roomName:{type:String,required:true,unique:true,ref:'room'},
    password:String
})

export const PrivateRoomModel=mongoose.model('privateroom',PrivateRoomSchema);