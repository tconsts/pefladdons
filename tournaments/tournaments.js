// ==UserScript==
// @name           peflturnaments
// @namespace      pefl
// @description    pefl turnaments page modification
// @include        http://*pefl.*/plug.php?p=refl&t=cup&j=*
// @include        http://*pefl.*/plug.php?p=refl&t=ec&j=*
// @include        http://*pefl.*/plug.php?p=refl&t=t&j=*
// @include        http://*pefl.*/plug.php?p=refl&t=f&j=*
// @version        1.0
// ==/UserScript==

if(typeof (deb) == 'undefined') deb = false
var debnum = 0

$().ready(function(){
	if(UrlValue('t')=='ec'){
		$('td.back4 table table')
			.append('<tr><td></td></tr>')
			.find('tr:first').append('<td width=30% rowspan=6 valign=center><img src="system/img/flags/'+UrlValue('j')+'.gif"></img></td>')
	}
}, false);

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}

function debug(text) {if(deb){debnum++;$('td.back4').append(debnum+'&nbsp;\''+text+'\'<br>');}}