/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DIRECTION_VERTICAL} from './const';

/**
 * Validate the options.
 *
 * @param {Scroller} self
 * @param {Object}   options
 */
export function validateOptions(self, options) {
    let autoConf = options.autoConfig;

    if (autoConf && 0 === self.nativeScrollbarSize) {
        options.scrollbar = false;
    }

    if (options.direction !== DIRECTION_VERTICAL) {
        options.scrollerStickyHeader = false;
    }
}
