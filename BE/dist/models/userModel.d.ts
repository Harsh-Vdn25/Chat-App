import mongoose, { Schema } from "mongoose";
export interface userType {
    _id: Schema.Types.ObjectId;
    username: string;
    password: string;
}
export declare const userModel: mongoose.Model<userType, {}, {}, {}, mongoose.Document<unknown, {}, userType, {}, mongoose.DefaultSchemaOptions> & userType & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<userType, mongoose.Model<userType, any, any, any, mongoose.Document<unknown, any, userType, any, {}> & userType & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, userType, mongoose.Document<unknown, {}, mongoose.FlatRecord<userType>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<userType> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
export declare const getUserByName: (username: string) => Promise<boolean | undefined>;
//# sourceMappingURL=userModel.d.ts.map