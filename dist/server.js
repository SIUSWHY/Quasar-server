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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const login_1 = __importDefault(require("./controllers/login"));
const getUsers_1 = __importDefault(require("./controllers/getUsers"));
const getUser_1 = __importDefault(require("./controllers/getUser"));
const getUnreadMessages_1 = __importDefault(require("./controllers/getUnreadMessages"));
const getCurrentUser_1 = __importDefault(require("./controllers/getCurrentUser"));
const modelRoom_1 = __importDefault(require("./models/modelRoom"));
const modelMessage_1 = __importDefault(require("./models/modelMessage"));
const getCompanion_1 = __importDefault(require("./controllers/getCompanion"));
const getRooms_1 = __importDefault(require("./controllers/getRooms"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const httpServer = (0, http_1.createServer)(app);
        const io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*'
            }
            /* options */
        });
        const port = process.env.PORT || 3000;
        app.use((0, cors_1.default)());
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.json());
        yield mongoose_1.default
            .connect('mongodb+srv://quasarapp.ebpoijk.mongodb.net/QuasarMobileApp?retryWrites=true&w=majority', {
            user: process.env.DB_USER,
            pass: process.env.DB_PASS
        })
            .then(() => {
            console.log('Connection to the Atlas Cluster is successful!');
        })
            .catch((err) => console.error(err));
        app.use([
            login_1.default,
            getUsers_1.default,
            getCurrentUser_1.default,
            getCompanion_1.default,
            getRooms_1.default,
            getUser_1.default,
            getUnreadMessages_1.default
        ]);
        const sockets = new Map();
        io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            let token = socket.handshake.query.token;
            let { user } = jsonwebtoken_1.default.verify(token, 'JWT_KEY');
            let chatType = socket.handshake.query.chatType;
            let roomId = `${Date.now()}`;
            let users_id = [];
            let roomData;
            sockets.set(user._id, socket.id);
            console.log(user);
            socket.on('companionId', (data) => __awaiter(this, void 0, void 0, function* () {
                roomData = {
                    roomId: roomId,
                    chatType: chatType,
                    users_id: [user._id, data.companionId]
                };
                console.log('roomData', roomData);
                let room = yield modelRoom_1.default.findOne({
                    $and: [
                        { users_id: user._id },
                        { users_id: data.companionId },
                        { chatType: 'double' }
                    ]
                });
                if (!room) {
                    room = yield modelRoom_1.default.create(roomData);
                }
                socket.join(room.roomId);
                postMessageforUsers(room);
                const messages = yield modelMessage_1.default.find({
                    roomId: room.roomId
                });
                socket.emit('join', {
                    room: room,
                    messages: messages
                });
                // socket.on('message', onSocketMessage)
            }));
            console.log(`
    ${user.name} - connected`);
            socket.on('disconnecting', () => {
                console.log(socket.rooms);
            });
            socket.on('disconnect', () => {
                console.log(`
      ${user.name} - disconnected`);
            });
            function postMessageforUsers(room) {
                socket.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
                    const message = data.message;
                    console.log(message);
                    // save to DB
                    // const message = await Message.create()
                    // const dataForSocket = adaptMessage(message)
                    // io.to(roomId).emit('ok', dataForSocket)
                    yield modelMessage_1.default.create({
                        roomId: room.roomId,
                        stamp: message.stamp,
                        messageText: message.messageText,
                        userId: message.userId,
                        whoRead: message.whoRead
                    });
                    // ;(await modelRoom.findById(room_id))?.messages0
                    // await modelMessage.find({ roomId: room_id })
                    io.to(room.roomId).emit('ok', { data });
                    room.users_id.forEach((userId) => {
                        const userIdString = userId.toString();
                        const socket_id = sockets.get(userIdString);
                        console.log(socket_id, userIdString, sockets);
                        if (userId === user._id) {
                            return;
                        }
                        io.to(socket_id).emit('newMessNotify', room.roomId);
                    });
                }));
            }
            // function getRoom(room) {
            //   socket.emit('getRoom', room)
            // }
        }));
        httpServer.listen(port, () => console.log(`
  Example app listening on port ${port}!
  `));
    });
}
run();
//# sourceMappingURL=server.js.map