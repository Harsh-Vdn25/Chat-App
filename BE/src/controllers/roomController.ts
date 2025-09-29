import {Request,Response} from 'express';
import { RoomModel } from '../models/roomModel';
import { PrivateRoomModel } from '../models/PrivateRoomModel';
import { hashPassword } from '../helper/hashPassword';

export async function getRooms(req:Request,res:Response){
    try{
        const response=await RoomModel.find({
            isPrivate:false
        });
        if(!response){
            return res.status(400).json({message:"No Chat rooms available"});
        }
        res.status(200).json(response);
    }catch(err){
        res.status(500).json({message:"Error at the server side"});
    }
}


export async function getRoomInfo(req:Request,res:Response){
    //Get the info of that room (if private then send private else )
}


export async function getChats(req:Request,res:Response){
    //Get the chats of that room 
    const userId=(req as any ).userId;
    const roomId=req.params.roomId;
    try{
        const response=await RoomModel.findOne({
            roomId:roomId,
            members:userId
        })
    }catch(err){
        res.status(500).json({message:"Error at the server side"});
    }
}

export async function createRoom(req:Request,res:Response){
    const {roomName,isPrivate,password}=req.body;
    const userId=(req as any).userId;
    try{
        const response=await RoomModel.create({
            roomName:roomName,
            isPrivate:isPrivate,
            createdBy:userId,
            capacity:30,
            members:[userId]
        })
        if(!response){
            return res.json("Failed to create Room");
        }
        if(response.isPrivate){
            //hashing the password;
            const hashedPassword=await hashPassword(password);
            console.log('Got it ',response._id);
            const AddRoom=await PrivateRoomModel.create({
                roomName:roomName,
                password:hashedPassword,
            })
            if(!AddRoom){
                throw new Error("Failed to Create privateRoom");
            }
        }
        console.log(response);
        res.status(200).json({message:"Room Created successfully"});
    }catch{
        res.status(500).json({message:"Internal server error"})
    }
}

