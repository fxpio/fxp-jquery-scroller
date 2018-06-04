/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {hasBackgroundColor, findParentBackgroundColor} from "./css";

/**
 * Apply the background color of item on the sticky header.
 *
 * @param {jQuery} $group The jquery element of group
 * @param {jQuery} $sticky The jquery element of sticky header
 */
export function applyStickyBackgroundColor($group, $sticky) {
    let color = $group.parent().css('background-color');

    if (!hasBackgroundColor($group.parent())) {
        color = findParentBackgroundColor($group.parent());
    }

    $sticky.css('background-color', color);
    $sticky.parent().css('background-color', color);
}
