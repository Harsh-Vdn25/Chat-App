import express from 'express';
import http from 'http';
require("dotenv").config();
import cors from 'cors';

import { userRouter } from './Routes/userRoute';
import { roomRouter } from './Routes/roomRoute';
import { ConnectDB } from './config/db';
import { requiredInfo } from './config/utils';
import { connectWebSocket } from './Websocket/chat';


const app=express();
const corsOptions={
    origin:"http://localhost:5173"
}

app.use(cors(corsOptions));
app.use(express.json());

//Routes
app.use('/api/v1/user',userRouter);
app.use('/api/v1/room',roomRouter);

const server=http.createServer(app);

//pass the HTTP server inot the Websocket 
connectWebSocket(server);

//port declaration
const port:number =parseInt(requiredInfo.PORT);
if(isNaN(port)){
    throw new Error('No port specified');    
}

async function main(){
    ConnectDB();
    server.listen(port,()=>{
        console.log(`Server is running on PORT ${port}`);
    })
}

main();