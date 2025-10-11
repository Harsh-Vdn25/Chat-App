import { Request, Response } from "express";
import { getRoom, RoomModel } from "../models/roomModel";
import { PrivateRoomModel } from "../models/PrivateRoomModel";
import { hashPassword } from "../helper/hashPassword";

export async function getRooms(req: Request, res: Response) {
  try {
    const response = await RoomModel.find();
    if (!response) {
      return res.status(400).json({ message: "No Chat rooms available" });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error at the server side" });
  }
}

export async function getMyRooms(req: Request, res: Response) {
  const userId=(req as any).userId;
  try {
    const response = await RoomModel.find({
      members:userId
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
  const userId = (req as any).userId;
  try {
    const response = await getRoom(roomName);
    if (!response) {
      return res.status(404).json({ message: "Room Not Found" });
    }
    if (response.members.includes(userId)) {
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
  const userId = (req as any).userId;
  const roomId = req.params.roomId;
  try {
    const response = await RoomModel.findOne({
      roomId: roomId,
      members: userId,
    });
  } catch (err) {
    res.status(500).json({ message: "Error at the server side" });
  }
}

export async function createRoom(req: Request, res: Response) {
  const { roomName, isPrivate, password } = req.body;
  const userId = (req as any).userId;
  try {
    const response = await RoomModel.create({
      roomName: roomName,
      isPrivate: isPrivate,
      createdBy: userId,
      capacity: 30,
      members: [userId],
    });
    if (!response) {
      return res.json("Failed to create Room");
    }
    if (response.isPrivate) {
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
