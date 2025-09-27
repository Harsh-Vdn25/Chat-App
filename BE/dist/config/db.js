"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectDB = ConnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("./utils");
const mongo_url = utils_1.requiredInfo.MONGO_URL;
async function ConnectDB() {
    if (!mongo_url) {
        console.log("This is the url", mongo_url);
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(mongo_url);
        console.log("Connected to DB");
    }
    catch (err) {
        console.log(err);
    }
}
//# sourceMappingURL=db.js.map