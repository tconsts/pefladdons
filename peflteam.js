// ==UserScript==
// @name           peflteam
// @namespace      pefl
// @description    team page modification
// @include        http://*pefl.*/*&t=k&j=*
// @version        2.0
// ==/UserScript==

deb = (localStorage.debug == '1' ? true : false)
var debnum = 0

var type 	= 'num'
var players = []
var players2= []
var matches	= []
var teams 	= []
var plsu	= []
var sumax 	= 3600
var team_cur = {}
var m = []
var remember = 0
var sumvaluechange = 0
var save = false
var db = false
var list = {
	'players':	'id,tid,num,form,morale,fchange,mchange,value,valuech,name,goals,passes,ims,rate',
	'teams':	'tid,my,did,num,tdate,tplace,ncode,nname,tname,mname,ttask,tvalue,twage,tss,age,pnum,tfin,screit,scbud,ttown,sname,ssize,mid,tform,tmorale',
	'matchespl':'id,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15,n16,n17,n18'
}

var rtasks = {
	'Чемпионство':1,
	'Выйти в высший Д.':2,
	'Медали':3,
	'Зона Судамерикана':4,
	'Зона УЕФА':5,
	'Попасть в 3А':6,
	'Попасть в пятерку':7,
	'Попасть в десятку':8,
	'15 место':9,
	'Не вылететь':10}

var rschools= {
	'очень слабая':1,
	'слабая':2,
	'средняя':3,
	'хорошая':4,
	'отличная':5,
	'мирового уровня':6,
	'одна из лучших в мире':7}

var sumP = 0
var sumH = false
var MyNick = ''

var countSostav = 0
var countSk = [0]
var nom = true
var zp  = true
var sk  = true
var age = true
var pos1 = {'C' :0}
var pos2 = {'GK':0}
var skills = {
	'N': 'pn', 'Имя':'name', 'Поз':'position', 'Фор':'form', 'Мор':'morale', 'сс':'sumskills', 'Сум':'sorting',
	'угл':'Угловые', 'нав':'Навесы', 'дрб':'Дриблинг', 'удр':'Удары', 'штр':'Штрафные', 'рук':'Игра руками',
	'глв':'Игра головой', 'вых':'Игра на выходах', 'лид':'Лидерство', 'длу':'Дальние удары', 'псо':'Перс. опека',
	'ско':'Скорость', 'пас':'Игра в пас', 'впз':'Выбор позиции', 'реа':'Реакция', 'вын':'Выносливость', 'мощ':'Мощь',
	'отб':'Отбор мяча', 'вид':'Видение поля', 'рбт':'Работоспособность', 'тех':'Техника'}

