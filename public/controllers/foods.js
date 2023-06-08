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
const fast_trie_search_1 = require("fast-trie-search");
const foods_1 = __importDefault(require("../data/foods"));
class FoodsController {
    constructor() {
        this.path = '/foods';
        this.router = express_1.default.Router();
        this.foodTrie = new fast_trie_search_1.TrieNode();
        this.generateFoodTrie = () => __awaiter(this, void 0, void 0, function* () {
            console.log("CALLING generateFoodTrie!");
            let options = {
                outputProps: ["name", "ct"],
                addKey: false,
                splitRegex: "/[ -]/"
            };
            return (0, fast_trie_search_1.generateTrie)(foods_1.default, "name", options);
        });
        this.getFoodTrie = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).json(this.foodTrie);
        });
        this.searchFoodTrie = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const searchTerm = `${req.query.target}`;
            console.log(searchTerm);
            res.status(200).json((0, fast_trie_search_1.search)(searchTerm, 0, this.foodTrie));
        });
        this.initializeRoutes();
        this.initializeFoodTrie();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/utils/trie`, this.getFoodTrie);
        this.router.get(`${this.path}/utils/search`, this.searchFoodTrie);
    }
    initializeFoodTrie() {
        return __awaiter(this, void 0, void 0, function* () {
            this.foodTrie = yield this.generateFoodTrie();
            const byteSize = (str) => new Blob([str]).size;
            console.log(`Byte size of the Food Trie = ${byteSize(JSON.stringify(this.foodTrie))} `);
        });
    }
}
exports.default = FoodsController;
