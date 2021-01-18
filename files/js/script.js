/*global apex,CKEDITOR,FOS,$*/

/**
 * Converts a Textarea into a CKEditor4 RTE.
 * Initially based on widget.ckeditor4.js. Refactored and greatly simplified
 */

window.FOS = window.FOS || {};
FOS.item = FOS.item || {};

/**
 * @param {object}      options             any CKE4 configuration options, as well as:
 * @param {string}      options.itemName    the RTE item name, must match a Textarea with the same name
 * @param {function}    options.jsInitCode  optional Initialization JavaScript Code function
 */
FOS.item.ckeditor4 = function (options) {
    var lOptions = $.extend({
        toolbar: 'basic',
        disableNativeSpellChecker: false,
        removePlugins: 'elementspath,image,exportpdf',
        extraPlugins: 'image2',
        resize_dir: 'vertical',
        'menu_groups': 'clipboard,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash'
    }, options);

    var C_TOOLBAR_BASIC = 'basic',
        C_TOOLBAR_INTERMEDIATE = 'intermediate',
        C_TOOLBAR_FULL = 'full',
        C_KEYCODE_F1 = 112;

    // Toolbar logic
    if (lOptions.toolbar === C_TOOLBAR_BASIC) {
        lOptions.toolbar = [
            ['Bold', 'Italic', '-',
            'RemoveFormat', '-',
            'NumberedList', 'BulletedList', '-',
            'Link', 'Unlink', '-',
            'Undo', 'Redo']
        ];
    } else if (lOptions.toolbar === C_TOOLBAR_INTERMEDIATE) {
        lOptions.toolbar = [
            ['Cut', 'Copy', 'Paste', '-',
                'Bold', 'Italic', 'Underline', '-',
                'RemoveFormat', '-',
                'NumberedList', 'BulletedList', '-',
                'Outdent', 'Indent', '-',
                'Link', 'Unlink', 'Anchor', '-',
                'Undo', 'Redo'],
            '/',
            ['Format', 'Font', 'FontSize', 'TextColor', '-',
                'JustifyLeft', 'JustifyCenter', 'JustifyRight']
        ];
    } else if (lOptions.toolbar === C_TOOLBAR_FULL) {
        lOptions.toolbar = [
            ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Print', 'Preview', '-', 'Undo', 'Redo'],
            ['Templates'],
            ['Link', 'Unlink', 'Anchor'],
            ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'],
            '/',
            ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript', '-', 'RemoveFormat'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'],
            ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
            ['TextColor', 'BGColor'],
            ['ShowBlocks'],
            '/',
            ['Styles', 'Format', 'Font', 'FontSize'],
            [/*'Maximize',*/ 'Source']
        ];
    }

    // Instantiate the CKeditor
    var elem$ = $('#' + options.itemName),
        itemName = options.itemName,
        lFinalOptions = lOptions,
        lCurrentSnapshot;

    lFinalOptions.title = apex.lang.formatMessage('APEX.RICH_TEXT_EDITOR.ACCESSIBLE_LABEL', lOptions.label || '');

    elem$.wrap('<div id="' + itemName + '_DISPLAY" style="width: 100%;"></div>');

    if (options.jsInitCode){
        lFinalOptions = options.jsInitCode(lFinalOptions);
    }

    var ckeInstance = CKEDITOR.replace(itemName, lFinalOptions);

    // For item help accessibility. See code in theme.js
    // Because ckeditor uses an iframe keyboard events don't pass up to this document
    // so handle the ckeditor key event and pass it on as a fake keydown event

    ckeInstance.on('key', function (event) {
        if (event.data.keyCode === CKEDITOR.ALT + C_KEYCODE_F1) { // Alt + F1
            // fake a keydown event so that item help keyboard accessibility will work
            elem$.trigger($.Event('keydown', {
                altKey: true,
                ctrlKey: false,
                shiftKey: false,
                metaKey: false,
                isChar: false,
                which: C_KEYCODE_F1,
                keyCode: C_KEYCODE_F1
            }));
        }
    });

    // On Change logic
    ckeInstance.on('focus', function () {
        lCurrentSnapshot = ckeInstance.getSnapshot();
    });

    ckeInstance.on('blur', function () {
        if (ckeInstance.getSnapshot() !== lCurrentSnapshot) {
            elem$.trigger('change');
        }
    });

    apex.item.create(itemName, {
        setValue: function (pValue) {
            ckeInstance.setData(pValue);
        },
        getValue: function () {
            var lHtml, lHtmlWriter;

            // if the Editor is in 'HTML Source' edit mode, we need to apply the content filter rules
            // manually before returning the data. Otherwise content rules can be circumvented by just
            // switching to 'HTML Source' mode and then submitting the page.
            if (ckeInstance.mode === 'source') {

                lHtmlWriter = new CKEDITOR.htmlParser.basicWriter();
                lHtml = CKEDITOR.htmlParser.fragment.fromHtml(ckeInstance.getData());
                ckeInstance.filter.applyTo(lHtml);
                lHtml.writeHtml(lHtmlWriter);

                return lHtmlWriter.getHtml();
            } else {
                return ckeInstance.getData();
            }
        },
        setFocusTo: function () {
            ckeInstance.focus();
            // return fake object with focus method to keep caller happy
            return { focus: function () { } };
        },
        isChanged: function () {
            return ckeInstance.checkDirty();
        }
    });

    // register focus handling, so when the non-displayed textarea of the CKEditor
    // receives focus, focus is moved to the editor.
    elem$.focus(function () {
        ckeInstance.focus();
    });
};

