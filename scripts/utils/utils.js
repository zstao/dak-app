'use strict';
define(['CONF', '_'], function(CONF, _) {
    var utils = {};
    utils.appendQueries = function(url, query) {
        var pairs = [];
        var fields = _.keys(query);
        var hasQuery = url.indexOf('?') !== -1 && fields.length > 0;
        var pre1 = /\?$/.test(url);
        var pre2 = /&$/.test(url);
        fields.forEach(function(item) {
            pairs.push(encodeURIComponent(item) + '=' + encodeURIComponent(query[item]));
        });

        var prefix = (pre1 || pre2 || fields.length === 0) ? '' : (hasQuery ? '&' : '?');
        pairs = pairs.join('&');
        return url.concat(prefix).concat(pairs);
    };


    window.utils = utils;
    return utils;
});
