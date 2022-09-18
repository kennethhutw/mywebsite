
	$(function() {
	
		$("#Send").click(function(){
					var SenderName = $('#SenderName').val();
	var SenderEmail = $('#SenderEmail').val();
	var SenderMobile = $('#SenderMobile').val();
	var SenderContent = $('#SenderContent').val();
	shake('Projectform');
	$.ajax({
						  type: 'POST',
						  url: 'https://mandrillapp.com/api/1.0/messages/send.json',
						  data: {
							'key': 'dqZ7CArUdFqYekP0Rt6LHg',
							'message': {
							  'from_email': SenderEmail,
							  'to': [
								  {
									'email': 'Kenneth.hu@hotmail.com',
									'name': SenderName,
									'type': 'to'
								  }
								],
							  'autotext': 'true',
							  'subject': 'Project Form',
							  'html': SenderContent + SenderMobile
							}
						  },
						   success: function(){  
							alert("Thanks for contacting me, I will reply to you as soon as possible."); 
						   },
						    error: function(XMLHttpRequest, textStatus, errorThrown) { 
							    alert("Error: " + errorThrown); 
							}
						   
					}).done(function(response) {
					   console.log(response); 
					});
		 });
	});
	
function Submit(){
	
	var SenderName = $('#SenderName').val();
	var SenderEmail = $('#SenderEmail').val();
	var SenderMobile = $('#SenderMobile').val();
	var SenderContent = $('#SenderContent').val();
	$.ajax({
						  type: 'POST',
						  url: 'https://mandrillapp.com/api/1.0/messages/send.json',
						  data: {
							'key': 'dqZ7CArUdFqYekP0Rt6LHg',
							'message': {
							  'from_email': SenderEmail,
							  'to': [
								  {
									'email': 'Kenneth.hu@hotmail.com',
									'name': SenderName,
									'type': 'to'
								  }
								],
							  'autotext': 'true',
							  'subject': 'Project Form',
							  'html': SenderContent + SenderMobile
							}
						  }
					}).done(function(response) {
					   console.log(response); 
					});
	
	
};

	function shake(o){
  var $panel = $("#"+o);
  box_left = ($(window).width() - $panel.width()) / 2; <!-- 居中时left的属性值-->
  $panel.css({'left': box_left,'position':'fixed'});
  for(var i=1; 4>=i; i++){
    $panel.animate({left:box_left-(40-10*i)},50);
    $panel.animate({left:box_left+2*(40-10*i)},50);
  }
 };