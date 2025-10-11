import express from 'express';
export const roomRouter=express.Router();

import {
    getRooms,
    getRoomInfo,
    getMyRooms,
    getChats,
    createRoom
} from '../controllers/roomController';

import { verifyToken } from '../middleware/auth';

import { checkCreateRoomIP } from '../middleware/checkInput';

import { checkRoom } from '../middleware/room';

roomRouter.get('/getRooms',verifyToken,getRooms);

roomRouter.get('/roominfo/:roomName',verifyToken,getRoomInfo);

roomRouter.get('/chats/:roomId',verifyToken,checkRoom,getChats);

roomRouter.post('/create',verifyToken,checkCreateRoomIP,createRoom);//check if room is already available 

roomRouter.get('/myRooms',verifyToken,getMyRooms);