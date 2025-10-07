import api from "@/helpers/api";

async function fetchRoomInfo(roomName: string) {
  try {
    // Calls your backend route: /roominfo/:roomName
    const response = await api.get(`/room/roominfo/${roomName}`);
    return response.data;                 // Use the parsed data
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
  // Get roomId from the dynamic route
  const roomName = params.roomId;

  // Fetch data from backend
  const roomData = await fetchRoomInfo(roomName);

  // If room not found or error
  if (!roomData) {
    return <div>Room not found or failed to load.</div>;
  }

  return (
    <div>
      <h1>Room: {roomData.roomName || roomName}</h1>
      <p>Created By: {roomData.createdBy}</p>
      {roomData.members && (
        <p>Members Count: {roomData.roomName}</p>
      )}
    </div>
  );
}