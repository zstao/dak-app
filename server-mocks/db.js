'use strict';
module.exports = function() {
    var users = [];
    var sessions = [];
    var emails = [];
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
        emails.push({
            id: count,
            sender: 'zhengjianglong' + count,
            content: (new Array(100)).join('邮件内容'),
            topic: 'topic + ' + count,
            data: new Date(),
            status: 'undispatched',
            tags: ['hello']
        });
    }

    return {
        users: users,
        sessions: sessions,
        emails: emails
    };
};
