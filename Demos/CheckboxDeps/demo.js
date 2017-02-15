window.addEvent('domready', function() {
    var tree = new Mif.Tree({
        container: $('tree-container'),
        forest: true,
        initialize: function() {
            this.initCheckbox('deps');
            new Mif.Tree.KeyNav(this);
        },
        types: {
            folder: {
                openIcon: 'mt-open-icon',
                closeIcon: 'mt-close-icon'
            },
            loader: {
                openIcon: 'mt-loader-open-icon',
                closeIcon: 'mt-loader-close-icon'
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
        dfltType: 'folder'
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

    $('getChecked').addEvent('click', function() {
        var checked = '';
        tree.getChecked().each(function(node) {
            checked += '<p>' + node.name + '</p>';
        });
        $('checked').innerHTML = checked;
    });

});