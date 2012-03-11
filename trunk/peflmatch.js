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
var ttime = []
var list = {
	'players':	'id,tid,num,form,morale,fchange,mchange,value,valuech,name',
	'matches':	'id,hash,place,schet,pen,weather,ref,ename',
	'plmatches':'',
}
var match1 = {}

$().ready(function() {
	if(deb) $('td.back4').prepend('<div id=debug></div>')
//	$('td.back4 table:first').attr('border','5')	// расстановка
//	$('td.back4 table:eq(1)').attr('border','5')	// все вместе кроме расстановки
//	$('td.back4 table:eq(2)').attr('border','5')	// отчет
//	$('td.back4 table:eq(3)').attr('border','5')	// заголовок матча
//	$('td.back4 table:eq(4)').attr('border','5')	// голы\лого
//	$('td.back4 table:eq(5)').attr('border','5')	// стата
//	$('td.back4 table:eq(6)').attr('border','5')	// оценки

	var mid = UrlValue('j')
	match1.id = mid
	var su = (mid>602078 ? true: false)

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
		match1.wimg = $('img[src^="system/img/w"]').attr('src').replace('system/img/w','').replace('.png','')
		match1.ref = $('td.back4 table:eq(2)').html().split('Главный арбитр:')[1].split(').')[0] + ')'
		match1.schet = $('td.back4 table:eq(3) td:eq(1)').text()
		var finschetarr = $('td.back4 table:eq(2) center').html().split('СЧЕТ ')
		match1.fschet = (finschetarr[finschetarr.length-1].split('<br>')[0].split('<')[0].split('...')[0]).trim()

		var finschet = (finschetarr[1]!=undefined && match1.fschet!=match1.schet ? ' [center]По пенальти [b][color=red]'+ match1.fschet + '[/color][/b][/center]' : '')

		if(myteamid!=undefined){
			var mark = 'none'
			mark = (myteamid==parseInt($('td.back4 table:eq(4) td:first img').attr('src').split('club/')[1].split('.')[0]) ? true : mark)
			mark = (myteamid==parseInt($('td.back4 table:eq(4) td:last img').attr('src').split('club/')[1].split('.')[0]) ? false : mark)
			if(mark!='none') {
				PlayerTime(mid,parseInt($('p.key:last').text().split(' ')[0]),mark,myteamid)
				MatchGetData()
				//MatchCheck(mid)
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
			+ '[img]system/img/w' + match1.wimg + '.png[/img]' 
			+ ' [b]Главный арбитр:[/b] ' + match1.ref + '.'
	}
}, false);

function MatchGetData(mid){
	debug('MatchGetData()')
	for(i in match1) debug(i+':'+match1[i])
}

function MatchCheck(mid){
	debug('MatchCheck('+mid+')')
	var head = list['matches'].split(',')
	if(ff) {
/**		var text1 = String(globalStorage[location.hostname][dataname])
		if (text1 != 'undefined'){
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
			GetFinish('get_'+dataname, true)
		} else {
			GetFinish('get_'+dataname, false)
		}
/**/
	}else{
		if(!db) DBConnect()
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM matches WHERE id='"+mid+"'", [],
				function(tx, result){
					debug('matches:Select ok')
					for(var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i)
						var id = row[head[0]]
						match2 = {}
						for(j in row) match2[j] = row[j]
						debug('matches:g'+id+':'+match2.schet)
					}
				},
				function(tx, error){
					debug(error.message)
					MatchSave()
				}
			)
		})
	}
}

function MatchSave(){
	debug('MatchSave()')
	var head = list['matches'].split(',')
	if(ff) {
/**		var text = ''
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
		db.transaction(function(tx) {
			tx.executeSql("CREATE TABLE IF NOT EXISTS matches ("+list['matches']+")", [],
				function(tx, result){debug('matches:create ok')},
				function(tx, error) {debug(error.message)}
			);

//			for(var i in data) {
				var dti = match1//data[i]
				var x1 = []
				var x2 = []
				var x3 = []
				for(var j in head){
					x1.push(head[j])
					x2.push('?')
					x3.push((dti[head[j]]==undefined ? '' : dti[head[j]]))
				}
				debug('matches:s'+x3['0']+'_'+x3['1'])
				tx.executeSql("INSERT INTO matches ("+x1+") values("+x2+")", x3,
					function(tx, result){},
					function(tx, error) {debug('matches:insert('+i+') error:'+error.message)
				});
//			}
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
		//debug('font.p'+(pl.pnum<10 ? 0 :'')+pl.pnum)
		$('font.p'+(pl.pnum<10 ? 0 :'')+pl.pnum).each(function(){
			var cname = $(this).text()
			//debug(cname)
			if(pl.pfname.indexOf(':'+cname+':')==-1) pl.pfname += cname+':'
		})
	}

	// get players position
	//$('td.back4 table:first').attr('border','2')

	// print debug info
	for(i in ttime[tid]) {
		var x  = ttime[tid][i]
		debug(mid+':'+tid+':'+x.ptime+':'+x.pfname)
	}
/**/
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}

function SaveData(dataname){
	debug(dataname+':SaveData')

	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'players':		data = players;break
		case 'matches':		data = matches;break
		case 'plmatches': 	data = plmatches;break
		default: return false
	}
	if(ff) {
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
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE IF EXISTS "+dataname,[],
				function(tx, result){},
				function(tx, error) {debug(dataname+':drop error:' + error.message)}
			);                                           
			tx.executeSql("CREATE TABLE IF NOT EXISTS "+dataname+" ("+list[dataname]+")", [],
				function(tx, result){debug(dataname+':create ok')},
				function(tx, error) {debug(error.message)}
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
//				debug(dataname+':s'+x3['0']+'_'+x3['1'])
				tx.executeSql("INSERT INTO "+dataname+" ("+x1+") values("+x2+")", x3,
					function(tx, result){},
					function(tx, error) {debug(dataname+':insert('+i+') error:'+error.message)
				});
			}
		});
	}
}

function GetData(dataname){
	debug(dataname+':GetData')
	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'players': data = players2;break
		case 'teams': 	data = teams;	break
//		case 'divs'	: 	data = divs;	break
		default: return false
	}
	if(ff) {
		var text1 = String(globalStorage[location.hostname][dataname])
		if (text1 != 'undefined'){
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
			GetFinish('get_'+dataname, true)
		} else {
			GetFinish('get_'+dataname, false)
		}			
	}else{
		if(!db) DBConnect()
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM "+dataname, [],
				function(tx, result){
					debug(dataname+':Select ok')
					for(var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i)
						var id = row[head[0]]
						data[id] = {}
						for(j in row) data[id][j] = row[j]
//						debug(dataname+':g'+id+':'+data[id].my)
					}
					GetFinish('get_'+dataname,true)
				},
				function(tx, error){
					debug(error.message)
					GetFinish('get_'+dataname, false)
				}
			)
		})
	}
}

