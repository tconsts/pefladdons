// ==UserScript==
// @name           pefldivtable
// @namespace      pefl
// @description    division table page modification (PEFL.ru and .net)
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

function GetRepForecast(val1,val2){
	var x = reputations[val1]['up'].split(',')
	var minr = ''
	var maxr = ''
	for (i in x) {
		if(val2 < x[i]) minr = i
	}
}

// 9 season
var reputations = {
	1	: {name: 'ОЛМ', st: 1, fn: 9},
	2	: {name: 'Мир 1/2', st: 10, fn: 23},
	3	: {name: 'Мир 2/2', st: 24, fn: 41},
	4	: {name: 'Отл 1/2', st: 42, fn: 65},
	5	: {name: 'Отл 2/2', st: 66, fn: 92},
	6	: {name: 'Хор 1/4', st: 93, fn: 118},
	7	: {name: 'Хор 2/4', st: 119, fn: 163},
	8	: {name: 'Хор 3/4', st: 164, fn: 221},
	9	: {name: 'Хор 4/4', st: 222, fn: 281, up: '789,554,428,293,171,81,0'},
	10	: {name: 'Срд 1/3', st: 282, fn: 351},
	11	: {name: 'Срд 2/3', st: 352, fn: 421},
	12	: {name: 'Срд 3/3', st: 422, fn: 521},
	13	: {name: 'Слб 1/3', st: 522, fn: 631},
	14	: {name: 'Слб 2/3', st: 632, fn: 743},
	15	: {name: 'Слб 3/3', st: 744, fn: 961},
	16	: {name: 'ОчСл 1/5', st: 962, fn: 1184},
	17	: {name: 'ОчСл 2/5', st: 1185, fn: 1403},
	18	: {name: 'ОчСл 3/5', st: 1404, fn: 1680},
	19	: {name: 'ОчСл 4/5', st: 1681, fn: 1991},
	20	: {name: 'ОчСл 5/5', st: 1992, fn: 2284},
	21	: {name: 'Unknown', st: 2285, fn: 5000},
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

		var htmltext = '(PEFL:'+teams[0]['bud']+')'
		$('td.back4 table table tr:eq(0) th:first').append(htmltext)

		htmltext = '<th width=20%>Прогноз от КрабВИП (<a href="/page.php?id=4442">*</a>)</th><th width=15%>Репутация ('+teams[0]['rep']+')</th>'
		$('td.back4 table table tr:eq(0)').prepend(htmltext)


		$('td.back4 table table tr:gt(0)').each(function(k,val2){
			var id = UrlValue('j',$(val2).find('td:eq(2)').find('a').attr('href'))

			htmltext = ' ('+teams[id]['bud']+')'
			$(val2).find('td:first').append(htmltext)

			htmltext = '<td>'+'ОчСл 3/5 (80%)<br>ОчСл 4/5 (20%)'+'</td><td>'+GetRepName(teams[id]['rep'])+'</td>'
			$(val2).prepend(htmltext)

		},false)

	} else if(teams[0] && !UrlValue('j') && UrlValue('n') == 2){
		GetAllReit('bud');

	} else if(teams[0] && !UrlValue('j') && UrlValue('n') == 1){
		GetAllReit('rep');
	}
}, false);