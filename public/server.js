"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const recipes_1 = __importDefault(require("./controllers/recipes"));
require("dotenv/config");
// console.log("*********  process.env *********")
// console.log(process.env.NODE_ENV) 
// console.log("*********  process.env *********")
const env = process.env.NODE_ENV;
let PORT = env === "dev" ? process.env.FR_SVC_PORT_LOCAL : process.env.FR_SVC_PORT_CONT;
const app = new app_1.default([
    new recipes_1.default()
], PORT);
app.listen();
