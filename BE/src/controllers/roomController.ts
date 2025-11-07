import { Request, Response } from "express";
import { getRoom, RoomModel } from "../models/roomModel";
import { PrivateRoomModel } from "../models/PrivateRoomModel";
import { hashPassword } from "../helper/hashPassword";
import bcrypt from 'bcrypt';

export async function getRooms(req: Request, res: Response) {
  try {
    const response = await RoomModel.find({},{
      _id:0,
      createdBy:0,
      updatedBy:0
    });
    if (!response) {
      return res.status(400).json({ message: "No Chat rooms available" });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error at the server side" });
  }
}

export async function getMyRooms(req: Request, res: Response) {
  const userName=(req as any).userName;

  try {
    const response = await RoomModel.find({
      members:userName
    },{
      _id:0,
      isPrivate:0,
      createdAt:0,
      updatedAt:0
    });
    if (!response) {
      return res.status(400).json({ message: "No Chat rooms available" });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error at the server side" });
  }
}
 

export async function getRoomInfo(req: Request, res: Response) {
  //Get the info of that room (if private then send private else )
  const roomName = req.params.roomName;
  if(!roomName){
      return res.status(404).json({ message: "RoomName is not provided" });
  }
  const userName = (req as any).userName;
  try {
    const response = await getRoom(roomName);
    if (!response) {
      return res.status(404).json({ message: "Room Not Found" });
    }
    if (response.members.includes(userName)) {
      return res.status(200).json(response);
    }

    res.status(200).json({
      Id: response._id,
      roomName: response.roomName,
      createdBy: response.createdBy,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

export async function getChats(req: Request, res: Response) {
  //Get the chats of that room
  const userName = (req as any).userName;
  const roomId = req.params.roomId;
  try {
    const response = await RoomModel.findOne({
      roomId: roomId,
      members: userName,
    });
  } catch (err) {
    res.status(500).json({ message: "Error at the server side" });
  }
}

export async function createRoom(req: Request, res: Response) {
  const { roomName, isPrivate } = req.body;
  const userName = (req as any).userName;
  try {
    const response = await RoomModel.create({
      roomName: roomName,
      isPrivate: isPrivate,
      createdBy: userName,
      capacity: 30,
      members: [userName],
    });
    if (!response) {
      return res.json("Failed to create Room");
    }
    if (response.isPrivate) {
      const {password}=req.body;
      if (!password) throw new Error("Password is required for private rooms");
      //hashing the password;
      const hashedPassword = await hashPassword(password);
      const AddRoom = await PrivateRoomModel.create({
        roomName: roomName,
        password: hashedPassword,
      });
      if (!AddRoom) {
        throw new Error("Failed to Create privateRoom");
      }
    }
    res.status(200).json({ message: "Room Created successfully" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function joinRoom(req: Request, res: Response) {
  const { roomName, password } = req.body;
  const userName = (req as any).userName;

  try {
    // Step 1: Check if room exists
    const room = await RoomModel.findOne({ roomName });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Step 2: If the room is private, verify password
    if (room.isPrivate) {
      if (!password) {
        return res.status(400).json({ message: "Password is required for private room" });
      }

      const privateRoom = await PrivateRoomModel.findOne({ roomName });
      if (!privateRoom) {
        return res.status(404).json({ message: "Private room details not found" });
      }

      const isAuthorized=await bcrypt.compare(password,privateRoom.password);

      if (!isAuthorized) {
        return res.status(401).json({ message: "Incorrect password" });
      }
    }

    // Step 3: Add user to the room if not already a member
    if (!room.members.includes(userName)) {
      room.members.push(userName);
      await room.save();
    }

    res.status(200).json({ message: "Joined room successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
