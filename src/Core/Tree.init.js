/**
 * Tree.init.js
 */

import state from './Tree.state';
import load from './Tree.load';
import draw from './Tree.draw';

import Node from './Tree.Node';

var init = {
    options: {
        types: {},
        forest: false,
        animateScroll: true,
        height: 18,
        expandTo: true,
        showsOpenCloseIcons: false,
        selectable: true, // whether to enable node selection events and class changes
        theme: 'material'
    },

    initialize: function(options) {
        this.setOptions(options);
        Object.append(this, {
            name: 'Steeve',
            types: this.options.types,
            forest: this.options.forest,
            nodes: [],
            animateScroll: this.options.animateScroll,
            dfltType: this.options.dfltType,
            height: this.options.height,
            container: $(options.container),
            // unused? UID: ++Tree.UID,
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
        this.initUpdateOpenState();
        this.options.expandTo && this.initExpandTo();
        this.DOMidPrefix = 'mt-';
        this.wrapper = new Element('div').addClass('mt-wrapper').inject(this.container);
        this.events();
        this.initScroll();
        this.initSelection();
        this.initHover();
        this.addEvent('drawChildren', parent => {
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

    $getIndex: function() { //return array of visible nodes.
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

    load: function(options) {
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
            load.children(json, parent, tree);
            draw[tree.forest ? 'forestRoot' : 'root'](tree);
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
    }
};

export default init;