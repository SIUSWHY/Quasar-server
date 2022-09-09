"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoomSchema = new mongoose_1.Schema({
    roomId: String,
    chatType: String,
    users_id: Array
});
exports.default = (0, mongoose_1.model)('Room', RoomSchema);
//# sourceMappingURL=modelRoom.js.map