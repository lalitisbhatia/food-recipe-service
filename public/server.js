"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const foods_1 = __importDefault(require("./controllers/foods"));
const recipes_1 = __importDefault(require("./controllers/recipes"));
require("dotenv/config");
const envHelper_1 = require("./utils/envHelper");
"./utils/envHelper";
const app = new app_1.default([
    new recipes_1.default(),
    new foods_1.default()
], (0, envHelper_1.getPORT)());
app.listen();
