window.addEvent('domready',function(){

	Mif.Tree.Node.implement({
		reloadChildren: function() {
			this.state.loaded=false;
			this.state.open=false;
			this.state.loadable=true;
			this.children=[];
			this.$draw=false;
			this.tree.$getIndex();
			this.getDOM('children').innerHTML='';
			Mif.Tree.Draw.update(this);
			return this;
		}       

	});

	tree = new Mif.Tree({
		container: $('tree-container'),
		forest: true,
		initialize: function(){
			new Mif.Tree.KeyNav(this);
			new Mif.Tree.Drag(this);
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
		height: 18
	});
	
	tree.addEvent('loadChildren', function(parent){
		if(!parent) return;
		if(!parent.$name){
			parent.$name=parent.name;
		}
		parent.set({
			property:{
				name: parent.$name+' ('+parent.children.length+')'
			}
		});
	});

	tree.load({
		json:[{
			property: {name: 'reload me', loadable: true}
		}]
	});

	tree.loadOptions=function(node){
		return {
			url: 'reloadChildren/get_json.php?'+$time()
		};
	}
	
	$('reload').addEvent('click', function(){
		var selected=tree.getSelected();
		if(!selected) return;
		selected.reloadChildren().toggle(true);
	});
	
});