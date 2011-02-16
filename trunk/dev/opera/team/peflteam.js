// ==UserScript==
// @name           peflteam
// @namespace      pefl
// @description    roster team page modification (PEFL.ru and .net)
// @include        http://www.pefl.ru/plug.php?p=refl&t=k&j=*
// @include        http://pefl.ru/plug.php?p=refl&t=k&j=*
// @include        http://www.pefl.net/plug.php?p=refl&t=k&j=*
// @include        http://pefl.net/plug.php?p=refl&t=k&j=*
// ==/UserScript==


function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}
function ShowChange(value){
	if(value > 0) 		return '(+' + value + ')'
	else if(value < 0)	return '(' + value + ')'
	else 		  		return ''
}

var tnoms = 0
var tnom = []
document.addEventListener('DOMContentLoaded', function(){
	var txt = 'Фин. положение: '
	$('td.l4:contains('+txt+')').each(function(){
			var fin = $(this).text().replace(txt,'').replace(/,/g,'').replace('$','')
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
			var preparedhtml = 'Фин: '+$(this).text().replace(txt,'').replace(' :-)','')+newtxt.fontsize(1)
			$(this).html(preparedhtml);

	});

/**/
	if (UrlValue('j')==99999){
		//header('Content-type: text/html; charset=utf-8')
		$.get('team.php', {}, function(data){
			var dataarray = data.split('_');

/**
var str=dataarray[0] //"ї";
var uni = str.charCodeAt();
alert(uni);   //выводит 1111
alert(String.fromCharCode(uni));  //выводит ї

/**/
			var teamname = dataarray[0]
//			$('td.back4').prepend(teamname)

			var teamnominals = 0
			for (i in dataarray) {
				if( i%28 == 26 )  teamnominals += parseInt(dataarray[i])
			}
			var nomtext = ((teamnominals/1000000).toFixed(3)+'м$').replace(/\./g,',')
			if (teamnominals != 0) $('table.layer1 td.l2:last').append(('Номиналы: ' + nomtext).fontsize(1))
		})
	}
/**/
/**
	var rr = 0
	$('td.back4 table:last tr').each(function(i,val){
		if(i>0) {
			$(val).find('td:last a').parent().attr('bgcolor','red')
			var purl = $(val).find('td:last a').attr('href')
			$.get(purl, function(data){
				var name = data.split('<b>',2)[1].split(' (',1)[0]
				var xx = parseInt(data.split('Номинал:',2)[1].split('$',1)[0].replace(/,/g,''))
				tnoms += xx;
				$('td.back4').prepend(i + ': '+ xx + ' : ' + name + '<br>')
//				return true
			})
		}
//		return true
	})

//	for (var i in tnom) tnoms += tnom[i]

	$('table.layer1 td.l2:last').append(('Номиналы: ' + tnoms).fontsize(1))	

/**/

	// собрать форму\мораль
//	alert($('table#tblRoster').html())
//	sessionStorage.team = '99999:40078,1,99,100,0,0.'
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

		// Get info fom Global or Session Storage
		var text1 = ''
		if (navigator.userAgent.indexOf('Firefox') != -1){
			text1 = String(globalStorage[location.hostname].team)
		} else {
			text1 = String(sessionStorage.team)
		}

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
//				$('td.back4').prepend(plx.id + ',' + plx.num + ',' + plx.morale + ',' + plx.form + ',' + plx.mchange + ',' + plx.fchange + '.'+'<br>')
			}
//			$('td.back4').prepend('get:<br>')

			// Check for update
			for(i in players) {
				var pl = players[i]
				if(players2[pl.id]){
					var pl2 = players2[pl.id]
					if (pl.morale != pl2.morale || pl.form != pl2.form){
						remember = 1
					}
				}
			}

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

		if (remember == 1 && team21 != 1){
			// Data for remember
	   		var text = teamid + ':'	
			for(i in players) {
				var pl = players[i]
				text += pl.id + ',' + pl.num + ',' + pl.morale + ',' + pl.form + ',' + pl.mchange + ',' + pl.fchange + '.'
//				$('td.back4').prepend(pl.id + ',' + pl.num + ',' + pl.morale + ',' + pl.form + ',' + pl.mchange + ',' + pl.fchange + '.'+'<br>')
			}
//			$('td.back4').prepend('<br>set:<br>')

			if (navigator.userAgent.indexOf('Firefox') != -1){
				globalStorage[location.hostname].team = text
			} else {	
				sessionStorage.team = text
			}

		}

	}


}, false);