/*
    This helper package can be used to implement a Search-As-You-Type funtionality
    It contains 2 exposed methods and 2 Types - 
        generateTrie()  This generates a large Trie object out of the input data source
        search()        This is used for a super fast search on as u type using the Trie object
        TrieNode        A class that defines the structre of the return object
        Options         A type that defines the optional inputs to generating the Trie output for the generateTrie method
    
    **** GENERATING THE TRIE OBJECT *********
    generateTrie(objArray, searchProp, Options: {outputProps, addKey, splitRegex})
    
    INPUTS:
        objArray (Required):    This is the source data which is an array of objects - for e.g an array of recipes where 
                                each recipe object has various attributes like "name","description", "ingredients", etc.
        searchProp (Required):  This is the property on which the search is performed - in the above example, if the searchable 
                                attribute is "name" then pass that property as the input value
        options (optional params):                                
            outputProps (optional): Upon search each returned item is an object and we dont have to return the entire object from the
                                    from each object in objArray - only return what is needed for your specific use case
                                    DEFAULT: return the entire object - Be careful as the returned Trie is a large object so only 
                                    return the data that you need
            addKey (optional):      Some use cases, say if you're ouputting a list on a React app, require a unique key for each item on the list
                                    DEFAULT: false
            splitRegex (optiona):   This is the character on which to split the searchProp input. For eg, if the value of the input property, "name" 
                                    is "Oven-fried pork chops" and we want to be able to type pork or chops  or oven to get this result back, then 
                                    the input regex can be just "/[ ]/" ( just a space). 
                                    BUT, if u want this result to come back for typing "fried" as well, 
                                    then the splitRegex should include the "-" charactr as well, so the input value of splitRegex will be  "/[ -]/"
                                    DEFAULT: " "  ( space character)


        USAGE EXAMPLE:
            
            Make sure that you understand the structure of your data. 
            
            Say I have a collection of recipes:
            Each Recipe has this schema:
            {    
                "id": Number;
                "name": String;
                "description": String;
                "ingredients": any;
                "tags": String[];
                "difficultyLevel": String;
                "maxPointsPrecise": Number;
                "instructions": any[];
                "images": object;
            }

            Requirements:
            1. Be able to search on the name field. For example for the recipe that has a name "Stir-Fried chicken with broccoli, red peppers and cashews"
            2. This result should return when the user types not just the start of the name but the start of ANY word in the name i.e it should return when 
                typing any of the dollowing:
                Sti.., fried, chi.. , broccoli, red, pepp... , cashe... etc
            3. In the search result, only the properties "name","id","tags","images" should be returned ( since the use case doesnt need other propoerties 
                and by specifying the specific properties, we save on the size of the Trie object)
            4. Show as a list on a React app so each item needs a unique key identifier

            To get the Trie object back, call the function thus:
            ```
            import {import {generateTrie,search,TrieNode,Options} from "trie" // where "trie" is the package name
            .... 
            const myWrapperFuntion = () =.{ 
                const allRecipes = //get all my recipes
                const searchProp = "name"
                const options: Options ={
                    outputProps : ["name","id","maxPointsPrecise","images"],
                    addKey: true,
                    splitRegex : "/[ -]/"
                }
                return generateTrie(recipesArray,searchProp,options)
            }
            
    **** USING THE TRIE OBJECT TO SEARCH *********
        search(searchString, index, root) // default i=0, root is the full trie object

            If the Trie object is returned by an external service, then the client side will also need to import this package
            and in the onChange handler of the search input field, call the search method as shown in a React example below that is using 
            useState for 2 properties: searchTerm and searchResults and using the corresponding setSearchResults method to update the component
            with the search results

            import {search} from "trie" // where "trie" is the package name
            ....
            () => {
                let [searchTerm, setSearchTerm] = useState("")
                let [searchResults, setSearchResults] = useState([])
                // In this case theTrie object returned from an external service
                const {data: recipeTrie} = useFetch("http://localhost:3400/recipes/utils/trie",true) 

                const searchHandler = (e) => {
                    const str = e.target.value;                    
                    setSearchTerm(str)

                    let searchRes = recipeSearch(str, 0, recipeTrie).map(res => {
                        return res.nodeObj;
                    })
                    setSearchResults(searchRes);                    
                }
            }

            ...... 

            { 
                <input  
                    className="search-input"
                    type="text"
                    required
                    disabled={!recipeTrie}
                    value= {searchTerm}
                    placeholder="search more recipes"
                    onChange={searchHandler}
                />
            }
                

            WARNING: The Trie object can become pretty large - we're sacrificing space for speed so make sure that the Trie object is generated only onece and then cached if doesnt change too often, 
*/


const parseRegex = require("regex-parser")

// If we dont really care about search results for inputs of these basic prepositions and fluff words, remove them from being start of a node - this will reduce the size of the output Trie
// const excludeNodes = ["and","of","with","without","in","on","&","at","or","type","added","side","form","pre","unprepared","uncooked","solid","liquids","mix","cooked","raw","fresh"]


type Options = {
    outputProps?: string[],
    addKey?: boolean,
    splitRegex?: string,
    excludeNodes?: string[]
 }

 class TrieNode{
    public map: any;
    public words: any;
    constructor(){
        this.map = {};
        this.words = []
    }    
}

