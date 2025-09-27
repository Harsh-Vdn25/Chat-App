import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Schema } from 'mongoose';
dotenv.config();

interface ConfigType{
    PORT:string;
    MONGO_URL:string;
    JWT_SECRET:string;
    SALT_ROUNDS:string;
}

export const requiredInfo:ConfigType={
    PORT:process.env.PORT||'',
    MONGO_URL:process.env.MONGO_URL||'',
    JWT_SECRET:process.env.JWT_SECRET||'',
    SALT_ROUNDS:process.env.SALT_ROUNDS||''
}


export const TokenCreation =(Id:Schema.Types.ObjectId)=>{
    const token=jwt.sign(
      {
        id: Id.toString(),
      },
      requiredInfo.JWT_SECRET,{
        expiresIn:'2 days'
      }
    );
    return token;
}