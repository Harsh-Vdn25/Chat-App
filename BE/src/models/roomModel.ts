import mongoose, { Schema, model } from "mongoose";

interface RoomType {
  _id: Schema.Types.ObjectId;
  roomName: string;
  capacity: number;
  createdBy: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
  isPrivate: boolean;
}

const RoomSchema = new Schema<RoomType>(
  {
    roomName: { type: String, required: true, unique: true },
    capacity: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    isPrivate: { type: Boolean, default: false },
    members: [{type: Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }
);

export const RoomModel = mongoose.model("room", RoomSchema);
