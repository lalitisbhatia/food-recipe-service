const models = require("../interfaces/models");
const recipeModel = models.recipeModel
const tagModel = models.tagModel



const getTagsWithRecipeCounts = () => {
    recipeModel.aggregate([
        {
          $unwind: '$tags' // unwind the tags array
        },
        {
          $lookup: {
            from: 'tags', // specify the collection to join with
            localField: 'tags', // field from the recipe collection
            foreignField: 'tag', // field from the tags collection
            as: 'tagDetails' // output array field
          }
        },
        {
          $unwind: '$tagDetails' // unwind the tagDetails array
        },
        {
          $group: {
            _id: '$tagDetails.tag', // group by the tag name
            count: { $sum: 1 } // count the number of recipes with that tag
          }
        }
      ]).read('primary').exec( (err:any, result:any) => {
        if (err) {
          console.error(err);
          return;
        }
        
        console.log(result);
        return result;
        
      });

      
}

export default getTagsWithRecipeCounts;