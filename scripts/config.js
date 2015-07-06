'use strict';
define(function() {
    var CONF = {};
    var API = CONF.API = {};

    var conf = API.conf = {};
    var user = API.user = {};
    var email = API.email = {};
    var common = API.common = {};

    var DISPATCHER = '/dispatcher';
    var HANDLER = '/handler';
    var COMMOM = '/common';

    var API_ROOT = 'http://192.168.15.44:8001';
    var MOCK_ROOT = 'http://localhost:3000';
    API_ROOT = 'http://192.168.0.144:8001';
    API_ROOT = 'http://www.sify21.com:8001';

    conf.root = API_ROOT + '/admin';
    conf.email = conf.root + '/getEmailConf';

    user.root = API_ROOT + '/admin';
    user.getUsers = user.root + '/getUsers';
    user.addUser = user.root + '/addUser';
    user.pageCount = user.root + '/pages';
    user.getHandlers = API_ROOT + DISPATCHER + '/getHandlerList';




    email.root = API_ROOT + DISPATCHER;
    email.undispatched = email.root + '/getUnDispatched';
    email.dispatched = email.root + '/getDispatched';
    email.unhandled = API_ROOT + HANDLER + '/getUnHandled';
    email.handled = API_ROOT + HANDLER + '/getHandled';
    email.getEmail = email.root + '/getEmail';
    email.updateEmail = API_ROOT + COMMOM + '/updateReceiveMail';


    return CONF;
});
