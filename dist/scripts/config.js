'use strict';
define(function() {
    var CONF = {};
    var API = CONF.API = {};
    var root = API.root = {};

    var API_ROOT = 'http://localhost:3000';

    root.root = API_ROOT;
    root.user = root.root + '/users';

    return CONF;
});
