// ==UserScript==
// @name           peflreitschoolcountry
// @namespace      pefl
// @description    reit school for country (PEFL.ru and .net)
// @include        http://www.pefl.ru/plug.php?p=rating&t=s&n=2&*
// @include        http://www.pefl.net/plug.php?p=rating&t=s&n=2*
// @include        http://pefl.ru/plug.php?p=rating&t=s&n=2&*
// @include        http://pefl.net/plug.php?p=rating&t=s&n=2&*
// ==/UserScript==

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}
function SaveData(){
	if (navigator.userAgent.indexOf('Firefox') != -1){
		globalStorage[location.hostname].peflcountryteams = teams
	} else {	
		sessionStorage.peflcountryteams = teams
	}
	// on exit: 155:1:2,744,718,739,746,713,1432,729,738,723
}

function GetTeamsId(){
	var teams = UrlValue('j')
	$('td.back4 table table tr:gt(0)').each(function(){
		$(this).find('td').each(function(i,val){
			if(i==2) {
				teams += ',' + UrlValue('j',$(val).find('a').attr('href'))
			}
		})
	},false)

}

function GetAllReitBud(){
	$('td.back4 table table tr:gt(0)').each(function(){
		$(this).find('td').each(function(i,val){
			var m = ''
			if (i==0){
				m = $(val).text()
			} else if(i==2) {
				bud[UrlValue('j',$(val).find('a').attr('href'))] = m;
			}
		})
	},false)
	SaveData();
}
function GetAllReitRep(){
	$('td.back4 table table tr:gt(0)').each(function(){
		$(this).find('td').each(function(i,val){
			var m = ''
			if (i==0){
				m = $(val).text()
			} else if(i==2) {
				bud[UrlValue('j',$(val).find('a').attr('href'))] = m;
			}
		})
	},false)
}

var teams = []
var bud = []
var rep = []

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
			if (i > 0){
				var data2 = data[i].split(':')
				var id = data2[0]
				var team = []
				team.id = id
				if(data2[1]) team.bud = data2[1]
				if(data2[2]) team.rep = data2[2]
				teams[id] = team
			}
		}

//		if(reitbud) $('td.back4').prepend('reitbud:'+ reitbud[0] + ',' + reitbud[1] + '...')
//		if(reitrep) $('td.back4').prepend('reitrep:'+ reitrep[0] + ',' + reitrep[1] + '...')
	}

//	$('td.back4').prepend(id + ':')
//	for(j in data2) $('td.back4').prepend(data2[j] + ',')
//	$('td.back4').prepend('<br>')

	// page contry reit
	if (UrlValue('j')){
		// print buttun remeber tems list
		var htmltext = '<div align=right><a href="javascript:void(GetTeamsId())">запомнить список команд</a>&nbsp;</div>'
		$('td.back4').prepend(htmltext)

		//

	// page full reit		
	} else if(UrlValue('n') == 2){
		GetAllReitBud()
		for (i in teams){
			team[i]['bud'] = bud[i]
		}
	} else if(UrlValue('n') == 1){
		GetAllReitRep()
		for (i in teams){
			team[i]['rep'] = rep[i]
		}
	}


}, false);