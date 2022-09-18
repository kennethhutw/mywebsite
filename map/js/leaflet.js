var myIcon = L.icon({
    iconUrl: 'http://localhost/example/OSM/js/libs/Map/images/Hospital.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var markers = [
   {
     "name": "Canada",
     "url": "https://en.wikipedia.org/wiki/Canada",
     "lat": 56.130366,
     "lng": -106.346771
   },
   {
     "name": "Anguilla",
     "url": "https://en.wikipedia.org/wiki/Anguilla",
     "lat": 18.220554,
     "lng": -63.068615
   },
   {
     "name": "Japan",
     "url": "https://en.wikipedia.org/wiki/Japan",
     "lat": 36.204824,
     "lng": 138.252924
   }
];
var map = L.map('mymap');


	
	map.setView([1.3571318,103.8080804], 13);
	var hospitals = new L.LayerGroup();
 loadJSON("js/hospital.json",
					function(data) {	
//var map = L.map('mymap').setView([1.3571318,103.8080804], 13);


var i = 1;
if(i == 1)
{
 var googleLayer = new L.Google('ROADMAP');
      map.addLayer(googleLayer);
	 
	
					}
					else
					{
						 mapLink = 
							'<a href="http://openstreetmap.org">OpenStreetMap</a>';
						L.tileLayer(
							'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
							attribution: '&copy; ' + mapLink + ' Contributors',
							maxZoom: 18,
							}).addTo(map);
						

					}
					
					var hospitalmarkers =[];
					for ( var i=0; i < data.length; ++i ) 
						{
						/* var hospitalmarker =  L.marker( [data[i].properties.geox,data[i].properties.geoy] , {icon: myIcon} )
						   .bindPopup( '<a href="" target="_blank">' + data[i].properties.name + '</a>' )
							  .addTo( map ); */
							  
							  L.marker( [data[i].properties.geox,data[i].properties.geoy] , {icon: myIcon} )
						   .bindPopup( '<a href="" target="_blank">' + data[i].properties.name + '</a>' ).addTo(hospitals);
						// hospitalmarkers.push(hospitalmarker);
						}
					// L.layerGroup(hospitalmarkers).addTo(map);
					 
						   //L.control.layers(hospitals).addTo(map);
					  });
				 map.addLayer(hospitals);	  
		//$("#optionsCheck input[type=checkbox]").change(onChangeOnOff);
		 $("#optionsCheck input[type=checkbox]").change(function(event){
			if(map.hasLayer(hospitals)) {
       // $(this).removeClass('selected');
        map.removeLayer(hospitals);
    } else {
        map.addLayer(hospitals);        
       // $(this).addClass('selected');
   }
		 });
	 
	 

	  /*
 mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);
*/
					

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
function onChangeOnOff() {
	
	/*
	 if ($(this).is(":checked")) {
				
					// b.ShowHosiptal(1,this.id);
					clickme();
				
            } else {
               
					// b.ShowHosiptal(0,this.id);
					clickme();
				
            }
	
	  if(map.hasLayer(hospitals)) {
       // $(this).removeClass('selected');
        map.removeLayer(hospitals);
    } else {
        map.addLayer(restaurants);        
       // $(this).addClass('selected');
   }*/
	 };
	 
	 var clickme=function(){
	/*
	   $.getJSON( "js/hospital.json", function(data) {
		alert(data);
		}).done(function() { alert('getJSON request succeeded!'); })
.fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! ' + textStatus); })
;*/
	alert('aa');
};