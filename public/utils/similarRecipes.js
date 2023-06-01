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
Object.defineProperty(exports, "__esModule", { value: true });
// const recipes = require("./recipes");
const ingrsToIgnore = ['Table salt'];
const recipeModel1 = require("../interfaces/models");
// const IRecipe = require("../interfaces/Recipe")
const tagsWeight = 0.3;
const ingrWeight = 1;
const pointsWeight = 0.3;
const nameWeight = 1;
const getEuclideanDistance = (obj1, obj2) => {
    // console.log("obj1: ",obj1)
    // console.log("obj2: ",obj2)
    let distance = 0;
    let d1 = getDimensions(obj1);
    let d2 = getDimensions(obj2);
    let allDims = getAllDimensions(d1, d2);
    // console.log(allDims);
    let p1 = createCartesianPoint(d1, allDims);
    // console.log(p1);
    let p2 = createCartesianPoint(d2, allDims);
    // console.log(p2);
    distance = calculateDistance(p1, p2);
    // console.log(distance)
    return distance;
};
const getDimensions = (recipe) => {
    let dimensions = [];
    // console.log(recipe);
    // console.log(recipe.id);
    // console.log(recipe.ingredients);
    recipe.ingredients.forEach(element => {
        dimensions.push({ "type": "ingredient", "dimName": element.ingredientName });
    });
    recipe.tags.forEach(element => {
        dimensions.push({ "type": "tag", "dimName": element });
    });
    dimensions.push({ "type": "points", "value": recipe.maxPointsPrecise });
    return dimensions;
};
const getAllDimensions = (arr1, arr2) => {
    // console.log("dimesions 1 : ",arr1);
    // console.log("dimesions 2 : ",arr2);
    let ingrDims1 = arr1.filter((item) => {
        return item.type === "ingredient";
    }).map(((item) => {
        return item.dimName;
    }));
    let ingrDims2 = arr2.filter((item) => {
        return item.type === "ingredient";
    }).map(((item) => {
        return item.dimName;
    }));
    // console.log("ingrDims1 : ",ingrDims1)
    // console.log("ingrDims2 : ",ingrDims2)
    let tagDims1 = arr1.filter((item) => {
        return item.type === "tag";
    }).map(((item) => {
        return item.dimName;
    }));
    let tagDims2 = arr2.filter((item) => {
        return item.type === "tag";
    }).map(((item) => {
        return item.dimName;
    }));
    var ingrUnion = [...new Set([...ingrDims1, ...ingrDims2])];
    var tagUnion = [...new Set([...tagDims1, ...tagDims2])];
    // console.log(ingrUnion);
    var allDims = [...new Set([...ingrUnion, ...tagUnion])];
    let pointsDim1 = arr1.filter((item) => {
        return item.type === "points";
    }).map(((item) => {
        return item.value;
    }))[0];
    let pointsDim2 = arr2.filter((item) => {
        return item.type === "points";
    }).map(((item) => {
        return item.value;
    }))[0];
    // console.log("pointsDim1: ", pointsDim1)
    // console.log("pointsDim2: ", pointsDim2)
    allDims.push(pointsDim1 + pointsDim2);
    // console.log(allDims)
    return allDims;
};
const createCartesianPoint = (dims, allDims) => {
    var point = [];
    //   console.log(dims)
    var pointsDim = dims.filter((item) => {
        return item.type === "points";
    })[0];
    // console.log(pointsDim)
    var dimValues = dims.map((item) => {
        // console.log()
        return item.dimName;
    });
    //   console.log("allDims : ", allDims)
    //   console.log("dimValues : ", dimValues)
    allDims.forEach((item) => {
        if (dimValues.includes(item)) {
            point.push(1);
        }
        else {
            point.push(0);
        }
    });
    point.push(pointsDim);
    return point;
};
const calculateDistance = (p1, p2) => {
    var dist = 0;
    for (let i = 0; i < p1.length; i++) {
        if (typeof p1[i] !== 'object') {
            dist += (p1[i] - p2[i]) * (p1[i] - p2[i]);
        }
        else {
            dist += (p1[i].value - p2[i].value) > 2 ? 1 : 0;
            // dist+= (p1[i].value -p2[i].value)*(p1[i].value -p2[i].value)
        }
    }
    return Math.sqrt(dist);
};
// const createDimensions = (recipe) => {
// }
const getSimilarRecipes = (recipeId) => __awaiter(void 0, void 0, void 0, function* () {
    let recipe = yield recipeModel1.findOne({ id: recipeId });
    var similarRecipes;
    // const allRecipes = recipes.recipeData.recipeLookup; //recipeData.recipeLookup;//
    let allRecipes = yield recipeModel1.find();
    // console.log("all recipes count: ",allRecipes.length)
    // const inputRecipe = allRecipes.find( element => element.name===recipe.name)
    // console.log("input recipe : ",inputRecipe);
    // console.log("Inside helper - recipe count: ",Object.keys(recipeData.recipeLookup).length)
    // let recipeNames = Object.keys(recipes.recipeData.recipeLookup)
    let recipeNames = allRecipes.map(rec => { return { name: rec.name, id: rec.id, images: rec.images, maxPointsPrecise: rec.maxPointsPrecise }; });
    // console.log("all recipe names",recipeNames)
    // console.log("recipe name: ", recipe)
    recipeNames.forEach(element => {
        let similarity = 0;
        let distance = 0;
        let nameDistance = getLevenshteinDistance(element.name, recipe.name);
        if (element.name !== recipe.name) {
            distance = getEuclideanDistance(recipe, allRecipes.find(rec => rec.name === element.name));
        }
        similarity = 1 / (distance + 1);
        if (similarity !== 1) {
            similarRecipes.push({ "name": element.name, id: element.id, "images": element.images, "maxPointsPrecise": element.maxPointsPrecise, "similarityScore": similarity, "distance": distance });
        }
        // console.log(`recipe data inside loop ${recipeData.recipeLookup[element]}`)
    });
    similarRecipes.sort((a, b) => b.similarityScore - a.similarityScore);
    return similarRecipes.slice(0, 10);
});
const getLevenshteinDistance = (a, b) => {
    if (a.length == 0)
        return b.length;
    if (b.length == 0)
        return a.length;
    var matrix = [];
    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                Math.min(matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j] + 1)); // deletion
            }
        }
    }
    return matrix[b.length][a.length];
};
exports.getSimilarRecipes = getSimilarRecipes;
