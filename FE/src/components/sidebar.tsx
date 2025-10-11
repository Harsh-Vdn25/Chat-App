"use client";

import { useRouter } from "next/navigation";
import Button from "./button";

interface RoomType {
  roomName: string;
  capacity: number;
  createdBy: string;
  members: string[];
}

interface SidebarProps {
  data: RoomType[];
}

export default function Sidebar({ data }: SidebarProps) {
  return (
    <div className="h-screen w-80 bg-gray-900 p-4 shadow-lg overflow-y-auto border-r border-gray-700">
      
      <h2 className="text-2xl font-bold text-white mb-5 border-b border-gray-700 pb-2">
        Rooms
      </h2>
      <div>
        <Button
        type="button"
        text="My Chats"
        onClick={}/>
        <Button
        type="button"
        text="All Rooms"
        onClick={}/>
      </div>
      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((room) => (
            <RoomInfo
              key={room.roomName}
              roomName={room.roomName}
              capacity={room.capacity}
              createdBy={room.createdBy}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm italic">No rooms available.</p>
      )}
    </div>
  );
}

type RoomInfoType = Pick<RoomType, "roomName" | "capacity" | "createdBy">;

function RoomInfo({ roomName, capacity, createdBy }: RoomInfoType) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/room/${roomName}`)}
      className="w-full text-left bg-gray-800 hover:bg-gray-700 transition-all cursor-pointer duration-200 rounded-md p-4 shadow-sm hover:shadow-md focus:ring-2 focus:ring-gray-600 focus:outline-none"
    >
      <p className="text-lg font-semibold text-white truncate">{roomName}</p>

      <div className="flex justify-between items-center mt-2 text-sm text-gray-300">
        <p className="truncate">
          <span className="text-gray-400">By:</span> {createdBy}
        </p>
        <p className="text-gray-400">
          Cap: <span className="text-gray-200 font-medium">{capacity}</span>
        </p>
      </div>
    </button>
  );
}
