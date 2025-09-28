import {Request,Response,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import { RoomModel,checkUser } from '../models/roomModel';
import { PrivateRoomModel } from '../models/PrivateRoomModel';

export async function checkRoom(req: Request, res: Response, next: NextFunction) {
  const { roomName } = req.body;
  if (!roomName) {
    return res.status(400).json({ message: 'roomName is required' });
  }

  try {
    const room = await RoomModel.findOne({ roomName });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    (req as any).room = room;
    (req as any).isPrivate = room.isPrivate;
    console.log(room);
    next();
  } catch (err) {
    console.error('Error at the server end', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function checkRoomType(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).userId;
    const { roomName, password } = req.body;

    const isPresent =await checkUser(userId, roomName);
    if (isPresent) {
        return res.status(400).json({ message: "You are already part of this room" });
    }
    
    if (!(req as any).room.isPrivate) {
        return next();
    }

    if (!password) {
        return res.status(400).json({ message: "Password required" });
    }

    try{
        const roomInfo=await PrivateRoomModel.findOne({
            roomName:roomName
        })
        if(!roomInfo){
            return;
        }
        const isAuthorized=await bcrypt.compare(password,roomInfo.password);
        
        if(!isAuthorized){
            return res.status(401).json({message:"Not authorized"});
        }
        next();
    }catch(err){
        console.log(err);
        return;
    }

    next();
}
