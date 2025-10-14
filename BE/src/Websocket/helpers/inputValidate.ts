import { z } from "zod";
import { RawData, WebSocket } from "ws";

export interface messageType {
  type: "join" | "chat";
  roomName?: string;
  message?: string;
  token?: string;
  password?:string;
}

export const joinSchema = z.object({
  type: z.literal('join'),
  roomName: z.string().min(2),
  token: z.string().min(7),
  password:z.string().optional(),
});

export const chatSchema = z.object({
  type: z.literal('chat'),
  roomName:z.string().min(2),
  message: z.string().min(1)
});

export const ChangeRoomSchema=z.object({
  type:z.literal('change'),
  roomName:z.string().min(2),
  token:z.string().min(7),
})

const schema = {
  join: joinSchema,
  chat: chatSchema,
  change:ChangeRoomSchema,
};

export type joinType=z.infer<typeof joinSchema>;
export type  chatType=z.infer<typeof  chatSchema>;
export type ChangeRoomType=z.infer<typeof ChangeRoomSchema>;

export const checkIpRequest = (socket: WebSocket, message: RawData) => {
    let messageInfo:joinType|chatType|ChangeRoomType;
  try{
    messageInfo= JSON.parse(message.toString());
  }catch(err){
    socket.send(
      JSON.stringify({
        error: "Invalid message",
      })
    );
    return;
  }

  const schemaType = schema[`${messageInfo.type}`];
  if (!schemaType) {
    socket.send(JSON.stringify({ error: "Unknown message type" }));
    return;
  }

  const parsed = schemaType.safeParse(messageInfo);
  if (!parsed.success) {
    socket.send(JSON.stringify({ error: "Fill all the fields" }));
    return;
  }
  return parsed;
};
