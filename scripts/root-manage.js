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
        validator: '/bower_components/validator-js/validator.min',
        utils: '/dist/scripts/utils/utils'
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        }
    }
});

requirejs(['CONF', '_', 'jquery', 'utils', 'validator', 'userStore', 'axios', 'bootstrap', 'toast'], function(CONF, _, $, Utils, validator, userStore, axios, bootstrap, Toast) {
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
    var $emailIMAPAddr = $('#email__imap-address');
    var $emailPwd = $('#email__password');
    var $emailPwdConfirmation = $('#email__password-confirmation');

    var $userCreationFrom = $('.form__user-creation');
    var $username = $('#user-creation__username');
    var $userPwd = $('#user-creation__password');
    var $userPwdConfirmation = $('#user-creation__password-confirmation');
    var $userType = $('#user-creation__type');

    var $userViewerTypeSwitcherHolder = $('.user-viewer__type-switcher-holder');
    var $userViewerTypeSwitchers = $userViewerTypeSwitcherHolder.children();
    var $userViewer = $('.user-viewer');
    var $userViewerLists = $('.user-viewer__list');
    var $userViewerHolder = $('.user-viewer__holder');
    var $loaderIndicator = $('.loader-indicator');
    var $currentUserType = $('.user-viewer__type-switcher.active');
    var $currentUsersList = $('.user-viewer__list.active');

    var ERR_EMAIL_INVALID = '邮箱非法';
    var ERR_EMAIL_IMAP_INVALID = 'IMAP地址有误';
    var ERR_PWD_INVALID = '密码有误';
    var ERR_PWD_NOT_SAME = '确认密码不一致';
    var ERR_USERNAME_INVALID = '用户名有误';
    var ERR_USER_TYPE_NONE = '请选择用户类型';
    var EMAIL_CONF = '邮箱配置';
    var SUCCEED = '成功', FAILED = '失败';

    var conf = {};

    // tpls
    var paginationTpl = $('#tpl__pagination').html();
    var $emptyIndicator = $('#tpl__empty').html();
    var compiledPaginationTpl = _.template(paginationTpl);



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
        var $avatar = $('<img>');
        var $userMetas = $('<div>');
        var $username = $('<h4>');
        var $createdAt = $('<span>');

        $user.addClass('user');

        $userMetas.addClass('user-metas');

        $avatar.addClass('img-circle user__avatar');
        $avatar.attr('src', user.avatar || '/statics/images/default-avatar.png');

        $username.addClass('user-metas__name');
        $username.text('用户名：' + user.username);

        $createdAt.addClass('user-metas__created-at');
        $createdAt.text('创建于: ' + (new Date(+user.created_at)).toLocaleDateString());

        $userMetas.append($username);
        $userMetas.append($createdAt);

        $user.append($avatar);
        $user.append($userMetas);

        return $user;
    }
    function addUsersToList(users, $list) {
        var $user, len;
        users = users || [];
        len = users.length;
        $list = $list || $currentUsersList;
        console.log(users);
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                $user = createUserDom(users[i]);
                $list.append($user);
            }
        } else {
            $list.append($emptyIndicator);
        }
    }
    function switchUserViewer(index) {
        $currentUserType.removeClass('active');
        $currentUsersList.removeClass('active');
        $currentUserType = $userViewerTypeSwitchers.eq(index);
        $currentUsersList = $userViewerLists.eq(index);
        $currentUserType.addClass('active');
        $currentUsersList.addClass('active');

        if ($currentUsersList.children().length === 0) {
            getUsers({role: $currentUserType.data('type')})
                .then(function(data) {
                    addUsersToList(data.data ,$currentUsersList);
                }, function(err){
                    console.log(err);
                });
        }
    }

    function getEmailConf() {
        return axios.get(Utils.appendQueries(CONF.API.conf.email, {uid: window.sessionStorage.getItem('user_id')}));
    }
    function getUsers(cond) {
        $loaderIndicator.fadeIn(200);
        return userStore.getUsers(cond)
            .then(function(users) {
                $loaderIndicator.fadeOut(300);
                return users;
            });
    }


    // tab switcher
    $tabNavsWrapper.on('click', '.tab-navs__item', function(e) {
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
            email_address: $emailAddr.val(),
            imap_address: $emailIMAPAddr.val(),
            password: $emailPwd.val(),
            passwordConfirmation: $emailPwdConfirmation.val()
        };
        var err = !validator.isEmail(credit.email_address) ? ERR_PWD_NOT_SAME : undefined;
        err = err || (!credit.imap_addressERR_PWD_INVALID ? ERR_EMAIL_IMAP_INVALID : undefined);
        err = err || (!credit.password || credit.password.length < 6 ? ERR_PWD_INVALID : undefined);
        err = err || (credit.password !== credit.passwordConfirmation ? ERR_PWD_NOT_SAME : undefined);

        if (err) {
            setFormError($emailForm, err);
        } else {
            axios.put(CONF.API.conf.email, _.merge({}, conf.email, credit))
                .then(function(res) {
                    res = res.data;
                    if (res) {
                        conf.email = _.merge({}, conf.email, res);
                        Toast.show(EMAIL_CONF + SUCCEED);
                    }
                }, function(error) {
                    Toast.show(EMAIL_CONF + FAILED);
                });
        }
    });
    [$emailForm, $userCreationFrom].forEach(function($f) {
        $f.on('input', function(e){
            clearFormError($f);
        });
    });


    // user creation;
    $userCreationFrom.on('submit', function(e) {
        e.preventDefault();
        var account = {
            name: $username.val(),
            password: $userPwd.val(),
            passwordConfirmation: $userPwdConfirmation.val(),
            role: $userType.val()
        };

        var err = !account.name || account.name.length < 4 ? ERR_USERNAME_INVALID : undefined;
        err = err || (!account.password || account.password.length < 4 ? ERR_PWD_INVALID : undefined);
        err = err || (account.password !== account.passwordConfirmation ? ERR_PWD_NOT_SAME : undefined);
        err = err || (!account.role ? ERR_USER_TYPE_NONE : undefined);
        if (err) {
            setFormError($userCreationFrom, err);
        } else {
            userStore.create(account)
                .then(function(res) {
                    res = res.data;
                    if (res && res.message) {
                        setFormError($userCreationFrom, res.message);
                    } else {
                        Toast.show('成功创建用户');
                    }
                }, function(error) {
                });
        }
    });

    // user viewer type switcher
    $userViewer.on('click', '.user-viewer__type-switcher', function(e) {
        var $type = $(e.target);
        var index = $type.index();
        if (index !== $currentUserType.index()) {
            switchUserViewer(index)
        }
    });
    // user viewer list pagination
    $userViewer.on('click', '', function(e) {
        e.preventDefault();
    });


    // init show email conf
    getEmailConf()
        .then(function(email) {
            email = email.data;
            console.log(email);
            if (email && email.email_address) {
                conf.email = email;
                $emailAddr.val(email.email_address);
                $emailIMAPAddr.val(email.imap_address);
                $emailPwd.val(email.password);
            }
        });
    getUsers({role: 'dispatcher'})
        .then(function(res) {
            addUsersToList(res.data);
        });

});
