import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import db from './db.js';
import database from "./config/database.js";

db.initialize(database.url_atlas).then(() => {
    db.getAllMovies(0, 0, '').then(async (movies) => {
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
            awards : AwardsSchema,
            imdb : ImdbSchema,
            tomatoes : TomatoesSchema
        }

        type AwardsSchema {
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
            getMovies: [Movie]
        }`;

        const resolvers = {
            Query: {
                getMovies: () => movies,
            },
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
})