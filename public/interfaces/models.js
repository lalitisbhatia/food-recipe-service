"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const TagSchema = new mongoose_1.default.Schema({
    "id": {
        "type": "Number"
    },
    "tag": {
        "type": "String"
    }
});
const Tag = mongoose_1.default.model("Tag", TagSchema);
const RecipeSchema = new mongoose_1.default.Schema({
    "id": {
        "type": "Number"
    },
    "name": {
        "type": "String"
    },
    "description": {
        "type": "String"
    },
    "ingredients": {
        "type": [
            "Mixed"
        ]
    },
    "tags": {
        "type": [
            "String"
        ]
    },
    "tagIDs": {
        "type": [
            { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Tag' }
        ]
    },
    "difficultyLevel": {
        "type": "String"
    },
    "maxPointsPrecise": {
        "type": "Number"
    },
    "instructions": {
        "type": [
            "Mixed"
        ]
    },
    "images": {
        "SMALL": {
            "_id": {
                "type": "ObjectId"
            },
            "url": {
                "type": "String"
            },
            "width": {
                "type": "Number"
            },
            "height": {
                "type": "Number"
            },
            "imageType": {
                "type": "String"
            }
        },
        "MEDIUM": {
            "_id": {
                "type": "ObjectId"
            },
            "url": {
                "type": "String"
            },
            "width": {
                "type": "Number"
            },
            "height": {
                "type": "Number"
            },
            "imageType": {
                "type": "String"
            }
        },
        "LARGE": {
            "_id": {
                "type": "ObjectId"
            },
            "url": {
                "type": "String"
            },
            "width": {
                "type": "Number"
            },
            "height": {
                "type": "Number"
            },
            "imageType": {
                "type": "String"
            }
        },
        "EXTRALARGE": {
            "_id": {
                "type": "ObjectId"
            },
            "url": {
                "type": "String"
            },
            "width": {
                "type": "Number"
            },
            "height": {
                "type": "Number"
            },
            "imageType": {
                "type": "String"
            }
        },
        "SQUARE600": {
            "_id": {
                "type": "ObjectId"
            },
            "url": {
                "type": "String"
            },
            "width": {
                "type": "Number"
            },
            "height": {
                "type": "Number"
            },
            "imageType": {
                "type": "String"
            }
        },
        "SQUARE200": {
            "_id": {
                "type": "ObjectId"
            },
            "url": {
                "type": "String"
            },
            "width": {
                "type": "Number"
            },
            "height": {
                "type": "Number"
            },
            "imageType": {
                "type": "String"
            }
        }
    }
});
// export default mongoose.model<IRecipe>('Recipe', RecipeSchema);
RecipeSchema.plugin(mongoose_paginate_v2_1.default);
const Recipe = mongoose_1.default.model("Recipe", RecipeSchema);
// BandSchema.virtual('numMembers', {
//   ref: 'Person', // The model to use
//   localField: 'name', // Find people where `localField`
//   foreignField: 'band', // is equal to `foreignField`
//   count: true // And only get the number of docs
// });
// // Later
// const doc = await Band.findOne({ name: 'Motley Crue' }).
//   populate('numMembers');
module.exports = {
    recipeModel: Recipe,
    tagModel: Tag
};
// module.exports = Tag;
// export {Recipe as recipeModel, Tag as tagModel}
