/*  ContentFlowAddOn_white, version 1.1 
 *  (c) 2008 Sebastian Kutsch
 *  <http://www.jacksasylum.eu/ContentFlow/>
 *
 *  This file is distributed under the terms of the MIT license.
 *  (see http://www.jacksasylum.eu/ContentFlow/LICENSE)
 */

new ContentFlowAddOn ('white', {

    init: function () {
        this.addStylesheet();
    },
	
	ContentFlowConf: {
        reflectionType: "clientside",   // client-side, server-side, none
        reflectionColor: "#ffffff" // none, transparent, overlay or hex RGB CSS style #RRGGBB
	}

});
