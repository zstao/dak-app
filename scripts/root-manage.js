'use strict';
requirejs.config({
    paths: {
        axios: '/bower_components/axios/dist/axios.amd',
        CONF: '/dist/scripts/config',
        userStore: '/dist/scripts/components/user-store',
        jquery: '/bower_components/jquery/dist/jquery.min',
        zepto: '/bower_components/zepto/zepto.min',
        bootstrap: '/bower_components/bootstrap/dist/js/bootstrap.min',
        toast: '/dist/scripts/components/toast',
        _: '/bower_components/lodash/lodash.min',
        validator: '/bower_components/validator-js/validator.min'
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        }
    }
});

requirejs(['CONF', '_', 'jquery', 'validator', 'userStore', 'axios', 'bootstrap', 'toast'], function(CONF, _, $, validator, userStore, axios, bootstrap, Toast) {
    var CLS = '.';
    var ACTIVE = '--active';

    var TAB_NAV = 'tab-navs__item';
    var TAB = 'main-body__tab';

    var TAB__ACTIVE = TAB + ACTIVE;
    var TAB_NAV__ACTIVE = TAB_NAV + ACTIVE;

    var $tabNavsWrapper = $('.tab-navs');
    var $tabs = $(CLS + TAB);
    var $currentTabNav = $(CLS + TAB_NAV__ACTIVE);
    var $currentTab = $(CLS + TAB__ACTIVE);

    var $emailForm = $('.form__mail-conf');
    var $emailAddr = $('#email__address');
    var $emailPwd = $('#email__password');
    var $emailPwdConfirmation = $('#email__password-confirmation');

    var $userCreationFrom = $('.form__user-creation');
    var $username = $('#user-creation__username');
    var $userPwd = $('#user-creation__password');
    var $userPwdConfirmation = $('#user-creation__password-confirmation');
    var $userType = $('#user-creation__type');

    var $userViewerTypeSwitcher = $('.user-viewer__type-switcher');
    var $userViewerHolder = $('.user-viewer__holder');
    var $loaderIndicator = $('.loader-indicator');
    var $currentUserType = $('.user-viewer__type.active');
    var $currentUsersList = $('.user-viewer__list.active');

    var ERR_EMAIL_INVALID = '邮箱非法';
    var ERR_PWD_INVALID = '密码有误';
    var ERR_PWD_NOT_SAME = '确认密码不一致';
    var ERR_USERNAME_INVALID = '用户名有误';
    var ERR_USER_TYPE_NONE = '请选择用户类型';

    function setFormError($form, msg) {
        var $el = $form.find('.form__error').eq(0);
        $el.html(msg);
        $el.show();
    }
    function clearFormError($form) {
        var $el = $form.find('.form__error').eq(0);
        $el.hide();
    }

    function createUserDom(user) {
        var $user = $('<div>');
        $user.addClass('user');
        $user.append($('<span>').text(user.username));
        return $user;
    }
    function createUserList(users) {
        var $user;
        console.log(users);
        for (var i = 0, len = users.length; i < len; i++) {
            $user = createUserDom(users[i]);
            $userViewerList.append($user);
        }
    }

    function getEmailConf() {
        return axios.get(CONF.API.email.root);
    }

    // tab switcher
    $tabNavsWrapper.on('click', function(e) {
        e.preventDefault();
        var $target = $(e.target);
        var targetIndex;
        if (!$target.is(CLS + TAB_NAV__ACTIVE)) {
            $target.addClass(TAB_NAV__ACTIVE);
            if ($currentTabNav.length > 0) $currentTabNav.removeClass(TAB_NAV__ACTIVE);
            if ($currentTab.length > 0) $currentTab.removeClass(TAB__ACTIVE);
            $currentTabNav = $target;
            targetIndex = $target.index();
            $currentTab = $tabs.eq($target.index());
            $currentTab.addClass(TAB__ACTIVE);
        }
    });

    $emailForm.on('submit', function(e) {
        e.preventDefault();
        var credit = {
            address: $emailAddr.val(),
            password: $emailPwd.val(),
            passwordConfirmation: $emailPwdConfirmation.val()
        };
        var err = !validator.isEmail(credit.address) ? ERR_PWD_NOT_SAME : undefined;
        err = err || (!credit.password || credit.password.length < 6 ? ERR_PWD_INVALID : undefined);
        err = err || (credit.password !== credit.passwordConfirmation ? ERR_PWD_NOT_SAME : undefined);

        if (err) {
            setFormError($emailForm, err);
        } else {
            credit.id = '1';
            axios.put(CONF.API.email.root, credit)
                .then(function(res) {
                    console.log(res);
                }, function(error) {
                    console.log(error);

                });
        }
    });
    $emailForm.on('input', function(e){
        clearFormError($emailForm);
    });


    // user creation;
    $userCreationFrom.on('submit', function(e) {
        e.preventDefault();
        var account = {
            username: $username.val(),
            password: $userPwd.val(),
            passwordConfirmation: $userPwdConfirmation.val(),
            type: $userType.val()
        };

        var err = !account.username || account.username.length < 4 ? ERR_USERNAME_INVALID : undefined;
        err = err || (!account.password || account.password.length < 4 ? ERR_PWD_INVALID : undefined);
        err = err || (account.password !== account.passwordConfirmation ? ERR_PWD_NOT_SAME : undefined);
        err = err || (!account.type ? ERR_USER_TYPE_NONE : undefined);
        if (err) {
            setFormError($userCreationFrom, err);
        } else {
            userStore.create(account)
                .then(function(ur) {
                    Toast.show('成功创建用户');
                }, function(error) {

                });
        }
        console.log(account);
    });

    $userViewerTypeSwitcher.on('click', '.user-viewer__type', function(e) {
        var $type = $(e.target);
        console.log($currentUserType);
        console.log($currentUsersList);
        console.log($type);
    });


    // init show email conf
    getEmailConf()
        .then(function(email) {
            email = email.data;
            if (email && email.address) {
                $emailAddr.val(email.address);
            }
        });

    userStore.getUsers()
        .then(function(users) {
            $loaderIndicator.fadeOut(500, function(){
                createUserList(users.data);
            });
        }, function(err) {
            console.log(err);
        });

});
