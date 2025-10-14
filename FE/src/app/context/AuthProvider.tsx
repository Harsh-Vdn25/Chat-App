"use client";

import { createContext, ReactNode, RefObject, useRef, useState } from "react";

interface AuthContextType {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}
interface RefObjectType {
  socketRef: RefObject<WebSocket | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
export const SocketContext = createContext<RefObjectType | null>(null);

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState("");
  const socketRef = useRef(null);
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <SocketContext.Provider value={{socketRef}}>
        {children}
      </SocketContext.Provider>
    </AuthContext.Provider>
  );
}
