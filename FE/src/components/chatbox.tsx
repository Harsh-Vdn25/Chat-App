"use client";
import { useEffect, useState, useContext, RefObject, useRef } from "react";
import { AuthContext, SocketContext } from "@/app/context/AuthProvider";
import sendMessage from "@/app/websocket/chat";

export interface ChatboxProps {
  roomName: string;
}

interface ChatsType {
  message: string;
  userId: string;
}

//so the chats are like this {"roomName":[{message,userId}]}
interface ChatObjType {
  [roomName: string]: ChatsType[];
}

export default function Chatbox({ roomName }: ChatboxProps) {
  const authcontext = useContext(AuthContext);
  const socketcontext = useContext(SocketContext);

  if (!authcontext) {
    throw new Error("");
  }
  if (!socketcontext) {
    throw new Error("");
  }

  const { token } = authcontext;
  const { socketRef,initializedRef } = socketcontext;
  const [message, setMessage] = useState("");
  const [Chats, setChats] = useState<ChatObjType>({});
  const [isJoin, setisJoin] = useState(true);

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
      if (message.message && message.userId) {
        setChats((prev) => ({
          ...prev,
          [roomName]: [...(prev[roomName] || []), message],
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    socketRef.current = null;

    async function setUpSocket() {
      await InitializeSocket(socketRef);
    }

    setUpSocket();

    return () => {
      if (process.env.NODE_ENV === "development") {
    console.log("Skipping cleanup in dev mode to avoid double socket init");
    return;
  }
      socketRef.current?.removeEventListener("open", handleOpen);
      socketRef.current?.removeEventListener("message", handleMessage);
      socketRef.current?.removeEventListener("close", handleClose);
      socketRef.current = null;
      initializedRef.current = false;
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
      <div className="p-4 bg-gray-800 text-white text-lg font-semibold shadow">
        {roomName}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-gray-700 text-white px-4 py-2 rounded-lg self-end max-w-xs">
          Welcome to {roomName}!
        </div>
        {Chats[roomName] ? (
          Chats[roomName].map((chat: ChatsType, index) => (
            <div
              className="bg-gray-700 flex flex-col text-white px-4 py-2 rounded-lg self-end max-w-xs"
              key={`${chat.userId}-${index}`}
            >
              <p>Sent By:</p>
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
