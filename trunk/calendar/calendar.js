$().ready(function() {
	var time=new Date();
	var currentDay = time.getDate();
	var substring = '<B>' + currentDay + ' ';
	$('td.back3').each(function(){
		if ($(this).html().toUpperCase().indexOf(substring) == 0) {
			$(this).css("border", "3px solid black");
		}	
	});
});