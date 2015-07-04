'use strict';
var config = require('../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();
var logger = require('../utils/logger');

var Config = require('../apis/conf');

router.param('confId', function(req, res, next, confId) {
    req.confId = confId;
    next();
});

router.route('/')
    .get(function(req, res) {
        Config.get(null, null, null, req.query)
            .then(function(resData) {
                logger.info({data: resData}, 'get email config');
                return res.status(200).send(resData);
            }, function(resData) {
                return res.status(200).send(resData);
            });
    })
    .put(function(req, res) {
        var conf = req.body || {};
        var id = conf._id;
        delete conf._id;

        Config.update(id, conf)
            .then(function(item) {
                console.log(item);
                res.status(200).send(item);
            }, function(err) {
                res.status(200).send(err);
            });
    });
router.route('/:confId')
    .get(function(req, res) {
        Config.get({
            _id: req.confId
        }).then(function(confs) {
            return res.status(200).send(confs[0]);
        }, function(err) {
            return res.status(200).send(err);
        });
    })
    .put(function(req, res) {
        var conf = req.body || {};
        var id = conf._id || req.confId;
        delete conf._id;

        Config.update(id, conf)
            .then(function(item) {
                res.status(200).send(item);
            }, function(err) {
                res.status(200).send(err);
            });
    });

module.exports = router;
