"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
const env = process.env.NODE_ENV;
let DB_CONN = env === "dev" ? process.env.FR_DB_CONNECTION_LOCAL : process.env.FR_DB_CONNECTION;
class App {
    constructor(controllers, port) {
        this.initializeMiddlewares = () => {
            this.app.use(body_parser_1.default.json());
            this.app.use((0, cors_1.default)());
        };
        this.initializeDBConnection = () => {
            mongoose_1.default.connect(`${DB_CONN}`);
            const db = mongoose_1.default.connection;
            db.on("error", console.error.bind(console, "connection error: "));
            db.once("open", function () {
                console.log("Connected successfully");
            });
        };
        this.initializeControllers = ((controllers) => {
            controllers.forEach((controller) => {
                this.app.use('/', controller.router);
            });
        });
        this.listen = () => {
            this.app.listen(this.port, () => {
                console.log(`App listening on port ${this.port}`);
            });
        };
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeDBConnection();
        this.initializeControllers(controllers);
    }
}
exports.default = App;
