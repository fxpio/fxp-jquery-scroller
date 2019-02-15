var FxpStickyHeader = (function (exports, $$1) {
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
   * Check if the jquery element has background.
   *
   * @param {jQuery} $element The jquery element
   *
   * @returns {boolean}
   */

  function hasBackgroundColor($element) {
    return -1 === $.inArray($element.css('background-color'), ['transparent', 'rgba(0, 0, 0, 0)']);
  }
  /**
   * Find the parent background color.
   *
   * @param {jQuery} $element The jquery element
   *
   * @returns {String}
   */

  function findParentBackgroundColor($element) {
    var $parents = $element.parents(),
        $child,
        i;

    for (i = 0; i < $parents.length; i += 1) {
      $child = $($parents.get(i));

      if (hasBackgroundColor($child)) {
        return $child.css('background-color');
      }
    }

    return '';
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
   * Apply the background color of item on the sticky header.
   *
   * @param {jQuery} $group The jquery element of group
   * @param {jQuery} $sticky The jquery element of sticky header
   */

  function applyStickyBackgroundColor($group, $sticky) {
    var color = $group.parent().css('background-color');

    if (!hasBackgroundColor($group.parent())) {
      color = findParentBackgroundColor($group.parent());
    }

    $sticky.css('background-color', color);
    $sticky.parent().css('background-color', color);
  }

  /**
   * Sticky Header class.
   */

  var StickyHeader =
  /*#__PURE__*/
  function (_BasePlugin) {
    _inherits(StickyHeader, _BasePlugin);

    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function StickyHeader(element) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, StickyHeader);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(StickyHeader).call(this, element, options));

      _this.$element.on('scroll.fxp.stickyheader', $$1.proxy(_this.checkPosition, _assertThisInitialized(_assertThisInitialized(_this))));

      _this.refresh();

      _this.checkPosition();

      return _this;
    }
    /**
     * Refresh the sticky headers.
     */


    _createClass(StickyHeader, [{
      key: "refresh",
      value: function refresh() {
        var self = this;
        this.$element.find('> .' + this.options.classSticky).remove();
        this.$element.find(this.options.selector).each(function (index, element) {
          var $group = $$1(element),
              $sticky;
          $sticky = $$1('<div class="' + $group.parent().attr('class') + ' ' + self.options.classSticky + '" data-sticky-index="' + index + '"></div>');
          $sticky.append($group.clone());
          $sticky.css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'right': 0,
            'height': 'auto',
            'z-index': index + 1,
            'margin': 0,
            'display': 'none'
          });
          $group.attr('data-sticky-ref', index);
          applyStickyBackgroundColor($group, $sticky);
          self.$element.prepend($sticky);
        });
      }
      /**
       * Checks the position of content and refresh the sticky header.
       */

    }, {
      key: "checkPosition",
      value: function checkPosition() {
        var self = this,
            $find = this.$element.find(this.options.selector),
            $FirstGroup = $find.eq(0),
            paddingTop = 0;

        if ($FirstGroup.length > 0) {
          paddingTop = parseInt($FirstGroup.parent().css('padding-top'), 10);
        }

        this.$element.find(this.options.selector).each(function (index, element) {
          var $headerFind = self.$element.find('> [data-sticky-index="' + index + '"]'),
              $group = $$1(element),
              top = $group.position().top - paddingTop;

          if (top <= 0) {
            $headerFind.eq(0).css('display', '');
          } else {
            $headerFind.eq(0).css('display', 'none');
          }
        });
      }
      /**
       * Destroy instance.
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this.$element.off('scroll.fxp.stickyheader', $$1.proxy(StickyHeader.prototype.checkPosition, this));
        this.$element.find('> .' + this.options.classSticky).remove();

        _get(_getPrototypeOf(StickyHeader.prototype), "destroy", this).call(this);
      }
    }]);

    return StickyHeader;
  }(BasePlugin);
  StickyHeader.defaultOptions = {
    classSticky: 'sticky-header',
    selector: '> ul > li > span, div > ul > li > span'
  };
  pluginify('stickyHeader', 'fxp.stickyheader', StickyHeader, true, 'data-sticky-header');

  exports.default = StickyHeader;

  return exports;

}({}, jQuery));
