import api from "@/helpers/api";

 interface RoomType {
  roomName: string;
  capacity: number;
  createdBy: string;
  members: string[];
}

export type RoomsType = RoomType[];

interface SidebarProps {
  data: RoomsType;    
}

export default async function Sidebar({data}: SidebarProps) {
  return (
    <div className="h-screen w-90 bg-gray-800 p-3 shadow-md overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-4 border-b pb-2">
        Rooms
      </h2>

      {data && data.length > 0 ? (
        data.map((room) => (
          <RoomInfo
            key={room.roomName}
            roomName={room.roomName}
            capacity={room.capacity}
            createdBy={room.createdBy}
          />
        ))
      ) : (
        <p className="text-white text-sm">No rooms available.</p>
      )}
    </div>
  );
}

type RoomInfoType = Pick<RoomType, "roomName" | "capacity" | "createdBy">;

function RoomInfo({ roomName, capacity, createdBy }: RoomInfoType) {
  return (
    <div className="bg-gray-700 rounded-sm shadow-sm p-3 mb-3 hover:shadow-md transition-shadow duration-200">
      <p className="text-lg font-semibold text-white">{roomName}</p>
      <div className="flex justify-between mt-1 text-sm text-white">
        <p>By: {createdBy}</p>
        <p>Cap: {capacity}</p>
      </div>
    </div>
  );
}
