// Maptype 0: OSM 1:Google Map
var defaultMap      = "0";
var hospitalIcon="js/libs/Map/images/Hospital.png";
var hospitalDataUrl="js/hospital.json";

//Cluster
var ClusterDataUrl="js/Cluster.json";
// Selection Cretaria 
var dataTypes    = "Hospital Dengue TB HFMD Malaria".split(" ");

//Google map Location
var mapLat       = 1.3571318;
var mapLng       = 103.8080804;
var defaultCentre = [1.3571318,103.8080804];

var layerSetting =[
{
	"layer" :"Bar",
	"datasourceURL" :"bar",
	"filter":[
	{
		"type":"accordioncheckbox",
		"displayname":"Status",
		"field":"status"
	},
	{
		"type":"checkbox",
		"displayname":"Id",
		"field":"@id"
	}
	]
}
]




