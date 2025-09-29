import express from 'express';
export const roomRouter=express.Router();

import {
    getRooms,
    getRoomInfo,
    getChats,
    createRoom
} from '../controllers/roomController';

import { verifyToken } from '../middleware/auth';

import { checkRoom } from '../middleware/room';

roomRouter.get('/getRooms',verifyToken,getRooms);

roomRouter.get('/roominfo',verifyToken,checkRoom,getRoomInfo);

roomRouter.get('/chats/:roomId',verifyToken,checkRoom,getChats);

roomRouter.post('/create',verifyToken,createRoom);//check if room is already available 

// roomRouter.post('/join',verifyToken,checkRoom,joinRoom)/
