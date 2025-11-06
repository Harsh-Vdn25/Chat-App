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
