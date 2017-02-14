/**
 * Tree
 * @note - Babel in play in this script - refactor accordingly
 */

import init from './Tree.init'
import treeEvents from './Tree.treeEvents';
import hover from './Tree.hover';
import { treeSelection } from './Tree.selection';
import { treeCheckbox } from '../More/Tree.checkbox';
// import patch  from './Tree.mootools-patch'; // this should not be needed going forward

var Tree = new Class(
    Object.assign({
        version: '0.9.02',
        Implements: [Events, Options]
    }, init, treeEvents, hover, treeSelection, treeCheckbox)
);

Tree.UID = 0;

Array.implement({
    inject: function(added, current, where) { //inject added after or before current;
        var pos = this.indexOf(current) + (where === 'before' ? 0 : 1);
        for (var i = this.length - 1; i >= pos; i--) {
            this[i + 1] = this[i];
        }
        this[pos] = added;
        return this;
    }

});

export default Tree;