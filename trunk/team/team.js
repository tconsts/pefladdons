// ==UserScript==
// @name           peflteam
// @namespace      pefl
// @description    team page modification
// @include        http://*pefl.*/*&t=k&j=*
// @version        2.0
// ==/UserScript==

var deb = true
var debnum = 0
var ff = ''
var cid = ''
var countSostav = 0
var type 	= ''
var players = []
var teams = []
var plChange = []
var pls = []
var countSk = [0]
var nom = 0
var zp = 0
var sk = 0
var pos1 = {'C' :0}
var pos2 = {'GK':0}
var team = {
	'wage'	: 0,
	'wage2'	: 0,
	'wage3'	: 0,
	'value'	: 0,
	'value2': 0,
	'value3': 0,
	'ss'	: 0,
	'ss2'	: 0,
	'ss3'	: 0
}
var skills = {
	'N'	  : 'pn',
	'Имя' : 'name',
	'Поз' : 'position',
	'Фор' : 'form',
	'Мор' : 'morale',
	'сс'  : 'sumskills',
	'Сум' : 'sorting',
	'угл' : 'Угловые',
	'нав' : 'Навесы',
	'дрб' : 'Дриблинг',
	'удр' : 'Удары',
	'штр' : 'Штрафные',
	'рук' : 'Игра руками',
	'глв' : 'Игра головой',
	'вых' : 'Игра на выходах',
	'лид' : 'Лидерство',
	'длу' : 'Дальние удары',
	'псо' : 'Перс. опека',
	'ско' : 'Скорость',
	'пас' : 'Игра в пас',
	'впз' : 'Выбор позиции',
	'реа' : 'Реакция',
	'вын' : 'Выносливость',
	'мощ' : 'Мощь',
	'отб' : 'Отбор мяча',
	'вид' : 'Видение поля',
	'рбт' : 'Работоспособность',
	'тех' : 'Техника'
}

$().ready(function() {
	ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
	cid = parseInt($('td.back4 table:first table td:first').text())

	if(UrlValue('l')=='y'){
	//Page for show skills
		EditSkillsPage()
	}else if(UrlValue('n')!=false){
	// Ростер с фильтром(не вся стата показывается)

	}else{
	// Ростер
		//DB get teams info
		if(ff){
		// Get info fom Global Storage 
			// Info for clubs, format: <id_team0>:<task_team0>:<town0>:<stadio_name0>:<stadio_size0>,
			// ##### Need add: format: club_id, country_name, div, <list of div prizes>
			var text1 = globalStorage[location.hostname]['tasks']
			if (text1 != undefined){
				var t1 = String(text1).split(',')
				for (i in t1) {
					var t2 = t1[i].split(':')
					teams[t2[0]] = {}
					if(t2[1] != undefined) teams[t2[0]].ttask = t2[1]
					if(t2[2] != undefined) teams[t2[0]].ttown = t2[2]
					if(t2[3] != undefined) teams[t2[0]].sname = t2[3]
					if(t2[4] != undefined) teams[t2[0]].ssize = t2[4]
				}
				GetFinish('gs_tm', true)
			}else{
				GetFinish('gs_tm', false)
			}
			// Info for players
			text1 = globalStorage[location.hostname]['team']
			if (text1 != undefined){
				var pltext = String(text1).split(':',2)[1].split('.')
				for (i in pltext) {
					var plsk = pltext[i].split(',')
					var plx = []
					plx.id 		= parseInt(plsk[0])
					plx.num 	= parseInt(plsk[1])
					plx.morale 	= parseInt(plsk[2])
					plx.form 	= parseInt(plsk[3])
					plx.mchange = parseInt(plsk[4])
					plx.fchange = parseInt(plsk[5])
					plChange2[plx.id] = []
					plChange2[plx.id] = plx
				}
				GetFinish('gs_pl', true)
			} else {
				GetFinish('gs_pl', false)
			}			
		} else {
		// Get Info from DB
			// Conect to db
			db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
			if(!db) {debug('Open DB PEFL fail.');return false;} 
			else 	{debug('Open DB PEFL ok.')}

			// Get data from db
			db.transaction(function(tx) {
				tx.executeSql("DROP TABLE IF EXITS team99999players")
				tx.executeSql("SELECT id, num, form, morale, fchange, mchange FROM team"+cid+"players", [], 
					function(tx, result){
						debug('Select ok, get data:')
						for(var i = 0; i < result.rows.length; i++) {
							var plid = result.rows.item(i)['id']
    						plChange2[plid] = []
							plChange2[plid] = result.rows.item(i)
							debug(result.rows.item(i)['num'] + ' ' + result.rows.item(i)['id'] + ' ' +result.rows.item(i)['form'])
						}
						GetFinish('db_pl',true)
					}, 
					function(tx, error){
						debug('Select data error:'+error.message)
						GetFinish('db_pl', false)						
					}
				)
			});
		}

		// Draw right panel and fill data
		var preparedhtml = ''
		preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr><td id="crabgloballeft" width=200 valign=top></td><td id="crabglobalcenter" valign=top></td><td id="crabglobalright" width=200 valign=top>'
		preparedhtml += '<table id="crabrighttable" bgcolor="#C9F8B7" width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
		preparedhtml += '</td></tr></table>'
		$('body table.border:last').before(preparedhtml)

		$('td.back4 script').remove()
		$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
		$('#crabrighttable').addClass('border') 


		preparedhtml  =	'<table width=100%><tr><th colspan=3>Финансовое положение</th></tr>'
		preparedhtml += '<tr><td id="finance1"></td><td id="finance2" colspan=2></td></tr>'
		preparedhtml += '</table><br>'
		$("#crabright").html(preparedhtml)

		countSostavMax  = $('tr[id^=tblRosterTr]').length
		countRentMax 	= $('tr[id^=tblRosterRentTr]').length
		TeamHeaderInfoGet();
		EditFinance();
		PlayersChange();
		if(UrlValue('h')!=1){
			PlayersInfoGet();
			CountryInfoGet();
		}
	}
}, false);

