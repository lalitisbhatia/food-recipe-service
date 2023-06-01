const  trie = require("./trie")
const recipeModel = require("../interfaces/models");

const getRecipeNames = async () => {
    return await recipeModel.find()
}

 const generateTrie = async () => {
    console.log("CALLING generateTrie!")
    let recipesArray = await recipeModel.find()

    let splitRecipeNamesArray:any =[];
    const excludeNodes = ["and","of","with","in","on","&","at"]
    let trieKey = 1;
    
    recipesArray.forEach( (element: any) => {
        
        let recipeNameWords = element.name.split(" ");
        const img ={SMALL:{url:element.images.SMALL.url}}
         
        for(let i=0;i<recipeNameWords.length;i++){
                        
            let nodeObj = {name:element.name,id:element.id,key:trieKey++,pts: element.maxPointsPrecise,images:img}
            if(!excludeNodes.includes(recipeNameWords[i])){
                splitRecipeNamesArray.push({node:recipeNameWords.slice(i).join(" ").toLowerCase(),nodeObj})
            }
        }
        // in addition to names, make the tags searchable as nodes
        //Get unique tags
        let tags = new Set(element.tags)
        // tags.forEach(tag =>{
        //     let nodeObj = {name:element.name,id:element.id,key:trieKey++,pts: element.maxPointsPrecise}
        //     splitRecipeNamesArray.push({node:tag.toLowerCase(),nodeObj})
        // })
    });
    console.log( "total number of recipe words: ",splitRecipeNamesArray.length)
    const recipeTrieObjects = splitRecipeNamesArray
    // console.log(recipeTrieObjects)

    const root = new trie.TrieNode("");
    for (let i=0;i<recipeTrieObjects.length;i++){
        trie.add (recipeTrieObjects[i],0,root);    
    }
    root.words=[]
    console.log("Created Root")
    // global.recTrie = root;
    return root;
}

exports.generateTrie = generateTrie;