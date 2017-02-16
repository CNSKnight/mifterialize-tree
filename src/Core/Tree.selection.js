/**
 * Selection
 */
import draw from './Tree.draw';

const targets = ['icon', 'name', 'node'];

var treeSelection = {
    initSelection: function() {
        var tree = this;
        tree.defaults.selectClass = ''; // idk what this is
        tree.options.selectable &&
            tree.wrapper.addEvent('mousedown:relay(.mt-node-wrapper *)', treeSelection.attachSelect.bind(tree));
    },

    attachSelect: function(e) {
        if (!!~targets.indexOf(this.mouse.target) && this.mouse.node) {
            let node = this.mouse.node;
            if (this.selected && this.selected !== node) {
                this.unselect(this.selected);
                this.select(node);
            } else if (!this.selected) {
                this.select(node);
            } else {
                this.unselect(node);
            }
        }
    },

    select: function(node) {
        if (!node) return this;
        this.selected = node;
        node.select(true);
        this.fireEvent('select', [node]).fireEvent('selectChange', [node, true]);

        return this;
    },

    unselect: function(node) {
        if (!node) return this;
        this.selected = null;
        node.select(false);
        this.fireEvent('unSelect', [node]).fireEvent('selectChange', [node, false]);

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