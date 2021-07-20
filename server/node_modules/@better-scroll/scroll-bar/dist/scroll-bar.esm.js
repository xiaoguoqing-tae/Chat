/*!
 * better-scroll / scroll-bar
 * (c) 2016-2020 ustbhuangyi
 * Released under the MIT License.
 */
function warn(msg) {
    console.error("[BScroll warn]: " + msg);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

// ssr support
var inBrowser = typeof window !== 'undefined';
var ua = inBrowser && navigator.userAgent.toLowerCase();
var isWeChatDevTools = !!(ua && /wechatdevtools/.test(ua));
var isAndroid = ua && ua.indexOf('android') > 0;
var isIOSBadVersion = (function () {
    if (typeof ua === 'string') {
        var regex = /os (\d\d?_\d(_\d)?)/;
        var matches = regex.exec(ua);
        if (!matches)
            return false;
        var parts = matches[1].split('_').map(function (item) {
            return parseInt(item, 10);
        });
        // ios version >= 13.4 issue 982
        return !!(parts[0] >= 13 && parts[1] >= 4);
    }
    return false;
})();

var elementStyle = (inBrowser &&
    document.createElement('div').style);
var vendor = (function () {
    if (!inBrowser) {
        return false;
    }
    var transformNames = [
        {
            key: 'standard',
            value: 'transform',
        },
        {
            key: 'webkit',
            value: 'webkitTransform',
        },
        {
            key: 'Moz',
            value: 'MozTransform',
        },
        {
            key: 'O',
            value: 'OTransform',
        },
        {
            key: 'ms',
            value: 'msTransform',
        },
    ];
    for (var _i = 0, transformNames_1 = transformNames; _i < transformNames_1.length; _i++) {
        var obj = transformNames_1[_i];
        if (elementStyle[obj.value] !== undefined) {
            return obj.key;
        }
    }
    return false;
})();
function prefixStyle(style) {
    if (vendor === false) {
        return style;
    }
    if (vendor === 'standard') {
        if (style === 'transitionEnd') {
            return 'transitionend';
        }
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
function addEvent(el, type, fn, capture) {
    el.addEventListener(type, fn, {
        passive: false,
        capture: !!capture,
    });
}
function removeEvent(el, type, fn, capture) {
    el.removeEventListener(type, fn, {
        capture: !!capture,
    });
}
var cssVendor = vendor && vendor !== 'standard' ? '-' + vendor.toLowerCase() + '-' : '';
var transform = prefixStyle('transform');
var transition = prefixStyle('transition');
var hasPerspective = inBrowser && prefixStyle('perspective') in elementStyle;
var style = {
    transform: transform,
    transition: transition,
    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
    transitionDuration: prefixStyle('transitionDuration'),
    transitionDelay: prefixStyle('transitionDelay'),
    transformOrigin: prefixStyle('transformOrigin'),
    transitionEnd: prefixStyle('transitionEnd'),
    transitionProperty: prefixStyle('transitionProperty'),
};

var EventEmitter = /** @class */ (function () {
    function EventEmitter(names) {
        this.events = {};
        this.eventTypes = {};
        this.registerType(names);
    }
    EventEmitter.prototype.on = function (type, fn, context) {
        if (context === void 0) { context = this; }
        this.hasType(type);
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].push([fn, context]);
        return this;
    };
    EventEmitter.prototype.once = function (type, fn, context) {
        var _this = this;
        if (context === void 0) { context = this; }
        this.hasType(type);
        var magic = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.off(type, magic);
            fn.apply(context, args);
        };
        magic.fn = fn;
        this.on(type, magic);
        return this;
    };
    EventEmitter.prototype.off = function (type, fn) {
        if (!type && !fn) {
            this.events = {};
            return this;
        }
        if (type) {
            this.hasType(type);
            if (!fn) {
                this.events[type] = [];
                return this;
            }
            var events = this.events[type];
            if (!events) {
                return this;
            }
            var count = events.length;
            while (count--) {
                if (events[count][0] === fn ||
                    (events[count][0] && events[count][0].fn === fn)) {
                    events.splice(count, 1);
                }
            }
            return this;
        }
    };
    EventEmitter.prototype.trigger = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.hasType(type);
        var events = this.events[type];
        if (!events) {
            return;
        }
        var len = events.length;
        var eventsCopy = __spreadArrays(events);
        var ret;
        for (var i = 0; i < len; i++) {
            var event_1 = eventsCopy[i];
            var fn = event_1[0], context = event_1[1];
            if (fn) {
                ret = fn.apply(context, args);
                if (ret === true) {
                    return ret;
                }
            }
        }
    };
    EventEmitter.prototype.registerType = function (names) {
        var _this = this;
        names.forEach(function (type) {
            _this.eventTypes[type] = type;
        });
    };
    EventEmitter.prototype.destroy = function () {
        this.events = {};
        this.eventTypes = {};
    };
    EventEmitter.prototype.hasType = function (type) {
        var types = this.eventTypes;
        var isType = types[type] === type;
        if (!isType) {
            warn("EventEmitter has used unknown event type: \"" + type + "\", should be oneof [" +
                ("" + Object.keys(types).map(function (_) { return JSON.stringify(_); })) +
                "]");
        }
    };
    return EventEmitter;
}());
var EventRegister = /** @class */ (function () {
    function EventRegister(wrapper, events) {
        this.wrapper = wrapper;
        this.events = events;
        this.addDOMEvents();
    }
    EventRegister.prototype.destroy = function () {
        this.removeDOMEvents();
        this.events = [];
    };
    EventRegister.prototype.addDOMEvents = function () {
        this.handleDOMEvents(addEvent);
    };
    EventRegister.prototype.removeDOMEvents = function () {
        this.handleDOMEvents(removeEvent);
    };
    EventRegister.prototype.handleDOMEvents = function (eventOperation) {
        var _this = this;
        var wrapper = this.wrapper;
        this.events.forEach(function (event) {
            eventOperation(wrapper, event.name, _this, !!event.capture);
        });
    };
    EventRegister.prototype.handleEvent = function (e) {
        var eventType = e.type;
        this.events.some(function (event) {
            if (event.name === eventType) {
                event.handler(e);
                return true;
            }
            return false;
        });
    };
    return EventRegister;
}());

