'use strict';
define(['CONF', 'axios', '_', 'utils'], function(CONF, axios, _, Utils) {
    var emailStore = {};
    var API = CONF.API.email;
    var UID = window.sessionStorage.getItem('user_id');

    var urls = {
        undispatched: API.undispatched,
        dispatched: API.dispatched,
        handled: API.handled,
        unhandled: API.unhandled
    };

    emailStore.getEmails = function(cond, status) {
        cond = cond || {};
        cond.uid = UID;
        return axios.get(Utils.appendQueries(urls[status], cond));
    };
    emailStore.getUnDispatchedEmails = function(cond) {
        cond = cond || {};
        cond.uid = UID;
        return axios.get(Utils.appendQueries(API.undispatched, cond));
    };
    emailStore.getEmail  = function(cond) {
        cond = cond || {};
        cond.uid = UID;
        return axios.get(Utils.appendQueries(API.getEmail, cond));
    };
    emailStore.getPageCount = function(cond) {
        cond = cond || {};
        cond.uid = UID;
        return axios.get(Utils.appendQueries(API.pageCount, cond));
    };
    emailStore.updateEmail = function(data) {
        var cond = {};
        cond.uid = UID;
        return axios.put(Utils.appendQueries(API.updateEmail, cond), data);
    };
    return emailStore;
});
