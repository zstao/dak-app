'use strict';
define(['CONF', 'axios', '_', 'utils'], function(CONF, axios, _, Utils) {
    var userStore = {};
    var API = CONF.API.user;

    userStore.getUsers = function(cond) {
        return axios.get(Utils.appendQueries(API.root, cond));
    };
    userStore.create = function(account) {
         return axios.post(API.root, account);
    };

    userStore.getPageCount = function(cond) {
        return axios.get(Utils.appendQueries(API.pageCount, cond));
    };
    return userStore;
});
