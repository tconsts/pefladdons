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
	'matches':	'id,su,place,schet,pen,weather,eid,ename,emanager,ref,hash',
	'matchespl':'nameid,name,minute',
}
var match1	= {}
var matches	= []
var plmatch	= []
var plhead	= 'id,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15,n16,n17,n18'
//var pldbase	= []
//var plteam	= []

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
		$('td.back4 table:eq(2)').before('<br><a id="treport" href="javascript:void(ShowTable(2))">&ndash;</a>')
/**/
		// запоминаем таблицу оценок
		match1.weather = $('img[src^="system/img/w"]').attr('src').replace('system/img/w','').replace('.png','')
		match1.ref = $('td.back4 table:eq(2)').html().split('Главный арбитр:')[1].split(').')[0] + ')'
		match1.schet = $('td.back4 table:eq(3) td:eq(1)').text()
		var finschetarr = $('td.back4 table:eq(2) center').html().split('СЧЕТ ')
		match1.fschet = (finschetarr[finschetarr.length-1].split('<br>')[0].split('<')[0].split('...')[0]).trim()

		var finschet = ''
		if(finschetarr[1]!=undefined && match1.fschet!=match1.schet) {
			finschet = ' [center]По пенальти [b][color=red]'+ match1.fschet + '[/color][/b][/center]'
			match1.pen = match1.fschet
		}
		if(myteamid!=undefined){
			var mark = 'none'
			if(myteamid==parseInt($('td.back4 table:eq(4) td:first img').attr('src').split('club/')[1].split('.')[0])) {
				mark =  true
				match1.place = 'h'
				match1.eid = parseInt($('td.back4 table:eq(4) td:last img').attr('src').split('club/')[1].split('.')[0])
				match1.ename = $('td.back4 table:eq(3) tr:first td:eq(2)').text()
				match1.emanager = $('td.back4 table:eq(3) tr:eq(1) td:eq(2)').text()
			}
			if(myteamid==parseInt($('td.back4 table:eq(4) td:last img').attr('src').split('club/')[1].split('.')[0])) {
				mark = false
				match1.place = 'a'
				match1.eid = parseInt($('td.back4 table:eq(4) td:first img').attr('src').split('club/')[1].split('.')[0])
				match1.ename = $('td.back4 table:eq(3) tr:first td:eq(0)').text()
				match1.emanager = $('td.back4 table:eq(3) tr:eq(1) td:eq(0)').text()
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
			+ ' [b]Главный арбитр:[/b] ' + match1.ref + '.'
	}
}, false);

function MatchGet(){
	debug('MatchGet()')
	var dataname = 'matches'
	var data = matches
	var head = list[dataname].split(',')
	if(ff){/**/
		var text1 = String(globalStorage[location.hostname][dataname])
		if(text1 != 'undefined'){
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
		MatchSave()
	/**/
	}else{
		if(!db) DBConnect()
		db.transaction(function(tx) {
			/**
			tx.executeSql("DROP TABLE IF EXISTS "+dataname,[],
				function(tx, result){},
				function(tx, error) {debug(dataname+':' + error.message)}
			);/**/
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
	}
}

function MatchSave(){
	debug('MatchSave()')
	matches[match1.id] = match1
	var dataname = 'matches'
	var head = list[dataname].split(',')
	var data = matches
	if(ff){/**/
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
		globalStorage[location.hostname][dataname] = text
	/**/
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
				debug('insert:'+x3)
				tx.executeSql("INSERT INTO "+dataname+" ("+x1+") values("+x2+")", x3,
					function(tx, result){},
					function(tx, error) {debug(dataname+':'+error.message)}
				);
			}
/**/
		});
	}
}

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
	var text = globalStorage[location.hostname][dataname]
	if(ff && deb && text!=undefined && text.indexOf('#'+mid+'|')==-1) {
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
		globalStorage[location.hostname][dataname] = text

	}else{
		if(!db) DBConnect()
		db.transaction(function(tx) {
			/**
			tx.executeSql("DROP TABLE IF EXISTS "+dataname,[],
				function(tx, result){},
				function(tx, error) {debug(dataname+':' + error.message)}
			);/**/
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
/**/
		});
	}
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}
