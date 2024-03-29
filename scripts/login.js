'use strict';
(function() {
    var $ = document.querySelector.bind(document);

    var loginForm = $('.login-form');
    var usernameEl = $('.username');
    var passwordEl = $('.password');
    var loginErrorEl = $('.login-error');
    var loginBtn = $('.login-btn');

    var LOGIN_URL = 'http://192.168.15.44:8001/auth/login';
    LOGIN_URL = '/api/auth/login';
    LOGIN_URL = 'http://www.sify21.com:8001/auth/login';
    var UN_PATTERN = /^\w[-\w]{2,20}$/;
    var PW_PATTERN = /^\w[-\w]{4,20}$/;

    var toPage = {
        'admin': 'root-manage.html',
        'dispatcher': 'dispatcher.html',
        'handler': 'handler.html'
    };

    /////// login error handler
    function clearLoginError() {
        loginErrorEl.style.display = 'none';
        if (isRawAccountValid()) {
            loginBtn.removeAttribute('disabled');
        } else {
            loginBtn.setAttribute('disabled', 'disabled');
        }
    }

    function setLoginError(msg) {
        loginErrorEl.innerHTML = msg;
        loginErrorEl.style.display = 'block';
    }
    usernameEl.addEventListener('input', clearLoginError);
    passwordEl.addEventListener('input', clearLoginError);

    function isRawAccountValid() {
        return UN_PATTERN.test(usernameEl.value) && PW_PATTERN.test(
                passwordEl.value);
    }

    function getRawAccount() {
        return isRawAccountValid() ? {
            username: usernameEl.value,
            password: passwordEl.value
        } : null;
    }

    function login(account) {
        return axios.post(LOGIN_URL, account);
    }

    /**
     * On login succeed, store authed credits to sessionStorage
     * @param  {object} credits credits authed by server vai #login()
     */
    function storeCredits(credits) {
        var keys = Object.keys(credits);
        keys.forEach(function(key) {
            window.sessionStorage.setItem(key, credits[key]);
        });
    }

    function clearSessionStorage() {
        window.sessionStorage.clear();
    }

    // validate raw account, perform #login action, handler feedback.
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var rawAccount = getRawAccount();
        rawAccount.to = '/views/root-manage.html';
        var credits;

        var fake = {
            zhengjianglong: 'dispatcher.html',
            pioneers: 'root-manage.html',
            liupeng: 'handler.html'
        };


        login(rawAccount)
            .then(function(res) {
                res = res.data || {};
                console.log(res);
                var to = toPage[res.user_role];
                if (!to) {
                    clearSessionStorage();
                    setLoginError(res.message || '');
                } else {
                    storeCredits(res);
                    window.location.href = to;
                }
            }, function(err) {
                console.log(err);
                window.location.href
            });
    });

})();
