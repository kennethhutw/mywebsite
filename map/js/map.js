var b;
$(function() {
	function initMap(){
			var a= $("#GID_HOSPITAL_MAP_Cen");
			 b = new myMap
			if(defaultMap  == "0")
			{
				b.initializeOSM();
			}
			else
			{
				b.initializeGMAP();
			}
		//	$("#mymap").gmap3();
	}

	google.maps.event.addDomListener(window, "load", initMap);
	
	//Add event to checkBoxes 
	
        $("#optionsCheck input[type=checkbox]").change(onChangeOnOff);
		 
});

var myMap = function(){
	
	var map;
	 this.initialize = function()
    {
       

        // Create gmap3 and call the marker generation function  

        mapLat = 1.321281;
        mapLng = 103.845622;

        $('#mymap').gmap3({
            map: {
                options: {
                    zoom: 17,
                    center: new google.maps.LatLng(mapLat, mapLng),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                    },
                    navigationControl: true,
                    scrollwheel: true,
                    streetViewControl: true,
                    styles : myStyle,
                    scaleControl: true,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.DEFAULT
                    }
                },
                onces: {
                    bounds_changed: function () 
                    {
                        //getMarkers($('#mymap').gmap3("get").getBounds());
                    }
                }
            }
        });

      /*  // create check boxes and associate onChange function
        addCheckBoxes(checkBoxes);
        addSelect(L1, id_L1);
        addSelect(L2, id_L2);
        addSelect(L3, id_L3);

        //Add event to checkBoxes 
        $("#optionsCheck input[type=checkbox]").change(onChangeOnOff);
        
        //Add event to dropdown list
        $('select').change(onSelectChk);
		*/
    };
	
	 var myStyle=[
    {
        "featureType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "gamma": 0.5
            }
        ]
    }];

	this.initializeGMAP = function()
	{
		var iconStyle = new ol.style.Style({
		  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
			anchor: [0.5, 46],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			opacity: 0.75,
			src: 'js/libs/Map/images/Hospital.png'
		  }))
		});
		
		
		loadJSON(ClusterDataUrl,
			function(data) {
				var count = 20000;
				var features = [];
				var e = 4500000;
				
				
				
				for(var i =0;i<data.length;i++)
				{
					var iconFeature = new ol.Feature({
							geometry: new ol.geom.Point(ol.proj.transform([data[i].geoy, data[i].geox], 'EPSG:4326',     
							'EPSG:3857')),
							name: data[i].type,
							population: 4000,
							rainfall: 500
						});
						
						features.push(iconFeature);
				}

				var source = new ol.source.Vector({
				  features: features
				});

				var clusterSource = new ol.source.Cluster({
				  distance: 10,
				  source: source
				});
				
				var styleCache = {};
				var clusters = new ol.layer.Vector({
				  source: clusterSource,
				  style: function(feature, resolution) {
					var size = feature.get('features').length;
					var style = styleCache[size];
					if (!style) {
					  style = [new ol.style.Style({
						image: new ol.style.Circle({
						  radius: 10,
						  stroke: new ol.style.Stroke({
							color: '#fff'
						  }),
						  fill: new ol.style.Fill({
							color: '#3399CC'
						  })
						}),
						text: new ol.style.Text({
						  text: size.toString(),
						  fill: new ol.style.Fill({
							color: '#fff'
						  })
						})
					  })];
					  styleCache[size] = style;
					}
					return style;
				  }
				});			
				clusters.set('name', 'Cluster');
		loadJSON(hospitalDataUrl,function(data) {
			
			var hospitals=[];
			for(var i =0;i<data.length;i++)
			{
				var iconFeature = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.transform([data[i].properties.geoy, data[i].properties.geox], 'EPSG:4326',     
				'EPSG:3857')),
				name: data[i].properties.name,
				population: 4000,
				rainfall: 500
				});
				iconFeature.setStyle(iconStyle);
				hospitals.push(iconFeature);
			}
							//hospital end
							
			var vectorSource = new ol.source.Vector({
				features: hospitals
			});

			var vectorLayer = new ol.layer.Vector({
				source: vectorSource,
				title:'vector'
			});
							
			vectorLayer.set('name', 'Hospital');
			var gmap = new google.maps.Map(document.getElementById('mymap'), {
				center: new google.maps.LatLng(mapLng,mapLat),
				zoom: 12,
				disableDefaultUI: true,
				keyboardShortcuts: true,
				raggable: true,
				disableDoubleClickZoom: true,
				scrollwheel: true,
				streetViewControl: true
			});
				var view = new ol.View({
				  // make sure the view doesn't go beyond the 22 zoom levels of Google Maps
				  center : ol.proj.transform([mapLng,mapLat ], 'EPSG:3857', 'EPSG:4326'),
				  maxZoom: 21
				});
				view.on('change:center', function() {
				  var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
				  gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
				});
				view.on('change:resolution', function() {
				  gmap.setZoom(view.getZoom());
				});
			
				var olMapDiv = document.getElementById('olmap');
				view.setCenter([mapLat,mapLng]);
			    map = new ol.Map({
				  layers: [vectorLayer,clusters],
				  interactions: ol.interaction.defaults({
					altShiftDragRotate: false,
					dragPan: false,
					rotate: false
				  }).extend([new ol.interaction.DragPan({kinetic: null})]),
				  target: olMapDiv,
				  view: view
				});
				
				view.setZoom(6);
				olMapDiv.parentNode.removeChild(olMapDiv);
				gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
				
				var element = document.getElementById('popup');

						var popup = new ol.Overlay({
							  element: element,
							  positioning: 'bottom-center',
							  stopEvent: false
						});
						map.addOverlay(popup);

							// display popup on click
						map.on('click', function(evt) {
							var feature = map.forEachFeatureAtPixel(evt.pixel,
							function(feature, layer) {
									return feature;
							});
							if (feature) {
								var geometry = feature.getGeometry();
								var coord = geometry.getCoordinates();
								popup.setPosition(coord);
								$(element).popover({
								'trigger': 'manual',
								  'placement': 'top',
								  'html': true,
								
								});
								
								
								$(element).html("<div class=\"popover fade top in\" role=\"tooltip\" id=\"popover53582\" style=\"top: -62px; left: -34.5px; display: block;\"><div class=\"arrow\" style=\"left: 50%;\"></div><h3 class=\"popover-title\" style=\"display: none;\"></h3><div class=\"popover-content\">"+feature.get('name')+"</div></div>");
								 
								$(element).popover('show');
							} else {
								$(element).html("");
								$(element).popover('destroy');
							  }
						});
						});
		});
		/*
		
    */
	
	}
	
	
	
	this.initializeOSM = function()
	{
	
		var iconStyle = new ol.style.Style({
		  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
			anchor: [0.5, 46],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			opacity: 0.75,
			src: 'js/libs/Map/images/Hospital.png'
		  }))
		});

		
		loadJSON(ClusterDataUrl,
			function(data) {
				var count = 20000;
				var features = [];
				var e = 4500000;
				
				
				
				for(var i =0;i<data.length;i++)
				{
					var iconFeature = new ol.Feature({
							geometry: new ol.geom.Point(ol.proj.transform([data[i].geoy, data[i].geox], 'EPSG:4326',     
							'EPSG:3857')),
							name: data[i].type,
							population: 4000,
							rainfall: 500
						});
						
						features.push(iconFeature);
				}

				var source = new ol.source.Vector({
				  features: features
				});

				var clusterSource = new ol.source.Cluster({
				  distance: 10,
				  source: source
				});
				
				var styleCache = {};
				var clusters = new ol.layer.Vector({
				  source: clusterSource,
				  style: function(feature, resolution) {
					var size = feature.get('features').length;
					var style = styleCache[size];
					if (!style) {
					  style = [new ol.style.Style({
						image: new ol.style.Circle({
						  radius: 10,
						  stroke: new ol.style.Stroke({
							color: '#fff'
						  }),
						  fill: new ol.style.Fill({
							color: '#3399CC'
						  })
						}),
						text: new ol.style.Text({
						  text: size.toString(),
						  fill: new ol.style.Fill({
							color: '#fff'
						  })
						})
					  })];
					  styleCache[size] = style;
					}
					return style;
				  }
				});			
				clusters.set('name', 'Cluster');
				 
				loadJSON(hospitalDataUrl,
					function(data) {		
					//hospital start
						var hospitals=[];
						for(var i =0;i<data.length;i++)
						{
							var iconFeature = new ol.Feature({
								geometry: new ol.geom.Point(ol.proj.transform([data[i].properties.geoy, data[i].properties.geox], 'EPSG:4326',     
								'EPSG:3857')),
								name: data[i].properties.name,
								population: 4000,
								rainfall: 500
							});
							iconFeature.setStyle(iconStyle);
							hospitals.push(iconFeature);
						}
							//hospital end
							
						var vectorSource = new ol.source.Vector({
							features: hospitals
						});

						var vectorLayer = new ol.layer.Vector({
							source: vectorSource,
							title:'vector'
						});
							
						vectorLayer.set('name', 'Hospital');
						
						map = new ol.Map({
							controls: ol.control.defaults({
								attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
									collapsible: false
								})
							}).extend([
								new RotateNorthControl()
							]),
								target: 'mymap',
								renderer: 'canvas',
								layers: [
									new ol.layer.Tile({source: new ol.source.OSM()}),vectorLayer,clusters
								],
								view: new ol.View({
									//projection: 'EPSG:900913',
									center: ol.proj.transform([mapLng,mapLat ], 'EPSG:4326', 'EPSG:3857'),
									zoom: 12
								})

						});
							
						var layerSwitcher = new ol.control.LayerSwitcher();
						map.addControl(layerSwitcher);
							
						
						var element = document.getElementById('popup');

						var popup = new ol.Overlay({
							  element: element,
							  positioning: 'bottom-center',
							  stopEvent: false
						});
						map.addOverlay(popup);

							// display popup on click
						map.on('click', function(evt) {
							var feature = map.forEachFeatureAtPixel(evt.pixel,
							function(feature, layer) {
									return feature;
							});
							if (feature) {
								var geometry = feature.getGeometry();
								var coord = geometry.getCoordinates();
								popup.setPosition(coord);
								$(element).popover({
								'trigger': 'manual',
								  'placement': 'top',
								  'html': true,
								
								});
								
								
								$(element).html("<div class=\"popover fade top in\" role=\"tooltip\" id=\"popover53582\" style=\"top: -62px; left: -34.5px; display: block;\"><div class=\"arrow\" style=\"left: 50%;\"></div><h3 class=\"popover-title\" style=\"display: none;\"></h3><div class=\"popover-content\">"+feature.get('name')+"</div></div>");
								 
								$(element).popover('show');
							} else {
								$(element).html("");
								$(element).popover('destroy');
							  }
						});
					});

			},
		function(xhr) {  }
		);
				
		

	} //initializeOSM
	this.ShowHosiptal = function(isShow,name){
	
		
         map.getLayers().forEach(function (lyr) {
			 if(lyr.get('name')==name){
            lyr.setVisible(isShow);     
			 }
        });
         //map.renderer();
	}

	
};//myMap end

var clickme=function(){
	/*
	   $.getJSON( "js/hospital.json", function(data) {
		alert(data);
		}).done(function() { alert('getJSON request succeeded!'); })
.fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! ' + textStatus); })
;*/
	alert('aa');
};

 function onChangeOnOff() {
	 if ($(this).is(":checked")) {
				
					 b.ShowHosiptal(1,this.id);
				
            } else {
               
					 b.ShowHosiptal(0,this.id);
				
            }
	
	 };
 
 
 function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function RotateNorthControl(opt_options) {
//app.RotateNorthControl = function(opt_options) {

  var options = opt_options || {};

  var button = document.createElement('button');
  button.innerHTML = 'N';

  var this_ = this;
  var handleRotateNorth = function(e) {
    this_.getMap().getView().setRotation(0);
  };

  button.addEventListener('click', handleRotateNorth, false);
  button.addEventListener('touchstart', handleRotateNorth, false);

  var element = document.createElement('div');
  element.className = 'rotate-north ol-unselectable';
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: 'mymap'
  });

};
ol.inherits(RotateNorthControl, ol.control.Control);

