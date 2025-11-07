import express from 'express';
import http from 'http';
import cors from 'cors';
import { createClient } from 'redis';

import { userRouter } from './Routes/userRoute';
import { roomRouter } from './Routes/roomRoute';
import { ConnectDB } from './config/db';
import { requiredInfo } from './config/utils';
import { connectWebSocket } from './Websocket/chat';
import { messageRouter } from './Routes/messageRoute';
import { redisClients } from './config/redisClients';

const app=express();
const corsOptions={
    origin:"http://localhost:3000"
}

app.use(cors(corsOptions));
app.use(express.json());



//Routes
app.use('/api/v1/user',userRouter)
app.use('/api/v1/room',roomRouter);
app.use('/api/v1/message',messageRouter);
const server=http.createServer(app);

//pass the HTTP server inot the Websocket 
connectWebSocket(server);

//port declaration
const port:number =parseInt(requiredInfo.PORT);
if(isNaN(port)){
    throw new Error('No port specified');    
}

async function main(){
    try{
        for(const rc of redisClients){
            await rc.connect();
        }
        await ConnectDB();
    server.listen(port,()=>{
        console.log(`Server is running on PORT ${port}`);
    })
    }catch(err){
        console.log("Failed to start the server");
    }
}

main();