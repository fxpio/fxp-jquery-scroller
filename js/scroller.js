/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global define*/
/*global jQuery*/
/*global window*/
/*global document*/

/**
 * @param {jQuery} $
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /**
     * Trigger the event.
     *
     * @param {String} name The event name
     *
     * @param {Scroller} self The scroller instance
     *
     * @private
     */
    function trigger(name, self) {
        var event = $.Event(name + '.st.scroller');
        event.hammerScroll = self;

        self.$element.trigger(event);
    }

    /**
     * Get the width of native scrollbar.
     *
     * @returns {Number}
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
     *
     * @private
     */
    function generateScrollbar(self, direction) {
        var $scrollbar = $('<div class="scroller-scrollbar ' + direction + '"></div>');

        if (self.options.scrollbarInverse) {
            $scrollbar.addClass('scroller-inverse');
        }

        self.$element.prepend($scrollbar);

        return $scrollbar;
    }

    /**
     * Action on scrolling.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Scroller} Event.data The scroller instance
     *
     * @private
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
     *
     * @typedef {Scroller} Event.data The scroller instance
     *
     * @private
     */
    function onPreventMouseScroll(event) {
        var self = event.data,
            delta,
            position,
            maxPosition;

        delta = (event.originalEvent.type === 'DOMMouseScroll' ? event.originalEvent.detail * -40
            : event.originalEvent.wheelDelta);
        position = self.getScrollPosition();
        maxPosition = self.isVertical ? self.$content.get(0).scrollHeight - self.$content.innerHeight()
            : self.$content.get(0).scrollWidth - self.$content.innerWidth();

        if (self.isVertical || (!self.isVertical && event.shiftKey)) {
            if ((delta > 0 && position <= 0) || (delta < 0 && position >= maxPosition)) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    }

    /**
     * Changes the css transform configuration on target element.
     *
     * @param {jQuery} $target   The element to edited
     * @param {string} transform The css transform configuration of target
     *
     * @private
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
        var trans = vertical ? '0px, ' + delta + 'px, 0px'
            : delta + 'px, 0px, 0px';

        changeTransform($target, 'translate3d(' + trans + ')');
    }

    /**
     * Wraps the content.
     *
     * @param {Scroller} self The scroller instance
     *
     * @return {jQuery} The content
     *
     * @private
     */
    function wrapContent(self) {
        var opts = self.options,
            contentCss = {},
            $content = $('<div class="' + opts.contentClass + '"></div>'),
            scrollType = 'scroll';

        if (null !== self.options.contentSelector) {
            $content = $(self.options.contentSelector, self.$element);
            $content.addClass(self.options.contentClass);
        }

        contentCss.position = 'relative';
        contentCss.display = 'block';
        contentCss.overflow = 'hidden';

        if (self.isVertical) {
            contentCss.width = 'auto';
            contentCss.height = '100%';
            contentCss['overflow-x'] = 'hidden';
            contentCss['overflow-y'] = scrollType;
            contentCss['margin-right'] = -self.nativeScrollbarSize + 'px';
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
     *
     * @private
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

        self.$content
            .removeClass(self.options.contentClass)
            .css({
                'position': '',
                'display': '',
                'overflow': '',
                'width': '',
                'height': '',
                'margin-right': '',
                'margin-bottom': ''
            });

        return null;
    }

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

        if (options.direction !== Scroller.DIRECTION_VERTICAL) {
            options.scrollerStickyHeader = false;
        }
    }

    // SCROLLER CLASS DEFINITION
    // =========================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this Scroller
     */
    var Scroller = function (element, options) {
        this.guid    = jQuery.guid;
        this.options = $.extend(true, {}, Scroller.DEFAULTS, options);
        this.nativeScrollbarSize = getNativeScrollWidth();

        validateOptions(this, this.options);

        this.isVertical = this.options.direction === Scroller.DIRECTION_VERTICAL;
        this.$element = $(element).eq(0);
        this.$content = wrapContent(this);

        if (this.options.preventMouseScroll) {
            this.$element.on('DOMMouseScroll.st.scroller mousewheel.st.scroller', null, this, onPreventMouseScroll);
        }

        if (this.options.scrollbar) {
            this.$scrollbar = generateScrollbar(this, this.options.direction);
            $(window).on('resize.st.scroller-bar' + this.guid, null, this, this.resizeScrollbar);
        }

        this.$content.on('scroll.st.scroller', null, this, onScrolling);

        if (this.options.scrollerStickyHeader && $.fn.stickyHeader) {
            this.stickyHeader = this.$element.stickyHeader(this.options.stickyOptions).data('st.stickyheader');
        }

        this.resizeScrollbar();
    },
        old;

    /**
     * Vertical scrollbar direction.
     *
     * @type {string}
     */
    Scroller.DIRECTION_VERTICAL = 'vertical';
    /**
     * Horizontal scrollbar direction.
     *
     * @type {string}
     */
    Scroller.DIRECTION_HORIZONTAL = 'horizontal';

    /**
     * Defaults options.
     *
     * @type {object}
     */
    Scroller.DEFAULTS = {
        scrollbar:            true,
        scrollbarInverse:     false,
        scrollbarMinSize:     14,
        contentClass:         'scroller-content',
        contentSelector:      null,
        autoConfig:           true,
        preventMouseScroll:   false,
        direction:            Scroller.DIRECTION_VERTICAL,
        scrollerStickyHeader: false,
        stickyOptions:        {}
    };

    /**
     * Set the vertical/horizontal scroll position.
     *
     * @param {Number} position The position
     *
     * @return {Number}
     */
    Scroller.prototype.setScrollPosition = function (position) {
        return this.isVertical ? this.$content.scrollTop(position)
            : this.$content.scrollLeft(position);
    };

    /**
     * Get the vertical/horizontal scroll position.
     *
     * @returns {Number}
     */
    Scroller.prototype.getScrollPosition = function () {
        return this.isVertical ? this.$content.scrollTop()
            : this.$content.scrollLeft();
    };

    /**
     * Get the vertical/horizontal max scroll position.
     *
     * @returns {Number}
     */
    Scroller.prototype.getMaxScrollPosition = function () {
        return this.isVertical ? this.$content.get(0).scrollHeight - this.$content.innerHeight()
            : this.$content.get(0).scrollWidth - this.$content.innerWidth();
    };

    /**
     * On resize scrollbar action.
     *
     * @param {jQuery.Event|Event} [event]
     *
     * @typedef {Scroller} Event.data The scroller instance
     *
     * @this Scroller
     */
    Scroller.prototype.resizeScrollbar = function (event) {
        var self = (undefined !== event) ? event.data : this,
            wrapperSize,
            contentSize,
            size;

        if (undefined === self.$scrollbar) {
            return;
        }

        wrapperSize = self.isVertical ? self.$element.innerHeight()
            : self.$element.innerWidth();
        contentSize = self.isVertical ? self.$content.get(0).scrollHeight
            : self.$content.get(0).scrollWidth;
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
    };

    /**
     * On refresh scrollbar position action.
     *
     * @param {jQuery.Event|Event} [event]
     *
     * @typedef {Scroller} Event.data The scroller instance
     *
     * @this Scroller
     */
    Scroller.prototype.refreshScrollbarPosition = function (event) {
        var self = (undefined !== event) ? event.data : this,
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
        wrapperSize = self.isVertical ? self.$element.innerHeight()
            : self.$element.innerWidth();
        contentSize = self.isVertical ? self.$content.get(0).scrollHeight
            : self.$content.get(0).scrollWidth;
        percentScroll = position / (contentSize - wrapperSize);
        scrollbarSize = self.isVertical ? self.$scrollbar.outerHeight()
            : self.$scrollbar.outerWidth();
        delta = Math.round(percentScroll * (wrapperSize - scrollbarSize));

        changeTranslate(self.$scrollbar, self.isVertical, delta);
    };

    /**
     * Destroy instance.
     *
     * @this Scroller
     */
    Scroller.prototype.destroy = function () {
        $(window).off('resize.st.scroller-bar' + this.guid, this.resizeScrollbar);
        this.$content.off('scroll.st.scroller', onScrolling);
        this.$content = unwrapContent(this);
        this.$element.off('DOMMouseScroll.st.scroller mousewheel.st.scroller', onPreventMouseScroll);

        if (undefined !== this.stickyHeader) {
            this.stickyHeader.destroy();
        }

        this.$element.removeData('st.scroller');

        delete this.guid;
        delete this.options;
        delete this.nativeScrollbarSize;
        delete this.isVertical;
        delete this.$element;
        delete this.$content;
        delete this.$scrollbar;
        delete this.stickyHeader;
    };


    // SCROLLER PLUGIN DEFINITION
    // ==========================

    function Plugin(option, value) {
        var ret;

        this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.scroller'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new Scroller(this, options);
                $this.data('st.scroller', data);
            }

            if (typeof option === 'string') {
                ret = data[option](value);
            }
        });

        return undefined === ret ? this : ret;
    }

    old = $.fn.scroller;

    $.fn.scroller             = Plugin;
    $.fn.scroller.Constructor = Scroller;


    // SCROLLER NO CONFLICT
    // ====================

    $.fn.scroller.noConflict = function () {
        $.fn.scroller = old;

        return this;
    };


    // SCROLLER DATA-API
    // =================

    $(window).on('load', function () {
        $('[data-scroller="true"]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));