function debug(text) {if(deb) {debnum++;$('td#crabgloballeft').append(debnum+'&nbsp;'+text+'<br>');}}

function GetFinish(type, res){
	//gs_pl: true
	//gs_pl: false
	//gs_tm: true
	//gs_tm: false
	//db_pl: true
	//db_pl: false
}

function SaveSD(){
	var text = teamid + ':'	
	for(i in plChange) {
		var pl = plChange[i]
		text += pl.id + ',' + pl.num + ',' + pl.morale + ',' + pl.form + ',' + pl.mchange + ',' + pl.fchange + '.'
	}
	SaveStorageData('team',text)
}

function EditSkillsPage(){
	$('table#tblRostSkillsFilter td:first').prepend('<a href="javascript:void(ShowSkillsY())">Стрелки</a> | ')
	$('table#tblRostSkills').attr('width','886')
	$('table#tblRostSkills td:contains("*")').attr('bgcolor','white')
	$('table#tblRostSkills img').attr('height','10')
	$('table#tblRostSkills tr').each(function(){
		$(this).attr('height','20').find('td:eq(1)').html($(this).find('td:eq(1)').html().replace('<br>','&nbsp;'))
	})
}

function ShowFilter(){
	var style = $('table#tblRostSkillsFilter').attr('style')
	if(style == "display: none" || style == "display: none;" || style == "display: none; "){
		$('table#tblRostSkillsFilter').show()
		$('div#filter').show()
	}else{
		$('table#tblRostSkillsFilter').hide()
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
	ShowSkills()
}
function ShowSkillsY() {
	if( type == 'num') {
		type = 'img'
		$('table#tblRostSkills img').attr('height','10').show()
	}else{
		type = 'num'
		$('table#tblRostSkills img').hide()
	}
	$('table#tblRostSkills tr').each(function(){
		$(this).find('td:eq(1)').html($(this).find('td:eq(1)').html().replace('<br>','&nbsp;'))
	})
}

function ShowSkills(param){
	if(param == 1){
		$('table[background]:eq(1)').hide()
		$('td#crabglobalright').html('')
		$('table#tblRoster')
			.attr('id','tblRostSkills')
			.attr('width','886')
			.attr('bgcolor','BFDEB3')

		var filter = ''
		filter += '<tr align=center><th width=10%></th><th id="L" width=15%><a href="javascript:void(Filter(1,\'L\'))">L</a></th><th width=15%></th><th id="C" width=15%><a href="javascript:void(Filter(1,\'C\'))">C</a></th><th width=15%></th><th id="R" width=15%><a href="javascript:void(Filter(1,\'R\'))">R</a></th></tr>'
		filter += '<tr align=center><th id="GK"><a href="javascript:void(Filter(2,\'GK\'))">GK</a></th><th></th><th></th>	<td bgcolor=a3de8f id="GK">&nbsp;</td>		<th></th>	<th></th></tr>'
		filter += '<tr align=center><th id="SW"><a href="javascript:void(Filter(2,\'SW\'))">SW</a></th><th></th><th></th>	<td bgcolor=a3de8f id="C SW">&nbsp;</td>	<th></th>	<th></th></tr>'
		filter += '<tr align=center><th id="DF"><a href="javascript:void(Filter(2,\'DF\'))">DF</a></th><td bgcolor=a3de8f id="L DF">&nbsp;</td>	<td bgcolor=a3de8f id="C DF">&nbsp;</td>	<td bgcolor=a3de8f id="C DF">&nbsp;</td>	<td bgcolor=a3de8f id="C DF">&nbsp;</td>	<td bgcolor=a3de8f id="R DF">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="DM"><a href="javascript:void(Filter(2,\'DM\'))">DM</a></th><td bgcolor=a3de8f id="L DM">&nbsp;</td>	<td bgcolor=a3de8f id="C DM">&nbsp;</td>	<td bgcolor=a3de8f id="C DM">&nbsp;</td>	<td bgcolor=a3de8f id="C DM">&nbsp;</td>	<td bgcolor=a3de8f id="R DM">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="MF"><a href="javascript:void(Filter(2,\'MF\'))">MF</a></th><td bgcolor=a3de8f id="L MF">&nbsp;</td>	<td bgcolor=a3de8f id="C MF">&nbsp;</td>	<td bgcolor=a3de8f id="C MF">&nbsp;</td>	<td bgcolor=a3de8f id="C MF">&nbsp;</td>	<td bgcolor=a3de8f id="R MF">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="AM"><a href="javascript:void(Filter(2,\'AM\'))">AM</a></th><td bgcolor=a3de8f id="L AM">&nbsp;</td>	<td bgcolor=a3de8f id="C AM">&nbsp;</td>	<td bgcolor=a3de8f id="C AM">&nbsp;</td>	<td bgcolor=a3de8f id="C AM">&nbsp;</td>	<td bgcolor=a3de8f id="R AM">&nbsp;</td></tr>'
		filter += '<tr align=center><th id="FW"><a href="javascript:void(Filter(2,\'FW\'))">FW</a></th><th></td><td bgcolor=a3de8f id="C FW">&nbsp;</td>	<td bgcolor=a3de8f id="C FW">&nbsp;</td>	<td bgcolor=a3de8f id="C FW">&nbsp;</td>	<th></th></tr>'
		$('table#tblRosterFilter')
			.attr('id','tblRostSkillsFilter')
			.attr('width','50%')
			.attr('align','center')
			.attr('cellspacing','1')
			.attr('cellpadding','1')
			.after('<div id="filter">&nbsp;</div>')
			.before('<a href="javascript:void(ShowSkills(2))">Стрелки</a> | <a href="javascript:void(ShowFilter())">Фильтр >></a>')
			.html(filter)
		$('span#tskills').html('Ростер команды')
		$('a#tskills').attr('href','')
		ShowFilter()
		ShowSkills(2)
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
			var tr ='<tr height=20 id="'+pf[i].position+'">'
			for(j in hd2) {
				var tdcolor = (countSk[j] ==1 ? ' bgcolor=white' : '')
				var skn = hd2[j]
				var key1 = pf[i][skills[skn.split('<br>')[0]]]
				var key2 = pf[i][skills[skn.split('<br>')[1]]]
					var sk = (key1!=undefined ? key1 : key2)
				if(skn=='Имя') 					tr += '<td'+tdcolor+'><a href="plug.php?p=refl&t=p&j='+pf[i].id+'&z='+pf[i].hash+'">'+sk+'</a></td>'
				else if(skn=='Поз') 			tr += '<td'+tdcolor+'>'+sk+'</td>'
				else if(skn=='Сум') 			tr += '<td'+tdcolor+'><b>'+parseInt(sk)+'</b></td>'
				else if(!isNaN(parseInt(sk)) && type=='num')	tr += '<td'+tdcolor+'>'+parseInt(sk)+'</td>'
				else if(!isNaN(parseInt(sk)) && type=='img')	tr += '<td'+tdcolor+'>'+String(sk).split('.')[0]+(String(sk).split('.')[1]!=undefined ? '&nbsp;<img height="10" src="system/img/g/'+String(sk).split('.')[1]+'.gif"></img>' : '')+'</td>'
				else 							tr += '<td'+tdcolor+'> </td>'
			}
			tr += '</tr>'
			$('table#tblRostSkills').append(tr)
		}
	}

	// Run filter
	Filter(3,'')
	$('table#tblRostSkills tr:even').attr('bgcolor','a3de8f')
	$('table#tblRostSkills tr:odd').attr('bgcolor','C9F8B7')

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

function PlayersInfoGet(){
	$('tr[id^=tblRosterTr]').each(function(i,val){
		var purl= $(val).find('a[trp="1"]').attr('href')
		var pid = UrlValue('id',purl)
		var pn	= parseInt($(val).find('td:first').text())
		players[pn] = {}
		players[pn].pn 		= pn
		players[pn].id 		= pid
		players[pn].hash	= UrlValue('z',$(val).find('td:eq(1) a:first').attr('href'))
		players[pn].name	= $(val).find('td:eq(1) a').html()
								.split('<img')[0]
								.replace('(*)','')
								.replace('<i>','')
								.replace('</i>','')
		players[pn].nid		= $(val).find('td:eq(2) img').attr('src')
								.split('/')[4]
								.split('.')[0]
		players[pn].age		= parseInt($(val).find('td:eq(3)').html())
		players[pn].morale	= parseInt($(val).find('td:eq(4)').html())
		players[pn].form	= parseInt($(val).find('td:eq(5)').html())
		players[pn].position= $(val).find('td:eq(11)').html()
								.replace(/\s/g,'&nbsp;')

		$('td.back4').append('<table id=pl'+pn+' style="display: none;"><tr><td id=pl'+pn+'></td></tr></table>')
		$('td#pl'+pn).load(purl+' center:first', function(){GetPl(pn);})		
	})
}

function CountryInfoGet(){
	var srch="Вы вошли как "
	var curManagerNick = $('td.back3 td:contains('+srch+')').html().split(',',1)[0].replace(srch,'')
	if(curManagerNick == $('td.back4 table:first table:eq(1) table td:first span').text()){
		var tdivarr = []
		var tdiv = getCookie('teamdiv');
		if(tdiv != false) tdivarr = tdiv.split('!')
		// format: club_id, country_name, div, <list of div prizes>
		tdivarr[0] = cid
		tdivarr[1] = $('td.back4 table:first table td:eq(3)').text().split(', ')[1].replace(')','')
		setCookie('teamdiv',tdivarr.join('!'));
	} 
}

function GetPl(pn){
	// get player skills with number pn
	var skillsum = 0
	var skillchange = []
	$('td#pl'+pn+' table:first td:even').each(function(){
		var skillarrow = ''
		var skillname = $(this).html();
		var skillvalue = parseInt($(this).next().html().replace('<b>',''));
		if ($(this).next().find('img').attr('src') != undefined){
			skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
		}
		skillsum += skillvalue;
		players[pn][skillname] = skillvalue + skillarrow

		if($(this).next().html().indexOf('*') != -1) skillchange.push(skillname)
	})
	players[pn].sumskills	= skillsum
	players[pn].sorting		= skillsum
	players[pn].skchange	= (skillchange[0] != undefined ? skillchange.join(',') : '')

	// get player header info
	$('td#pl'+pn+' table').remove()
	var head = $('td#pl'+pn+' b:first').html()
	players[pn].natfull 	= head.split(' (матчей')[0].split(', ')[1]
	players[pn].value		= parseInt(head.split('Номинал: ')[1].split(',000$')[0].replace(/,/g,''))*1000
	players[pn].contract 	= parseInt(head.split('Контракт: ')[1])
	players[pn].wage 		= parseInt(head.split('г., ')[1].split('$')[0].replace(/,/g,''))

	team.wage	+= players[pn].wage
	team.value	+= players[pn].value/1000
	team.ss		+= players[pn].sumskills
	$('table#pl'+pn).remove()
	Ready()
}

function Ready(){
	countSostav++
	if(countSostav==countSostavMax){
		if(team.wage > 0){ // if VIP
			// print link to skills page
			if($('td.back4 table table:eq(1) tr:last td:last').html().indexOf('Скиллы')==-1){
				$('td.back4 table table:eq(1) tr:last td:last').append('| <a id="tskills" href="javascript:void(ShowSkills(1))"><span id="tskills">Скиллы игроков</span></a>&nbsp;')}

			var sumvaluechange = 0
			if(UrlValue('j')==99999){
				// Players value
				var text2 = '' //GetStorageData('playersvalue')
				if(ff)	text2 = String(globalStorage[location.hostname]['playersvalue'])
				else	text2 = sessionStorage['playersvalue']

				/**/
				//debug
				$('td.back4').prepend('<span id=hiden></span>')
				$('span#hiden').hide().append(text2)
				/**/
				
				if (text2 != undefined){
					var t1 = text2.split(',')
					var sumvalueold = 0
					for(j in t1){
						var t2 = t1[j].split(':')
						pls[t2[0]] = {}
						pls[t2[0]].value = parseInt(t2[1])*1000
						pls[t2[0]].valuech = parseInt(t2[2])*1000
						sumvalueold += (isNaN(parseInt(t2[1])) ? 0 : parseInt(t2[1]))
					}
					// Update current
					var sumvaluenew = 0
					for (i in players) {
						var pid = players[i].id
						if(pls[pid] != undefined){
							if(players[i].value != pls[pid].value){
								players[i].valuech = players[i].value - pls[pid].value
							}else{
								players[i].valuech = pls[pid].valuech
							}
						} else {
							players[i].valuech = 0
						}
						sumvaluechange += players[i].valuech/1000
						sumvaluenew += players[i].value/1000
					}
					if(sumvaluenew != sumvalueold){
						sumvaluechange = sumvaluenew - sumvalueold
					}
				}
				
				// Save
				text = ''
				for(j in players) {
					text += players[j].id + ':'
					text += players[j].value/1000 + ':'
					text += (players[j].valuech != undefined ? players[j].valuech/1000 : 0)
					text += ','
				}
				//SaveStorageData('playersvalue',text)
				if(ff)	globalStorage[location.hostname]['playersvalue'] = text
				else	sessionStorage['playersvalue'] = text
			}

			// print to right menu
			var thtml = ''
			thtml += '<tr><td id="os" colspan=3 align=center><br><b>Основной состав</b>'
//			if(sumvaluechange != 0) 
			thtml += '&nbsp;<a id="os" href="javascript:void(ForgotPlValueCh())">'+('[x]').fontsize(1)+'<a>'
			thtml += '</td></tr>'
			thtml += '<tr id="osnom"><th align=left width=50%><a href="javascript:void(ShowPlayersValue())">номиналы</a>:</th><th align=right>'
			thtml += ShowValueFormat(team.value)+'т'
			thtml += '</th><td width=10%>'
			if(sumvaluechange != 0) thtml += '&nbsp;'+ShowChange(sumvaluechange)
			thtml += '</td></tr>'
			thtml += '<tr id="oszp"><th align=left><a href="javascript:void(ShowPlayersZp())">зарплаты</a>:</th><th align=right>'
			thtml += ShowValueFormat(team.wage)+'&nbsp;'
			thtml += '</th></tr>'
			thtml += '<tr id="osskills"><td><b><a href="javascript:void(ShowPlayersSkillChange())">скилы</a></b>'+('&nbsp;(срд.)').fontsize(1)+'<b>:</b></td><th align=right>'
			thtml += (team.ss/countSostavMax).toFixed(2) + '&nbsp;'
			thtml += '</th><td></td></tr>'


/**
			if(team.value2!=0 || team.wage2!=0) thtml += '<tr><th colspan=2><br>Арендовано</th><th width=30%></th></tr>'
			if(team.value2!=0){
				thtml += '<tr><td>номиналы</td><td align=right>'
				var nom2pr = team.value2
				if(nom2>=1000) nom2pr = (team.value2/1000).toFixed(3)
				thtml += (String(nom2pr).replace(/\./g,',')+',000$').fontsize(1)
				thtml += '</td></tr>'
			}
			if (team.wage2 !=0) {
				thtml += '<tr><td>зарплаты:</td><td align=right>'
				var wage2pr = team.wage2
				if(team.wage2>=1000) wage2pr = (team.wage2/1000).toFixed(3)
				thtml += (String(wage2pr).replace(/\./g,',')+'$').fontsize(1)
				thtml += '</td></tr>'
			} 
			if(team.value3!=0 || team.wage3!=0) thtml += '<tr><th colspan=2><br>В аренде</th><th width=30%></th></tr>'
			if(team.value3!=0){
				thtml += '<tr><td>номиналы:</td><td align=right>'
				var nom3pr = team.value3
				if(team.value3>=1000) nom3pr = (team.value3/1000).toFixed(3)
				thtml += (String(nom3pr).replace(/\./g,',')+',000$').fontsize(1)
				thtml += '</td></tr>'
			}
			if(team.wage3!=0){
				thtml += '<tr><td>зарплаты:</td><td align=right>'
				var wage3pr = team.wage3
				if(team.wage3>=1000) wage3pr = (team.wage3/1000).toFixed(3)
				thtml += (String(wage3pr).replace(/\./g,',')+'$').fontsize(1)
				thtml += '</td></tr>'
			}
/**/
			$('#crabright table:first').append(thtml)

			var tfin = []
			// Get
			var text1 = sessionStorage.teamsfin
			if (text1 != undefined){
				var t1 = text1.split(',')
				for(j in t1){
					var t2 = t1[j].split(':')
					var tf = {}
					tf.zp = t2[1]
					tf.nom = t2[2]
					if(t2[0]) tfin[t2[0]] = tf
				}
			}
			// update current
			tfin[cid] = {}
			tfin[cid].zp  = team.wage
			tfin[cid].nom = team.value
			//Save
			var text = ''
			for(j in tfin) text += j + ':' + tfin[j].zp + ':' + tfin[j].nom + ','
			sessionStorage.teamsfin = text

		}
	}
}

function ForgotPlValueCh(){
	var text = ''
	for(j in players) {
		players[j].valuech = 0
		text += players[j].id + ':'
		text += players[j].value/1000 + ':'
		text += 0
		text += ','
	}
	//SaveStorageData('playersvalue',text)
	if(ff)	globalStorage[location.hostname]['playersvalue'] = text
	else	sessionStorage['playersvalue'] = text

	nom = 0
	$('a#os').remove()
	$('tr#nom').remove()
	$('tr#osnom td:last').html('')
}

function ShowPlayersValue(){
	if(nom==0) {
		nom = 1
		var nomtext = ''
		var pls = players.sort(sValue)
		for(i in pls) {
			nomtext += '<tr id="nom">'
			nomtext += '<td>' + ShowShortName(pls[i].name).fontsize(1) + '</td>'
			nomtext += '<td align=right>' + (ShowValueFormat(pls[i].value/1000) + 'т').fontsize(1) + '</td>'
			nomtext += '<td>&nbsp;'+ShowChange(pls[i].valuech/1000)+'</td>'
			nomtext += '</tr>'
		}
		$('#osnom').after(nomtext + '<tr id="nom"><td>&nbsp;</td></tr>')
	} else {
		nom = 0
		$('tr#nom').remove()
	}
}

function ShowPlayersZp(){
	if(zp==0) {
		zp = 1
		var text = ''
		var pls = players.sort(sZp)
		for(i in pls) {
			text += '<tr id="zp">'
			text += '<td>' + ShowShortName(pls[i].name).fontsize(1) + '</td>'
			text += '<td align=right>' + (ShowValueFormat(pls[i].wage) + '&nbsp;').fontsize(1) + '</td>'
			text += '<td>' + (pls[i].contract + (pls[i].contract == 5 ? 'л.' : 'г.')).fontsize(1) + '</td>'
			text += '</tr>'
		}
		$('#oszp').after(text + '<tr id="zp"><td>&nbsp;</td></tr>')
	} else {
		zp = 0
		$('tr#zp').remove()
	}
}

function ShowPlayersSkillChange(){
	if(sk==0) {
		sk = 1
		var text = ''
		var pls = players.sort(sSkills)
		for(i in pls) {
			text += '<tr id="skills">'
			text += '<td>' + ShowShortName(pls[i].name).fontsize(1) + '</td>'
			text += '<td align=right>' + (pls[i].sumskills + '&nbsp;').fontsize(1) + '</td>'
//			text += '<td>' + (pls[i].contract + (pls[i].contract == 5 ? 'л.' : 'г.')).fontsize(1) + '</td>'
			if(pls[i].skchange != '') {
				var skillchange = pls[i].skchange.split(',')
				for(j in skillchange) {
					text += '<tr id="skills"><td align=right colspan=2><i>'+(skillchange[j] + '&nbsp;').fontsize(1)
					text += (pls[i][skillchange[j]].split('.')[0] + '&nbsp;').fontsize(1) +'</i></td>'
					if(pls[i][skillchange[j]].split('.')[1] != undefined) {
						text += '<td><img height="10" src="system/img/g/'+pls[i][skillchange[j]].split('.')[1]+'.gif"></img></td>'
					}
					text += '</tr>'
				}
			}
			text += '</tr>'
		}
		$('#osskills').after(text + '<tr id="skills"><td>&nbsp;</td></tr>')
	} else {
		sk = 0
		$('tr#skills').remove()
	}
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

function ShowChange(value){
	if(value > 0) 		return '<sup><font color="green">+' + value + '</font></sup>'
	else if(value < 0)	return '<sup><font color="red">' 	+ value + '</font></sup>'
	else 		  		return ''
}
function ShowValueFormat(value){
	if (value > 1000)	return (value/1000).toFixed(3).replace(/\./g,',') + '$'
	else				return (value) + '$'
}

function EditFinance(){
	var txt = $('table.layer1 td.l4:eq(1)').text().split(': ')[1]
	var txt2 = ''
	switch (txt){
		case 'банкрот': 				 txt2 += 'меньше 0'		;break;
		case 'жалкое': 					 txt2 += '1$т - 200$т'	;break;
		case 'бедное': 					 txt2 += '200$т - 500$т';break;
		case 'среднее': 				 txt2 += '500$т - 1$м'	;break;
		case 'нормальное': 				 txt2 += '1$м - 3$м'	;break;
		case 'благополучное': 			 txt2 += '3$м - 6$м'	;break;
		case 'отличное': 				 txt2 += '6$м - 15$м'	;break;
		case 'богатое': 				 txt2 += '15$м - 40$м'	;break;
		case 'некуда деньги девать :-)': txt2 += 'больше 40$м'	;break;
		default:
			var fin = parseInt(txt.replace(/,/g,'').replace('$',''))
			if (fin > 40000000) 		{txt = 'некуда деньги девать';	txt2 = 'больше 40$м'}
			else if (fin >= 15000000)	{txt = 'богатое';				txt2 = '15$м - 40$м'}
			else if (fin >= 6000000) 	{txt = 'отличное';				txt2 = '6$м - 15$м'}
			else if (fin >= 3000000) 	{txt = 'благополучное';			txt2 = '3$м - 6$м'}
			else if (fin >= 1000000) 	{txt = 'нормальное';			txt2 = '1$м - 3$м'}
			else if (fin >= 500000) 	{txt = 'среднее';				txt2 = '500$т - 1$т'}
			else if (fin >= 200000) 	{txt = 'бедное';				txt2 = '200$т - 500$т'}
			else if (fin >=0) 			{txt = 'жалкое';				txt2 = '1$т - 200$т'}
			else if (fin < 0) 			{txt = 'банкрот';				txt2 = 'меньше 0'}
	}
	$('#finance1').html(txt)
	$('#finance2').html(txt2)
}

function TeamHeaderInfoGet(){

	// Get current club data
	var zad = $('table.layer1 td.l4:eq(3)').text().split(': ',2)[1]

	// Delete all task if we have new task - it's new season!
	if (teams[cid] != undefined && teams[cid].ttask != undefined && teams[cid].ttask != zad) for (i in teams) teams[i].ttask = null
	if (teams[cid] == undefined) teams[cid] = {}
	teams[cid].ttask = zad
	teams[cid].ttown = $('td.back4 table table:first td:last').text().split('(')[1].split(',')[0]
	teams[cid].sname = $('table.layer1 td.l4:eq(0)').text().split(': ',2)[1]
	teams[cid].ssize = $('table.layer1 td.l4:eq(2)').text().split(': ',2)[1]

	// Prepare data for remember
	var text = ''
	for (i in teams) {
		if(teams[i] != undefined) {
			var tmi = teams[i]
			text += i+':'
			text += (tmi.ttask != undefined ? tmi.ttask : '') +':'
			text += (tmi.ttown != undefined ? tmi.ttown : '') +':'
			text += (tmi.sname != undefined ? tmi.sname : '') +':'
			text += (tmi.ssize != undefined ? tmi.ssize : '') 
			text += ','
		}
	}
	SaveStorageData('tasks',text)
}

function PlayersChange(){
	var plChange2 = []
	var remember = 0
	var teamid = UrlValue('j')
	var team21 = UrlValue('h')
	if (teamid == 99999){
		// Get data from page
		$('table#tblRoster tr:not(#tblRosterRentTitle):gt(0)').each(function(j,valj){
			var pl = [];
			pl.mchange = 0
			pl.fchange = 0
			$(valj).find('td').each(function(i,val){
				if (i==0) pl.num 	= $(val).text()
				if (i==1) pl.id 	= UrlValue('j', $(val).find('a').attr('href'))
				if (i==4) pl.morale = parseInt($(val).text())
				if (i==5) pl.form 	= parseInt($(val).text())
			})
			plChange[pl.num] = pl
		});

		// Get data from db
		db.transaction(function(tx) {
			tx.executeSql("SELECT plid, plnum, plform, plmorale, plfchange, plmchange FROM team"+teamid+"players", [], 
				function(tx, result){
					debug('Select ok, get data:')
					for(var i = 0; i < result.rows.length; i++) {
						var plid = result.rows.item(i)['plid']

						plChange2[plid] = []
						plChange2[plid].id 		= result.rows.item(i)['plid']
						plChange2[plid].num 	= result.rows.item(i)['plnum']
						plChange2[plid].morale 	= result.rows.item(i)['plmorale']
						plChange2[plid].form 	= result.rows.item(i)['plform']
						plChange2[plid].mchange = result.rows.item(i)['plmchange']
						plChange2[plid].fchange = result.rows.item(i)['plfchange']
						debug(result.rows.item(i)['plnum'] + ' ' + result.rows.item(i)['plid'] + ' ' +result.rows.item(i)['plform'])
					}

					// Check for update
					for(i in plChange) {
						var pl = plChange[i]
						if(plChange2[pl.id]){
							var pl2 = plChange2[pl.id]
							if (remember != 1 && (pl.morale != pl2.morale || pl.form != pl2.form)){
								remember = 1
							}
						}
					}
					// Calculate
					for(i in plChange) {
						var pl = plChange[i]
						if(plChange2[pl.id]){
							var pl2 = plChange2[pl.id]
							if (remember == 1){
								plChange[i]['mchange'] = pl.morale - pl2.morale
								plChange[i]['fchange'] = pl.form - pl2.form
							} else {
								plChange[i]['mchange'] = pl2.mchange
								plChange[i]['fchange'] = pl2.fchange
							}
						}
					}

					// Update page
					for(i in plChange) {
						$('table#tblRoster tr#tblRosterTr'		+ i + ' td:eq(4)').append(ShowChange(plChange[i]['mchange']))
						$('table#tblRoster tr#tblRosterTr'		+ i + ' td:eq(5)').append(ShowChange(plChange[i]['fchange']))
						$('table#tblRoster tr#tblRosterRentTr'	+ i + ' td:eq(4)').append(ShowChange(plChange[i]['mchange']))
						$('table#tblRoster tr#tblRosterRentTr'	+ i + ' td:eq(5)').append(ShowChange(plChange[i]['fchange']))
					}
					if (remember ==1 && team21 != 1) SaveDBtable(teamid)
				}, 
				function(tx, error){
					debug('Select data error:'+error.message)
					if (team21 != 1) SaveDBtable(teamid)
				}
			)
		});
	}
}

function SaveDBtable(teamid){
	db.transaction(function(tx) {
		tx.executeSql("DROP TABLE IF EXISTS team"+teamid+"players",[],
			function(tx, result){debug('drop table ok')},
			function(tx, error) {debug('drop table error' + error.message)}
		);                                           
		tx.executeSql("CREATE TABLE IF NOT EXISTS team"+teamid+"players (plid INT, plnum INT, plform INT, plmorale INT, plfchange INT, plmchange INT)", [],
			function(tx, result){debug('create table ok')},
			function(tx, error) {debug('create table error'	+error.message)}
		);
		for(i in plChange) {
			var pl = plChange[i]
			tx.executeSql("INSERT INTO team"+teamid+"players (plid, plnum, plform, plmorale, plfchange, plmchange) values(?, ?, ?, ?, ?, ?)", 
				[pl.id, pl.num, pl.form, pl.morale, pl.fchange, pl.mchange],
				function(tx, result){debug('insert data ok')},
				function(tx, error) {debug('insert data error:'	+error.message)
			});
		}
	});
}
function SaveStorageData(key,data){
	if(ff)	globalStorage[location.hostname][key] = data
	else	sessionStorage[key] = data
}

function GetStorageData(key){
	if(ff)	return globalStorage[location.hostname][key]
	else	return sessionStorage[key]
}
function setCookie(name, value) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 356); // +1 year
	if (!name || !value) return false;
	document.cookie = name + '=' + encodeURIComponent(value) + '; expires='+ exdate.toUTCString() + '; path=/'
	return true
}
function getCookie(name) {
    var pattern = "(?:; )?" + name + "=([^;]*);?"
    var regexp  = new RegExp(pattern)
    if (regexp.test(document.cookie)) return decodeURIComponent(RegExp["$1"])
    return false
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}
