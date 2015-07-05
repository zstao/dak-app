'use strict';
define(['CONF', 'axios', '_', 'utils'], function(CONF, axios, _, Utils) {
    var userStore = {};
    var API = CONF.API.user;
    var UID = window.sessionStorage.getItem('user_id');

    userStore.getUsers = function(cond) {
        cond = cond || {};
        cond.uid = UID;
        return axios.get(Utils.appendQueries(API.getUsers, cond));
    };
    userStore.getHandlers = function(cond) {
        cond = cond || {};
        cond.uid = UID;
        return axios.get(Utils.appendQueries(API.getHandlers, cond));
    };
    userStore.getAssessors = function(cond) {
        cond = cond || {};
        cond.uid = UID;
        return axios.get(Utils.appendQueries(API.getAssessors, cond));
    };
    userStore.create = function(account) {
        var cond = {};
        cond.uid = UID;
         return axios.post(Utils.appendQueries(API.addUser, cond), account);
    };

    userStore.getPageCount = function(cond) {
        cond = cond || {};
        cond.uid = UID;
        return axios.get(Utils.appendQueries(API.pageCount, cond));
    };
    return userStore;
});
