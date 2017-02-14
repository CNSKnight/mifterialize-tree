window.addEvent('domready', function() {
    let SimpleTree = new window.Mif.Tree({
            container: $('tree-container'),
            onNodeCreate: function(node) {
                node.set({ id: node.name });
            },
            types: {
                folder: {
                    openIcon: 'mt-open-icon',
                    closeIcon: 'mt-close-icon'
                }
            },
            dfltType: 'folder',
            height: 20
        })
        .load({
            url: '../assets/files/simpleTree.json'
        })
        .addEvent('load', function() {
            this.root.toggle();
            this.select(this.root);
            window.Mif.id('node2.1').inject(window.Mif.id('node4'));
        });


    $('add_node').addEvent('click', function() {
        var current = SimpleTree.getSelected();
        if (!current) return;
        SimpleTree.add({
            property: {
                name: $('node_name').value
            }
        }, current, $('where').getElement(':selected').innerHTML);
        return false;
    });
});