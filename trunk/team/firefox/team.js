// ==UserScript==
// @name           peflteam
// @namespace      pefl
// @description    roster team page modification
// @include        http://www.pefl.ru/plug.php?p=refl&t=k&j=*
// @include        http://pefl.ru/plug.php?p=refl&t=k&j=*
// @include        http://www.pefl.net/plug.php?p=refl&t=k&j=*
// @include        http://pefl.net/plug.php?p=refl&t=k&j=*
// @include        http://www.pefl.org/plug.php?p=refl&t=k&j=*
// @include        http://pefl.org/plug.php?p=refl&t=k&j=*
// @version			1.1
// ==/UserScript==

//document.addEventListener('DOMContentLoaded', function(){

$().ready(function() {
	// Draw left panel and fill data
	var preparedhtml = ''
	preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr><td width=200></td><td id="crabglobalcenter"></td><td id="crabglobalright" width=200 valign=top>'
	preparedhtml += '<table id="crabrighttable" bgcolor="#C9F8B7" width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
	preparedhtml += '</td></tr></table>'
	$('body table.border:last').before(preparedhtml)
	$('td.back4 script').remove()
	$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
	$('#crabrighttable').addClass('border') 
	var text3 =	'<div id="finance"></div><br>'
	text3 += 	'<div id="nominals"></div><br>'
	text3 += 	'<div id="zp"></div><br>'
	$("#crabright").html(text3)

	EditFinance();
	TeamHeaderInfoGet();
	PlayersChange();
	PlayersInfoGet();

}, false);

