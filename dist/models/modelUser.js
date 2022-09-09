"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: String,
    password: String
});
exports.default = (0, mongoose_1.model)('Users', UserSchema);
//# sourceMappingURL=modelUser.js.map