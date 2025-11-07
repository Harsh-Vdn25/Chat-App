import api from "@/helpers/api";

export interface createRoomReqType{
  roomName:string;
  token:string;
  isPrivate:boolean;
  password?:string;
}

export async function createRoom({roomName,token,isPrivate,password}:createRoomReqType){
  try {
    const response = await api.post(`/room/create`, {
      roomName:roomName,
      isPrivate:isPrivate,
      password:password
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to create the room", err);
    return null;
  }
}

export async function fetchRoom(roomName: string,token:string) {
  try {
    const response = await api.get(`/room/roominfo/${roomName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch the room data", err);
    return null;
  }
}

export async function fetchAllRooms(token:string) {
  try {
    const response = await api.get(`/room/getRooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch the rooms data", err);
    return null;
  }
}

export async function getMyRooms(token:string) {
  try {
    const response = await api.get("/room/myRooms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    const userRoomData = response.data;
    return userRoomData;
  } catch (err) {
    console.log(err);
  }
}

type joinRoomType=Pick<createRoomReqType,'password'|'token'|'roomName'>;
export async function roomJoin({roomName,password,token}:joinRoomType){
  try{
    await api.post
  }catch(err){

  }
}

export const getToken=()=>{
  const clientToken=localStorage.getItem('Token');
  return clientToken;
}
