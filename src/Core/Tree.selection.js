/**
 * Selection
 */
import draw from './Tree.draw';

const targets = ['icon', 'name', 'node'];

var treeSelection = {
    initSelection: function() {
        var tree = this;
        tree.defaults.selectClass = '';
        tree.wrapper.addEvent('mousedown', treeSelection.attachSelect.bind(tree));
    },

    attachSelect: function(e) {
        if (!!~targets.indexOf(this.mouse.target) && this.mouse.node) {
            this.select(this.mouse.node);
        }
    },

    select: function(node) {
        if (!node) return this;
        var current = this.selected;
        if (current === node) {
            current.select(false);
            this.fireEvent('unSelect', [current]).fireEvent('selectChange', [current, false]);
        } else {
            this.selected = node;
            node.select(true);
            this.fireEvent('select', [node]).fireEvent('selectChange', [node, true]);
        }
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

var nodeSelection = {
    select: function(state) {
        this.state.selected = state;
        if (!draw.isUpdatable(this)) {
            return;
        }
        var wrapper = this.getDOM('wrapper');
        wrapper[(state ? 'add' : 'remove') + 'Class'](this.selectClass || 'mt-node-selected');
    },

    isSelected: function() {
        return this.state.selected;
    }
};

export { treeSelection, nodeSelection };