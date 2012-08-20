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
var db = false
var list = {
	'players':	'id,tid,num,form,morale,fchange,mchange,value,valuech,name',
	'matches':	'id,su,place,schet,pen,weather,eid,ename,emanager,ref,hash,minutes',
	'matchespl':'nameid,name,minute',
}
var match1	= {}
var matches	= []
var plmatch	= []
var plhead	= 'id,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15,n16,n17,n18'
//var pldbase	= []
//var plteam	= []
var sshort = false

$().ready(function() {
	if(deb) $('body').prepend('<div id=debug></div>')
//	$('td.back4 table:first').attr('border','5')	// расстановка
//	$('td.back4 table:eq(1)').attr('border','5')	// все вместе кроме расстановки
//	$('td.back4 table:eq(2)').attr('border','5')	// отчет
//	$('td.back4 table:eq(3)').attr('border','5')	// заголовок матча
//	$('td.back4 table:eq(4)').attr('border','5')	// голы\лого
//	$('td.back4 table:eq(5)').attr('border','5')	// стата
//	$('td.back4 table:eq(6)').attr('border','5')	// оценки

	var mid = parseInt(UrlValue('j'))
	match1.id = mid
	match1.hash = UrlValue('z')
	match1.su = ((mid>559098 && mid<601685) || mid>602078 ? true : false)

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

		// даем возможность скрыть отчет
		$('td.back4 table:eq(2)').before('<br><a id="a2" href="javascript:void(ShowTable(2))">&ndash;</a> <b>Отчет</b><br>')
/**/
		// запоминаем таблицу оценок
		match1.weather = $('img[src^="system/img/w"]').attr('src').replace('system/img/w','').replace('.png','')
		match1.minutes = parseInt($('p.key:last').text().split(' ')[0])

		var otcharr = []
		$('td.back4 table:eq(2) center p').each(function(){
			otcharr.push($(this).html())
		})
		match1.ust = ''
		match1.sshort = ''
		for(i in otcharr) {
			if(String(otcharr[i]).indexOf('предельно настроенными') != -1 || String(otcharr[i]).indexOf('активно начинает') != -1) match1.ust = otcharr[i].replace('1 минута','')
			if(String(otcharr[i]).indexOf('(*)') != -1 || String(otcharr[i]).indexOf('СЧЕТ') != -1) match1.sshort += '<br><b>'+otcharr[i].replace('<br>','</b><br>')+'<br>'
		}

		debug('уст:'+match1.ust)

		var otch = $('td.back4 table:eq(2)').html()
		match1.ref = ( otch.indexOf('Главный арбитр:') ==-1 ? '???' : otch.split('Главный арбитр:')[1].split(').')[0] + ')')
		debug('Ref:'+match1.ref)
		match1.schet = $('td.back4 table:eq(3) td:eq(1)').text()
		var finschetarr = $('td.back4 table:eq(2) center').html().split('СЧЕТ ')
		match1.fschet = (finschetarr[finschetarr.length-1].split('<br>')[0].split('<')[0].split('...')[0]).trim()

		var finschet = ''
		if(finschetarr[1]!=undefined && match1.fschet!=match1.schet) {
			finschet = ' [center]По пенальти [b][color=red]'+ match1.fschet + '[/color][/b][/center]'
			match1.pen = match1.fschet
		}
		// /system/img/club/1455.gif - club
		// /system/img/flags/155.gif - national
		if(myteamid!=undefined && $('td.back4 table:eq(4) td:first img').attr('src').indexOf('club')!=-1 ){
			debug('check my team')
			var mark = 'none'
			if(myteamid==parseInt($('td.back4 table:eq(4) td:first img').attr('src').split('club/')[1].split('.')[0])) {
				mark =  true
				match1.place = 'h'
				match1.eid = parseInt($('td.back4 table:eq(4) td:last img').attr('src').split('club/')[1].split('.')[0])
				match1.ename = $('td.back4 table:eq(3) tr:first td:eq(2)').text()
				match1.emanager = $('td.back4 table:eq(3) tr:eq(1) td:eq(2)').text()
				// player
				localStorage.fp_uniform = $('td.back4 center:first table:first tr:first td.field_left:first img').attr('src')
				// gk
				localStorage.gk_uniform = $('td.back4 center:first table:first tr:first td:eq(2) img').attr('src')
			}
			if(myteamid==parseInt($('td.back4 table:eq(4) td:last img').attr('src').split('club/')[1].split('.')[0])) {
				mark = false
				match1.place = 'a'
				match1.eid = parseInt($('td.back4 table:eq(4) td:first img').attr('src').split('club/')[1].split('.')[0])
				match1.ename = $('td.back4 table:eq(3) tr:first td:eq(0)').text()
				match1.emanager = $('td.back4 table:eq(3) tr:eq(1) td:eq(0)').text()
				// player
				localStorage.fp_uniform = $('td.back4 center:first table:first tr:last td.field_left:first img').attr('src')
				// gk
				localStorage.gk_uniform = $('td.back4 center:first table:first tr:last td:eq(2) img').attr('src')
			}
			if(mark!='none') {
				if($('td.back4 b:contains(Нейтральное поле.)').html()!=undefined) match1.place += '.n'
				PlayerTime(mid,parseInt($('p.key:last').text().split(' ')[0]),mark,myteamid)
				MatchGet()
			}
		}

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
			+ '[img]system/img/w' + match1.weather + '.png[/img]' 
			+ (match1.ref!='???' ? ' [b]Главный арбитр:[/b] ' + match1.ref + '.' : '')
			+ '\n\n'+match1.ust
	}
	$('a#a2').before('<a href="javascript:void(ShowSShort())" id="sshort">+</a> <b>Смены тактик и счета</b><div id="sshort" style="display: none;"><center><hr>'+match1.sshort+'<hr></center></div><br>')
}, false);

