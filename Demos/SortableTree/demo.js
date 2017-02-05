window.addEvent('domready',function(){
	tree = new Mif.Tree({
		initialize: function(){
			this.initSortable();
		},
		container: $('tree-container'),// tree container
		types: {// node types
			folder:{
				openIcon: 'mt-open-icon',//css class open icon
				closeIcon: 'mt-close-icon'// css class close icon
			}
		},
		dfltType:'folder',//default node type
		height: 18//node height
	});

	var json=[	
		{
			"property": {
				"name": "root"
			},
			"children": [
				
				{
					"property": {
						"name": "node2"
					},
					"children":[
						{
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
						"name": "node1"
					}
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
		}
	];
	
	// load tree from json.
	tree.load({
		json: json
	});
	
});