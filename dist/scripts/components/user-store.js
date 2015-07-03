'use strict';
define(['CONF', 'axios'], function(CONF, axios) {
    var userSotre = {};
    var API = CONF.API.root;
    console.log(API);

    userSotre.getUsers = function() {
        return axios.get(API.user);
    };

    return userSotre;
});
