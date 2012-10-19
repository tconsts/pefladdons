
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
var ustanovka = false
var db = false
var list = {
	'players':	'id,tid,num,form,morale,fchange,mchange,value,valuech,name',
	'matches':	'id,su,place,schet,pen,weather,eid,ename,emanager,ref,hash,minutes',
	'matchespl':'nameid,name,minute',
}
var match1	= {}
var positions = {}
var zamena = []
var sshort	= ''
var matches	= []
var plmatch	= []
var players	= []
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
//	if(deb) for(i in matchespl['Р.Тарала']) debug('checkSave:matchespl[Р.Тарала]:'+i)

	switch(parseInt(myteamid)){
		case match1.hid:
			debug('checkSave:update:home')
			savematch = true
			for(i in matchesplh){
				if(matchespl[i]==undefined) matchespl[i] = []
				if(matchespl[i][mid]==undefined) matchespl[i][mid] = matchesplh[i]
				else for(p in matchesplh[i]) 	 matchespl[i][mid][p] = matchesplh[i][p]
			}
			break
		case match1.aid:
			debug('checkSave:update:away')
			savematch = true
			for(i in matchespla){
				if(matchespl[i]==undefined) matchespl[i] = []
				if(matchespl[i][mid]==undefined) matchespl[i][mid] = matchespla[i]
				else for(p in matchespla[i]) 	 matchespl[i][mid][p] = matchespla[i][p]
			}
			break
		default:
			debug('checkSave:update:player')
			for(i in matchesplh){
				if(matchespl[i]!=undefined){
					savematch = true
					debug('checkSave(h):add:'+i+':'+mid)
					if(matchespl[i][mid]==undefined) matchespl[i][mid] = matchesplh[i]
					else for(p in matchesplh[i]) 	 matchespl[i][mid][p] = matchesplh[i][p]
				}
			}
			for(i in matchespla){
				if(matchespl[i]!=undefined){
					savematch = true
					debug('checkSave(a):add:'+i+':'+mid)
					if(matchespl[i][mid]==undefined) matchespl[i][mid] = matchespla[i]
					else for(p in matchespla[i]) 	 matchespl[i][mid][p] = matchespla[i][p]
				}
			}
	}
	if(deb) for(i in matchespl['Р.Тарала']) debug('checkSave:matchespl[Р.Тарала]:'+i)
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

