// import express
const express = require('express')
// import path
const path = require('path')
// import express handlebars
const expressHandlebars = require('express-handlebars')
// import cors
const cors = require('cors')
// pull information from HTML POST (express4)
const bodyParser = require('body-parser')
// set constant for port
const port = process.env.PORT || 8000
// import express-validator
const { body, query, param, validationResult } = require('express-validator')
// import method-override
const methodOverride = require('method-override');
// import database config
const database = require('./config/database')
// import db
const db = require('./db')
// import Handlebars
const handlebars = require("handlebars");
// allow insecure prototype access
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// add helpers to Handlebars engine
const HBS = expressHandlebars.create({
    helpers: {
        errorHelper(options) {
            return '<h1 class="error">' + options.fn(this) + '</h1>'
        }
    },
    handlebars: allowInsecurePrototypeAccess(handlebars)
})
// initialize express app
const app = express()
// let the app use cors
app.use(cors())
// set directory for static files
app.use(express.static(path.join(__dirname, 'public')))
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}))
// parse application/json
app.use(express.json())
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
// allow app to override methods
app.use(methodOverride('_method'))
// register the given template engine callback as ext
app.engine('.hbs', HBS.engine)
// assign the setting name to value
app.set('view engine', 'hbs')

db.initialize(database.url_atlas).then(() => {
    app.get('/', (req, res) => {
        res.render('index', {title: 'Welcome to Web Programming & Framework 1 Project'})
    })

    const toArray = elementString => elementString.split(',').map(element => {
        return element.trim()
    })

    app.get('/Movies/add', (req, res) => {
        res.render('movie_submit_form', {title: 'Add Movie', method: 'post', action: '/api/Movies'})
    })

    app.post('/api/Movies',
        body('cast').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('countries').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('directors').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('fullplot').trim().escape(),
        body('genres').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('languages').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('lastupdated').trim().escape().default(new Date().toISOString()).isISO8601().withMessage('Last updated must be date'),
        body('metacritic').trim().escape().optional({checkFalsy: true}).isInt({min: 0}).withMessage('Metacritic must be a positive integer'),
        body('num_mflix_comments').trim().escape().default(0).isInt({min: 0}).withMessage('Number of Mflix comments must be a positive integer'),
        body('plot').trim().escape(),
        body('poster').trim().optional({checkFalsy: true}).isURL().withMessage('Poster must be a URL'),
        body('rated').trim().escape(),
        body('released').trim().escape().optional({checkFalsy: true}).isISO8601().withMessage('Released must be date'),
        body('runtime').trim().escape().optional({checkFalsy: true}).isInt({min: 0}).withMessage('Runtime must be a positive integer'),
        body('title').trim().escape().notEmpty().withMessage('Title must not be empty'),
        body('type').trim().escape().notEmpty().withMessage('Type must not be empty'),
        body('writers').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('year').trim().escape().isInt({min: 0}).withMessage('Year must be a positive integer'),
        (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('movie_submit_form', {title: 'Add Movie', method: 'post', action: '/api/Movies', errors: errors['errors'], body: req.body})
        } else {
            db.addNewMovie(req.body).then(createdMovie => {
                res.render('movie_submit_form', {title: 'Update Movie', method: 'post', action: `/api/Movies/${createdMovie['_id']}?_method=PUT`, body: createdMovie})
            }, error => {
                res.json(error)
            })
        }
    })

    app.get('/Movies/get', (req, res) => {
        res.render('movies_get_form', {title: 'Get Movies'})
    })

    app.get('/api/Movies',
        query('page').trim().escape().default(0).isInt({min: 0}).withMessage('Page must be a positive integer'),
        query('perPage').trim().escape().default(0).isInt({min: 0}).withMessage('Per page must be a positive integer'),
        query('title').trim().escape(),
        (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('movies_get_form', {title: 'Get Movies', errors: errors['errors'], query: req.query})
        } else {
            db.getAllMovies(req.query['page'], req.query['perPage'], req.query['title']).then(result => {
                res.render('movies', {title: 'Movies', movies: result})
            }, error => {
                res.json(error)
            })
        }
    })

    app.get('/api/Movies/:_id',
        param('_id').trim().escape().notEmpty().withMessage('_id must not be empty'),
        (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json(errors)
        } else {
            db.getMovieById(req.params['_id']).then(result => {
                res.json(result)
            }, error => {
                res.json(error)
            })
        }
    })

    app.get('/Movies/update/:_id',
        param('_id').trim().escape().notEmpty().withMessage('_id must not be empty'),
        (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json(errors)
        } else {
            db.getMovieById(req.params['_id']).then(result => {
                if (result !== null) {
                    res.render('movie_submit_form', {title: 'Update Movie', method: 'post', action: `/api/Movies/${result['_id']}?_method=PUT`, body: result})
                } else {
                    res.json(result)
                }
            }, error => {
                res.json(error)
            })
        }
    })

    app.put('/api/Movies/:_id',
        param('_id').trim().escape().notEmpty().withMessage('_id must not be empty'),
        body('cast').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('countries').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('directors').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('fullplot').trim().escape(),
        body('genres').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('languages').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('lastupdated').trim().escape().default(new Date().toISOString()).isISO8601().withMessage('Last updated must be date'),
        body('metacritic').trim().escape().optional({checkFalsy: true}).isInt({min: 0}).withMessage('Metacritic must be a positive integer'),
        body('num_mflix_comments').trim().escape().default(0).isInt({min: 0}).withMessage('Number of Mflix comments must be a positive integer'),
        body('plot').trim().escape(),
        body('poster').trim().optional({checkFalsy: true}).isURL().withMessage('Poster must be a URL'),
        body('rated').trim().escape(),
        body('released').trim().escape().optional({checkFalsy: true}).isISO8601().withMessage('Released must be date'),
        body('runtime').trim().escape().optional({checkFalsy: true}).isInt({min: 0}).withMessage('Runtime must be a positive integer'),
        body('title').trim().escape().notEmpty().withMessage('Title must not be empty'),
        body('type').trim().escape().notEmpty().withMessage('Type must not be empty'),
        body('writers').trim().escape().optional({checkFalsy: true}).customSanitizer(toArray),
        body('year').trim().escape().isInt({min: 0}).withMessage('Year must be a positive integer'),
        (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let isEmpty_id = false
            for (const error of errors['errors']) {
                if (error['param'] === '_id') {
                    isEmpty_id = true
                }
            }
           if (isEmpty_id) {
               res.json(errors)
           } else {
               res.render('movie_submit_form', {title: 'Update Movie', method: 'post', action: `/api/Movies/${req.params['_id']}?_method=PUT`, body: req.body, errors: errors['errors']})
           }
        } else {
            db.updateMovieById(req.body, req.params['_id']).then(updatedMovie => {
                res.json(updatedMovie)
            }, error => {
                res.json(error)
            })
        }
    })

    app.delete('/api/Movies/:_id',
        param('_id').trim().escape().notEmpty().withMessage('_id must not be empty'),
        (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json(errors)
        } else {
            db.deleteMovieById(req.params['_id']).then(result => {
                res.json(result)
            }, error => {
                res.json(error)
            })
        }
    })

    app.delete('/api/Movies',
        body('_id').trim().escape().notEmpty().withMessage('_id must not be empty'),
        (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json(errors)
        } else {
            db.deleteMovieById(req.body['_id']).then(result => {
                res.json(result)
            }, error => {
                res.json(error)
            })
        }
    })

    app.all('*', (req, res) => {
        res.status(404).render('error', {title: 'Error', message: 'Error: 404: page not found'})
    })

    // listen on the port
    app.listen(port, () => {
        // callback function to log a message to console
        console.log(`The app listening at http://localhost:${port}`)
    })
}, error => {
    console.log(error)
})