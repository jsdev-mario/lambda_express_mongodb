const serverless = require('serverless-http');
const express = require('express')
const app = express()
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const config = require('./config');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.Promise = global.Promise;
try{
    mongoose.connect(process.env.DB_URL);
}catch(e){
    console.log(e)
}

//routes
const api = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); //cross origin resource sharing
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { 
        maxAge: 600000,
    }
}));

// Routes
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');

    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    const code = err.status || 500
    res.status(code).json({
        code: code,
        message: err.message
    })
});


module.exports.handler = serverless(app);