//	if(deb) $('td.back4 table:first').attr('border','1')
	$('td.back4 table:first td.field').each(function(i,val){
		if(deb) $(val).prepend(i)
		if($(val).find('img').length>0){
			var pname = $(val).find('small').text().trim()
			positions[pname] = {'ps':i}
		}
	})
	//for(i in positions) debug('getPlayersInfo:'+i+':'+positions[i].ps)


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
	if(!UrlValue('v')) match1.h	= UrlValue('z')
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
	if($('td.back4 b:contains(Нейтральное поле.)').html()!=undefined) match1.n	= '1'
	if(ycard!=0) match1.yc = ycard
	if(rcard!=0) match1.rc = rcard

	// проверям на установки и пополняем краткий отчет
	var otcharr = []
	$('td.back4 table:eq(2) center p').each(function(){
		var fulltext = $(this).html()
		var curmin = parseInt(fulltext)
		otcharr.push(fulltext)
		$(this).find('font').each(function(i,val){
			var pnum = parseInt($(val).attr('class').replace('p0','').replace('p',''))
			if(players[pnum]==undefined) players[pnum] = {"act":0}
			players[pnum].act += 1
			players[pnum].last = curmin
			//debug('getMatchInfo:curmin='+curmin+':pnum'+pnum+':')
		})
		if($(this).find('font ~ img[src*=krest.gif]').length>0){
			var pnum = parseInt($(this).find('font ~ img[src*=krest.gif]').prev().attr('class').replace('p0','').replace('p',''))
			players[pnum].inj = true
			//debug('getMatchInfo:curmin='+curmin+':class=:'+$(this).find('font ~ img[src*=krest.gif]').prev().attr('class'))
		}
	})
	if(deb) for(i in players) debug('getMatchInfo:i='+i+':act='+players[i].act+':last='+players[i].last+':inj='+players[i].inj)

	var ust = true
	var chpos = 0
	for(i in otcharr) {

		// выясняем установку
		if(String(otcharr[i]).indexOf('предельно настроенными') != -1)	match1.ust = 'p'
		else if(String(otcharr[i]).indexOf('активно начина') != -1) 	match1.ust = 'a'
		if(ust && match1.ust!=undefined){
			ust = false
			if(String(otcharr[i]).indexOf(hname) != -1)		 match1.ust += '.h'
			else if(String(otcharr[i]).indexOf(aname) != -1) match1.ust += '.a'
			ustanovka = String(otcharr[i]).split('<br>')[1]
			debug('getMatchInfo:ustanovka='+ustanovka)
		}
		// изменение в счете
		if(String(otcharr[i]).indexOf('СЧЕТ') != -1){
			sshort += '<br><b>'+otcharr[i].replace('<br>','</b><br>')+'<br>'
		}
		//смена расстановки
		if(String(otcharr[i]).indexOf('(*)') != -1){
			sshort += '<br><b>'+otcharr[i].replace('<br>','</b><br>')+'<br>'

			chpos++
			var curmin = parseInt(otcharr[i])
			var tbl = otcharr[i].split('showNewFieldWnd(')[3].split('\'')[1]
			$('td.back4').append('<div id=posdebug'+i+(deb ? '' : ' style="display: none;"')+'></div>')
			$('div#posdebug'+i).html(curmin+' мин:'+tbl)
			var correct = ($('div#posdebug'+i+' table tr:first td').length>3 ? 33 : 0)
			$('div#posdebug'+i+' table td').each(function(i,val){
				var pos = i+correct
				$(val).prepend(pos)
				if($(val).find('img').length>0){
					var pname = $(val).find('small').text().trim()
					if(positions[pname]==undefined){
						positions[pname] = {'ps':pos+'.'+curmin}
					}else{
						var curps = String(positions[pname].ps)
						if(curps.indexOf(':')!=-1){
							var psarr = curps.split(':')
							if(parseInt(psarr[psarr.length-1])!=pos) positions[pname].ps += ':'+pos+'.'+curmin
						}else if(parseInt(positions[pname].ps)!=pos){
							positions[pname].ps += ':'+pos+'.'+curmin
						}
					}
				}
			})
			if(!deb) $('div#posdebug'+i).remove()
			
		}
		// обычная замена
		if(String(otcharr[i]).indexOf('(*)') == -1 && String(otcharr[i]).indexOf('on.gif') != -1){
			var curmin = parseInt(otcharr[i])
			var otiarr = otcharr[i].split('"p')
			var pl = []
			var pnum = []
			var pname = []
			for(n=1;n<3;n++){
				pl[n] = otiarr[n].split('"')[0]
				pl[n] = parseInt(parseInt(pl[n])==0 ? String(pl[n])[1] : pl[n])
				pnum[n] = (pl[n]>18 ? pl[n]-18 : pl[n])
				pname[n] = TrimString($('td.back4 table:eq(6) tr:eq('+(pnum[n]-1)+') a:eq('+(pl[n]>18 ? 1 : 0)+')').text())
			}
			if(pnum[1]>pnum[2]){
				plon = pname[1]
				ploff = pname[2]
			}else{
				plon = pname[2]
				ploff = pname[1]
			}
			debug('Замена:'+curmin+' мин:pl='+pl+':pnum='+pnum+': ушел '+ploff+' зашел '+plon)
			var pos = positions[ploff].ps
			var curps = String(positions[ploff].ps)
			if(curps.indexOf(':')!=-1){
				var psarr = curps.split(':')
				pos = parseInt(psarr[psarr.length-1])
			}
			positions[plon] = {'ps':pos+'.'+curmin}
		}
	}

	// получаем рефери
	var otch = $('td.back4 table:eq(2)').html()
	if(otch.indexOf('Главный арбитр:') !=-1) match1.r = (otch.split('Главный арбитр:')[1].split(' (')[0]).trim()

	// получаем финальный счет(были ли пенальти)
	var finschetarr = $('td.back4 table:eq(2) center').html().split('СЧЕТ ')
	var fres = (finschetarr[finschetarr.length-1].split('<br>')[0].split('<')[0].split('...')[0]).trim()
	if(fres!=match1.res && fres.indexOf(':')!=-1) match1.pen = fres
	debug('getMatchInfo:fres='+fres+':match1.res='+match1.res+':match1.pen='+match1.pen)

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
		+ (ustanovka ? '<br>'+ustanovka : '')
}

