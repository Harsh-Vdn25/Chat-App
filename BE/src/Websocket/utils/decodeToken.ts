import { requiredInfo } from "../../config/utils";
import jwt, { JwtPayload } from "jsonwebtoken";

interface tokenType {
  id:string;
}

export const decodeToken=(token:string|null):string|undefined=>{
  if(!token){
    console.log("No token ");
    return;
  }
  const decodedToken=jwt.verify(token,requiredInfo.JWT_SECRET) as tokenType;
  console.log(decodedToken);
  return decodedToken.id;
}