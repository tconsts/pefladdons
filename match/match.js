// ==UserScript==
// @name           peflmatch
// @namespace      pefl
// @description    match page modification
// @include        http://*pefl.*/*&t=if&*
// @include        http://*pefl.*/*&t=code&*
// ==/UserScript==

// 10й сезон, матч с которго считается сыгранность и СвУс: http://www.pefl.ru/plug.php?p=refl&t=if&j=602078&z=a72e875256e6b57eb52e95dbd2d1b152

if(typeof (deb) == 'undefined') deb = false
var debnum = 0

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

function debug(text) {if(deb) {debnum++;$('td.back4').append(debnum+'&nbsp;\''+text+'\'<br>');}}

function PlayerTime(mid,mt,mrk,tid){
	debug('PlayerTime('+mid+','+mt+','+mrk+','+tid+')')
/**/
	ttime[tid]= {}

	// get info from postmatch table
	var m = false
	var uni = 2
	$('td.back4 table:eq(6) td:has(a[href^=javascript])').each(function(){
		m = (m ? false : true)
		if(m==mrk){
			var pname	= TrimString($(this).find('a[href^=javascript]').text())
			var pnameid	= pname

			if(ttime[tid][pnameid]!=undefined){
				pnameid = pname+uni
				uni++;
			}
			var pnum = parseInt($(this).prev().html())+(mrk ? 0 : 18)
			var nexttd = $(this).next().html()
			var pmin = (nexttd.indexOf('(')==-1 ? (pnum<12 || (pnum>18 && pnum<30) ? mt : 0) : (pnum<12 || (pnum>18 && pnum<30) ? parseInt(nexttd.split('(')[1]) : mt-parseInt(nexttd.split('(')[1])))

			ttime[tid][pnameid]={'pnameid':pnameid,'ptime':pmin,'pname':pname,'pnum':pnum}

		}
	})

	// get info from match text
	for (i in ttime[tid]){
		var pl = ttime[tid][i]
		pl.pfname=':'+pl.pname+':'
		$('font.p'+(pl.num<10 ? 0 :'')+pl.num).each(function(){
			var cname = $(this).text()
			
		})
	}

	for(i in ttime[tid]) {
		var x  = ttime[tid][i]
		debug(mid+':'+tid+':'+x.ptime+':'+x.pfname)
	}
/**/
}

var ttime = []

$().ready(function() {
//	$('td.back4 table:first').attr('border','5')	// расстановка
//	$('td.back4 table:eq(1)').attr('border','5')	// все вместе кроме расстановки
//	$('td.back4 table:eq(2)').attr('border','5')	// отчет
//	$('td.back4 table:eq(3)').attr('border','5')	// заголовок матча
//	$('td.back4 table:eq(4)').attr('border','5')	// голы\лого
//	$('td.back4 table:eq(5)').attr('border','5')	// стата
//	$('td.back4 table:eq(6)').attr('border','5')	// оценки
	var mid = UrlValue('j')

	//дорисовываем оценки в код для форума(t=code) и редактируем страницу матча (t=if)
	if(UrlValue('t') == 'code') {
		var res = sessionStorage['match'+mid]
		if(res != undefined){
			var text = ' <font color=555753>'+res+'</font>[/spoiler]'
			$('td.back4 table td:last').html(
				$('td.back4 table td:last').html().replace('[/spoiler]',text)
			)
		}
	}else{
		var myteamid = localStorage.myteamid
		debug('myteamid='+myteamid)

		if(myteamid!=undefined){
			var mark = 'none'
			mark = (myteamid==parseInt($('td.back4 table:eq(4) td:first img').attr('src').split('club/')[1].split('.')[0]) ? true : mark)
			mark = (myteamid==parseInt($('td.back4 table:eq(4) td:last img').attr('src').split('club/')[1].split('.')[0]) ? false : mark)
			if(mark!='none') PlayerTime(mid,parseInt($('p.key:last').text().split(' ')[0]),mark,myteamid)
		}

		// даем возможность скрыть отчет
		$('td.back4 table:eq(2)').before('<br><a id="treport" href="javascript:void(ShowTable(2))">&ndash;</a>')
/**/
		// запоминаем таблицу оценок
		var wimg = '[img]' + $('img[src^="system/img/w"]').attr('src') + '[/img]'
		var ref = ' [b]Главный арбитр:[/b] ' + $('td.back4 table:eq(2)').html().split('Главный арбитр:')[1].split(').')[0] + ').'
		var schet = $('td.back4 table:eq(3) td:eq(1)').text()
		var finschetarr = $('td.back4 table:eq(2) center').html().split('СЧЕТ ')
		var finschet = (finschetarr[finschetarr.length-1].split('<br>')[0].split('<')[0].split('...')[0]).trim()
		debug(finschet+'='+schet)

		finschet = (finschetarr[1]!=undefined && finschet!=schet ? ' [center]По пенальти [b][color=red]'+ finschet + '[/color][/b][/center]' : '')

		$('td.back4 table:eq(6)')
			.find('td').removeAttr('width').end()
			.find('td').removeAttr('bgcolor').end()
			.find('tr:odd').attr('bgcolor','#a3de8f').end() //#a3de8f #c9f8b7
			.find('tr:eq(10)').after('<tr bgcolor=white><td colspan=10> </td></tr>')

		sessionStorage['match'+mid] = finschet + $('td.back4 table:eq(6)')
//		var x = finschet + $('td.back4 table:eq(6)')
			.find('img').removeAttr('ilo-full-src').end()		// fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
			.prepend('<tr><td colspan=5 width=50%> </td><td colspan=5 width=50%> </td></tr>')
			.html()
			.replace(/<tbody>/g,'<table width=100% bgcolor=c9f8b7>')
			.replace(/tbody/g,'table')
			.replace(/\<a href=\"javascript\:void\(ShowPlayer\(\'(.*)\'\)\)\"\>(.*)/g,'$2')
			.replace(/\<\/a\>/g,'')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/"/g,'')
			.replace(/font /g,'')
			.replace(/font/g,'color')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			+ wimg + ref 
	}
}, false);