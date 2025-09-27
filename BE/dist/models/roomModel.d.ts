import mongoose, { Schema } from "mongoose";
interface RoomType {
    _id: Schema.Types.ObjectId;
    roomName: string;
    capacity: number;
    createdBy: Schema.Types.ObjectId;
    members: Schema.Types.ObjectId[];
    isPrivate: boolean;
}
export declare const RoomModel: mongoose.Model<RoomType, {}, {}, {}, mongoose.Document<unknown, {}, RoomType, {}, mongoose.DefaultSchemaOptions> & RoomType & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<RoomType, mongoose.Model<RoomType, any, any, any, mongoose.Document<unknown, any, RoomType, any, {}> & RoomType & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RoomType, mongoose.Document<unknown, {}, mongoose.FlatRecord<RoomType>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<RoomType> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=roomModel.d.ts.map