$().ready(function() {

	ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
	cid = parseInt($('td.back4 table:first table td:first').text())
	teams[cid] = {'tid':cid}
	var srch='Вы вошли как '
	MyNick = $('td.back3 td:contains('+srch+')').html().split(',',1)[0].replace(srch,'')

	today = new Date()
	today = check(today.getDate()) + '.'+check(today.getMonth()+1)

	if(UrlValue('l')=='y'){
		//Page for show skills
		$('table#tblRostSkillsFilter td:first').prepend('<a href="javascript:void(ShowSkillsY())">Стрелки</a> | ')
		$('table#tblRostSkills tr:eq(0) td').each(function(){
			if(!ff){
				var onclick = (ff ? String($(this).find('a').attr('onclick')) : String($(this).find('a').attr('onclick')).split('{')[1].split('}')[0])
				var name = $(this).find('a').html()
				$(this).html('<a href="#" class="sort" onclick="'+onclick+';EditSkillsPage()">'+name+'</a>')
			}
		})
		EditSkillsPage()
	}else if(UrlValue('n')!=false){
		//Ростер с фильтром(не вся стата показывается)
	}else{
		//Ростер команды
		// Draw right panel and fill data
		var preparedhtml = ''
		preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr><td id="crabgloballeft" width=200 valign=top></td><td id="crabglobalcenter" valign=top></td><td id="crabglobalright" width=200 valign=top>'
		preparedhtml += '<table id="crabrighttable" bgcolor="#C9F8B7" width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
		preparedhtml += '</td></tr></table>'
		$('body table.border:last').before(preparedhtml)

		$('td.back4 script').remove()
		$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
		$('#crabrighttable').addClass('border') 

		preparedhtml  =	'<table width=100% id="rg"><tr><th colspan=3>Финансовое положение</th></tr>'
		preparedhtml += '<tr><td id="finance1"></td><td id="finance2" colspan=2></td></tr>'
		preparedhtml += '</table><br>'
		$("#crabright").html(preparedhtml)

		// add tables
		var filter = '<div id="divRostSkillsFilter" style="display: none;"><a href="javascript:void(ShowSkills(2))">Стрелки</a> | <a href="javascript:void(ShowFilter())">Фильтр >></a></div>'
		filter += '<table id="tblRostSkillsFilter" width=50% align=left cellspacing=1 cellpadding=1 bgcolor="#c9f8b7" border=0 style="display: none;">'
		filter += '<tr align=center><th width=10%></th><th id="R" width=15%><a href="javascript:void(Filter(1,\'R\'))">R</a></th><th width=15%></th><th id="C" width=15%><a href="javascript:void(Filter(1,\'C\'))">C</a></th><th width=15%></th><th id="L" width=15%><a href="javascript:void(Filter(1,\'L\'))">L</a></th></tr>'
		filter += '<tr align=center><th id="GK"><a href="javascript:void(Filter(2,\'GK\'))">GK</a></th><th></th><th></th>	<td bgcolor=a3de8f id="GK">&nbsp;</td>		<th></th>	<th></th></tr>'
		filter += '<tr align=center><th id="SW"><a href="javascript:void(Filter(2,\'SW\'))">SW</a></th><th></th><th></th>	<td bgcolor=a3de8f id="C SW">&nbsp;</td>	<th></th>	<th></th></tr>'
		filter += '<tr align=center><th id="DF"><a href="javascript:void(Filter(2,\'DF\'))">DF</a></th><td bgcolor=a3de8f id="R DF">&nbsp;</td>	<td bgcolor=a3de8f id="C DF">&nbsp;</td>	<td bgcolor=a3de8f id="C DF">&nbsp;</td>	<td bgcolor=a3de8f id="C DF">&nbsp;</td>	<td bgcolor=a3de8f id="L DF">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="DM"><a href="javascript:void(Filter(2,\'DM\'))">DM</a></th><td bgcolor=a3de8f id="R DM">&nbsp;</td>	<td bgcolor=a3de8f id="C DM">&nbsp;</td>	<td bgcolor=a3de8f id="C DM">&nbsp;</td>	<td bgcolor=a3de8f id="C DM">&nbsp;</td>	<td bgcolor=a3de8f id="L DM">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="MF"><a href="javascript:void(Filter(2,\'MF\'))">MF</a></th><td bgcolor=a3de8f id="R MF">&nbsp;</td>	<td bgcolor=a3de8f id="C MF">&nbsp;</td>	<td bgcolor=a3de8f id="C MF">&nbsp;</td>	<td bgcolor=a3de8f id="C MF">&nbsp;</td>	<td bgcolor=a3de8f id="L MF">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="AM"><a href="javascript:void(Filter(2,\'AM\'))">AM</a></th><td bgcolor=a3de8f id="R AM">&nbsp;</td>	<td bgcolor=a3de8f id="C AM">&nbsp;</td>	<td bgcolor=a3de8f id="C AM">&nbsp;</td>	<td bgcolor=a3de8f id="C AM">&nbsp;</td>	<td bgcolor=a3de8f id="L AM">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="FW"><a href="javascript:void(Filter(2,\'FW\'))">FW</a></th><th></td><td bgcolor=a3de8f id="C FW">&nbsp;</td>	<td bgcolor=a3de8f id="C FW">&nbsp;</td>	<td bgcolor=a3de8f id="C FW">&nbsp;</td>	<th></th></tr>'
		filter += '</table>'
		filter += '<table id="SumPl" width=50% align=right style="display: none;">'
		filter += '<tr id="sumhead"><th colspan=4 align=center id="sumhead">Суммарный игрок</th></tr>'
		filter += '<tr id="sumlast1"><td colspan=4 align=right id="sumlast1"><a href="javascript:void(ShowSumPlayer(0))">целые</a>, <a href="javascript:void(ShowSumPlayer(1))">десятые</a>, <a href="javascript:void(ShowSumPlayer(2))">сотые</a></td></tr>'
		//filter += '<tr id="sumlast2"><td colspan=4 align=right id="sumlast2"><a href="javascript:void(ShowHols())">провалы</a></td></tr>'
		filter += '</table>'
		filter += '<div id="filter" style="display:none;">&nbsp;</div>'
		$('table#tblRosterFilter').after(filter)

		preparedhtml  = '<table id="tblRostSkills" width=866 bgcolor=BFDEB3 style="display: none;">'
		preparedhtml += '</table>'
		preparedhtml += '<div id="divRostSkills" style="display: none;">'
		preparedhtml += '<br>* - <i>нажать на значение <b>Сум</b> чтобы отключить или включить показ скиллов определенного игрока</i>'
		preparedhtml += '<br>* - <i>нажимать на заголовки столбцов чтоб сортировать по сумме выделенных скиллов</i></div><br>'

		$('table#tblRoster').after(preparedhtml)

		EditFinance();

		GetData('teams')
		GetData('players')
//		GetData('divs')
		countSostavMax  = $('tr[id^=tblRosterTr]').length
		countRentMax 	= $('tr[id^=tblRosterRentTr]').length
		GetInfoPagePl()
		GetInfoPageTm()

		if(deb){
			preparedhtml  = '<br><br><a id="players" href="javascript:void(Print(\'players\'))">debug:Игроки</a><br>'
			preparedhtml += '<a id="teams" href="javascript:void(Print(\'teams\'))">debug:Команды</a><br>'
			$("#rg").after(preparedhtml)
		}
		if(cid==parseInt(localStorage.myteamid)) GetData('matchespl')
	}
}, false);

function ShowSU() {
	debug('ShowSU()')
	$('div#divRostSkillsFilter').hide()
	$('table#tblRostSkillsFilter').hide()
	$('table#SumPl').hide()
	$('table#tblRostSkills').hide()
	$('div#divRostSkills').hide()
	$('div#filter').hide()

	$('table#tblRosterFilter').hide()
	$('table#tblRoster').hide()

	debug('x:'+$('table#tblSu').length)
	if($('table#tblSu').length>0) {
		$('table#tblSu').show()
		$('div#divSu').show()
	}else{
		for(i in matches){
			for (j in matches[i]){
				var field = String(matches[i][j]).split(':')
				if(field[1] != undefined) {
					if(plsu[field[0]]==undefined){
						plsu[field[0]] = {'name':field[0], 'minute':parseInt(field[1]),'matches':1}
					}else{
						plsu[field[0]].minute	+= parseInt(field[1])
						plsu[field[0]].matches	+= 1
					}
				}
			}
		}

		var preparedhtml = '<table id="tblSu" bgcolor=BFDEB3 width=100%>'
		preparedhtml += '<tr align=left><th>N</th><th>Имя</th><th>Минут</th><th>Матчей</th><th>Осталось</th></tr>'
		var pls = plsu.sort(sSu)
		var num = 1
		for(i in pls) {
			var ost = sumax - pls[i].minute
			preparedhtml += '<tr><td>'+num+'</td><td><b>'+i+'</b></td><td>'+pls[i].minute+'</td><td>'+pls[i].matches+'</td><td>'+ost+'('+(ost/93).toFixed(1)+')</td></tr>'
			num++
		}
		preparedhtml += '</table>'
		preparedhtml += '<br><br><div id="divSu">'
		preparedhtml += '<br>1. матчи за сборные не учитываются'
		preparedhtml += '<br>2. матчи за предыдущие клубы не учитываются'
		preparedhtml += '<br>3. минуты в матчах с получением травм и удалений считаются некорректно'
		preparedhtml += '<br>4. товы с установкой "набирать кондиции" временно считаются в зачет СУ'
		preparedhtml += '<br>5. с однофамильцами мугут быт проблемы'
		preparedhtml += '<br>6. игроки покинувшие клуб пока не удалены из списка'
		preparedhtml += '</div>'
		$('table#tblRoster').after(preparedhtml)
		$('table#tblSu tr:even').attr('bgcolor','a3de8f')
		$('table#tblSu tr:odd').attr('bgcolor','C9F8B7')
	}
}

