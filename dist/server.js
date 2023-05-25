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
// @ts-nocheck
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = require("./core/passport");
const models_1 = require("./models");
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const course_routes_1 = __importDefault(require("./routes/course-routes"));
const lesson_routes_1 = __importDefault(require("./routes/lesson-routes"));
const task_routes_1 = __importDefault(require("./routes/task-routes"));
const buy_course_routes_1 = __importDefault(require("./routes/buy-course-routes"));
const curator_routes_1 = __importDefault(require("./routes/curator-routes"));
const chat_routes_1 = __importDefault(require("./routes/chat-routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription-routes"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const onConnection_1 = __importDefault(require("./socket_io/onConnection"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(passport_1.passport.initialize());
app.use('/static', express_1.default.static('static'));
app.use('/auth', auth_routes_1.default);
app.use('/user', user_routes_1.default);
app.use('/course', course_routes_1.default);
app.use('/lesson', lesson_routes_1.default);
app.use('/task', task_routes_1.default);
app.use('/buy-course', buy_course_routes_1.default);
app.use('/curator', curator_routes_1.default);
app.use('/chat', chat_routes_1.default);
app.use('/subscription', subscription_routes_1.default);
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: process.env.FRONT_URL,
    serveClient: false
});
io.on('connection', (socket) => {
    console.log('connect');
    (0, onConnection_1.default)(io, socket);
});
server.listen(5001, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(models_1.User);
}));
//# sourceMappingURL=server.js.map