/**
 * Tree.renames
 */

const rename = {
    autoExpand: function(input) {
        var span = new Element('span').addClass('mt-rename').setStyles({
            position: 'absolute',
            left: -2000,
            top: 0,
            padding: 0
        }).inject(document.body);
        input.addEvent('keydown', function(event) {
            (function() {
                input.setStyle('width', Math.max(20, span.set('html', input.value.replace(/\s/g, '&nbsp;')).offsetWidth + 15));
            }).delay(10);
        });
    }
};

var treeRename = {
    attachRenameEvents: function() {
        this.wrapper.addEvents({
            click: function(event) {
                if ($(event.target).get('tag') === 'input') return;
                this.beforeRenameComplete();
            }.bind(this),
            keydown: function(event) {
                if (event.key === 'enter') {
                    this.beforeRenameComplete();
                }
                if (event.key === 'esc') {
                    this.renameCancel();
                }
            }.bind(this)
        });
    },

    disableEvents: function() {
        if (!this.eventStorage) this.eventStorage = new Element('div');
        this.eventStorage.cloneEvents(this.wrapper);
        this.wrapper.removeEvents();
    },

    enableEvents: function() {
        this.wrapper.removeEvents();
        this.wrapper.cloneEvents(this.eventStorage);
    },

    getInput: function() {
        if (!this.input) {
            this.input = new Element('input').addClass('mt-rename');
            this.input.addEvent('focus', function() { this.select(); }).addEvent('click', function(event) {
                event.stop();
            });

            rename.autoExpand(this.input);
        }
        return this.input;
    },

    startRename: function(node) {
        this.focus();
        this.unselect();
        this.disableEvents();
        this.attachRenameEvents();
        var input = this.getInput();
        input.value = node.name;
        this.renameName = node.getDOM('name');
        this.renameNode = node;
        input.setStyle('width', this.renameName.offsetWidth + 15);
        input.replaces(this.renameName);
        input.focus();
    },

    finishRename: function() {
        this.renameName.replaces(this.getInput());
    },

    beforeRenameComplete: function() {
        if (this.options.beforeRename) {
            var newName = this.getInput().value;
            var node = this.renameNode;
            this.options.beforeRename.apply(this, [node, node.name, newName]);
        } else {
            this.renameComplete();
        }
    },

    renameComplete: function() {
        this.enableEvents();
        this.finishRename();
        var node = this.renameNode;
        var oldName = node.name;
        node.set({
            property: {
                name: this.getInput().value
            }
        });
        this.fireEvent('rename', [node, node.name, oldName]);
        this.select(node);
    },

    renameCancel: function() {
        this.enableEvents();
        this.finishRename();
        this.select(this.renameNode);
    }

};

var nodeRename = {
    rename: function() {
        if (this.property.renameDenied) return;
        this.tree.startRename(this);
    }
};

export { treeRename, nodeRename };