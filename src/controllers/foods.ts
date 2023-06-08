import express, {Request,Response} from 'express';
import {generateTrie,search,TrieNode,Options} from "fast-trie-search"
import foodsArray from "../data/foods"


class FoodsController {
    public path = '/foods';
    public router = express.Router();
    private foodTrie = new TrieNode()

    constructor() {
        this.initializeRoutes();
        this.initializeFoodTrie()
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/utils/trie`, this.getFoodTrie);        
        this.router.get(`${this.path}/utils/search`, this.searchFoodTrie);
    }
    
    private async initializeFoodTrie() {
        this.foodTrie = await this.generateFoodTrie();
        const byteSize = (str:any) => new Blob([str]).size;
        console.log(`Byte size of the Food Trie = ${byteSize(JSON.stringify(this.foodTrie))} `)
    }

    private generateFoodTrie = async () => {
        console.log("CALLING generateFoodTrie!")      
        let options: Options = {
            outputProps : ["name","ct"],
            addKey:false,
            splitRegex:"/[ -]/"
        }
        return generateTrie(foodsArray,"name",options)
    }

    
    private getFoodTrie = async (req:Request,res:Response) => {        
        res.status(200).json(this.foodTrie);
    }

    private searchFoodTrie =async ( req:Request, res:Response) => {
        const searchTerm = `${req.query.target}`
        console.log(searchTerm)
        res.status(200).json(search(searchTerm,0,this.foodTrie))
    }   
}

export default FoodsController