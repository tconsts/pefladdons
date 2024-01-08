// ==UserScript==
// @name           peflturnaments
// @namespace      pefl
// @description    pefl turnaments page modification
// @include        https://*pefl.*/plug.php?p=refl&t=cup&j=*
// @include        https://*pefl.*/plug.php?p=refl&t=ec&j=*
// @include        https://*pefl.*/plug.php?p=refl&t=t&j=*
// @include        https://*pefl.*/plug.php?p=refl&t=f&j=*
// @encoding	   windows-1251
// ==/UserScript==

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
$().ready(function() {
	if (UrlValue('t') == 'ec') {
		let id = UrlValue('j');

		$('td.back4 table table')
			.before('<div>'+(names[id]).fontsize(3)+'</div><br><br>')
			.append('<tr><td></td></tr>')
			.find('tr:first').append('<td width=30% rowspan=7 valign=center align=center><img height=100 src="system/img/flags/'+id+'.gif"></img></td>')
	}
}, false);