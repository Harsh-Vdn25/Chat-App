import mongoose, { Schema, model } from "mongoose";

interface MessageType {
  _id: Schema.Types.ObjectId;
  message: string;
  sentBy: Schema.Types.ObjectId;
  roomId: Schema.Types.ObjectId;
}

const messageSchema = new Schema<MessageType>(
  {
    message: String,
    sentBy: { type: Schema.Types.ObjectId, ref: "user" },
    roomId: { type: Schema.Types.ObjectId, ref: "room" },
  },
  {
    timestamps: true,
  }
);

export const messageModel = mongoose.model("message", messageSchema);