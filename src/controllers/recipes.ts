// import express, {Request,Response} from 'express';

// // const recipeData  =  require("../data/recipeData_basic_obj")
// const { get } = require("http")
// import getTagsWithRecipeCounts from "../utils/aggregateQueries";
// import recipesArray from "../data/recipeData_full"
// const models = require("../interfaces/models");

// const recipeModel = models.recipeModel
// const tagModel = models.tagModel
// // const recipeModel = require("../interfaces/models");
// // import {recipeModel, tagModel} from "../interfaces/models"
// import {generateTrie,search,TrieNode,Options} from "fast-trie-search"
// const similarRecipes= require('../utils/similarRecipes')

// import foodsArray from "../data/foods"



// import { OpenAI } from "langchain/llms/openai";
// import { MY_AI_KEY } from "../config/langChain";
// import { PromptTemplate } from "langchain/prompts";
// import { LLMChain } from "langchain/chains";



// class RecipesController {
//     public path = '/recipes';
//     public router = express.Router();
//     private trie = new TrieNode();
//     private foodTrie = {}

//     constructor() {
//         this.initializeRoutes();
//         this.initializeRecipeTrie();
//     }

//     private initializeRoutes() {
//         this.router.get("/", this.getAllRecipes);
//         this.router.get(`${this.path}`, this.getAllRecipes);
//         this.router.get(`${this.path}/filtered/`, this.getRecipeByFilter);
//         this.router.get(`${this.path}/similar/:id`, this.getSimilarRecipes);
//         this.router.get(`${this.path}/similarAI`, this.getSimilarRecipesAI);
//         this.router.get(`${this.path}/:id`, this.getRecipe);
//         this.router.get(`${this.path}/filters/tags`, this.getTags);
//         this.router.get(`${this.path}/utils/trie`, this.getRecipeTrie);
//         this.router.get(`${this.path}/utils/search`, this.searchRecipeTrie);         
//         // this.router.post(`${this.path}`, this.createRecipe)
//     }

//     private async initializeRecipeTrie() {
//         this.trie = await this.generateRecipeTrie();
//         const byteSize = (str:any) => new Blob([str]).size;
//         console.log(`Byte size of the Recipe Trie = ${byteSize(JSON.stringify(this.trie))} `)
//     }

//     private generateRecipeTrie = async () => {
//         console.log("CALLING generateTrie!")
//         let recipesArray = await recipeModel.find()
    
//         recipesArray.map((element: any) => {        
//             const img ={SMALL:{url:element.images.SMALL.url}}
//             return element.images = img
//         })
//         let options: Options ={
//             outputProps : ["name","id","maxPointsPrecise","images"],
//             addKey:true,
//             splitRegex:"/[ ]/",
//             excludeNodes:["and","the","of","with","without","in","on","&","at","or","type","added","side","form","pre","unprepared","uncooked","solid","liquids","mix","cooked","raw","fresh","store"]
//         }
//         return generateTrie(recipesArray,"name",options)
//     }

//     private generateFoodTrie = async () => {
//         console.log("CALLING generateFoodTrie!")
//         // let recipesArray = await recipeModel.find()
    
//         // foodsArray.map((element: any) => {        
//         //     const img ={SMALL:{url:element.images.SMALL.url}}
//         //     return element.images = img
//         // })
//         let options = {
//             outputProps : "name",
//             addKey:true,
//             splitRegex:"/[ -]/"
//         }
//         return generateTrie(foodsArray,options)
//     }

//     private  handleSend (data:any,res:Response) {
//         try{
//             console.log("inside handle send")
//             // console.log(data)
//             res.status(200).json({"data":data});
//         }catch(err){
//             res.status(500).json({error:err})
//         }
//     }

    

//     private getPaginatedRecipesFromDB = async (query:any, paginateOptions:any) => {
//         // console.log(query)
//         let res = await recipeModel.paginate(query, paginateOptions)
//         let returnObj = { 
//             "docs":res.docs,
//             "info": {
//                 "totalDocs": res.totalDocs,
//                 "offset": res.offset,
//                 "limit": res.limit,
//                 "totalPages": res.totalPages,
//                 "page": res.page,
//                 "pagingCounter": res.pagingCounter,
//                 "hasPrevPage": res.hasPrevPage,
//                 "hasNextPage": res.hasNextPage,
//                 "prevPage": res.prevPage,
//                 "nextPage": res.nextPage
//             }
//         }
//         return returnObj;
//         // let nRecipes = await recipeModel.find() //Object.fromEntries(Object.entries
//         // Shuffle array to retunr 20 random recipes
//         // const shuffled = nRecipes.sort(() => 0.5 - Math.random());
//         // console.log(shuffled.name)
//         // Get sub-array of first n elements after shuffled
    
//         // return nRecipes
//     }

//     private getAllRecipes = (req:Request,res:Response) => {
//         console.log(`requested count : ${req.query.num}`)
//         console.log(`requested from db? : ${req.query.db}`)
//         let allRecipes;

