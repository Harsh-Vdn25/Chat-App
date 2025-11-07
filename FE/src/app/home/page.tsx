"use client";

import Sidebar, { RoomsType } from "@/components/sidebar";
import { getMyRooms, fetchAllRooms, getToken } from "../api/room";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import Chatbox from "@/components/chatbox";
import Button from "@/components/button";
import CreateRoom from "@/components/CreateRoom";
import joinRoom from "@/components/joinRoom";

export default function Home() {
  const router = useRouter();
  const authcontext = useContext(AuthContext);

  const [roomsData, setRoomsData] = useState<RoomsType | null>(null);
  const [allrooms, setAllRooms] = useState(false);
  const [activeRoom, setActiveRoom] = useState("");
  const [create, setCreate] = useState(false);
  const [Join, setJoin] = useState(false);

  if (!authcontext) {
    throw new Error("Home must be used within AuthContextProvider");
  }
  const { token, setToken } = authcontext;

  useEffect(() => {
    const clientToken = getToken();
    if (!clientToken) {
      router.push("/signin");
      return;
    }
    setToken(clientToken);
  }, [router, setToken]);
useEffect(() => {
    if (!token) return;
    async function getRoomInfo() {
      try {
        const response = allrooms
          ? await fetchAllRooms(token)
          : await getMyRooms(token);
          console.log(response);
        if (response.data==='expired') {
          localStorage.removeItem("token");
          router.push("/signin");
          return;
        }

        setRoomsData(response);
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/signin");
      }
    }

    getRoomInfo();
  }, [token, allrooms, router]);

  if (!roomsData) return <div>Loading rooms...</div>;
  return (
    <div className="flex h-screen">
      <Sidebar
        data={roomsData}
        setAllRooms={setAllRooms}
        allrooms={allrooms}
        setActiveRoom={setActiveRoom}
      />

      {activeRoom ? (
        <div className="flex-1">
          <Chatbox roomName={activeRoom} setActiveRoom={setActiveRoom} />
        </div>
      ) : (
        <div className="flex-1 max-h-4 flex-col justify-center  items-center">
          <div className="flex items-center px-2 py-1 gap-2  bg-gray-700">
            <Button
              type="text"
              text="Join"
              className="border border-white rounded-md py-1 px-2"
              onClick={() => {
                setJoin(true);
                setCreate(false);
              }}
            />
            <Button
              type="text"
              text="Create"
              className="border border-white rounded-md py-1 px-2"
              onClick={() => {
                setJoin(false);
                setCreate(true);
              }}
            />
          </div>

          {create ? (
            <CreateRoom/>
          ) : (
            <div className="flex h-screen bg-white justify-center items-center">
              <div className="max-w-xl text-center text-gray-800 text-lg">
                <p>
                  This is a real-time chat application where users can join or
                  create chat rooms to communicate with others.
                </p>
              </div>
            </div>
          )}
          {Join?(
            <p>Hello</p>
          ):(
            <div className="flex h-screen bg-white justify-center items-center">
              <div className="max-w-xl text-center text-gray-800 text-lg">
                <p>
                  This is a real-time chat application where users can join or
                  create chat rooms to communicate with others.
                </p>
              </div>
            </div>
          )
          }
        </div>
      )}
    </div>
  );
}
