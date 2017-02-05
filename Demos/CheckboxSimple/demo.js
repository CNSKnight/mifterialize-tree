window.addEvent('domready', function() {
    var tree = new Mif.Tree({
        container: $('tree-container'),
        forest: true,
        initialize: function() {
            this.initCheckbox('simple');
            new Mif.Tree.KeyNav(this);
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
        onCheck: function(node) {
            $('log').adopt(new Element('li').set('html', node.name + ' checked'));
        },
        onUnCheck: function(node) {
                $('log').adopt(new Element('li').set('html', node.name + ' unchecked'));
            }
            //      , theme: 'legacy'
    });

    //tree.initSortable();
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
                    "name": "node2",
                    "hasCheckbox": false
                },
                "children": [{
                        "property": {
                            "name": "node2.1"
                        },
                        "state": {
                            "checked": "checked"
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
                    "name": "node3",
                    hasCheckbox: false
                }
            }
        ]
    }];

    // load tree from json.
    tree.load({
        json: json
    });
});