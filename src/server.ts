import App from './app'
import SongsController from './controllers/songs';

// import CitiesController from "./controllers/cities"
import 'dotenv/config';
import { getPORT } from './utils/envHelper';

console.log(getPORT())
const app:App = new App(
    [
        new SongsController()
    ], 
    getPORT()
    )

app.listen(); 