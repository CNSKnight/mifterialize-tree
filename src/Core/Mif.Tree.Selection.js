/**
 * Selection
 */
import Node from './Tree.Node';
import Draw from './Tree.Draw';

var Selection = {

    initSelection: function(tree) {
        tree.defaults.selectClass = '';
        tree.wrapper.addEvent('mousedown', function(e) {
            Selection.attachSelect.call(tree, e);
        });
    },

    attachSelect: function(event) {
        if (!['icon', 'name', 'node'].contains(this.mouse.target)) return;
        var node = this.mouse.node;
        if (!node) return;
        this.select(node);
    },

    select: function(node) {
        if (!node) return this;
        var current = this.selected;
        if (current == node) return this;
        if (current) {
            current.select(false);
            this.fireEvent('unSelect', [current]).fireEvent('selectChange', [current, false]);
        }
        this.selected = node;
        node.select(true);
        this.fireEvent('select', [node]).fireEvent('selectChange', [node, true]);
        return this;
    },

    unselect: function() {
        var current = this.selected;
        if (!current) return this;
        this.selected = false;
        current.select(false);
        this.fireEvent('unSelect', [current]).fireEvent('selectChange', [current, false]);
        return this;
    },

    getSelected: function() {
        return this.selected;
    },

    isSelected: function(node) {
        return node.isSelected();
    }

};

Node.implement({
    select: function(state) {
        this.state.selected = state;
        if (!Draw.isUpdatable(this)) return;
        var wrapper = this.getDOM('wrapper');
        wrapper[(state ? 'add' : 'remove') + 'Class'](this.selectClass || 'mt-node-selected');
    },

    isSelected: function() {
        return this.state.selected;
    }
});

module.exports = Selection;