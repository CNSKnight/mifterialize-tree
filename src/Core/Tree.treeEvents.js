/**
 * Tree.Events.js
 */

import state from './Tree.state';

var treeEvents = {
    bound: function(toBinds) {
        Array.each(toBinds, name => {
            this.bound[name] = this[name].bind(this);
        });
    },

    events: function() {
        this.bound([
            'preventDefault',
            'mouse',
            'mouseleave',
            'mousedown',
            'toggleClick',
            'toggleDblclick',
            'focus',
            'blurOnClick',
            'keyDown',
            'keyUp'
        ]);

        this.wrapper.addEvents({
            selectstart: this.bound.preventDefault,
            mousemove: this.bound.mouse,
            mouseover: this.bound.mouse,
            mouseout: this.bound.mouse,
            mouseleave: this.bound.mouseleave,
            mousedown: this.bound.mousedown,
            click: this.bound.toggleClick,
            dblclick: this.bound.toggleDblclick
        });

        this.container.addEvent('click',
            this.bound.focus);
        document.addEvent('click',
            this.bound.blurOnClick);

        document.addEvents({
            keydown: this.bound.keyDown,
            keyup: this.bound.keyUp
        });
    },

    blurOnClick: function(event) {
        var target = event.target;
        while (target) {
            if (target === this.container) return;
            target = target.parentNode;
        }
        this.blur();
    },

    focus: function() {
        if (state.inFocus && state.inFocus === this) return this;
        if (state.inFocus) state.inFocus.blur();
        state.inFocus = this;
        this.focused = true;
        this.container.addClass('mt-focused');
        return this.fireEvent('focus');
    },

    blur: function() {
        state.inFocus = null;
        if (!this.focused) return this;
        this.focused = false;
        this.container.removeClass('mt-focused');
        return this.fireEvent('blur');
    },

    preventDefault: function(event) {
        event.preventDefault();
    },

    mousedown: function(e) {
        if (e.rightClick) return;
        e.preventDefault();
        this.fireEvent('mousedown');
    },

    mouseleave: function() {
        this.mouse.coords = {
            x: null,
            y: null
        };
        this.mouse.target = false;
        this.mouse.node = false;
        if (this.hover) this.hover();
    },

    mouse: function(event) {
        this.mouse.coords = this.getCoords(event);
        var target = this.getTarget(event);
        this.mouse.target = target.target;
        this.mouse.node = target.node;
    },

    getTarget: function(event) {
        var target = event.target,
            node;
        while (!(/mt-/).test(target.className)) {
            target = target.parentNode;
        }
        let testr = target.className || target.tagName;
        var machez = testr.match(/mt-gadget-(none)|mt-(gadjet)|mt-(icon)|mt-(name)|mt-(checkbox)/);
        if (!machez) {
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
            if (machez[i]) {
                var type = machez[i];
                break;
            }
        }
        return {
            // .Tree > this
            node: this.nodes[target.getAttribute('uid')],
            target: type
        };
    },

    getCoords: function(event) {
        var position = this.wrapper.getPosition();
        var x = event.page.x - position.x;
        var y = event.page.y - position.y;
        var wrapper = this.wrapper;
        if ((y - wrapper.scrollTop > wrapper.clientHeight) || (x - wrapper.scrollLeft > wrapper.clientWidth)) { //scroll line
            y = -1;
        };
        return {
            x: x,
            y: y
        };
    },

    keyDown: function(event) {
        this.key = event;
        this.key.state = 'down';
        if (this.focused) this.fireEvent('keydown', [event]);
    },

    keyUp: function(event) {
        this.key = {};
        this.key.state = 'up';
        if (this.focused) this.fireEvent('keyup', [event]);
    },

    toggleDblclick: function(event) {
        var target = this.mouse.target;
        if (!(target === 'name' || target === 'icon')) return;
        this.mouse.node.toggle();
    },

    toggleClick: function(event) {
        if (this.mouse.target !== 'gadjet') return;
        this.mouse.node.toggle();
    },

    initScroll: function() {
        this.scroll = new Fx.Scroll(this.wrapper, { link: 'cancel' });
    },

    scrollTo: function(node) {
        var position = node.getVisiblePosition();
        var top = position * this.height;
        var up = (top < this.wrapper.scrollTop);
        var down = (top > (this.wrapper.scrollTop + this.wrapper.clientHeight - this.height));
        if (position === -1 || (!up && !down)) {
            this.scroll.fireEvent('complete');
            return false;
        }
        if (this.animateScroll) {
            this.scroll.start(this.wrapper.scrollLeft,
                top - (down ? this.wrapper.clientHeight - this.height : this.height));
        } else {
            this.scroll.set(this.wrapper.scrollLeft,
                top - (down ? this.wrapper.clientHeight - this.height : this.height));
            this.scroll.fireEvent('complete');
        }
        return this;
    },

    initUpdateOpenState: function() {
        this.addEvents({
            drawChildren: function(parent) {
                var children = parent.children;
                for (var i = 0,
                        l = children.length; i < l; i++) {
                    children[i].updateOpenState();
                }
            },
            drawRoot: function() {
                this.root.updateOpenState();
            }
        });
    },

    expandTo: function(node) {
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

    initExpandTo: function() {
        this.addEvent('loadChildren',
            parent => {
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
                },
                this);
            this.expanded = [];
        };

        this.addEvents({
            'load': expand.bind(this),
            'loadNode': expand.bind(this)
        });
    }
};

export default treeEvents;