import mongoose, { Schema } from "mongoose";
interface PrivateRoomMethod {
    roomId: Schema.Types.ObjectId;
    password: string;
}
export declare const PrivateRoomModel: mongoose.Model<PrivateRoomMethod, {}, {}, {}, mongoose.Document<unknown, {}, PrivateRoomMethod, {}, mongoose.DefaultSchemaOptions> & PrivateRoomMethod & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<PrivateRoomMethod, mongoose.Model<PrivateRoomMethod, any, any, any, mongoose.Document<unknown, any, PrivateRoomMethod, any, {}> & PrivateRoomMethod & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, PrivateRoomMethod, mongoose.Document<unknown, {}, mongoose.FlatRecord<PrivateRoomMethod>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<PrivateRoomMethod> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=PrivateRoomModel.d.ts.map