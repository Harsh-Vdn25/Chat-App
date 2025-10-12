"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthProvider";
import { getToken } from "./api/room";

export default function MainPage() {
  const context = useContext(AuthContext);
  const router = useRouter();
  if (!context) {
    throw new Error("");
  }
  const { token, setToken } = context;

  useEffect(() => {
    const clienttoken = getToken();
    if (!clienttoken) {
      router.push('/signin')
      return;
    }
    setToken(clienttoken);
    router.push("/home");
  }, [router,token]);
  return <div>Landing Page</div>;
}