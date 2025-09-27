import mongoose, { Schema } from "mongoose";
interface MessageType {
    _id: Schema.Types.ObjectId;
    message: string;
    sentBy: Schema.Types.ObjectId;
    roomId: Schema.Types.ObjectId;
}
export declare const messageModel: mongoose.Model<MessageType, {}, {}, {}, mongoose.Document<unknown, {}, MessageType, {}, mongoose.DefaultSchemaOptions> & MessageType & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<MessageType, mongoose.Model<MessageType, any, any, any, mongoose.Document<unknown, any, MessageType, any, {}> & MessageType & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, MessageType, mongoose.Document<unknown, {}, mongoose.FlatRecord<MessageType>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<MessageType> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=messageModel.d.ts.map