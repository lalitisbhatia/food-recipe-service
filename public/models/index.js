"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const LyricistSchema = new mongoose_1.default.Schema({
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
});
LyricistSchema.plugin(mongoose_paginate_v2_1.default);
const Lyricist = mongoose_1.default.model("Lyricist", LyricistSchema);
const SingerSchema = new mongoose_1.default.Schema({
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
});
SingerSchema.plugin(mongoose_paginate_v2_1.default);
const Singer = mongoose_1.default.model("Singer", SingerSchema);
const MusicDirectorSchema = new mongoose_1.default.Schema({
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
});
MusicDirectorSchema.plugin(mongoose_paginate_v2_1.default);
const MusicDirector = mongoose_1.default.model("MusicDirector", MusicDirectorSchema);
const MovieSchema = new mongoose_1.default.Schema({
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
});
MovieSchema.plugin(mongoose_paginate_v2_1.default);
const Movie = mongoose_1.default.model("Movie", MovieSchema);
const SongSchema = new mongoose_1.default.Schema({
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
            "name": { "type": "String" },
            "refId": { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Movie' }
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
            "name": { "type": "String" },
            "refId": { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'MusicDirector' }
        }
    },
    // "lyricist": {
    //   "type": "String"
    // },
    "lyricists": {
        "type": [
            {
                "name": { "type": "String" },
                "refId": { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Lyricist' }
            }
        ]
    },
    "singers": {
        "type": [
            {
                "name": { "type": "String" },
                "refId": { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Singer' }
            }
        ]
    },
    "categories": {
        "type": [
            {
                "name": { "type": "String" },
                "refId": { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Category' }
            }
        ]
    },
    "lyricsLatin": {
        "type": "String"
    },
    "lyricsDevnagri": {
        "type": "String"
    }
});
SongSchema.plugin(mongoose_paginate_v2_1.default);
const Song = mongoose_1.default.model("Song", SongSchema);
const CategorySchema = new mongoose_1.default.Schema({
    "name": {
        "type": "String"
    },
    "songCount": {
        "type": "Number"
    }
});
CategorySchema.plugin(mongoose_paginate_v2_1.default);
const Category = mongoose_1.default.model("Category", CategorySchema);
module.exports = {
    Song,
    Lyricist,
    Movie,
    Singer,
    MusicDirector
};
