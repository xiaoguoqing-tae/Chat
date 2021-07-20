/*!
 * better-scroll / shared-utils
 * (c) 2016-2020 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SharedUtils = {}));
}(this, (function (exports) { 'use strict';

  function warn(msg) {
      console.error("[BScroll warn]: " + msg);
  }
  function assert(condition, msg) {
      if (!condition) {
          throw new Error('[BScroll] ' + msg);
      }
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

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

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

  function getNow() {
      return window.performance &&
          window.performance.now &&
          window.performance.timing
          ? window.performance.now() + window.performance.timing.navigationStart
          : +new Date();
  }
  var extend = function (target, source) {
      for (var key in source) {
          target[key] = source[key];
      }
      return target;
  };
  function isUndef(v) {
      return v === undefined || v === null;
  }
  function getDistance(x, y) {
      return Math.sqrt(x * x + y * y);
  }
  function between(x, min, max) {
      if (x < min) {
          return min;
      }
      if (x > max) {
          return max;
      }
      return x;
  }

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
  function getElement(el) {
      return (typeof el === 'string'
          ? document.querySelector(el)
          : el);
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
  function offset(el) {
      var left = 0;
      var top = 0;
      while (el) {
          left -= el.offsetLeft;
          top -= el.offsetTop;
          el = el.offsetParent;
      }
      return {
          left: left,
          top: top,
      };
  }
  function offsetToBody(el) {
      var rect = el.getBoundingClientRect();
      return {
          left: -(rect.left + window.pageXOffset),
          top: -(rect.top + window.pageYOffset),
      };
  }
  var cssVendor = vendor && vendor !== 'standard' ? '-' + vendor.toLowerCase() + '-' : '';
  var transform = prefixStyle('transform');
  var transition = prefixStyle('transition');
  var hasPerspective = inBrowser && prefixStyle('perspective') in elementStyle;
  // fix issue #361
  var hasTouch = inBrowser && ('ontouchstart' in window || isWeChatDevTools);
  var hasTransition = inBrowser && transition in elementStyle;
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
  var eventTypeMap = {
      touchstart: 1,
      touchmove: 1,
      touchend: 1,
      mousedown: 2,
      mousemove: 2,
      mouseup: 2,
  };
  function getRect(el) {
      if (el instanceof window.SVGElement) {
          var rect = el.getBoundingClientRect();
          return {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
          };
      }
      else {
          return {
              top: el.offsetTop,
              left: el.offsetLeft,
              width: el.offsetWidth,
              height: el.offsetHeight,
          };
      }
  }
  function preventDefaultExceptionFn(el, exceptions) {
      for (var i in exceptions) {
          if (exceptions[i].test(el[i])) {
              return true;
          }
      }
      return false;
  }
  var tagExceptionFn = preventDefaultExceptionFn;
  function tap(e, eventName) {
      var ev = document.createEvent('Event');
      ev.initEvent(eventName, true, true);
      ev.pageX = e.pageX;
      ev.pageY = e.pageY;
      e.target.dispatchEvent(ev);
  }
  function click(e, event) {
      if (event === void 0) { event = 'click'; }
      var eventSource;
      if (e.type === 'mouseup') {
          eventSource = e;
      }
      else if (e.type === 'touchend' || e.type === 'touchcancel') {
          eventSource = e.changedTouches[0];
      }
      var posSrc = {};
      if (eventSource) {
          posSrc.screenX = eventSource.screenX || 0;
          posSrc.screenY = eventSource.screenY || 0;
          posSrc.clientX = eventSource.clientX || 0;
          posSrc.clientY = eventSource.clientY || 0;
      }
      var ev;
      var bubbles = true;
      var cancelable = true;
      var ctrlKey = e.ctrlKey, shiftKey = e.shiftKey, altKey = e.altKey, metaKey = e.metaKey;
      var pressedKeysMap = {
          ctrlKey: ctrlKey,
          shiftKey: shiftKey,
          altKey: altKey,
          metaKey: metaKey,
      };
      if (typeof MouseEvent !== 'undefined') {
          try {
              ev = new MouseEvent(event, extend(__assign({ bubbles: bubbles,
                  cancelable: cancelable }, pressedKeysMap), posSrc));
          }
          catch (e) {
              createEvent();
          }
      }
      else {
          createEvent();
      }
      function createEvent() {
          ev = document.createEvent('Event');
          ev.initEvent(event, bubbles, cancelable);
          extend(ev, posSrc);
      }
      // forwardedTouchEvent set to true in case of the conflict with fastclick
      ev.forwardedTouchEvent = true;
      ev._constructed = true;
      e.target.dispatchEvent(ev);
  }
  function dblclick(e) {
      click(e, 'dblclick');
  }
  function prepend(el, target) {
      var firstChild = target.firstChild;
      if (firstChild) {
          before(el, firstChild);
      }
      else {
          target.appendChild(el);
      }
  }
  function before(el, target) {
      target.parentNode.insertBefore(el, target);
  }
  function removeChild(el, child) {
      el.removeChild(child);
  }
  function hasClass(el, className) {
      var reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
      return reg.test(el.className);
  }
  function addClass(el, className) {
      if (hasClass(el, className)) {
          return;
      }
      var newClass = el.className.split(' ');
      newClass.push(className);
      el.className = newClass.join(' ');
  }
  function removeClass(el, className) {
      if (!hasClass(el, className)) {
          return;
      }
      var reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
      el.className = el.className.replace(reg, ' ');
  }

  var ease = {
      // easeOutQuint
      swipe: {
          style: 'cubic-bezier(0.23, 1, 0.32, 1)',
          fn: function (t) {
              return 1 + --t * t * t * t * t;
          }
      },
      // easeOutQuard
      swipeBounce: {
          style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fn: function (t) {
              return t * (2 - t);
          }
      },
      // easeOutQuart
      bounce: {
          style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
          fn: function (t) {
              return 1 - --t * t * t * t;
          }
      }
  };

  var DEFAULT_INTERVAL = 100 / 60;
  var windowCompat = inBrowser && window;
  function noop() { }
  var requestAnimationFrame = (function () {
      if (!inBrowser) {
          /* istanbul ignore if */
          return noop;
      }
      return (windowCompat.requestAnimationFrame ||
          windowCompat.webkitRequestAnimationFrame ||
          windowCompat.mozRequestAnimationFrame ||
          windowCompat.oRequestAnimationFrame ||
          // if all else fails, use setTimeout
          function (callback) {
              return window.setTimeout(callback, (callback.interval || DEFAULT_INTERVAL) / 2); // make interval as precise as possible.
          });
  })();
  var cancelAnimationFrame = (function () {
      if (!inBrowser) {
          /* istanbul ignore if */
          return noop;
      }
      return (windowCompat.cancelAnimationFrame ||
          windowCompat.webkitCancelAnimationFrame ||
          windowCompat.mozCancelAnimationFrame ||
          windowCompat.oCancelAnimationFrame ||
          function (id) {
              window.clearTimeout(id);
          });
  })();

  var noop$1 = function (val) { };
  var sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      get: noop$1,
      set: noop$1
  };
  var getProperty = function (obj, key) {
      var keys = key.split('.');
      for (var i = 0; i < keys.length - 1; i++) {
          obj = obj[keys[i]];
          if (typeof obj !== 'object' || !obj)
              return;
      }
      var lastKey = keys.pop();
      if (typeof obj[lastKey] === 'function') {
          return function () {
              return obj[lastKey].apply(obj, arguments);
          };
      }
      else {
          return obj[lastKey];
      }
  };
  var setProperty = function (obj, key, value) {
      var keys = key.split('.');
      var temp;
      for (var i = 0; i < keys.length - 1; i++) {
          temp = keys[i];
          if (!obj[temp])
              obj[temp] = {};
          obj = obj[temp];
      }
      obj[keys.pop()] = value;
  };
  function propertiesProxy(target, sourceKey, key) {
      sharedPropertyDefinition.get = function proxyGetter() {
          return getProperty(this, sourceKey);
      };
      sharedPropertyDefinition.set = function proxySetter(val) {
          setProperty(this, sourceKey, val);
      };
      Object.defineProperty(target, key, sharedPropertyDefinition);
  }

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

  exports.EventEmitter = EventEmitter;
  exports.EventRegister = EventRegister;
  exports.addClass = addClass;
  exports.addEvent = addEvent;
  exports.assert = assert;
  exports.before = before;
  exports.between = between;
  exports.cancelAnimationFrame = cancelAnimationFrame;
  exports.click = click;
  exports.cssVendor = cssVendor;
  exports.dblclick = dblclick;
  exports.ease = ease;
  exports.eventTypeMap = eventTypeMap;
  exports.extend = extend;
  exports.getDistance = getDistance;
  exports.getElement = getElement;
  exports.getNow = getNow;
  exports.getRect = getRect;
  exports.hasClass = hasClass;
  exports.hasPerspective = hasPerspective;
  exports.hasTouch = hasTouch;
  exports.hasTransition = hasTransition;
  exports.inBrowser = inBrowser;
  exports.isAndroid = isAndroid;
  exports.isIOSBadVersion = isIOSBadVersion;
  exports.isUndef = isUndef;
  exports.isWeChatDevTools = isWeChatDevTools;
  exports.offset = offset;
  exports.offsetToBody = offsetToBody;
  exports.prepend = prepend;
  exports.preventDefaultExceptionFn = preventDefaultExceptionFn;
  exports.propertiesProxy = propertiesProxy;
  exports.removeChild = removeChild;
  exports.removeClass = removeClass;
  exports.removeEvent = removeEvent;
  exports.requestAnimationFrame = requestAnimationFrame;
  exports.style = style;
  exports.tagExceptionFn = tagExceptionFn;
  exports.tap = tap;
  exports.ua = ua;
  exports.warn = warn;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
