/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import pluginify from '@fxp/jquery-pluginify';
import BasePlugin from '@fxp/jquery-pluginify/js/plugin';
import {wrapContent, unwrapContent} from './utils/wrapper';
import {validateOptions} from "./utils/options";
import {onScrolling, onPreventMouseScroll} from "./utils/events";
import {getNativeScrollWidth, generateScrollbar} from "./utils/scrollbar";
import {DIRECTION_VERTICAL} from "./utils/const";
import {changeTranslate} from "./utils/css";
import $ from 'jquery';

/**
 * Scroller class.
 */
export default class Scroller extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);
        this.nativeScrollbarSize = getNativeScrollWidth();

        validateOptions(this, this.options);

        this.isVertical = this.options.direction === DIRECTION_VERTICAL;
        this.$content = wrapContent(this);

        if (this.options.preventMouseScroll) {
            this.$element.on('DOMMouseScroll.fxp.scroller mousewheel.fxp.scroller', null, this, onPreventMouseScroll);
        }

        if (this.options.scrollbar) {
            this.$scrollbar = generateScrollbar(this, this.options.direction);
            $(window).on('resize.fxp.scroller-bar' + this.guid, null, this, this.resizeScrollbar);
        }

        this.$content.on('scroll.fxp.scroller', null, this, onScrolling);

        if (this.options.scrollerStickyHeader && $.fn.stickyHeader) {
            this.stickyHeader = this.$element.stickyHeader(this.options.stickyOptions).data('fxp.stickyheader');
        }

        this.resizeScrollbar();
    }

    /**
     * Set the vertical/horizontal scroll position.
     *
     * @param {Number} position The position
     *
     * @return {Number}
     */
    setScrollPosition(position) {
        return this.isVertical ? this.$content.scrollTop(position)
            : this.$content.scrollLeft(position);
    }

    /**
     * Get the vertical/horizontal scroll position.
     *
     * @returns {Number}
     */
    getScrollPosition() {
        return this.isVertical ? this.$content.scrollTop()
            : this.$content.scrollLeft();
    }

    /**
     * Get the vertical/horizontal max scroll position.
     *
     * @returns {Number}
     */
    getMaxScrollPosition() {
        return this.isVertical ? this.$content.get(0).scrollHeight - this.$content.innerHeight()
            : this.$content.get(0).scrollWidth - this.$content.innerWidth();
    }

    /**
     * On resize scrollbar action.
     *
     * @param {jQuery.Event|Event} [event]
     *
     * @typedef {Scroller} Event.data The scroller instance
     */
    resizeScrollbar(event) {
        let self = (undefined !== event) ? event.data : this,
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
    }

    /**
     * On refresh scrollbar position action.
     *
     * @param {jQuery.Event|Event} [event]
     *
     * @typedef {Scroller} Event.data The scroller instance
     */
    refreshScrollbarPosition(event) {
        let self = (undefined !== event) ? event.data : this,
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
        contentSize = self.isVertical ? self.$content.get(0).scrollHeight +
            parseInt(self.$element.css('padding-top'), 10) +
            parseInt(self.$element.css('padding-bottom'), 10)
            : self.$content.get(0).scrollWidth +
            parseInt(self.$element.css('padding-left'), 10) +
            parseInt(self.$element.css('padding-right'), 10);
        percentScroll = position / (contentSize - wrapperSize);
        scrollbarSize = self.isVertical ? self.$scrollbar.outerHeight()
            : self.$scrollbar.outerWidth();
        delta = Math.round(percentScroll * (wrapperSize - scrollbarSize));

        changeTranslate(self.$scrollbar, self.isVertical, delta);
    }

    /**
     * Refresh the scrollbar and sticky header.
     */
    refresh() {
        this.resizeScrollbar();

        if (undefined !== this.stickyHeader) {
            this.stickyHeader.refresh();
        }
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        $(window).off('resize.fxp.scroller-bar' + this.guid, this.resizeScrollbar);
        this.$content.off('scroll.fxp.scroller', onScrolling);
        this.$content = unwrapContent(this);
        this.$element.off('DOMMouseScroll.fxp.scroller mousewheel.fxp.scroller', onPreventMouseScroll);

        if (undefined !== this.stickyHeader) {
            this.stickyHeader.destroy();
        }

        super.destroy();
    }
}

/**
 * Defaults options.
 */
Scroller.defaultOptions = {
    scrollbar:            true,
    scrollbarInverse:     false,
    scrollbarMinSize:     14,
    contentClass:         'scroller-content',
    contentSelector:      null,
    autoConfig:           true,
    preventMouseScroll:   false,
    direction:            DIRECTION_VERTICAL,
    scrollerStickyHeader: false,
    stickyOptions:        {}
};

pluginify('scroller', 'fxp.scroller', Scroller, true, '[data-scroller="true"]');
