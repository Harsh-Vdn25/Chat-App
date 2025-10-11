import api from "@/helpers/api";

async function fetchRoomInfo(roomName: string) {
  try {
    const response = await api.get(`/room/roominfo/${roomName}`);
    return response.data;                 
  } catch (err: any) {
    console.error("Failed to fetch the room data", err);
    return null;
  }
}

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const roomName = params.roomId;

  const roomData = await fetchRoomInfo(roomName);


  if (!roomData) {
    return <div>Room not found or failed to load.</div>;
  }

  return (
    <div>
      
    </div>
  );
}