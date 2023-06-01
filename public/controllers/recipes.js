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
const recipeData = require("../data/recipeData_basic_obj");
const { get } = require("http");
const recipeData_full_1 = __importDefault(require("../data/recipeData_full"));
const recipeModel = require("../interfaces/models");
const generateTrie = require('../utils/generateTrie');
const similarRecipes = require('../utils/similarRecipes');
class RecipesController {
    constructor() {
        this.path = '/recipes';
        this.router = express_1.default.Router();
        this.trie = {};
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
        this.createRecipe = (req, res) => {
        };
        this.initializeRoutes();
        this.initializeTrie();
    }
    initializeRoutes() {
        this.router.get("/", this.getAllRecipes);
        this.router.get(`${this.path}`, this.getAllRecipes);
        this.router.get(`${this.path}/similar/:id`, this.getSimilarRecipes);
        this.router.get(`${this.path}/:id`, this.getRecipe);
        this.router.get(`${this.path}/utils/trie`, this.getRecipeTrie);
        // this.router.post(`${this.path}`, this.createRecipe)
    }
    initializeTrie() {
        return __awaiter(this, void 0, void 0, function* () {
            this.trie = yield generateTrie.generateTrie();
            const byteSize = (str) => new Blob([str]).size;
            console.log(`Byte size of the Trie = ${byteSize(JSON.stringify(this.trie))} `);
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
