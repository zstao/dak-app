'use strict';
define(function() {
    var CONF = {};
    var API = CONF.API = {};
    var root = API.root = {};
    var email = API.email = {};
    var user = API.user = {};

    var API_ROOT = 'http://localhost:3000';

    root.root = API_ROOT;
    root.user = root.root + '/users';

    email.root = API_ROOT + '/email';

    user.root = API_ROOT + '/users';
    return CONF;
});
