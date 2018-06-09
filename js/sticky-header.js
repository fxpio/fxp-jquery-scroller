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
import {applyStickyBackgroundColor} from "./utils/sticky";
import $ from 'jquery';

/**
 * Sticky Header class.
 */
export default class StickyHeader extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        this.$element.on('scroll.fxp.stickyheader', $.proxy(this.checkPosition, this));
        this.refresh();
        this.checkPosition();
    }

    /**
     * Refresh the sticky headers.
     */
    refresh() {
        let self = this;

        this.$element.find('> .' + this.options.classSticky).remove();
        this.$element.find(this.options.selector).each(function (index, element) {
            let $group = $(element),
                $sticky;

            $sticky = $('<div class="' + $group.parent().attr('class') + ' ' + self.options.classSticky + '" data-sticky-index="' + index + '"></div>');
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
            self.$element.prepend($sticky);
        });
    }

    /**
     * Checks the position of content and refresh the sticky header.
     */
    checkPosition() {
        let self = this,
            $find = this.$element.find(this.options.selector),
            $FirstGroup = $find.eq(0),
            paddingTop = 0;

        if ($FirstGroup.length > 0) {
            paddingTop = parseInt($FirstGroup.parent().css('padding-top'), 10);
        }

        this.$element.find(this.options.selector).each(function (index, element) {
            let $headerFind = self.$element.find('> [data-sticky-index="' + index + '"]'),
                $group = $(element),
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
    destroy() {
        this.$element.off('scroll.fxp.stickyheader', $.proxy(StickyHeader.prototype.checkPosition, this));
        this.$element.find('> .' + this.options.classSticky).remove();

        super.destroy();
    }
}

/**
 * Defaults options.
 */
StickyHeader.defaultOptions = {
    classSticky: 'sticky-header',
    selector: '> ul > li > span, div > ul > li > span'
};

pluginify('stickyHeader', 'fxp.stickyheader', StickyHeader, true, 'data-sticky-header');
