/**
 * Draw
 */
var Draw = {
    getCheckbox(node) {
        if (node.state.checked != null) {
            if (!node.hasCheckbox) node.state.checked = 'nochecked';
            return '<span class="mt-checkbox mt-node-' + node.state.checked + '" uid="' + node.UID + '">' + Draw.zeroSpace + '</span>';
        }
        return '';
    },

    getHTML: function(node) {
        var prefix = node.tree.DOMidPrefix;
        var isLast = node.isLast() ? 'mt-node-last' : ''
        var hidn = node.hidden ? 'hidden' : '';
        var icon = '';
        if (node.tree.options.showsOpenCloseIcons === undefined || node.tree.options.showsOpenCloseIcons) {
            icon = '<span class="mt-icon ' + (node.closeIconUrl ? node.closeIconUrl : node.closeIcon) + '" uid="' + node.UID + '">' + Draw.zeroSpace + '</span>';
        }
        return [
            '<div class="mt-node ' + isLast + ' ' + hidn + '" id="' + prefix + node.UID + '">',
            // the wrapper needs to be here to segment the node from its children as a sibling
            '<span class="mt-node-wrapper ', node.cls, (node.state.selected ? ' mt-node-selected' : ''), '" uid="', node.UID, '">',
            // this one controls the branch visibility
            '<span class="mt-gadjet mt-gadjet-' + node.getGadjetType() + '" uid="' + node.UID + '">' + Draw.zeroSpace + '</span>',
            icon,
            // checkbox now goes inside its label
            '<label uid="' + node.UID + '">' + this.getCheckbox(node) + node.name + '</label>',
            '</span>',
            '<div class="mt-children"></div>',
            '</div>'
        ];
    },

    children: function(parent, container) {
        parent.open = true;
        parent.$draw = true;
        var html = [];
        var children = parent.children;
        for (var i = 0, l = children.length; i < l; i++) {
            html = html.concat(this.getHTML(children[i]));
        }
        container = container || parent.getDOM('children');
        container.set('html', html.join(''));
        parent.tree.fireEvent('drawChildren', [parent]);
    },

    root: function(tree) {
        var domRoot = this.node(tree.root);
        domRoot.inject(tree.wrapper);
        tree.$draw = true;
        tree.fireEvent('drawRoot');
    },

    forestRoot: function(tree) {
        var container = new Element('div').addClass('mt-children-root').inject(tree.wrapper);
        Draw.children(tree.root, container);
    },

    node: function(node) {
        return new Element('div').set('html', this.getHTML(node).join('')).getFirst();
    },

    isUpdatable: function(node) {
        if (
            (!node || !node.tree) ||
            (node.getParent() && !node.getParent().$draw) ||
            (node.isRoot() && (!node.tree.$draw || node.tree.forest))
        ) return false;
        return true;
    },

    setNodeStateIcon: function(node) {
        if (!node.tree.options.showsOpenCloseIcons) {
            return;
        }
        if (node.closeIconUrl) {
            node.getDOM('icon').setStyle('background-image', 'url(' + (node.isOpen() ? node.openIconUrl : node.closeIconUrl) + ')');
        } else {
            node.getDOM('icon').className = 'mt-icon ' + node[node.isOpen() ? 'openIcon' : 'closeIcon'];
        }
    },

    update: function(node) {
        if (!this.isUpdatable(node)) return null;
        if (!node.hasChildren()) node.state.open = false;
        node.getDOM('gadjet').className = 'mt-gadjet mt-gadjet-' + node.getGadjetType();
        this.setNodeStateIcon(node);
        node.getDOM('node')[(node.isLastVisible() ? 'add' : 'remove') + 'Class']('mt-node-last');
        if (node.$loading) return null;
        var children = node.getDOM('children');
        if (node.isOpen()) {
            if (!node.$draw) Draw.children(node);
            children.style.display = 'block';
        } else {
            children.style.display = 'none';
        }
        node.tree.fireEvent('updateNode', node);
        return node;
    },

    inject: function(node, element) {
        if (!this.isUpdatable(node)) return;
        element = element || node.getDOM('node') || this.node(node);
        var previous = node.getPrevious();
        if (previous) {
            element.inject(previous.getDOM('node'), 'after');
            return;
        }
        var container;
        if (node.tree.forest && node.parentNode.isRoot()) {
            container = node.tree.wrapper.getElement('.mt-children-root');
        } else if (node.tree.root === node) {
            container = node.tree.wrapper;
        } else {
            container = node.parentNode.getDOM('children');
        }
        element.inject(container, 'top');
    }

};

Draw.zeroSpace = Browser.ie ? '&shy;' : (Browser.safari | Browser.chrome ? '&#8203' : '');

export default Draw;