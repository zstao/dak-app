var Account = require('../models/account');
var ModelInterface = require('./model-interface');
var _ = require('lodash');
var Q = require('q');
var ERROR = require('../configs/errors');

var conf = {};
// 实例化接口对象
var accountApi = new ModelInterface(Account, conf);

accountApi.login = function(account) {
    var error = {};
    var defer = Q.defer();
    account = account || {};
    this.model.findOne({
        username: account.username
    }).exec(function(err, user){
            if (!user) {
                error.msg = ERROR.ACCOUNT_NOT_EXISTS;
                return defer.reject(error);
            }
            user.comparePassword(account.password, function(err, isMatch) {
                error.msg = err ? ERROR.TERMINAL_ERROR : undefined;
                error.msg = error.msg || (!isMatch ? ERROR.ACCOUNT_NOT_MATCH : undefined);
                if (error.msg) {
                    return defer.reject(error);
                } else {
                    return defer.resolve(user);
                }
            });
    });
    return defer.promise;
};
module.exports = accountApi;


