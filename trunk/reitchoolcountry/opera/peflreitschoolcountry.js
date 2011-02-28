// ==UserScript==
// @name           peflreitschoolcountry
// @namespace      pefl
// @description    school reit page modification (PEFL.ru and .net)
// @include        http://www.pefl.ru/plug.php?p=rating&t=s&n=*
// @include        http://www.pefl.net/plug.php?p=rating&t=s&n=*
// @include        http://pefl.ru/plug.php?p=rating&t=s&n=*
// @include        http://pefl.net/plug.php?p=rating&t=s&n=*
// ==/UserScript==

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

function SaveData(){
	var teamslist = ''
	for(i in teams){
		var bud = (teams[i]['bud'] ? teams[i]['bud'] : ' ')
		var rep = (teams[i]['rep'] ? teams[i]['rep'] : ' ')
		teamslist += i + ':'+ bud + ':' + rep + ','
	}
	if (navigator.userAgent.indexOf('Firefox') != -1){
		globalStorage[location.hostname].peflcountryteams = teamslist
	} else {	
		sessionStorage.peflcountryteams = teamslist
	}
}

function check(d) {return (d<10 ? "0"+d : d)}

function GetAllReit(value){
	var today = new Date()
	today = check(today.getDate()) + '.' + check(today.getMonth()+1)
	if(!teams[0]) teams[0] = {}
	teams[0][value] = today;

	$('td.back4 table table tr:gt(0)').each(function(){
		var m = $(this).find('td:first').text()
		var id = UrlValue('j',$(this).find('td:eq(2)').find('a').attr('href'));
		if(!teams[id]) teams[id] = {}
		teams[id][value] = m;
	},false)
	SaveData();
}

function GetRepName(value){
	for( i in reputations){
		var rep = reputations[i]
		if(value >= rep.st && value <= rep.fn) return rep.name
	}
}

function GetRepLevel(value){
	for( i in reputations){
		var rep = reputations[i]
		if(value >= rep.st && value <= rep.fn) return i
	}
}

function GetRepForecast(val1,val2){
//	$('td.back4 td.back1').append('<br>val1='+val1+' val2='+val2)

	var x = reputations[val1]['up'].split(',')
	var minr = ''
	var maxr = 0
	var res1 = ''
	var res2 = ''
	for (i in x) {
		if(val2 < parseInt(x[i])) {
			minr = parseInt(x[i])
			mini = parseInt(val1) - parseInt(lv[parseInt(i)])
		} 
		if(val2 > parseInt(x[i]) && maxr == 0) {
			maxr = parseInt(x[i])
			maxi = parseInt(val1) - parseInt(lv[parseInt(i)])
		}
	}
//	$('td.back4 td.back1').append(' minr='+ minr + ' mini=' + mini)
//	$('td.back4 td.back1').append(' maxr='+ maxr + ' maxi=' + maxi)
	var raz = minr - maxr
//	$('td.back4 td.back1').append(' raz='+ raz)

	res1 = (mini!=maxi ? reputations[mini]['name'] + ' (' + (100 - (minr - val2)/raz*100).toFixed(0) + '%)' : '')
	res2 = reputations[maxi]['name'] + ' (' + (100 - (val2 - maxr)/raz*100).toFixed(0) + '%)'
	
//	if(val1 == 9 || val1 == 5) $('td.back4').prepend(val1+': '+val2+': '+minr +': '+maxr+': ' +raz+': '+mini+': '+maxi+' <br>')
	return res2 + '<br>' + res1
}

function Forecast(){
	htmltext = '<th width=20%>Прогноз от КрабVIP (<a href="/page.php?id=4442">*</a>)</th>'
	$('td.back4 table table tr:eq(0)').prepend(htmltext)
	$('td.back4 table table tr:gt(0)').each(function(k,val2){
		var id = UrlValue('j',$(val2).find('a:last').attr('href'))
		htmltext = '<td>' + GetRepForecast(GetRepLevel(teams[id]['rep']),teams[id]['bud']) + '</td>'
		$(val2).prepend(htmltext)
	},false)
//	$('#forecast').hide()
}

var lv = {0:-3,1:-2,2:-1,3:0,4:1,5:2,6:3}

