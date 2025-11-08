import { allSockets } from "./Websocket/chat";
import { saveMessages,type saveMessagesType } from "./models/messageModel";
import { redisClient } from "./config/redisClients";

export async function startWorker(){
    const subClient=redisClient.duplicate();
    await subClient.connect();
    let batch = <saveMessagesType[]>[];
    await subClient.subscribe("MESSAGES",async (msg)=>{
        if(msg){
            const messageObj = JSON.parse(msg);
            batch.push(messageObj);
            const roomInfo=allSockets.get(messageObj.roomName);
            if(roomInfo){
                roomInfo.forEach(x => {
                    x.socket.send(JSON.stringify({
                        message:messageObj.message,
                        userName:messageObj.userName
                    }))
                });
            }
        }
        if(batch.length>=3){
        console.log(batch);
        await flushMessages(batch);
        batch=[];
    }
})
}

async function flushMessages(batch: saveMessagesType[]) {
  try {
    await saveMessages(batch);
    console.log(`Saved messages`);
  } catch (err) {
    console.error("Error saving messages:", err);
  }
}