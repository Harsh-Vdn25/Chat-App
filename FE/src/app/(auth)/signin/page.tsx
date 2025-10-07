'use client';
import api from "@/helpers/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface authreqType{
  username:string;
  password:string;
}

export default function Signin() {

  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const router=useRouter();

  async function SigninReq({username,password}:authreqType){  
  if(!username||!password){
    alert("please enter the required fields");
    return;
  }
  try{
    const response=await api.post(`/user/signin`,{
      username:username,
      password:password
    })
    if(response.status===200){
      router.push('/home')
      return;
    }
    alert(`${response.data?.message}`)
  }catch(err){
    console.log(err);
  }
}

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div
          className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 w-[350px]"
        >
          <div className="px-10 flex justify-center">
            <div className="text-3xl  text-gray-800 font-extrabold">
              Sign in
            </div>
          </div>
          <div className="pt-2">
            <LabelledInput label="Username" placeholder="harsha@gmail.com" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <LabelledInput label="Password" type="password" placeholder="123456" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button
              type="button"
              className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
              onClick={()=>SigninReq({username,password})}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  value:string;
  onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}

function LabelledInput({ label, placeholder, type,value,onChange }: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">
        {label}
      </label>
      <input
        type={type || "text"}
        value={value}
        onChange={onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-5 py-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
