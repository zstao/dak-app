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

    var DISPATCHED = 'dispatched';
    var UN_DISPATCHED = 'undispatched';
    var SHOWN = 'show', HIDEN = 'hide';

    var TAB__ACTIVE = TAB + ACTIVE;
    var TAB_NAV__ACTIVE = TAB_NAV + ACTIVE;

    var $tabNavsWrapper = $('.tab-navs');
    var $tabs = $(CLS + TAB);
    var $currentTabNav = $(CLS + TAB_NAV__ACTIVE);
    var $currentTab = $(CLS + TAB__ACTIVE);

    var $dispatcherViewerTypeSwitcher = $('.dispatcher-viewer__type-switcher-holder');
    var $currentViewerSwitcher = $('.dispatcher-viewer__type-switcher.active');

    var $loaderIndicator = $('.loader-indicator');

    var $emailTableBody = $('.email-rows');
    var $unDispatchedEmailTableBody = $('.dispatcher-viewer__un-dispatched-table-body');
    var $dispatchedEmailTableBody = $('.dispatcher-viewer__dispatched-table-body');
    var isDispatchedTableDirty = true, isUnDispatchedTableDirty = true;

    var DISPATCH_TEXT = '分发';
    var SUCCEED = '成功', FAILED = '失败', INVALID = '不合法', NONE = '为空';
    var ERR_HANDLER_NONE = '处理人员' + NONE;

    var conf = {};


    var $compiledEmailTpl = _.template($('#tpl__email').html());

    var $emailViewerModal = $('#modal__email-viewer');

    var $emailTopic = $('.modal__email-topic');
    var $emailSender = $('.modal__email-sender');
    var $emailSentAt = $('.modal__email-sent-at');
    var $emailContent = $('.modal__email-content');

    var $emailTagsHolder = $('.email__tags-holder');
    var $emailTagInputForm = $('.email__tag-input-form');
    var $emailTagInput = $('#email__tag-input');
    var $emailTagInputConfirmBtn = $('#email__tag-input-confirm-btn');
    var $emailHandlerSelector = $('#email__handler-selector');

    var $modalCancelBtn = $('.modal__cancel-btn');
    var $modalConfirmBtn = $('.modal__confirm-btn');

    var $viewerEmailTableHolder = $('.dispatcher-viewer__email-table-holder');
    var $emptyIndicator = $($('#tpl__empty').html());

    var $currentEmailTr;
    var currentEmail;
    var emailHandlers = [];



    function getEmails(cond, status) {
        $emptyIndicator.detach();
        $loaderIndicator.fadeIn(200);
        return emailStore.getEmails(cond, status)
            .then(function(users) {
                $loaderIndicator.fadeOut(300);
                return users;
            });
    }

    function switchDispatcherViewerType($switcher) {
        var index = $switcher.index();
        if (index !== $currentViewerSwitcher.index()) {
            $currentViewerSwitcher.removeClass('active');
            $currentViewerSwitcher = $switcher;
            $currentViewerSwitcher.addClass('active');
            if (index === 0 && isUnDispatchedTableDirty) {
                getEmails({}, UN_DISPATCHED)
                    .then(function(res) {
                        clearEmailTableBody(UN_DISPATCHED);
                        setEmailTableBody(UN_DISPATCHED, res.data);
                        isUnDispatchedTableDirty = false;
                    });
            } else if (isDispatchedTableDirty){
                getEmails({}, DISPATCHED)
                    .then(function(res) {
                        clearEmailTableBody(DISPATCHED);
                        setEmailTableBody(DISPATCHED, res.data);
                        isDispatchedTableDirty = false;
                    });
            } else {
                setEmailTableBody(index === 0 ? UN_DISPATCHED : DISPATCHED);
            }

        }
    }

    function clearEmailTableBody(tbdStatus) {
        var $tbd = tbdStatus === UN_DISPATCHED ? $unDispatchedEmailTableBody : $dispatchedEmailTableBody;
        $tbd.empty();
    }
    function setEmailTableBody(tbdStatus, emails) {
        var $tbd = tbdStatus === UN_DISPATCHED ? $unDispatchedEmailTableBody : $dispatchedEmailTableBody;
        var $_tbd = tbdStatus !== UN_DISPATCHED ? $unDispatchedEmailTableBody : $dispatchedEmailTableBody;
        var emailRow, emailRows = [];
        $_tbd.fadeOut(100);
        $tbd.fadeIn(100);
        console.log(emails);
        if (emails != undefined) {
            if (emails.count > 0) {
                emails = emails.mailList;
                emails.forEach(function(email) {
                    emailRow = $compiledEmailTpl(email);
                    emailRows.push(emailRow);
                    $tbd.append($(emailRow));
                });
            } else {
                $emptyIndicator.fadeIn(500);
                $viewerEmailTableHolder.append($emptyIndicator);
            }
        }
    }

    function setCurrentEmail($dom, email) {
        email.tags = email.tags ? email.tags.split('|') : [];
        $currentEmailTr = $dom;
        currentEmail = email;

        $emailTopic.html(email.subject);
        $emailSender.html(email.fromAddress);
        $emailContent.html(email.body);
        $emailSentAt.html(email.receiveDate);
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

    // view/dispatch a email
    $emailTableBody.on('click', 'tr', function(e) {
        var $tr = $(e.currentTarget);
        $loaderIndicator.fadeIn(200);
        emailStore.getEmail({id: $tr.data('id')})
            .then(function(email) {
                email = email.data;
                console.log(email);
                $emailViewerModal.modal(SHOWN);
                setCurrentEmail($tr, email);
                $loaderIndicator.fadeOut(200);
            }, function(err) {
                console.log(err);
            });
    });

    getEmails({}, UN_DISPATCHED)
        .then(function(res) {
            res = res.data;
            setEmailTableBody(UN_DISPATCHED, res);
            isUnDispatchedTableDirty = false;
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
        var tagIndex = currentEmail.tags.indexOf(tag);
        currentEmail.tags.splice(tagIndex, 1);
        console.log($tag);
        console.log(tag);
        $tag.remove();
    });

    // dispatcher type switcher
    $dispatcherViewerTypeSwitcher.on('click', '.dispatcher-viewer__type-switcher', function(e) {
        var $switcher = $(e.target);
        switchDispatcherViewerType($switcher);
    });


    // get handlers
    userStore.getHandlers()
        .then(function(handlers) {
            console.log(handlers);
            handlers = handlers.data;
            emailHandlers = emailHandlers.concat(handlers);
            var $option;
            emailHandlers.forEach(function(handler){
                $option = $('<option>');
                $option.text(handler.handler_name);
                $option.val(handler.handler_id);
                $emailHandlerSelector.append($option);
            });
        });

    // 分发邮件
    $modalConfirmBtn.on('click', function() {
        var handlerId = $emailHandlerSelector.val();
        var err = handlerId === '-1' ? ERR_HANDLER_NONE : undefined;

        if (err) {
            Toast.show(err);
        } else {
            currentEmail.handler_id = handlerId;
            currentEmail.isDispatched = '1';
            currentEmail.tags = typeof currentEmail.tags === 'string' ? currentEmail.tags : currentEmail.tags.join('|');
            console.log(currentEmail);
            emailStore.updateEmail(currentEmail)
                .then(function(email) {
                    Toast.show(DISPATCH_TEXT + SUCCEED);
                    $emailViewerModal.modal(HIDEN);
                    $currentEmailTr.remove();
                    isDispatchedTableDirty = true;
                    console.log(email);
                }, function(err) {
                    Toast.show(DISPATCH_TEXT + FAILED);
                    console.log(err);
                });
        }
    });
});
