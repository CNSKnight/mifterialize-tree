window.addEvent('domready', function() {
    var tree = new CMT.Tree({
        container: $('tree-container'),
        forest: true,
        initialize: function() {
            new CMT.Tree.KeyNav(this);
            new CMT.Tree.Drag(this, {
                onDrag: function() {
                    //inject book inside book not allowed;
                    if (this.target && this.target.type == 'book' && this.current.type == 'book' && this.where == 'inside') {
                        this.where = 'notAllowed';
                    }
                    $('destination').innerHTML = this.target ? this.target.name : '';
                    $('where').innerHTML = this.where;
                },
                onStart: function() {
                    $('source').innerHTML = this.current.name;
                },
                onComplete: function() {
                    $('destination').innerHTML = '';
                    $('where').innerHTML = '';
                    $('source').innerHTML = '';
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

    tree2 = new CMT.Tree({
        container: $('tree-container2'),
        initialize: function() {
            new CMT.Tree.KeyNav(this);
            new CMT.Tree.Drag(this, {
                onDrag: function() {
                    $('destination').innerHTML = this.target ? this.target.name : '';
                    $('where').innerHTML = this.where;
                },
                onStart: function() {
                    $('source').innerHTML = this.current.name;
                },
                onComplete: function() {
                    $('destination').innerHTML = '';
                    $('where').innerHTML = '';
                    $('source').innerHTML = '';
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