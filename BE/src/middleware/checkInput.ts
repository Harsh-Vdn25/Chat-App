import { Request,Response,NextFunction } from 'express';
import {z} from 'zod';

export const checkCreateRoomIP=(req:Request,res:Response,next:NextFunction)=>{
    const requiredbody=z.object({
        roomName:z.string().min(2),
        isPrivate:z.boolean(),
        password:z.string().optional(),
    })
    const isValidated=requiredbody.safeParse(req.body);
    if(!isValidated.success){
        return res.status(400).json({message:"Please fill all the fields"})
    }
    next();
}