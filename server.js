var config = require('./configs/config');
var bootstrap = require('./configs/bootstrap');
var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routers');
var logger = require('./utils/logger');
var app = express();


// connect database & config sessions & setup root user
bootstrap.start(app);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// view configs setup
app.set('views', './views');
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});


app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',
        'Content-Type, Authorization, If-Modified-Since');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});


/// static router;
/// TODO: routed via nginx instead!
app.use('/statics', express.static(__dirname + '/statics'));
app.use('/statics', express.static(__dirname + '/bower_components'));
app.use('/statics', express.static(__dirname + '/dist'));
app.use('/views', express.static(__dirname + '/views'));

// bussiness logic routes
//============================


app.use('/auth', router.auth);
app.use('/', function(req, res, next) {
    //if (!req.session.user) return res.render('admin/login');
    next();
});
app.use('/accounts', router.accounts);
app.use('/configs', router.conf);
//

app.use(function(req, res) {
    return res.send('404.html');
});

logger.info('App listen on:' + config.server.port);
app.listen(config.server.port);

