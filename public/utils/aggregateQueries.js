"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../interfaces/models");
const recipeModel = models.recipeModel;
const tagModel = models.tagModel;
const getTagsWithRecipeCounts = () => {
    recipeModel.aggregate([
        {
            $unwind: '$tags' // unwind the tags array
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: 'tag',
                as: 'tagDetails' // output array field
            }
        },
        {
            $unwind: '$tagDetails' // unwind the tagDetails array
        },
        {
            $group: {
                _id: '$tagDetails.tag',
                count: { $sum: 1 } // count the number of recipes with that tag
            }
        }
    ]).read('primary').exec((err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(result);
        return result;
    });
};
exports.default = getTagsWithRecipeCounts;
