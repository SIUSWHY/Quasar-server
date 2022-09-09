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
const modelUser_1 = __importDefault(require("../models/modelUser"));
const getCompanion = express_1.default.Router();
getCompanion.post('/getCompanion', verifyToken_1.default, (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const companionUserData = req.body;
    console.log(companionUserData);
    const Companion = yield modelUser_1.default.findOne(companionUserData);
    res.json(Companion);
}));
exports.default = getCompanion;
//# sourceMappingURL=getCompanion.js.map