
// ==UserScript==
// @name           peflmatch
// @namespace      pefl
// @description    match page modification
// @include        http://*pefl.*/*&t=if&*
// @include        http://*pefl.*/*&t=code&*
// ==/UserScript==

// 10й сезон, матч с которго считается сыгранность и СвУс: http://www.pefl.ru/plug.php?p=refl&t=if&j=602078&z=a72e875256e6b57eb52e95dbd2d1b152

deb = (localStorage.debug == '1' ? true : false)
var debnum = 0

var ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
var mid = parseInt(UrlValue('j'))
var myteamid = localStorage.myteamid
var db = false
var list = {
	'players':	'id,tid,num,form,morale,fchange,mchange,value,valuech,name',
	'matches':	'id,su,place,schet,pen,weather,eid,ename,emanager,ref,hash,minutes',
	'matchespl':'nameid,name,minute',
}
var match1	= {}
var sshort	= ''
var matches	= []
var plmatch	= []
var matchespl  = {}
var matchesplh = {}
var matchespla = {}
var plhead	= 'id,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15,n16,n17,n18'
//var pldbase	= []
//var plteam	= []
var sshort = false

$().ready(function() {
	if(deb) $('body').append('<div id=debug></div>')
//	$('td.back4 table:first').attr('border','5')	// расстановка
//	$('td.back4 table:eq(1)').attr('border','5')	// все вместе кроме расстановки
//	$('td.back4 table:eq(2)').attr('border','5')	// отчет
//	$('td.back4 table:eq(3)').attr('border','5')	// заголовок матча
//	$('td.back4 table:eq(4)').attr('border','5')	// голы\лого
//	$('td.back4 table:eq(5)').attr('border','5')	// стата
//	$('td.back4 table:eq(6)').attr('border','5')	// оценки

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
		// даем возможность скрыть отчет
		$('td.back4 table:eq(2)').before('<br><a id="a2" href="javascript:void(ShowTable(2))">&ndash;</a> <b>Отчет</b><br>')
		// собираем инфо матча
		getMatchInfo()
		getPlayersInfo()

		//берем данные
		getJSONlocalStorage('matches2',matches)
		getJSONlocalStorage('matchespl2',matchespl)

		// проверяем и если надо модифицируем и сохраняем данные
		checkSave(matchespl)

		// запомнить новые футболки
		saveForm()

		// исправляем таблицу оценок
		modifyMarksTable()

		// сохраняем код для форума
		SaveCodeForMatch()
	}

	//добавляем короткий отчет о сменах тактик, изменений счета и расстановок
	$('a#a2').before('<a href="javascript:void(ShowSShort())" id="sshort">+</a> <b>Смены тактик и счета</b><div id="sshort" style="display: none;"><center><hr>'+sshort+'<hr></center></div><br>')

}, false);

function checkSave(){
	debug('checkSave()')
	// есть matcheshpl
	var savematch = false
	
//	if(deb) for(i in matchesplh) debug('checkSave(h):'+i+':'+matchesplh[i].m)
//	if(deb) for(i in matchespla) debug('checkSave(a):'+i+':'+matchespla[i].m)
//	if(deb) for(i in matchespl) debug('checkSave:matchespl:'+i)

	switch(parseInt(myteamid)){
		case match1.hid:
			debug('checkSave:update:home')
			savematch = true
			for(i in matchesplh){
				if(matchespl[i]==undefined) matchespl[i] = []
				matchespl[i][mid] = matchesplh[i]
			}
			break
		case match1.aid:
			debug('checkSave:update:away')
			savematch = true
			for(i in matchespla){
				if(matchespl[i]==undefined) matchespl[i] = []
				matchespl[i][mid] = matchespla[i]
			}
			break
		default:
			debug('checkSave:update:player')
			for(i in matchesplh){
				if(matchespl[i]!=undefined){
					savematch = true
					debug('checkSave(h):add:'+i+':'+mid)
					matchespl[i][mid] = matchesplh[i]
				}
			}
			for(i in matchespla){
				if(matchespl[i]!=undefined){
					savematch = true
					debug('checkSave(a):add:'+i+':'+mid)
					matchespl[i][mid] = matchespla[i]
				}
			}
	}
	debug('checkSave:savematch='+savematch)
	if(savematch) {
		if(matches[match1.id]==undefined){
			debug('checkSave:add:'+mid)
			matches[match1.id] = match1
		}else{
			for(p in match1) matches[match1.id][p] = match1[p]
		}
		saveJSONlocalStorage('matches2',matches)
		saveJSONlocalStorage('matchespl2',matchespl)
	}
}

