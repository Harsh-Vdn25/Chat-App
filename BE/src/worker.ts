import { saveMessages } from "./Websocket/helpers/saveMessage";
import { createClient } from "redis";
import { allSockets } from "./Websocket/chat";
import {type saveMessagesType } from "./Websocket/helpers/saveMessage";

const redisClient=createClient({url:"redis://localhost:6379"});

async function startWorker(){
    await redisClient.connect();
    const batch = <saveMessagesType[]>[];

    while(true){
        const result = await redisClient.brPop("chat",5);
    if(result){
            const val = result.element;
            const messageObj = JSON.parse(val);
            batch.push();
            const roomInfo=allSockets.get(messageObj.roomName);
            if(roomInfo){
                roomInfo.map((x)=>{
                    x.socket.send(JSON.stringify({
                        message:messageObj.message,
                        userName:messageObj.userName
                    }))
                })
            }
        }

        if(batch.length>=30 || (!result && batch.length > 0)){
            try{
                await saveMessages(batch);
                console.log("Saved the messages");
            }catch(err){
                console.log(err);
            }
        }
    }
}
startWorker();