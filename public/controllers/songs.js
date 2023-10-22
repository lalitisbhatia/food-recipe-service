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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const { Song, Singer, Movie, MusicDirector, Lyricist } = require("../models");
const translate_1 = __importDefault(require("../utils/translate"));
class SongsController {
    constructor() {
        this.path = '/hindi-songs';
        this.router = express_1.default.Router();
        this.getPaginatedData = (query, paginateOptions, Model) => __awaiter(this, void 0, void 0, function* () {
            let res = yield Model.paginate(query, paginateOptions);
            let returnObj = {
                "docs": res.docs,
                "info": {
                    "totalDocs": res.totalDocs,
                    "offset": res.offset,
                    "limit": res.limit,
                    "totalPages": res.totalPages,
                    "page": res.page,
                    "pagingCounter": res.pagingCounter,
                    "hasPrevPage": res.hasPrevPage,
                    "hasNextPage": res.hasNextPage,
                    "prevPage": res.prevPage,
                    "nextPage": res.nextPage
                }
            };
            return returnObj;
        });
        this.getAllSongs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let num = req.query.num || 20;
            let paginateOptions = {
                page: page,
                limit: num
            };
            let query = this.generateFilter(req);
            console.log("QUERY = ", query);
            let data = yield this.getPaginatedData(query, paginateOptions, Song);
            data.docs.map((item) => {
                item._doc["lyricsDeva"] = (0, translate_1.default)(item._doc.lyricsLatin);
                return item;
            });
            this.handleSend(data, res);
        });
        this.getSong = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`requested song : ${req.params.id}`);
            let song = yield Song.findOne({ songId: req.params.id });
            song._doc["lyricsDeva"] = (0, translate_1.default)(song._doc.lyricsLatin);
            this.handleSend(song, res);
        });
        this.getAllLyricists = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let num = req.query.num || 20;
            let paginateOptions = {
                page: page,
                limit: num,
                sort: { songCount: -1 }
            };
            let data = yield this.getPaginatedData({}, paginateOptions, Lyricist);
            this.handleSend(data, res);
        });
        this.getAllSingers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let num = req.query.num || 20;
            let paginateOptions = {
                page: page,
                limit: num,
                sort: { songCount: -1 }
            };
            let data = yield this.getPaginatedData({}, paginateOptions, Singer);
            this.handleSend(data, res);
        });
        this.getAllMovies = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let num = req.query.num || 20;
            let paginateOptions = {
                page: page,
                limit: num,
                sort: { songCount: -1 }
            };
            let data = yield this.getPaginatedData({}, paginateOptions, Movie);
            this.handleSend(data, res);
        });
        this.getAllMusicDirectors = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let num = req.query.num || 20;
            let paginateOptions = {
                page: page,
                limit: num,
                sort: { songCount: -1 }
            };
            let data = yield this.getPaginatedData({}, paginateOptions, MusicDirector);
            this.handleSend(data, res);
        });
        this.generateFilter = (req) => {
            let filterType = req.query.filterType;
            let filterId = req.query.filterId;
            if (filterType !== undefined && filterId === undefined) {
                return {};
            }
            let query = {};
            switch (filterType) {
                case 'lyricist':
                    // console.log("lyricistId: ", filterId)
                    query = { lyricists: { $elemMatch: { refId: filterId } } };
                    break;
                case 'movie':
                    // console.log("movieId: ", filterId)
                    let movieRefId = new mongoose_1.default.mongo.ObjectId(filterId);
                    query = { "movie.refId": movieRefId };
                    break;
                case 'singer':
                    // console.log("singerId: ", filterId)
                    query = { singers: { $elemMatch: { refId: filterId } } };
                    break;
                case 'music':
                    // console.log("musicdirector: ", filterId)
                    let musicRefId = new mongoose_1.default.mongo.ObjectId(filterId);
                    query = { "music.refId": musicRefId };
                    break;
                default:
                    query = {};
            }
            return query;
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", this.getAllSongs);
        this.router.get(`${this.path}/songs`, this.getAllSongs);
        this.router.get(`${this.path}/songs/:id`, this.getSong);
        this.router.get(`${this.path}/lyricists`, this.getAllLyricists);
        this.router.get(`${this.path}/singers`, this.getAllSingers);
        this.router.get(`${this.path}/movies`, this.getAllMovies);
        this.router.get(`${this.path}/musicdirectors`, this.getAllMusicDirectors);
    }
    handleSend(data, res) {
        try {
            console.log("inside handle send");
            // console.log(data)
            res.status(200).json({ "data": data });
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
exports.default = SongsController;