function getJSONlocalStorage(dataname,data){
	if(String(localStorage[dataname])!='undefined'){
		var data2 = JSON.parse(localStorage[dataname]);
		switch(dataname){
			case 'matchespl2': 
				//if(deb) for(i in data2['Р.Тарала']) debug('getJSONlocalStorage:data2[Р.Тарала]:'+data2['Р.Тарала'][i].id)
				for(k in data2){
					data[k] = []
					for(l in data2[k]){
						if(data2[k][l].id!=undefined) data[k][data2[k][l].id]= data2[k][l]
						else data[k][l]= data2[k][l]
					}
				}
				//if(deb) for(i in data['Р.Тарала']) debug('getJSONlocalStorage:data[Р.Тарала]:'+data['Р.Тарала'][i].id)
				break
			default:
				for(k in data2) {
					if(data2[k]!=undefined && data2[k].id!=undefined) data[data2[k].id]= data2[k]
					else data[k]= data2[k]
				}
		}
//		if(deb) for(i in data) debug('getJSONlocalStorage:'+dataname+':'+i)
	} else return false
}
function saveJSONlocalStorage(dataname,data){
	debug('saveJSONlocalStorage:'+dataname)
	switch(dataname){
		case 'matchespl2': 
			var data2 = {}
			for(k in data){
				var d2 = []
				for(l in data[k]){
					d2.push(data[k][l])
				}
				data2[k] = d2
			}
			break
		default:
			var data2 = []
			for(i in data) if(data[i]!=null) data2.push(data[i])
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
		var player	= {id:mid}
		var nameid	= TrimString($(val).find('a[href^=javascript]').text())
		if(positions[nameid]!=undefined && positions[nameid].ps!=undefined) player.ps = positions[nameid].ps

        var pnum = parseInt($(val).prev().html()) +(i%2==1 ? 18 : 0)
        var nexttd = $(val).next().html()
		var minutes = (nexttd.indexOf('(')==-1 ? (pnum<12 || (pnum>18 && pnum<30) ? mt : 0) : (pnum<12 || (pnum>18 && pnum<30) ? parseInt(nexttd.split('(')[1]) : mt-parseInt(nexttd.split('(')[1])))
		if(minutes!=0) {
//			debug('getPlayersInfo:pl='+nameid+':minutes='+minutes+':mt='+mt)
			if(minutes!=mt) player.m = minutes
			player.mr = $(val).next().next().text().trim()
			//debug('getPlayersInfo:'+nameid+':mark='+player.mr)
			if($(val).find('b:contains("(к)")').length>0)	player.cp = 1
//			if(deb && player.cp!=undefined) debug('getPlayersInfo:'+nameid+':cp='+player.cp)
			if($(val).find('font').length>0)	player.im = 1
//			if(deb && player.im!=undefined) debug('getPlayersInfo:'+nameid+':im='+player.im)
			if($(val).next().next().find('img').length>0) player.cr = $(val).next().next().find('img').attr('src').split('/')[3].split('.')[0]
//			if(deb && player.cr!=undefined) debug('getPlayersInfo:'+nameid+':cr='+player.cr)
			if(parseInt($(val).prev().html())>11) player['in'] = 1
			//if(deb && player.in!=undefined) debug('getPlayersInfo:'+nameid+':in='+player.in)
			//посчитаем голы
			var goals = 0
			var td = (pnum<=18 ? 1 : 2)
			var goalsarr = $('td.back4 table:eq(4) td:eq('+td+')').html().split('br')
			for(x in goalsarr) if(goalsarr[x].indexOf(nameid)!=-1) goals++
			if(goals>0) player.g = goals
			//if(deb && goals>0) debug('getPlayersInfo:'+nameid+':goals='+goals)
		}
		if(player.cr=='yr'|| player.cr=='r') {
			var delmin = players[pnum].last
			player.m = (player.m==undefined ? delmin : player.m - (mt-delmin))
			$('td.back4 table:eq(6) td:contains('+nameid+')').next().attr('align','right').append('<img src="system/img/gm/out.gif"></img>('+players[pnum].last+'\')')
			//debug('getPlayersInfo:'+nameid+':m='+players.m)
		}
		if(players[pnum]!=undefined && players[pnum].inj){
			player.t = 1
			var injmin = players[pnum].last
			player.m = (player.m==undefined ? injmin : (player['in']==1 ? player.m - (mt-injmin) : player.m))
//			$('td.back4 table:eq(6) td:contains('+nameid+')').next().attr('align','right').append(' <font color=red><b>T</b></font>('+players[pnum].last+'\')')
			if($('td.back4 table:eq(6) td:contains('+nameid+')').next().find('img[src*=system/img/gm/out.gif]').length>0){
				$('td.back4 table:eq(6) td:contains('+nameid+')').next().find('img[src*=system/img/gm/out.gif]').remove().end().prepend('<font color=red><b>T</b></font>')
			}else{
				$('td.back4 table:eq(6) td:contains('+nameid+')').next().attr('align','right').append(' <font color=red><b>Т</b></font>('+players[pnum].last+'\')')
			}
		}

		// get info from match text
/**
		var searchname = ':'+player.name+':'
		$('font.p'+(pnum<10 ? 0 :'')+pnum).each(function(){
			var cname = $(this).text()
			if(searchname.indexOf(':'+cname+':')==-1) searchname += cname+':'
		})
/**/    // сохраняем или в гостевой(a) или домашний(h) список
		if(player.mr!=undefined){
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
		}
		debug('getPlayersInfo:i='+i+':team='+(i%2==1 ? 'a' : 'h')+':nameid='+nameid)
		if(deb) for(i in player) debug('getPlayersInfo:'+i+'='+player[i])
	})
}