'use strict';
var config = require('../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();

var Account = require('../apis/account');

router.param('accountId', function(req, res, next, accountId) {
    req.personId = accountId;
    next();
});

router.route('/')
    .get(function(req, res) {
        Account.getPage(null, req.query)
            .then(function(resData) {
                return res.status(200).send(resData);
            }, function(resData) {
                return res.status(200).send(resData);
            });
    })
    .post(function(req, res) {
        var rawAccount = req.body;
        delete rawAccount.avatar;
        Account.create(rawAccount)
            .then(function(account) {
                return res.status(201).send(account);
            }, function(err) {
                return res.status(200).send(err);
            });
    });

router.route('/:accountId')
    .get(function(req, res) {
        Account.get({
            _id: req.accountId
        }).then(function(accounts) {
            return res.status(200).send(accounts[0]);
        }, function(err) {
            return res.status(200).send(err);
        });
    })
    .put(function(req, res) {
        var account = req.body || {};
        var id = account._id;
        delete account._id;
        delete account.avatar;

        Account.update(id, account)
            .then(function(item) {
                res.status(200).send(item);
            }, function(err) {
                res.status(200).send(err);
            });
    })
    .delete(function(req, res) {
        var id = req.accountId;
        Account.delete({
                _id: id
            })
            .then(function(account) {
                return res.status(200).send(account);
            }, function(err) {
                logger.info({data: err}, 'delete account err');
                return res.status(200).send(err);
            });
    });

router.route('/pages')
    .get(function(req, res) {

    });

module.exports = router;
