// ==UserScript==
// @name           peflmatch
// @namespace      pefl
// @description    match page modification
// @include        http://*pefl.*/*&t=if&*
// @include        http://*pefl.*/*&t=code&*
// ==/UserScript==

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}

function ShowTable(n){
	var style = $('td.back4 table:eq('+n+')').attr('style')
	if(style == "display: none" || style == "display: none;" || style == "display: none; "){
		$('td.back4 table:eq('+n+')').show()
		$('a#treport'+n).html('&ndash;')
	} else {
		$('td.back4 table:eq('+n+')').hide()
		$('a#treport'+n).html('+')
	}
}


function TrimString(sInString){
	sInString = sInString.replace(/\&nbsp\;/g,' ');
	return sInString.replace(/(^\s+)|(\s+$)/g, '');
}

var select = ''

function SelPl(name){
	select = name = name.replace(/!/g,' ')
//	alert(select)
	$('p[id^=matchMoment]').each(function(){
		var momText = $(this).html()
		$(this).removeAttr('style')
			.find('font').removeAttr('color')

		if(momText.indexOf(name)!= -1) {
			$(this).css({'background-color' : 'a3de8f', 'font-weight' : 'bolder'}); 
			$(this).html(momText.replace(new RegExp(name,'g'), '<font color=red>'+name+'</font>'))
		}
	})
}

if(typeof (deb) == 'undefined') deb = false
var debnum = 0
function debug(text) {if(deb) {debnum++;$('td.back4').append(debnum+'&nbsp;\''+text+'\'<br>');}}

$().ready(function() {
//	$('td.back4 table:first').attr('border','5')	// расстановка
//	$('td.back4 table:eq(1)').attr('border','5')	// все вместе кроме расстановки
//	$('td.back4 table:eq(2)').attr('border','5')	// отчет
//	$('td.back4 table:eq(3)').attr('border','5')	// заголовок матча
//	$('td.back4 table:eq(4)').attr('border','5')	// голы\лого
//	$('td.back4 table:eq(5)').attr('border','5')	// стата
//	$('td.back4 table:eq(6)').attr('border','5')	// оценки

	var mid = 'match' + UrlValue('j')

	//дорисовываем оценки в код для форума(t=code) и редактируем страницу матча (t=if)
	if(UrlValue('t') == 'code') {
		var res = sessionStorage[mid]
		if(res != undefined){
			var text = ' <font color=555753>'+res+'</font>[/spoiler]'
			$('td.back4 table td:last').html(
				$('td.back4 table td:last').html().replace('[/spoiler]',text)
			)
		}
	}else{

		// даем возможность скрыть отчет
		$('td.back4 table:eq(2)').before('<br><a id="treport" href="javascript:void(ShowTable(2))">&ndash;</a>')
/**
		// запоминаем таблицу оценок
		var wimg = '[img]' + $('img[src^="system/img/w"]').attr('src') + '[/img]'
		var ref = ' [b]Главный арбитр:[/b] ' + $('td.back4 table:eq(2)').html().split('Главный арбитр:')[1].split(').')[0] + ').'
		var schet = $('td.back4 table:eq(3) td:eq(1)').text()
		var finschet = ''
		var finschetarr = $('td.back4 table:eq(2) center').html().split('СЧЕТ ')
		debug((finschetarr[finschetarr.length-1].split('<br>')[0]).trim())
		debug(schet)
		if (finschetarr[1]!=undefined && (finschetarr[finschetarr.length-1].split('<br>')[0]).trim() != schet){
			finschet = ' [center]По пенальти [b][color=red]'+(finschetarr[finschetarr.length-1].split('<br>')[0]).trim() + '[/color][/b][/center]'
		}
		sessionStorage[mid] = finschet + $('td.back4 table:eq(6)')
			.find('img').removeAttr('ilo-full-src').end()		// fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
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

/**
		// работаем с отчетом
		var x = $('td.back4 table:eq(2) td:first center:first')
			.find('script').remove().end()
			//.find('a').remove().end()
			//.find('img').remove().end()
			.html().split('<br><br>')

		var content = "";
		for (i=0;i<x.length;i++){
		    x[i] = "<p id='matchMoment"+i+"'>"+x[i]+"</p>"
		    content+=x[i] //+'<br>';
		}
		$('td.back4 table:eq(2) td:first center:first').html(content);


		// Set selector for players
		$('td.back4 table:first td:has(small)').each(function(){
			var text = TrimString($(this).find('small').html()).split('.',2)
			var name = (text[1]!=undefined ? text[1] : text[0]).replace(/ /g,'!')
			$(this).html('<a href=javascript:void(SelPl("'+name+'"))>'+$(this).html()+'</a>')
		})


		$('td.back4 table:eq(6) tr').each(function(){
			$(this).find('td:eq(1), td:eq(6)').each(function(i, val){
				var text = TrimString($(val).text()).split('(')[0].split('.',2)
				var name = (text[1]!=undefined ? text[1] : text[0]).replace(/ /g,'!')
				$(val).html('<a href=javascript:void(SelPl("'+name+'"))>'+$(val).html()+'</a>')
			})
		})
/**/

	}
}, false);