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
            tree.wrapper.addEvents({
                'mousedown:relay(.mt-node-wrapper *)': treeSelection.attachSelect.bind(tree),
                'mousedown:relay(:not(.mt-node-wrapper *))': (e) => {
                    e.stop();
                    tree.unselect();
                }
            });
    },

    attachSelect: function(e) {
        e.stop();
        let node = this.mouse.node;
        if (!node || !!!~targets.indexOf(this.mouse.target)) {
            return;
        }

        if (this.selected && this.selected !== node) {
            this.unselect().select(node);
        } else if (!this.selected) {
            this.select(node);
        } else {
            this.unselect(node);
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
        let target = node || this.selected;
        if (!target) return this;
        this.selected = null;
        target.select(false);
        this.fireEvent('unSelect', [target]).fireEvent('selectChange', [target, false]);
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