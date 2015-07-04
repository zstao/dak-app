/**************************************
 * Common api router for Record model, including getOne, getOnes, ......
 * For Page specified api router, please refer routers/admin/, routers/public/
 *********************************************/
'use strict';

var config = require('../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();
var _ = require('underscore');

var Record = require('../apis/record');

router.param('recordId', function(req, res, next, recordId) {
    req.recordId = recordId;
    next();
});

router.route('/')
    .get(function(req, res) {
        Record.getPage(null, req.query)
            .then(function(page) {
                return res.status(200).send(page);
            }, function(err) {
                return res.status(200).send(err);
            });
    })
    .post(function(req, res) {
        var record = req.body;
        var defaultConf = res.locals.LANG[record.category];
        record.lang = record.lang || res.locals.LANG.LANG_CODE;
        record.title = record.title || (defaultConf && defaultConf.title);
        Record.create(record)
            .then(function(record) {
                return res.status(201).send(record);
            }, function(err) {
                return res.status(200).send(err);
            });
    });

router.route('/:recordId')
    .get(function(req, res) {
        Record.get({
            _id: req.recordId
        }).then(function(records) {
            return res.status(200).send(records[0]);
        }, function(err) {
            return res.status(200).send(err);
        });
    })
    .put(function(req, res) {
        var record = req.body || {};
        var id = record._id;

        delete record._id;

        Record.update(id, record)
            .then(function(item) {
                res.status(200).send(item);
            }, function(err) {
                res.status(200).send(err);
            });
    })
    .delete(function(req, res) {
        var id = req.recordId;
        Record.delete({
                _id: id
            })
            .then(function(record) {
                return res.status(200).send(record);
            }, function(err) {
                console.log(err);
                return res.status(200).send(err);
            });
    });

module.exports = router;
