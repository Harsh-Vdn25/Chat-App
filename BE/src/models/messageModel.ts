import mongoose, { Schema } from "mongoose";

interface MessageType {
  _id: Schema.Types.ObjectId;
  message: string;
  userName: String;
  roomName: String;
  timestamp:Number;
}

const messageSchema = new Schema<MessageType>(
  {
    message: String,
    userName: { type:String, ref: "user" },
    roomName: { type: String, ref: "room" },
    timestamp:Number
  }
);

export const messageModel = mongoose.model("message", messageSchema);