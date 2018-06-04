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
export function getNativeScrollWidth() {
    let sbDiv = document.createElement("div"),
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
export function generateScrollbar(self, direction) {
    let $scrollbar = $('<div class="scroller-scrollbar ' + direction + '"></div>');

    if (self.options.scrollbarInverse) {
        $scrollbar.addClass('scroller-inverse');
    }

    self.$element.prepend($scrollbar);

    return $scrollbar;
}
