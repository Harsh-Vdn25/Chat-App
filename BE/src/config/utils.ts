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


const getRequired=(input:string):string=>{
  const value=process.env[input];
  if(!value){
    throw new Error("No Value");
  }
  return value;
}



export const requiredInfo:ConfigType={
    PORT:getRequired('PORT'),
    MONGO_URL:getRequired('MONGO_URL'),
    JWT_SECRET:getRequired('JWT_SECRET'),
    SALT_ROUNDS:getRequired('SALT_ROUNDS'),
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


