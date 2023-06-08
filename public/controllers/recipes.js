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
const recipeModel = require("../interfaces/models");
// import {generateTrie,search,TrieNode,Options} from "../utils/generateTrie" 
const fast_trie_search_1 = require("fast-trie-search");
const similarRecipes = require('../utils/similarRecipes');
const foods_1 = __importDefault(require("../data/foods"));
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
        this.getAllRecipes = (req, res) => {
            console.log(`requested count : ${req.query.num}`);
            console.log(`requested from db? : ${req.query.db}`);
            let allRecipes;
            if (req.query.db === "true" || req.query.db === undefined) {
                this.getRecipesFromDB(req.query.num).then(data => {
                    console.log("getting fom db");
                    this.handleSend(data, res);
                });
            }
            else {
                console.log("getting fom local");
                allRecipes = this.getRecipesFromLocal(req.query.num);
                this.handleSend(allRecipes, res);
            }
        };
        this.getRecipesFromDB = (num) => __awaiter(this, void 0, void 0, function* () {
            let nRecipes = yield recipeModel.find(); //Object.fromEntries(Object.entries
            // Shuffle array to retunr 20 random recipes
            // const shuffled = nRecipes.sort(() => 0.5 - Math.random());
            // console.log(shuffled.name)
            // Get sub-array of first n elements after shuffled
            return nRecipes.slice(0, num || 20);
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
        this.router.get(`${this.path}/similar/:id`, this.getSimilarRecipes);
        this.router.get(`${this.path}/:id`, this.getRecipe);
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
            res.status(200).json({ "data": data });
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }
    getRecipesFromLocal(num) {
        return recipeData_full_1.default.slice(0, num || 20); //Object.fromEntries
    }
}
exports.default = RecipesController;
