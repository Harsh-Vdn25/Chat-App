"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import LabelledInput from "./Input";
import Button from "./button";
import { createRoom } from "@/app/api/room";
import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthProvider";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const router=useRouter();
   const authcontext=useContext(AuthContext);
   
     if(!authcontext){
       throw new Error('');
     }
     const {token}=authcontext;
   
     const sendCreateRoomReq=async()=>{
        try{
            const response=await createRoom({roomName,token,isPrivate,password});
            console.log(response);
            if(!response.message){
                return alert('Failed to create Room');
            }
            router.push('/home');
        }catch(err){
            console.log(err);
        }
     }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="flex flex-col w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-xl border border-gray-700 space-y-6">

        <h1 className="text-2xl font-semibold text-white text-center">
          Create a Room
        </h1>

        
        <LabelledInput
          label="Room Name"
          type="text"
          placeholder="e.g. random"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          labelclassName="text-white text-lg"
        />

        
        <div className="w-full">
          <label className="block text-gray-300 mb-2 font-medium">
            Privacy
          </label>
          <div className="flex gap-6">
            <label className="flex items-center text-gray-200 hover:text-white cursor-pointer">
              <input
                type="radio"
                name="privacy"
                className="accent-indigo-800 mr-2"
                checked={isPrivate}
                onChange={() => setIsPrivate(true)}
              />
              Private
            </label>
            <label className="flex items-center text-gray-200 hover:text-white cursor-pointer">
              <input
                type="radio"
                name="privacy"
                className="accent-indigo-800 mr-2"
                checked={!isPrivate}
                onChange={() => setIsPrivate(false)}
              />
              Public
            </label>
          </div>
        </div>

        {isPrivate && (
          <LabelledInput
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            labelclassName="text-white text-lg"
          />
        )}


        <Button
          type="submit"
          text="Create Room"
          className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          onClick={() => sendCreateRoomReq()}
        />
      </div>
    </div>
  );
}
