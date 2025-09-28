import {Request,Response} from 'express';
import { RoomModel } from '../models/roomModel';

export async function getRooms(req:Request,res:Response){
    //get all the rooms
}


export async function getRoomInfo(req:Request,res:Response){
    //Get the info of that room 
}


export async function joinRoom(req:Request,res:Response){
    const {roomName}=req.body;
    const userId=(req as any).userId;
    try{
        const response=await RoomModel.updateOne({
            roomName:roomName,
            isPrivate:false
        },{
            
        })
        console.log("yes we can add him here")
    }catch(err){
        console.log("Failed to join the room",err)
    }
}

export async function getChats(req:Request,res:Response){
    //Get the chats of that room 
    console.log("getChats")
}

export async function createRoom(req:Request,res:Response){
    const {roomName,isPrivate}=req.body;
    const userId=(req as any).userId;
    try{
        const response=await RoomModel.create({
            roomName:roomName,
            isPrivate:isPrivate,
            createdBy:userId,
            capacity:30,
            members:[userId]
        })
        console.log(response);
        if(!response){
            return res.json("Failed to create Room");
        }
        res.status(200).json({message:"Created successfully"});
    }catch{
        res.status(500).json({message:"Internal server error"})
    }
}

