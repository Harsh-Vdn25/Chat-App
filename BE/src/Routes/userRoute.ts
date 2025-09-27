import express from 'express';
export const userRouter=express.Router();
import { Signin,Signup } from '../controllers/userController';

userRouter.post('/signup',Signup);

userRouter.post('/signin',Signin);