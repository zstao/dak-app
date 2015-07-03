define(['jquery'], function($) {
    var Toast = {};
    var $dom = $('<div>');
    $dom.addClass('toast alert alert-info');
    $dom.css({
        position: 'fixed',
        width: '60%',
        top: '0',
        left: '20%',
        'z-index': '100',
        display: 'none'
    });
    $('body').append($dom);
    Toast.show = function(msg) {
        $dom.html(msg);
        $dom.fadeIn(300);
        setTimeout(function(){
            $dom.fadeOut(300);
        }, 1600);
    };
    return Toast;
});
