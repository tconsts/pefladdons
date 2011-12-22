// ==UserScript==
// @name           peflcalendar
// @namespace      pefl
// @description    calendar modification
// @include        http://*pefl.*/plug.php?p=calendar&*
// @version        1.0
// ==/UserScript==

$().ready(function() {
	var time=new Date();
	var currentDay = time.getDate();
	var substring = '<B>' + currentDay + ' ';
	$('td.back3').each(function(){
		if ($(this).html().toUpperCase().indexOf(substring) == 0) {
			$(this).css("border", "3px solid yellow");
		}	
	});
});