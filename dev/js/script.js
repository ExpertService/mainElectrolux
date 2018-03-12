var $CONTENT_MAX_WIDTH = 1366;

function resize() { 
	
	var containerWidth = document.querySelector('.container').offsetWidth;
	if(document.body.classList.contains("menu_open")){
		if(containerWidth > $CONTENT_MAX_WIDTH){
			document.body.classList.remove("menu_const_width")
		} else {
			document.body.classList.add("menu_const_width");
		}
	}
 }

window.onload=function(){

	var toggleMenu = document.getElementById('toggle_menu');

	if(toggleMenu){
		toggleMenu.addEventListener( "click", function(){
			if(document.body.classList.contains("menu_open")){
				document.body.classList.remove("menu_const_width");
			}
			document.body.classList.toggle("menu_open");
			resize();
		});	
	}

	window.onresize = resize;
}

$( document ).ready(function() {
	
	$('#history_date').datepicker({
			autoClose: true
	})
	.data('datepicker')
	.selectDate(new Date());

	$('.scrollbar-inner').scrollbar({
			ignoreMobile: true
	});
});