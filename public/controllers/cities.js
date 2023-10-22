"use strict";
// import express, {Request,Response} from 'express';
// // const recipeData  =  require("../data/recipeData_basic_obj")
// // import cities from "../data/cities"
// import {generateTrie,search,TrieNode,Options} from "fast-trie-search"
// class CitiesController {
//     public path = '/cities';
//     public router = express.Router();
//     private trie = new TrieNode();
//     private foodTrie = {}
//     constructor() {
//         this.initializeRoutes();
//         this.initializeCitiesTrie();
//     }
//     private initializeRoutes() {
//         this.router.get(`${this.path}/utils/trie`, this.getCitiesTrie);
//         this.router.get(`${this.path}/utils/search`, this.searchCitiesTrie);                 
//     }
//     private async initializeCitiesTrie() {
//         this.trie = await this.generateCitiesTrie();
//         const byteSize = (str:any) => new Blob([str]).size;
//         console.log(`Byte size of the Cities Trie = ${byteSize(JSON.stringify(this.trie))} `)
//     }
//     private generateCitiesTrie = async () => {
//         console.log("CALLING generateCitiesTrie!")        
//         let options: Options ={
//             outputProps : ["name","sn","cn","lat","lon"],
//             addKey:true,
//             splitRegex:"/[ ]/",
//             excludeNodes:["and","the","of","with","without","in","on","&","at","or","type","added","side","form","pre","unprepared","uncooked","solid","liquids","mix","cooked","raw","fresh","store"]
//         }
//         return generateTrie(cities,"name",options)
//     }
//     private getCitiesTrie = async (req:Request,res:Response) => {
//         // let trie = await generateTrie.generateTrie();
//         res.status(200).json(this.trie);
//     }
//     private searchCitiesTrie =async ( req:Request, res:Response) => {
//         const searchTerm = `${req.query.target}`
//         console.log(searchTerm)
//         res.status(200).json(search(searchTerm,0,this.trie))
//     }    
// }
// export default CitiesController
