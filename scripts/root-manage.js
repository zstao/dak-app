'use strict';
requirejs.config({
    paths: {
        axios: '/bower_components/axios/dist/axios.amd',
        CONF: '/dist/scripts/config',
        userStore: '/dist/scripts/components/user-store'
    }
});

requirejs(['userStore'], function(userStore) {
    console.log(userStore);
    var CLS = '.';
    var ACTIVE = '--active';

    var TAB_NAV = 'tab-navs__item';
    var TAB = 'main-body__tab';

    var TAB__ACTIVE = TAB + ACTIVE;
    var TAB_NAV__ACTIVE = TAB_NAV + ACTIVE;

    var $ = document.querySelector.bind(document);
    var $$ = document.querySelectorAll.bind(document);
    var indexOf = Array.prototype.indexOf;

    var tabNavsWrapper = $('.tab-navs');
    var tabs = $$(CLS + TAB);
    var currentTabNav = $(CLS + TAB_NAV__ACTIVE);
    var currentTab = $(CLS + TAB__ACTIVE);
    var emailForm = $('.form__mail-conf');
    var userViewerList = $('.user-viewer__list');


    function createUserDom(user) {
        var item = document.createElement('div');
        item.innerText = user.username;
        return item;
    }

    tabNavsWrapper.addEventListener('click', function(e) {
        e.preventDefault();
        var target = e.target;
        var targetIndex;
        if (!target.classList.contains(TAB_NAV__ACTIVE)) {
            target.classList.add(TAB_NAV__ACTIVE);
            if (currentTabNav) currentTabNav.classList.remove(TAB_NAV__ACTIVE);
            if (currentTab) currentTab.classList.remove(TAB__ACTIVE);
            currentTabNav = target;
            targetIndex = indexOf.call(tabNavsWrapper.children, target);
            currentTab = tabs[targetIndex];
            currentTab.classList.add(TAB__ACTIVE);

            if (targetIndex === 2) {
                userStore.getUsers()
                    .then(function(users) {
                        console.log(users);
                    }, function(err) {
                        console.log(err);
                    });
            }
        }
    });
});
