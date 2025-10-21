"use client";
import { useEffect, useState, useContext, RefObject } from "react";
import { AuthContext, SocketContext } from "@/app/context/AuthProvider";
import { ChatContext, type ChatsType } from "@/app/context/MessageProvider";
import sendMessage from "@/app/websocket/chat";
import Button from "./button";
import { getMessages, saveMessages } from "@/app/api/message";

export interface ChatboxProps {
  roomName: string;
  setActiveRoom: React.Dispatch<React.SetStateAction<string>>;
}

export default function Chatbox({ roomName, setActiveRoom }: ChatboxProps) {
  const authcontext = useContext(AuthContext);
  const socketcontext = useContext(SocketContext);
  const chatcontext = useContext(ChatContext);
  if (!authcontext) {
    throw new Error("");
  }
  if (!socketcontext) {
    throw new Error("");
  }
  if (!chatcontext) {
    throw new Error("");
  }

  const { token } = authcontext;
  const { socketRef } = socketcontext;
  const [activeChats,setActiveChats]=useState<ChatsType[]>([]);
  const [message, setMessage] = useState("");
  const [isJoin, setisJoin] = useState(true);
  const [prevRoom,setPrevRoom]=useState('');

  async function InitializeSocket(socketRef: RefObject<WebSocket | null>) {
    if (!socketRef.current) {
      socketRef.current = new WebSocket("ws://localhost:5001");

      await new Promise<void>((resolve) => {
        socketRef.current!.addEventListener("open", () => {
          console.log("connected");
          resolve();
        });

        socketRef.current?.addEventListener("open", handleOpen);
        socketRef.current?.addEventListener("close", handleClose);
        socketRef.current?.addEventListener("message", handleMessage);
      });

      await sendMessage({
        socketRef,
        roomName,
        token,
        message,
        isJoin,
        setisJoin,
      });
    }
    return socketRef.current;
  }

  const handleOpen = () => console.log("connected");
  const handleClose = () => console.log("Socket closed");

  const handleMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      console.log(message, typeof message);
      if (message.message && message.userName) {
        setActiveChats((prevChats)=>([
          ...prevChats,
          message
        ]));
      }
    } catch (err) {
      console.log(err);
    }
  };


useEffect(() => {
  const handleRoomChange = async () => {
    if (!roomName || !token) return;

    if (prevRoom && activeChats.length > 0) {
      try {
        await saveMessages({ roomName: prevRoom, token, activeChats });
        console.log("Messages saved successfully");
        setActiveChats([]);
      } catch (err) {
        console.error("Error saving messages:", err);
      }
    } else {
      setPrevRoom(roomName);
    }

    try {
      const messages= await getMessages({ roomName, token });

      if (!messages) {
        return;
      }
      const prevRoomMessages:ChatsType[]=messages?.data;
      setActiveChats(prevRoomMessages);
    } catch (err) {
      console.error("Error fetching previous messages:", err);
    }

    try {
      if (!socketRef.current) {
        await InitializeSocket(socketRef);
      }

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        await socketRef.current.send(
          JSON.stringify({
            type: "change",
            roomName,
            token,
          })
        );
        console.log("Room changed successfully");
      }
    } catch (err) {
      console.error("Socket initialization or room change failed:", err);
    }
  };

  handleRoomChange();

  return () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Skipping cleanup in dev mode to avoid double socket init");
      return;
    }

    socketRef.current?.removeEventListener("open", handleOpen);
    socketRef.current?.removeEventListener("message", handleMessage);
    socketRef.current?.removeEventListener("close", handleClose);
    socketRef.current = null;
    setisJoin(false);
  };
}, [roomName]);


  async function sendMessagehelper() {
    await sendMessage({
      socketRef,
      roomName,
      token,
      message,
      isJoin,
      setisJoin,
    });
    setMessage("");
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="p-4 flex justify-between bg-gray-800 text-white text-lg font-semibold shadow">
        <div>{roomName}</div>

        <Button
          type="button"
          text="Close"
          onClick={() => setActiveRoom("")}
          className="hover:border-b p-1 m-0 text-md hover:border-b-white"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-gray-700 text-white px-4 py-2 rounded-lg self-end max-w-xs">
          Welcome to {roomName}!
        </div>
        {activeChats ? (
          activeChats.map((chat: ChatsType, index) => (
            <div
              className="bg-gray-700 flex flex-col text-white px-4 py-2 rounded-lg self-end max-w-xs"
              key={`${chat.userName}-${index}`}
            >
              <p>Sent By:{chat.userName}</p>
              <p>{chat.message}</p>
            </div>
          ))
        ) : (
          <div className="bg-gray-700 text-white px-4 py-2 rounded-lg self-end max-w-xs">
            No Messages
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-300 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border text-black border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          onClick={sendMessagehelper}
        >
          Send
        </button>
      </div>
    </div>
  );
}
