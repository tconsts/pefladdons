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

//document.addEventListener('DOMContentLoaded', function(){

var countSostav = 0
var players = []
var team = {}
team.wage = 0
team.wage2 = 0
team.wage3 = 0
team.value = 0
team.value2 = 0
team.value3 = 0
var type = ''

var skills = {
/**/
	'N'	  : 'pn',
	'Имя' : 'name',
	'Поз' : 'position',
	'Фор' : 'form',
	'Мор' : 'morale',
	'Сум' : 'sumskills',
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
/**/
}


$().ready(function() {
	if(UrlValue('l')=='y' || UrlValue('n')!=false){
	//Page for show skills
	}else{
		// Draw right panel and fill data
		var preparedhtml = ''
		preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr><td width=200></td><td id="crabglobalcenter"></td><td id="crabglobalright" width=200 valign=top>'
		preparedhtml += '<table id="crabrighttable" bgcolor="#C9F8B7" width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
		preparedhtml += '</td></tr></table>'
		$('body table.border:last').before(preparedhtml)
		$('td.back4 script').remove()
		$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
		$('#crabrighttable').addClass('border') 
		var text3 =	'<table width=100%><tr><th colspan=3>Финансовое положение</th></tr>'
		text3 += 	'<tr><td id="finance1"></td><td id="finance2" colspan=2></td></tr>'
		text3 += 	'</table><br>'
		$("#crabright").html(text3)

		cid = parseInt($('td.back4 table:first table td:first').text())
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

function ShowFilter(){
	var style = $('table#tblRosterFilter').attr('style')
	if(style == "display: none" || style == "display: none;" || style == "display: none; "){
		$('table#tblRosterFilter').show()
		$('div#filter').show()
	}else{
		$('table#tblRosterFilter').hide()
		$('div#filter').hide()
		Filter(3,'')
	}
}

var pos1 = {'C' :0}
var pos2 = {'GK':0}
function Filter(num,p){
	if(num==3){
		for(i in pos1) pos1[i] = 0
		for(i in pos2) pos2[i] = 0
	} else if(num==1){
		pos1[p] = (pos1[p]==undefined || pos1[p]==0 ? 1 : 0)
	} else {
		pos2[p] = (pos2[p]==undefined || pos2[p]==0 ? 1 : 0)
	}
	var sumpos1 = 0
	var sumpos2 = 0
	for (i in pos1) sumpos1 += parseInt(pos1[i])
	for (i in pos2) sumpos2 += parseInt(pos2[i])
	var sumpos = sumpos1 + sumpos2
	var selectTDcolor = 'green'//'D3D7CF'
	var selectFLcolor = 'white'

    $('table#tblRosterFilter th').removeAttr('bgcolor')
	$('table#tblRosterFilter td').each(function(){
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
	$('table#tblRoster tr:gt(0)').each(function(j,val){
		$(val).hide()
		var position = $(val).find('td:last').text()
		var kmark = 0
		var lmark = 0
		for (k in pos1) if(sumpos1==0 || (position.indexOf(k)>-1 && pos1[k]==1)) kmark=1
		for (l in pos2) if(sumpos2==0 || (position.indexOf(l)>-1 && pos2[l]==1)) lmark=1
		if((kmark==1 && lmark==1) || sumpos == 0) $(val).show()
	})
}

countSk = [0]
function CountSkills(tdid){
    if(countSk[tdid]!=undefined && countSk[tdid]==1) countSk[tdid] = 0
	else countSk[tdid] = 1
	$('table#tblRoster tr').each(function(j, valj){
		var sumsel = 0
		$(valj).find('td').each(function(i, val){
			$(val).removeAttr('bgcolor')
			if(countSk[i] == 1) {
				sumsel += (isNaN(parseInt($(val).html())) ? 0 : parseInt($(val).html()))
				$(val).attr('bgcolor','white')
			}
		})
		if(j>0) $(valj).find('td:eq(2)').html('<b>'+(sumsel==0 ? players[j].sumskills : sumsel)+'</b>')
	})
}

function ShowSkills(first){
	Filter(3,'')
	for( i in countSk) countSk[i] = 0

	if( type == 'img') type = 'num'
	else type = 'img'

	$('td#crabglobalright').html('')
	$('table#tblRoster tr').remove()
	$('table#tblRoster')
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

	if(first == 1){
		$('table#tblRosterFilter')
			.attr('width','50%')
			.attr('align','center')
			.attr('cellspacing','1')
			.attr('cellpadding','1')
			.after('<div id="filter">&nbsp;</div>')
			.before('<a href="javascript:void(ShowSkills())">Стрелки</a> | <a href="javascript:void(ShowFilter())">Фильтр >></a>')
			.html(filter)
	    ShowFilter()
	}

	var hd = 'N Имя Сум лид дрб удр пас вид глв<br>вых нав длу псо<br>реа ско штр впз угл<br>рук тех мощ отб рбт вын Мор Фор Поз'
	var hd2= hd.split(' ')

	var header = '<tr align="left" style="font-weight:bold;" id="tblRostSkillsTHTr0">'
	header += '<td><a class="sort">'+hd2.join('</a></td><td><a class="sort">')+'</a></td>'
	header += '</tr>'
	$('table#tblRoster').append(header)
	$('table#tblRoster tr:first a').each(function(i,val){
		$(val).attr('href','javascript:void(CountSkills('+i+'))')
	})

	for(i=1;i<players.length;i++) {
		var tr ='<tr id="'+players[i].position+'">'
		for(j in hd2) {
			var skn = hd2[j]
			var key1 = players[i][skills[skn.split('<br>')[0]]]
			var key2 = players[i][skills[skn.split('<br>')[1]]]
			var sk = (key1!=undefined ? key1 : key2)
			if(skn=='Имя') 					tr += '<td><a href="plug.php?p=refl&t=p&j='+players[i].id+'&z='+players[i].hash+'">'+sk+'</a></td>'
			else if(skn=='Поз') 			tr += '<td>'+sk+'</td>'
//			else if(skn=='Мор'||skn=='Фор')	tr += '<td align=center>'+sk+'</td>'
			else if(skn=='Сум') 			tr += '<td><b>'+parseInt(sk)+'</b></td>'
			else if(!isNaN(parseInt(sk)) && type=='num')	tr += '<td>'+parseInt(sk)+'</td>'
			else if(!isNaN(parseInt(sk)) && type=='img')	tr += '<td>'+String(sk).split('.')[0]+(String(sk).split('.')[1]!=undefined ? '&nbsp;<img height="10" src="system/img/g/'+String(sk).split('.')[1]+'.gif"></img>' : '')+'</td>'
			else 							tr += '<td> </td>'
		}
		tr += '</tr>'
		$('table#tblRoster').append(tr)
	}
	$('table#tblRoster tr:even').attr('bgcolor','a3de8f')
	$('table#tblRoster tr:odd').attr('bgcolor','C9F8B7')

	// Усредненый игрок
/**
	tr = '<tr align=center id="LCR GK/SW/DF/DM/MF/AM/FW" bgcolor=#88C274>'
	for(j in hd2) {
		var skn = hd2[j]
		var key1 = players[0][skills[hd2[j].split('<br>')[0]]]
		var key2 = players[0][skills[hd2[j].split('<br>')[1]]]
		var sk = (key1!=undefined ? key1 : key2)
		if(skn=='N')						tr += '<td> </td>'
		else if(skn=='Фор' || skn=='Мор')	tr += '<td>'+parseFloat(sk).toFixed(1)+'</td>'
		else if(skn=='Имя') 				tr += '<td align=left>Усредненый игрок</td>'
		else if(!isNaN(parseFloat(sk)))		tr += '<td>'+parseFloat(sk).toFixed(1)+'</td>'
		else 								tr += '<td> </td>'
	}
	tr += '</tr>'
	$('table#tblRoster').append(tr)
/**/
	$('span#tskills').html('Ростер команды')
	$('a#tskills').attr('href','')
}

function PlayersInfoGet(){
	players[0] = {}
	players[0].sumskills = 0
	players[0].morale = 0
	players[0].form = 0
	$('tr[id^=tblRosterTr]').each(function(i,val){
		var purl = $(val).find('a[trp="1"]').attr('href')
		var pid = UrlValue('id',purl)
		var pn	= parseInt($(val).find('td:first').text())
		players[pn] = {}
		players[pn].pn 			= pn
		players[pn].id 			= pid
		players[pn].hash		= UrlValue('z',$(val).find('td:eq(1) a:first').attr('href'))
		players[pn].name		= $(val).find('td:eq(1) a').html()
									.split('<img')[0]
									.replace('(*)','')
									.replace('<i>','')
									.replace('</i>','')
		players[pn].nid			= $(val).find('td:eq(2) img').attr('src')
									.split('/')[4]
									.split('.')[0]
		players[pn].age			= parseInt($(val).find('td:eq(3)').html())
		players[pn].morale		= parseInt($(val).find('td:eq(4)').html())
		players[pn].form		= parseInt($(val).find('td:eq(5)').html())
		players[pn].position	= $(val).find('td:eq(11)').html()
									.replace(/\s/g,'&nbsp;')

		players[0].morale 	+= players[pn].morale/countSostavMax
		players[0].form 	+= players[pn].form/countSostavMax

		$('td.back4').append('<table id=pl'+pn+' style="display: none;"><tr><td id=pl'+pn+'></td></tr></table>')
		$('td#pl'+pn).load(purl+' center:first', function(){GetPl(pn);})		
	})
}

function CountryInfoGet(){
	teamManagerNick = $('td.back4 table:first table:eq(1) table td:first span').text()
	var srch="Вы вошли как "
	var curManagerNick = $('td.back3 td:contains('+srch+')').html().split(',',1)[0].replace(srch,'')
	if(teamManagerNick == curManagerNick){
		var country_id = UrlValue('j',$('td.back4 table:first table td:eq(1) a').attr('href'))
		var country_name = $('td.back4 table:first table td:eq(3)').text().split(', ')[1].replace(')','')
		var tdiv = getCookie('teamdiv');
		var tdivarr = []
		if(tdiv != false) {
			tdivarr = tdiv.split('!')
		}
		tdivarr[0] = cid
		tdivarr[1] = country_name
		var ck = ''
		ck = tdivarr.join('!')
		setCookie('teamdiv',ck);
//		$('td.back4').prepend(ck+'<br>')
	} 
	
}

function GetPl(pn){
	// get player skills
	var skillsum = 0
	$('td#pl'+pn+' table:first td:even').each(function(){
		var skillarrow = ''
		var skillname = $(this).html();
		var skillvalue = parseInt($(this).next().html().replace('<b>',''));
		if(players[0][skillname] == undefined) players[0][skillname] = 0

		if ($(this).next().find('img').attr('src') != undefined){
			skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
		}
		skillsum += skillvalue;
		players[pn][skillname] = skillvalue + skillarrow;
		players[0][skillname] += skillvalue/countSostavMax

	})
	players[pn].sumskills = skillsum
	players[0].sumskills += skillsum/countSostavMax

	// get player header info
	$('td#pl'+pn+' table').remove()
	var head = $('td#pl'+pn+' b:first').html()
	players[pn].natfull 	= head.split(' (матчей')[0].split(', ')[1]
	players[pn].value		= parseInt(head.split('Номинал: ')[1].split(',000$')[0].replace(/,/g,''))*1000
	players[pn].contract 	= parseInt(head.split('Контракт: ')[1])
	players[pn].wage 		= parseInt(head.split('г., ')[1].split('$')[0].replace(/,/g,''))

	team.wage	+= players[pn].wage
	team.value	+= players[pn].value/1000
	$('table#pl'+pn).remove()
	Ready()
}

function Ready(){
	countSostav++
	if(countSostav==countSostavMax){
		// Print debug
		var debug = ''
		debug += '<br>'+team.value
		debug += '<br>'+team.wage
		for(j in players){
			debug +='<br>'+j+': '
			for(i in players[j]) debug += players[j][i]+','
		}
//		$('td.back4').prepend(debug)

		if(team.wage>0){ // if VIP

			// print link to skills page
			if($('td.back4 table table:eq(1) tr:last td:last').html().indexOf('Скиллы')==-1){
				$('td.back4 table table:eq(1) tr:last td:last').append('| <a id="tskills" href="javascript:void(ShowSkills(1))"><span id="tskills">Скилы игроков</span></a>&nbsp;')
			}

			// print to right menu
			var thtml = ''
			thtml += '<tr><th colspan=2><br>Номиналы</th><th width=30%></th></tr>'
			thtml += '<tr><td>состав:</td><td align=right>'
			thtml += (((team.value)/1000).toFixed(3).replace(/\./g,',')+',000$').fontsize(1)
			thtml += '</td></tr>'
			if(team.value2!=0){
				thtml += '<tr><td>арендовано:</td><td align=right>'
				var nom2pr = team.value2
				if(nom2>=1000) nom2pr = (team.value2/1000).toFixed(3)
				thtml += (String(nom2pr).replace(/\./g,',')+',000$').fontsize(1)
				thtml += '</td></tr>'
			}
			if(team.value3!=0){
				thtml += '<tr><td>в&nbsp;аренде:</td><td align=right>'
				var nom3pr = team.value3
				if(team.value3>=1000) nom3pr = (team.value3/1000).toFixed(3)
				thtml += (String(nom3pr).replace(/\./g,',')+',000$').fontsize(1)
				thtml += '</td></tr>'
			}
			thtml += '<tr><th colspan=2><br>Зарплаты</th><th width=30%></th></tr>'
			thtml += '<tr><td>состав:</td><td align=right>'
			thtml += (((team.wage)/1000).toFixed(3).replace(/\./g,',')+'$').fontsize(1)
			thtml += '</td></tr>'
			if (team.wage2 !=0) {
				thtml += '<tr><td>арендовано:</td><td align=right>'
				var wage2pr = team.wage2
				if(team.wage2>=1000) wage2pr = (team.wage2/1000).toFixed(3)
				thtml += (String(wage2pr).replace(/\./g,',')+'$').fontsize(1)
				thtml += '</td></tr>'
			} 
			if(team.wage3!=0){
				thtml += '<tr><td>в&nbsp;аренде:</td><td align=right>'
				var wage3pr = team.wage3
				if(team.wage3>=1000) wage3pr = (team.wage3/1000).toFixed(3)
				thtml += (String(wage3pr).replace(/\./g,',')+'$').fontsize(1)
				thtml += '</td></tr>'
			}
			$('#crabright table').append(thtml)

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
			tfin[cid].zp = team.wage
			tfin[cid].nom = team.value
			//Save
			var text = ''
			for(j in tfin) text += j + ':' + tfin[j].zp + ':' + tfin[j].nom + ','
			sessionStorage.teamsfin = text
		}

	}
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

function ShowChange(value){
	if(value > 0) 		return '<sup><font color="green">+' + value + '</font></sup>'
	else if(value < 0)	return '<sup><font color="red">' + value + '</font></sup>'
	else 		  		return ''
}

function EditFinance(){
	var txt = $('table.layer1 td.l4:eq(1)').text().split(': ')[1]
	var txt2 = ''
	switch (txt){
		case 'банкрот': 				 txt2 += 'меньше 0'		;break;
		case 'жалкое': 					 txt2 += '1т$ - 200т$'	;break;
		case 'бедное': 					 txt2 += '200т$ - 500т$';break;
		case 'среднее': 				 txt2 += '500т$ - 1м$'	;break;
		case 'нормальное': 				 txt2 += '1м$ - 3м$'	;break;
		case 'благополучное': 			 txt2 += '3м$ - 6м$'	;break;
		case 'отличное': 				 txt2 += '6м$ - 15м$'	;break;
		case 'богатое': 				 txt2 += '15м$ - 40м$'	;break;
		case 'некуда деньги девать :-)': txt2 += 'больше 40м$'	;break;
		default:
			var fin = parseInt(txt.replace(/,/g,'').replace('$',''))
			if (fin >= 40000000) 		{txt = 'некуда деньги девать';	txt2 = 'больше 40м$'}
			else if (fin >= 15000000)	{txt = 'богатое';				txt2 = '15м$ - 40м$'}
			else if (fin >= 6000000) 	{txt = 'отличное';				txt2 = '6м$ - 15м$'}
			else if (fin >= 3000000) 	{txt = 'благополучное';			txt2 = '3м$ - 6м$'}
			else if (fin >= 1000000) 	{txt = 'нормальное';				txt2 = '1м$ - 3м$'}
			else if (fin >= 500000) 	{txt = 'среднее';				txt2 = '500т$ - 1м$'}
			else if (fin >= 200000) 	{txt = 'бедное';					txt2 = '200$ - 500т$'}
			else if (fin >=0) 			{txt = 'жалкое';					txt2 = '1т$ - 200т$'}
			else if (fin < 0) 			{txt = 'банкрот';				txt2 = 'меньше 0'}
	}
	$('#finance1').html(txt)
	$('#finance2').html(txt2)
}

function TeamHeaderInfoGet(){
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
}

function PlayersChange(){
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
}
/**/