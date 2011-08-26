// ==UserScript==
// @name           peflmatch
// @namespace      pefl
// @description    match page modification (PEFL.ru and .net)
// @include        http://www.pefl.ru/plug.php?p=refl&t=if&*
// @include        http://www.pefl.ru/plug.php?p=refl&t=code&*
// @include        http://pefl.ru/plug.php?p=refl&t=if&*
// @include        http://pefl.ru/plug.php?p=refl&t=code&*
// @include        http://www.pefl.net/plug.php?p=refl&t=if&*
// @include        http://www.pefl.net/plug.php?p=refl&t=code&*
// @include        http://pefl.net/plug.php?p=refl&t=if&*
// @include        http://pefl.net/plug.php?p=refl&t=code&*
// ==/UserScript==

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

$().ready(function() {

//	$('td.back4 table:first').attr('border','5')	// расстановка
//	$('td.back4 table:eq(1)').attr('border','1')	// все вместе кроме расстановки
//	$('td.back4 table:eq(2)').attr('border','1')	// отчет
//	$('td.back4 table:eq(3)').attr('border','2')	// заголовок матча
//	$('td.back4 table:eq(4)').attr('border','3')	// голы\лого
//	$('td.back4 table:eq(5)').attr('border','4')	// стата
//	$('td.back4 table:eq(6)').attr('border','5')	// оценки

	//Берем оценки за матч(if) и дорисовываем в код для форума(else)
	if(UrlValue('t') == 'if'){
		sessionStorage['curmatch'] = $('td.back4 table:eq(6)')
			.find('td').removeAttr('width').removeAttr('bgcolor').end()
//			.find('tr:odd').attr('bgcolor','#a3de8f').end() //#a3de8f #c9f8b7
			.html()
			.replace(/<tbody>/g,'<table width=100% bgcolor=c9f8b7>')
			.replace(/tbody/g,'table')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/a href=\"/g,'url=')
			.replace(/"/g,'')
			.replace(/\/a/g,'/url')
			.replace(/\&amp\;/g,'&')
			.replace(/font /g,'')
			.replace(/font/g,'color')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
	} else {
		var res = sessionStorage['curmatch']
		if(res != undefined){
			var text = res
			$('td.back4 table td:last').html(
				$('td.back4 table td:last').html().replace('[/spoiler]',text+'[/spoiler]')
			)
		}
	}
}, false);