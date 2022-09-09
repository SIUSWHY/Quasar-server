"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modelUser_1 = __importDefault(require("../models/modelUser"));
const express_1 = __importDefault(require("express"));
const createToken_1 = __importDefault(require("../helpers/createToken"));
const LoginUser = express_1.default.Router();
LoginUser.post('/loginUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password } = req.body;
        const user = yield modelUser_1.default.findOne({ $and: [{ name }, { password }] });
        if (user !== null) {
            const token = (0, createToken_1.default)({
                user
            });
            return res
                .status(200)
                .send({ massege: 'You login. Welcome', user, token });
        }
        return res.status(400).send({ message: 'User not found', type: 'negative' });
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = LoginUser;
//# sourceMappingURL=login.js.map