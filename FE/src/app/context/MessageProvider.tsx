import { ReactNode, SetStateAction, createContext,useState } from "react";


export interface ChatsType {
  message: string;
  userName: string;
}

//so the chats are like this {"roomName":[{message,userName}]}
export interface ChatObjType {
  [roomName: string]: ChatsType[];
}

interface ChatStateType{
    Chats:ChatObjType;
    setChats:React.Dispatch<SetStateAction<ChatObjType>>;
}

export const ChatContext=createContext<ChatStateType|undefined>(undefined);

export default function  MessageProvider({children}:{children:ReactNode}){
    const [Chats,setChats]=useState({});
    return (
        <ChatContext.Provider value={{Chats,setChats}}>
        {children}
    </ChatContext.Provider>
    );
}