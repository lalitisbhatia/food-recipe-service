import App from './app'
import FoodController from './controllers/recipes';
import RecipeController from './controllers/recipes';
import 'dotenv/config';
import { getPORT } from './utils/envHelper'; "./utils/envHelper"


const app:App = new App(
    [
        new RecipeController()
    ], 
    getPORT()
    )

app.listen(); 