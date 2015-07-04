'use strict';
/**
 * bootstrap the app, setup mongodb connection, session, root user
 */
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('./config');
var logger = require('../utils/logger');

// to add root user if not existed.
var accountApi = require('../apis/account');
var confApi = require('../apis/conf');

function addRoot() {
    var root = config.account.root;
    accountApi.findOne({
        role: root.role
    }).exec(function(err, user) {
        if (user) {
            return;
        }
        user = new accountApi.model(root);
        user.save();
    });
}
function addEmailConf() {
    var email = config.account.email;
    confApi.findOne({
        type: 'EMAIL'
    }).exec(function(err, m) {
        if (m) {
            return;
        }
        m = new confApi.model(email);
        m.save();
    })
}

/// config mongoose connection
mongoose.connection.on('connecting', function(ref) {
    logger.info('connecting to mongodb: ' + config.db.connectionUrl);
});

mongoose.connection.on('connected', function(ref) {
    logger.info('connected to mongodb: ' + config.db.connectionUrl);
    addRoot();
    addEmailConf();
});

mongoose.connection.on('close', function() {
    logger.info('mongodb was successfully closed.');
});

mongoose.connection.on('error', function(err) {
    logger.info({data: err}, 'failed to connect to mongodb.');
    process.exit(1);
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        logger.info('Mongoose connection isDisconnected through app termination.');
        process.exit(0);
    });
});

process.on('uncaughtException', function(err) {
    logger.info('Caught exception: ' + err);
    process.exit(0);
});

exports.start = function(app) {
    mongoose.connect(config.db.connectionUrl, config.db.options);
    app.use(session({
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }));
};
