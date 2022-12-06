/******************************************************************************
 * ITE5315 – Project
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 *  (including websites) or distributed to other students.
 * Group members:
 *  Nguyen Anh Tuan Le N01414195
 *  Shubham Singh N01469289
 * Date: December 6th, 2022
 * *********************************************************************************/
// import express
const express = require('express')
// import path
const path = require('path')
// import express handlebars
const expressHandlebars = require('express-handlebars')
// import cors
const cors = require('cors')
// import bcryptjs
const bcryptjs = require('bcryptjs')
// import jsonwebtoken
const jsonwebtoken = require('jsonwebtoken');
// pull information from HTML POST (express4)
const bodyParser = require('body-parser')
// import cookie-parser
const cookieParser = require('cookie-parser')
// set constant for port
const port = process.env.PORT || 8000
// import express-validator
const { body, query, param, validationResult } = require('express-validator')
// import method-override
const methodOverride = require('method-override')
// import database config
const database = require('./config/database')
// import db
const db = require('./db')
// import Handlebars
const handlebars = require("handlebars")
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
// let the app use cookie-parser
app.use(cookieParser())
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
    app.route(['/api/Movies*', '/Movies*']).all((req, res, next) => {
        const token = req.cookies.token
        if (token === undefined) {
            res.redirect('/login')
        } else {
            jsonwebtoken.verify(token, process.env.TOKEN_SECRET, {},(error, decoded) => {
                if (error) {
                    res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
                } else {
                    db.findUser(decoded.username).then(user => {
                        if (user == null) {
                            res.redirect('/login')
                        } else {
                            if (user.token === token) {
                                next()
                            } else {
                                res.redirect('/login')
                            }
                        }
                    }, error => {
                        res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
                    })
                }
            })
        }
    })

    app.get('/', (req, res) => {
        res.render('index', {title: 'Welcome to Web Programming & Framework 1 Project'})
    })

    app.get('/register', (req, res) => {
        res.render('user_form', {title: 'Register', method: 'post', action: '/register', isRegister: true})
    })

    const encryptPassword = password => {
        return new Promise((resolve, reject) => {
            bcryptjs.hash(password, 3).then(encryptedPassword => {
                resolve(encryptedPassword)
            }, error => {
                reject(error)
            })
        })
    }

    app.post('/register',
        body('username').trim().escape().notEmpty().withMessage('Username must not be empty').bail().toLowerCase().custom(username => {
            return db.findUser(username).then(user => {
                if (user !== null) {
                    return Promise.reject('Unable to create a new user with that username')
                }
            }, (error) => {
                console.log(error)
            })
        }),
        body('password').trim().escape().notEmpty().withMessage('Password must not be empty').bail().customSanitizer(encryptPassword),
        (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('user_form', {title: 'Register', method: 'post', action: '/register', errors: errors['errors'], body: req.body, isRegister: true})
        } else {
            db.addNewUser(req.body).then(() => {
                res.redirect('/login')
            }, error => {
                res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
            })
        }
    })

    app.get('/login', (req, res) => {
        res.render('user_form', {title: 'Login', method: 'post', action: '/login', isLogin: true})
    })

    app.post('/login',
        body('username').trim().escape().notEmpty().withMessage('Username must not be empty').bail().toLowerCase(),
        body('password').trim().escape().notEmpty().withMessage('Password must not be empty'),
        (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('user_form', {title: 'Login', method: 'post', action: '/login', body: req.body, errors: errors['errors'], isLogin: true})
        } else {
            db.findUser(req.body['username']).then(user => {
                if (user == null) {
                    res.render('user_form', {title: 'Login', method: 'post', action: '/login', body: req.body, errors: [{
                        location: 'body',
                        msg: 'Unable to login with that username',
                        param: 'username',
                        value: req.body['username']
                    }], isLogin: true})
                } else {
                    bcryptjs.compare(req.body['password'], user.password).then(result => {
                        if (result) {
                            jsonwebtoken.sign({username: user.username}, process.env.TOKEN_SECRET, {},(error, token) => {
                                if (error) {
                                    res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
                                } else {
                                    db.updateUserToken(user.username, token).then(updatedUser => {
                                        if (updatedUser == null) {
                                            res.render('user_form', {title: 'Login', method: 'post', action: '/login', body: req.body, errors: [{
                                                    location: 'body',
                                                    msg: 'Unable to login with that username',
                                                    param: 'username',
                                                    value: req.body['username']
                                                }], isLogin: true})
                                        } else {
                                            res.cookie('token', updatedUser['token']);
                                            res.redirect('/')
                                        }
                                    }, error => {
                                        res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
                                    })
                                }
                            })
                        } else {
                            res.render('user_form', {title: 'Login', method: 'post', action: '/login', body: req.body, errors: [{
                                value: req.body['password'],
                                msg: 'Wrong password',
                                param: 'password',
                                location: 'body'
                            }], isLogin: true})
                        }
                    }, error => {
                        res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
                    })
                }
            }, error => {
                res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
            })
        }
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
                res.render('movie_submit_form', {title: 'Added Movie', method: 'post', action: `/api/Movies/${createdMovie['_id']}?_method=PUT`, body: createdMovie, _id: createdMovie['_id']})
            }, error => {
                res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
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
                res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
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
                res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
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
                if (result === null) {
                    res.render('error', {title: 'Error', message: `Unable to find the movie with id ${req.params['_id']}`})
                } else {
                    res.render('movie_submit_form', {title: 'Update Movie', method: 'post', action: `/api/Movies/${result['_id']}?_method=PUT`, body: result, _id: result['_id']})
                }
            }, error => {
                res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
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
               res.render('movie_submit_form', {title: 'Update Movie', method: 'post', action: `/api/Movies/${req.params['_id']}?_method=PUT`, body: req.body, errors: errors['errors'], _id: req.params['_id']})
           }
        } else {
            db.updateMovieById(req.body, req.params['_id']).then(updatedMovie => {
                if (updatedMovie === null) {
                    res.render('error', {title: 'Error', message: `Unable to update the movie with id ${req.params['_id']}`})
                } else {
                    res.render('movie_submit_form', {title: 'Updated Movie', method: 'post', action: `/api/Movies/${updatedMovie['_id']}?_method=PUT`, body: updatedMovie, _id: updatedMovie['_id']})
                }
            }, error => {
                res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
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
                if (result === null) {
                    res.render('error', {title: 'Error', message: `Unable to delete the movie with id ${req.params['_id']}`})
                } else {
                    res.render('index', {title: `Deleted the movie with id ${result['_id']}`})
                }
            }, error => {
                res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
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
                if (result === null) {
                    res.render('error', {title: 'Error', message: `Unable to delete the movie with id ${req.body['_id']}`})
                } else {
                    res.render('index', {title: `Deleted the movie with id ${result['_id']}`})
                }
            }, error => {
                res.status(500).render('error', {title: 'Error', message: `Error: 500: Internal Server Error ${error}`})
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