function modifyMarksTable(){
	debug('modifyMarksTable()')
	$('td.back4 table:eq(6)')
		.find('td').removeAttr('width').end()
		.find('td').removeAttr('bgcolor').end()
		.find('tr:odd').attr('bgcolor','#a3de8f').end() //#a3de8f #c9f8b7
		.find('tr:eq(10)').after('<tr bgcolor=white><td colspan=10> </td></tr>')
}

function getMatchInfo(){
	debug('getMatchInfo()')
	var yrcard	= $('td.back4 table:eq(6) img[src*="system/img/gm/yr.gif"]').length
	var ycard	= $('td.back4 table:eq(6) img[src*="system/img/gm/y.gif"]').length + yrcard
	var rcard	= $('td.back4 table:eq(6) img[src*="system/img/gm/r.gif"]').length + yrcard
	var type	= ($('td.back4 table:eq(4) td:first img').attr('src').indexOf('club')!=-1 ? 'club' : 'other')
	var hname	= $('td.back4 table:eq(3) tr:first td:eq(0)').text().trim()
	var aname	= $('td.back4 table:eq(3) tr:first td:eq(2)').text().trim()
	var weather = $('img[src^="system/img/w"]').attr('src').replace('system/img/w','').replace('.png','')
	// /system/img/club/1455.gif - club
	// /system/img/flags/155.gif - national
	match1.id	= mid
	match1.h	= UrlValue('z')
	match1.m	= parseInt($('p.key:last').text().split(' ')[0])-1
	match1.res	= $('td.back4 table:eq(3) td:eq(1)').text()
	//match1.su	= true

	if(weather!=0) match1.w =  weather
	if(type == 'club') {
		match1.hid	= parseInt($('td.back4 table:eq(4) td:first img').attr('src').split('club/')[1].split('.')[0])
		match1.aid	= parseInt($('td.back4 table:eq(4) td:last img').attr('src').split('club/')[1].split('.')[0])
	}
	if(myteamid != match1.hid){
		match1.hnm	= hname
		match1.hmn	= $('td.back4 table:eq(3) tr:eq(1) td:eq(0)').text()
	}
	if(myteamid != match1.aid){
		match1.anm	= aname
		match1.amn	= $('td.back4 table:eq(3) tr:eq(1) td:eq(2)').text()
	}
	if($('td.back4 b:contains(Нейтральное поле.)').html()!=undefined) match1.n	= 'N'
	if(ycard!=0) match1.yc = ycard
	if(rcard!=0) match1.rc = rcard

	// проверям на установки и пополняем краткий отчет
	var otcharr = []
	$('td.back4 table:eq(2) center p').each(function(){otcharr.push($(this).html())})
	var ust = true
	for(i in otcharr) {
		if(String(otcharr[i]).indexOf('предельно настроенными') != -1)	match1.ust = 'p'
		else if(String(otcharr[i]).indexOf('активно начинает') != -1) 	match1.ust = 'a'
		if(ust && match1.ust!=undefined){
			ust = false
			if(String(otcharr[i]).indexOf(hname) != -1)		 match1.ust += '.h'
			else if(String(otcharr[i]).indexOf(aname) != -1) match1.ust += '.a'
		}
		if(String(otcharr[i]).indexOf('(*)') != -1 || String(otcharr[i]).indexOf('СЧЕТ') != -1) sshort += '<br><b>'+otcharr[i].replace('<br>','</b><br>')+'<br>'
	}

	// получаем рефери
	var otch = $('td.back4 table:eq(2)').html()
	if(otch.indexOf('Главный арбитр:') !=-1) match1.r = (otch.split('Главный арбитр:')[1].split(').')[0] + ')').trim()

	// получаем финальный счет(были ли пенальти)
	var finschetarr = $('td.back4 table:eq(2) center').html().split('СЧЕТ ')
	var fres = (finschetarr[finschetarr.length-1].split('<br>')[0].split('<')[0].split('...')[0]).trim()
	if(fres!=match1.res) match1.pen = match1.fres

	if(deb) for(i in match1) debug('getMatchInfo:'+i+'='+match1[i])
}
function saveForm(){
	debug('saveForm()')
	var tr = (match1.hid==myteamid ? 'first' : (match1.aid==myteamid ? 'last' : ''))
	if(tr!=''){
		localStorage.fp_uniform = $('td.back4 center:first table:first tr:'+tr+' td.field_left:first img').attr('src')
		localStorage.gk_uniform = $('td.back4 center:first table:first tr:'+tr+' td:eq(2) img').attr('src')
	}
}

