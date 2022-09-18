
	
$( document ).ready(function() {

var	humanBodyObj = new HumanBody(document.getElementById("divHumanModel"));

    humanBodyObj.initialize();
	humanBodyObj.setContainerSize($("#divHumanModel").width(),640);
	humanBodyObj.HumanModelLoader.registerOnLoadComplete(this.PopulateModelInjury);

function PopulateModelInjury () {
	humanBodyObj.ResetColorForAllBones();
	
}
$( "#Injury" ).change(function() {
	UnHighlightBone();
		var str = "";
		$( "select option:selected" ).each(function() {
			str += $( this ).val();
		});
		if(str != "NoInjured"){
			humanBodyObj.HighlightBone(str);
		}else{
			UnHighlightBone();
		}
	}).trigger('change');
	
	
	 $("#imgRotateModel").click(function() {
	 humanBodyObj.TurnOnRotation();
	 });
	  $("#resetRotation").click(function() {
	 humanBodyObj.ResetBodyRotation();
	 });
	
function UnHighlightBone(){
    bones = ["Bone_ripcage","Bone_Rhand","Bone_Lshoulderblade","Bone_Lhand","Bone_head"];
	bones.forEach(function(s) {
		console.log(s);
			humanBodyObj.UnHighlightBone(s);
		
	});
}	
});