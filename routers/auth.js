'use strict';

var config = require('../configs/config');
var jwt = require('jsonwebtoken');
var ejwt = require('express-jwt');
var router = require('express').Router();
var Account = require('../apis/account');
var logger = require('../utils/logger');

// login
router.route('/')
    .post(function(req, res) {
        Account.login(req.body)
            .then(function(user) {
                // sign a jwt token.
                var token = jwt.sign({
                    uid: user.id,
                    username: user.username,
                    role: user.role
                }, config.auth.secretToken, {
                    expiresInMinutes: config.auth.expiresInMinutes
                });
                req.session.user = user;
                logger.info({data: user}, 'Login');
                return res.status(201).send({
                    token: token,
                    uid: user.id,
                    role: user.role,
                    to: (user.role === 'root' ? 'root-manage' : (user.role === 'handler' ? 'handler' : (user.role === 'dispatcher' ? 'dispatcher' : 'assessor'))) + '.html'
                });
            }, function(err) {
                return res.status(200).send(err);
            });
    });

// logout
router.route('/logout')
    .get(function(req, res) {
        req.session.destroy();
        return res.render('admin/login');
    });
module.exports = router;
