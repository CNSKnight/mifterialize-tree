/**
 * Tree.Load
 */
import Node from './Tree.Node';

var Load = {
    children: function(children, parent, tree) {
        var i, l;
        var subChildrens = [];
        for (i = children.length; i--;) {
            var child = children[i];
            var node = new Node({
                tree: tree,
                parentNode: parent || undefined
            }, child);
            if (tree.forest || parent != undefined) {
                parent.children.unshift(node);
            } else {
                tree.root = node;
            }
            var subChildren = child.children;
            if (subChildren && subChildren.length) {
                subChildrens.push({ children: subChildren, parent: node });
            }
        }
        for (i = 0, l = subChildrens.length; i < l; i++) {
            var sub = subChildrens[i];
            arguments.callee(sub.children, sub.parent, tree);
        }
        if (parent) parent.state.loaded = true;
        tree.fireEvent('loadChildren', parent);
    }

};

module.exports = Load;