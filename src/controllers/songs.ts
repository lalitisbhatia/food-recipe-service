import express, { Request, Response, RequestParamHandler } from 'express';
import mongoose, { Query } from 'mongoose';
const { Song, Singer, Movie, MusicDirector, Lyricist } = require("../models")
import translate from '../utils/translate';

class SongsController {
    public path = '/hindi-songs';
    public router = express.Router();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/", this.getAllSongs);
        this.router.get(`${this.path}/songs`, this.getAllSongs);
        this.router.get(`${this.path}/songs/:id`, this.getSong);
        this.router.get(`${this.path}/lyricists`, this.getAllLyricists);
        this.router.get(`${this.path}/singers`, this.getAllSingers);
        this.router.get(`${this.path}/movies`, this.getAllMovies);
        this.router.get(`${this.path}/musicdirectors`, this.getAllMusicDirectors);        
    }

    private handleSend(data: any, res: Response) {
        try {
            console.log("inside handle send")
            // console.log(data)
            res.status(200).json({ "data": data });
        } catch (err) {
            res.status(500).json({ error: err })
        }
    }


    private getPaginatedData = async (query: any, paginateOptions: any, Model: any) => {        
        let res = await Model.paginate(query, paginateOptions)
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
        }
        return returnObj;
    }

    private getAllSongs = async (req: Request, res: Response) => {
        let page = req.query.page || 1;
        let num = req.query.num || 20;
        let paginateOptions = {
            page: page,
            limit: num            
        }
          
        let query = this.generateFilter(req);

        console.log("QUERY = " , query)
        let data = await this.getPaginatedData(query, paginateOptions, Song);
        data.docs.map((item: any) => {            
            item._doc["lyricsDeva"] = translate(item._doc.lyricsLatin)
            return item
        })
        this.handleSend(data, res);
    }

    private getSong = async (req: Request, res: Response) => {
        console.log(`requested song : ${req.params.id}`)
        let song = await Song.findOne({ songId: req.params.id })
        song._doc["lyricsDeva"] = translate(song._doc.lyricsLatin)
        this.handleSend(song, res)
    }

    private getAllLyricists = async (req: Request, res: Response) => {
        let page = req.query.page || 1;
        let num = req.query.num || 20;
        let paginateOptions = {
            page: page,
            limit: num,
            sort: { songCount: -1 }            
        }

        let data = await this.getPaginatedData({}, paginateOptions, Lyricist);
        this.handleSend(data, res);           
    }

    private getAllSingers = async (req: Request, res: Response) => {
        let page = req.query.page || 1;
        let num = req.query.num || 20;
        let paginateOptions = {
            page: page,
            limit: num,
            sort: { songCount: -1 }
            
        }

        let data = await this.getPaginatedData({}, paginateOptions, Singer);
        this.handleSend(data, res);
              
    }

    private getAllMovies = async (req: Request, res: Response) => {
        let page = req.query.page || 1;
        let num = req.query.num || 20;
        let paginateOptions = {
            page: page,
            limit: num,
            sort: { songCount: -1 }           
        }

        let data = await this.getPaginatedData({}, paginateOptions, Movie);
        this.handleSend(data, res);             
    }

    private getAllMusicDirectors = async (req: Request, res: Response) => {
        let page = req.query.page || 1;
        let num = req.query.num || 20;
        let paginateOptions = {
            page: page,
            limit: num,
            sort: { songCount: -1 }          
        }
        let data = await this.getPaginatedData({}, paginateOptions, MusicDirector);
        this.handleSend(data, res); 
    }


    private generateFilter =  (req: Request ) => {                   
        let filterType = req.query.filterType;
        let filterId: any = req.query.filterId;
        if(filterType!==undefined && filterId===undefined){
            return {}
        }

        let query = {};
        switch (filterType) {
            case 'lyricist':
                // console.log("lyricistId: ", filterId)
                query = {lyricists: {$elemMatch: {refId:filterId}}}  
                break;
            case 'movie':
                // console.log("movieId: ", filterId)
                let movieRefId = new mongoose.mongo.ObjectId(filterId)
                query = {"movie.refId":movieRefId}  
                break;
            case 'singer':                
                // console.log("singerId: ", filterId)
                query = {singers: {$elemMatch: {refId:filterId}}} 
                break; 
            case 'music':
                // console.log("musicdirector: ", filterId)
                let musicRefId = new mongoose.mongo.ObjectId(filterId)
                query = {"music.refId":musicRefId}  
                break;
            default:
                query={};

        }

       return query;
    }



}

export default SongsController