function TrimString(sInString){
	sInString = sInString.replace(/\&nbsp\;/g,' ');
	return sInString.replace(/(^\s+)|(\s+$)/g, '');
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}

function GetFinish(type, res){
	debug(type + ' ' + res + ' ')
	m[type] = res;

	if(m.trash==undefined && m.pg_teams && m.pg_players){
		m.trash = true
		CheckTrash()
	}
	if(m.savedatatm==undefined && m.get_teams!=undefined && m.pg_teams && m.pg_players && m.trash){
		m.savedatatm = true
		CheckMy()
		ModifyTeams()
	}
	if(m.savedatapl==undefined && m.get_players==false && m.pg_players && m.trash){
		m.savedatapl = true
		PrintRightInfo()
		SaveData('players')
	}
	if(m.savedatapl==undefined && m.get_players && m.pg_players && m.trash){
		m.savedatapl = true
		ModifyPlayers()// and Save if need
		PrintRightInfo()
	}
}

function CheckTrash(){
	debug('CheckTrash go')

	//count top11
	var pls = players.sort(sSkills)
	var num = 0
	var ss = 0
	for(i in players){
		if(num<11) ss += players[i].sumskills
		num++
	}
	ss = (ss/11)*0.8
	debug('ss:'+ss)
	var tss  = 0
	var age  = 0
	var tform = 0
	var tmorale = 0
	var pnum = 0
	for(i in players){
		var pli = players[i]
		if(pli.sumskills<ss){
			pli.trash = true
		}else{
			tss += pli.sumskills
			age += pli.age
			tform += pli.form
			tmorale += pli.morale
			pnum++
		}
		team_cur.pnum = pnum
		team_cur.tss = (isNaN(tss) ? 0 : (tss/pnum).toFixed(2))
		team_cur.age = (age/pnum).toFixed(2)
		team_cur.tform = (tform/pnum).toFixed(2)
		team_cur.tmorale = (tmorale/pnum).toFixed(2)
	}
	GetFinish('trash', true)
}

function CheckMy(){
	debug('CheckMy go')
	if(team_cur.my){
		save = true
		debug('teams:Need Save(cur)')
	}else{
		for(i in teams){
			if(teams[i].my && teams[i].nname == team_cur.nname) {
				save = true
				debug('teams:Need Save(list):'+team_cur.nname)
			}
		}
	}
}

function ModifyTeams(){
	debug('teams:Modify')
	if(!save && typeof(teams[team_cur.tid].tname)!='undefined') {
		save = true
		debug('teams:Need Save(have)')
	}
	var tmt = {}
	for(var i in team_cur){
		tmt[i] = (team_cur[i] != '' ? team_cur[i] : (typeof(teams[cid][i])!='undefined' ? teams[cid][i] : ''))
	}
	teams[cid] = tmt
//	debug('tname:'+teams[cid]['tname']+'='+team_cur['tname'])
//	if(teams[cid].tplace>0) $('table.layer1 td.l2:eq(5)').append((' ('+teams[cid].tplace+')').fontsize(1))
//	for(var i in teams) debug('m2:'+i+':'+teams[i].tid + ':' + teams[i].tname)
	SaveData('teams')
}

function GetInfoPageTm(){
	debug('teams:GetInfoPage ok')
	// Get current club data
	var task_name   = $('table.layer1 td.l4:eq(3)').text().split(': ',2)[1]
	var screit_name = $('table.layer1 td.l2:eq(1)').text().split(': ',2)[1].split(' (')[0]

	team_cur.tid	= cid
	team_cur.tdate	= today
	team_cur.tname	= $('td.back4 table table:first td:last').text().split(' (')[0]
	team_cur.ttown	= $('td.back4 table table:first td:last').text().split('(')[1].split(',')[0]
	team_cur.ttask	= (rtasks[task_name]!=undefined ? rtasks[task_name] : task_name)
	team_cur.twage	= 0
	team_cur.tvalue	= 0
	team_cur.tss	= 0
	team_cur.age	= 0
	team_cur.tplace	= ''
	team_cur.sname	= $('table.layer1 td.l4:eq(0)').text().split(': ',2)[1]
	team_cur.ssize	= parseInt($('table.layer1 td.l4:eq(2)').text().split(': ',2)[1])
	team_cur.ncode	= parseInt(UrlValue('j',$('td.back4 table:first table td:eq(1) a').attr('href')))
	team_cur.nname	= $('td.back4 table:first table td:eq(3) font').text().split(', ')[1].split(')')[0]
	team_cur.did	= ''
	team_cur.mid	= UrlValue('id',$('td.back4 table table:eq(1) table:first td:first a').attr('href'))
	team_cur.mname	= $('td.back4 table table:eq(1) table:first td:first span').text()
	team_cur.mid	= parseInt(UrlValue('id',$('td.back4 table table:eq(1) table:first td:first a').attr('href')))
	team_cur.pnum	= 0
	team_cur.scbud	= parseInt($('table.layer1 td.l2:eq(1)').text().split('(',2)[1].split(')')[0])
	team_cur.screit	= (rschools[screit_name]!=undefined ? rschools[screit_name] : screit_name)
	team_cur.my		= (team_cur.mname == MyNick ? true : false)
	team_cur.tform	= 0
	team_cur.tmorale= 0

	// Save my team id for script "match"
	if(team_cur.my) {
		localStorage.myteamid = cid
		localStorage.mycountry = team_cur.ncode+'.'+team_cur.nname
		var pic = ($('table.layer1 td[rowspan=3] img:first').attr('src')).split('/')[3].split('.')[0]
		if(cid+'a'!=pic) localStorage.myteampic = pic
		else delete localStorage.myteampic
	}

	GetFinish('pg_teams', true)
}

function Print(dataname){
	var head = list[dataname].split(',')
	var data = []
	switch (dataname){
		case 'players': data = players;	break
		case 'teams': 	data = teams;	break
//		case 'divs'	: 	data = divs;	break
		default: return false
	}
	var text = '<table width=100% border=1>'
	text+= '<tr>'
	for(j in head) text += '<th>'+head[j]+'</th>'
	text+= '</tr>'
	for(i in data){
		text += '<tr>'
		for(j in head) text += '<td>' + (data[i][head[j]]!=undefined ? data[i][head[j]] : '_')  + '</td>'
		text += '</tr>'
	}
	text += '</table>'
	$('td.back4').prepend(text)
}

