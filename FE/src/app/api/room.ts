import api from "@/helpers/api";

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
  } catch (err) {}
}

export const getToken=()=>{
  const clientToken=localStorage.getItem('Token');
  return clientToken;
}