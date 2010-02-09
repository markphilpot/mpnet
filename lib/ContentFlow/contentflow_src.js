/*  ContentFlow, version 0.7.2 
 *  (c) 2007 - 2009 Sebastian Kutsch
 *  <http://www.jacksasylum.eu/ContentFlow/>
 *
 *  ContentFlow is distributed under the terms of the MIT license.
 *  (see http://www.jacksasylum.eu/ContentFlow/LICENSE)
 *
 *--------------------------------------------------------------------------*/
/* 
 * ============================================================
 * Global configutaion and initilization object
 * ============================================================
 */
var ContentFlowGlobal = {
    Flows: new Array,
    AddOns: {}, 
    scriptName: 'contentflow.js',
    scriptElement:  null,
    Browser: new (function () {
        this.Opera = window.opera ? true : false;
        this.IE = document.all && !this.Opera ? true : false;
        this.IE6 = this.IE && typeof(window.XMLHttpRequest) == "undefined" ? true : false;
        this.IE8 = this.IE && typeof(document.querySelectorAll) != "undefined" ? true : false;
        this.IE7 = this.IE && ! this.IE6 && !this.IE8 ? true : false;
        this.WebKit = /WebKit/i.test(navigator.userAgent) ? true : false, 
        this.iPhone = /iPhone|iPod/i.test(navigator.userAgent)? true : false;
        this.Chrome = /Chrome/i.test(navigator.userAgent) ? true : false;
        this.Safari = /Safari/i.test(navigator.userAgent) && !this.Chrome ? true : false;
        this.Konqueror = navigator.vendor == "KDE" ? true : false;
        this.Konqueror4 = this.Konqueror && /native code/.test(document.getElementsByClassName) ? true : false;
        this.Gecko = !this.WebKit && navigator.product == "Gecko" ? true : false;
        this.Gecko19 = this.Gecko && Array.reduce ? true : false;
    })(),

    getScriptElement:function (scriptName) {
        var regex = new RegExp(scriptName);
        var scripts = document.getElementsByTagName('script');
        for (var i=0; i<scripts.length; i++) {
            if (scripts[i].src && regex.test(scripts[i].src))
                return scripts[i];
        }
        return '';
    },

    getScriptPath: function (scriptElement, scriptName) {
        var regex = new RegExp(scriptName+".*");
        return scriptElement.src.replace(regex, '');
    },

    addScript: function  (path) {
        if (this.Browser.IE || this.Browser.WebKit || this.Browser.Konqueror) {
            document.write('<script type="text/javascript" src="'+path+'"><\/script>');
        }
        else {
            var script = document.createElement('script');
            script.src = path;
            script.setAttribute('type', 'text/javascript');
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    },

    addScripts: function  (basePath, filenames) {
        for (var i=0; i<filename.length; i++)
            this.addScript(basepath+filenames[i]);
    },

    addStylesheet: function (path) {
        if (this.Browser.Gecko19) {
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('titel', 'Standard');
            link.setAttribute('href', path);
            link.setAttribute('type', 'text/css');
            link.setAttribute('media', 'screen');
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        else {
            document.write('<link rel="stylesheet" title="Standard" href="'+path+'" type="text/css" media="screen" />');
        }

    },

    addStylesheets: function  (basePath, filenames) {
        for (var i=0; i<filename.length; i++)
            this.addStylesheet(basepath+filenames[i]);
    },

    initPath: function () {
        /* get / set basic values */
        this.scriptElement = this.getScriptElement(this.scriptName);
        if (!this.scriptElement) {
            this.scriptName = 'contentflow_src.js';
            this.scriptElement = this.getScriptElement(this.scriptName);
        }

        this.BaseDir = this.getScriptPath(this.scriptElement, this.scriptName) ;
        if (!this.AddOnBaseDir) this.AddOnBaseDir = this.BaseDir;
        if (!this.CSSBaseDir) this.CSSBaseDir = this.BaseDir;
    },

    init: function () {
        /* add default stylesheets */
        this.addStylesheet(this.CSSBaseDir+'contentflow.css');
        this.addStylesheet(this.CSSBaseDir+'mycontentflow.css');    // FF2: without adding a css-file FF2 hangs on a reload.
                                                                    //      I don't have the slidest idea why
                                                                    //      Could be timing problem
        /* add AddOns scripts */
        if (this.scriptElement.getAttribute('load')) {
            var AddOns = this.scriptElement.getAttribute('load').replace(/\ +/g,' ').split(' ');
            for (var i=0; i<AddOns.length; i++) {
                if (AddOns[i] == '') continue;
                //if (AddOns[i] == 'myStyle') {
                    //this.addStylesheet(this.BaseDir+'mycontentflow.css');
                    //continue;
                //}
                this.addScript(this.AddOnBaseDir+'ContentFlowAddOn_'+AddOns[i]+'.js');
            }
        }

        /* ========== ContentFlow auto initialization on document load ==========
         * thanks to Dean Edwards
         * http://dean.edwards.name/weblog/2005/02/order-of-events/
         */
        var CFG = this;

        /* for Mozilla, Opera 9, Safari */
        if (document.addEventListener) {
            /* for Safari */
            if (/WebKit/i.test(navigator.userAgent)) { // sniff
                var _timer = setInterval(function() {
                    if (/loaded|complete/.test(document.readyState)) {
                        clearInterval(_timer);
                        CFG.onloadInit(); // call the onload handler
                    }
                }, 10);
            }
            else {
              document.addEventListener("DOMContentLoaded", CFG.onloadInit, false);
            }
        }

        /* for Internet Explorer */
        /*@cc_on @*/
        /*@if (@_win32)
        document.write("<script id=__ie_cf_onload defer src=javascript:void(0)><\/script>");
        var script = document.getElementById("__ie_cf_onload");
        script.onreadystatechange = function() {
            if (this.readyState == "complete") {
                CFG.onloadInit(); // call the onload handler
            }
        };
        /*@end @*/

        /* for all other browsers */
        window.addEvent('load', CFG.onloadInit, false);
        /* ================================================================== */

    },

    onloadInit: function () {
        // quit if this function has already been called
        if (arguments.callee.done) return;
        // flag this function so we don't do the same thing twice
        arguments.callee.done = true;
        
        /* fix for mootools */
        if (window.Element && Element.implement && document.all && !window.opera) {
            for (var prop in window.CFElement.prototype) {
                if(!window.Element.prototype[prop]) {
                    var implement = {};
                    implement[prop] = window.CFElement.prototype[prop];
                    Element.implement(implement);
                }
            }
        }

        /* init all manualy created flows */
        for (var i=0; i< ContentFlowGlobal.Flows.length; i++) {
            ContentFlowGlobal.Flows[i].init(); 
        }

        /* init the rest */
        var divs = document.getElementsByTagName('div');
        DIVS: for (var i = 0; i < divs.length; i++) {
            if (divs[i].className.match(/\bContentFlow\b/)) {
                for (var j=0; j<ContentFlowGlobal.Flows.length; j++) {
                    if (divs[i] == ContentFlowGlobal.Flows[j].container) continue DIVS;
                }
                var CF = new ContentFlow(divs[i],{}, false);
                CF.init();
            }
        }
    }

};

ContentFlowGlobal.initPath();


/*
 * ============================================================
 * ContentFlowAddOn
 * ============================================================
 */
var ContentFlowAddOn = function (name, methods, register) {
    if (typeof register == "undefined" || register != false)
        ContentFlowGlobal.AddOns[name] = this;

    this.name = name;
    if (!methods) methods = {};
    this.methods = methods;

    this.scriptpath = ContentFlowGlobal.AddOnBaseDir;;
    if (methods.init) {
        var init = methods.init.bind(this);
        init(this);
    }
};

ContentFlowAddOn.prototype = {
    Browser: ContentFlowGlobal.Browser,

    addScript: ContentFlowGlobal.addScript,
    addScripts: ContentFlowGlobal.addScripts,

    addStylesheet: function (path) {
        if (!path)
            path = this.scriptpath+'ContentFlowAddOn_'+this.name+'.css';
        ContentFlowGlobal.addStylesheet(path);
    },
    addStylesheets: ContentFlowGlobal.addStylesheets,

    _init: function (flow) {
        if (this.methods.ContentFlowConf) {
            flow.setConfig(this.methods.ContentFlowConf);
        }
    }

};



/* 
 * ============================================================
 * ContentFlowGUIElement
 * ============================================================
 */

var ContentFlowGUIElement = function (CFobj, element) {
    element.setDimensions = function () {
        this.dimensions = this.getDimensions();
        this.center = {x: this.dimensions.width/2, y:this.dimensions.height/2};
        this.position = this.findPos();
    };
    element.addObserver = function (eventName, method) {
        var m = this.eventMethod = method.bind(CFobj);
        this.observedEvent = eventName;
        this.addEvent(eventName, m, false);
    };
    
    element.makeDraggable = function (onDrag, beforeDrag, afterDrag) {

        this.stopDrag = function(event) {
            if (!event) var event = window.event;
            window.removeEvent('mousemove', onDrag, false);
            afterDrag(event); 
        }.bind(this);

        this.startDrag = function (event) {
            if (!event) var event = window.event;
            this.mouseX = event.clientX; 
            this.mouseY = event.clientY; 

            beforeDrag(event);
            window.addEvent('mousemove', onDrag, false);
            var stopDrag = this.stopDrag;
            window.addEvent('mouseup', stopDrag, false);

        }.bind(this);

        var startDrag = this.startDrag;
        //if (this.Browser.iPhone)  
            //this.ontouchstart = startDrag;
        //else
            this.addEvent('mousedown', startDrag, false); 
        
    };

    $CF(element).setDimensions();
    return element;
};


/* 
 * ============================================================
 * ContentFlowItem
 * ============================================================
 */
var ContentFlowItem  = function (CFobj, element, index) {
    this.CFobj = CFobj;
    this._activeElement = CFobj._activeElement;
    /*
     * ==================== item click events ====================
     * handles the click event on an active and none active item
     */

    this.clickItem = function (event) {
        if(!event) var event = window.event;
        var el = event.target ? event.target : event.srcElement;
        var index = el.itemIndex ? el.itemIndex : el.parentNode.itemIndex;
        var item = this.items[index];
        if (this._activeItem == item) {
            this._onclickActiveItem(item);
        }
        else {
            this.moveToIndex(index);
            this._onclickInactiveItem(item);
        }
    }.bind(CFobj),

    this.setIndex = function (index) {
        this.index = index;
        this.element.itemIndex = index;
    };
    this.getIndex = function () {
        return this.index;
    };


    /* create item object */
    this.element = $CF(element);
    this.item = element;
    if (typeof index != "undefined") this.setIndex(index);
    this.content = this.element.getChildrenByClassName('flowcontent')[0];
    this.caption = this.element.getChildrenByClassName('caption')[0];
    this.label = this.element.getChildrenByClassName('label')[0];

    /* if content is image set properties */
    if (this.content.nodeName == "IMG") {
        CFobj._imagesToLoad++;

        var foobar = function () { 
            CFobj._imagesToLoad--;
            this.image = this.content;
            this.setImageFormat(this.image);
            if (CFobj._reflectionType != "none") {
                this.addReflection();
            }
            else {
                var size = CFobj._calcSize(0,0);
                this.positionContent(size);
            }
            this.initClick();
        }.bind(this);

        if (this.content.complete && this.content.width > 0)
            foobar();
        else
            this.content.onload = foobar;
    }
    else {
        this.initClick();
    }

};

ContentFlowItem.prototype = {
    
    Browser: ContentFlowGlobal.Browser,

    makeActive: function () {
        this.element.addClassName('active');
        this.CFobj._onMakeActive(this);
    },
    
    makeInactive: function () {
        this.element.removeClassName('active');
        this.CFobj._onMakeInactive(this);
    },

    initClick: function () {
        var cItem = this.clickItem;
        this[this._activeElement].addEvent('click', cItem, false);
    },

    /*
     * add reflection to item
     */
    addReflection: function() {
        var CFobj = this.CFobj;
        var reflection;
        var image = this.content;

        if (CFobj._reflectionType == "serverside") {
            var mFILE = CFobj._fileRegEx.exec(image.src);
            var sURLTO = image.src.replace(new RegExp(mFILE[1]+'$'), '');

            var src = CFobj._reflectionServerSrc;
            src = src.replace(/\{URLTO\}/, sURLTO);
            src = src.replace(/\{FILE\}/, mFILE[1]);
            src = src.replace(/\{FILENAME\}/, mFILE[2]);
            src = src.replace(/\{EXT\}/, mFILE[3]);

            reflection = this.reflection = document.createElement('img');
            reflection.src = src;

        } else {

            if (this.Browser.IE) {
                var filterString = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)';
                if (CFobj._reflectionColorRGB) {
                    // transparent gradient
                    if (CFobj._reflectionColor == "transparent") {
                        var RefImg = reflection = this.reflection = document.createElement('img');
                        reflection.src = image.src;
                    }
                    // color gradient
                    else {
                        reflection = this.reflection = document.createElement('div');
                        var RefImg = document.createElement('img');
                        RefImg.src = image.src;
                        reflection.width = RefImg.width;
                        reflection.height = RefImg.height;
                        RefImg.style.width = '100%';
                        RefImg.style.height = '100%';
                        var color = CFobj._reflectionColorRGB;
                        reflection.style.backgroundColor = '#'+color.hR+color.hG+color.hB;
                        reflection.appendChild(RefImg);
                    }
                    filterString += ' progid:DXImageTransform.Microsoft.Alpha(opacity=0, finishOpacity=50, style=1, finishX=0, startY='+CFobj._reflectionHeight*100+' finishY=0)';
                } else {
                    var RefImg = reflection = this.reflection = document.createElement('img');
                    reflection.src = image.src;
                }
                // crop image (streches and crops (clip on default dimensions), original proportions will be restored through CSS)
                filterString += ' progid:DXImageTransform.Microsoft.Matrix(M11=1, M12=0, M21=0, M22='+1/CFobj._reflectionHeight+')';

                RefImg.style.filter = filterString;

            } else {
                if (CFobj._reflectionWithinImage)
                    var canvas = this.canvas = $CF(document.createElement('canvas'));
                else 
                    var canvas = reflection = this.reflection = document.createElement('canvas');

                if (canvas.getContext) {
                    if (CFobj._reflectionWithinImage) {
                        for (var i=0; i <image.attributes.length; i++) {
                            canvas.setAttributeNode(image.attributes[i].cloneNode(true));
                        }
                    }

                    var context = canvas.getContext("2d");
                        
                    // overwrite default height and width
                    if (CFobj._reflectionWithinImage) {
                        if (image.height > CFobj.maxHeight) {
                            var height = CFobj.maxHeight;
                            var width = CFobj.maxHeight / image.origProportion;
                        }
                        else {
                            var height = image.height;
                            var width = image.width;
                        }

                        canvas.width = width;
                        canvas.height = height; 
                        this.setImageFormat(canvas);
                        canvas.height = height * (1 + CFobj._reflectionHeight);

                    }
                    else {
                        canvas.width = width;
                        canvas.height = height * CFobj._reflectionHeight;
                    }
                        
                    context.save(); /* save default context */

                    /* draw image into canvas */
                    if (CFobj._reflectionWithinImage) {
                        context.drawImage(image, 0, 0, width, height);
                    }

                    /* mirror image by transformation of context and image drawing */
                    if (CFobj._reflectionWithinImage) { // -1 for FF 1.5
                        var contextHeight = height * 2 - 1;
                    }
                    else {
                        var contextHeight = image.height - 1;
                    }
                    
                    context.translate(0, contextHeight);
                    context.scale(1, -1);
                    /* draw reflection image into canvas */
                    context.drawImage(image, 0, 0, width, height);

                    /* restore default context for simpler further canvas manupulation */
                    context.restore();
                        
                    if (CFobj._reflectionColorRGB) {
                        var gradient = context.createLinearGradient(0, 0, 0, canvas.height);

                        var alpha = [0, 0.5, 1];
                        if (CFobj._reflectionColor == "transparent") {
                            context.globalCompositeOperation = "destination-in";
                            alpha = [1, 0.5, 0];
                        }

                        var red = CFobj._reflectionColorRGB.iR;
                        var green = CFobj._reflectionColorRGB.iG;
                        var blue = CFobj._reflectionColorRGB.iB;
                        if (CFobj._reflectionWithinImage) {
                            gradient.addColorStop(0, 'rgba('+red+','+green+','+blue+','+alpha[0]+')');
                            gradient.addColorStop(height/canvas.height, 'rgba('+red+','+green+','+blue+','+alpha[0]+')');
                            gradient.addColorStop(height/canvas.height, 'rgba('+red+','+green+','+blue+','+alpha[1]+')');
                        }
                        else {
                            gradient.addColorStop(0, 'rgba('+red+','+green+','+blue+','+alpha[1]+')');
                        }
                        gradient.addColorStop(1, 'rgba('+red+','+green+','+blue+','+alpha[2]+')');

                        context.fillStyle = gradient;
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        
                    }

                    if (CFobj._reflectionWithinImage) {
                        image.parentNode.replaceChild(canvas, image);
                        this.content = canvas;
                        this.origContent = canvas;
                        delete this.image;// = true;

                    }
                    
                } else {
                    CFobj._reflectionWithinImage = false;
                    delete this.reflection;
                }

            }
        }
        if (reflection) {
            reflection.className = "reflection";
            this.element.appendChild(reflection);

            /* be shure that caption is last child */
            if (this.caption) this.element.appendChild(this.caption);
        } 
        var size = CFobj._calcSize(0,0);
        this.positionContent(size);

    },

    
    setImageFormat: function (img) {
        img.origProportion = img.height / img.width;
        img.setAttribute('origProportion', img.height / img.width);
        //img.origWidth = img.width;
        //img.origHeight = img.height;
        if (img.origProportion >= 1)
            img.addClassName('portray');
        else
            img.addClassName('landscape');
    },


    /*
     * calculate content dimensions
     */
    calcContentDim: function (size) {
        var CFobj = this.CFobj;
        var Item = this;
        var content = this.content;
        var proportion = content.origProportion;
        var width, height;
        
        /* calc size and position of content */
        if (proportion >= 1) {
            if (CFobj._verticalFlow) {
                if (CFobj._scaleFactorLandscape == "max")
                    var width = size.width;
                else
                    var width = size.height / proportion * CFobj._scaleFactorLandscape;

                width = width > CFobj.maxHeight ? CFobj.maxHeight : width;
                height = width * proportion;
            }
            else {
                height = size.height;
                width = size.height / proportion; 
            }
        } else {
            if (CFobj._verticalFlow) {
                height = size.width * proportion;
                width = size.width;
            } else {
                if (CFobj._scaleFactorLandscape == "max")
                    height = size.height;
                else 
                    height = size.width * proportion * CFobj._scaleFactorLandscape;

                height = height > CFobj.maxHeight ? CFobj.maxHeight : height;
                width = height / proportion;
            }
        }
        var contentDim = {
            height: height,
            width: width
        };
        return contentDim;
    },

    /*
     * position content
     */
    positionContent: function (size, absPos) {
        var CFobj = this.CFobj;
        var Item = this;
        var content = this.content;
        var proportion = content.origProportion;

        var contentDim = this.calcContentDim(size);
        if (isNaN(contentDim.height) || isNaN(contentDim.width)) return;

        var contentPos = {};

        /* center vertical / horizontal */
        if (CFobj._verticalFlow)
            contentPos.top = (size.height - contentDim.height )/2;
        else {
            contentPos.left = this.Browser.IE6 ? 0 : (size.width - contentDim.width )/2;
        }

        switch (CFobj._contentPosition) {
            case "top":
                if (CFobj._verticalFlow)
                    contentPos.left = 0; 
                else
                    contentPos.top = 0; 
                break;
            case "center":
            case "middle":
                if (CFobj._verticalFlow)
                    contentPos.left = (size.width - contentDim.width) /2;
                else
                    contentPos.top = (size.height - contentDim.height) /2;
                break;
            case "bottom":
            default:
                if (CFobj._verticalFlow)
                    contentPos.left = size.width - contentDim.width;
                else
                    contentPos.top = size.height - contentDim.height;
        }

        if (absPos) {
            if (CFobj._reflectionType != "none" && CFobj._reflectionWithinImage && !this.Browser.IE) {
                content.style.height = (contentDim.height * (1 + CFobj._reflectionHeight)) + "px";
            } else {
                content.style.height = contentDim.height + "px";
            }

            content.style.width = contentDim.width + "px";
            content.style.marginLeft = contentPos.left + "px";
            content.style.marginTop = contentPos.top + "px";
        }
        else {
            /* set dimensions and position of content */
            if (CFobj._reflectionType != "none" && CFobj._reflectionWithinImage && !this.Browser.IE) {
                content.style.height = (contentDim.height * (1 + CFobj._reflectionHeight)/size.height*100) + "%";
            } else {
                if (CFobj.Browser.IE)
                    content.style.height = (contentDim.height/ (size.height*(1 + CFobj._reflectionHeight))*100) + "%";
                else
                    content.style.height = (contentDim.height/size.height*100) + "%";
            }

            content.style.width = (contentDim.width/size.width * 100) + "%";
            content.style.marginLeft = (contentPos.left/size.width*100) + "%";
            content.style.marginTop = (contentPos.top/size.height*100) + "%";
        }


        if (this.reflection) {
            /* set dimensions and position of reflection */
            var reflection = this.reflection;
            if (absPos)
                reflection.style.height = (contentDim.height*CFobj._reflectionHeight) +"px";
            else
                reflection.style.height = (contentDim.height*CFobj._reflectionHeight/(size.height*(1 + CFobj._reflectionHeight))*100)+"%";
            reflection.style.width = content.style.width;
            reflection.style.marginLeft = content.style.marginLeft;
        }
    }
 };

/*
 * ============================================================
 * ContentFlow
 * ============================================================
 */
var ContentFlow = function (container, config) {

    if (container) {
        ContentFlowGlobal.Flows.push(this);
        this.container = container;
        this._userConf = config?config:{};
    } else {
        throw ('ContentFlow ERROR: No flow container node or id given');
    }

};

ContentFlow.prototype = {
    _imagesToLoad: 0,
    _activeItem: 0,
    _currentPosition: 0,
    _targetPosition: 0,
    _stepLock: false,
    _millisecondsPerStep: 50, 
    _fileRegEx: /(([^\/?=&]+)\.(\w+)){1}$/,
    Browser: ContentFlowGlobal.Browser,
    
    _defaultConf: { 
        /* pre conf */
        useAddOns: 'all', // all, none, [AddOn1, ... , AddOnN]

        biggestItemPos: 0,
        loadingTimeout: 30000, //milliseconds
        activeElement: 'content', // item or content

        maxItemHeight: 0,
        scaleFactor: 1,
        scaleFactorLandscape: 1,
        relativeItemPosition: "top center", // align top/above, bottom/below, left, right, center of position coordinate
        contentPosition: "bottom", // align at the top, center/middle or bottom of the item

        circularFlow: true,
        verticalFlow: false,
        verticalScrollbar: false,
        endOpacity: 1,
        visibleItems: -1,
        startItem:  "center",
        scrollInFrom: "pre",

        flowSpeedFactor: 1.0,
        flowDragFriction: 1.0,
        scrollWheelSpeed: 1.0,
        keys: {
            13: function () { this._onclickActiveItem(this._activeItem) },
            37: function () { this.moveTo('pre') }, 
            38: function () { this.moveTo('visibleNext') },
            39: function () { this.moveTo('next') },
            40: function () { this.moveTo('visiblePre') }
        },

        reflectionType: "clientside",   // client-side, server-side, none
        reflectionWithinImage: true,
        reflectionColor: "transparent", // none, transparent or hex RGB CSS style #RRGGBB
        reflectionHeight: 0.5,          // float (relative to original image height)
        negativeMarginOnFloat: "auto",  // auto, none or float (relative to reflectionHeight)
        reflectionServerSrc: "{URLTO}{FILENAME}_reflection.{EXT}",  // {URLTO}, {FILE}, {FILENAME}, {EXT}

        /* ==================== actions ==================== */

        onInit: function () {},

        onclickInactiveItem : function (item) {},

        onclickActiveItem: function (item) {
            var url, target;

            if (url = item.content.getAttribute('href')) {
                target = item.content.getAttribute('target');
            }
            else if (url = item.element.getAttribute('href')) {
                target = item.element.getAttribute('target');
            }
            else if (url = item.content.getAttribute('src')) {
                target = item.content.getAttribute('target');
            }

            if (url) {
                if (target)
                    window.open(url, target).focus();
                else
                    window.location.href = url;
            }
        },

        onMakeInactive: function (item) {},

        onMakeActive: function (item) {},

        onReachTarget: function(item) {},

        onMoveTo: function(item) {},
        
        onclickPreButton: function (event) {
            this.moveToIndex('pre');
            return Event.stop(event);
        },
        
        onclickNextButton: function (event) {
            this.moveToIndex('next');
            return Event.stop(event);
        },

        /* ==================== calculations ==================== */

        calcStepWidth: function(diff, absDiff) {
            if (absDiff > this._visibleItems) {
                if (diff > 0) {
                    var stepwidth = diff - this._visibleItems;
                } else {
                    var stepwidth = diff + this._visibleItems;
                }
            } else if (this._visibleItems >= this.items.length) {
                var stepwidth = diff / this.items.length;
            } else {
                var stepwidth = diff * ( this._visibleItems / this.items.length);
                //var stepwidth = diff/absDiff * Math.max(diff * diff,Math.min(absDiff,0.3)) * ( this._visibleItems / this.items.length);
                //var stepwidth = this.flowSpeedFactor * diff / this.visibleItems;
                //var stepwidth = this.flowSpeedFactor * diff * ( this.visibleItems / this.items.length)
                //var stepwidth = this.flowSpeedFactor * diff / this._millisecondsPerStep * 2; // const. speed
            }
            return stepwidth;
        },
        
        calcSize: function (relativePosition, side) {
            var rP = relativePosition;
            var vI = this._visibleItems;
            var maxHeight = this.maxHeight;

            var h = maxHeight/(Math.abs(rP)+1);
            var w = h;
            return {width: w, height: h};
        },

        calcCoordinates: function (relativePosition, side) {
            var rP = relativePosition;
            var vI = this._visibleItems;
            var maxHeight = this.maxHeight;

            var f = 1 - 1/Math.exp( Math.abs(rP)*0.75);
            var x =  this.Flow.center.x * (1 + side *vI/(vI+1)* f); 
            var y = this.maxHeight;

            return {x: x, y: y};
        },
        /*
        calcRelativeItemPosition: function(relativePosition, side, size) {
            var rP = relativePosition;
            var vI = this._visibleItems;
            var maxHeight = this.maxHeight;

            var x = -size.width/2;
            var y = -size.height;
            return {x: x, y: y};
        },
        */

        calcZIndex: function (x, f, I) {
            return -Math.abs(I);
        },

        calcFontSize: function (x, f, size) {
            return size.height / this.maxHeight;
        },
   
        calcOpacity: function (relativePosition, side) {
            return 1 - ((1 - this._endOpacity ) * Math.sqrt(Math.abs(relativePosition)/this._visibleItems));
        }
    },

    /* ---------- end of defaultConf ---------- */


    /*
     * ==================== public methods ==================== 
     */


    /*
     * calls _init() if ContentFlow has not been initialized before
     * needed if ContentFlow is not automatically initialized on window.load
     */
    init: function () {
        if(this.isInit) return;
        this._init();
    },

    /*
     * parses configuration object and initializes configuration values
     */
    setConfig: function(config) {
        if (!config) return;
        var dC = this._defaultConf;
        for (var option in config) {
            if (dC[option] == "undefined" ) continue;
            switch (option) {
                case "scrollInFrom":
                case "startItem":
                case "negativeMarginOnFloat":
                    if (typeof(config[option]) == "number"  || typeof(config[option]) == "string") {
                        this["_"+option] = config[option];
                    }
                    break;
                default:
                    if (typeof(dC[option] == config[option])) {
                        this["_"+option] = config[option];
                    }
            }
        }
        switch (this._reflectionColor) {
            case "overlay":
                break;
            case this._reflectionColor.search(/#[0-9a-fA-F]{6}/)>= 0?this._reflectionColor:this._reflectionColor+"x":
                this._reflectionColorRGB = {
                    hR: this._reflectionColor.slice(1,3),
                    hG: this._reflectionColor.slice(3,5),
                    hB: this._reflectionColor.slice(5,7),
                    iR: parseInt(this._reflectionColor.slice(1,3), 16),
                    iG: parseInt(this._reflectionColor.slice(3,5), 16),
                    iB: parseInt(this._reflectionColor.slice(5,7), 16)
                };
                break;
            case "none":
            case "transparent":
            default:
                this._reflectionColor = "transparent"; 
                this._reflectionColorRGB = {
                    hR: 0, hG: 0, hB:0,
                    iR: 0, iG: 0, iB:0
                };
                break;
        }
        if (this._negativeMarginOnFloat == "none") this._negativeMarginOnFloat = 0;
        if (this.items) {
            if (this._visibleItems <  0)
                this._visibleItems = Math.round(Math.sqrt(this.items.length));
            this._visibleItems = Math.min(this._visibleItems, this.items.length - 1);
        }

        if (this._relativeItemPosition) {
            var calcRP = {
                x: {
                    left: function(size) { return -size.width },
                    center: function(size) { return -size.width/2 },
                    right: function(size) { return 0 }
                },
                y: {
                    top: function(size) { return -size.height },
                    center: function(size) { return -size.height/2 },
                    bottom: function(size) { return 0 }
                }
            };

            var iP = this._relativeItemPosition;
            iP = iP.replace(/above/,"top").replace(/below/,"bottom");
            var x, y = null;
            x = iP.match(/left|right/);
            y = iP.match(/top|bottom/);
            c = iP.match(/center/);
            if (!x) {
                if (c) x = "center";
                else x = "center";
            }
            if (!y) {
                if (c) y = "center";
                else y = "bottom";
            }
            var calcX = calcRP.x[x];
            var calcY = calcRP.y[y];
            this._calcRelativeItemPosition = function (rP, side, size) {
                var x = calcX(size);
                var y = calcY(size);
                return {x: x, y: y};
            };
            this._relativeItemPosition = null;
        }

    },

    getItem: function (index) {
        return this.items[this._checkIndex(Math.round(index))]; 
    },

    /*
     * returns the index number of the active item
     */
    getActiveItem: function() {
        return this._activeItem;
    },

    /*
     * returns the number of items the flow contains
     */
    getNumberOfItems: function () {
        return this.items.length;
    },

    /*
     * reinitializes sizes.
     * called on window.resize
     */
    resize: function () {
        this._initSizes();
        this._initStep();
    }, 

    /*
     * scrolls flow to item i
     */
    moveToPosition: function (p) {
        if (!this._circularFlow) p = this._checkIndex(p);
        this._targetPosition = p;
        this._onMoveTo(this._getItemByPosition(p));
        this._initStep();
    },
    moveToIndex: function (index) {
        this._targetPosition = Math.round(this._getPositionByIndex(this._getIndexByKeyWord(index, this._activeItem.index, !this._circularFlow)));
        this._onMoveTo(this._getItemByPosition(this._targetPosition));
        this._initStep();
    },
    moveToItem: function (item) {
        var i;
        if (item.itemIndex) i = item.itemIndex;
        else i = item.index;
        this.moveToIndex(i);
    },
    moveTo: function (i) {
        if (typeof i == "object") this.moveToItem(i);
        else if (isNaN(i) || i == Math.floor(i)) this.moveToIndex(i);
        else this.moveToPosition(i);
    }, 

    /*
     * initializes item and adds it at index position
     */
    addItem: function(el, index) {
        if (typeof index == "string") {
            switch (index) {
                case "first":
                case "start":
                    index = 0;
                    break;
                case "last":
                case "end":
                    index = this.itemsLastIndex + 1;
                    break;
                default:
                    index = this._getIndexByKeyWord(index);
                    if (this._activeItem &&  index < this._activeItem.index) index++;
            }
        }

        index = Math.max(index, 0);
        index = Math.min(index, this.itemsLastIndex + 1);
        
        /* insert item at index position into flow */ 
        //if (index > this.itemsLastIndex || !this.items[index])
            //this.Flow.appendChild(el);
        //else
            //this.Flow.insertBefore(el, this.items[index].element);
        this.Flow.appendChild(el);

        /* init item after insertion. that way it's part of the document and all styles are applied */
        item = new ContentFlowItem(this, el, i);
        this.items.splice(index,0, item);

        /* adjust item indices */
        for (var i = index; i < this.items.length; i++) {
            this.items[i].setIndex(i);
        }
        this._setLastIndex();

        /* adjust targetItem, currentPos so that current view does not change*/
        if (Math.round(this._getPositionByIndex(index)) <= Math.round(this._targetPosition)) {
            this._targetPosition++;
            if (!this._circularFlow)
                this._targetPosition = Math.min(this._targetPosition, this.itemsLastIndex);
        } 
        if (this._getPositionByIndex(index) <= this._currentPosition) {
            this._currentPosition++;
            if (!this._circularFlow)
                this._currentPosition = Math.min(this._currentPosition, this.itemsLastIndex);
        }
        
        // avoid display errors (wrong sizing)
        var CF = this;
        window.setTimeout(function () { CF._initStep() }, 10);

        return index;
        
    },
        
    /*
     * removes item at index position, cleans it up and returns it
     */
    rmItem: function(index) {
        if  (index == "undefined") index = this._activeItem.index;
        index = this._getIndexByKeyWord(index);
        if (!this.items[index]) return null;

        var Item = this.items[index];
        var item = Item.element;
        var content = Item.content;

        /* remove event listeners */
        //var ciItem = this._ciItem
        //var caItem = this._caItem;
        //Item[this._activeElement].removeEvent('click', ciItem, false);
        //if (window.removeEventListener)
            //Item[this._activeElement].removeEvent('click', caItem, false);
        //else
            //Item[this._activeElement].onclick = function () {};

        //item.style.height = "";
        //item.style.width = "";
        //item.style.margin = "";
        //item.style.top = "";
        //item.style.left = "";
        //item.style.fontSize = "";
        //item.style.zIndex = "";
        //item.style.display = "";

        /* remove classes */
        //item.removeClassName('active');
        //item.removeClassName('withReflection');
        //if (Item.image) {
            //content.removeClassName('portray');
            //content.removeClassName('landscape');
        //}
            
        /* cleanup arrays and remove generated content */
        //if (Item.image) {
            //this.itemsContent[index].width = this.itemsContent[index].origWidth;
            //this.itemsContent[index].height = this.itemsContent[index].origHeight;
            //content.removeAttribute('width');
            //content.removeAttribute('height');
            //content.style.width = "";
            //content.style.height = "";
            //content.style.margin = "";

            //if (Item.reflection) {
                //item.removeChild(Item.reflection);
            //}
            //if (Item.overlay) item.removeChild(Item.overlay);
        //}

        this.items.splice(index,1);

        /* adjust item indices */
        for (var i = index ; i < this.items.length; i++) {
            this.items[i].setIndex(i);
        }

        this._setLastIndex();
        
        /* adjust targetItem, currentPos and activeItem so that current view does not change*/
        if (Math.round(this._getPositionByIndex(index)) < Math.round(this._targetPosition)) {
            this._targetPosition--;
            if (!this._circularFlow)
                this._targetPosition = this._checkIndex(this._targetPosition);
        }
        if (this._getPositionByIndex(index) < this._currentPosition) {
            this._currentPosition--;
            if (!this._circularFlow)
                this._currentPosition = this._checkIndex(this._currentPosition);
        }
        this._activeItem = this._getItemByPosition(this._currentPosition);

        /* remove item from DOM tree, take the next step and return removed item  */
        var removedItem = item.parentNode.removeChild(item);
        // avoid display errors (wrong sizing)
        var CF = this;
        window.setTimeout(function () { CF._initStep() }, 10);
        return removedItem;

    },


    /*
     * ==================== index helper methods ====================
     */

    /*
     * checks if index is within the index range of the this.items array
     * returns a value that is within this range
     */
    _checkIndex: function (index) {
        index = Math.max(index, 0);
        index = Math.min(index, this.itemsLastIndex);
        return index;
    },

    /*
     * sets the object property itemsLastIndex
     */
    _setLastIndex: function () {
        this.itemsLastIndex = this.items.length - 1;
    },

    /*
*/
    _getItemByIndex: function (index) {
        return this.items[this._checkIndex(index)];
    },

    _getItemByPosition: function (position) {
        return this._getItemByIndex(this._getIndexByPosition(position));
    },

    /* returns the position of an item-index relative to current position */
    _getPositionByIndex: function(index) {
        if (!this._circularFlow) return this._checkIndex(index);
        var cI = this._getIndexByPosition(this._currentPosition);
        var dI = index - cI;
        if (Math.abs(dI) > dI+this.items.length)
            dI+= this.items.length;
        else if (Math.abs(dI) > (Math.abs(dI-this.items.length)))
            dI -= this.items.length;

        return this._currentPosition + dI;

    },

    /* returns the index an item at position p would have */
    _getIndexByPosition: function (position) {
        if (position < 0) var mod = 0;
        else var mod = 1;

        var I = (Math.round(position) + mod) % this.items.length;
        if (I>0) I -= mod;
        else if(I<0) I += this.items.length - mod;
        else if(position<0) I = 0;
        else I = this.items.length - 1;

        return I;
    },

    _getIndexByKeyWord: function (keyword, relativeTo, check) {
        if (relativeTo)
            var index = relativeTo;
        else if (this._activeItem)
            var index = this._activeItem.index;
        else
            var index = 0;

        if (isNaN(keyword)) {
            switch (keyword) {
                case "first":
                case "start":
                    index = 0;
                    break;
                case "last":
                case "end":
                    index = this.itemsLastIndex;
                    break;
                case "middle":
                case "center":
                    index = Math.round(this.itemsLastIndex/2);
                    break;
                case "right":
                case "next":
                    index += 1;
                    break;
                case "left":
                case "pre":
                case "previous":
                    index -= 1;
                    break;
                case 'visible':
                case 'visiblePre':
                case 'visibleLeft':
                    index -= this._visibleItems;
                    break;
                case 'visibleNext':
                case 'visibleRight':
                    index += this._visibleItems;
                    break;
                default:
                    index = index;
            }
        }
        else {
            index = keyword;
        }
        if (check != false)
            index = this._checkIndex(index);
        
        return index;
    },


    /*
     * ==================== initialization ====================
     */
    

    /* -------------------- main init -------------------- */
    _init: function () {

        if (typeof(this.container) == 'string') { // no node
            var container = document.getElementById(this.container);
            if (container) {
                this.container = container;
            } else {
                throw ('ContentFlow ERROR: No element with id \''+this.container+'\' found!');
                return;
            }
        }
        
        /* reserve CSS namespace */

        $CF(this.container).addClassName('ContentFlow');

        var flow = $CF(this.container).getChildrenByClassName('flow')[0];
        if (!flow) {
            throw ('ContentFlow ERROR: No element with class\'flow\' found!');
            return;
        }
        this.Flow = new ContentFlowGUIElement(this, flow);

        var scrollbar = this.container.getChildrenByClassName('scrollbar')[0];
        if (scrollbar) {
            this.Scrollbar = new ContentFlowGUIElement(this, scrollbar);
            var slider = this.Scrollbar.getChildrenByClassName('slider')[0];
            if (slider) {
                this.Slider = new ContentFlowGUIElement(this, slider);
                var position = this.Slider.getChildrenByClassName('position')[0];
                if (position) {
                    this.Position = new ContentFlowGUIElement(this, position);
                }
            }

        }

        this.setConfig(this._defaultConf);
        /* init AddOns */
        this._initAddOns();
        this.setConfig(this._userConf);
        
        this._initSizes(); // ......

        /* ---------- init item lists ---------- */
        var items = this.Flow.getChildrenByClassName('item');
        this.items = new Array();
        for (var i=0; i<items.length; i++) {
            this.items[i] = new ContentFlowItem(this, items[i], i);
        }
        if (this.items.length > 0) {
            this.items[0].makeActive();
            this._activeItem = this.items[0];
        }
        this._setLastIndex();

        this._initGUI();
        /* ---------- init start parameters ---------- */
        if (this._activeElement != "content")
            this._activeElement = "element";

        if (this._visibleItems < 0)
            this._visibleItems = Math.round(Math.sqrt(this.items.length));
        this._visibleItems = Math.min(this._visibleItems, this.items.length - 1);

        this._targetPosition = this._getIndexByKeyWord(this._startItem);

        var index = this._getIndexByKeyWord(this._scrollInFrom, this._targetPosition);
        switch (this._scrollInFrom) {
            case "next":
                index -= 0.5;
                break;
            case "pre":
                index += 0.5;
                break;
        } 
        this._currentPosition = index;
        this._activeItem = this.getItem(index);
        if (this._activeItem) this._activeItem.makeActive();

        
        // wait till all images are loaded or grace time is up to show all and take the first step 
        var now = new Date();
        var cf = this;
        var timer = window.setInterval (
            function() {
                if ( cf._imagesToLoad == 0 || new Date() - now > cf._loadingTimeout ) {
                    clearInterval(timer);
                    
                    cf.Flow.style.visibility = "visible"; // show flow after images are loaded
                    if (cf.loadIndicator) cf.loadIndicator.style.display = "none";
                    if (cf.Scrollbar) cf.Scrollbar.style.visibility = "visible";

                    if (cf.Browser.WebKit)
                        cf.resize();  // ugly fix for scrollbar position bug
                    else
                        cf._initStep();

                    cf._onInit();
                }
            }, 10
        );
        
        this.isInit = true;

    },
    
    /* ---------- init AddOns ---------- */ 
    _initAddOns: function () {

        // get an array of names of all AddOns that should be used
        var loadAddOns = [];
        if (this._userConf.useAddOns) {
            if (typeof this._userConf.useAddOns == "string") {
                loadAddOns = this._userConf.useAddOns.split(" ");
            }
            else if (typeof this._userConf.useAddOns == "array") {
                loadAddOns = this._userConf.useAddOns;
            }
        }
        else if (this.container.getAttribute("useAddOns")) {
            loadAddOns = this.container.getAttribute("useAddOns").split(" ");
        }
        else {
            loadAddOns = this._useAddOns.split(' ');
        }

        // check the names for keywords
        for (var i=0; i<loadAddOns.length; i++) {
            if (loadAddOns[i] == "none") {
                loadAddOns = new Array();
                break;
            }
            else if (loadAddOns[i] == "all") {
                loadAddOns = new Array();
                for (var AddOn in ContentFlowGlobal.AddOns)
                    loadAddOns.push(AddOn);
                break;
            }
        }

        // init all AddOns that should be used and exist
        for (var i=0; i<loadAddOns.length; i++) {
            var AddOn = ContentFlowGlobal.AddOns[loadAddOns[i]];
            if (AddOn) {
                AddOn._init(this);
                this.container.addClassName('ContentFlowAddOn_'+AddOn.name);
                if (AddOn.methods.onloadInit)
                    AddOn.methods.onloadInit(this);
            }
        }

    },


    _initGUI: function () {
        
        // resize
        if (!this.Browser.iPhone) {
            var resize = this.resize.bind(this);
            window.addEvent('resize', resize, false);
        }
        
        // pre and next buttons
        var divs = this.container.getElementsByTagName('div');
        for (var i = 0; i < divs.length; i++) {
            if ($CF(divs[i]).hasClassName('preButton')) {
                var pre = divs[i];
                var mt = this._onclickPreButton.bind(this);
                pre.addEvent('click', mt, false);
            }
            else if (divs[i].hasClassName('nextButton')) {
                var next = divs[i];
                var mt = this._onclickNextButton.bind(this);
                next.addEvent('click', mt, false);
            }
        }

        // Container object
        // mousewheel
        if (this._scrollWheelSpeed != 0) {
            var wheel = this._wheel.bind(this);
            if(window.addEventListener) this.container.addEventListener('DOMMouseScroll', wheel, false);
            this.container.onmousewheel = wheel;
        }

        // key strokes
        var key = this._keyStroke.bind(this);
        if (this._keys && !this.Browser.iPhone) {
            if (document.addEventListener) {
                if (!this.Browser.Opera) {
                    var mouseoverCheck = document.createElement('div');
                    mouseoverCheck.addClassName('mouseoverCheckElement');
                    this.container.appendChild(mouseoverCheck);

                    if (this.Browser.WebKit) {
                        document.body.addEvent('keydown',  function (event) {
                            if (mouseoverCheck.offsetLeft > 0) key(event) ;
                        });
                    } else {
                        window.addEvent('keydown',  function (event) {
                            if (mouseoverCheck.offsetLeft > 0) key(event) ;
                        });
                    }
                } 
                else {
                    //this.container.addEvent('keydown', key);
                    this.container.addEvent('keydown', key);
                }
            }
            else {
               this.container.onkeydown = key;
            }
        }


        // Flow object
        if (this._flowDragFriction > 0) {
            var onDrag = function (event) {
                var mouseX = event.clientX;
                var mouseY = event.clientY;
                
                if (this._verticalFlow) {
                    var dist = mouseY - this.Flow.mouseY; // px / or px per sec because _dragFlow wil be called in shorter intervalls if draged fast
                    var dim = this.Flow.dimensions.height;
                }
                else {
                    var dist = mouseX - this.Flow.mouseX; // px / or px per sec because _dragFlow wil be called in shorter intervalls if draged fast
                    var dim = this.Flow.dimensions.width;
                }
                var itemDist = (dist / dim )* (2*this._visibleItems +1); // items
                var target = this._currentPosition - itemDist * 2*this._visibleItems / this._flowDragFriction ;

                this.Flow.mouseX = mouseX; 
                this.Flow.mouseY = mouseY; 

                this.moveToPosition(target);
            }.bind(this);

            var beforeDrag = function () {};

            var afterDrag = function (event) {
                var t = Math.round(this._targetPosition);
                if (Math.abs( t - this._currentPosition) > 0.001 )
                    this.moveToPosition(t);
            }.bind(this);


            this.Flow.makeDraggable(onDrag, beforeDrag, afterDrag);
        }

        // Scrollbar Object
        if (this.Scrollbar) {
            var click = function(event) {
                if (!event) var event = window.event;

                if (!this.Scrollbar.clickLocked) {
                    var mouseX = event.clientX; 
                    var positionOnScrollbar = mouseX - this.Scrollbar.position.left;
                    var targetIndex = Math.round(positionOnScrollbar/this.Scrollbar.dimensions.width * this.itemsLastIndex);
                    this.moveToIndex(targetIndex);
                }
                else
                    this.Scrollbar.clickLocked = false;
            }.bind(this);
            this.Scrollbar.addObserver('click', click);
        }

        // Slider Object
        if (this.Slider) {
            // position slider on scrollbar
            this.Slider.setPosition = function (relPos) {
                relPos = relPos - Math.floor(relPos) + this._getIndexByPosition(Math.floor(relPos));
                if (Math.round(relPos) < 0)
                    relPos = this.itemsLastIndex;
                else if (relPos <= 0)
                    relPos = 0;
                else if (Math.round(relPos) > this.itemsLastIndex)
                    relPos = 0;
                else if (relPos >= this.itemsLastIndex)
                    relPos = this.itemsLastIndex;


                if (this.items.length > 1) {
                    var sPos = (relPos / this.itemsLastIndex)* this.Scrollbar.dimensions.width;
                } else {
                    var sPos = 0.5 * this.Scrollbar.dimensions.width;
                }
                this.Slider.style.left = sPos - this.Slider.center.x+ "px";
                this.Slider.style.top = this.Scrollbar.center.y - this.Slider.center.y +"px";

            }.bind(this);

            // make slider draggable
            var beforeDrag = function (event) {
                this.Scrollbar.clickLocked = true;
            }.bind(this);

            var onDrag = function (event) {
                var selectedIndex = this._checkIndex((event.clientX - this.Scrollbar.position.left) / this.Scrollbar.dimensions.width * this.itemsLastIndex);
                this._targetPosition = this._getPositionByIndex(selectedIndex);

                this.Slider.setPosition(selectedIndex);
                if (this.Position) this.Position.setLabel(selectedIndex);
                this._initStep(true);
            }.bind(this);

            var afterDrag = function (event) {
                this._targetPosition = Math.round(this._targetPosition);
                this._onMoveTo(this._getItemByPosition(this._targetPosition));
                this._initStep(true);
            }.bind(this);

            this.Slider.makeDraggable(onDrag, beforeDrag, afterDrag);
        }

                
        // Position object
        if (this.Position) {
            this.Position.setLabel = function (index) {
                index = this._checkIndex(Math.round(index))
                if (this.items && this.items[index].label)
                    this.Position.innerHTML = this.items[index].label.innerHTML;
                else
                    this.Position.innerHTML = index + 1;
                this.Position.style.left = (this.Slider.dimensions.width - this.Position.clientWidth)/2 + "px";
            }.bind(this);
        }


        this.globalCaption = this.container.getChildrenByClassName('globalCaption')[0];
        this.loadIndicator = this.container.getChildrenByClassName('loadIndicator')[0];
    },


    /* ---------- init element sizes ---------- */ 
    _initSizes: function (x) {

        if (this.Browser.Konqueror4 && x != true) {
            var t = this;
            window.setTimeout( function () { t._initSizes(true) }, 0);
            return;
        }

        // set height of container and flow
        if (this._verticalFlow) {
            if (this.containerOldHeight) this.container.style.width = this.containerOldHeight;
            if (this.FlowOldHeight) this.Flow.style.width = this.FlowOldHeight;
        } else {
            if (this.containerOldHeight) this.container.style.height = this.containerOldHeight;
            if (this.FlowOldHeight) this.Flow.style.height = this.FlowOldHeight;
        }
        this.containerOldHeight = "auto";
        this.FlowOldHeight = "auto";
        
        if (this._maxItemHeight <= 0) {
            if (this._verticalFlow) {
                this.maxHeight = this.Flow.clientHeight / 3 * screen.width/screen.height * this._scaleFactor;  // divided by 3 because of left/center/right, yes it's a magic number
                if (this.maxHeight == 0 || this.maxHeight > this.Flow.clientWidth)
                    this.maxHeight = this.Flow.clientWidth;

                if (this.container.style.width && this.container.style.width != "auto") {
                    this.maxHeight = this.container.clientWidth / this._scaleFactor; 
                    this.containerOldHeight = this.container.style.width;
                }
                if (this.Flow.style.width && this.Flow.style.width != "auto") {
                    this.maxHeight = this.Flow.clientWidth / this._scaleFactor;
                    this.FlowOldHeight = this.Flow.style.width;
                }
            } else {
                this.maxHeight = this.Flow.clientWidth / 3 * screen.height/screen.width * this._scaleFactor;  // divided by 3 because of left/center/right, yes it's a magic number

                if (this.container.style.height && this.container.style.height != "auto") {
                    this.maxHeight = this.container.clientHeight / (this._scaleFactor* (this._reflectionType != "none" ? 1 + this._reflectionHeight : 1)); 
                    this.containerOldHeight = this.container.style.height;
                }
                else if (this.Flow.style.height && this.Flow.style.height != "auto") {
                    this.maxHeight = this.Flow.clientHeight / (this._scaleFactor* (this._reflectionType != "none" ? 1 + this._reflectionHeight : 1));
                    this.FlowOldHeight = this.Flow.style.height;
                }
            }
        }
        else {
            this.maxHeight = this._maxItemHeight;
        }

        // correct height of container by space needed by scrollbar
        if (this.Scrollbar) {
            this.Scrollbar.setDimensions();
            var maxHeightCorrection = this.Scrollbar.dimensions.height;

            if (this.Slider) {
                this.Slider.setDimensions();
                maxHeightCorrection += this.Slider.dimensions.height;

                if (this.Position) {
                    if (this.Position.innerHTML == "")
                        this.Position.innerHTML="&nbsp;";
                    this.Position.setDimensions();
                    var extraSpace = this.Position.position.top - this.Slider.position.top;
                    if (extraSpace > 0) {
                        extraSpace += -this.Scrollbar.dimensions.height + this.Position.dimensions.height;
                        this.Scrollbar.style.marginBottom = extraSpace + "px";
                    }
                    else {
                        extraSpace *= -1;
                        this.Scrollbar.style.marginTop = extraSpace + "px";
                    }
                    maxHeightCorrection += extraSpace;
                }
            }
            if (this.container.style.height && this.container.style.height != "auto")
                this.maxHeight -= maxHeightCorrection; 
        }
        var maxItemSize = this._calcSize(this._biggestItemPos, 0);


        // set negative margin on flow
        if (this._reflectionType != "none") {

            if (this._verticalFlow) {
                this.Flow.style.width = maxItemSize.width + "px";
                this.Flow.style.height = 3* maxItemSize.width * (1 + this._reflectionHeight) + "px";
            } else {
                this.Flow.style.height = maxItemSize.height * (1 + this._reflectionHeight) + "px";
            }

            if (typeof(this._negativeMarginOnFloat) == "number") {
                this.Flow.style.marginBottom = -maxItemSize.height * (this._reflectionHeight * this._negativeMarginOnFloat)+ "px";
            } else {
                this.Flow.style.marginBottom = -maxItemSize.height * this._reflectionHeight+ "px";
            }

            this.Flow.dimensions = this.Flow.getDimensions();
            if (this.container.clientHeight < this.Flow.dimensions.height) {
                this.container.style.height = this.Flow.dimensions.height+"px";
            }

        } else {

            if (this._verticalFlow) {
                this.Flow.style.width = maxItemSize.width + "px";
                this.Flow.style.height = 3* maxItemSize.width + "px";
            } else {
                this.Flow.style.height = maxItemSize.height + "px";
            }
            this.Flow.style.marginBottom = "0";
        }

        this.Flow.dimensions = this.Flow.getDimensions();
        if (this._verticalFlow) {
            this.Flow.center = {x: this.Flow.dimensions.height/2, y:maxItemSize.width/2};
        } else {
            this.Flow.center = {x: this.Flow.dimensions.width/2, y:maxItemSize.height/2};
        }
    },



    /*
     * ==================== Key strok ====================
     */

    /*
     * handles keystroke events
     */
    _keyStroke: function(event) {
        if(!event) var event = window.event;

        if (event.which) {
            var keyCode = event.which;
        } else if (event.keyCode) {
            var keyCode = event.keyCode;
        }

        if (this._keys[keyCode]) {
            this._keys[keyCode].bind(this)();
            return Event.stop(event);
        }
        else {
            return true;
        }
    },
    
    /*
     * ==================== mouse wheel ====================
     * Event handler for mouse wheel event
     * http://adomas.org/javascript-mouse-wheel/
     */

    _wheel: function (event) {
        if (!event) var event = window.event; // MS
        
        var delta = 0;
        if (event.wheelDelta) {
            delta = event.wheelDelta/120; 
        } else if (event.detail) {
            delta = -event.detail/3;
        }

        if (delta) {
            var target = this._targetPosition ;
            if (delta < 0 ) {
                target += (1 * this._scrollWheelSpeed);
            } else {
                target -= (1 * this._scrollWheelSpeed);
            } 
            this.moveToPosition(Math.round(target));
        }

        return Event.stop(event);
    },


    /*
     * ==================== set global Caption ====================
     */
    _setGlobalCaption: function () {
        if (this.globalCaption) {
            this.globalCaption.innerHTML = '';
            if(this._activeItem && this._activeItem.caption)
                this.globalCaption.appendChild(this._activeItem.caption.cloneNode(true));
        }
    },

    /*
     * ==================== move items ====================
     */

    /*
     * intend to make a step 
     */
    _initStep: function (holdSlider) {
        if (this.Slider) {
            if(holdSlider) {
                this.Slider.locked = true;
            } else {
                this.Slider.locked = false;
            }
        }
        if (!this._stepLock) {
            this._stepLock = true;
            this._step();
        }
    },

    /*
     * make a step
     */
    _step: function () {

        var diff = this._targetPosition - this._currentPosition; 
        var absDiff = Math.abs(diff);
        if ( absDiff > 0.001) { // till activeItem is nearly at position 0

            this._currentPosition += this._flowSpeedFactor * this._calcStepWidth(diff, absDiff);

            var AI = this.items[(this._getIndexByPosition(this._currentPosition))];

            if (AI && AI != this._activeItem) {

                if (this._activeItem) this._activeItem.makeInactive();
                this._activeItem = AI;
                this._activeItem.makeActive();

                if(this.Position && !this.Slider.locked) {
                    this.Position.setLabel(this._activeItem.index);
                }

                this._setGlobalCaption();
            }
            
            this._positionItems();

            var st = this._step.bind(this);
            setTimeout(st,this._millisecondsPerStep);

        } else {
            if (this.Slider) this.Slider.locked = false;
            this._currentPosition = Math.round(this._currentPosition);
            if(this.Position && !this.Slider.locked && this._activeItem) {
                this.Position.setLabel(this._activeItem.index);
            }
            this._setGlobalCaption();
            this._positionItems();
            this._stepLock = false;
            if (this._activeItem) this._onReachTarget(this._activeItem);
        }

        if (this.Slider && !this.Slider.locked) {
            this.Slider.setPosition(this._currentPosition);
        }
    },
    
    /*
     * position items
     */
    _positionItems: function () {
        
        var start = this._currentPosition - this._visibleItems;
        var end = this._currentPosition + this._visibleItems;
        if (!this._circularFlow) {
            start = this._checkIndex(start);
            end = this._checkIndex(end);
        }

        for (var i=0; i<this.items.length; i++) {
            var p = this._getPositionByIndex(i);
            
            var item = this.items[i];
            var itemEl = this.items[i].element;
            itemEl.style.display = "none"; // don't show item, till all manipulations are done

            if (p < start || p > end) continue;

            /* Index and position relative to activeItem */
            var relativeIndex = Math.round(p - this._currentPosition);
            var relativePosition = Math.round(p) - this._currentPosition;
            var side = relativePosition < 0 ? -1 : 1;
            side *= relativePosition == 0 ? 0 : 1;

            var size = this._calcSize ( relativePosition, side );
            var coords = this._calcCoordinates ( relativePosition, side );
            var relItemPos = this._calcRelativeItemPosition( relativePosition, side, size );
            var zIndex = this._calcZIndex ( relativePosition, side, relativeIndex );
            var fontSize = this._calcFontSize ( relativePosition, side, size );
            //var opacity = this._calcOpacity(relativePosition, side);

            var mod = 0;
            /* set position */
            if (this._verticalFlow) {
                itemEl.style.left = coords.y + relItemPos.y * size.width/size.height + "px";
                itemEl.style.top = coords.x + relItemPos.x *size.height/size.width + "px";
            }
            else {
                if (this.Browser.IE6 && this._scaleFactorLandscape != 1 && item.content.origProportion < 1) {
                     mod = size.width/this._scaleFactorLandscape*0.5*item.content.origProportion ;
                }
                itemEl.style.left = coords.x + relItemPos.x - mod + "px";
                itemEl.style.top = coords.y + relItemPos.y + "px";
            }
            
            /* set size */
            if (this.Browser.IE) {
                itemEl.style.height = size.height*(1+this._reflectionHeight) +"px";
            }
            else {
                itemEl.style.height = size.height +"px";
            }
            itemEl.style.width = size.width +"px";

            if (( this.Browser.iPhone || this.Browser.IE6 || this.Browser.Konqueror4) && (this.items[i].image || this._reflectionWithinImage)) {
                item.positionContent(size, this.Browser.IE6);
            }

            //if (this.Browser.IE) {
                //item.element.style.filter = "alpha(opacity="+(Math.floor(opacity * 100))+")";
            //}
            //else
                //item.element.style.opacity = opacity;

            itemEl.style.zIndex = 32768 + zIndex; // just for FF
            itemEl.style.visibility = "visible";
            itemEl.style.display = "block";


        }
    }

};


/* ==================== extendig javascript/DOM objects ==================== */

/*
 *  adds bind method to Function class
 *  http://www.digital-web.com/articles/scope_in_javascript/
 */

if (!Function.bind) {
    Function.prototype.bind = function(obj) {
        var method = this;
        return function () {
            return method.apply(obj, arguments);
        };
    };
}


/*
 * extending Math object
 */
if (!Math.erf2) {
    // error function (http://en.wikipedia.org/wiki/Error_function), implemented as erf(x)^2
    Math.erf2 = function (x) {
        var a = - (8*(Math.PI -3)/(3*Math.PI*(Math.PI -4)));
        var x2 = x*x;
        var f = 1 - Math.pow(Math.E, -x2 * (4/Math.PI + a*x2)/(1+a*x2));
        return f;
    };
}

if (!Math._2PI05) {
    Math._2PI05 = Math.sqrt(2*Math.PI);
}

if (!Math.normDist) {
    // normal distribution
    Math.normDist = function (x, sig, mu) {
        if (!sig) var sig = 1;
        if (!mu) var mu = 0;
        if (!x) var x = - mu;
        return 1/(sig * Math._2PI05) * Math.pow(Math.E, - (x-mu)*(x-mu)/(2*sig*sig) );
    };
}

if (!Math.normedNormDist) {
    Math.normedNormDist = function (x, sig, mu) {
        return this.normDist(x, sig, mu)/this.normDist(mu, sig, mu);
    };
}

if (!Math.exp) {
    Math.exp = function(x) {
        return Math.pow(Math.E, x);
    };
}

if (!Math.ln) {
    Math.ln = Math.log;
}

if (!Math.log2) {
    Math.log2 = function (x) {
        return Math.log(x)/Math.LN2;
    };
}

if (!Math.log10) {
    Math.log10 = function (x) {
        return Math.log(x)/Math.LN10;
    };
}

if (!Math.logerithm) {
    Math.logerithm = function (x, b) {
        if (!b || b == Math.E)
            return Math.log(x);
        else if (b == 2)
            return Math.log2(x);
        else if (b == 10)
            return Math.log10(x);
        else
            return Math.log(x)/Math.log(b);
    };
}


/*
 * extending Event object
 */
if (!Event) var Event = {};

if (!Event.stop) {
    Event.stop = function (event) {
        event.cancelBubble = true;
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        return false;
    };
}

/*
 * extending Element object
 */
if (document.all && !window.opera) {
    window.$CF = function (el) {
        if (typeof el == "string") {
            return window.$CF(document.getElementById(el));
        }
        else {
            if (CFElement.prototype.extend && el && !el.extend) CFElement.prototype.extend(el);
        }
        return el;
    };
} else {
    window.$CF = function (el) {
        return el;
    };
}

if (!window.HTMLElement) {
    CFElement = {};
    CFElement.prototype = {};
    CFElement.prototype.extend = function (el) {
        for (var method in this) {
            if (!el[method]) el[method] = this[method];
        }
    };
}
else {
    CFElement = window.HTMLElement;
}


/*
 * Thanks to Peter-Paul Koch
 * http://www.quirksmode.org/js/findpos.html
 */
if (!CFElement.findPos) {
    CFElement.prototype.findPos = function() {
        var obj = this;
        var curleft = curtop = 0;
        if (obj.offsetParent) {
            curleft = obj.offsetLeft;
            curtop = obj.offsetTop;
            while (obj = obj.offsetParent) {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            }
        }
        return {left:curleft, top:curtop};
    };
}

if (!CFElement.getDimensions) {
    CFElement.prototype.getDimensions = function() {
        return {width: this.clientWidth, height: this.clientHeight};
    };
}

/*
 * checks if an element has the class className
 */
if (!CFElement.hasClassName) {
    CFElement.prototype.hasClassName = function(className) {
        return (new RegExp('\\b'+className+'\\b').test(this.className));
    };
}

/*
 * adds the class className to the element
 */ 
if (!CFElement.addClassName) {
    CFElement.prototype.addClassName = function(className) {
        if(!this.hasClassName(className)) {
           this.className += (this.className ? ' ':'') + className ;
        }
    };
}

/*
 * removes the class className from the element el
 */ 
if (!CFElement.removeClassName) {
    CFElement.prototype.removeClassName = function(className) {
        this.className = this.className.replace(new RegExp('\\b'+className+'\\b'), '').replace(/\s\s/g,' ');
    };
}

/*
 * removes or adds the class className from/to the element el
 * depending if the element has the class className or not.
 */
if (!CFElement.toggleClassName) {
    CFElement.prototype.toggleClassName = function(className) {
        if(this.hasClassName(className)) {
            this.removeClassName(className);
        } else {
            this.addClassName(className);
        }
    };
}

/*
 * returns all children of element el, which have the class className
 */
if (!CFElement.getChildrenByClassName) {
    CFElement.prototype.getChildrenByClassName = function(className) {
        var children = new Array();
        for (var i=0; i < this.childNodes.length; i++) {
            var c = this.childNodes[i];
            if (c.nodeType == 1 && $CF(c).hasClassName(className)) {
                children.push(c);
            }
        }
        return children;
    };
}

/*
 * Browser independent event handling method.
 * adds the eventListener  eventName to element el and attaches the function method to it.
 */
if (!CFElement.addEvent) {
    CFElement.prototype.addEvent = function(eventName, method, capture) {
        if (this.addEventListener)
            this.addEventListener(eventName, method, capture);
        else
            this.attachEvent('on'+eventName, method);
    };
}
   
/*
 * Browser independent event handling method.
 * removes the eventListener  eventName with the attached function method from element el.
 */
if (!CFElement.removeEvent) {
    CFElement.prototype.removeEvent = function(eventName, method, capture) {
        if (this.removeEventListener)
            this.removeEventListener(eventName, method, capture);
        else
            this.detachEvent('on'+eventName, method);
    };
}

/*
 * Browser independent event handling method.
 * adds the eventListener  eventName to element el and attaches the function method to it.
 */
if (!window.addEvent) {
    window.addEvent = function(eventName, method, capture) {
        if (this.addEventListener) {
            this.addEventListener(eventName, method, capture);
        } else {
            if (eventName != 'load' && eventName != 'resize')
                document.attachEvent('on'+eventName, method);
            else
                this.attachEvent('on'+eventName, method);
        }
    };
}
   
/*
 * Browser independent event handling method.
 * removes the eventListener  eventName with the attached function method from element el.
 */
if (!window.removeEvent) {
    window.removeEvent = function(eventName, method, capture) {
        if (this.removeEventListener) {
            this.removeEventListener(eventName, method, capture);
        } else {
            if (eventName != 'load' && eventName != 'resize')
                document.detachEvent('on'+eventName, method);
            else
                this.detachEvent('on'+eventName, method);
        }
    };
};

/* ==================== start it all up ==================== */
ContentFlowGlobal.init();

