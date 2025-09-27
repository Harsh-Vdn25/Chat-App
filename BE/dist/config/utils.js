"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCreation = exports.requiredInfo = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
exports.requiredInfo = {
    PORT: process.env.PORT || '',
    MONGO_URL: process.env.MONGO_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    SALT_ROUNDS: process.env.SALT_ROUNDS || ''
};
const TokenCreation = (Id) => {
    const token = jsonwebtoken_1.default.sign({
        id: Id.toString(),
    }, exports.requiredInfo.JWT_SECRET, {
        expiresIn: '2 days'
    });
    return token;
};
exports.TokenCreation = TokenCreation;
//# sourceMappingURL=utils.js.map