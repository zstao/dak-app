'use strict';
module.exports = function() {
    var users = [];
    var sessions = [];
    var email;
    var count = 5;
    while (count--) {
        users.push({
            id: count,
            username: 'jl' + count,
            password: '123456' + count,
            avatar: '/statics/images/default-avatar.png'
        });
        sessions.push({
            id: count,
            username: 'session' + count,
            password: '123456' + count,
            to: 'hi'
        });
    }

    email = {
        id: '1',
        address: '22@dd.com',
        password: 'pwd',
        passwordConfirmation: 'pwd'
    };
    return {
        users: users,
        sessions: sessions,
        email: email
    };
};
