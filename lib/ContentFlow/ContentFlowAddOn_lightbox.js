/*  ContentFlowAddOn_lightbox, version 2.0 
 *  (c) 2008 - 2009 Sebastian Kutsch
 *  <http://www.jacksasylum.eu/ContentFlow/>
 *
 *  This file is distributed under the terms of the MIT license.
 *  (see http://www.jacksasylum.eu/ContentFlow/LICENSE)
 */

new ContentFlowAddOn ('lightbox', {

    init: function () {
        var lightboxBaseDir = this.scriptpath+"lightbox/";
        var lightboxCSSBaseDir = lightboxBaseDir;
        var lightboxImageBaseDir = lightboxBaseDir;

        this.addScript(lightboxBaseDir+"lightbox.js");
        this.addStylesheet(lightboxCSSBaseDir+"lightbox.css");
        document.write('<script type="text/javascript">\
            var loadingImage = "'+lightboxImageBaseDir+'loading.gif";\
            var closeButton = "'+lightboxImageBaseDir+'close.gif";	\
        </script>');
    },
	
	ContentFlowConf: {
        onclickActiveItem: function (item) {
            var content = item.content;
            if (content.getAttribute('src')) {
                if (item.content.getAttribute('href')) {
                    item.element.href = item.content.getAttribute('href');
                }
                else if (! item.element.getAttribute('href')) {
                    item.element.href = content.getAttribute('src');
                }
                if (item.caption)
                    item.element.setAttribute ('title', item.caption.innerHTML);

                showLightbox(item.element);
            }
        }
    }

});
