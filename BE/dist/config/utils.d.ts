import { Schema } from 'mongoose';
interface ConfigType {
    PORT: string;
    MONGO_URL: string;
    JWT_SECRET: string;
    SALT_ROUNDS: string;
}
export declare const requiredInfo: ConfigType;
export declare const TokenCreation: (Id: Schema.Types.ObjectId) => string;
export {};
//# sourceMappingURL=utils.d.ts.map