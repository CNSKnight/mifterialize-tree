/**
 * Tree.draw.js
 */

let draw = {
    setChildCheckedCount(node) {
        node.checkedCnt = 0;
        if (!node.children.length) {
            return;
        };
        let c = node.children;
        for (let i = 0; i < c.length; i++) {
            c[i].state && c[i].state.checked === 'checked' && node.checkedCnt++;
        };
    },

    getIcon(node) {
        if (node.tree.options.showsOpenCloseIcons === undefined || node.tree.options.showsOpenCloseIcons) {
            let iClass = node.closeIconUrl ? node.closeIconUrl : node.closeIcon;
            return '<span class="mt-icon ' + iClass + '" uid="' + node.UID + '">' + draw.zeroSpace + '</span>';
        }
    },

    getGadjetClasses(node) {
        let gClasses = node.checkedCnt ? 'hasChecked ' : '';
        gClasses += 'mt-gadjet mt-gadjet-' + node.getGadjetType();
        return gClasses;
    },

    getGadjet(node) {
        return '<span class="' + this.getGadjetClasses(node) + '" uid="' + node.UID + '">' + draw.zeroSpace + '</span>';
    },

    getCheckbox(node) {
        if (node.state.checked != null) {
            if (!node.hasCheckbox) {
                node.state.checked = 'nochecked';
            }
            return '<span class="mt-checkbox mt-node-' + node.state.checked + '" uid="' + node.UID + '">' + draw.zeroSpace + '</span>';
        }
        return '';
    },

    getHTML(node) {
        let prefix = node.tree.DOMidPrefix;
        let isLast = node.isLast() ? 'mt-node-last' : ''
        let hidn = node.hidden ? 'hidden' : '';
        this.setChildCheckedCount(node);
        let icon = this.getIcon(node) || '';
        let gadjet = this.getGadjet(node);
        let checkBox = this.getCheckbox(node);
        return [
            '<div class="mt-node ' + isLast + ' ' + hidn + '" id="' + prefix + node.UID + '">',
            // the wrapper needs to be here to segment the node from its children as a sibling
            '<span class="mt-node-wrapper ', node.cls, (node.state.selected ? ' mt-node-selected' : ''), '" uid="', node.UID, '">',
            // this one controls the branch visibility
            gadjet,
            icon,
            // checkbox now goes inside its label
            '<label class="mt-name" uid="' + node.UID + '">' + checkBox + node.name + '</label>',
            '</span>',
            '<div class="mt-children"></div>',
            '</div>'
        ];
    },

    children(parent, container) {
        parent.open = true;
        parent.$draw = true;
        let html = [];
        let children = parent.children;
        for (let i = 0, l = children.length; i < l; i++) {
            html = html.concat(this.getHTML(children[i]));
        }
        container = container || parent.getDOM('children');
        container.set('html', html.join(''));
        parent.tree.fireEvent('drawChildren', [parent]);
    },

    root(tree) {
        let domRoot = this.node(tree.root);
        domRoot.inject(tree.wrapper);
        tree.$draw = true;
        tree.fireEvent('drawRoot');
    },

    forestRoot(tree) {
        let container = new Element('div').addClass('mt-children-root').inject(tree.wrapper);
        draw.children(tree.root, container);
    },

    node(node) {
        return new Element('div').set('html', this.getHTML(node).join('')).getFirst();
    },

    isUpdatable(node) {
        if (
            (!node || !node.tree) ||
            (node.getParent() && !node.getParent().$draw) ||
            (node.isRoot() && (!node.tree.$draw || node.tree.forest))
        ) return false;
        return true;
    },

    setNodeStateIcon(node) {
        if (!node.tree.options.showsOpenCloseIcons) {
            return;
        }
        if (node.closeIconUrl) {
            node.getDOM('icon').setStyle('background-image', 'url(' + (node.isOpen() ? node.openIconUrl : node.closeIconUrl) + ')');
        } else {
            node.getDOM('icon').className = 'mt-icon ' + node[node.isOpen() ? 'openIcon' : 'closeIcon'];
        }
    },

    update(node) {
        if (!this.isUpdatable(node)) return null;
        if (!node.hasChildren()) node.state.open = false;
        this.setChildCheckedCount(node);
        node.getDOM('gadjet').className = this.getGadjetClasses(node);
        this.setNodeStateIcon(node);
        node.getDOM('node')[(node.isLastVisible() ? 'add' : 'remove') + 'Class']('mt-node-last');
        if (node.$loading) return null;
        let children = node.getDOM('children');
        if (node.isOpen()) {
            if (!node.$draw) draw.children(node);
            children.style.display = 'block';
        } else {
            children.style.display = 'none';
        }
        node.tree.fireEvent('updateNode', node);
        return node;
    },

    inject(node, element) {
        if (!this.isUpdatable(node)) return;
        element = element || node.getDOM('node') || this.node(node);
        let previous = node.getPrevious();
        if (previous) {
            element.inject(previous.getDOM('node'), 'after');
            return;
        }
        let container;
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

draw.zeroSpace = Browser.ie ? '&shy;' : (Browser.safari | Browser.chrome ? '&#8203' : '');

export default draw;