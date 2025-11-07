"use client"

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import LabelledInput from "./Input";
import Button from "./button";
import { roomJoin } from "@/app/api/room";
import { AuthContext } from "@/app/context/AuthProvider";

export default function JoinRoom() {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const authcontext = useContext(AuthContext);

  if (!authcontext) {
    throw new Error('Auth context not found');
  }

  const { token } = authcontext;

  const handleJoinRoom = async () => {
    try {
      const response = await roomJoin({ roomName, token, password });
      console.log(response);
      if (!response) {
        return alert('Failed to join room');
      }
      router.push('/home');
    } catch (err) {
      console.error(err);
      alert('Error joining room');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="flex flex-col w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-xl border border-gray-700 space-y-6">

        <h1 className="text-2xl font-semibold text-white text-center">
          Join a Room
        </h1>

        <LabelledInput
          label="Room Name"
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          labelclassName="text-white text-lg"
        />

        <LabelledInput
          label="Password"
          type="password"
          placeholder="Enter room password (if required)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelclassName="text-white text-lg"
        />

        <Button
          type="submit"
          text="Join Room"
          className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          onClick={handleJoinRoom}
        />
      </div>
    </div>
  );
}
