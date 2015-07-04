'use strict';
define(['CONF', 'axios', '_', 'utils'], function(CONF, axios, _, Utils) {
    var emailStore = {};
    var API = CONF.API.email;

    emailStore.getEmails = function(cond) {
        return axios.get(Utils.appendQueries(API.root, cond));
    };
    emailStore.getEmail  = function(id) {
        return axios.get(API.root + '/' + id);
    };
    emailStore.getPageCount = function(cond) {
        return axios.get(Utils.appendQueries(API.pageCount, cond));
    };
    return emailStore;
});
