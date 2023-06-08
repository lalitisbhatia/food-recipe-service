import express, {Request,Response} from 'express';

// const recipeData  =  require("../data/recipeData_basic_obj")
const { get } = require("http")
import recipesArray from "../data/recipeData_full"
const recipeModel = require("../interfaces/models");
// import {generateTrie,search,TrieNode,Options} from "../utils/generateTrie" 
import {generateTrie,search,TrieNode,Options} from "fast-trie-search"
const similarRecipes= require('../utils/similarRecipes')

import foodsArray from "../data/foods"

class RecipesController {
    public path = '/recipes';
    public router = express.Router();
    private trie = new TrieNode();
    private foodTrie = {}

    constructor() {
        this.initializeRoutes();
        this.initializeRecipeTrie();
    }

    private initializeRoutes() {
        this.router.get("/", this.getAllRecipes);
        this.router.get(`${this.path}`, this.getAllRecipes);
        this.router.get(`${this.path}/similar/:id`, this.getSimilarRecipes);
        this.router.get(`${this.path}/:id`, this.getRecipe);
        this.router.get(`${this.path}/utils/trie`, this.getRecipeTrie);
        this.router.get(`${this.path}/utils/search`, this.searchRecipeTrie); 
        
        // this.router.post(`${this.path}`, this.createRecipe)
    }

    private async initializeRecipeTrie() {
        this.trie = await this.generateRecipeTrie();
        const byteSize = (str:any) => new Blob([str]).size;
        console.log(`Byte size of the Recipe Trie = ${byteSize(JSON.stringify(this.trie))} `)
    }



    private generateRecipeTrie = async () => {
        console.log("CALLING generateTrie!")
        let recipesArray = await recipeModel.find()
    
        recipesArray.map((element: any) => {        
            const img ={SMALL:{url:element.images.SMALL.url}}
            return element.images = img
        })
        let options: Options ={
            outputProps : ["name","id","maxPointsPrecise","images"],
            addKey:true,
            splitRegex:"/[ ]/",
            excludeNodes:["and","the","of","with","without","in","on","&","at","or","type","added","side","form","pre","unprepared","uncooked","solid","liquids","mix","cooked","raw","fresh","store"]
        }
        return generateTrie(recipesArray,"name",options)
    }

    private generateFoodTrie = async () => {
        console.log("CALLING generateFoodTrie!")
        // let recipesArray = await recipeModel.find()
    
        // foodsArray.map((element: any) => {        
        //     const img ={SMALL:{url:element.images.SMALL.url}}
        //     return element.images = img
        // })
        let options = {
            outputProps : "name",
            addKey:true,
            splitRegex:"/[ -]/"
        }
        return generateTrie(foodsArray,options)
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

    private searchRecipeTrie =async ( req:Request, res:Response) => {
        const searchTerm = `${req.query.target}`
        console.log(searchTerm)
        res.status(200).json(search(searchTerm,0,this.trie))
    }    
}

export default RecipesController