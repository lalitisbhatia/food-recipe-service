import express, {Request,Response} from 'express';
const recipeData  =  require("../data/recipeData_basic_obj")
const { get } = require("http")
import recipesArray from "../data/recipeData_full"
const recipeModel = require("../interfaces/models");
const  generateTrie  = require('../utils/generateTrie');
const similarRecipes= require('../utils/similarRecipes')

class RecipesController {
    public path = '/recipes';
    public router = express.Router();
    private trie  = {};

    constructor() {
        this.initializeRoutes();
        this.initializeTrie()
    }

    private initializeRoutes() {
        this.router.get("/", this.getAllRecipes);
        this.router.get(`${this.path}`, this.getAllRecipes);
        this.router.get(`${this.path}/similar/:id`, this.getSimilarRecipes);
        this.router.get(`${this.path}/:id`, this.getRecipe);
        this.router.get(`${this.path}/utils/trie`, this.getRecipeTrie);
        // this.router.post(`${this.path}`, this.createRecipe)
    }

    private async initializeTrie() {
        this.trie = await generateTrie.generateTrie();
        const byteSize = (str:any) => new Blob([str]).size;
        console.log(`Byte size of the Trie = ${byteSize(JSON.stringify(this.trie))} `)
    }

    private  handleSend (data:any,res:Response) {
        try{
            res.status(200).json({"data":data});
        }catch(err){
            res.status(500).json({error:err})
        }
    }

    private getAllRecipes = (req:Request,res:Response) => {
        console.log(`requested count : ${req.query.num}`)
        console.log(`requested from db? : ${req.query.db}`)
        let allRecipes;

        if(req.query.db==="true"||req.query.db===undefined){
            this.getRecipesFromDB(req.query.num).then(data =>{
                console.log("getting fom db");
                this.handleSend(data,res);
            })            
        }else{
            console.log("getting fom local");
            allRecipes = this.getRecipesFromLocal(req.query.num)
            this.handleSend(allRecipes,res);
        }
    }

    private getRecipesFromLocal  (num:any)  {
        return recipesArray.slice(0,num||20) //Object.fromEntries
    }
    private getRecipesFromDB = async (num:any) => {
        let nRecipes = await recipeModel.find() //Object.fromEntries(Object.entries
        // Shuffle array to retunr 20 random recipes
        // const shuffled = nRecipes.sort(() => 0.5 - Math.random());
        // console.log(shuffled.name)
        // Get sub-array of first n elements after shuffled
    
        return nRecipes.slice(0,num||20)
    }

    
    private getRecipe = async (req:Request,res:Response) => {
        console.log(`requested recipe : ${req.params.id}`)
        let recipe = await recipeModel.findOne({id:req.params.id})
        this.handleSend(recipe,res)
    }

    private getRecipeTrie = async (req:Request,res:Response) => {
        // let trie = await generateTrie.generateTrie();
        res.status(200).json(this.trie);
    }

    private getSimilarRecipes = async (req:Request,res:Response) => {
        let recipeId =  req.params.id;
        let similar_recipes = await similarRecipes.getSimilarRecipes(parseInt(recipeId))
        // console.log("similarRecipes: ",similar_recipes);
        this.handleSend(similar_recipes,res)
    }

    private createRecipe = (req:Request,res:Response) => {
        
    }
}

export default RecipesController