// ==UserScript==
// @name           pefllinksostav
// @namespace      pefl
// @description    add menu link to sostav
// @include        http://pefl.ru/*
// @include        http://www.pefl.ru/*
// @include        http://pefl.net/*
// @include        http://www.pefl.net/*
// ==/UserScript==


function ChangePage() {
 $().ready(function() {
	var search = 'Состав на матч';
	$('.back3 td').each(function() {
	  if ($(this).html().indexOf(search)!=-1){
		var newbody = $(this).html().replace(search,search+'</a><br><img src=\'http://const.fanstvo.com/monkey/crab1.png\' width=16 height=16><a href=\'pfs.php?sostav\'> Состав +');
		$(this).html(newbody);
	  }
	});
 });
}

var headID = document.getElementsByTagName("head")[0];         

// Add jQuery
var GM_JQ = document.createElement('script');
GM_JQ.src = 'js/jquery-1.3.2.min.js';
GM_JQ.type = 'text/javascript';
headID.appendChild(GM_JQ);

// Check if jQuery's loaded
function GM_wait() {
	if (typeof unsafeWindow.jQuery == 'undefined') {
		window.setTimeout(GM_wait,500);
	} else {
		$ = unsafeWindow.jQuery; letsJQuery();
	}
}
GM_wait();

// All your GM code must be inside this function
function letsJQuery() {
	ChangePage(); // check if the dollar (jquery) function works
}
