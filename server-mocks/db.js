'use strict';
module.exports = function() {
    var users = [];
    var userCount = 20;
    while (userCount--) {
        users.push({
            id: userCount,
            username: 'jl' + userCount,
            password: '123456' + userCount
        });
    }
    return {
        users: users
    };
};
