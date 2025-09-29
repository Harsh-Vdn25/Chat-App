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
    next();
  } catch (err) {
    console.error('Error at the server end', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
