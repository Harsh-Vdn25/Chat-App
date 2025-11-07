import {Request,Response} from 'express';

import bcrypt from 'bcrypt';
import { userModel } from "../models/userModel";
import { requiredInfo } from '../config/utils';
import { TokenCreation } from "../config/utils";

import { getUserByName } from '../models/userModel';

const SALT_ROUNDS=Number(requiredInfo.SALT_ROUNDS);

export const Signup = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  
  try {
    const ExistingUser = await getUserByName(username);
    if (ExistingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const hashedPassword: string = await bcrypt.hash(
      password,
      SALT_ROUNDS
    );
    const newUser = await userModel.create({
      username: username,
      password: hashedPassword
    });
    const token:string=TokenCreation(newUser._id);
    res.status(200).json({
       message: "Signed up successfully",
       Token:token
     });
  } catch (err) {
    console.log("Serverside Error");
    res.status(500).json({ message: err });
  }
};

export const Signin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const UserData = await userModel.findOne({
      username,
    }).select("+password");
    if (!UserData) {
      res.status(400).json({ message: "User doesn't exist" });
      return;
    }

    const isAuthorized = await bcrypt.compare(password, UserData.password);
    
    if (!isAuthorized) {
      res.status(401).json({ message: "Wrong password" });
      return;
    }
    const token: string =TokenCreation(UserData._id); 
    res.status(200).json({
      message: "Signed in Successfully",
      Token: token,
    });
    return;
  } catch (err) {
    console.log("Serverside problem");
    return;
  }
};


