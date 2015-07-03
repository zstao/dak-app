'use strict';
define(['CONF', 'axios'], function(CONF, axios) {
    var userSotre = {};
    var API = CONF.API.user;
    console.log(API);

    userSotre.getUsers = function() {
        return axios.get(API.root);
    };
    userSotre.create = function(account) {
         return axios.post(API.root, account);
    };
    return userSotre;
});
