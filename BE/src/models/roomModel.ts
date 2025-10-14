import mongoose, { Schema } from "mongoose";

interface RoomType {
  _id: Schema.Types.ObjectId;
  roomName: string;
  capacity: number;
  createdBy: String;
  members: String[];
  isPrivate: boolean;
}

const RoomSchema = new Schema<RoomType>(
  {
    roomName: { type: String, required: true, unique: true },
    capacity: Number,
    createdBy: { type: String, ref: "user" },
    isPrivate: { type: Boolean, default: false },
    members: [{ type: String, ref: "user" }],
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
      return "";
    }
    return response;
  } catch (err) {
    console.log("Failed to fetch the room Details");
    return '';
  }
};

export const checkUser = async (userName: string | null,roomName:string|null) => {
  if (!userName||!roomName) {
    return false;
  }
  try {
    const isAuthorized = await RoomModel.findOne({
      roomName:roomName,
      members: userName
    });

    return !!isAuthorized;
    
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const AddUser = async(roomName:string,userName:string) => {
  try {
    const addedUser = await RoomModel.updateOne(
      {
        roomName: roomName,
      },
      {
        $addToSet: { members: userName },
      }
    );
  } catch (err) {
    console.log(err);
  }
};