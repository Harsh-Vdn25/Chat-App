import {Request,Response,NextFunction} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RoomModel } from '../models/roomModel';
import { requiredInfo } from '../config/utils';

interface TokenType extends JwtPayload{
  id:string
}

export  function verifyToken(req: Request, res: Response, next: NextFunction){
  const BearerToken=req.headers.authorization;
  const Token=BearerToken?.split(' ')[1];
  if(!Token){
    return res.json("No Token");
  }
  console.log(Token);
  const decoded=jwt.verify(Token,requiredInfo.JWT_SECRET) as TokenType;
  if(!decoded){
    console.log("Not authorized");
    return;
  }
  console.log("decoded",decoded);
  (req as any).userId=decoded.id;
  next();
}

