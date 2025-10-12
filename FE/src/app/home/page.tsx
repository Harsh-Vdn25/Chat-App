"use client";

import Sidebar, { RoomsType } from "@/components/sidebar";
import { getMyRooms, fetchAllRooms, getToken } from "../api/room";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import Chatbox from "@/components/chatbox";

export default function Home() {
  const router=useRouter();
  const authcontext=useContext(AuthContext);

  const [roomsData, setRoomsData] = useState<RoomsType | null>(null);
  const [allrooms,setAllRooms]=useState(false);
  
  if(!authcontext){
    throw new Error("Home must be used within AuthContextProvider");
  }
  const {token,setToken}=authcontext;

  useEffect(()=>{
    const clientToken=getToken();
    if(!clientToken){
      router.push('/signin');
      return;
    }
    setToken(clientToken);
  },[router,setToken])

  useEffect(() => {
    if (!token) return;
    async function getRoomInfo() {
      const response = allrooms ? await fetchAllRooms(token) : await getMyRooms(token);
      console.log(response.data);
      setRoomsData(response);
    }
    getRoomInfo();
  }, [token,allrooms]);

  if (!roomsData) return <div>Loading rooms...</div>;

  return (
    <div className="absolute">
      <Sidebar data={roomsData} setAllRooms={setAllRooms} allrooms={allrooms}/>
      <Chatbox/>
    </div>
  );
}
