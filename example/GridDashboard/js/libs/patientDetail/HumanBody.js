
	// var MODEL_JSON_LOAD_FILE	= "/json/HumanModel.json";
var HumanBody = function( containerRef )
{
	
	var MODEL_JSON_LOAD_FILE	= "js/libs/patientDetail/Humanmodel.json";
	         

	var camera 		= null;
	var scene 		= null;
	var renderer 	= null;
	var container 	= containerRef;
	var self 		= this;
	var controls 	= null;

	var turnRotationOn = false;

	var maleBodySkin = null;

	//============= Registering of events ===========//
	document.addEventListener( 'keydown', onKeyDown, false );

	//========= public propeties ========//
	this.HumanModelLoader	= null;
	self.HumanModelParent 	= null;

	var containerObject = $( '#'+container.id );

	var progressChecker = null;

	var loadingDiv = null;
	function createLoadingDiv()
	{
		loadingDiv = $('<div id="loadingDiv">');
		loadingDiv.css({ width : containerObject.clientWidth, height : containerObject.clientHeight, 'backgroundColor' : '#000000', color : '#FFFFFF','text-align': 'right', 'font-size': '18px','vertical-align': 'middle'});
		loadingDiv.text( 'Loading..' );
		loadingDiv.appendTo( containerObject );
	}

	this.initialize = function()
	{
		createLoadingDiv();
		//=========== Setting up scene ===========//
		scene 				= new THREE.Scene();
		camera 				= new THREE.PerspectiveCamera( 45, container.clientWidth/container.clientHeight, 1, 10000 );
		renderer 			= new THREE.WebGLRenderer( { antialias : true } );
		controls 			= new THREE.OrbitControls( camera, container );
		renderer.autoClear 	= false;
		renderer.setSize( container.clientWidth, container.clientHeight );
		container.appendChild( renderer.domElement );

		containerObject.resize( function(){ self.setContainerSize( containerObject.width(), containerObject.height() ); } );

		//======== Adding Light to scene ======//
		dirLight =  new THREE.DirectionalLight( 0xeeeeee, 1.0 );
		dirLight.position.set( 1, 1, 1 );
		scene.add( dirLight );

		dirLight1 =  new THREE.DirectionalLight( 0xeeeeee, 1.0 );
		dirLight1.position.set( -1, 1, -1 );
		scene.add( dirLight1 );

		var ambientLight = new THREE.AmbientLight( 0x404040 );
      	scene.add(ambientLight);

		camera.lookAt( scene.position );
		camera.position.set( -72, 1196, 2426 );
		//camera.rotation.set( -0.98, -0.51, -0.635 );
		controls.target 		= new THREE.Vector3( 64, 864, -457 );
		controls.minDistance 	= 1000; //Prevent over zoom
		controls.maxDistance 	= 4000;

		self.HumanModelLoader = new ModelLoader();
		self.HumanModelLoader.loadModel( MODEL_JSON_LOAD_FILE, onModelLoadComplete );
		progressChecker = setInterval(function(){ loadingDiv.text( 'Loading : ' + self.HumanModelLoader.getModelLoadProgress() * 100 + '%' ); }, 50);
	}

	this.setContainerSize = function( width, height )
	{
		renderer.setSize( width, height );
		camera.aspect	=  width / height;
		camera.updateProjectionMatrix();
	};

	this.TurnOnRotation = function()
	{
		turnRotationOn = !turnRotationOn;
	};

	this.ResetBodyRotation = function()
	{
		if( turnRotationOn ) self.TurnOnRotation();
		self.HumanModelParent.rotation.y = 0;
	};

	this.ResetBodyToDefault = function()
	{
		// self.ResetBodyRotation();
		self.HumanModelParent.rotation.y = 0;
		camera.lookAt( scene.position );
		camera.position.set( -72, 1196, 2426 );
		controls.target = new THREE.Vector3( 64, 864, -457 );
	};

	this.ShowBones = function()
	{
		new TWEEN.Tween(maleBodySkin).to( { opacity : ( maleBodySkin.opacity == 1.0 ) ? 0.5 : 1.0 }, 1000 ).start();		
	};

	this.HighlightBone = function( boneName )
	{
		if(self.HumanModelParent)
		{
		var selectedObj = self.HumanModelParent.getObjectByName( boneName );
		if( selectedObj != null )
		{
			new TWEEN.Tween(selectedObj.material.materials[0].color).to( { r : 1, g: 0, b: 0 }, 1000 ).start();
		}
		}
	};

	this.UnHighlightBone = function( boneName )
	{
		if(self.HumanModelParent)
		{
			var selectedObj = self.HumanModelParent.getObjectByName( boneName );
			if( selectedObj != null )
			{
				new TWEEN.Tween(selectedObj.material.materials[0].color).to( { r : ( 149/255 ), g: ( 149/255 ), b: ( 149/255 ) }, 1000 ).start();
			}
		}
	};

	this.ResetColorForAllBones = function()
	{
		for( var x = 0; x < self.HumanModelParent.children.length; x++ )
		{
			if( self.HumanModelParent.children[x].name.indexOf("Bone_") > -1 )
			{
				self.UnHighlightBone( self.HumanModelParent.children[x].name );
			}
		}
	};

	function onModelLoadComplete( parentObj )
	{
		clearInterval( progressChecker );
		loadingDiv.hide();
		self.HumanModelParent = parentObj;
		scene.add( self.HumanModelParent );

		scene.updateMatrixWorld(true);

		maleBodySkin = self.HumanModelParent.getObjectByName("Body").material.materials[0];
		maleBodySkin.opacity = 0.4;
		maleBodySkin.side  = 1;
		console.log( maleBodySkin );

		// var sphereGeom = new THREE.SphereGeometry(100, 32, 16);
		// var moonTexture = THREE.ImageUtils.loadTexture( 'images/grey.jpg' );
		// var moonMaterial = new THREE.MeshBasicMaterial( { map: moonTexture } );
		// var moon = new THREE.Mesh(sphereGeom, moonMaterial);
		// scene.add(moon);

		// var customMaterial = new THREE.ShaderMaterial( 
		// {
		//     uniforms: 
		// 	{ 
		// 		"c":   { type: "f", value: 1.0 },
		// 		"p":   { type: "f", value: 1.4 },
		// 		glowColor: { type: "c", value: new THREE.Color(0xffff00) },
		// 		viewVector: { type: "v3", value: camera.position }
		// 	},
		// 	vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		// 	fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		// 	side: THREE.FrontSide,
		// 	blending: THREE.AdditiveBlending,
		// 	transparent: true
		// }   );

		// var glow = new THREE.Mesh( sphereGeom.clone(), customMaterial.clone() );
	 //    glow.position = moon.position;
		// glow.scale.multiplyScalar(1.2);
		// scene.add( glow );

		// var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x302E2E, side: THREE.BackSide } );
		// var outlineMesh1 = new THREE.Mesh( self.HumanModelParent.getObjectByName("Body").geometry.clone(), outlineMaterial1 );
		// self.HumanModelParent.add( outlineMesh1 );

		animate();
	}

	function animate()
	{
		requestAnimationFrame( animate );
		render();
		update();
	}

	function render()
	{
		renderer.clear();
		renderer.render( scene, camera );
	}

	function update()
	{
		controls.update	();
		TWEEN.update	();

		if( turnRotationOn )
			self.HumanModelParent.rotation.y -= 0.01;
	}

	function onKeyDown( event )
	{
		// if( event.keyCode == 'R'.charCodeAt(0) )
		// {
		// 	self.ResetBodayToDefault();
		// }

		// if( event.keyCode == 'S'.charCodeAt(0) )
		// {
		// 	self.ShowBones();
		// }

		// if( event.keyCode == 'H'.charCodeAt(0) )
		// {
		// 	self.HighlightBone( "Bone_spine" );
		// }

		// if( event.keyCode == 'J'.charCodeAt(0) )
		// {
		// 	self.HighlightBone( "Bone_head" );
		// }

		// if( event.keyCode == 'K'.charCodeAt(0) )
		// {
		// 	self.ResetColorForAllBones();
		// }

		// if( event.keyCode == 'U'.charCodeAt(0) )
		// {
		// 	maleBodySkin.side = 0;
		// }
		// if( event.keyCode == 'L'.charCodeAt(0) )
		// {
		// 	maleBodySkin.side  = 1;
		// }
	}
};