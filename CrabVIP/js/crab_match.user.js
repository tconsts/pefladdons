// ==UserScript==
// @name           peflmatch
// @namespace      pefl
// @description    match page modification
// @include        https://*pefl.*/*&t=if&*
// @include        https://*pefl.*/*&t=code&*
// @require			crab_funcs_std.js
// @encoding	   windows-1251
// ==/UserScript==

// 10й сезон, матч с которго считается сыгранность и СвУс: http://www.pefl.ru/plug.php?p=refl&t=if&j=602078&z=a72e875256e6b57eb52e95dbd2d1b152

var mid = parseInt(UrlValue('j'))
var myteamid = localStorage.myteamid
var ustanovka = false
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
//	$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">');
	if(deb) $('body').append('<div id=debug></div>')
	dobaviti_ikonku_gola();
	pokazati_uglovye();
	pokazati_penaliti();
 	dobaviti_ikonki_karto4ek();
	pokazati_shtrafnye();
	zameniti_ikonku_zamen();
	dobaviti_ikonku_travmy();
	pokazati_ofsaidy();
	pokazati_smeny_taktik();
	dobavlennoe_vremea();
 
}, false);

function pokazati_uglovye(){
	var uglovye = ['Боковой судья показывает на угловой...','зарабатывает угловой...','Судья назначает угловой удар...','Мяч покидает пределы поля... Угловой...','Судья показывает, что нужно выполнить угловой удар...'];
	 
	 for (i=0;i<uglovye.length;i++){
		 var img_uglovoi = $("<p class='uglovoi'/>" );
		 $('p.key:contains('+uglovye[i]+')').append(img_uglovoi);
		 $('p.key:contains('+uglovye[i]+')').css({'padding-bottom':'28px'});
	 }
}

function pokazati_shtrafnye(){
	var shtrafnye = ['Арбитр дает штрафной в пользу команды','Штрафной удар в пользу команды','Штрафной в пользу команды','Штрафной удар...','выполняет штрафной удар...','... Штрафной...',' пробьет штрафной...','Назначен штрафной...'];
	 
	 for (i=0;i<shtrafnye.length;i++){
		 var img_shtrafnoi = $("<p class='shtrafnoi'/>" );
		 $('p.key:contains('+shtrafnye[i]+')').append(img_shtrafnoi);
		 $('p.key:contains('+shtrafnye[i]+')').css({'padding-bottom':'28px'});
		 
		 $('p.full:contains('+shtrafnye[i]+')').append(img_shtrafnoi);
		 $('p.full:contains('+shtrafnye[i]+')').css({'padding-bottom':'28px'});
	 }
}

function pokazati_ofsaidy(){
	var ofsaidy = ['Но боковой арбитр уже поднял флажок. Вне игры.','Лайнсмен показывает, что','Но боковой судья уже поднял флажок.','оказался в офсайде.','попал в офсайд.'];
	 
	 for (i=0;i<ofsaidy.length;i++){
		 var img_offside = $("<p class='offside'/>" );
		 $('p.key:contains('+ofsaidy[i]+')').append(img_offside);
		 $('p.key:contains('+ofsaidy[i]+')').css({'padding-bottom':'28px'});
		 
		 $('p.full:contains('+ofsaidy[i]+')').append(img_offside);
		 $('p.full:contains('+ofsaidy[i]+')').css({'padding-bottom':'28px'});
	 }
}

function zameniti_ikonku_zamen(){
	var ikonka = 'system/img/g/on.gif';
	var img_zamena = $("<p class='zamena' />" );
	$('p.key span img[src="'+ikonka+'"]').parent().parent().append(img_zamena);
	$('p.key span img[src="'+ikonka+'"]').parent().parent().css({'padding-bottom':'28px'});
//	$('p.key span img[src="'+ikonka+'"]').remove();
}

function dobaviti_ikonku_gola(){
	var ikonka = 'system/img/refl/ball.gif';
	var img_goal = $("<p class='goal'/>" );
	$('p.key span img[src="'+ikonka+'"]').parent().parent().append(img_goal);
	$('p.key span img[src="'+ikonka+'"]').parent().parent().css({'padding-bottom':'28px'});
}

function dobaviti_ikonku_travmy(){
	var ikonka = 'system/img/refl/krest.gif';
	var img_travma = $("<p class='travma'/>" );
	$('p.key span img[src="'+ikonka+'"]').parent().parent().append(img_travma);
	$('p.key span img[src="'+ikonka+'"]').parent().parent().css({'padding-bottom':'28px'});
}

