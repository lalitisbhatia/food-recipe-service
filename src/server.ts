import App from './app'
import FoodController from './controllers/recipes';
import RecipeController from './controllers/recipes';
import 'dotenv/config';
// console.log("*********  process.env *********")
// console.log(process.env.NODE_ENV) 
// console.log("*********  process.env *********")
const env = process.env.NODE_ENV
let PORT = env==="dev"?process.env.FR_SVC_PORT_LOCAL : process.env.FR_SVC_PORT_CONT

const app:App = new App(
    [
        new RecipeController()
    ], 
    PORT
    )

app.listen(); 