/**
 * Node
 */

import draw from './Tree.draw';
import load from './Tree.load';
import state from './Tree.state';
import { nodeTransform } from '../More/Tree.transforms';
import { nodeCheckbox } from '../More/Tree.checkbox';
import { nodeRename } from '../More/Tree.renames';
import { nodeSelection } from './Tree.selection';

var Node = new Class({
    Implements: [Events],

    initialize: function(structure, options) {
        let inst = this;
        Object.append(inst, structure);
        inst.children = [];
        inst.type = options.type || inst.tree.dfltType;
        inst.property = options.property || {};
        inst.data = options.data;
        inst.state = Object.append(Object.clone(inst.tree.dfltState), options.state);
        inst.$calculate();
        inst.UID = Node.UID++;
        inst.tree.nodes[inst.UID] = inst;
        var id = inst.id;
        if (id != null) state.ids[id] = inst;
        inst.tree.fireEvent('nodeCreate', [inst]);
        inst._property = ['id', 'name', 'cls', 'openIcon', 'closeIcon', 'openIconUrl', 'closeIconUrl', 'hidden'];
        this.doms = {};
    },

    $calculate: function() {
        Object.append(this, Object.clone(this.tree.defaults));
        this.type = Array.convert(this.type);
        this.type.each(type => {
            var props = this.tree.types[type];
            if (props) Object.append(this, props);
        }, this);
        Object.append(this, this.property);
        return this;
    },

    getDOM: function(what) {
        let id = this.tree.DOMidPrefix + this.UID;
        var node = $(id);
        if (what === 'node') return node;
        var wrapper = node.getFirst();
        if (what === 'wrapper' || wrapper.hasClass('mt-' + what)) return wrapper;
        if (what === 'children') return wrapper.getNext();

        return wrapper.getElement('.mt-' + what);
    },

    getGadjetType: function() {
        return (this.loadable && !this.isLoaded()) ? 'plus' : (this.hasVisibleChildren() ? (this.isOpen() ? 'minus' : 'plus') : 'none');
    },

    toggle: function(state) {
        if (this.state.open === state || this.$loading || this.$toggling) return this;
        var parent = this.getParent();

        function toggle(type) {
            this.state.open = !this.state.open;
            if (type === 'drawed') {
                this.drawToggle();
            } else {
                parent._toggle = (parent._toggle || [])[this.state.open ? 'include' : 'erase'](this);
            }
            this.fireEvent('toggle', [this.state.open]);
            this.tree.fireEvent('toggle', [this, this.state.open]);
            return this;
        }
        if (parent && !parent.$draw) {
            return toggle.apply(this, []);
        }
        if (this.loadable && !this.state.loaded) {
            if (!this.load_event) {
                this.load_event = true;
                this.addEvent('load', this.toggle.bind(this));
            }
            return this.load();
        }
        if (!this.hasChildren()) return this;
        return toggle.apply(this, ['drawed']);
    },

    drawToggle: function() {
        this.tree.$getIndex();
        draw.update(this);
    },

    recursive: function(fn, args) {
        args = Array.convert(args);
        if (fn.apply(this, args) !== false) {
            this.children.each(node => {
                if (node.recursive(fn, args) === false) {
                    return false;
                }
            });
        }
        return this;
    },

    isOpen: function() {
        return this.state.open;
    },

    isLoaded: function() {
        return this.state.loaded;
    },

    isLast: function() {
        return (!this.parentNode || this.parentNode.children.getLast() === this);
    },

    isFirst: function() {
        return (!this.parentNode || this.parentNode.children[0] === this);
    },

    isRoot: function() {
        return !!!this.parentNode;
    },

    getChildren: function() {
        return this.children;
    },

    hasChildren: function() {
        return this.children.length ? true : false;
    },

    index: function() {
        if (this.isRoot()) return 0;
        return this.parentNode.children.indexOf(this);
    },

    getNext: function() {
        if (this.isLast()) return null;
        return this.parentNode.children[this.index() + 1];
    },

    getPrevious: function() {
        if (this.isFirst()) return null;
        return this.parentNode.children[this.index() - 1];
    },

    getFirst: function() {
        if (!this.hasChildren()) return null;
        return this.children[0];
    },

    getLast: function() {
        if (!this.hasChildren()) return null;
        return this.children.getLast();
    },

    getParent: function() {
        return this.parentNode;
    },

    _getNextVisible: function() {
        var current = this;
        if (current.isRoot()) {
            if (!current.isOpen() || !current.hasChildren(true)) return false;
            return current.getFirst(true);
        } else {
            if (current.isOpen() && current.getFirst(true)) {
                return current.getFirst(true);
            } else {
                var parent = current;
                do {
                    current = parent.getNext(true);
                    if (current) return current;
                    parent = parent.parentNode;
                } while (parent);
                return false;
            }
        }
    },

    getPreviousVisible: function() {
        var index = this.tree.$index.indexOf(this);
        return index === 0 ? null : this.tree.$index[index - 1];
    },

    getNextVisible: function() {
        var index = this.tree.$index.indexOf(this);
        return index < this.tree.$index.length - 1 ? this.tree.$index[index + 1] : null;
    },

    getVisiblePosition: function() {
        return this.tree.$index.indexOf(this);
    },

    hasVisibleChildren: function() {
        if (!this.hasChildren()) return false;
        if (this.isOpen()) {
            var next = this.getNextVisible();
            if (!next) return false;
            if (next.parentNode !== this) return false;
            return true;
        } else {
            var child = this.getFirst();
            while (child) {
                if (!child.hidden) return true;
                child = child.getNext();
            }
            return false;
        }
    },

    isLastVisible: function() {
        var next = this.getNext();
        while (next) {
            if (!next.hidden) return false;
            next = next.getNext();
        };
        return true;
    },

    contains: function(node) {
        while (node) {
            if (node === this) return true;
            node = node.parentNode;
        };
        return false;
    },

    addType: function(type) {
        return this.processType(type, 'add');
    },

    removeType: function(type) {
        return this.processType(type, 'remove');
    },

    setType: function(type) {
        return this.processType(type, 'set');
    },

    processType: function(type, action) {
        switch (action) {
            case 'add':
                this.type.include(type);
                break;
            case 'remove':
                this.type.erase(type);
                break;
            case 'set':
                this.type = type;
                break;
            default:
        }
        var current = {};
        this._property.each(p => {
            current[p] = this[p];
        }, this);
        this.$calculate();
        this._property.each(p => {
            this.updateProperty(p, current[p], this[p]);
        }, this);
        return this;
    },

    set: function(obj) {
        this.tree.fireEvent('beforeSet', [this, obj]);
        var property = obj.property || obj || {};
        for (var p in property) {
            var nv = property[p];
            var cv = this[p];
            this.updateProperty(p, cv, nv);
            this[p] = this.property[p] = nv;
        }
        this.tree.fireEvent('set', [this, obj]);
        return this;
    },

    updateProperty: function(p, cv, nv) {
        if (nv === cv) return this;
        if (p === 'id') {
            delete state.ids[cv];
            if (nv) state.ids[nv] = this;
            return this;
        }
        if (!draw.isUpdatable(this)) return this;
        switch (p) {
            case 'name':
                this.getDOM('name').set('html', nv);
                return this;
            case 'cls':
                this.getDOM('wrapper').removeClass(cv).addClass(nv);
                return this;
            case 'openIcon':
            case 'closeIcon':
                this.getDOM('icon').removeClass(cv).addClass(nv);
                return this;
            case 'openIconUrl':
            case 'closeIconUrl':
                var icon = this.getDOM('icon');
                icon.setStyle('background-image', 'none');
                if (nv) icon.setStyle('background-image', 'url(' + nv + ')');
                return this;
            case 'hidden':
                this.getDOM('node').setStyle('display', nv ? 'none' : 'block');
                var _previous = this.getPreviousVisible();
                var _next = this.getNextVisible();
                var parent = this.getParent();
                this[p] = this.property[p] = nv;
                this.tree.$getIndex();
                var previous = this.getPreviousVisible();
                var next = this.getNextVisible();
                [_previous, _next, previous, next, parent, this].each(node => {
                    draw.update(node);
                });
                return this;
                // no default
        }
        return this;
    },

    updateOpenState: function() {
        this.state.open && (this.state.open = false && this.toggle());
    },

    load: function(options) {
        this.$loading = true;
        options = options || {};
        this.addType('loader');
        var self = this;

        function success(json) {
            load.children(json, self, self.tree);
            delete self.$loading;
            self.state.loaded = true;
            self.removeType('loader');
            draw.update(self);
            self.fireEvent('load');
            self.tree.fireEvent('loadNode', self);
            return self;
        }

        options = Object.append(Object.append(Object.append({
            isSuccess: Function.from(true),
            secure: true,
            onSuccess: success,
            method: 'get'
        }, this.tree.loadOptions(this)), this.loadOptions), options);
        if (options.json) return success(options.json);
        new Request.JSON(options).send();
        return this;
    }

});

Node.implement(Object.assign({}, nodeTransform, nodeCheckbox, nodeRename, nodeSelection));

Node.UID = 0;

export default Node;