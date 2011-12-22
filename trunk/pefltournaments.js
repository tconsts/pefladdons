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
/**/
var names = {
	'236': 'Копа СудАмерикана',
	'230': 'Кубок конфедераций',
	'235': 'Кубок Либертадорес',
	'234': 'Кубок чемпионов 3А',
	'233': 'Лига Европы',
	'231': 'Лига Чемпионов',
	'239': 'Межконтинентальный',
	'238': 'Рекопа',
	'237': 'Суперкубок Европы'
}
/**/

$().ready(function(){
	if(UrlValue('t')=='ec'){
		var id = UrlValue('j')

		$('td.back4 table table')
//			.append('<tr><td>ddddd</td></tr>')
			.before('<div>'+(names[id]).fontsize(3)+'</div><br><br>')
			.append('<tr><td></td></tr>')
			.find('tr:first').append('<td width=30% rowspan=7 valign=center align=center><img height=100 src="system/img/flags/'+id+'.gif"></img></td>')
	}
}, false);

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}

function debug(text) {if(deb){debnum++;$('td.back4').append(debnum+'&nbsp;\''+text+'\'<br>');}}