var EventHandler = /** @class */ (function () {
    function EventHandler(indicator, options) {
        this.indicator = indicator;
        this.options = options;
        this.bscroll = indicator.bscroll;
        this.startEventRegister = new EventRegister(this.indicator.el, [
            {
                name: options.disableMouse ? 'touchstart' : 'mousedown',
                handler: this._start.bind(this)
            }
        ]);
        this.endEventRegister = new EventRegister(window, [
            {
                name: options.disableMouse ? 'touchend' : 'mouseup',
                handler: this._end.bind(this)
            }
        ]);
        this.hooks = new EventEmitter(['touchStart', 'touchMove', 'touchEnd']);
    }
    EventHandler.prototype._start = function (e) {
        if (!this.bscroll.scroller.actions.enabled) {
            return;
        }
        var point = (e.touches ? e.touches[0] : e);
        e.preventDefault();
        e.stopPropagation();
        this.initiated = true;
        this.moved = false;
        this.lastPoint = point[this.indicator.keysMap.pointPos];
        var disableMouse = this.bscroll.options.disableMouse;
        this.moveEventRegister = new EventRegister(window, [
            {
                name: disableMouse ? 'touchmove' : 'mousemove',
                handler: this._move.bind(this)
            }
        ]);
        this.hooks.trigger('touchStart');
    };
    EventHandler.prototype._move = function (e) {
        var point = (e.touches ? e.touches[0] : e);
        var pointPos = point[this.indicator.keysMap.pointPos];
        e.preventDefault();
        e.stopPropagation();
        var delta = pointPos - this.lastPoint;
        this.lastPoint = pointPos;
        if (!this.moved) {
            this.hooks.trigger('touchMove', this.moved, delta);
            this.moved = true;
            return;
        }
        this.hooks.trigger('touchMove', this.moved, delta);
    };
    EventHandler.prototype._end = function (e) {
        if (!this.initiated) {
            return;
        }
        this.initiated = false;
        e.preventDefault();
        e.stopPropagation();
        this.moveEventRegister.destroy();
        this.hooks.trigger('touchEnd', this.moved);
    };
    EventHandler.prototype.destroy = function () {
        this.startEventRegister.destroy();
        this.moveEventRegister && this.moveEventRegister.destroy();
        this.endEventRegister.destroy();
    };
    return EventHandler;
}());