function SaveCodeForMatch(){
	debug('SaveCodeForMatch()')
	var finschet = (match1.pen!=undefined ? ' [center]По пенальти [b][color=red]'+ match1.pen + '[/color][/b][/center]' : '')
	sessionStorage['match'+mid] = finschet + $('td.back4 table:eq(6)')
//	var x = finschet + $('td.back4 table:eq(6)')
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
		+ '[img]system/img/w' + (match1.w==undefined ? 0 : match1.w) + '.png[/img]' 
		+ (match1.r!=undefined ? ' [b]Главный арбитр:[/b] ' + match1.r + '.' : '')
		+ (match1.ust!=undefined ? '\n\n'+match1.ust : '')
}

function getJSONlocalStorage(dataname,data){
	if(String(localStorage[dataname])!='undefined'){
		var data2 = JSON.parse(localStorage[dataname]);
		switch(dataname){
			case 'matchespl2': 
				for(k in data2){
					for(l in data2[k]){
						data[k] = []
						if(data2[k][l].id!=undefined) data[k][data2[k][l].id]= data2[k][l]
						else data[k][l]= data2[k][l]
					}
				}
				break
			default:
				for(k in data2) {
					if(data2[k].id!=undefined) data[data2[k].id]= data2[k]
					else data[k]= data2[k]
				}
		}
		if(deb) for(i in data) debug('getJSONlocalStorage:'+dataname+':'+i)
	} else return false
}
function saveJSONlocalStorage(dataname,data){
//	if(deb) for(i in data) debug('saveJSONlocalStorage:'+dataname+':'+i+':'+data[i][mid].m)
	//debug(JSON.stringify(data).replace(/null\,/g,''))
	switch(dataname){
		case 'matchespl2': 
			var data2 = {}
			//if(deb) for(i in data) debug('saveJSONlocalStorage:'+dataname+':'+i+':'+data[i][mid].m)
			for(k in data){
				var d2 = []
				for(l in data[k]){
					d2.push(data[k][l])
				}
				data2[k] = d2
			}
			//if(deb) for(i in data2) debug('saveJSONlocalStorage2:'+dataname+':'+i+':'+data2[i][0].m)
			break
		default:
			var data2 = []
			debug('default преобразования')
			for(i in data) data2.push(data[i])
	}
	localStorage[dataname] = JSON.stringify(data2)

}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}
function ShowSShort(){
	if(sshort) {
		$('div#sshort').hide()
		$('a#sshort').html('+')
		sshort = false
	}else{
		$('div#sshort').show()
		$('a#sshort').html('&ndash;')
		sshort = true
	}
}

function ShowTable(n){
	var style = $('td.back4 table:eq('+n+')').attr('style')
	if(style == "display: none" || style == "display: none;" || style == "display: none; "){
		$('td.back4 table:eq('+n+')').show()
		$('a#a'+n).html('&ndash;')
	} else {
		$('td.back4 table:eq('+n+')').hide()
		$('a#a'+n).html('+')
	}
}

function TrimString(sInString){
	sInString = sInString.replace(/\&nbsp\;/g,' ');
	return sInString.replace(/(^\s+)|(\s+$)/g, '');
}

function debug(text) {if(deb) {debnum++;$('div#debug').append(debnum+'&nbsp;\''+text+'\'<br>');}}

function getPlayersInfo(){
	debug('getPlayersInfo()')
	var mt = match1.m

	// get info from postmatch table
	var unih = 2
	var unia = 2
	$('td.back4 table:eq(6) td:has(a[href^=javascript])').each(function(i,val){
		var player = {id:mid}
		var nameid	= TrimString($(val).find('a[href^=javascript]').text())

        var pnum = parseInt($(val).prev().html()) +(i%2==1 ? 18 : 0)
        var nexttd = $(val).next().html()
		var minutes = (nexttd.indexOf('(')==-1 ? (pnum<12 || (pnum>18 && pnum<30) ? mt : 0) : (pnum<12 || (pnum>18 && pnum<30) ? parseInt(nexttd.split('(')[1]) : mt-parseInt(nexttd.split('(')[1])))
		if(minutes!=0) player.m = minutes
//		player.num = (pnum>18 ? pnum-18 : pnum)

		// get info from match text
/**
		var searchname = ':'+player.name+':'
		$('font.p'+(pnum<10 ? 0 :'')+pnum).each(function(){
			var cname = $(this).text()
			if(searchname.indexOf(':'+cname+':')==-1) searchname += cname+':'
		})
/**/
		if(i%2==1){
			if(matchespla[nameid]!=undefined){
				player.nm = nameid
				nameid += '_'+unia
				unia++
			}
			matchespla[nameid] = player
		}else{
			if(matchesplh[nameid]!=undefined){
				player.nm = nameid
				nameid += '_'+unih
				unih++
			}
			matchesplh[nameid] = player
		}
//		debug('getPlayersInfo:i='+i+':team='+(i%2==1 ? 'a' : 'h')+':nameid='+player.nameid)
//		if(deb) for(i in player) debug('getPlayersInfo:'+i+'='+player[i])
	})
}