// 9 season
var reputations = {
	1	: {name: 'ОЛМ',      st: 1,    fn: 9,		up:'0,0,100,20,0,0,0'},
	2	: {name: 'Мир 1/2',  st: 10,   fn: 23,		up:'365,175,51,31,8,0,0'},
	3	: {name: 'Мир 2/2',  st: 24,   fn: 41,		up:'283,138,76,37,14,0,0'},
	4	: {name: 'Отл 1/2',  st: 42,   fn: 65,		up:'268,179,128,69,28,0,0'},
	5	: {name: 'Отл 2/2',  st: 66,   fn: 92,		up:'583,220,170,107,55,7,0'},
	6	: {name: 'Хор 1/4',  st: 93,   fn: 118,		up:'484,327,181,124,70,20,0'},
	7	: {name: 'Хор 2/4',  st: 119,  fn: 163,		up:'589,396,289,162,100,52,0'},
	8	: {name: 'Хор 3/4',  st: 164,  fn: 221,		up:'646,462,358,232,115,56,23'},
	9	: {name: 'Хор 4/4',  st: 222,  fn: 281,		up:'789,554,428,293,171,81,0'},
	10	: {name: 'Срд 1/3',  st: 282,  fn: 351,		up:'1177,711,507,352,232,114,34'},
	11	: {name: 'Срд 2/3',  st: 352,  fn: 421,		up:'1139,880,653,444,284,168,103'},
	12	: {name: 'Срд 3/3',  st: 422,  fn: 521,		up:'1294,960,772,552,341,192,115'},
	13	: {name: 'Слб 1/3',  st: 522,  fn: 631,		up:'1651,1138,885,663,435,281,192'},
	14	: {name: 'Слб 2/3',  st: 632,  fn: 743,		up:'1801,1430,1071,803,551,320,237'},
	15	: {name: 'Слб 3/3',  st: 744,  fn: 961,		up:'2021,1659,1325,923,618,418,268'},
	16	: {name: 'ОчСл 1/5', st: 962,  fn: 1184,	up:'2052,1774,1491,1125,733,426,245'},
	17	: {name: 'ОчСл 2/5', st: 1185, fn: 1403,	up:'0,1954,1640,1250,912,578,265'},
	18	: {name: 'ОчСл 3/5', st: 1404, fn: 1680,	up:'0,2095,1832,1395,1008,666,410'},
	19	: {name: 'ОчСл 4/5', st: 1681, fn: 1991,	up:'0,0,1975,1572,1080,734,426'},
	20	: {name: 'ОчСл 5/5', st: 1992, fn: 2284,	up:'0,0,0,1966,1367,848,601'},
	21	: {name: 'Unknown',  st: 2285, fn: 5000,	up:'0,0,0,0,0,0,0'},
}

var teams = []

document.addEventListener('DOMContentLoaded', function(){

	// Get info fom Global or Session Storage
	var text1 = ''
	if (navigator.userAgent.indexOf('Firefox') != -1){
		text1 = String(globalStorage[location.hostname].peflcountryteams)
	} else {
		text1 = String(sessionStorage.peflcountryteams)
	}
	if (text1 != 'undefined'){
//		alert('a')
		var data = text1.split(',');
		for (i in data){
			var data2 = data[i].split(':')
			var id = data2[0]
			var team = []
			team.id = id
			team.bud = (data2[1] ? data2[1] : ' ')
			team.rep = (data2[2] ? data2[2] : ' ')
			teams[id] = team
		}
	}

	// page contry reit
	if (teams[0] && UrlValue('j') && UrlValue('j') > 0 && UrlValue('n') == 2){
		var htmltext = ''
//		alert('country')
		if(teams[0]['bud'] != ' '){
			htmltext = '(PEFL:'+teams[0]['bud']+')'
			$('td.back4 table table tr:eq(0) th:first').append(htmltext)
			$('td.back4 table table tr:gt(0)').each(function(k,val2){
				var id = UrlValue('j',$(val2).find('td:eq(2)').find('a').attr('href'))
				htmltext = ' ('+teams[id]['bud']+')'
				$(val2).find('td:first').append(htmltext)
    		},false)
    	}
		if(teams[0]['rep'] != ' '){
			htmltext = '<th width=15%>Репутация ('+teams[0]['rep']+')</th>'
			$('td.back4 table table tr:eq(0)').prepend(htmltext)
			$('td.back4 table table tr:gt(0)').each(function(k,val2){
				var id = UrlValue('j',$(val2).find('td:eq(2)').find('a').attr('href'))
				htmltext = '<td>'+GetRepName(teams[id]['rep'])+'</td>'
				$(val2).prepend(htmltext)
    		},false)
			$('td.back4').prepend('<div align=right><a id="forecast" href="javascript:void(Forecast())">Показать прогноз</a>&nbsp;</div><br>')
		}

	} else if(!UrlValue('j') && UrlValue('n') == 2){
//		alert('bud')
		GetAllReit('bud');

	} else if(!UrlValue('j') && UrlValue('n') == 1){
//		alert('rep')
		GetAllReit('rep');
	}
}, false);