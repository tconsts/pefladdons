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
//alert($('table#tblRoster').html())

var players = []
var players2 = []
var remember = 0
	if (UrlValue('j')==99999){

		// Get info fom Global or Session Storage
		var text1 = ''
		if (navigator.userAgent.indexOf('Firefox') != -1){
			text1 = String(globalStorage[location.hostname].team)
		} else {
			text1 = String(sessionStorage.team)
		}

		if (text1 != 'undefined'){
//			$('td.back4').prepend('text1:' + text1 + '<br>')
			var pltext = text1.split(':',2)[1].split('.')
			for (i in pltext) {
				var plsk = pltext[i].split(',')
				var plx = []
				plx.id = parseInt(plsk[0])
				plx.num = parseInt(plsk[1])
				plx.morale = parseInt(plsk[2]) + 2
				plx.form = parseInt(plsk[3]) - 1
				players2[plx.id] = []
				players2[plx.id] = plx
			}
/**/
		var x = ''
		for(i in players2) {
			x += '<br>'
			for( j in players2[i]) x += players2[i][j] + ' '
		}
//		$('td.back4').prepend(x)
/**/
		}

		var text = '99999:'
		$('table#tblRoster tr:not(#tblRosterRentTitle)').each(function(j,valj){
			if(j >0){
				var pl = [];
				var pl2 = [];
					$(valj).find('td').each(function(i,val){
						if (i==0) {
							pl.num = $(val).text()
						}
						if (i==1) {
							pl.id = UrlValue('j', $(val).find('a').attr('href'))
							pl.name = $(val).text()
						}
//						pl2 = players2[pl.id]
						if (i==4) {
							pl.morale = parseInt($(val).text())
//							$('td.back4').prepend(  + '<br>')
							if(players2[pl.id] && players2[pl.id]['morale'] != pl2.morale) {
								var morale = pl.morale - players2[pl.id]['morale']
								if(morale >0 ) $(val).append('(+' + morale + ')')
								else $(val).append('(' + morale + ')')
							}
						}
						if (i==5) {
							pl.form = parseInt($(val).text())
							if(players2[pl.id]['form'] && pl.form != players2[pl.id]['form']) {
								var form = pl.form - players2[pl.id]['form']
								if(form >0 ) $(val).append('(+' + form + ')')
								else $(val).append('(' + form + ')')
							}

						}
					})
					text += pl.id + ',' + pl.num + ',' + pl.morale + ',' + pl.form + '.'
					players[pl.id] = pl
			}
		});
//		$('td.back4').prepend('text :' + text + '<br>')

//		text = players
		remember = 1
		if (remember == 1){ // запомним!
			if (navigator.userAgent.indexOf('Firefox') != -1){
				globalStorage[location.hostname].team = text
			} else {	
				sessionStorage.team = text
			}
		}
	}

}, false);