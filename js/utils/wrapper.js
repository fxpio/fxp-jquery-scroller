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
export function wrapContent(self) {
    let opts = self.options,
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
export function unwrapContent(self) {
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
            'margin-left': '',
            'margin-right': '',
            'margin-bottom': '',
            '-webkit-transform': '',
            'transform': ''
        });

    return null;
}