function MatchGet(){
	debug('MatchGet()')
	var getfalse = true
	var dataname = 'matches'
	var data = matches
	var head = list[dataname].split(',')

	var text1 = String(localStorage[dataname])
	if(text1 != 'undefined'){
		getfalse = false
		var text = text1.split('#')
		for (i in text) {
			var x = text[i].split('|')
			var curt = {}
			var num = 0
			for(j in head){
				curt[head[j]] = (x[num]!=undefined ? x[num] : '')
				num++
			}
			data[curt[head[0]]] = {}
			if(curt[head[0]]!=undefined) data[curt[head[0]]] = curt
		}
	}
	if(getfalse && !ff){
		if(!db) DBConnect()
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM "+dataname, [],
				function(tx, result){
					debug(dataname+':select:ok')
					for(var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i)
						var id = row[head[0]]
						var curt = {}
						for(j in row) curt[j] = row[j]
						data[curt.id] = curt
						//debug(dataname+':g'+id+':'+curt.schet)
					}
					MatchSave()
				},
				function(tx, error){
					debug(dataname+':'+error.message)
					MatchSave()
				}
			)
		})
	}else{
		MatchSave()
	}
}

function MatchSave(){
	debug('MatchSave()')
	matches[match1.id] = match1
	var dataname = 'matches'
	var head = list[dataname].split(',')
	var data = matches
	var text = ''
	for (var i in data) {
		text += (text!='' ? '#' : '')
		if(typeof(data[i])!='undefined') {
			var dti = data[i]
			var dtid = []
			for(var j in head){
				dtid.push(dti[head[j]]==undefined ? '' : dti[head[j]])
			}
			text += dtid.join('|')
		}
	}
	localStorage[dataname] = text
/**
	}else{
		if(!db) DBConnect()
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE IF EXISTS "+dataname,[],
				function(tx, result){},
				function(tx, error) {debug(dataname+':' + error.message)}
			);
			tx.executeSql("CREATE TABLE IF NOT EXISTS "+dataname+" ("+head+")", [],
				function(tx, result){},
				function(tx, error) {debug(dataname+':'+error.message)}
			);
			for(var i in data) {
				var dti = data[i]
				var x1 = []
				var x2 = []
				var x3 = []
				for(var j in head){
					x1.push(head[j])
					x2.push('?')
					x3.push((dti[head[j]]==undefined ? '' : dti[head[j]]))
				}
				//debug('insert:'+x3)
				tx.executeSql("INSERT INTO "+dataname+" ("+x1+") values("+x2+")", x3,
					function(tx, result){},
					function(tx, error) {debug(dataname+':'+error.message)}
				);
			}
		});
	}
/**/
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

function PlayerTime(mid,mt,mrk,tid){
	debug('PlayerTime('+mid+','+mt+','+mrk+','+tid+')')
/**/
	plmatch[mid] = {}

	// get info from postmatch table
	var m = false
	var uni = 2
	$('td.back4 table:eq(6) td:has(a[href^=javascript])').each(function(){
		var player = {}
		m = (m ? false : true)
		if(m==mrk){
			player.name		= TrimString($(this).find('a[href^=javascript]').text())
			player.nameid	= player.name

			if(plmatch[mid][player.nameid]!=undefined){
				player.nameid += '_'+uni
				uni++;
			}

			var pnum = parseInt($(this).prev().html())+(mrk ? 0 : 18)
			var nexttd = $(this).next().html()
			player.minute = (nexttd.indexOf('(')==-1 ? (pnum<12 || (pnum>18 && pnum<30) ? mt : 0) : (pnum<12 || (pnum>18 && pnum<30) ? parseInt(nexttd.split('(')[1]) : mt-parseInt(nexttd.split('(')[1])))
			player.num = (pnum>18 ? pnum-18 : pnum)

			// get info from match text
			player.searchname = ':'+player.name+':'
			$('font.p'+(pnum<10 ? 0 :'')+pnum).each(function(){
				var cname = $(this).text()
				if(player.searchname.indexOf(':'+cname+':')==-1) player.searchname += cname+':'
			})
			plmatch[mid][player.nameid] = player
		}
	})

	// get players position
	//$('td.back4 table:first').attr('border','2')

	// print debug info
/**
	for(i in plmatch[mid]) {
		var x  = plmatch[mid][i]
		var dtext = ''
		for(j in x) dtext += ' '+x[j]
		debug(dtext)
	}
/**/
	SavePlayers(mid)
}

function SavePlayers(mid) {
	debug('SavePlayers()')
	var dataname = 'matchespl'
	var head = plhead.split(',')
	var data = []
	for (i in plmatch){
		var players = {'id':mid}
		for (j in plmatch[i]) players['n'+plmatch[i][j].num] = plmatch[i][j].nameid + ':' + plmatch[i][j].minute
		data[i] = players
	}
	var text = String(localStorage[dataname])
	text = (text=='undefined' ? '' : text)
   	if((text=='' || (text.indexOf('#'+mid+'|')==-1 && text.split('|',1)[0]!=mid))) {
		debug(dataname+':add')
		for (var i in data) {
			text += (text!='' ? '#' : '')
			if(typeof(data[i])!='undefined') {
				var dti = data[i]
				var dtid = []
				for(var j in head){
					dtid.push(dti[head[j]]==undefined ? '' : dti[head[j]])
				}
				text += dtid.join('|')
			}
		}
		localStorage[dataname] = text
	}
/**
	}else{
		if(!db) DBConnect()
		db.transaction(function(tx) {

			tx.executeSql("DROP TABLE IF EXISTS "+dataname,[],
				function(tx, result){},
				function(tx, error) {debug(dataname+':' + error.message)}
			);
			tx.executeSql("CREATE TABLE IF NOT EXISTS "+dataname+" ("+head.join(',').replace('id','id UNIQUE')+")", [],
				function(tx, result){},
				function(tx, error) {debug(dataname+':create:'+error.message)}
			);
			for(var i in data) {
				var dti = data[i]
				var x1 = []
				var x2 = []
				var x3 = []
				for(var j in head){
					x1.push(head[j])
					x2.push('?')
					x3.push((dti[head[j]]==undefined ? '' : dti[head[j]]))
				}
				//debug(dataname+':insert3:'+x3)
				tx.executeSql("INSERT INTO "+dataname+" ("+x1+") values("+x2+")", x3,
					function(tx, result){},
					function(tx, error) {debug(dataname+':insert:'+error.message)}
				);
			}

		});
	}
/**/
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}
