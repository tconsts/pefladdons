// ==UserScript==
// @name           peflreitschool
// @namespace      pefl
// @description    school reit page modification
// @include        http://*pefl.*/plug.php?p=rating&t=s&n=*
// @version	       2.0
// ==/UserScript==


function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&');
	for (n in pf){if (pf[n].split('=')[0] == key) return pf[n].split('=')[1]};
	return false;
}
function debug(text) {if(deb) {debnum++;$('td.back4').append(debnum+'&nbsp;\''+text+'\'<br>');}}

$().ready(function() {

	//рейтинг по репутации
	if(UrlValue('n')==1){
		if($('tr.back6').length>0) localStorage.schreitrep = parseInt($('tr.back6').attr('id'))
		else delete localStorage.schreitrep
	}

}, false);