$(function(){
	$("#menu-icon").click(openMenu);

	$("#menu-open-layer").click(openMenu)

	function openMenu(){
		$("#menu-left").toggleClass('menu-close');
		$("#menu-icon").toggleClass('menu-icon-X');
		$("#menu-open-layer").toggleClass('hide');
	}
});//end ready