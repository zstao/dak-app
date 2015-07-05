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

    var HANDLED = 'handled';
    var UN_HANDLED = 'unhandled';
    var SHOWN = 'show', HIDEN = 'hide';

    var TAB__ACTIVE = TAB + ACTIVE;
    var TAB_NAV__ACTIVE = TAB_NAV + ACTIVE;

    var $tabNavsWrapper = $('.tab-navs');
    var $tabs = $(CLS + TAB);
    var $currentTabNav = $(CLS + TAB_NAV__ACTIVE);
    var $currentTab = $(CLS + TAB__ACTIVE);

    var $loaderIndicator = $('.loader-indicator');
    var $handlerViewerTypeSwitcher = $('.handler-viewer__type-switcher-holder');
    var $currentViewerSwitcher = $('.handler-viewer__type-switcher.active');

    var $emailTableBody = $('.email-rows');
    var $unHandledEmailTableBody = $('.handler-viewer__un-handled-table-body');
    var $handledEmailTableBody = $('.handler-viewer__handled-table-body');
    var isHandledTableDirty = true, isUnHandledTableDirty = true;

    var HANDL_TEXT = '分发';
    var SUCCEED = '成功', FAILED = '失败', INVALID = '不合法', NONE = '为空';
    var ERR_ASSESSOR_NONE = '处理人员' + NONE;

    var conf = {};

    var $compiledEmailTpl = _.template($('#tpl__email').html());
    var $viewerEmailTableHolder = $('.handler-viewer__email-table-holder');
    var $emptyIndicator = $($('#tpl__empty').html());

    var $emailViewerModal = $('#modal__email-viewer');

    var $emailTopic = $('.modal__email-topic');
    var $emailSender = $('.modal__email-sender');
    var $emailContent = $('.modal__email-content');
    var $emailSentAt = $('.modal__email-sent-at');

    var $emailTagsHolder = $('.email__tags-holder');
    var $emailAssessorSelector = $('#email__assessor-selector');

    var $modalConfirmBtn = $('.modal__confirm-btn');

    var $currentEmailTr;
    var currentEmail;

    var emailAssessors = [];

    var $emailHandlerEditorWrapper = $('.email__handler-editor-wrapper');
    var $emailCreatorWrapper = $('#email-creator-wrapper');
    var editor = new Editor('#email-editor');
    setTimeout(function(){
        $(window).resize();
    },20);
    window.editor = editor;





    function switchHandlerViewerType($switcher) {
        var index = $switcher.index();
        if (index !== $currentViewerSwitcher.index()) {
            $currentViewerSwitcher.removeClass('active');
            $currentViewerSwitcher = $switcher;
            $currentViewerSwitcher.addClass('active');
            if (index === 0 && isUnHandledTableDirty) {
                getEmails({}, UN_HANDLED)
                    .then(function(res) {
                        clearEmailTableBody(UN_HANDLED);
                        setEmailTableBody(UN_HANDLED,res.data);
                        isUnHandledTableDirty = false;
                    });
            } else if (isHandledTableDirty){
                getEmails({}, HANDLED)
                    .then(function(res) {
                        clearEmailTableBody(HANDLED);
                        setEmailTableBody(HANDLED,res.data);
                        isHandledTableDirty = false;
                    });
            } else {
	      setEmailTableBody(index === 0 ? UN_HANDLED : HANDLED);
	    }
        }
    }

    function clearEmailTableBody(tbdStatus) {
        var $tbd = tbdStatus === UN_HANDLED ? $unHandledEmailTableBody : $handledEmailTableBody;
        $tbd.empty();
    }
    function setEmailTableBody(tbdStatus,emails) {
        var $tbd = tbdStatus === UN_HANDLED ? $unHandledEmailTableBody : $handledEmailTableBody;
        var $_tbd = tbdStatus !== UN_HANDLED ? $unHandledEmailTableBody : $handledEmailTableBody;
        var emailRow, emailRows = [];
        $_tbd.fadeOut(100);
	$tbd.fadeIn(100);
	
        console.log(emails);
        if (emails != undefined) {
	  console.log(emails);
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
        } else {
	  if ($tbd.children().length > 0) {
	    $emptyIndicator.fadeOut(100);
	  } else {
	    $emptyIndicator.fadeIn(100);
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



    function getEmails(cond, status) {
        $emptyIndicator.detach();
        $loaderIndicator.fadeIn(200);
        return emailStore.getEmails(cond, status)
            .then(function(users) {
                $loaderIndicator.fadeOut(300);
                return users;
            });
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
            if (targetIndex === 1) {
                $emailCreatorWrapper.append($('.simditor'));
            }
        }
    });

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




    getEmails({}, UN_HANDLED)
        .then(function(res) {
            res = res.data;
            setEmailTableBody(UN_HANDLED,res);
            isUnHandledTableDirty = false;
        });

    // dispatcher type switcher
    $handlerViewerTypeSwitcher.on('click', '.handler-viewer__type-switcher', function(e) {
        var $switcher = $(e.target);
        switchHandlerViewerType($switcher);
    });


    //// get assessors
    userStore.getAssessors()
        .then(function(assessors) {
            console.log(assessors);
            assessors = assessors.data.assessorList;
            emailAssessors = emailAssessors.concat(assessors);
            var $option;
            emailAssessors.forEach(function(assessor){
                $option = $('<option>');
                $option.text(assessor.name);
                $option.val(assessor.id);
                $emailAssessorSelector.append($option);
            });
        });

    // 分发邮件
    $modalConfirmBtn.on('click', function() {
        var assessorId = $emailAssessorSelector.val();
        var err = assessorId === '-1' ? ERR_ASSESSOR_NONE : undefined;

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
                    console.log(email);
                }, function(err) {
                    Toast.show(DISPATCH_TEXT + FAILED);
                    console.log(err);
                });
        }
    });




    $modalConfirmBtn.on('click', function() {
        Toast.show('处理成功');
    });
});
