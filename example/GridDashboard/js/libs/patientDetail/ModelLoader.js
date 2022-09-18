/*
To Load .js model. From a json config file.
Use the same naming convention when creating the json file to load.

Required Libraries before loading this class
1 - jQuery [ For json parsing ]
2 - Three.js [ For loading the file from .js ]
 */
var ModelLoader = function()
{
	//=============== variable decelerations ========================//
	var totalObjCount 		= 0;
	var loader 				= null;
	var modelObjParent		= null;
	var loadedObjCount		= 0;
	var callBackFunc		= null;

	var registeredFuncArray = [];

	//=================== Public functions ==========================//
	this.loadModel = function ( jsonFileSrc, onLoadCompleteCallBack )
	{
		callBackFunc = onLoadCompleteCallBack;
		$.getJSON( jsonFileSrc, function(modelData){ loadModelAsync( modelData ); } );
		loader = new THREE.JSONLoader( true );
	};
	
	this.getTotalObjCount = function()
	{
		return totalObjCount;
	};

	this.getModelLoadProgress = function()
	{
		var progressPercent = loadedObjCount / totalObjCount * 100;
		progressPercent 	= Math.round( progressPercent * 100 ) * 0.01;
		progressPercent 	= isNaN(progressPercent) ? 0 : progressPercent;
		return progressPercent / 100;
	};

	this.deRegisterOnLoadComplete = function( func )
	{
		var indexOfFunc = registeredFuncArray.indexOf( func );
		if( func > -1 )
		{
			registeredFuncArray.splice( indexOfFunc, 1 );
		}		
	};

	this.registerOnLoadComplete = function( func )
	{
		registeredFuncArray.push( func );
	};


	//================ Private Functions ===============================//
	function loadModelAsync( modelData )
	{
		countTotalObjToLoad( modelData );
		modelObjParent = createEmptyObject( modelData.name, null );
		loadChildren( modelData.Children, modelObjParent );
	}

	function countTotalObjToLoad( modelData )
	{
		if( modelData.modelToLoad != "" )
			totalObjCount++;

		if( modelData.Children.length > 0 )
		{
			for( var x = 0; x < modelData.Children.length; x++ )
				countTotalObjToLoad( modelData.Children[x] );
		}
	}

	function createEmptyObject( objName, parentObj )
	{
		var createdObj 	= new THREE.Object3D();
		createdObj.name = objName;
		if( parentObj != null ) parentObj.add( createdObj );
		return createdObj;
	}

	function loadChildren( childArray, parentObj )
	{
		for( var x = 0; x < childArray.length; x++ )
		{
			if( childArray[x].modelToLoad == "" )
			{
				var childParentObj = createEmptyObject( childArray[x].name, parentObj )
				if( childArray[x].Children.length > 0 )
					loadChildren( childArray[x].Children, childParentObj );
			}
			else
			{
				loader.load( childArray[x].modelToLoad, makeHandler( childArray[x].name, parentObj ) );
			}
		}
	}

	function makeHandler( meshName, goParentObj )
	{
		return function( geometry, materials )
		{
			for( var x = 0; x < materials.length; x++ )
			{
				if( materials[x].opacity < 1.0 )
				{
					materials[x].transparent = true;
					materials[x].opacity = 1.0 - materials[x].opacity;
					//materials[x].opacity = 0.1;
					//materials[x].depthWrite = false;
				}
			}



			var objMat		= new THREE.MeshFaceMaterial( materials );
			var objMesh 	= new THREE.Mesh( geometry, objMat );
			goParentObj.add( objMesh );
			goParentObj.children[ goParentObj.children.length -1 ].name = meshName;
			
			loadedObjCount++;
			if( loadedObjCount == totalObjCount ) onModelLoadComplete();
		}
	}

	function onModelLoadComplete()
	{
		callBackFunc( modelObjParent );
		for( var x = 0; x < registeredFuncArray.length; x++ )
		{
			//registeredFuncArray[x]();
		}
	}

};