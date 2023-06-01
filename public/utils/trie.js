"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TrieNode {
    constructor() {
        this.map = {};
        this.words = [];
    }
}
const add = (str, i, root) => {
    // console.log(str,i);
    // console.log("root on entering add",root)
    let node = str.node;
    let name = str.name;
    if (i === node.length) {
        root.words.push(str);
        return;
    }
    if (!root.map[node[i]]) {
        // console.log("making new node: ",str[i])
        root.map[node[i]] = new TrieNode();
    }
    root.words.push(str);
    add(str, i + 1, root.map[node[i]]);
};
const search = (str, i, root) => {
    // console.log(str, i)
    if (i === str.length && i !== 0) {
        // console.log(str, i,root.words)
        return root.words;
        // let suggestions = root.words.map((item)=>{
        //     return item
        // })
        // console.log(str, i,suggestions)
        // var result = suggestions.reduce((unique, o) => {
        //     if(!unique.some(obj => obj.suggestion === o.suggestion)) {
        //       unique.push(o);
        //     }
        //     return unique;
        // },[]);
        // // console.log(str, i,result)
        // let sortedResult = result.sort((a,b) => b.count - a.count);
        // return result
    }
    if (!root.map[str[i]])
        return [];
    return search(str, i + 1, root.map[str[i]]);
};
exports.TrieNode = TrieNode;
exports.search = search;
exports.add = add;
