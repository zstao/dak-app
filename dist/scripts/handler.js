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
        utils: '/dist/scripts/utils/utils',
        simditor: '/statics/libs/simditor/dist/simditor',
        simditorModule: '/statics/libs/simditor/dist/module',
        simditorHotkeys: '/statics/libs/simditor/dist/hotkeys',
        simditorUploader: '/statics/libs/simditor/dist/uploader',
        editor: '/dist/scripts/components/editor'
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        }
    }
});

requirejs(['CONF', '_', 'jquery', 'validator', 'userStore', 'emailStore', 'axios', 'bootstrap', 'toast', 'editor'], function(CONF, _, $, validator, userStore, emailStore, axios, bootstrap, Toast, Editor) {
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

    var $modalConfirmBtn = $('.modal__confirm-btn');

    var $currentEmailTr;
    var currentEmail;

    var $emailHandlerEditorWrapper = $('.email__handler-editor-wrapper');
    var $emailCreatorWrapper = $('#email-creator-wrapper');
    var editor = new Editor('#email-editor');
    setTimeout(function(){
        $(window).resize();
    },20);
    window.editor = editor;

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

        $tag.addClass('email__tag label label-primary inline-block');

        $tag.attr('data-tag', tag);
        $tagTxt.text(tag);
        $tag.append($tagTxt);
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
            if (targetIndex === 1) {
                $emailCreatorWrapper.append($('.simditor'));
            }
        }
    });

    $emailTableBody.on('click', 'tr', function(e) {
        var $tr = $(e.currentTarget);
        $loaderIndicator.fadeIn(200);
        emailStore.getEmail($tr.data('id'))
            .then(function(email) {
                email = email.data;
                setCurrentEmail($tr, email);
                $emailViewerModal.modal();
                $emailHandlerEditorWrapper.append($('.simditor'));
                $loaderIndicator.fadeOut(200);
            }, function(err) {
                console.log(err);
            });
    });

    getEmails()
        .then(function(res) {
            fillPage(res.data);
        });

    $modalConfirmBtn.on('click', function() {
        Toast.show('处理成功');
    });
});
