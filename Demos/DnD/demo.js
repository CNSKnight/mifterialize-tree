window.addEvent('domready', function() {
    var tree = new Mif.Tree({
        container: $('tree-container'),
        forest: true,
        initialize: function() {
            new Mif.Tree.KeyNav(this);
            new Mif.Tree.Drag(this, {
                droppables: [
                    new Mif.Tree.Drag.Element('drop_container', {
                        onDrop: function(node) {
                            $('drop').adopt(new Element('li', { html: node.name }));
                        }
                    })
                ],
                onDrop: function(current, target, where) {
                    //console.log(current, target, where);
                }
            });
        },
        types: {
            folder: {
                openIcon: 'mt-open-icon',
                closeIcon: 'mt-close-icon'
            },
            loader: {
                openIcon: 'mt-loader-open-icon',
                closeIcon: 'mt-loader-close-icon',
                dropDenied: ['inside', 'after']
            },
            disabled: {
                openIcon: 'mt-open-icon',
                closeIcon: 'mt-close-icon',
                dragDisabled: true,
                cls: 'disabled'
            },
            book: {
                openIcon: 'mt-book-icon',
                closeIcon: 'mt-book-icon',
                loadable: true
            },
            bin: {
                openIcon: 'mt-bin-open-icon',
                closeIcon: 'mt-bin-close-icon'
            }
        },
        dfltType: 'folder',
        height: 18,
        onCopy: function(from, to, where, copy) {
            if (from.getParent() == copy.getParent()) {
                copy.set({
                    property: {
                        name: 'copy ' + from.name
                    }
                });
            }
        }
    });

    //tree.initSortable();
    tree.load({
        url: '/data/forest.json'
    });

    tree.loadOptions = function(node) {
        // if node name 'empty' load from url 'empty.json'
        if (node.name == 'empty') {
            return {
                url: '/data/empty.json'
            }
        }
        return {
            url: '/data/mediumTree.json'
        };
    }

    tree2 = new Mif.Tree({
        forest: true,
        container: $('tree-container2'),
        initialize: function() {
            new Mif.Tree.KeyNav(this);
            new Mif.Tree.Drag(this);
        },
        types: {
            folder: {
                openIcon: 'mt-open-icon',
                closeIcon: 'mt-close-icon'
            },
            loader: {
                openIcon: 'mt-loader-open-icon',
                closeIcon: 'mt-loader-close-icon',
                dropDenied: ['inside', 'after']
            },
            disabled: {
                openIcon: 'mt-open-icon',
                closeIcon: 'mt-close-icon',
                dragDisbled: true,
                cls: 'disabled'
            },
            book: {
                openIcon: 'mt-book-icon',
                closeIcon: 'mt-book-icon',
                loadable: true
            },
            bin: {
                openIcon: 'mt-bin-open-icon',
                closeIcon: 'mt-bin-close-icon'
            }
        },
        dfltType: 'folder',
        height: 18,
        onCopy: function(from, to, where, copy) {
            if (from.getParent() == copy.getParent()) {
                copy.set({
                    property: {
                        name: 'copy ' + from.name
                    }
                });
            }
        }
    });

    var json = [{
        "property": {
            "name": "root"
        },
        "children": [{
                "property": {
                    "name": "node1"
                }
            },
            {
                "property": {
                    "name": "node2"
                },
                "children": [{
                        "property": {
                            "name": "node2.1"
                        }
                    },
                    {
                        "property": {
                            "name": "node2.2"
                        }
                    }
                ]
            },
            {
                "property": {
                    "name": "node4"
                }
            },
            {
                "property": {
                    "name": "node3"
                }
            }
        ]
    }];
    tree2.load({
        json: json
    });

});