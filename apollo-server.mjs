import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import db from './db.js';
import database from "./config/database.js";

db.initialize(database.url_atlas).then(async () => {
    const typeDefs = `#graphql
    type Movie {
        _id: ID
        cast : [ String ] ,
        countries : [  String ] ,
        directors : [  String ] ,
        fullplot :   String  ,
        genres : [  String ] ,
        languages : [  String ] ,
        lastupdated :   String  ,
        metacritic :   Int  ,
        num_mflix_comments :   Int  ,
        plot :   String  ,
        poster :   String  ,
        rated :   String  ,
        released :   String  ,
        runtime :   Int  ,
        title :   String  ,
        type :   String  ,
        writers : [  String ] ,
        year :   Int  ,
        awards : Awards,
        imdb : ImdbSchema,
        tomatoes : TomatoesSchema
    }
    
    type Awards {
        wins : Int  ,
        nominations : Int ,
        text : String
    }

    type ImdbSchema {
        rating : Int ,
        votes : Int ,
        id : Int
    }

    type TomatoesSchema {
        boxOffice:   String  ,
        consensus:   String  ,
        critic: CriticSchema ,
        dvd :   String  ,
        fresh :   Int  ,
        rotten :   Int  ,
        production :   String  ,
        website :   String  ,
        viewer : ViewerSchema ,
        lastUpdated :   String
    }

    type CriticSchema {
        rating : Int ,
        numReviews : Int ,
        meter : Int
    }

    type ViewerSchema {
        rating : Int ,
        numReviews : Int ,
        meter : Int
    }

    type Query {
        getAllMovies(page: Int, perPage: Int, title: String): [Movie]
    }

    input MovieInput {
        cast : [ String ] ,
        countries : [  String ] ,
        directors : [  String ] ,
        fullplot :   String  ,
        genres : [  String ] ,
        languages : [  String ] ,
        lastupdated :   String  ,
        metacritic :   Int  ,
        num_mflix_comments :   Int  ,
        plot :   String  ,
        poster :   String  ,
        rated :   String  ,
        released :   String  ,
        runtime :   Int  ,
        title :   String  ,
        type :   String  ,
        writers : [  String ] ,
        year :   Int  ,
    }
    
    type Mutation {
        addNewMovie(data: MovieInput): Movie
    }
    `;

    const resolvers = {
        Query: {
            getAllMovies: (root, {page, perPage, title}) => db.getAllMovies(page, perPage, title),
        },
        Mutation: {
            addNewMovie: (root, {data}) => db.addNewMovie(data),
        }
    };

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const {url} = await startStandaloneServer(apolloServer, {
        listen: {port: 4000},
    });

    console.log(`🚀  Server ready at: ${url}`);
})