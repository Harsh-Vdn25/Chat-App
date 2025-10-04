import mongoose, { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

interface PrivateRoomMethod{
    roomName:Schema.Types.ObjectId;
    password:string;
}

const PrivateRoomSchema=new Schema<PrivateRoomMethod>({
    roomName:{type:String,required:true,unique:true,ref:'room'},
    password:String
})

export const PrivateRoomModel=mongoose.model('privateroom',PrivateRoomSchema);

export const passwordCheck=async(roomName:string,password:string)=>{
    if(!roomName||!password){
        console.log("Please provide all the necessary fields");
        return false;
    }
    try{
        const getRoom=await PrivateRoomModel.findOne({
            roomName:roomName
        })
        if(!getRoom){
            console.log("No room is present with the given name");
            return false;
        }
        const isAuthorized=await bcrypt.compare(password,getRoom.password);
        console.log(isAuthorized);
        return isAuthorized;
    }catch(err){
        console.log("Room with this name doesnot exist",err);
    }
}