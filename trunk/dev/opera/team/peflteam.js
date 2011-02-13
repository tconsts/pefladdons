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
var remember = 0
	if (UrlValue('j')==99999){

		// Get info fom Global or Session Storage
		var text1 = ''
		if (navigator.userAgent.indexOf('Firefox') != -1){
			text1 = String(globalStorage[location.hostname].team)
		} else {
			text1 = String(sessionStorage.team)
		}
		alert(text1)
		if (text1 != 'undefined'){
		var x = ''
		for(i in players) {
			x += '<br>'
			for( j in players[i]) x += players[i][j] + ' '
		}
		$('td.back4').prepend(x)

		}

		var text = ''
		$('table#tblRoster tr:not(#tblRosterRentTitle)').each(function(j,valj){
			if(j >0){
				var pl = [];
					$(valj).find('td').each(function(i,val){
						if (i==0) pl.num = $(val).text()
						if (i==1) {
							pl.id = UrlValue('j', $(val).find('a').attr('href'))
							pl.name = $(val).text()
						}
						if (i==4) pl.morale = $(val).text()
						if (i==5) pl.form = $(val).text()
					})
					players[pl.id] = pl
					}
		});

		text = players
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