'use client'

import {Children, createContext,ReactNode,useContext,useState} from 'react';

interface AuthContextType{
    token:string;
    setToken:React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext=createContext<AuthContextType|undefined>(undefined);


export default function ContextProvider({children}:{children:ReactNode}){
    const [token,setToken]=useState('');
    return(
        <AuthContext.Provider value={{token,setToken}}>
            {children}
        </AuthContext.Provider>
    )
}