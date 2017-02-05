window.addEvent('domready',function(){
	SimpleTree = new Mif.Tree({
		initialize: function(){
			new  Mif.Tree.KeyNav(this);
		},
		container: $('tree-container'),
		types: {
			folder:{
				openIcon: 'mt-open-icon',
				closeIcon: 'mt-close-icon'
			}
		},
		dfltType:'folder',
		height:20
	})
	.load({
		url: '../assets/files/simpleTree.json'
	})
	.addEvent('load', function(){
		this.root.recursive(function(){
			this.toggle();
		});
		this.select(this.root);
	});
});