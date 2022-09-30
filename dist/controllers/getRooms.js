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
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../helpers/verifyToken"));
const modelRoom_1 = __importDefault(require("../models/modelRoom"));
const getRooms = express_1.default.Router();
getRooms.post('/getRooms', verifyToken_1.default, (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body._id;
    console.log(userId);
    const Rooms = yield modelRoom_1.default.find({ users_id: userId }).populate('users_id');
    res.json(Rooms);
}));
exports.default = getRooms;
//# sourceMappingURL=getRooms.js.map