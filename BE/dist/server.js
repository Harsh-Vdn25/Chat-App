"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = require("./Routes/userRoute");
const db_1 = require("./config/db");
const utils_1 = require("./config/utils");
const app = (0, express_1.default)();
const corsOptions = {
    origin: "http://localhost:5173"
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
//Routes
app.use('/api/v1/user', userRoute_1.userRouter);
const port = parseInt(utils_1.requiredInfo.PORT);
if (isNaN(port)) {
    throw new Error('No port specified');
}
async function main() {
    (0, db_1.ConnectDB)();
    app.listen(port, () => {
        console.log(`Server is running on PORT ${port}`);
    });
}
main();
//# sourceMappingURL=server.js.map