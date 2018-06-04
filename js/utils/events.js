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
    let event = $.Event(name + '.fxp.scroller');
    event.hammerScroll = self;

    self.$element.trigger(event);
}

/**
 * Action on scrolling.
 *
 * @param {jQuery.Event|Event} event
 */
export function onScrolling(event) {
    let self = event.data;

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
export function onPreventMouseScroll(event) {
    let self = event.data,
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
