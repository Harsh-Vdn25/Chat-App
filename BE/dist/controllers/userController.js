"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signin = exports.Signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = require("../models/userModel");
const utils_1 = require("../config/utils");
const utils_2 = require("../config/utils");
const userModel_2 = require("../models/userModel");
const SALT_ROUNDS = Number(utils_1.requiredInfo.SALT_ROUNDS);
const JWT_SECRET = utils_1.requiredInfo.JWT_SECRET;
const Signup = async (req, res) => {
    const { username, password } = req.body;
    try {
        const ExistingUser = await (0, userModel_2.getUserByName)(username);
        if (ExistingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const newUser = await userModel_1.userModel.create({
            username: username,
            password: hashedPassword
        });
        const token = (0, utils_2.TokenCreation)(newUser._id);
        res.status(200).json({
            message: "Signed up successfully",
            Token: token
        });
    }
    catch (err) {
        console.log("Serverside Error");
        res.status(500).json({ message: err });
    }
};
exports.Signup = Signup;
const Signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const UserData = await userModel_1.userModel.findOne({
            username,
        }).select("+password");
        if (!UserData) {
            res.status(400).json({ message: "User doesn't exist" });
            return;
        }
        const isValidated = await bcrypt_1.default.compare(password, UserData.password);
        if (!isValidated) {
            res.status(401).json({ message: "Wrong password" });
            return;
        }
        const token = (0, utils_2.TokenCreation)(UserData._id);
        res.status(200).json({
            message: "Signed in Successfully",
            Token: token,
        });
        return;
    }
    catch (err) {
        console.log("Serverside problem");
        return;
    }
};
exports.Signin = Signin;
//# sourceMappingURL=userController.js.map