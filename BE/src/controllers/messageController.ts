import {Request,Response} from 'express';
import { messageModel } from "../models/messageModel";

export async function getMessages(req:Request,res:Response){
    console.log(req.params)
    const {roomName}=req.params;
     const userName=(req as any).userName;
    try{
        const response=await messageModel.find({
            roomName:roomName,
            userName:userName
        })
        if(!response){
            res.json({message:"No messages"})
            return;
        }
        res.status(200).json({data:response});
        return;
    }catch(err){

    }
}


export async function saveMessages(req:Request,res:Response){
    const {
        messages,
        roomName
    }=req.body;
    try{
        if(!messages){
            return;
        }
        const response=await messages.map(async (obj:{
            message:string,
            userName:string
        })=>(
            await messageModel.create({
            message:obj.message,
            roomName:roomName,
            sentBy:obj.userName
        })
        ))
        console.log(response);
        if(!response){
            res.json({message:"No messages saved"})
            return;
        }
        res.status(200).json({data:response});
        return;
    }catch(err){

    }
}