import express , { Application,Request,Response,Router } from "express";
import bodyParser  from "body-parser";
import cors  from 'cors';
import mongoose from "mongoose";
require("dotenv").config(); 

const env = process.env.NODE_ENV
let DB_CONN = env==="dev"?process.env.FR_DB_CONNECTION_LOCAL:process.env.FR_DB_CONNECTION


class App {
    public app: express.Application;
    public port: number;
    
    constructor(controllers:any,port:number){
        this.app = express();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeDBConnection()
        this.initializeControllers(controllers)
        
    }

    private initializeMiddlewares= ()=>{
        this.app.use(bodyParser.json())
        this.app.use(cors())
    }
    private initializeDBConnection = () => {
        mongoose.connect(`${DB_CONN}`);
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error: "));
        db.once("open", function () {
          console.log("Connected successfully");
        });
    }
    private initializeControllers = ((controllers: any) => {
        controllers.forEach((controller: any) =>{
            this.app.use('/',controller.router)
        })
    })


    public listen = () =>{
        this.app.listen(this.port,()=> {
            console.log(`App listening on port ${this.port}`)
        })
    }

   }

   export default App
