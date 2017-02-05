window.addEvent('domready',function(){
	tree = new Mif.Tree({
		container: $('tree-container'),
		forest: true,
		initialize: function(){
			new Mif.Tree.KeyNav(this);
			new Mif.Tree.Drag(this, {
				beforeDrop: function(current, target, where){
					if(confirm('drop node?')){
						this.drop();
					}else{
						this.emptydrop();
					}
				}
			});
		},
		types: {
			folder:{
				openIcon: 'mt-open-icon',
				closeIcon: 'mt-close-icon'
			},
			loader:{
				openIcon: 'mt-loader-open-icon',
				closeIcon: 'mt-loader-close-icon',
				dropDenied: ['inside','after']
			},
			disabled:{
				openIcon: 'mt-open-icon',
				closeIcon: 'mt-close-icon',
				dragDisabled: true,
				cls: 'disabled'
			},
			book:{
				openIcon: 'mt-book-icon',
				closeIcon: 'mt-book-icon',
				loadable: true
			},
			bin:{
				openIcon: 'mt-bin-open-icon',
				closeIcon: 'mt-bin-close-icon'
			}
		},
		dfltType:'folder',
		height: 18,
		onCopy: function(from, to, where, copy){
			if(from.getParent()==copy.getParent()){
				copy.set({
					property: {
						name: 'copy '+from.name
					}
				});
			}
		}
	});

	//tree.initSortable();
	tree.load({
		url: '../assets/files/forest.json'
	});
	
	tree.loadOptions=function(node){
		return {
			url: '../assets/files/mediumTree.json'
		};
	}
	
});