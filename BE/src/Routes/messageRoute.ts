import express from 'express';
import { verifyToken } from '../middleware/auth';
import { getMessages } from '../controllers/messageController';
export const messageRouter=express();

messageRouter.get('/:roomName',verifyToken,getMessages)