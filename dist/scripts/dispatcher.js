'use strict';
requirejs.config({
    paths: {
        axios: '/bower_components/axios/dist/axios.amd',
        CONF: '/dist/scripts/config',
        userStore: '/dist/scripts/components/user-store',
        emailStore: '/dist/scripts/components/email-store',
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

requirejs(['CONF', '_', 'jquery', 'validator', 'userStore', 'emailStore', 'axios', 'bootstrap', 'toast'], function(CONF, _, $, validator, userStore, emailStore, axios, bootstrap, Toast) {
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

    var $loaderIndicator = $('.loader-indicator');

    var $emailTableBody = $('.email-rows');

    var SUCCEED = '成功', FAILED = '失败';

    var conf = {};


    var $compiledEmailTpl = _.template($('#tpl__email').html());

    var $emailViewerModal = $('#modal__email-viewer');

    var $emailTopic = $('.modal__email-topic');
    var $emailSender = $('.modal__email-sender');
    var $emailContent = $('.modal__email-content');

    var $emailTagsHolder = $('.email__tags-holder');
    var $emailTagInputForm = $('.email__tag-input-form');
    var $emailTagInput = $('#email__tag-input');
    var $emailTagInputConfirmBtn = $('#email__tag-input-confirm-btn');
    var $emailHandlerSelector = $('#email__handler-selector');

    var $modalCancelBtn = $('.modal__cancel-btn');
    var $modalConfirmBtn = $('.modal__confirm-btn');

    var $currentEmailTr;
    var currentEmail;
    var emailHandlers = [];



    function getEmails(cond) {
        $loaderIndicator.fadeIn(200);
        return emailStore.getEmails(cond)
            .then(function(users) {
                $loaderIndicator.fadeOut(300);
                return users;
            });
    }

    function fillPage(emails) {
        var emailRow, emailRows = [];
        emails = emails || [];
        console.log(emails);
        emails.forEach(function(email) {
            emailRow = $compiledEmailTpl(email);
            emailRows.push(emailRow)
            console.log(emailRow);
            $emailTableBody.append($(emailRow));
        });
    }
    function setCurrentEmail($dom, email) {
        $currentEmailTr = $dom;
        currentEmail = email;

        $emailTopic.html(email.topic);
        $emailSender.html(email.sender);
        $emailContent.html(email.content);
        $emailTagsHolder.empty();
        if (email.tags && email.tags.length > 0) {
            email.tags.forEach(function(tag){
                addEmailTag(tag);
            });
        }
    }
    function addEmailTag(tag) {
        var $tag = $('<div>');
        var $tagTxt = $('<span>');
        var $tagDel = $('<span>');

        $tag.addClass('email__tag label label-primary inline-block');
        $tagDel.addClass('email__tag-rm fa fa-times');

        $tag.attr('data-tag', tag);
        $tagTxt.text(tag);
        $tag.append($tagTxt);
        $tag.append($tagDel);
        $emailTagsHolder.append($tag);
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

    $emailTableBody.on('click', 'tr', function(e) {
        var $tr = $(e.currentTarget);
        $loaderIndicator.fadeIn(200);
        emailStore.getEmail($tr.data('id'))
            .then(function(email) {
                email = email.data;
                console.log(email);
                $emailViewerModal.modal();
                setCurrentEmail($tr, email);
                $loaderIndicator.fadeOut(200);
            }, function(err) {
                console.log(err);
            });
    });

    getEmails()
        .then(function(res) {
            fillPage(res.data);
        });

    // add email Tag
    $emailTagInputForm.on('submit', function(e) {
        e.preventDefault();
        var tag = $emailTagInput.val();
        console.log(tag);
        if (currentEmail.tags.indexOf(tag) === -1) {
            currentEmail.tags.push(tag);
            $emailTagInput.val('');
            addEmailTag(tag);
        }
    });
    // remove tag
    $emailTagsHolder.on('click', '.email__tag-rm', function(e) {
        var $rm = $(e.target);
        var $tag = $rm.parent();
        var tag = $tag.attr('data-tag');
        console.log($tag);
        console.log(tag);
        $tag.remove();

    });


    // get handlers
    userStore.getUsers({role: 'handler'})
        .then(function(handlers) {
            handlers = handlers.data.list;
            console.log(handlers);
            emailHandlers = emailHandlers.concat(handlers);
            var $option;
            emailHandlers.forEach(function(handler){
                $option = $('<option>');
                $option.text(handler.username);
                $option.val(handler.id || handler._id);
                $emailHandlerSelector.append($option);
            });
        });
    $modalConfirmBtn.on('click', function() {
        Toast.show('分发成功');
    });

});
