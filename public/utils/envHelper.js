"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDBCONN = exports.getPORT = void 0;
require("dotenv/config");
const getPORT = () => {
    const env = process.env.NODE_ENV;
    let PORT = env === "dev" ? process.env.FR_SVC_PORT_LOCAL : process.env.FR_SVC_PORT_CONT;
    return PORT;
};
exports.getPORT = getPORT;
const getDBCONN = () => {
    const env = process.env.NODE_ENV;
    let DB_CONN = env === "dev" ? process.env.FR_DB_CONNECTION_LOCAL : process.env.FR_DB_CONNECTION;
    return DB_CONN;
};
exports.getDBCONN = getDBCONN;
