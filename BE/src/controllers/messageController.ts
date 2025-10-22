import {Request,Response} from 'express';
import { messageModel } from "../models/messageModel";

export async function getMessages(req:Request,res:Response){
    console.log(req.params)
    const {roomName}=req.params;
     const userName=(req as any).userName;
    try{
        const response=await messageModel.find({
            roomName:roomName
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
    console.log(messages);
    try{
        if(!messages){
            return;
        }
        const response=await Promise.all(
            messages.map(async (obj:{
            message:string,
            userName:string
        })=>{
            return await messageModel.create({
            message:obj.message,
            roomName:roomName,
            userName:obj.userName
        })
        })
        )
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