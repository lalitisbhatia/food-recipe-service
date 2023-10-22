"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const recipeData  =  require("../data/recipeData_basic_obj")
const { get } = require("http");
const recipeData_full_1 = __importDefault(require("../data/recipeData_full"));
const models = require("../interfaces/models");
const recipeModel = models.recipeModel;
const tagModel = models.tagModel;
// const recipeModel = require("../interfaces/models");
// import {recipeModel, tagModel} from "../interfaces/models"
const fast_trie_search_1 = require("fast-trie-search");
const similarRecipes = require('../utils/similarRecipes');
const foods_1 = __importDefault(require("../data/foods"));
const openai_1 = require("langchain/llms/openai");
const langChain_1 = require("../config/langChain");
const prompts_1 = require("langchain/prompts");
const chains_1 = require("langchain/chains");
class RecipesController {
    constructor() {
        this.path = '/recipes';
        this.router = express_1.default.Router();
        this.trie = new fast_trie_search_1.TrieNode();
        this.foodTrie = {};
        this.generateRecipeTrie = () => __awaiter(this, void 0, void 0, function* () {
            console.log("CALLING generateTrie!");
            let recipesArray = yield recipeModel.find();
            recipesArray.map((element) => {
                const img = { SMALL: { url: element.images.SMALL.url } };
                return element.images = img;
            });
            let options = {
                outputProps: ["name", "id", "maxPointsPrecise", "images"],
                addKey: true,
                splitRegex: "/[ ]/",
                excludeNodes: ["and", "the", "of", "with", "without", "in", "on", "&", "at", "or", "type", "added", "side", "form", "pre", "unprepared", "uncooked", "solid", "liquids", "mix", "cooked", "raw", "fresh", "store"]
            };
            return (0, fast_trie_search_1.generateTrie)(recipesArray, "name", options);
        });
        this.generateFoodTrie = () => __awaiter(this, void 0, void 0, function* () {
            console.log("CALLING generateFoodTrie!");
            // let recipesArray = await recipeModel.find()
            // foodsArray.map((element: any) => {        
            //     const img ={SMALL:{url:element.images.SMALL.url}}
            //     return element.images = img
            // })
            let options = {
                outputProps: "name",
                addKey: true,
                splitRegex: "/[ -]/"
            };
            return (0, fast_trie_search_1.generateTrie)(foods_1.default, options);
        });
        this.getPaginatedRecipesFromDB = (query, paginateOptions) => __awaiter(this, void 0, void 0, function* () {
            // console.log(query)
            let res = yield recipeModel.paginate(query, paginateOptions);
            let returnObj = {
                "docs": res.docs,
                "info": {
                    "totalDocs": res.totalDocs,
                    "offset": res.offset,
                    "limit": res.limit,
                    "totalPages": res.totalPages,
                    "page": res.page,
                    "pagingCounter": res.pagingCounter,
                    "hasPrevPage": res.hasPrevPage,
                    "hasNextPage": res.hasNextPage,
                    "prevPage": res.prevPage,
                    "nextPage": res.nextPage
                }
            };
            return returnObj;
            // let nRecipes = await recipeModel.find() //Object.fromEntries(Object.entries
            // Shuffle array to retunr 20 random recipes
            // const shuffled = nRecipes.sort(() => 0.5 - Math.random());
            // console.log(shuffled.name)
            // Get sub-array of first n elements after shuffled
            // return nRecipes
        });
        this.getAllRecipes = (req, res) => {
            console.log(`requested count : ${req.query.num}`);
            console.log(`requested from db? : ${req.query.db}`);
            let allRecipes;
            if (req.query.db === "true" || req.query.db === undefined) {
                let page = req.query.page || 1;
                let num = req.query.num || 20;
                let paginateOptions = { page: page, limit: num, populate: {
                        path: 'tagIDs',
                        select: 'tag -_id'
                    }, };
                this.getPaginatedRecipesFromDB({}, paginateOptions).then(data => {
                    console.log("getting fom db");
                    // console.log("after getting from db")
                    // console.log(data)
                    this.handleSend(data, res);
                });
            }
            else {
                console.log("getting fom local");
                allRecipes = this.getRecipesFromLocal(req.query.num);
                this.handleSend(allRecipes, res);
            }
        };
        this.getRecipeByFilter = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`requested count : ${req.query.num}`);
            console.log(`requested from db? : ${req.query.db}`);
            console.log(`requested recipe filter: ${req.query.tags}`);
            let allRecipes;
            let page = req.query.page || 1;
            let num = req.query.num || 20;
            let tags = req.query.tags ? req.query.tags : null;
            const tagsArr = tags === null ? null : tags.split(',');
            console.log("tagsArr: ", tagsArr);
            let query = tagsArr === null ? {} : { tags: { $in: tagsArr } };
            let paginateOptions = { page: page, limit: num };
            console.log(query);
            this.getPaginatedRecipesFromDB(query, paginateOptions).then(data => {
                console.log("getting fom db");
                // console.log("after getting from db")
                // console.log(data)
                this.handleSend(data, res);
            });
        });
        this.getTags = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let tags = yield tagModel.find();
            // with Promise.all
            this.getData(tags).then(data => {
                this.handleSend(tags, res);
            });
            //using for loop
            // for (let tag of tags) {
            //     tag = await this.updateRecipeCount(tag);           
            //   }                    
            // let newTags = tags.sort((a:any, b:any) => {
            //     console.log(a);
            //     return a.recipeCount > b.recipeCount
            // })      
            // this.handleSend(tags,res)
        });
        this.updateRecipeCount = (tag) => __awaiter(this, void 0, void 0, function* () {
            let recipes = yield recipeModel.find({ tagIDs: tag._id });
            tag._doc.recipeCount = recipes.length;
            return tag;
        });
        ///////////////////  tags 
        this.functionThatReturnsAPromise = (tag) => __awaiter(this, void 0, void 0, function* () {
            let recipes = yield recipeModel.find({ tagIDs: tag._id });
            tag._doc.recipeCount = recipes.length;
            return Promise.resolve(tag);
        });
        this.getData = (list) => __awaiter(this, void 0, void 0, function* () {
            return Promise.all(list.map((item) => this.functionThatReturnsAPromise(item)));
        });
        this.getRecipe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`requested recipe : ${req.params.id}`);
            let recipe = yield recipeModel.findOne({ id: req.params.id });
            this.handleSend(recipe, res);
        });
        this.getRecipeTrie = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // let trie = await generateTrie.generateTrie();
            res.status(200).json(this.trie);
        });
        this.getSimilarRecipes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let recipeId = req.params.id;
            let similar_recipes = yield similarRecipes.getSimilarRecipes(parseInt(recipeId));
            // console.log("similarRecipes: ",similar_recipes);
            this.handleSend(similar_recipes, res);
        });
        this.getSimilarRecipesAI = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let recipe = req.body;
            console.log(recipe);
            let ingredients = recipe.ingredients.map((ingr) => { return ingr.ingredientName; }).join(",");
            console.log("ingredient list: : ", ingredients);
            const prompt = prompts_1.PromptTemplate.fromTemplate("Find 5 recipes similar to  {name} with ingredients similar to {ingredients}. Include  a link to each recipe  ");
            const llm = new openai_1.OpenAI({
                openAIApiKey: langChain_1.MY_AI_KEY,
                temperature: 0.9
            });
            // using chains
            const chain = new chains_1.LLMChain({
                llm,
                prompt
            });
            const result1 = yield chain.call({
                name: recipe.name,
                ingredients: ingredients
            });
            let formattedResult = result1.text.split("\n\n");
            this.handleSend(formattedResult, res);
        });
        this.searchRecipeTrie = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const searchTerm = `${req.query.target}`;
            console.log(searchTerm);
            res.status(200).json((0, fast_trie_search_1.search)(searchTerm, 0, this.trie));
        });
        this.initializeRoutes();
        this.initializeRecipeTrie();
    }
    initializeRoutes() {
        this.router.get("/", this.getAllRecipes);
        this.router.get(`${this.path}`, this.getAllRecipes);
        this.router.get(`${this.path}/filtered/`, this.getRecipeByFilter);
        this.router.get(`${this.path}/similar/:id`, this.getSimilarRecipes);
        this.router.get(`${this.path}/similarAI`, this.getSimilarRecipesAI);
        this.router.get(`${this.path}/:id`, this.getRecipe);
        this.router.get(`${this.path}/filters/tags`, this.getTags);
        this.router.get(`${this.path}/utils/trie`, this.getRecipeTrie);
        this.router.get(`${this.path}/utils/search`, this.searchRecipeTrie);
        // this.router.post(`${this.path}`, this.createRecipe)
    }
    initializeRecipeTrie() {
        return __awaiter(this, void 0, void 0, function* () {
            this.trie = yield this.generateRecipeTrie();
            const byteSize = (str) => new Blob([str]).size;
            console.log(`Byte size of the Recipe Trie = ${byteSize(JSON.stringify(this.trie))} `);
        });
    }
    handleSend(data, res) {
        try {
            console.log("inside handle send");
            // console.log(data)
            res.status(200).json({ "data": data });
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }
    ///////////////////
    getRecipesFromLocal(num) {
        return recipeData_full_1.default.slice(0, num || 20); //Object.fromEntries
    }
}
exports.default = RecipesController;
