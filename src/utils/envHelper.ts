import 'dotenv/config';

export const getPORT = ()=>{
    const env = process.env.NODE_ENV
    let PORT:any = env==="dev"?process.env.HS_SVC_PORT_LOCAL : process.env.HS_SVC_PORT_CONT;
    return PORT;
}

export const getDBCONN = () => {
    const env = process.env.NODE_ENV
    let DB_CONN = env==="dev"?process.env.HS_DB_CONNECTION_LOCAL:process.env.HS_DB_CONNECTION
    return DB_CONN;
}