var INDICATOR_MIN_LEN = 8;
var Indicator = /** @class */ (function () {
    function Indicator(bscroll, options) {
        this.bscroll = bscroll;
        this.options = options;
        this.keyVals = {
            sizeRatio: 1,
            maxPos: 0,
            initialSize: 0,
        };
        this.curPos = 0;
        this.hooksHandlers = [];
        this.wrapper = options.wrapper;
        this.wrapperStyle = this.wrapper.style;
        this.el = this.wrapper.children[0];
        this.elStyle = this.el.style;
        this.direction = options.direction;
        this.keysMap = this._getKeysMap();
        if (options.fade) {
            this.visible = 0;
            this.wrapperStyle.opacity = '0';
        }
        else {
            this.visible = 1;
        }
        this._listenHooks(options.fade, options.interactive);
        this.refresh();
    }
    Indicator.prototype._listenHooks = function (fade, interactive) {
        var _this = this;
        var bscroll = this.bscroll;
        var bscrollHooks = bscroll;
        var translaterHooks = bscroll.scroller.translater.hooks;
        var animaterHooks = bscroll.scroller.animater.hooks;
        this._listen(bscrollHooks, 'refresh', this.refresh);
        this._listen(translaterHooks, 'translate', this.updatePosAndSize);
        this._listen(animaterHooks, 'time', function (time) {
            _this.setTransitionTime(time);
        });
        this._listen(animaterHooks, 'timeFunction', function (ease) {
            _this.setTransitionTimingFunction(ease);
        });
        if (fade) {
            this._listen(bscrollHooks, 'scrollEnd', function () {
                _this.fade();
            });
            this._listen(bscrollHooks, 'scrollStart', function () {
                _this.fade(true);
            });
            // for mousewheel event
            if (bscroll.eventTypes.mousewheelStart &&
                bscroll.eventTypes.mousewheelEnd) {
                this._listen(bscrollHooks, 'mousewheelStart', function () {
                    _this.fade(true);
                });
                this._listen(bscrollHooks, 'mousewheelEnd', function () {
                    _this.fade();
                });
            }
        }
        if (interactive) {
            var disableMouse = this.bscroll.options.disableMouse;
            this.eventHandler = new EventHandler(this, { disableMouse: disableMouse });
            var eventHandlerHooks = this.eventHandler.hooks;
            this._listen(eventHandlerHooks, 'touchStart', this.startHandler);
            this._listen(eventHandlerHooks, 'touchMove', this.moveHandler);
            this._listen(eventHandlerHooks, 'touchEnd', this.endHandler);
        }
    };
    Indicator.prototype._getKeysMap = function () {
        if (this.direction === "vertical" /* Vertical */) {
            return {
                hasScroll: 'hasVerticalScroll',
                size: 'height',
                wrapperSize: 'clientHeight',
                scrollerSize: 'scrollerHeight',
                maxScroll: 'maxScrollY',
                pos: 'y',
                pointPos: 'pageY',
                translate: 'translateY',
            };
        }
        return {
            hasScroll: 'hasHorizontalScroll',
            size: 'width',
            wrapperSize: 'clientWidth',
            scrollerSize: 'scrollerWidth',
            maxScroll: 'maxScrollX',
            pos: 'x',
            pointPos: 'pageX',
            translate: 'translateX',
        };
    };
    Indicator.prototype.fade = function (visible) {
        var time = visible ? 250 : 500;
        this.wrapperStyle[style.transitionDuration] = time + 'ms';
        this.wrapperStyle.opacity = visible ? '1' : '0';
        this.visible = visible ? 1 : 0;
    };
    Indicator.prototype.refresh = function () {
        var hasScroll = this.keysMap.hasScroll;
        if (this._setShowBy(this.bscroll[hasScroll])) {
            var _a = this.keysMap, wrapperSize = _a.wrapperSize, scrollerSize = _a.scrollerSize, maxScroll = _a.maxScroll;
            this.keyVals = this._refreshKeyValues(this.wrapper[wrapperSize], this.bscroll[scrollerSize], this.bscroll[maxScroll]);
            this.updatePosAndSize({
                x: this.bscroll.x,
                y: this.bscroll.y,
            });
        }
    };
    Indicator.prototype._setShowBy = function (hasScroll) {
        if (hasScroll) {
            this.wrapper.style.display = '';
            return true;
        }
        this.wrapper.style.display = 'none';
        return false;
    };
    Indicator.prototype._refreshKeyValues = function (wrapperSize, scrollerSize, maxScroll) {
        var initialSize = Math.max(Math.round((wrapperSize * wrapperSize) / (scrollerSize || wrapperSize || 1)), INDICATOR_MIN_LEN);
        var maxPos = wrapperSize - initialSize;
        // sizeRatio is negative
        var sizeRatio = maxPos / maxScroll;
        return {
            initialSize: initialSize,
            maxPos: maxPos,
            sizeRatio: sizeRatio,
        };
    };
    Indicator.prototype.updatePosAndSize = function (endPoint) {
        var _a = this._refreshPosAndSizeValue(endPoint, this.keyVals), pos = _a.pos, size = _a.size;
        this.curPos = pos;
        this._refreshPosAndSizeStyle(size, pos);
    };
    Indicator.prototype._refreshPosAndSizeValue = function (endPoint, keyVals) {
        var posKey = this.keysMap.pos;
        var sizeRatio = keyVals.sizeRatio, initialSize = keyVals.initialSize, maxPos = keyVals.maxPos;
        var pos = Math.round(sizeRatio * endPoint[posKey]);
        var size;
        if (pos < 0) {
            size = Math.max(initialSize + pos * 3, INDICATOR_MIN_LEN);
            pos = 0;
        }
        else if (pos > maxPos) {
            size = Math.max(initialSize - (pos - maxPos) * 3, INDICATOR_MIN_LEN);
            pos = maxPos + initialSize - size;
        }
        else {
            size = initialSize;
        }
        return {
            pos: pos,
            size: size,
        };
    };
    Indicator.prototype._refreshPosAndSizeStyle = function (size, pos) {
        var _a = this.keysMap, translate = _a.translate, sizeKey = _a.size;
        this.elStyle[sizeKey] = size + "px";
        this.elStyle[style.transform] = translate + "(" + pos + "px)" + this.bscroll.options.translateZ;
    };
    Indicator.prototype.setTransitionTime = function (time) {
        if (time === void 0) { time = 0; }
        this.elStyle[style.transitionDuration] = time + 'ms';
    };
    Indicator.prototype.setTransitionTimingFunction = function (easing) {
        this.elStyle[style.transitionTimingFunction] = easing;
    };
    Indicator.prototype.startHandler = function () {
        this.setTransitionTime();
        this.bscroll.trigger('beforeScrollStart');
    };
    Indicator.prototype.moveHandler = function (moved, delta) {
        if (!moved) {
            this.bscroll.trigger('scrollStart');
        }
        var newScrollPos = this._calScrollDesPos(this.curPos, delta, this.keyVals);
        // TODO freeScroll ？
        if (this.direction === "vertical" /* Vertical */) {
            this.bscroll.scrollTo(this.bscroll.x, newScrollPos);
        }
        else {
            this.bscroll.scrollTo(newScrollPos, this.bscroll.y);
        }
        this.bscroll.trigger('scroll', {
            x: this.bscroll.x,
            y: this.bscroll.y,
        });
    };
    Indicator.prototype._calScrollDesPos = function (curPos, delta, keyVals) {
        var maxPos = keyVals.maxPos, sizeRatio = keyVals.sizeRatio;
        var newPos = curPos + delta;
        if (newPos < 0) {
            newPos = 0;
        }
        else if (newPos > maxPos) {
            newPos = maxPos;
        }
        return Math.round(newPos / sizeRatio);
    };
    Indicator.prototype.endHandler = function (moved) {
        if (moved) {
            this.bscroll.trigger('scrollEnd', {
                x: this.bscroll.x,
                y: this.bscroll.y,
            });
        }
    };
    Indicator.prototype.destroy = function () {
        if (this.options.interactive) {
            this.eventHandler.destroy();
        }
        this.wrapper.parentNode.removeChild(this.wrapper);
        this.hooksHandlers.forEach(function (item) {
            var hooks = item[0];
            var hooksName = item[1];
            var handlerFn = item[2];
            hooks.off(hooksName, handlerFn);
        });
        this.hooksHandlers.length = 0;
    };
    Indicator.prototype._listen = function (hooks, name, handler) {
        hooks.on(name, handler, this);
        this.hooksHandlers.push([hooks, name, handler]);
    };
    return Indicator;
}());