function PlayersInfoGet(){
	var wage = 0
	var nom  = 0
	$('table#tblRoster tr[id^=tblRosterTr] td:has(a[trp="1"])').each(function(i,val){
		var plurl = $(val).find('a').attr('href')
		$.get(plurl, function(data){
			wage += parseInt(data.split('Контракт: ')[1].split('$')[0].split(', ')[1].replace(/,/g,''))
			nom  += parseInt(data.split('Номинал: ')[1].split('$')[0].replace(/,/g,''))
			$('#zp').html('<b>Зарплаты</b>: ' + ((wage/1000).toFixed(3)+'т$').fontsize(1)+'<br>')
			$('#nominals').html('<b>Номиналы</b>: ' + ((nom/1000000).toFixed(3)+'м$').fontsize(1)+'<br>')
		})
	})
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

function ShowChange(value){
	if(value > 0) 		return '<sup><font color="green">+' + value + '</font></sup>'
	else if(value < 0)	return '<sup><font color="red">' + value + '</font></sup>'
	else 		  		return ''
}

function EditFinance(){
	var txt = $('table.layer1 td.l4:eq(1)').text().split(': ')[1]
	switch (txt){
		case 'банкрот': 				 txt += ' (меньше 0)'	;break;
		case 'жалкое': 					 txt += ' (1т-200т)'	;break;
		case 'бедное': 					 txt += ' (200т-500т)'	;break;
		case 'среднее': 				 txt += ' (500т-1м)'	;break;
		case 'нормальное': 				 txt += ' (1м-3м)'		;break;
		case 'благополучное': 			 txt += ' (3м-6м)'		;break;
		case 'отличное': 				 txt += ' (6м-15м)'		;break;
		case 'богатое': 				 txt += ' (15м-40м)'	;break;
		case 'некуда деньги девать :-)': txt += ' (>40м)'		;break;
		default:
			var fin = parseInt(txt.replace(/,/g,'').replace('$',''))
			if (fin >= 40000000) 		txt = 'некуда деньги девать (>40м)'
			else if (fin >= 15000000)	txt = 'богатое (15м-40м)'
			else if (fin >= 6000000) 	txt = 'отличное (6м-15м)'
			else if (fin >= 3000000) 	txt = 'благополучное (3м-6м)'
			else if (fin >= 1000000) 	txt = 'нормальное (1м-3м)'
			else if (fin >= 500000) 	txt = 'среднее (500т-1м)'
			else if (fin >= 200000) 	txt = 'бедное (200т-500т)'
			else if (fin >=0) 			txt = 'жалкое (1т-200т)'
			else if (fin < 0) 			txt = 'банкрот (меньше 0)'
	}
	var preparedhtml = '<br><b>Финaнсовое&nbsp;положение</b>:<br>' + txt.fontsize(1) + '<br>'
	$('#finance').html(preparedhtml)
}

function TeamHeaderInfoGet(){
	var team = []
	// Get info fom Global or Session Storage (info for clubs)
	// format: <id_team0>:<task_team0>:<town0>:<stadio_name0>:<stadio_size0>,
	var text1 = ''
	if (navigator.userAgent.indexOf('Firefox') != -1)	text1 = String(globalStorage[location.hostname].tasks)
	else 												text1 = String(sessionStorage.tasks)
//	$('td.back4').prepend('<br>'+text1+'<br>')
	if (text1 != 'undefined'){
		var t1 = text1.split(',')
		for (i in t1) {
			var t2 = t1[i].split(':')
			team[t2[0]] = {}
			if(t2[1] != undefined) team[t2[0]].ttask = t2[1]
			if(t2[2] != undefined) team[t2[0]].ttown = t2[2]
			if(t2[3] != undefined) team[t2[0]].sname = t2[3]
			if(t2[4] != undefined) team[t2[0]].ssize = t2[4]
		}
	}
	// Get current club data
	var cid = parseInt($('td.back4 table:first table td:first').text())
	var zad = $('table.layer1 td.l4:eq(3)').text().split(': ',2)[1]

	// Delete all task if we have new task - it's new season!
	if (team[cid] != undefined && team[cid].ttask != undefined && team[cid].ttask != zad) for (i in team) team[i].ttask = null
	if (team[cid] == undefined) team[cid] = {}
	team[cid].ttask = zad
	team[cid].ttown = $('td.back4 table table:first td:last').text().split('(')[1].split(',')[0]
	team[cid].sname = $('table.layer1 td.l4:eq(0)').text().split(': ',2)[1]
	team[cid].ssize = $('table.layer1 td.l4:eq(2)').text().split(': ',2)[1]

	// Prepare data for remember
	var text = ''
	for (i in team) {
		if(team[i] != undefined) {
			text += i+':'
			text += (team[i].ttask != undefined ? team[i].ttask : '') +':'
			text += (team[i].ttown != undefined ? team[i].ttown : '') +':'
			text += (team[i].sname != undefined ? team[i].sname : '') +':'
			text += (team[i].ssize != undefined ? team[i].ssize : '') +','
		}
	}
//	$('td.back4').prepend(text+'<br>')

	// Save data for clubs
	if (navigator.userAgent.indexOf('Firefox') != -1)	globalStorage[location.hostname].tasks = text
	else 												sessionStorage.tasks = text
}

function PlayersChange(){
	var players = []
	var players2 = []
	var remember = 0
	var teamid = UrlValue('j')
	var team21 = UrlValue('h')
	if (teamid == 99999){
		// Get data from page
		$('table#tblRoster tr:not(#tblRosterRentTitle)').each(function(j,valj){
			if(j > 0){
				var pl = [];
				pl.mchange = 0
				pl.fchange = 0
				$(valj).find('td').each(function(i,val){
					if (i==0) pl.num = $(val).text()
					if (i==1) pl.id = UrlValue('j', $(val).find('a').attr('href'))
					if (i==4) pl.morale = parseInt($(val).text())
					if (i==5) pl.form = parseInt($(val).text())
				})
				players[pl.num] = pl
			}
		});

		// Get info fom Global or Session Storage (info of team players)
		var text1 = ''
		if (navigator.userAgent.indexOf('Firefox') != -1)	text1 = String(globalStorage[location.hostname].team)
		else 												text1 = String(sessionStorage.team)
		
		if (text1 != 'undefined'){
			var pltext = text1.split(':',2)[1].split('.')
			for (i in pltext) {
				var plsk = pltext[i].split(',')
				var plx = []
				plx.id = parseInt(plsk[0])
				plx.num = parseInt(plsk[1])
				plx.morale = parseInt(plsk[2])
				plx.form = parseInt(plsk[3])
				plx.mchange = parseInt(plsk[4])
				plx.fchange = parseInt(plsk[5])
				players2[plx.id] = []
				players2[plx.id] = plx
			}

			// Check for update
			for(i in players) {
				var pl = players[i]
				if(players2[pl.id]){
					var pl2 = players2[pl.id]
					if (remember != 1 && (pl.morale != pl2.morale || pl.form != pl2.form)){
						remember = 1
					}
				}
			}
			// Calculate
			for(i in players) {
				var pl = players[i]
				if(players2[pl.id]){
					var pl2 = players2[pl.id]
					if (remember == 1){
						players[i]['mchange'] = pl.morale - pl2.morale
						players[i]['fchange'] = pl.form - pl2.form
					} else {
						players[i]['mchange'] = pl2.mchange
						players[i]['fchange'] = pl2.fchange
					}
				}
			}

			// Update page
			for(i in players) {
				$('table#tblRoster tr#tblRosterTr' + i + ' td:eq(4)').append(ShowChange(players[i]['mchange']))
				$('table#tblRoster tr#tblRosterTr' + i + ' td:eq(5)').append(ShowChange(players[i]['fchange']))
				$('table#tblRoster tr#tblRosterRentTr' + i + ' td:eq(4)').append(ShowChange(players[i]['mchange']))
				$('table#tblRoster tr#tblRosterRentTr' + i + ' td:eq(5)').append(ShowChange(players[i]['fchange']))
			}
		} else {
			remember = 1
		}

		// Remember data
		if (remember == 1 && team21 != 1){
	   		var text = teamid + ':'	
			for(i in players) {
				var pl = players[i]
				text += pl.id + ',' + pl.num + ',' + pl.morale + ',' + pl.form + ',' + pl.mchange + ',' + pl.fchange + '.'
			}
			if (navigator.userAgent.indexOf('Firefox') != -1)	globalStorage[location.hostname].team = text
			else 												sessionStorage.team = text			
		}
	}
}