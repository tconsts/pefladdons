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

//document.addEventListener('DOMContentLoaded', function(){
$().ready(function() {

	// Edit finance
	var fulltxt = $('table.layer1 td.l4:eq(1)').text()
	var txt = 'Фин. положение: '
	var fin = fulltxt.replace(txt,'').replace(/,/g,'').replace('$','')
	var newtxt = '';
	switch (fin){
		case 'банкрот': newtxt = ' (меньше 0)';break;
		case 'жалкое': newtxt = ' (1т-200т)';break;
		case 'бедное': newtxt =  ' (200т-500т)';break;
		case 'среднее': newtxt =  ' (500т-1м)';break;
		case 'нормальное': newtxt = ' (1м-3м)';break;
		case 'благополучное': newtxt = ' (3м-6м)';break;
		case 'отличное': newtxt =  ' (6м-15м)';break;
		case 'богатое': newtxt =  ' (15м-40м)';break;
		case 'некуда деньги девать :-)': newtxt =  ' (>40м)';break;
		default:
			if (fin >= 40000000) newtxt = ' (некуда девать)'
			else if (fin >= 15000000) newtxt = ' (богатое)'
			else if (fin >= 6000000) newtxt = ' (отличное)'
			else if (fin >= 3000000) newtxt = ' (благополучное)'
			else if (fin >= 1000000) newtxt = ' (нормальное)'
			else if (fin >= 500000) newtxt = ' (среднее)'
			else if (fin >= 200000) newtxt = ' (бедное)'
			else if (fin >=0) newtxt = ' (жалкое)'
			else if (fin < 0) newtxt = ' (банкрот)'
	}
	var preparedhtml = 'Фин: ' + fulltxt.replace(txt,'').replace(' :-)','')+newtxt.fontsize(1)
	$('table.layer1 td.l4:eq(1)').html(preparedhtml);

	// Task and stadio for club
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


	// Show nominals
	if (UrlValue('j')==99999){
		$.get('team.php', {}, function(data){
			var teamnominals = 0
			var dataarray = data.split('_');
			for (i in dataarray) {
				if( i%28 == 26 )  teamnominals += parseInt(dataarray[i])
			}
			var nomtext = ((teamnominals/1000000).toFixed(3)+'м$').replace(/\./g,',')
			if (teamnominals != 0) $('table.layer1 td.l2:last').append(('Номиналы: ' + nomtext).fontsize(1))
		})
	}


	// Show form and morale change
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

}, false);