function dobaviti_ikonki_karto4ek(){
	var ikonka = 'system/img/refl/yel.gif';
	var img_jeltaia = $("<p class='jeltaia'/>" );
	$('p.key span img[src="'+ikonka+'"]').parent().parent().append(img_jeltaia);
	$('p.key span img[src="'+ikonka+'"]').parent().parent().css({'padding-bottom':'28px'});
	
	var ikonka = 'system/img/refl/red.gif';
	var img_krasnaia = $("<p class='krasnaia'/>" );
	$('p.key span img[src="'+ikonka+'"]').parent().parent().append(img_krasnaia);
	$('p.key span img[src="'+ikonka+'"]').parent().parent().css({'padding-bottom':'28px'});
}

function pokazati_penaliti(){
	var penki = ['Назначается пенальти!!!...','Пенальти!...','Арбитр указывает на одиннадцатиметровую отметку!...','Судья назначает пенальти!!','Судья назначает 11-метровый!!!'];
	 
	 for (i=0;i<penki.length;i++){
		 var img_penaliti = $("<p class='penaliti'/>" );
		 $('p.key:contains('+penki[i]+')').append(img_penaliti);
		 $('p.key:contains('+penki[i]+')').css({'padding-bottom':'28px'});
	 }
}

function pokazati_smeny_taktik() {
	var smena = '(*)';
	var img_smena = $("<p class='smena_taktiki'/>" );
	$('p.key:contains("(*)")').append(img_smena);
	$('p.key:contains("(*)")').css({'padding-bottom':'28px'});
}

function dobavlennoe_vremea(){
	var dobavl_komment = ['К основному времени матча добавлен','Судья добавляет','Главный судья добавляет к основному времени матча','Запасной судья поднимает табличку'];
	 
	 for (i=0;i<dobavl_komment.length;i++){
		 var img_extra = $("<p class='extra_time'/>" );
		 $('p.key:contains('+dobavl_komment[i]+')').append(img_extra);
		 $('p.key:contains('+dobavl_komment[i]+')').css({'padding-bottom':'28px'});
	 }
}


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
			var pnum = 0;
			if($(this).find('font ~ img[src*=krest.gif]').next().length >0){
				var pnum1 = parseInt($(this).find('font ~ img[src*=krest.gif]').next().attr('class').replace('p0','').replace('p',''))
				var pnum2 = parseInt($(this).find('font ~ img[src*=krest.gif]').next().next().attr('class').replace('p0','').replace('p',''))
				if(pnum1<12 || (pnum1>18 && pnum1<30)) pnum=pnum1;
				else pnum=pnum2;
			} else {
				pnum = parseInt($(this).find('font:last').attr('class').replace('p0','').replace('p',''))
			}
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
				pname[n] = Std.trim($('td.back4 table:eq(6) tr:eq('+(pnum[n]-1)+') a:eq('+(pl[n]>18 ? 1 : 0)+')').text())
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
	var finschetarr = $('td.schet')
	var fres = $('td.schet b').html()
	if(fres!=match1.res && fres.indexOf(':')!=-1) match1.pen = fres
	debug('getMatchInfo:fres='+fres+':match1.res='+match1.res+':match1.pen='+match1.pen)

	if(deb) for(i in match1) debug('getMatchInfo:'+i+'='+match1[i])
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

function getPlayersInfo(){
	debug('getPlayersInfo()')
	var mt = match1.m

	// get info from postmatch table
	var unih = 2
	var unia = 2
	$('td.back4 table:eq(6) td[id^=p]').each(function(i,val){
		var player	= {id:mid}
		var nameid	= Std.trim($(val).find('a[href^=javascript]').text())
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
/**
		if(players[pnum]!=undefined && players[pnum].inj){
			player.t = 1
			var injmin = players[pnum].last
			player.m = (player.m==undefined ? injmin : (player['in']==1 ? player.m - (mt-injmin) : player.m))
//			$('td.back4 table:eq(6) td:contains('+nameid+')').next().attr('align','right').append(' <font color=red><b>T</b></font>('+players[pnum].last+'\')')
			if($('td.back4 table:eq(6) td:contains('+nameid+')').next().find('img[src*=system/img/gm/out.gif]').length>0){
				$('td.back4 table:eq(6) td:contains('+nameid+')').next().find('img[src*=system/img/gm/out.gif]').remove().end().prepend('<font color=red><b>T</b></font>')
			}else{
//				$('td.back4 table:eq(6) td:contains('+nameid+')').next().attr('align','right').append(' <font color=red><b>Т</b></font>('+players[pnum].last+'\')')
				$('td.back4 table:eq(6) td:contains('+nameid+')').next().attr('align','right').append(' <img src="system/img/refl/krest.gif" width=10></img>('+players[pnum].last+'\')')
			}
		}
/**/

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