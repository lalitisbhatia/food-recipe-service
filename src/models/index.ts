import mongoose, { Mongoose, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const LyricistSchema  = new mongoose.Schema(
    {
      "id": {
        "type": "Number"
      },
      "tags": {
        "type": [
          "String"
        ]
      },
      "name": {
        "type": "String"
      },
      "bio": {
        "type": "String"
      },
      "songCount": {
        "type": "Number"
      }
    }
  );
  LyricistSchema.plugin(mongoosePaginate);
  const Lyricist = mongoose.model("Lyricist", LyricistSchema);
  
  const SingerSchema  = new mongoose.Schema(
    {
      "id": {
        "type": "Number"
      },
      "tags": {
        "type": [
          "String"
        ]
      },
      "name": {
        "type": "String"
      },
      "bio": {
        "type": "String"
      },
      "songCount": {
        "type": "Number"
      }
    }
  );
  SingerSchema.plugin(mongoosePaginate);
  const Singer = mongoose.model("Singer", SingerSchema);
  
  const MusicDirectorSchema  = new mongoose.Schema(
    {
      "id": {
        "type": "Number"
      },
      "tags": {
        "type": [
          "String"
        ]
      },
      "name": {
        "type": "String"
      },
      "bio": {
        "type": "String"
      },
      "songCount": {
        "type": "Number"
      }
    }
  );
  
  MusicDirectorSchema.plugin(mongoosePaginate);
  const MusicDirector = mongoose.model("MusicDirector", MusicDirectorSchema);

  const MovieSchema  = new mongoose.Schema(
    {
      "id": {
        "type": "Number"
      },
      "tags": {
        "type": [
          "String"
        ]
      },
      "name": {
        "type": "String"
      },
      "description": {
        "type": "String"
      },
      "songCount": {
        "type": "Number"
      }
    }
  );
  MovieSchema.plugin(mongoosePaginate);
  const Movie = mongoose.model("Movie", MovieSchema);

  const SongSchema = new mongoose.Schema(
    {
      "name": {
        "type": "String"
      },
      "songId": {
        "type": "String"
      },
      // "movie": {
      //   "type": "String"
      // },
      "movie": {
          "type": {
              "name": {"type": "String"}, 
              "refId": { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
            }
        },
      "year": {
        "type": "String"
      },
      // "music": {
      //   "type": "String"
      // },

      "music": {
          "type": {
              "name": {"type": "String"}, 
              "refId": { type: mongoose.Schema.Types.ObjectId, ref: 'MusicDirector' }
            }
      },
      // "lyricist": {
      //   "type": "String"
      // },
      "lyricists" :{
        "type": 
        [
          {
            "name": {"type": "String"}, 
            "refId": { type: mongoose.Schema.Types.ObjectId, ref: 'Lyricist' }
          }
        ]        
      },           
      "singers" :{
        "type": [
          {
            "name": {"type": "String"}, 
            "refId": { type: mongoose.Schema.Types.ObjectId, ref: 'Singer' }
          }
        ]
      },
      "categories" :{
        "type": 
        [
          {
            "name": {"type": "String"}, 
            "refId": { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
          }
        ]        
      }, 
      "lyricsLatin":{
        "type": "String"
      },
      "lyricsDevnagri":{
        "type": "String"
      }
    }
  )
  SongSchema.plugin(mongoosePaginate);
  const Song = mongoose.model("Song", SongSchema); 
  
  const CategorySchema  = new mongoose.Schema(
    {
     
      "name": {
        "type": "String"
      },      
      "songCount": {
        "type": "Number"
      }
    }
  );
  
  CategorySchema.plugin(mongoosePaginate);
  const Category = mongoose.model("Category", CategorySchema);

  module.exports =  {
    Song, 
    Lyricist,
    Movie,
    Singer,
    MusicDirector
  };



