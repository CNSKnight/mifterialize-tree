/**
 * Transform
 */
import draw from '../Core/Tree.draw';
import state from '../Core/Tree.state';

var nodeTransform = {
    inject: function(node, where, element) { //element - internal property
        where = where || 'inside';
        var parent = this.parentNode;

        function getPreviousVisible(node) {
            var previous = node;
            while (previous) {
                previous = previous.getPrevious();
                if (!previous) return null;
                if (!previous.hidden) return previous;
            }
            return null;
        }
        var previousVisible = getPreviousVisible(this);
        var type = element ? 'copy' : 'move';
        switch (where) {
            case 'after':
            case 'before':
                if (node['get' + (where === 'after' ? 'Next' : 'Previous')]() === this) return false;
                if (this.parentNode) {
                    this.parentNode.children.erase(this);
                }
                this.parentNode = node.parentNode;
                this.parentNode.children.inject(this, node, where);
                break;
            case 'inside':
                if (node.tree && node.getLast() === this) return false;
                if (this.parentNode) {
                    this.parentNode.children.erase(this);
                }
                if (node.tree) {
                    if (!node.hasChildren()) {
                        node.$draw = true;
                        node.state.open = true;
                    }
                    node.children.push(this);
                    this.parentNode = node;
                } else {
                    node.root = this;
                    this.parentNode = null;
                    node.fireEvent('drawRoot');
                }
                break;
            default:
        }
        var tree = node.tree || node;
        if (this === this.tree.root) {
            this.tree.root = false;
        }
        if (this.tree !== tree) {
            var oldTree = this.tree;
            this.recursive(function() {
                this.tree = tree;
            });
        };
        tree.fireEvent('structureChange', [this, node, where, type]);
        tree.$getIndex();
        if (oldTree) oldTree.$getIndex();
        draw.inject(this, element);
        [node, this, parent, previousVisible, getPreviousVisible(this)].each(function(node) {
            draw.update(node);
        });
        return this;
    },

    copy: function(node, where) {
        if (this.copyDenied) return this;

        function copy(structure) {
            var node = structure.node;
            var tree = structure.tree;
            var options = Object.clone({
                property: node.property,
                type: node.type,
                state: node.state,
                data: node.data
            });
            options.state.open = false;
            var nodeCopy = new Node({
                parentNode: structure.parentNode,
                children: [],
                tree: tree
            }, options);
            node.children.each(function(child) {
                var childCopy = copy({
                    node: child,
                    parentNode: nodeCopy,
                    tree: tree
                });
                nodeCopy.children.push(childCopy);
            });
            return nodeCopy;
        };

        var nodeCopy = copy({
            node: this,
            parentNode: null,
            tree: node.tree
        });
        return nodeCopy.inject(node, where, draw.node(nodeCopy));
    },

    remove: function() {
        if (this.removeDenied) return;
        this.tree.fireEvent('remove', [this]);
        var parent = this.parentNode,
            previousVisible = this.getPreviousVisible();
        if (parent) {
            parent.children.erase(this);
        } else if (!this.tree.forest) {
            this.tree.root = null;
        }
        this.tree.selected = false;
        this.getDOM('node').destroy();
        this.tree.$getIndex();
        draw.update(parent);
        draw.update(previousVisible);
        this.recursive(function() {
            if (this.id) delete state.ids[this.id];
        });
        this.tree.mouse.node = false;
        this.tree.updateHover();
    }
};


var treeTransform = {
    move: function(from, to, where) {
        if (from.inject(to, where)) {
            this.fireEvent('move', [from, to, where]);
        }
        return this;
    },

    copy: function(from, to, where) {
        var copy = from.copy(to, where);
        if (copy) {
            this.fireEvent('copy', [from, to, where, copy]);
        }
        return this;
    },

    remove: function(node) {
        node.remove();
        return this;
    },

    add: function(node, current, where) {
        if (!(node instanceof Node)) {
            node = new Node({
                parentNode: null,
                tree: this
            }, node);
        };
        node.inject(current, where, draw.node(node));
        this.fireEvent('add', [node, current, where]);
        return this;
    }
};

export { nodeTransform, treeTransform };