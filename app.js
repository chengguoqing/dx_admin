var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/new_index');
var https = require('https');
var token = require('./util/token');
var fs = require('fs');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));



app.all('*', function (req, res, next) { 
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE,OPTIONS');


    if (req.method == 'OPTIONS') {


        res.send(200);
    } else {
        if (req.originalUrl == "/load_in") {
            next();
            return
        }

 

        try {

            if (!token.decodeToken(req.body.token)) {
                res.json({
                    code: "-1",
                    msg: "token过期或错误1"
                })
                return
            }

        } catch (e) {

        }
        try {
            if (!token.decodeToken(req.query.token)) {
                res.json({
                    code: "-1",
                    msg: "token过期或错误2"
                })
                return
            }

        } catch (e) {

        }
        next();
    }
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404; 
    res.render('404')
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(req)
});
/* */


//var httpsServer = https.createServer({
//    key: fs.readFileSync('./3_www.duxinggj.com.key', 'utf8'),
//    cert: fs.readFileSync('./2_www.duxinggj.com.crt', 'utf8')
//}, app);
//
//httpsServer.listen(443, function () {
//    console.log('HTdfdsgfdg running on: https://localhost:%s', 443);
//});
module.exports = app;
app.listen(8084)
