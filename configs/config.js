'use strict';
var _ = require('underscore');

exports.db = {
    connectionUrl: process.env.MONGODB_CONN ||
        'mongodb://localhost:27017/dak',
    options: {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    }
};

exports.auth = {
    secretToken: 'secretToken',
    expiresInMinutes: 600
};
exports.account = {
    root: {
        username: 'robot',
        password: '123456',
        role: 'root'
    },
    email: {
        address: '2247947203@qq.com',
        password: '12345678',
        type: 'EMAIL'
    }
};

exports.server = {
    address: '127.0.0.1',
    port: process.env.PORT || 6005
};

exports.session = {
    secret: 'session_store'
};

exports.app = {
    default: {
        LIMIT: 20,
        SKIP: 0
    }
};

exports.server.domain = 'http://' + exports.server.address + ':' + exports.server.port;
