// class TrieNode{
//     public map: any;
//     public words: any;
//     constructor(){
//         this.map = {};
//         this.words = []
//     }    
// }

// const add = (str:any,i:any, root:any) => {
//     // console.log(str,i);
//     // console.log("root on entering add",root)
//     let node = str.node
//     let name = str.name
//     if(i=== node.length){
//         root.words.push(str);
//         return;
//     }
    
//     if(!root.map[node[i]]){
//         // console.log("making new node: ",str[i])
//         root.map[node[i]] = new TrieNode();
//     }
    
//     root.words.push(str);
//     add(str,i+1,root.map[node[i]])
// }

// const search = (str:string,i:any,root: TrieNode):any => {
//     // console.log(str, i)
//     if(i===str.length && i!==0){
//         // console.log(str, i,root.words)
//         return root.words
//     }
        
//     if(!root.map[str[i]])
//         return [];

//     return search(str,i+1,root.map[str[i]]);
// }

// exports.TrieNode = TrieNode;
// exports.search = search;
// exports.add = add;