const generateTrie = (objArray:any, searchProp:any, options: Options ={}) => {
    
    let expandedObjArray : any = []    
    let trieKey = 1;

    //Default Options
    const defaults = {
        outputProps : Object.keys(objArray[0]),
        splitRegex : "/[ ]/",
        addKey : false,
        excludeNodes : ["and","of","with","without","in","on","&","at","or","type","added","side","form","pre","unprepared","uncooked","solid","liquids","mix","cooked","raw","fresh"]
    }
    
    // assign defualts
    const opts = Object.assign({}, defaults, options);

    objArray.forEach((element: any) => {
        /*
        Expand the searchProp out. 
        If the search prop has a value "Stir-Fried Chicken with Jasmine rice", then create the following nodes:
        ->  "StirFried Chicken with Jasmine rice"
        ->  "Fried Chicken with Jasmine rice"
        ->  "Chicken with Jasmine rice"
        ->  "Jasmine rice"
        ->  "rice"
        and typing any of these values should return "Stir-Fried Chicken with Jasmine rice" as one of the results
        Note that there is no node starting with "with" since its part of the "excludeNodes" option
        */

        let expandedElement = element[searchProp].split(parseRegex(opts.splitRegex));     
        //now for each of the  expanded node, create the return object and push it into the expandedObjArray
        for(let i=0;i<expandedElement.length;i++){
            let nodeObj : any = {}
            opts.outputProps.forEach((prop:string) => {
                nodeObj[prop] = element[prop]
            })
            
            if(opts.addKey===true){
                nodeObj.key = trieKey++
            }

            if(!opts.excludeNodes.includes(expandedElement[i])){
                expandedObjArray.push({node:expandedElement.slice(i).join(" ").toLowerCase(),nodeObj})
            }
        }
    })

    console.log( "total number of Trie words: ",expandedObjArray.length)
    
    //initialize the return Trie object
    const root = new TrieNode();
    //generate the Trie
    for (let i=0;i<expandedObjArray.length;i++){
        add (expandedObjArray[i],0,root);    
    }
    // empty out the top level array as it serves no purpose and adds to the size
    root.words=[] 
    return root;    
}



const add = (str:any,i:any, root:any) => {
    let node = str.node
    let name = str.name
    if(i=== node.length){
        root.words.push(str);
        return;
    }
    
    if(!root.map[node[i]]){        
        root.map[node[i]] = new TrieNode();
    }
    
    root.words.push(str);
    add(str,i+1,root.map[node[i]])
}


const search = (str:string,i:any,root: TrieNode):any => {
    // console.log(str, i)
    if(i===str.length && i!==0){
        // console.log(str, i,root.words)
        return root.words
    }
        
    if(!root.map[str[i]])
        return [];

    return search(str,i+1,root.map[str[i]]);
}

export {generateTrie,search,TrieNode,Options}



 /*const generateRecipeTrie = async () => {
    console.log("CALLING generateTrie!")
    let recipesArray = await recipeModel.find()

    let recipe1 = recipesArray.slice(1,2)
    recipesArray.map((element: any) => {        
        const img ={SMALL:{url:element.images.SMALL.url}}
        return element.images = img
    })
    // console.log(recipe1[0].images)
    // let splitRecipeNamesArray:any =[];
    // const img ={SMALL:{url:element.images.SMALL.url}}
    return generateTrie(recipesArray,"name",["name","id","maxPointsPrecise","images"],true,'/[ -]/')

    // const excludeNodes = ["and","of","with","in","on","&","at"]
    // let trieKey = 1;
    
    // recipesArray.forEach( (element: any) => {
        
    //     let recipeNameWords = element.name.split(/[ -]/);
    //     const img ={SMALL:{url:element.images.SMALL.url}}
         
    //     for(let i=0;i<recipeNameWords.length;i++){
                        
    //         let nodeObj = {name:element.name,id:element.id,key:trieKey++,pts: element.maxPointsPrecise,images:img}
    //         if(!excludeNodes.includes(recipeNameWords[i])){
    //             splitRecipeNamesArray.push({node:recipeNameWords.slice(i).join(" ").toLowerCase(),nodeObj})
    //         }
    //     }
    //     // in addition to names, make the tags searchable as nodes
    //     //Get unique tags
    //     let tags = new Set(element.tags)
    //     // tags.forEach(tag =>{
    //     //     let nodeObj = {name:element.name,id:element.id,key:trieKey++,pts: element.maxPointsPrecise}
    //     //     splitRecipeNamesArray.push({node:tag.toLowerCase(),nodeObj})
    //     // })
    // });
    // console.log( "total number of recipe words: ",splitRecipeNamesArray.length)
    // const recipeTrieObjects = splitRecipeNamesArray
    // // console.log(recipeTrieObjects)

    // const root = new trie.TrieNode("");
    // for (let i=0;i<recipeTrieObjects.length;i++){
    //     trie.add (recipeTrieObjects[i],0,root);    
    // }
    // root.words=[]
    // console.log("Created Root")
    // // global.recTrie = root;
    // return root;
}
*/


