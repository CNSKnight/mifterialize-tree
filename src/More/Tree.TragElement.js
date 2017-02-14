/**
 * Trag.Element.js
 */
import Trag from './Tree.Trag';

var TragElement = new Class({
    Implements: [Options, Events],

    initialize: function(element, options) {
        this.element = document.id(element);
        this.setOptions(options);
    },

    getElement: function() {
        return this.element;
    },

    onleave: function() {
        this.where = 'notAllowed';
        TragElement.ghost.firstChild.className = 'mt-ghost-icon mt-ghost-' + this.where;
    },

    onenter: function() {
        this.where = 'inside';
        TragElement.ghost.firstChild.className = 'mt-ghost-icon mt-ghost-' + this.where;
    },

    beforeDrop: function() {
        if (this.options.beforeDrop) {
            this.options.beforeDrop.apply(this, [this.current, this.trarget, this.where]);
        } else {
            this.drop();
        }
    },

    drop: function() {
        TragElement.ghost.dispose();
        this.fireEvent('drop', Trag.current);
    }
});

export default TragElement;