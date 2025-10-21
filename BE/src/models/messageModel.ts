import mongoose, { Schema } from "mongoose";

interface MessageType {
  _id: Schema.Types.ObjectId;
  message: string;
  sentBy: String;
  roomName: String;
}

const messageSchema = new Schema<MessageType>(
  {
    message: String,
    sentBy: { type:String, ref: "user" },
    roomName: { type: String, ref: "room" },
  },
  {
    timestamps: true,
  }
);

export const messageModel = mongoose.model("message", messageSchema);