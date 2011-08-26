// ==UserScript==
// @name           peflmatch
// @namespace      pefl
// @description    match page modification (PEFL.ru and .net)
// @include        http://www.pefl.ru/*&t=if&*
// @include        http://www.pefl.ru/*&t=code&*
// @include        http://pefl.ru/*&t=if&*
// @include        http://pefl.ru/*&t=code&*
// @include        http://www.pefl.net/*&t=if&*
// @include        http://www.pefl.net/*&t=code&*
// @include        http://pefl.net/*&t=if&*
// @include        http://pefl.net/*&t=code&*
// ==/UserScript==

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}

$().ready(function() {

//	$('td.back4 table:first').attr('border','5')	// расстановка
//	$('td.back4 table:eq(1)').attr('border','5')	// все вместе кроме расстановки
//	$('td.back4 table:eq(2)').attr('border','5')	// отчет
//	$('td.back4 table:eq(3)').attr('border','5')	// заголовок матча
//	$('td.back4 table:eq(4)').attr('border','5')	// голы\лого
//	$('td.back4 table:eq(5)').attr('border','5')	// стата
//	$('td.back4 table:eq(6)').attr('border','5')	// оценки

	//Берем оценки за матч(t=if) и дорисовываем в код для форума(t=code)
	var mid = 'match' + UrlValue('j')
	if(UrlValue('t') == 'if'){
		var wimg = '[img]' + $('img[src^="system/img/w"]').attr('src') + '[/img]'
		var ref = ' [b]Главный арбитр:[/b] ' + $('td.back4 table:eq(2)').html().split('Главный арбитр:')[1].split(').')[0] + ').'
		var schet = $('td.back4 table:eq(3) td:eq(1)').text()
		var finschet = ''
		var finschetarr = $('td.back4 table:eq(2) center').html().split('СЧЕТ ')
		if (finschetarr[1]!=undefined && finschetarr[finschetarr.length-1].split('<br>')[0] != schet){
			finschet = ' [center]По пенальти [b][color=red]'+finschetarr[finschetarr.length-1].split('<br>')[0] + '[/color][/b][/center]'
		}
		sessionStorage[mid] = finschet + $('td.back4 table:eq(6)')
			.find('td').removeAttr('width').end()
			.find('td').removeAttr('bgcolor').end()
			.prepend('<tr><td colspan=5 width=50%> </td><td colspan=5 width=50%> </td></tr>')
			.html()
			.replace(/<tbody>/g,'<table width=100% bgcolor=c9f8b7>')
			.replace(/tbody/g,'table')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/a href=\"/g,'url=')
			.replace(/"/g,'')
			.replace(/font /g,'')
			.replace(/font/g,'color')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			+ wimg + ref 
		$('td.back4 table:eq(6) tr:odd').attr('bgcolor','#a3de8f') //#a3de8f #c9f8b7
	} else {
		var res = sessionStorage[mid]
		if(res != undefined){
			var text = ' <font color=555753>'+res+'</font>[/spoiler]'
			$('td.back4 table td:last').html(
				$('td.back4 table td:last').html().replace('[/spoiler]',text)
			)
		}
	}
}, false);