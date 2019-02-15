var FxpScroller = (function (exports, $$1) {
  'use strict';

  $$1 = $$1 && $$1.hasOwnProperty('default') ? $$1['default'] : $$1;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  /**
   * Define the class as Jquery plugin.
   *
   * @param {String}      pluginName  The name of jquery plugin defined in $.fn
   * @param {String}      dataName    The key name of jquery data
   * @param {function}    ClassName   The class name
   * @param {boolean}     [shorthand] Check if the shorthand of jquery plugin must be added
   * @param {String|null} dataApiAttr The DOM data attribute selector name to init the jquery plugin with Data API, NULL to disable
   * @param {String}      removeName  The method name to remove the plugin data
   */

  function pluginify (pluginName, dataName, ClassName) {
    var shorthand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var dataApiAttr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var removeName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'destroy';
    var old = $$1.fn[pluginName];

    $$1.fn[pluginName] = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var resFunc, resList;
      resList = this.each(function (i, element) {
        var $this = $$1(element),
            data = $this.data(dataName);

        if (!data) {
          data = new ClassName(element, _typeof(options) === 'object' ? options : {});
          $this.data(dataName, data);
        }

        if (typeof options === 'string' && data) {
          if (data[options]) {
            resFunc = data[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          } else if (data.constructor[options]) {
            resFunc = data.constructor[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          }

          if (options === removeName) {
            $this.removeData(dataName);
          }
        }
      });
      return 1 === resList.length && undefined !== resFunc ? resFunc : resList;
    };

    $$1.fn[pluginName].Constructor = ClassName; // Shorthand

    if (shorthand) {
      $$1[pluginName] = function (options) {
        return $$1({})[pluginName](options);
      };
    } // No conflict


    $$1.fn[pluginName].noConflict = function () {
      return $$1.fn[pluginName] = old;
    }; // Data API


    if (null !== dataApiAttr) {
      $$1(window).on('load', function () {
        $$1(dataApiAttr).each(function () {
          var $this = $$1(this);
          $$1.fn[pluginName].call($this, $this.data());
        });
      });
    }
  }

  var DEFAULT_OPTIONS = {};
  /**
   * Base class for plugin.
   */

  var BasePlugin =
  /*#__PURE__*/
  function () {
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function BasePlugin(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, BasePlugin);

      this.guid = $$1.guid;
      this.options = $$1.extend(true, {}, this.constructor.defaultOptions, options);
      this.$element = $$1(element);
    }
    /**
     * Destroy the instance.
     */


    _createClass(BasePlugin, [{
      key: "destroy",
      value: function destroy() {
        var self = this;
        Object.keys(self).forEach(function (key) {
          delete self[key];
        });
      }
      /**
       * Set the default options.
       * The new values are merged with the existing values.
       *
       * @param {object} options
       */

    }], [{
      key: "defaultOptions",
      set: function set(options) {
        DEFAULT_OPTIONS[this.name] = $$1.extend(true, {}, DEFAULT_OPTIONS[this.name], options);
      }
      /**
       * Get the default options.
       *
       * @return {object}
       */
      ,
      get: function get() {
        if (undefined === DEFAULT_OPTIONS[this.name]) {
          DEFAULT_OPTIONS[this.name] = {};
        }

        return DEFAULT_OPTIONS[this.name];
      }
    }]);

    return BasePlugin;
  }();

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */

  /**
   * Wraps the content.
   *
   * @param {Scroller} self The scroller instance
   *
   * @return {jQuery} The content
   */
  function wrapContent(self) {
    var opts = self.options,
        contentCss = {},
        $content = $('<div class="' + opts.contentClass + '"></div>'),
        contentMarginDirection = 'right',
        scrollType = self.nativeScrollbarSize > 0 ? 'scroll' : 'auto';

    if (null !== self.options.contentSelector) {
      $content = $(self.options.contentSelector, self.$element);
      $content.addClass(self.options.contentClass);
    }

    contentMarginDirection = 'rtl' === $content.css('direction') ? 'left' : contentMarginDirection;
    contentCss.position = 'relative';
    contentCss.display = 'block';
    contentCss.overflow = 'hidden';
    contentCss['-webkit-transform'] = 'translate3d(0, 0, 0)';
    contentCss['transform'] = 'translate3d(0, 0, 0)';

    if (self.isVertical) {
      contentCss.width = 'auto';
      contentCss.height = '100%';
      contentCss['overflow-x'] = 'hidden';
      contentCss['overflow-y'] = scrollType;
      contentCss['margin-' + contentMarginDirection] = -self.nativeScrollbarSize + 'px';
    } else {
      contentCss.width = '100%';
      contentCss.height = 'auto';
      contentCss['overflow-x'] = scrollType;
      contentCss['overflow-y'] = 'hidden';
      contentCss['margin-bottom'] = -self.nativeScrollbarSize + 'px';
    }

    $content.css(contentCss);
    self.$element.css({
      'position': 'relative',
      'overflow': 'hidden'
    });

    if (null === self.options.contentSelector) {
      self.$element.children().each(function () {
        $content.append(this);
      });
      self.$element.append($content);
    }

    return $content;
  }
  /**
   * Unwraps the content.
   *
   * @param {Scroller} self The scroller instance
   *
   * @return null
   */

  function unwrapContent(self) {
    if (undefined !== self.$scrollbar) {
      self.$scrollbar.remove();
    }

    self.$element.css({
      'position': '',
      'overflow': ''
    });

    if (null === self.options.contentSelector) {
      self.$content.remove();
      self.$content.children().each(function () {
        self.$element.append(this);
      });
      return null;
    }

    self.$content.removeClass(self.options.contentClass).css({
      'position': '',
      'display': '',
      'overflow': '',
      'width': '',
      'height': '',
      'margin-left': '',
      'margin-right': '',
      'margin-bottom': '',
      '-webkit-transform': '',
      'transform': ''
    });
    return null;
  }

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */

  /**
   * Vertical scrollbar direction.
   */
  var DIRECTION_VERTICAL = 'vertical';

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */
  /**
   * Validate the options.
   *
   * @param {Scroller} self
   * @param {Object}   options
   */

  function validateOptions(self, options) {
    var autoConf = options.autoConfig;

    if (autoConf && 0 === self.nativeScrollbarSize) {
      options.scrollbar = false;
    }

    if (options.direction !== DIRECTION_VERTICAL) {
      options.scrollerStickyHeader = false;
    }
  }

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */

  /**
   * Trigger the event.
   *
   * @param {String} name The event name
   *
   * @param {Scroller} self The scroller instance
   */
  function trigger(name, self) {
    var event = $.Event(name + '.fxp.scroller');
    event.hammerScroll = self;
    self.$element.trigger(event);
  }
  /**
   * Action on scrolling.
   *
   * @param {jQuery.Event|Event} event
   */


  function onScrolling(event) {
    var self = event.data;
    self.refreshScrollbarPosition(event);

    if (undefined !== self.stickyHeader) {
      self.stickyHeader.checkPosition();
    }

    trigger('scrolling', self);
  }
  /**
   * Action on mouse scroll event and prevent the mouse scrolling.
   *
   * @param {jQuery.Event|Event} event
   */

  function onPreventMouseScroll(event) {
    var self = event.data,
        delta,
        position,
        maxPosition;
    delta = event.originalEvent.type === 'DOMMouseScroll' ? event.originalEvent.detail * -40 : event.originalEvent.wheelDelta;
    position = self.getScrollPosition();
    maxPosition = self.isVertical ? self.$content.get(0).scrollHeight - self.$content.innerHeight() : self.$content.get(0).scrollWidth - self.$content.innerWidth();

    if (self.isVertical || !self.isVertical && event.shiftKey) {
      if (delta > 0 && position <= 0 || delta < 0 && position >= maxPosition) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */

  /**
   * Get the width of native scrollbar.
   *
   * @returns {Number}
   *
   * @private
   */
  function getNativeScrollWidth() {
    var sbDiv = document.createElement("div"),
        size;
    sbDiv.style.width = '100px';
    sbDiv.style.height = '100px';
    sbDiv.style.overflow = 'scroll';
    sbDiv.style.position = 'absolute';
    sbDiv.style.top = '-9999px';
    document.body.appendChild(sbDiv);
    size = sbDiv.offsetWidth - sbDiv.clientWidth;
    document.body.removeChild(sbDiv);
    return size;
  }
  /**
   * Creates the scrollbar.
   *
   * @param {Scroller} self      The scroller instance
   * @param {String}   direction The direction
   *
   * @return {jQuery} The scrollbar
   */

  function generateScrollbar(self, direction) {
    var $scrollbar = $('<div class="scroller-scrollbar ' + direction + '"></div>');

    if (self.options.scrollbarInverse) {
      $scrollbar.addClass('scroller-inverse');
    }

    self.$element.prepend($scrollbar);
    return $scrollbar;
  }

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */

  /**
   * Changes the css transform configuration on target element.
   *
   * @param {jQuery} $target   The element to edited
   * @param {string} transform The css transform configuration of target
   */
  function changeTransform($target, transform) {
    $target.css('-webkit-transform', transform);
    $target.css('transform', transform);
  }
  /**
   * Translate the jquery element with Translate 3D CSS.
   *
   * @param {jQuery } $target  The jquery element
   * @param {Boolean} vertical Check if the vertical direction
   * @param {Number}  delta    The delta of translate
   */

  function changeTranslate($target, vertical, delta) {
    var trans = vertical ? '0px, ' + delta + 'px, 0px' : delta + 'px, 0px, 0px';
    changeTransform($target, 'translate3d(' + trans + ')');
  }

  /**
   * Scroller class.
   */

  var Scroller =
  /*#__PURE__*/
  function (_BasePlugin) {
    _inherits(Scroller, _BasePlugin);

    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function Scroller(element) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Scroller);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Scroller).call(this, element, options));
      _this.nativeScrollbarSize = getNativeScrollWidth();
      validateOptions(_assertThisInitialized(_assertThisInitialized(_this)), _this.options);
      _this.isVertical = _this.options.direction === DIRECTION_VERTICAL;
      _this.$content = wrapContent(_assertThisInitialized(_assertThisInitialized(_this)));

      if (_this.options.preventMouseScroll) {
        _this.$element.on('DOMMouseScroll.fxp.scroller mousewheel.fxp.scroller', null, _assertThisInitialized(_assertThisInitialized(_this)), onPreventMouseScroll);
      }

      if (_this.options.scrollbar) {
        _this.$scrollbar = generateScrollbar(_assertThisInitialized(_assertThisInitialized(_this)), _this.options.direction);
        $$1(window).on('resize.fxp.scroller-bar' + _this.guid, null, _assertThisInitialized(_assertThisInitialized(_this)), _this.resizeScrollbar);
      }

      _this.$content.on('scroll.fxp.scroller', null, _assertThisInitialized(_assertThisInitialized(_this)), onScrolling);

      if (_this.options.scrollerStickyHeader && $$1.fn.stickyHeader) {
        _this.stickyHeader = _this.$element.stickyHeader(_this.options.stickyOptions).data('fxp.stickyheader');
      }

      _this.resizeScrollbar();

      return _this;
    }
    /**
     * Set the vertical/horizontal scroll position.
     *
     * @param {Number} position The position
     *
     * @return {Number}
     */


    _createClass(Scroller, [{
      key: "setScrollPosition",
      value: function setScrollPosition(position) {
        return this.isVertical ? this.$content.scrollTop(position) : this.$content.scrollLeft(position);
      }
      /**
       * Get the vertical/horizontal scroll position.
       *
       * @returns {Number}
       */

    }, {
      key: "getScrollPosition",
      value: function getScrollPosition() {
        return this.isVertical ? this.$content.scrollTop() : this.$content.scrollLeft();
      }
      /**
       * Get the vertical/horizontal max scroll position.
       *
       * @returns {Number}
       */

    }, {
      key: "getMaxScrollPosition",
      value: function getMaxScrollPosition() {
        return this.isVertical ? this.$content.get(0).scrollHeight - this.$content.innerHeight() : this.$content.get(0).scrollWidth - this.$content.innerWidth();
      }
      /**
       * On resize scrollbar action.
       *
       * @param {jQuery.Event|Event} [event]
       *
       * @typedef {Scroller} Event.data The scroller instance
       */

    }, {
      key: "resizeScrollbar",
      value: function resizeScrollbar(event) {
        var self = undefined !== event ? event.data : this,
            wrapperSize,
            contentSize,
            size;

        if (undefined === self.$scrollbar) {
          return;
        }

        wrapperSize = self.isVertical ? self.$element.innerHeight() : self.$element.innerWidth();
        contentSize = self.isVertical ? self.$content.get(0).scrollHeight : self.$content.get(0).scrollWidth;
        size = Math.max(self.options.scrollbarMinSize, Math.round(wrapperSize * Math.min(wrapperSize / contentSize, 1)));

        if (size < wrapperSize) {
          self.$scrollbar.addClass('scroller-active');
        } else {
          self.$scrollbar.removeClass('scroller-active');
        }

        if (self.isVertical) {
          self.$scrollbar.height(size);
        } else {
          self.$scrollbar.width(size);
        }

        self.refreshScrollbarPosition();
      }
      /**
       * On refresh scrollbar position action.
       *
       * @param {jQuery.Event|Event} [event]
       *
       * @typedef {Scroller} Event.data The scroller instance
       */

    }, {
      key: "refreshScrollbarPosition",
      value: function refreshScrollbarPosition(event) {
        var self = undefined !== event ? event.data : this,
            position,
            wrapperSize,
            contentSize,
            percentScroll,
            scrollbarSize,
            delta;

        if (undefined === self.$scrollbar) {
          return;
        }

        position = this.getScrollPosition();
        wrapperSize = self.isVertical ? self.$element.innerHeight() : self.$element.innerWidth();
        contentSize = self.isVertical ? self.$content.get(0).scrollHeight + parseInt(self.$element.css('padding-top'), 10) + parseInt(self.$element.css('padding-bottom'), 10) : self.$content.get(0).scrollWidth + parseInt(self.$element.css('padding-left'), 10) + parseInt(self.$element.css('padding-right'), 10);
        percentScroll = position / (contentSize - wrapperSize);
        scrollbarSize = self.isVertical ? self.$scrollbar.outerHeight() : self.$scrollbar.outerWidth();
        delta = Math.round(percentScroll * (wrapperSize - scrollbarSize));
        changeTranslate(self.$scrollbar, self.isVertical, delta);
      }
      /**
       * Refresh the scrollbar and sticky header.
       */

    }, {
      key: "refresh",
      value: function refresh() {
        this.resizeScrollbar();

        if (undefined !== this.stickyHeader) {
          this.stickyHeader.refresh();
        }
      }
      /**
       * Destroy the instance.
       */

    }, {
      key: "destroy",
      value: function destroy() {
        $$1(window).off('resize.fxp.scroller-bar' + this.guid, this.resizeScrollbar);
        this.$content.off('scroll.fxp.scroller', onScrolling);
        this.$content = unwrapContent(this);
        this.$element.off('DOMMouseScroll.fxp.scroller mousewheel.fxp.scroller', onPreventMouseScroll);

        if (undefined !== this.stickyHeader) {
          this.stickyHeader.destroy();
        }

        _get(_getPrototypeOf(Scroller.prototype), "destroy", this).call(this);
      }
    }]);

    return Scroller;
  }(BasePlugin);
  Scroller.defaultOptions = {
    scrollbar: true,
    scrollbarInverse: false,
    scrollbarMinSize: 14,
    contentClass: 'scroller-content',
    contentSelector: null,
    autoConfig: true,
    preventMouseScroll: false,
    direction: DIRECTION_VERTICAL,
    scrollerStickyHeader: false,
    stickyOptions: {}
  };
  pluginify('scroller', 'fxp.scroller', Scroller, true, '[data-scroller="true"]');

  exports.default = Scroller;

  return exports;

}({}, jQuery));
