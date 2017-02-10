/**
 * Tree
 * @note - Babel in play in this script - refactor accordingly
 */

import Load from './Tree.Load';
import Node from './Tree.Node';
import Draw from './Tree.Draw';
import Selection from './Tree.Selection';
import Hover from './Tree.Hover';
import state from './Tree.state';
// import patch  from './Tree.mootools-patch'; // this should not be needed going forward

var inFocus = null;

var Tree = new Class({

    version: '0.9.02',

    Implements: [Events, Options],

    options: {
        types: {},
        forest: false,
        animateScroll: true,
        height: 18,
        expandTo: true,
        showsOpenCloseIcons: false,
        theme: 'material'
    },

    initialize: function(options) {
        this.setOptions(options);
        Object.append(this, {
            types: this.options.types,
            forest: this.options.forest,
            animateScroll: this.options.animateScroll,
            dfltType: this.options.dfltType,
            height: this.options.height,
            container: $(options.container),
            UID: ++Tree.UID,
            key: {},
            expanded: []
        });
        this.defaults = {
            name: '',
            cls: '',
            // idk why these need to be on every node?
            openIcon: 'mt-empty-icon',
            closeIcon: 'mt-empty-icon',
            loadable: false,
            hidden: false
        };
        this.dfltState = {
            open: false
        };
        this.$index = [];
        this.updateOpenState();
        if (this.options.expandTo) this.initExpandTo();
        this.DOMidPrefix = 'mt-';
        this.wrapper = new Element('div').addClass('mt-wrapper').inject(this.container);
        this.events();
        this.initScroll();
        Selection.initSelection(this);
        Hover.initHover(this);
        this.addEvent('drawChildren', function(parent) {
            var nodes = parent._toggle || [];
            for (var i = 0, l = nodes.length; i < l; i++) {
                nodes[i].drawToggle();
            }
            parent._toggle = [];
        });
        var id = this.options.id;
        this.id = id;
        if (id != null) state.ids[id] = this;
        if (MooTools.version >= '1.2.2' && this.options.initialize) this.options.initialize.call(this);
    },

    bound: () => {
        Array.each(arguments, function(name) {
            this.bound[name] = this[name].bind(this);
        }, this);
    },

    events: () => {
        this.bound('mouse', 'mouseleave', 'mousedown', 'preventDefault', 'toggleClick', 'toggleDblclick', 'focus', 'blurOnClick', 'keyDown', 'keyUp');

        this.wrapper.addEvents({
            mousemove: this.bound.mouse,
            mouseover: this.bound.mouse,
            mouseout: this.bound.mouse,
            mouseleave: this.bound.mouseleave,
            mousedown: this.bound.mousedown,
            click: this.bound.toggleClick,
            dblclick: this.bound.toggleDblclick,
            selectstart: this.bound.preventDefault
        });

        this.container.addEvent('click', this.bound.focus);
        document.addEvent('click', this.bound.blurOnClick);

        document.addEvents({
            keydown: this.bound.keyDown,
            keyup: this.bound.keyUp
        });
    },

    blurOnClick: event => {
        var target = event.target;
        while (target) {
            if (target === this.container) return;
            target = target.parentNode;
        }
        this.blur();
    },

    focus: () => {
        if (inFocus && inFocus === this) return this;
        if (inFocus) inFocus.blur();
        inFocus = this;
        this.focused = true;
        this.container.addClass('mt-focused');
        return this.fireEvent('focus');
    },

    blur: () => {
        inFocus = null;
        if (!this.focused) return this;
        this.focused = false;
        this.container.removeClass('mt-focused');
        return this.fireEvent('blur');
    },

    $getIndex: () => { //return array of visible nodes.
        this.$index = [];
        var node = this.forest ? this.root.getFirst() : this.root;
        var previous = node;
        while (node) {
            if (!(previous.hidden && previous.contains(node))) {
                if (!node.hidden) this.$index.push(node);
                previous = node;
            }
            node = node._getNextVisible();
        }
    },

    preventDefault: event => {
        event.preventDefault();
    },

    mousedown: event => {
        if (event.rightClick) return;
        event.preventDefault();
        this.fireEvent('mousedown');
    },

    mouseleave: () => {
        this.mouse.coords = { x: null, y: null };
        this.mouse.target = false;
        this.mouse.node = false;
        if (this.hover) this.hover();
    },

    mouse: event => {
        this.mouse.coords = this.getCoords(event);
        var target = this.getTarget(event);
        this.mouse.target = target.target;
        this.mouse.node = target.node;
    },

    getTarget: event => {
        var target = event.target,
            node;
        while (!(/mt-/).test(target.className)) {
            target = target.parentNode;
        }
        var test = target.className.match(/mt-(gadjet)-[^n]|mt-(icon)|mt-(name)|mt-(checkbox)/);
        if (!test) {
            var y = this.mouse.coords.y;
            if (y === -1 || !this.$index) {
                node = false;
            } else {
                node = this.$index[((y) / this.height).toInt()];
            }
            return {
                node: node,
                target: 'node'
            };
        }
        for (var i = 5; i > 0; i--) {
            if (test[i]) {
                var type = test[i];
                break;
            }
        }
        return {
            node: Tree.Nodes[target.getAttribute('uid')],
            target: type
        };
    },

    getCoords: event => {
        var position = this.wrapper.getPosition();
        var x = event.page.x - position.x;
        var y = event.page.y - position.y;
        var wrapper = this.wrapper;
        if ((y - wrapper.scrollTop > wrapper.clientHeight) || (x - wrapper.scrollLeft > wrapper.clientWidth)) { //scroll line
            y = -1;
        };
        return { x: x, y: y };
    },

    keyDown: event => {
        this.key = event;
        this.key.state = 'down';
        if (this.focused) this.fireEvent('keydown', [event]);
    },

    keyUp: event => {
        this.key = {};
        this.key.state = 'up';
        if (this.focused) this.fireEvent('keyup', [event]);
    },

    toggleDblclick: event => {
        var target = this.mouse.target;
        if (!(target === 'name' || target === 'icon')) return;
        this.mouse.node.toggle();
    },

    toggleClick: event => {
        if (this.mouse.target !== 'gadjet') return;
        this.mouse.node.toggle();
    },

    initScroll: () => {
        this.scroll = new Fx.Scroll(this.wrapper, { link: 'cancel' });
    },

    scrollTo: node => {
        var position = node.getVisiblePosition();
        var top = position * this.height;
        var up = (top < this.wrapper.scrollTop);
        var down = (top > (this.wrapper.scrollTop + this.wrapper.clientHeight - this.height));
        if (position === -1 || (!up && !down)) {
            this.scroll.fireEvent('complete');
            return false;
        }
        if (this.animateScroll) {
            this.scroll.start(this.wrapper.scrollLeft, top - (down ? this.wrapper.clientHeight - this.height : this.height));
        } else {
            this.scroll.set(this.wrapper.scrollLeft, top - (down ? this.wrapper.clientHeight - this.height : this.height));
            this.scroll.fireEvent('complete');
        }
        return this;
    },

    updateOpenState: () => {
        this.addEvents({
            drawChildren: function(parent) {
                var children = parent.children;
                for (var i = 0, l = children.length; i < l; i++) {
                    children[i].updateOpenState();
                }
            },
            drawRoot: () => {
                this.root.updateOpenState();
            }
        });
    },

    expandTo: node => {
        if (!node) return this;
        var path = [];
        while (!node.isRoot() && !(this.forest && node.getParent().isRoot())) {
            node = node.getParent();
            if (!node) break;
            path.unshift(node);
        };
        path.each(function(el) {
            el.toggle(true);
        });
        return this;
    },

    initExpandTo: () => {
        this.addEvent('loadChildren', function(parent) {
            if (!parent) return;
            var children = parent.children;
            for (var i = children.length; i--;) {
                var child = children[i];
                if (child.expandTo) this.expanded.push(child);
            }
        });

        function expand() {
            this.expanded.each(function(node) {
                this.expandTo(node);
            }, this);
            this.expanded = [];
        };
        this.addEvents({
            'load': expand.bind(this),
            'loadNode': expand.bind(this)
        });
    },

    load: options => {
        var tree = this;
        this.loadOptions = this.loadOptions || Function.from({});

        function success(json) {
            var parent = null;
            if (tree.forest) {
                tree.root = new Node({
                    tree: tree,
                    parentNode: null
                }, {});
                parent = tree.root;
            }
            Load.children(json, parent, tree);
            Draw[tree.forest ? 'forestRoot' : 'root'](tree);
            tree.$getIndex();
            tree.fireEvent('load');
            return tree;
        }
        options = Object.append(Object.append({
            isSuccess: Function.from(true),
            secure: true,
            onSuccess: success,
            method: 'get'
        }, this.loadOptions()), options);
        if (options.json) return success(options.json);
        new Request.JSON(options).send();
        return this;
    },
    Nodes: {}

});

Tree.UID = 0;

Array.implement({
    inject: function(added, current, where) { //inject added after or before current;
        var pos = this.indexOf(current) + (where === 'before' ? 0 : 1);
        for (var i = this.length - 1; i >= pos; i--) {
            this[i + 1] = this[i];
        }
        this[pos] = added;
        return this;
    }

});

export default Tree;