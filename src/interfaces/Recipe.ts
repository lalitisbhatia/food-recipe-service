import mongoose, { Schema, Document } from 'mongoose';



interface  IRecipe   {
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

  export default IRecipe;