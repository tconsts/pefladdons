// ==UserScript==
// @name           peflreitschool
// @namespace      pefl
// @description    school reit page modification
// @include        http://*pefl.*/plug.php?p=rating&t=s&n=*
// @version	       2.0
// ==/UserScript==


deb = (localStorage.debug == '1' ? true : false)
var debnum = 0

function debug(text) {
	if(deb) {
		if(debnum==0) $('body').prepend('<div id=debug></div>')
		debnum++;
		$('div#debug').append(debnum+'&nbsp;\''+text+'\'<br>');
	}
}

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
	var x = reputations[val1]['up'].split(',')
	var minr = ''
	var maxr = 0
	var mini = ''
	var maxi = ''
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
	var raz = minr - maxr

	if (maxr==-1) {
		res2 = reputations[mini]['name'] + ' (99%)'
	} else if (mini == maxi) { 
		res2 = reputations[maxi]['name'] + ' (99%)'
	} else if (val2 > minr) {                  
		res2 = reputations[maxi]['name'] + ' (99%)'
	} else if (maxr == 0) {
		res2 = reputations[mini]['name'] + ' (99%)'
	} else {
		res1 = reputations[mini]['name'] + ' (' + (100 - (minr - val2)/raz*100).toFixed(0) + '%)'
		res2 = reputations[maxi]['name'] + ' (' + (100 - (val2 - maxr)/raz*100).toFixed(0) + '%)'
	}
	return res2 + '<br>' + res1
}

function Forecast(){
	debug('Forecast()')
	htmltext = '<th width=20%>Прогноз от КрабVIP (<a href="/page.php?id=4442">*</a>)</th>'
	$('td.back4 table table tr:eq(0)').prepend(htmltext)
	$('td.back4 table table tr:gt(0)').each(function(k,val2){
		var id = UrlValue('j',$(val2).find('a:last').attr('href'))
		htmltext = '<td>' + GetRepForecast(GetRepLevel(teams[id]['rep']),teams[id]['bud']) + '</td>'
		$(val2).prepend(htmltext)
	},false)
	$('#forecast').hide()
}

function MarkMyTeam(myteamid){
	debug('MarkMyTeam('+myteamid+')')
	if(myteamid==undefined) return true
	$('td.back4 table table tr').each(function(){
		if(parseInt(UrlValue('j',$(this).find('td:eq(2) a').attr('href')))==myteamid) {
			var newline = '<tr bgcolor=#D3D7CF>'+$(this).attr('bgcolor','#D3D7CF').html()+'</tr><tr><td colspan=3><hr></td></tr>'
			$('td.back4 table table').prepend(newline)
		}
	})
}

var lv = {0:-3,1:-2,2:-1,3:0,4:1,5:2,6:3}

// for 10 season
var reputations = {
	0	: {name: 'Unknown',  st: 0,    fn: 0,		up:'0,0,0,0,0,0,0'},
	1	: {name: 'ОЛМ',      st: 1,    fn: 8,		up:'0,0,100,20,-1,-1,-1'},
	2	: {name: 'Мир 1/2',  st: 9,    fn: 22,		up:'365,175,51,31,8,-1,-1'},
	3	: {name: 'Мир 2/2',  st: 23,   fn: 40,		up:'283,138,76,37,14,1,-1'},
	4	: {name: 'Отл 1/2',  st: 41,   fn: 64,		up:'268,179,128,69,28,1,-1'},
	5	: {name: 'Отл 2/2',  st: 65,   fn: 91,		up:'583,220,170,107,55,7,1'},
	6	: {name: 'Хор 1/4',  st: 92,   fn: 119,		up:'484,327,181,124,70,20,1'},
	7	: {name: 'Хор 2/4',  st: 120,  fn: 163,		up:'589,396,289,162,100,52,1'},
	8	: {name: 'Хор 3/4',  st: 164,  fn: 223,		up:'646,462,358,232,115,56,23'},
	9	: {name: 'Хор 4/4',  st: 224,  fn: 286,		up:'789,554,428,293,171,81,1'},
	10	: {name: 'Срд 1/3',  st: 287,  fn: 355,		up:'1177,711,507,352,232,114,34'},
	11	: {name: 'Срд 2/3',  st: 356,  fn: 422,		up:'1139,880,653,444,284,168,103'},
	12	: {name: 'Срд 3/3',  st: 423,  fn: 523,		up:'1294,960,772,552,341,192,115'},
	13	: {name: 'Слб 1/3',  st: 524,  fn: 632,		up:'1651,1138,885,663,435,281,192'},
	14	: {name: 'Слб 2/3',  st: 633,  fn: 742,		up:'1801,1430,1071,803,551,320,237'},
	15	: {name: 'Слб 3/3',  st: 743,  fn: 952,		up:'2021,1659,1325,923,618,418,268'},
	16	: {name: 'ОчСл 1/5', st: 953,  fn: 1150,	up:'2052,1774,1491,1125,733,426,245'},
	17	: {name: 'ОчСл 2/5', st: 1151, fn: 1350,	up:'0,1954,1640,1250,912,578,265'},
	18	: {name: 'ОчСл 3/5', st: 1351, fn: 1600,	up:'0,2095,1832,1395,1008,666,410'},
	19	: {name: 'ОчСл 4/5', st: 1601, fn: 1900,	up:'0,0,1975,1572,1080,734,426'},
	20	: {name: 'ОчСл 5/5', st: 1901, fn: 2284,	up:'0,0,0,1966,1367,848,601'},
	21	: {name: 'Unknown',  st: 2285, fn: 5000,	up:'0,0,0,0,0,0,0'},
}

