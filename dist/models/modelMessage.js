"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    messageText: Array,
    stamp: Date,
    userId: String,
    roomId: String,
    whoRead: (Array)
});
exports.default = (0, mongoose_1.model)('Message', MessageSchema);
//# sourceMappingURL=modelMessage.js.map