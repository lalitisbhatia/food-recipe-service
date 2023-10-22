"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const songs_1 = __importDefault(require("./controllers/songs"));
// import CitiesController from "./controllers/cities"
require("dotenv/config");
const envHelper_1 = require("./utils/envHelper");
console.log((0, envHelper_1.getPORT)());
const app = new app_1.default([
    new songs_1.default()
], (0, envHelper_1.getPORT)());
app.listen();
