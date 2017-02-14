/**
 * Tree.Hover
 */

var hover = {
    initHover: function() {
        var tree = this;
        tree.defaults.hoverClass = '';
        tree.wrapper.addEvent('mousemove', this.hover.bind(tree));
        tree.wrapper.addEvent('mouseout', this.hover.bind(tree));
        tree.defaultHoverState = {
            gadjet: false,
            checkbox: false,
            icon: false,
            name: false,
            node: false
        };
        tree.hoverState = Object.clone(tree.defaultHoverState);
    },

    hover: function() {
        var cnode = this.mouse.node;
        var ctarget = this.mouse.target;
        Array.each(this.hoverState, function(node, target, state) {
            if (node === cnode && (target === 'node' || target === ctarget)) return;
            if (node) {
                hover.out(node, target);
                state[target] = false;
                this.fireEvent('hover', [node, target, 'out']);
            }
            if (cnode && (target === 'node' || target === ctarget)) {
                hover.over(cnode, target);
                state[target] = cnode;
                this.fireEvent('hover', [cnode, target, 'over']);
            } else {
                state[target] = false;
            }
        }, this);
    },

    updateHover: function() {
        this.hoverState = Object.clone(this.defaultHoverState);
        this.hover();
    },


    over: function(node, target) {
        var wrapper = node.getDOM('wrapper');
        wrapper.addClass((node.hoverClass || 'mt-hover') + '-' + target);
        if (node.state.selected) wrapper.addClass((node.hoverClass || 'mt-hover') + '-selected-' + target);
    },

    out: function(node, target) {
        var wrapper = node.getDOM('wrapper');
        wrapper.removeClass((node.hoverClass || 'mt-hover') + '-' + target)
            .removeClass((node.hoverClass || 'mt-hover') + '-selected-' + target);
    }

};

export default hover;