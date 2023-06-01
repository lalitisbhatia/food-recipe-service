import mongoose, { Schema } from 'mongoose';
import IRecipe from "./Recipe";

const RecipeSchema : Schema = new mongoose.Schema(
      {
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
      }
);

// export default mongoose.model<IRecipe>('Recipe', RecipeSchema);

const Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;