var teams = []

var TableToForum = {
	
	buttonSelector: '',
	codeWrapperSelector: '',
	tableSelector: '',
	
	init: function(params) {
		this.buttonSelector = params.buttonSelector;
		this.codeWrapperSelector = params.codeWrapperSelector;
		this.tableSelector = params.tableSelector;
		
		$(this.buttonSelector).click(TableToForum.generateCode);
	},
	
	generateCode: function() {
		var html = '<textarea cols="50" rows="30">';
		html += '[table]';
		html += TableToForum.htmlToForum( $(TableToForum.tableSelector).html() );
		html += '[/table]</textarea>';
		
		$(TableToForum.codeWrapperSelector).html(html);
	},
	
	htmlToForum: function(html) {
		var txt = '';
		txt = html.replace(/\</g, '[');
		txt = txt.replace(/\>/g, ']');
		
		// remove [tbody] & [/tbody]
		txt = txt.replace(/\[\/?tbody\]/ig, '');
		
		// change width="\"15%\"" to width=15%, and height="\"15%\"" to height=15%
		txt = txt.replace(/ (width|height)\=\"\\\"(\d+)\%\\\"\"/ig, function(match, attrName, percentage) {
			return ' ' + attrName + '=' + percentage + '%';
		});
		
		// change [a href="url"]anchor[/a] to [url=url]anchor[/url]
		txt = txt.replace(/\[a href\=\"([^\]]*)\"\]([^\[]*)\[\/a\]/ig, function(match, link, anchorText) {
			return '[url='+ link + ']' + anchorText + '[/url]';
		});
		
		// change [img src="url"] to [img]url[/img]
		txt = txt.replace(/\[img\ src\=\"([^\]]*)\"]/ig, function(match, link) {
			return '[img]' + link + '[/img]';
		});
		
		// change bgcolor="#777777" to bgcolor=#777777
		txt = txt.replace(/bgcolor\=\"([^\"]+)\"/ig, function(match, bgcolor) {
			if (bgcolor == "#a3de8f") {
				bgcolor = "#C9F8B7";
			}
			var str = 'bgcolor='+bgcolor;			
		});
		
		// change [th] to [td][b] & [/th] to [/b][/td]
		txt = txt.replace(/\[th([^\]]*)\]/ig, function(match, inner) {
			return '[td'+ inner + '][b]';
		});
		txt = txt.replace(/\[\/th\]/ig, function(match) {
			return '[/b][/td]';
		});
		
		return txt;
	}
	
}


$().ready(function() {
	var myteamid = localStorage.myteamid
	debug('myteamid:'+myteamid)
/**/
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
		debug('Country budget page')
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
		debug('Budget page')
		GetAllReit('bud');
		MarkMyTeam(myteamid)
	} else if(!UrlValue('j') && UrlValue('n') == 1){
		debug('Reputation page')
		GetAllReit('rep');
		repid = 1
		$('td.back4 table table tr').each(function(i, val){
			if(i>reputations[repid].fn) repid++
			if(i==reputations[repid].st) $(val).attr('bgcolor','white')
			$(val).find('td:eq(0)').append(' '+reputations[repid].name)
		})
//		for(i in reputations) $('td.back4 table table tr:gt(0):eq('+(reputations[i].st-1)+')').attr('bgcolor','white').find('td:first').append(' '+reputations[i].name)
		MarkMyTeam(myteamid)
	}
	
	$('td.back4').append('<input type="button" class="code-to-forum" value="Код для форума" /><div class="code2forum"></div>');
	TableToForum.init({buttonSelector: '.code-to-forum', codeWrapperSelector: '.code2forum', tableSelector: 'td.back4 table table'});
/**/
}, false);