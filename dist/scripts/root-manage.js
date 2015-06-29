'use strict';
(function() {
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


    tabNavsWrapper.addEventListener('click', function(e) {
        var target = e.target;
        var targetIndex;
        if (!target.classList.contains(TAB_NAV__ACTIVE)) {
            target.classList.add(TAB_NAV__ACTIVE);
            if (currentTabNav) currentTabNav.classList.remove(TAB_NAV__ACTIVE);
            if (currentTab) currentTab.classList.remove(TAB__ACTIVE);
            currentTabNav = target;
            currentTab = tabs[indexOf.call(tabNavsWrapper.children, target)];
            currentTab.classList.add(TAB__ACTIVE);
        }
        e.preventDefault();
    });

})();
