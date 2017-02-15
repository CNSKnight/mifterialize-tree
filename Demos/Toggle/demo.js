window.addEvent('domready', function() {
    new Mif.Tree({
            container: $('tree-container'),
            types: {
                folder: {
                    openIcon: 'mt-open-icon',
                    closeIcon: 'mt-close-icon'
                }
            },
            dfltType: 'folder',
            height: 18
        })
        .load({
            url: '/data/simpleTree.json'
        })
        .addEvent('toggle', function(node, state) {
            $('log').adopt(new Element('li').set('html', node.name + ' ' + (state ? 'expanded' : 'collapsed')));
        });
});