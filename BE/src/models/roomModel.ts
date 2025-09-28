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
    members: [{ type: Schema.Types.ObjectId, ref: "user" }],
},
  {
    timestamps: true,
  }
);

export const RoomModel = mongoose.model("room", RoomSchema);

export const getRoom = async (roomName: string) => {
  if (!roomName) {
    console.log("No roomName given");
    return;
  }
  try {
    const response = await RoomModel.findOne({
      roomName: roomName,
    });
    if (!response) {
      console.log("Room with given name doesn't exist");
      return;
    }
    console.log(response);
    return response;
  } catch (err) {
    console.log("Failed to fetch the room Details");
  }
};

export const checkUser = async (userId: string | null,roomName:string|null) => {
  if (!userId||!roomName) {
    return false;
  }
  try {
    const isAuthorized = await RoomModel.findOne({
      roomName:roomName,
      members: new mongoose.Types.ObjectId(userId),
    });

    return !!isAuthorized;
    
  } catch (err) {
    console.error(err);
    return false;
  }
};