function SaveData(dataname){
	debug(dataname+':SaveData')
	if(!save || UrlValue('h')==1 || (dataname=='players' && UrlValue('j')!=99999)){
		debug(dataname+':SaveData false')
		return false
	}

	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'players':	data = players;	break
		case 'teams': 	data = teams;	break
//		case 'divs'	: 	data = divs;	break
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
		case 'matchespl':data = matches;	break
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

function GetInfoPagePl(){
	$('tr[id^=tblRosterTr]').each(function(i,val){
		var eurl= $(val).find('a[trp="1"]').attr('href')
		var pid = UrlValue('j',$(val).find('td:eq(1) a').attr('href'))
		var pn	= parseInt($(val).find('td:first').text())
		players[pid] = {}
		players[pid].pn 	= pn
		players[pid].id 	= pid
		players[pid].tid 	= cid
		players[pid].num 	= i
		players[pid].hash	= UrlValue('z',$(val).find('td:eq(1) a:first').attr('href'))
		players[pid].name	= TrimString($(val).find('td:eq(1) a').html()
								.split('<img')[0]
								.replace('(*)','')
								.replace('<i>','')
								.replace('</i>',''))
		players[pid].d		= ($(val).find('td:eq(1) img[src*=system/img/g/d.png]').html()==null ? 0 : $(val).find('td:eq(1) img[src*=system/img/g/d.png]').attr('src'))
		players[pid].t		= ($(val).find('td:eq(1) img[src*=system/img/g/t]').html()==null ? 0 : $(val).find('td:eq(1) img[src*=system/img/g/t]').attr('src'))
		players[pid].nid	= $(val).find('td:eq(2) img').attr('src')
								.split('/')[4]
								.split('.')[0]
		players[pid].age	= parseInt($(val).find('td:eq(3)').html())
		players[pid].morale	= parseInt($(val).find('td:eq(4)').html())
		players[pid].mchange= 0
		players[pid].form	= parseInt($(val).find('td:eq(5)').html())
		players[pid].fchange= 0
		players[pid].games	= parseInt($(val).find('td:eq(6)').html())
		players[pid].goals	= parseInt($(val).find('td:eq(7)').html())
		players[pid].passes	= parseInt($(val).find('td:eq(8)').html())
		players[pid].ims	= parseInt($(val).find('td:eq(9)').html())
		players[pid].rate	= parseInt($(val).find('td:eq(10)').html())
		players[pid].position= $(val).find('td:eq(11)').html()
		players[pid].value 	= 0
		players[pid].valuech= 0

		if(eurl==undefined || UrlValue('h')==1){
			Ready()
		}else{
			$('td.back4').append('<table id=pl'+pid+' style="display: none;"><tr><td id=pl'+pid+'></td></tr></table>')
			$('td#pl'+pid).load(eurl+' center:first', function(){GetPl(pid);})
		}
	})
	debug('players:GetPage ok')
}

function ModifyPlayers(){
	debug('players:Modify go')

	// Check for update
	for(i in players) {
		var pl = players[i]
		if(typeof(players2[pl.id])!='undefined'){
			var pl2 = players2[pl.id]
			if (remember != 1 && (pl.morale != pl2.morale || pl.form != pl2.form || (pl.value!=0 && pl.value != pl2.value))){
				remember = 1
				debug('players:NeedSave '+pl.id+':'+pl.morale +'/'+pl2.morale+':'+pl.form+'/'+pl2.form+':'+pl.value+'/'+pl2.value)
				break;
			}
		}
	}
	// Calculate
	for(i in players) {
		var pl = players[i]
		if(typeof(players2[pl.id])!='undefined'){
			var pl2 = players2[pl.id]
			//debug(pl.id+':'+pl.goals+'='+pl2.goals)
			if (remember == 1){
				players[i].mchange = pl.morale - pl2.morale
				players[i].fchange = pl.form   - pl2.form
				if(pl.value!=0) {
					players[i].valuech = pl.value   - pl2.value
				}else {
					if(pl2.value>0) players[i].value = pl2.value
				}
			} else {
				players[i]['mchange'] = pl2.mchange
				players[i]['fchange'] = pl2.fchange
				players[i]['valuech'] = pl2.valuech
			}
			//debug('plCalc '+pl.id+':'+pl.form+'/'+pl.fchange)
		}
	}
	// Update page
	debug('players:UpdatePage ')

	for(i in players) {
		var pl = players[i]
		$('table#tblRoster tr#tblRosterTr'		+ pl.pn + ' td:eq(4)').append(ShowChange(pl.mchange))
		$('table#tblRoster tr#tblRosterRentTr'	+ pl.pn + ' td:eq(4)').append(ShowChange(pl.mchange))
		if(typeof(players2[pl.id])!='undefined'){
			var pl2 = players2[pl.id]
			$('table#tblRoster tr#tblRosterTr'		+ pl.pn + ' td:eq(7)').append(ShowChange(pl.goals-pl2.goals, true))
			$('table#tblRoster tr#tblRosterTr'		+ pl.pn + ' td:eq(8)').append(ShowChange(pl.passes-pl2.passes, true))
			$('table#tblRoster tr#tblRosterTr'		+ pl.pn + ' td:eq(9)').append(ShowChange(pl.ims-pl2.ims, true))
		}
		sumvaluechange += pl.valuech/1000
	}
	debug('nomch:'+sumvaluechange)
	// Save if not team21
	if (remember==1) SaveData('players')
}

function GetPl(pid){
	// get player skills with number pid
	var skillsum = 0
	var skillchange = []
	$('td#pl'+pid+' table:first td:even').each(function(){
		var skillarrow = ''
		var skillname = $(this).html();
		var skillvalue = parseInt($(this).next().html().replace('<b>',''));
		if ($(this).next().find('img').attr('src') != undefined){
			skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
		}
		skillsum += skillvalue;
		players[pid][skillname] = skillvalue + skillarrow

		if($(this).next().html().indexOf('*') != -1) skillchange.push(skillname)
	})
	players[pid].sumskills	= skillsum
	players[pid].sorting	= skillsum
	players[pid].skchange	= (skillchange[0] != undefined ? skillchange.join(',') : '')

	// get player header info
	$('td#pl'+pid+' table').remove()
	var head = $('td#pl'+pid+' b:first').html()
	players[pid].rent		= (head.indexOf('в аренде из клуба') != -1 ? true : false)
	players[pid].natfull 	= head.split(' (матчей')[0].split(', ')[1]
	players[pid].value		= parseInt(head.split('Номинал: ')[1].split(',000$')[0].replace(/,/g,''))*1000
	players[pid].valuech	= 0
	players[pid].contract 	= parseInt(head.split('Контракт: ')[1])
	players[pid].wage 		= parseInt(head.split('г., ')[1].split('$')[0].replace(/,/g,''))

	team_cur.twage	+= players[pid].wage
	team_cur.tvalue	+= players[pid].value/1000
	$('table#pl'+pid).remove()

	Ready()
}
function PrintRightInfo(){
	debug('PrintRightInfo go')
	if(UrlValue('h')==1) return false

	// print link to skills page
	var text = '<a href="javascript:void(ShowRoster())"><b>Ростер команды</b></a><br>'
	text += (team_cur.tss!=0 ? '<a href="javascript:void(ShowSkills(1))"><b>Скиллы игроков</b></a>' : '<b><a>Скиллы игроков</a> <font color=BABDB6>(для VIP)</font></b>')
	text += (team_cur.my ? '<br><a href="javascript:void(ShowSU())"><b>Сверхусталость</b></a>(debug)' : '')
	$('#crabright').append('<br>'+text+'<br><br>')

	// print to right menu
	var thtml = ''
	thtml += '<tr><td id="os" colspan=3 align=center><br><b>Основной состав</b>'
//	if(sumvaluechange != 0) 
//	thtml += '&nbsp;<a id="os" href="javascript:void(ForgotPlValueCh())">'+('[x]').fontsize(1)+'<a>'
	thtml += '</td></tr>'
	thtml += '<tr id="osnom"><th align=left width=50%><a'
	thtml += (team_cur.tvalue!=0 ? ' href="javascript:void(ShowPlayersValue())"' : '')
	thtml += '>номиналы</a>:</th><th align=right>'
	thtml += (team_cur.tvalue!=0 ? ShowValueFormat(team_cur.tvalue)+'т' : '<font color=BABDB6>для VIP</font>')
	thtml += '</th><td width=10% id="nomch">&nbsp;'
	if(sumvaluechange != 0) thtml += '&nbsp;'+ShowChange(sumvaluechange)
	thtml += '</td></tr>'

	thtml += '<tr id="oszp"><th align=left><a'
	thtml += (team_cur.twage!=0 ? ' href="javascript:void(ShowPlayersZp())"' : '')
	thtml += '>зарплаты</a>:</th><th align=right>'
	thtml += (team_cur.twage!=0 ? ShowValueFormat(team_cur.twage)+'&nbsp;' : '<font color=BABDB6>для VIP</font>')
	thtml += '</th></tr>'

	thtml += '<tr id="osskills"><td><b><a'
	thtml += (team_cur.tss!=0 ? ' href="javascript:void(ShowPlayersSkillChange())"' : '')
	thtml += '>скиллы</a></b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td><th align=right>'
	thtml += (team_cur.tss!=0 ? team_cur.tss + '&nbsp;' :  '<font color=BABDB6>для VIP</font>')
	thtml += '</th><td></td></tr>'

	thtml += '<tr id="osage"><td><b><a href="javascript:void(ShowPlayersAge())">возраст</a></b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td><th align=right>'
	thtml += team_cur.age + '&nbsp;'
	thtml += '</th><td></td></tr>'

	thtml += '<tr id="osform"><td><b>форма</b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td><th align=right>'
	thtml += team_cur.tform + '&nbsp;'
	thtml += '</th><td></td></tr>'

	thtml += '<tr id="osmorale"><td><b>мораль</b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td><th align=right>'
	thtml += team_cur.tmorale + '&nbsp;'
	thtml += '</th><td></td></tr>'

	$('#crabright table:first').append(thtml)
}

function Ready(){
	countSostav++
	if(countSostav==countSostavMax){
		GetFinish('pg_players', true)
	}
}

function EditFinance(){
	debug('EditFinance go')
	var txt = $('table.layer1 td.l4:eq(1)').text().split(': ')[1]
	var txt2 = ''
	switch (txt){
		case 'банкрот': 				 txt2 += 'меньше 0';	break;
		case 'жалкое': 					 txt2 += '1$т-200$т';	break;
		case 'бедное': 					 txt2 += '200$т-500$т';	break;
		case 'среднее': 				 txt2 += '500$т-1$м';	break;
		case 'нормальное': 				 txt2 += '1$м-3$м';		break;
		case 'благополучное': 			 txt2 += '3$м-6$м';		break;
		case 'отличное': 				 txt2 += '6$м-15$м';	break;
		case 'богатое': 				 txt2 += '15$м-40$м';	break;
		case 'некуда деньги девать :-)': txt2 += 'больше 40$м';	break;
		default:
			var fin = parseInt(txt.replace(/,/g,'').replace('$',''))
			if 		(fin >  40000000)	{txt = 'некуда деньги девать';	txt2 = 'больше 40$м'}
			else if (fin >= 15000000)	{txt = 'богатое';				txt2 = '15$м-40$м'}
			else if (fin >=  6000000) 	{txt = 'отличное';				txt2 = '6$м-15$м'}
			else if (fin >=  3000000) 	{txt = 'благополучное';			txt2 = '3$м-6$м'}
			else if (fin >=  1000000) 	{txt = 'нормальное';			txt2 = '1$м-3$м'}
			else if (fin >=   500000) 	{txt = 'среднее';				txt2 = '500$т-1$м'}
			else if (fin >=   200000) 	{txt = 'бедное';				txt2 = '200$т-500$т'}
			else if (fin >=		   0)	{txt = 'жалкое';				txt2 = '1$т-200$т'}
			else if (fin < 		   0)	{txt = 'банкрот';				txt2 = 'меньше 0'}
	}
	$('#finance1').html(txt)
	$('#finance2').html(txt2)
	team_cur.tfin = txt2
}

function EditSkillsPage(){
	debug('EditSkillsPage')
	$('table#tblRostSkills')
		.attr('width','886')
		.find('td[bgcolor=white]').removeAttr('bgcolor').end()
		.find('td:contains("*")').attr('bgcolor','white').end()
		.find('img').attr('height','10').end()
		.find('tr').each(function(){
			$(this).attr('height','20').find('td:eq(1)').html(
				$(this).find('td:eq(1)').html().replace('<br>','&nbsp;')
			)
		})
} 

function ShowSkillsY() {
	switch (type){
		case 'num': 
			$('table#tblRostSkills img').attr('height','10').show();
			type = 'img'; break
		case 'img':
			$('table#tblRostSkills img').hide();
			type = 'num';break
		default:
			debug('Error ShowSkillsY: unknown type:<'+type+'>')
	}
	$('table#tblRostSkills tr').each(function(){
		$(this).find('td:eq(1)').html(
			$(this).find('td:eq(1)').html().replace('<br>','&nbsp;')
		)
	})
}

function ShowPlayersValue(){
	if(nom) {
		nom = false
		var nomtext = ''
		var pls = players.sort(sValue)
		for(i in pls) {
			var bgcolor = ''
			if(i<18) bgcolor = ' bgcolor=#A3DE8F'
			if(i<5)  bgcolor = ' bgcolor=white'
			var f1 = (pls[i].trash ? '<font color=#888A85>' : '')
			var f2 = (pls[i].trash ? '</font>' : '')
			nomtext += '<tr id="nom"'+bgcolor+'>'
			nomtext += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+'>' +f1+ ShowShortName(pls[i].name).fontsize(1) +f2+ '</td>'
			nomtext += '<td align=right>' + (ShowValueFormat(pls[i].value/1000) + 'т').fontsize(1) + '</td>'
			nomtext += (pls[i].valuech==0 ? '' : '<td>&nbsp;'+ShowChange(pls[i].valuech/1000)+'</td>')
			nomtext += '</tr>'
		}
		$('#osnom').after(nomtext + '<tr id="nom"><td>&nbsp;</td></tr>')
	} else {
		nom = true
		$('tr#nom').remove()
	}
}

function ShowPlayersZp(){
	if(zp){
		zp = false
		var text = ''
		var pls = players.sort(sZp)
		for(i in pls) {
			var bgcolor = ''
			var f1 = (pls[i].trash ? '<font color=#888A85>' : '')
			var f2 = (pls[i].trash ? '</font>' : '')
			if(pls[i].contract==1) bgcolor = ' bgcolor=#FF9966' //red
			if(pls[i].contract==2) bgcolor = ' bgcolor=#FCE93B' //yellow
			if(pls[i].contract==5) bgcolor = ' bgcolor=#A3DE8F' //green
			text += '<tr id="zp">'
			text += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+'>' +f1+ ShowShortName(pls[i].name).fontsize(1) +f2+ '</td>'
			text += '<td align=right>' + (ShowValueFormat(pls[i].wage) + '&nbsp;').fontsize(1) + '</td>'
			text += '<td'+bgcolor+'>' + (pls[i].contract + (pls[i].contract == 5 ? 'л.' : 'г.')).fontsize(1) + '</td>'
			text += '</tr>'
		}
		$('#oszp').after(text + '<tr id="zp"><td>&nbsp;</td></tr>')
	}else{
		zp = true
		$('tr#zp').remove()
	}
}

function ShowPlayersAge(){
	if(age) {
		age = false
		var text = ''
		var pls = players.sort(sAge)
		for(i in pls) {
			var f1 = (pls[i].trash ? '<font color=#888A85>' : '')
			var f2 = (pls[i].trash ? '</font>' : '')
			text += '<tr id="age"'+(pls[i].age<30 && pls[i].age>21 ? '' : ' bgcolor=#A3DE8F')+'>'
			text += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+'>' 
			text +=  f1 + ShowShortName(pls[i].name).fontsize(1) + f2
			text += '</td>'
			text += '<td align=right>'+f1 + (pls[i].age+'&nbsp;').fontsize(1) + f2+'</td>'
			text += '</tr>'
		}
		$('#osage').after(text + '<tr id="age"><td>&nbsp;</td></tr>')
	} else {
		age = true
		$('tr#age').remove()
	}
}

function ShowPlayersSkillChange(){
	if(sk) {
		sk = false
		var text = ''
		var pls = players.sort(sSkills)
		for(i in pls) {
			var f1 = (pls[i].trash ? '<font color=#888A85>' : '')
			var f2 = (pls[i].trash ? '</font>' : '')
			text += '<tr id="skills">'
			text += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+'>' 
			text +=  f1 + ShowShortName(pls[i].name).fontsize(1) + f2
			text += '</td>'
			text += '<td align=right>'+f1 + (pls[i].sumskills + '&nbsp;').fontsize(1) + f2 +'</td>'
//			text += '<td>' + (pls[i].contract + (pls[i].contract == 5 ? 'л.' : 'г.')).fontsize(1) + '</td>'
			if(pls[i].skchange != '') {
				var skillchange = pls[i].skchange.split(',')
				for(j in skillchange) {
					text += '<tr id="skills"><td align=right colspan=2><i>'+f1+(skillchange[j] + '&nbsp;').fontsize(1)
					text += (pls[i][skillchange[j]].split('.')[0] + '&nbsp;').fontsize(1) +f2+'</i></td>'
					if(pls[i][skillchange[j]].split('.')[1] != undefined) {
						text += '<td><img height="8" src="system/img/g/'+pls[i][skillchange[j]].split('.')[1]+'.gif"></img></td>'
					}
					text += '</tr>'
				}
			}
			text += '</tr>'
		}
		$('#osskills').after(text + '<tr id="skills"><td>&nbsp;</td></tr>')
	} else {
		sk = true
		$('tr#skills').remove()
	}
}
function ShowRoster(){
	debug('ShowRoster()')
//	$('table[background]:eq(1)').show()
	$('table#tblSu').hide()
	$('div#divSu').hide()

	$('table#tblRostSkills').hide()
	$('div#divRostSkills').hide()

	$('table#tblRostSkillsFilter').hide()
	$('table#SumPl').hide()
	$('div#divRostSkillsFilter').hide()
	$('div#filter').hide()

	$('table#tblRoster').show()
	$('table#tblRosterFilter').show()
}

function ShowSkills(param){
	debug('ShowSkills param: '+param)
	if(param == 1){
//		$('table[background]:eq(1)').hide()
		//$('td#crabglobalright').html('')

		$('table#tblSu').hide()
		$('div#divSu').hide()
		$('table#tblRoster').hide()
		$('table#tblRosterFilter').hide()

		$('table#tblRostSkills').show()
		$('div#divRostSkills').show()
		$('div#divRostSkillsFilter').show()
	}

	$('table#tblRostSkills tr').remove()
	if(param == 2) type = (type=='img' ? 'num' : 'img')

	var hd = 'N Имя Сум лид дрб удр пас вид глв<br>вых нав длу псо<br>реа ско штр впз угл<br>рук тех мощ отб рбт вын Мор Фор Поз'
	var hd2= hd.split(' ')

	var header = '<tr align="left" style="font-weight:bold;" id="tblRostSkillsTHTr0">'
	header += '<td><a class="sort">'+hd2.join('</a></td><td><a class="sort">')+'</a></td>'
	header += '</tr>'
	$('table#tblRostSkills').append(header)
	$('table#tblRostSkills tr:first a').each(function(i,val){
		$(val).attr('href','javascript:void(CountSkills('+i+'))')
	})

	var pf = players.sort(sSkills)
	for(i=0;i<pf.length;i++) {
		if(pf[i]!=undefined){
			var d = (pf[i].d==0 ? '' : ' <img width=12 valign=top src="'+pf[i].d+'"></img>')
			var t = (pf[i].t==0 ? '' : ' <img width=12 valign=top src="'+pf[i].t+'"></img>')
			var tr ='<tr height=20 id="'+pf[i].position+'">'
			var trash = (pf[i].trash ? ' style="display: none;"' : '')
			for(j in hd2) {
				var tdcolor = (countSk[j] == 1 ? ' id=colw bgcolor=white' : '')
				var skn = hd2[j]
				var key1 = pf[i][skills[skn.split('<br>')[0]]]
				var key2 = pf[i][skills[skn.split('<br>')[1]]]
				var sk = (key1!=undefined ? key1 : key2)
//				if(skn=='x')					tr += '<td><a id="x" href="javascript:void(HidePl('+(i+1)+',true))">x</a></td>'
				if(skn=='Имя')					tr += '<td'+tdcolor+'><a href="plug.php?p=refl&t=p&j='+pf[i].id+'&z='+pf[i].hash+'">'+sk+'</a>'+d+t+'</td>'
				else if(skn=='N') 				tr += '<td'+tdcolor+'>'+sk+'</td>'
				else if(skn=='Поз') 			tr += '<td'+tdcolor+trash+'>'+sk+'</td>'
				else if(skn=='Сум') 			tr += '<td'+tdcolor+'><b><a id="x" href="javascript:void(HidePl('+(i+1)+','+(pf[i].trash ? 'false' : 'true')+'))">'+parseInt(sk)+'</a></b></td>'
				else if(!isNaN(parseInt(sk)) && type=='num')	tr += '<td'+tdcolor+trash+'>'+parseInt(sk)+'</td>'
				else if(!isNaN(parseInt(sk)) && type=='img')	tr += '<td'+tdcolor+trash+'>'+String(sk).split('.')[0]+(String(sk).split('.')[1]!=undefined ? '&nbsp;<img height="10" src="system/img/g/'+String(sk).split('.')[1]+'.gif"></img>' : '')+'</td>'
				else 							tr += '<td'+tdcolor+'> </td>'
			}
			tr += '</tr>'
			$('table#tblRostSkills').append(tr)

//			debug(i+':'+pf[i].trash+':'+pf[i].name)
   		}
	}

	// Run filter
	Filter(3,'')
}

function HidePl(num,fl){
	debug('HidePl('+num+','+fl+') go')
	if(fl){
		$('table#tblRostSkills tr:eq('+num+') a#x').attr('href','javascript:void(HidePl('+(num)+',false))')
		$('table#tblRostSkills tr:eq('+num+') td:gt(2)').each(function(){
			$(this).hide()
		})
		players[num-1].trash = true
	}else{
		$('table#tblRostSkills tr:eq('+num+') a#x').attr('href','javascript:void(HidePl('+(num)+',true))')
		$('table#tblRostSkills tr:eq('+num+') td:gt(2)').each(function(){
			$(this).removeAttr('style')
		})
		players[num-1].trash = false
	}
	ShowSumPlayer()
}

function ShowHols(p){
	sumH = (sumH ? false : true)
	ShowSumPlayer()
}

function ShowSumPlayer(p){
	if(p!=undefined) sumP = p
	debug('ShowSumPlayer go')
	var ld = {'sum':0,'mx':0,'mn':0,'num':0}
	var head = []
	sumplarr = {}
	$('table#tblRostSkills tr:first td:lt(21):gt(2)').each(function(i, val){
		head[i] = $(val).find('a').html().split('<br>')[0]
		sumplarr[head[i]] = {'sum':0,'mx':0,'mn':0,'num':0}
	})

	$('table#tblRostSkills tr:gt(0):visible').each(function(){
		$(this).find('td:lt(21):gt(2):visible').each(function(i,val){
			var tdval = parseInt($(val).text())
			var param = sumplarr[head[i]]
			param.sum  += tdval
			param.mx	= (param.mx < tdval ? tdval : param.mx)
			param.mn	= (param.mn==0 || param.mn > tdval ? tdval : param.mn)
			param.num  += 1
		})
	})

	$('table#SumPl tr#sumsk').remove()
	var tr = true
	var sumpl = ''
	for(i in sumplarr){
		var param = sumplarr[i]
		var text = (param.num==0 ? ' ' : (param.sum/param.num).toFixed(sumP) + (param.num>1 ? ' ('+param.mn+':'+param.mx+')' : ''))
		sumpl += (tr ? '<tr id="sumsk" bgcolor=#a3de8f>' : '')
		sumpl += '<td width=30%>'+skills[i]+'</td><td width=20%>'+text+'</td>'
		sumpl += (tr ? '' : '</tr>')
		tr = (tr ? false : true)
	}   
	$('table#SumPl tr#sumhead').after(sumpl)
	if(sumH){
		$('table#tblRostSkills tr:gt(0):visible').each(function(){

			$(this).find('td#colw').each(function(i, val){
				$(val).attr('id','colwy').attr('bgcolor', '#E9B96E')
			})
			$(this).find('td:[id!=colwy]').each(function(i, val){
				$(val).attr('id','coly').attr('bgcolor', '#FCE94F')
			})
		})
	}else {
		$('table#tblRostSkills tr:visible').each(function(){
			$(this).find('td#colwy').attr('bgcolor','white').attr('id','colw')
			$(this).find('td#coly').removeAttr('bgcolor').removeAttr('id')
		})
	}
}

function ShowFilter(){
	var style = $('table#tblRostSkillsFilter').attr('style')
	if(style == "display: none" || style == "display: none;" || style == "display: none; "){
		$('table#tblRostSkillsFilter').show()
		$('table#SumPl').show()
		$('div#filter').show()
	}else{
		$('table#tblRostSkillsFilter').hide()
		$('table#SumPl').hide()
		$('div#filter').hide()
//		Filter(3,'')
	}
}

function Filter(num,p){
	if(num==1){
		pos1[p] = (pos1[p]==undefined || pos1[p]==0 ? 1 : 0)
	} else if(num==2){
		pos2[p] = (pos2[p]==undefined || pos2[p]==0 ? 1 : 0)
	} else {
//		for(i in pos1) pos1[i] = 0
//		for(i in pos2) pos2[i] = 0
	}
	var sumpos1 = 0
	var sumpos2 = 0
	for (i in pos1) sumpos1 += parseInt(pos1[i])
	for (i in pos2) sumpos2 += parseInt(pos2[i])
	var sumpos = sumpos1 + sumpos2
	var selectTDcolor = 'green'//'D3D7CF'
	var selectFLcolor = 'white'

    $('table#tblRostSkillsFilter th').removeAttr('bgcolor')
	$('table#tblRostSkillsFilter td').each(function(){
		$(this).attr('bgcolor','a3de8f')
		var position = $(this).attr('id')
		var kmark = 0
		var lmark = 0
		for (k in pos1) {
			if(sumpos1==0 || (position.indexOf(k)>-1 && pos1[k]==1)) kmark=1
			if(pos1[k] == 1) $('th#'+k).attr('bgcolor',selectFLcolor)
		}
		for (l in pos2) {
			if(sumpos2==0 || (position.indexOf(l)>-1 && pos2[l]==1)) lmark=1
			if(pos2[l] == 1) $('th#'+l).attr('bgcolor',selectFLcolor)
		}
		if(kmark==1 && lmark==1 && sumpos != 0) $(this).attr('bgcolor',selectTDcolor)
	})
	$('table#tblRostSkills tr:gt(0)').each(function(j,val){
		$(val).hide()
		var position = $(val).find('td:last').text()
		var kmark = 0
		var lmark = 0
		for (k in pos1) if(sumpos1==0 || (position.indexOf(k)>-1 && pos1[k]==1)) kmark=1
		for (l in pos2) if(sumpos2==0 || (position.indexOf(l)>-1 && pos2[l]==1)) lmark=1
		if((kmark==1 && lmark==1) || sumpos == 0) $(val).show()
	})
	$('table#tblRostSkills tr:visible:even').attr('bgcolor','a3de8f')
	$('table#tblRostSkills tr:visible:odd').attr('bgcolor','C9F8B7')
	ShowSumPlayer()
}

function CountSkills(tdid){
    if(countSk[tdid]!=undefined && countSk[tdid]==1) countSk[tdid] = 0
	else countSk[tdid] = 1
	$('table#tblRostSkills tr:gt(0)').each(function(j, valj){
		var sumsel = 0
		$(valj).find('td').each(function(i, val){
			$(val).removeAttr('bgcolor')
			if(countSk[i] == 1) {
				sumsel += (isNaN(parseInt($(val).html())) ? 0 : parseInt($(val).html()))
				$(val).attr('bgcolor','white')
			}
		})
//		$(valj).find('td:eq(2)').html('<b>'+(sumsel==0 ? players[j].sumskills : sumsel)+'</b>')
		if(players[j].sumskills == players[j].sorting) players[j].sorting = sumsel
		else if(sumsel == 0) players[j].sorting = players[j].sumskills
		else players[j].sorting = sumsel
//		players[j].sorting = (players[j].sumskills == players[j].sorting ? sumsel)
	})
	ShowSkills(3)
}

function ShowShortName(fullname){
	var namearr = fullname.replace(/^\s+/, "").replace(/\s+$/, "").split(' ')
	var shortname = ''
	for(n in namearr) {
		if(n==0){
			if(namearr[1] == undefined) shortname += namearr[n]
			else shortname += namearr[n][0] + '.'
		} else {
			shortname += namearr[n] + '&nbsp;'
		}
	}
	return shortname
}


function ShowValueFormat(value){
	if (value > 1000)	return (value/1000).toFixed(3).replace(/\./g,',') + '$'
	else				return (value) + '$'
}

function sSkills(i, ii) { // По SumSkills (убыванию)
    if 		(i.sorting < ii.sorting)	return  1
    else if	(i.sorting > ii.sorting)	return -1
    else								return  0
}
function sValue(i, ii) { // По value (убыванию)
    if 		(i.value < ii.value)	return  1
    else if	(i.value > ii.value)	return -1
    else							return  0
}
function sZp(i, ii) { // По zp (убыванию)
    if 		(i.wage < ii.wage)	return  1
    else if	(i.wage > ii.wage)	return -1
    else						return  0
}
function sAge(i, ii) { // По zp (убыванию)
    if 		(i.age < ii.age)	return  1
    else if	(i.age > ii.age)	return -1
    else						return  0
}

function sSu(i, ii) { // По su (убыванию)
    if 		(i.minute < ii.minute)	return  1
    else if	(i.minute > ii.minute)	return -1
    else							return  0
}

function ShowChange(value,hide){
	if(value > 0) 		return '<sup><font color="green">+' + (hide ? ''  : value) + '</font></sup>'
	else if(value < 0)	return '<sup><font color="red">' 	+ (hide ? '-' : value) + '</font></sup>'
	else 		  		return ''
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}

function check(d) {return (d<10 ? "0"+d : d)}

function debug(text) {if(deb) {debnum++;$('td#crabgloballeft').append(debnum+'&nbsp;\''+text+'\'<br>');}}
