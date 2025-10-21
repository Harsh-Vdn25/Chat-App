import express from 'express';
import { verifyToken } from '../middleware/auth';
import { getMessages, saveMessages } from '../controllers/messageController';
export const messageRouter=express();

messageRouter.get('/:roomName',verifyToken,getMessages)
messageRouter.post('/save',verifyToken,saveMessages)