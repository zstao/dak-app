'use strict';
define(function() {
    var CONF = {};
    var API = CONF.API = {};

    var conf = API.conf = {};
    var user = API.user = {};
    var email = API.email = {};

    var API_ROOT = 'http://localhost:6005';
    var MOCK_ROOT = 'http://localhost:3000';

    conf.root = API_ROOT + '/configs';
    conf.email = conf.root + '?type=EMAIL';

    user.root = API_ROOT + '/accounts';
    user.pageCount = user.root + '/pages';

    email.root = MOCK_ROOT + '/emails';
    return CONF;
});
