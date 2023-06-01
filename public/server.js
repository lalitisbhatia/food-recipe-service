"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const recipes_1 = __importDefault(require("./controllers/recipes"));
const app = new app_1.default([
    new recipes_1.default()
], 3300);
app.listen();
