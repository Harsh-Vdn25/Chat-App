import {Request,Response,NextFunction} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { requiredInfo } from '../config/utils';
import { getUserName } from '../models/userModel';

export interface TokenType extends JwtPayload{
  id:string
}

export async function verifyToken(req: Request, res: Response, next: NextFunction){
  const BearerToken=req.headers.authorization;
  const Token=BearerToken?.split(' ')[1];
  if(!Token){
    return res.json("No Token");
  }
  
  const decoded=jwt.verify(Token,requiredInfo.JWT_SECRET) as TokenType;
  if(!decoded){
    console.log("Not authorized");
    return 'expired';
  }
  const userName=await getUserName(decoded.id);
  if(!userName){
    return res.status(404).json({message:"Username is not found"});
  }

  (req as any).userName=userName;
  next();
}

