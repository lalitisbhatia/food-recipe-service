import App from './app'
import FoodController from './controllers/foods';
import RecipeController from './controllers/recipes';
import 'dotenv/config';
import { getPORT } from './utils/envHelper'; "./utils/envHelper"


const app:App = new App(
    [
        new RecipeController(),
        new FoodController()
    ], 
    getPORT()
    )

app.listen(); 