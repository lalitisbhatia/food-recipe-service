import App from './app'
import FoodController from './controllers/recipes';
import RecipeController from './controllers/recipes';


const app:App = new App(
    [
        new RecipeController()
    ], 
    3300
    )

app.listen();