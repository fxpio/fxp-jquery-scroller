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

    // STICKY HEADER CLASS DEFINITION
    // ==============================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this StickyHeader
     */
    var StickyHeader = function (element, options) {
        this.guid       = jQuery.guid;
        this.options    = $.extend(true, {}, StickyHeader.DEFAULTS, options);
        this.$element   = $(element);

        this.$element.on('scroll.st.stickyheader', $.proxy(StickyHeader.prototype.checkPosition, this));
        this.refresh();
        this.checkPosition();
    },
        old;

    /**
     * Defaults options.
     *
     * @type Array
     */
    StickyHeader.DEFAULTS = {
        classSticky: 'sticky-header'
    };

    /**
     * Refresh the sticky headers.
     *
     * @this StickyHeader
     */
    StickyHeader.prototype.refresh = function () {
        this.$element.find('> .' + this.options.classSticky).remove();

        this.$element.find('> ul > li > span, div > ul > li > span').each($.proxy(function (index, element) {
            var $group = $(element),
                $sticky;

            $sticky = $('<div class="' + $group.parent().attr('class') + ' ' + this.options.classSticky + '" data-sticky-index="' + index + '"></div>');
            $sticky.append($group.clone());
            $sticky.css({
                'position': 'absolute',
                'top':      0,
                'left':     0,
                'right':    0,
                'height':   'auto',
                'z-index':  index + 1,
                'margin':   0,
                'display': 'none'
            });
            $group.attr('data-sticky-ref', index);
            applyStickyBackgroundColor($group, $sticky);
            this.$element.prepend($sticky);
        }, this));
    };

    /**
     * Checks the position of content and refresh the sticky header.
     *
     * @this StickyHeader
     */
    StickyHeader.prototype.checkPosition = function () {
        var $firstEl = $('> ul > li:first-child, div > ul > li:first-child', this.$element),
            paddingTop = parseInt($firstEl.css('padding-top'), 10);

        this.$element.find('> ul > li > span, div > ul > li > span').each($.proxy(function (index, element) {
            var $headerFind = this.$element.find('> [data-sticky-index="' + index + '"]'),
                $group = $(element),
                top = $group.position().top - paddingTop;

            if (top <= 0) {
                $headerFind.eq(0).css('display', '');
            } else {
                $headerFind.eq(0).css('display', 'none');
            }
        }, this));
    };

    /**
     * Destroy instance.
     *
     * @this StickyHeader
     */
    StickyHeader.prototype.destroy = function () {
        this.$element.off('scroll.st.stickyheader', $.proxy(StickyHeader.prototype.checkPosition, this));
        this.$element.find('> .' + this.options.classSticky).remove();

        this.$element.removeData('st.stickyheader');
    };


    // STICKY HEADER PLUGIN DEFINITION
    // ===============================

    function Plugin(option, value) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.stickyheader'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new StickyHeader(this, options);
                $this.data('st.stickyheader', data);
            }

            if (typeof option === 'string') {
                data[option](value);
            }
        });
    }

    old = $.fn.stickyHeader;

    $.fn.stickyHeader             = Plugin;
    $.fn.stickyHeader.Constructor = StickyHeader;


    // STICKY HEADER NO CONFLICT
    // =========================

    $.fn.stickyHeader.noConflict = function () {
        $.fn.stickyHeader = old;

        return this;
    };


    // STICKY HEADER DATA-API
    // ======================

    $(window).on('load', function () {
        $('[data-sticky-header="true"]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));
