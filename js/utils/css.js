/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Changes the css transform configuration on target element.
 *
 * @param {jQuery} $target   The element to edited
 * @param {string} transform The css transform configuration of target
 */
export function changeTransform($target, transform) {
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
export function changeTranslate($target, vertical, delta) {
    let trans = vertical ? '0px, ' + delta + 'px, 0px'
        : delta + 'px, 0px, 0px';

    changeTransform($target, 'translate3d(' + trans + ')');
}

/**
 * Check if the jquery element has background.
 *
 * @param {jQuery} $element The jquery element
 *
 * @returns {boolean}
 */
export function hasBackgroundColor($element) {
    return -1 === $.inArray($element.css('background-color'), ['transparent', 'rgba(0, 0, 0, 0)']);
}

/**
 * Find the parent background color.
 *
 * @param {jQuery} $element The jquery element
 *
 * @returns {String}
 */
export function findParentBackgroundColor($element) {
    let $parents = $element.parents(),
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
