Mif.Tree.Node.implement({
		
	getPath: function(){
		var path=[];
		var node=this;
		while(node){
			path.push(node.name);
			node=node.getParent();
		}
		return path.reverse().join('/');
	}

});


var tree = new Mif.Tree({
	container: $('tree-container'),
	initialize: function(){
		this.initSortable();
		new Mif.Tree.KeyNav(this);
		this.addEvent('nodeCreate', function(node){
			node.set({
				property:{
					id:	node.getPath()
				}
			});
		});
		var storage=new Mif.Tree.CookieStorage(this);
		this.addEvent('load', function(){
			storage.restore();
		}).addEvent('loadChildren', function(parent){
			storage.restore();
		});
	},
	types: {
		folder:{
			openIcon: 'mt-open-icon',
			closeIcon: 'mt-close-icon',
			loadable: true
		},
		file:{
			openIcon: 'mt-file-open-icon',
			closeIcon: 'mt-file-close-icon'
		},
		loader:{
			openIcon: 'mt-loader-open-icon',
			closeIcon: 'mt-loader-close-icon',
			DDnotAllowed: ['inside','after']
		}
	},
	dfltType:'folder'
});

tree.load({
	url: demo_path+'getRoot.php'
});

tree.loadOptions=function(node){
	return {
		url: demo_path+'getChildren.php',
		data: {'abs_path': node.data.abs_path}
	};
};

document.addEvent('keydown', function(event){
	if(event.key!='r') return;
	var node=tree.selected;
    if(!node) return;
    node.rename();
});