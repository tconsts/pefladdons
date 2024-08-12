// ==UserScript==
// @name           peflhist
// @namespace      pefl
// @description    history page modification
// @include        https://*pefl.*/hist.php?*
// @encoding	   windows-1251
// ==/UserScript==

// c = club
// cw = club winners
// m = manager
// p = player
// n = player notes
if (UrlValue('t') == 'n') {
	let text = document.getElementsByName('rtext'),
		ses = parseInt(localStorage.season, 10),
		day = parseInt(localStorage.gday.split('.')[1], 10);

	text[0].value = !isNaN(ses) 
		? ses+'.'+('00' + day).substr(-3,3)+': '
		: (day+1)+"й ИД: ";

	text[0].focus();
} else {

}