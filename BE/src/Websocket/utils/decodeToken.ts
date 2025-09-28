import { requiredInfo } from "../../config/utils";
import jwt from "jsonwebtoken";


export const decodeToken=(token:string|null):Object|undefined=>{
  if(!token){
    console.log("No token ");
    return;
  }
  const decodedToken=jwt.verify(token,requiredInfo.JWT_SECRET);
  console.log(decodedToken);
}