define(['jquery', 'simditor', 'simditorModule', 'simditorHotkeys', 'simditorUploader'], function($, simditor, simditorModule, simditorHotkeys, simditorUploader) {

    function Editor(selector) {
        return new Simditor({
            textarea: selector
        })
    }
    return Editor;
});