var ScrollBar = /** @class */ (function () {
    function ScrollBar(scroll) {
        this.indicators = [];
        this.indicators = this.createIndicators(scroll);
        scroll.on(scroll.eventTypes.destroy, this.destroy, this);
    }
    ScrollBar.prototype.createIndicators = function (bscroll) {
        var _this = this;
        var _a = bscroll.options
            .scrollbar, _b = _a.fade, fade = _b === void 0 ? true : _b, _c = _a.interactive, interactive = _c === void 0 ? false : _c;
        var indicatorOption;
        var scrolls = {
            scrollX: "horizontal" /* Horizontal */,
            scrollY: "vertical" /* Vertical */,
        };
        var indicators = [];
        Object.keys(scrolls).forEach(function (key) {
            var direction = scrolls[key];
            if (bscroll.options[key]) {
                indicatorOption = {
                    wrapper: _this.createIndicatorElement(direction),
                    direction: direction,
                    fade: fade,
                    interactive: interactive,
                };
                bscroll.wrapper.appendChild(indicatorOption.wrapper);
                indicators.push(new Indicator(bscroll, indicatorOption));
            }
        });
        return indicators;
    };
    ScrollBar.prototype.createIndicatorElement = function (direction) {
        var scrollbarEl = document.createElement('div');
        var indicatorEl = document.createElement('div');
        scrollbarEl.style.cssText =
            'position:absolute;z-index:9999;pointerEvents:none';
        indicatorEl.style.cssText =
            'box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px;';
        indicatorEl.className = 'bscroll-indicator';
        if (direction === 'horizontal') {
            scrollbarEl.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
            indicatorEl.style.height = '100%';
            scrollbarEl.className = 'bscroll-horizontal-scrollbar';
        }
        else {
            scrollbarEl.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
            indicatorEl.style.width = '100%';
            scrollbarEl.className = 'bscroll-vertical-scrollbar';
        }
        scrollbarEl.style.cssText += ';overflow:hidden';
        scrollbarEl.appendChild(indicatorEl);
        return scrollbarEl;
    };
    ScrollBar.prototype.destroy = function () {
        for (var _i = 0, _a = this.indicators; _i < _a.length; _i++) {
            var indicator = _a[_i];
            indicator.destroy();
        }
    };
    ScrollBar.pluginName = 'scrollbar';
    return ScrollBar;
}());

export default ScrollBar;