//         if(req.query.db==="true"||req.query.db===undefined){
//             let page = req.query.page||1;
//             let num = req.query.num||20;
//             let paginateOptions = { page: page, limit: num, populate: {
//                 path: 'tagIDs',                    
//                 select: 'tag -_id'
//               }, }

//             this.getPaginatedRecipesFromDB({},paginateOptions).then(data =>{
//                 console.log("getting fom db");
//                 // console.log("after getting from db")
//                 // console.log(data)
//                 this.handleSend(data,res);
//             })            
//         }else{
//             console.log("getting fom local");
//             allRecipes = this.getRecipesFromLocal(req.query.num)
//             this.handleSend(allRecipes,res);
//         }
//     }

    
//     private getRecipeByFilter = async (req:Request,res:Response) => {
        
//         console.log(`requested count : ${req.query.num}`)
//         console.log(`requested from db? : ${req.query.db}`)
//         console.log(`requested recipe filter: ${req.query.tags}`)

//         let allRecipes;
//         let page = req.query.page||1;
//         let num = req.query.num||20;                
//         let tags:any = req.query.tags?req.query.tags:null
//         const tagsArr = tags===null?null:tags.split(',')
//         console.log("tagsArr: ", tagsArr)

//         let query = tagsArr===null?{}:{tags:{$in:tagsArr}}
//         let paginateOptions = { page: page, limit: num }        

//         console.log(query)
//         this.getPaginatedRecipesFromDB(query, paginateOptions).then(data =>{
//             console.log("getting fom db");
//                 // console.log("after getting from db")
//                 // console.log(data)
//             this.handleSend(data,res);
//         })          
//     }
    

    
//     private getTags = async (req:Request, res:Response) => {
//         let tags = await tagModel.find()  
        
//         // with Promise.all
        
//         this.getData(tags).then(data => {
//             this.handleSend(tags,res)
//         })

//         //using for loop
//         // for (let tag of tags) {
//         //     tag = await this.updateRecipeCount(tag);           
//         //   }                    
//         // let newTags = tags.sort((a:any, b:any) => {
//         //     console.log(a);
//         //     return a.recipeCount > b.recipeCount
//         // })      
//         // this.handleSend(tags,res)
        
//     }
//     private updateRecipeCount = async (tag: any) => {
//         let recipes = await recipeModel.find({tagIDs: tag._id })                                                       
//         tag._doc.recipeCount = recipes.length;                
//         return tag;
//     }

// ///////////////////  tags 
//     private functionThatReturnsAPromise = async (tag:any ) => { //a function that returns a promise
//         let recipes = await recipeModel.find({tagIDs: tag._id })                                                       
//         tag._doc.recipeCount = recipes.length;
//         return Promise.resolve(tag)
//       }
      
      
//       private getData = async (list:any) => {
//         return Promise.all(list.map((item:any) => this.functionThatReturnsAPromise(item)))
//       }
      
//     ///////////////////
    
//     private getRecipesFromLocal  (num:any)  {
//         return recipesArray.slice(0,num||20) //Object.fromEntries
//     }
//     private getRecipe = async (req:Request,res:Response) => {
//         console.log(`requested recipe : ${req.params.id}`)
//         let recipe = await recipeModel.findOne({id:req.params.id})
//         this.handleSend(recipe,res)
//     }


//     private getRecipeTrie = async (req:Request,res:Response) => {
//         // let trie = await generateTrie.generateTrie();
//         res.status(200).json(this.trie);
//     }

//     private getSimilarRecipes = async (req:Request,res:Response) => {
//         let recipeId =  req.params.id;
//         let similar_recipes = await similarRecipes.getSimilarRecipes(parseInt(recipeId))
//         // console.log("similarRecipes: ",similar_recipes);
//         this.handleSend(similar_recipes,res)
//     }

//     private getSimilarRecipesAI = async (req:Request,res:Response) => {
//         let recipe =  req.body;
//         console.log(recipe)
//         let ingredients = recipe.ingredients.map((ingr:any) => {return ingr.ingredientName}).join(",")
//         console.log("ingredient list: : ",ingredients);


//         const prompt = PromptTemplate.fromTemplate("Find 5 recipes similar to  {name} with ingredients similar to {ingredients}. Include  a link to each recipe  ")
  
//         const llm = new OpenAI({
//           openAIApiKey: MY_AI_KEY,
//           temperature:0.9
//         });
        
//         // using chains
//         const chain = new LLMChain({
//             llm,
//             prompt
//           });
        
//           const result1 = await chain.call({
//             name: recipe.name,
//             ingredients: ingredients
//           })
//           let formattedResult = result1.text.split("\n\n")
//         this.handleSend(formattedResult,res)
//     }

//     private searchRecipeTrie =async ( req:Request, res:Response) => {
//         const searchTerm = `${req.query.target}`
//         console.log(searchTerm)
//         res.status(200).json(search(searchTerm,0,this.trie))
//     }    
// }

// export default RecipesController