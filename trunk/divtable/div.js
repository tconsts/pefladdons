// ==UserScript==
// @name           pefldivtable
// @namespace      pefl
// @description    division table page modification
// @include        http://*pefl.*/plug.php?p=refl&t=s&*
// @version        2.0
// ==/UserScript==

if(typeof (deb) == 'undefined') deb = false
var debnum = 0
var db = false
var teams = []
var divs = []
var div_cur = {}
var m = []
var save  = false
var save2 = false

var list2 = {
	'players':{
		'id':	{'num':1},
		'tid':	{'num':2},
		'num':	{'num':3},
		'form':	{'num':4},
		'morale': {'num':5},
		'fchange':{'num':6},
		'mchange':{'num':7},
		'value':  {'num':8},
		'valuech':{'num':9}},
	'teams': {
		'tid':	{'num':1, 'nshow':true},
		'my':	{'num':2, 'nshow':true},
		'did':	{'num':3, 'nshow':true},
		'n':	{'num':4, 'nshow':true},
		'tdate':{'num':5, 'name':'дата','nsel':true},
		'tplace':{'num':6,'name':'№','al':'left','type':'int'},
		'ncode':{'num':7, 'name':'стр','nsel':true,'type':'int'},
		'nname':{'num':8, 'name':'Страна','nsel':true,'al':'left'},
		'tname':{'num':9, 'name':'Команда','al':'left'},
		'mname':{'num':10, 'name':'Мен','nsel':true,'al':'left'},
		'ttask':{'num':11, 'name':'Задача','nsel':true,'al':'left'},
		'tvalue':{'num':12,'name':'Ном','nsel':true,'type':'int'},
		'twage':{'num':13, 'name':'ЗП','nsel':true,'type':'int'},
		'tss':	{'num':14, 'name':'СС','nsel':true,'type':'float'},
		'age':	{'num':15, 'name':'Возр','nsel':true,'type':'float'},
		'pnum':	{'num':16, 'name':'кол','nsel':true,'type':'int'},
		'tfin':	{'num':17, 'name':'Фин','nsel':true,'al':'left'},
		'screit':{'num':18,'name':'ШкРейт','nsel':true,'al':'left'},
		'scbud':{'num':19, 'name':'ШкБюд','nsel':true,'type':'int'},
		'ttown':{'num':20, 'name':'Город','nsel':true,'al':'left'},
		'sname':{'num':21, 'name':'Стадион','nsel':true,'al':'left'},
		'ssize':{'num':22, 'name':'Размр','nsel':true,'type':'int'},
		'dname':{'num':23,'name':'Див','nsave':true,'nsel':true},
		'tprize':{'num':24,'name':'Призовые','nsave':true,'nsel':true},
		'dnum': {'num':25,'nsave':true,'nshow':true},
		'games':{'num':26,'name':'И&nbsp;','nsave':true},
		'wins':	{'num':27,'name':'В&nbsp;','nsave':true},
		'draws':{'num':28,'name':'Н&nbsp;','nsave':true},
		'loses':{'num':29,'name':'П&nbsp;','nsave':true},
		'gup':	{'num':30,'name':'ГЗ','nsave':true},
		'gdown':{'num':31,'name':'ГП','nsave':true},
		'gpm':	{'num':32,'name':'+-','nsave':true},
		'score':{'num':33,'name':'О&nbsp;','nsave':true}},
	'divs':{
		'did':	{'num':1, 'name':'id'},
		'my':	{'num':2, 'name':'my'},
		'dnum':	{'num':3, 'name':'dnum'},
		'nname':{'num':4, 'name':'Страна'},
		'dname':{'num':5, 'name':'Див'},
		'drotate':{'num':6, 'name':'+-'},
		'drotcom':{'num':7, 'name':'Комент'},
		'dprize': {'num':8, 'name':'Призовые'},
		'color':  {'num':9, 'name':'Расскрас'}}
}

var showfl = false
//var filt = {}
var srt = ''
var srtn = true

var diap = []
var url = {}
var def = '1-1=FCE94F,2-2=white,3-3=E9B96E'

//document.addEventListener('DOMContentLoaded', function(){
$().ready(function() {
   	ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
	today = new Date()
	today = check(today.getDate()) + '.'+check(today.getMonth()+1)
	rseason = UrlValue('f',$('td.back4 a[href^="plug.php?p=refl&t=s&v=y&h=0&j="]:last').attr('href'))
	dseason = UrlValue('f')

	// add column with goals +/- (will be include to code for forum)
	PlusMinus();

	// Select as bold self team in my table with id=0
	if( UrlValue('k') && UrlValue('k')!=0) SelectTeam(UrlValue('k'))

	// Draw CrabVIP panel
	var preparedhtml = ''
	preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr><td width=200 id="crabgloballeft" valign=top></td><td id="crabglobalcenter" valign=top></td><td id="crabglobalright" width=200 valign=top>'
	preparedhtml += '<table id="crabrighttable" bgcolor="#C9F8B7" width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
	preparedhtml += '</td></tr></table>'
	$('body table.border:last').before(preparedhtml)
	$('td.back4 script').remove()
	$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
	$('#crabrighttable').addClass('border') 

	GetInfoPageDiv()
	var text = '<table width=100%>'
	text += '<tr id="color"><td colspan=2><a id="colorit" href="">Раскрасить</a>&nbsp(<a href="javascript:void(ColorDel())">x</a>)</td></tr>'
	text += '<tr id="CodeTableForForum"><td colspan=2><a href="javascript:void(TableCodeForForum())">Код для форума</a>&nbsp;</td></tr>'
	text += '<tr id="empty" colspan=2><td> </td></tr>'
	text += '<tr id="showteams"><td><a id="teams_cur" href="javascript:void(Print(\'teams\',\'did\',\''+div_cur.did+'\'))">Сравнить&nbsp;команды</a></td><td>(<a id="tfilter" href="javascript:void(SetFilter(\'teams\'))">'+('фильтр').fontsize(1)+'</a>)</td></tr>'
	if(deb){
		text += '<tr id="empty" colspan=2><td> </td></tr>'
		text += '<tr id="showdivs"><td colspan=2><a id="divs" href="javascript:void(Print(\'divs\',\'nname\',\''+div_cur.nname+'\'))">debug:Дивизионы</a></td></tr>'
	}
	text += '</table>'
	$("#crabright").html(text)

	GetData('teams')
	GetData('divs')

}, false);

function SetFilter(dataname){
	debug('SetFilter go: '+ showfl)
	var imgok = '<img height=10 src="system/img/g/tick.gif">'
	if(showfl){
		showfl = false
		$('tr#fl').remove()
	}else{
		showfl = true
		var head = []
		for (i in list2[dataname]) {
			if(!list2[dataname][i].nshow) {
				head[list2[dataname][i].num] = {'key':i,'name':list2[dataname][i].name}
			}
		}
//		for (i in head2) debug(dataname+':t3:'+i+':'+head2[i])

		var text = ''
		for(i in head){
			text += '<tr id="fl"><td align=right id='+head[i].key+'>'+(!list2[dataname][head[i].key].nsel || list2[dataname][head[i].key].nsel==undefined ? imgok : '')+'</td><td><a href="javascript:void(SetHead(\''+dataname+'\',\''+head[i].key+'\'))">'+head[i].name+'</a></td></tr>'
//			debug(head[i].key+':'+list2[dataname][head[i].key].nsel)
		}
		$('tr#showteams').after(text)
	}
}

function ClosePrint(){
	$('table#svod, div#svod').remove()
	$('table#orig').show()	
}

function sSort(i, ii) { //от большего к меньшему
    if 		(i[srt] < ii[srt])	return  1
    else if	(i[srt] > ii[srt])	return -1
    else						return  0
}

function sSortR(i, ii) { //реверт, от меньшего к большему
    if 		(i[srt] > ii[srt])	return  1
    else if	(i[srt] < ii[srt])	return -1
    else						return  0
}

function Print(dataname, name, value, sr){
	debug('Print:'+div_cur.did)
	ClosePrint()
	$('td.back4 table table').attr('id','orig').hide()

	var head = []
	for (i in list2[dataname]) {
		var lsti = list2[dataname][i]
		if(!lsti.nshow) {
			head[lsti.num] = {'key':i,'name':lsti.name,'al':(lsti.al!=undefined ? ' align='+lsti.al : '')}
		}
	}
//	for (i in head2) debug(dataname+':t2:'+i+':'+head2[i])

	var data = []
	switch (dataname){
//		case 'players': data = players;	break
		case 'teams': 	data = teams;	break
		case 'divs'	: 	data = divs;	break
		default: return false
	}
	if(sr==srt)	srtn = (srtn ? false : true)
	else srt = (srt =='' ? 'tplace' : sr)

	data = (srtn ? data.sort(sSort) : data.sort(sSortR))
	  
	var text = ''
	text += '<table width=100% id="svod" border="0" cellpadding="4" cellspacing="2"><tr align=left>'
	for(j in head) {
		if(list2[dataname][head[j].key].nsel!=true) {
			text += '<th>'
			text += '<a class="f" href="javascript:void(Print(\''+dataname+'\',\''+name+'\',\''+value+'\',\''+head[j].key+'\'))">'
			text += head[j].name
			text += '</a></th>'
		}
	}
	text+= '</tr>'
	var num=1
	for(i in data){
		var show = true
		var dti = data[i]
		if(name!=undefined && value!=undefined && dti[name]!=value) show = false
		if(show){
			text += '<tr align=right>'
			for(j in head) if(list2[dataname][head[j].key].nsel!=true) {
				var tt = dti[head[j].key]
				var al = ''
				if(tt == undefined || tt=='') tt = '&nbsp;'
				else{
					switch (head[j].key){
						case 'tname':
							tt = (dti['thash']!=undefined ? '<a href="plug.php?p=refl&t=k&j='+dti['tid']+'&z='+dti['thash']+'">'+tt+'</a>':'<b>' + tt + '</b>')
							break;
						case 'tvalue':	tt = ShowValueFormat(tt)+'т';break;
						case 'twage':	tt = ShowValueFormat(tt);break;
						case 'ncode':	tt = '<img height=12 src="system/img/flags/mod/'+tt+'.gif">';break;
						case 'tplace':	tt = '<font color=3465A4><u>'+parseInt((1000 - tt - dti['dnum']*100))+'</u></font>';break;
						case 'tdate':	tt = (tt==today ? ' ' : tt);break;
						default:
					}
				}
				text += '<td'+head[j].al+'>'+tt+'</td>'
			}
			text += '</tr>'
			num++
		}
	}
	text += '</table>'
	text += '<div align=right id="svod"><a href="javascript:void(ClosePrint())">(Закрыть)&nbsp;</a></div>'
	$('table#orig').before(text)
	$('table#svod tr:even:gt(0)').attr('bgcolor','#A3DE8F')
	ColorIt()
	if(save2){
		save2 = false
		SaveData('divs')
	}
}

function ShowValueFormat(value){
	if (value > 1000)	return (value/1000).toFixed(3).replace(/\./g,',') + '$'
	else				return (value) + '$'
}

function SetHead(dataname, name){ // teams, nname
	var imgok = '<img height=10 src="system/img/g/tick.gif">'

	if(!list2[dataname][name].nsel || list2[dataname][name].nsel==undefined) {
		list2[dataname][name].nsel = true
		$('td#'+name).html('')
	}
	else {
		list2[dataname][name].nsel = false
		$('td#'+name).html(imgok)
	}
	save2 = true
}

function GetFinish(type, res){
	debug(type + '(' + res + ')')
	m[type] = res;

	if(m.teams==undefined && m.get_teams!=undefined && m.get_pgdivs){
		m.teams = true
		CheckMy()
		ModifyTeams()
	}
	if(m.divs==undefined && m.get_divs!=undefined && m.get_pgdivs && m.checkmy){
		m.divs = true
		ModifyDivs()
		ColorIt()
	}
	if(m.shdel==undefined && m.get_divs!=undefined && m.get_teams!=undefined){
		m.shdel = true
		$("#crabright").append('<br><div align=right id="del"><a id="del" href="javascript:void(Delete())">'+('Удалить данные').fontsize(1)+'</a></div>')
	}
}

function CheckMy(){
	for(i in teams){
		if(teams[i].nname==div_cur.nname) {
			save = true
		}
		if(teams[i].did==div_cur.did && teams[i].my) {
			div_cur.my = true
			divs[div_cur.did] = true
		}
	}
	GetFinish('checkmy', true)
}

function SaveData(dataname){
	debug(dataname+':SaveData')
	if(!save || (rseason!=dseason) || parseInt(UrlValue('h'))>=0) {
		debug(dataname+':SaveData false')
		return false
	}
	var data = []
	var idname = 'id'
//	var head = list[dataname].split(',')
	var head = []
	for (i in list2[dataname]) {
		if(!list2[dataname][i].nsave) head[list2[dataname][i].num-1] = i
	}
	switch (dataname){
		case 'players':	data = players;				break
		case 'teams': 	data = teams;idname='tid';	break
		case 'divs': 	data = divs; idname='did';	break
		default: 		return false
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
			tx.executeSql("CREATE TABLE IF NOT EXISTS "+dataname+" ("+head+")", [],
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
//				debug(dataname+':s'+x3[0]+'_'+x3[1])
				tx.executeSql("INSERT INTO "+dataname+" ("+x1+") values("+x2+")", x3,
					function(tx, result){},
					function(tx, error) {debug(dataname+':insert('+i+') error:'+error.message)
				});
			}
		});
	}
}

function GetData(dataname){
	DeleteCookie('teamdiv')
	debug(dataname+':GetData')
	var data = []
	var idname = 'id'
//	var head = list[dataname].split(',')
	var head = []
	for (i in list2[dataname]) {
		if(!list2[dataname][i].nsave) head[list2[dataname][i].num-1] = i	
	}
	switch (dataname){
		case 'players': data = players2;			break
		case 'teams': 	data = teams;idname='tid';	break
		case 'divs'	: 	data = divs; idname='did';	break
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
					if(head[j].type == 'int') curt[head[j]] = parseInt(curt[head[j]])
					if(head[j].type == 'float') curt[head[j]] = parseFloat(curt[head[j]])
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
						var id = row[idname]
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

function Delete(){
	debug('DeleteData go')
	if(ff) {
		delete globalStorage[location.hostname]['players']
		delete globalStorage[location.hostname]['teams']
		delete globalStorage[location.hostname]['divs']
	}else{
		if(!db) DBConnect()
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE IF EXISTS players",[],function(tx, result){debug('players:deleted')},function(tx, error){debug(error.message)})
			tx.executeSql("DROP TABLE IF EXISTS teams",[],function(tx, result){debug('teams:deleted')},function(tx, error){debug(error.message)})
			tx.executeSql("DROP TABLE IF EXISTS divs",[],function(tx, result){debug('divs:deleted')},function(tx, error){debug(error.message)})
		})
	}
	$('div#del').remove()
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}

function ModifyTeams(){
	debug('ModifyTeams')
	var zag = {}
	$('td.back4 table:first table:first tr:eq(0) th').each(function(i, val){
		zag[$(val).text().split('\n')[0]] = i
	})
//	for (i in zag) debug(i+':'+zag[i])
	$('td.back4 table:first table:first tr:gt(0)').each(function(i, val){
		var id = parseInt(UrlValue('n',$(val).find('a:has(u)').attr('href')))
		if(typeof(teams[id])=='undefined') {
			teams[id] = {}
			teams[id].tid = id
			teams[id].tname = $(val).find('a[href^="plug.php?p=refl&t=k&j='+id+'&z="]').text()
		}
		teams[id].games = $(val).find('td:eq('+zag['И']+')').text()
		teams[id].wins 	= $(val).find('td:eq('+zag['В']+')').text()
		teams[id].draws	= $(val).find('td:eq('+zag['Н']+')').html()
		teams[id].loses	= $(val).find('td:eq('+zag['П']+')').html()
		teams[id].gup	= $(val).find('td:eq('+zag['ГЗ']+')').html()
		teams[id].gdown	= $(val).find('td:eq('+zag['ГП']+')').html()
		teams[id].gpm	= $(val).find('td:eq('+zag['+-']+')').html()
		teams[id].score	= $(val).find('td:eq('+zag['О']+')').html()
		teams[id].thash = UrlValue('z',$(val).find('a[href^="plug.php?p=refl&t=k&j='+id+'&z="]').attr('href'))
		teams[id].tplace= 1000-div_cur.dnum*100-i-1
		teams[id].did   = div_cur.did
		teams[id].nname = div_cur.nname
		teams[id].dname = div_cur.dname
		teams[id].dnum  = div_cur.dnum
//		teams[id].tprize = (divs[div_cur.did].dprize!=undefined && divs[div_cur.did].dprize!='' ? divs[div_cur.did].dprize.split(',')[i+1] : '')
	})
	SaveData('teams')
}

function ModifyDivs(){
	debug('ModifyDivs')
	var divt = []
	var id = div_cur.did
	if(typeof(divs[id])=='undefined') divs[id] = {}
	for(var i in div_cur){
		divt[i] = (div_cur[i] != '' ? div_cur[i] : (typeof(divs[id][i])!='undefined' ? divs[id][i] : ''))
	}
	divs[id] = divt

	if(divs[id].drotcom!='') $('td.back4 table:eq(1)').after('<br><i><b>Выдержка из правил о переходах команд между дивизионами</b>:<br>*'+divs[id].drotcom+'</i><br>')

	GetFinish('md_divs',true)
	SaveData('divs')
}

function GetInfoPageDiv(){
	debug('GetInfoDivs')
	div_cur.nname = $('td.back4 td.back1').text().split(', ')[0]
	div_cur.dname = $('td.back4 td.back1').text().split(', ')[1]
	div_cur.my = false
	div_cur.nt = parseInt($('td.back4 table:first table:first tr:last u').html())
//	debug('nt='+div_cur.nt)
	$('a[href*="p=refl&t=s&k=0&"]').each(function(i, val){
		if($(val).text() == div_cur.dname) {
			div_cur.dnum = i+1
			div_cur.did = parseInt(UrlValue('j',$(val).attr('href')))
		}
	})
	div_cur.dprize  = ''
	div_cur.drotate = ''
	div_cur.drotcom = ''
	div_cur.color = ''

//	for(i in div_cur) debug('d'+i+':'+div_cur[i])

	GetFinish('get_pgdivs',true)
}

function ShowPriz(x){
	var y = x.split('-')
	$('td.back1 span.text2b').append(' (призовые)')
	$('td.back4 table table th[width=13%]').before('<th>Призовые\n\t')
	$("td.back4 table table tr:gt(0)").each(function(i,val){
		var htm = 	'<td align=right>'
		htm += 		(y[i] == undefined || y[i] == 0 ? 0 : y[i]+',000')
		htm += 		'$</td>'
		$(val).find('td:has(u)').before(htm)
	})
	$('div[id^="show"] a').removeAttr('href')
}

function getCookie(name) {
    var pattern = "(?:; )?" + name + "=([^;]*);?"
    var regexp  = new RegExp(pattern)
    if (regexp.test(document.cookie)) return decodeURIComponent(RegExp["$1"])
    return false
}

function PlusMinus(){
	$('td.back4 table table th[width="7%"]').attr('width','6%')
	$('td.back4 table table th[width="13%"]').attr('width','11%')
	$('td.back4 table table th[width="44%"]').attr('width','41%')
	$('th:last').before('<th width="6%">+-\n\t').append('\n')
	$('th:contains(№)').parent().parent().find('tr').each(function(){
		var gz = +$(this).find('td:last').prev().prev().text()
		var gp = +$(this).find('td:last').prev().text()
		var td  = '<td>' +  (gz > gp ? '+' : '') + (gz-gp) + '</td>'
		$(this).find('td:last').before(td)
	})
}

function DeleteCookie(name) {
	debug('DeleteCookie: '+name)
/**/
	var exdate=new Date();
	exdate.setDate(exdate.getDate() - 1); // -1 d
	if (!name) return false;
	document.cookie = name + '=; expires='+ exdate.toUTCString() + '; path=/'
/**/
	return true
}

function ColorIt(){
	debug('ColorIt:'+div_cur.did)
	debug('ColorIt:'+divs[div_cur.did].nname)
//	for( i in divs) debug('ColorIt:'+divs[i].did+':'+divs[i].nname)
	diap[div_cur.did] = []	

	if(divs[div_cur.did].color == '' || divs[div_cur.did].color==null){
		debug('empty'+divs[div_cur.did].color)
		if (getCookie('pefltables')) {
			var dp = getCookie('pefltables').replace(/\!/g,'=').split('.')	// '43*1-2!white*3-6!FCE94F*15-26!BABDB6.44*1-2!white*18-22!BABDB6'
			for (var p in dp) {
				//debug(dp[p])
				var name = parseInt(dp[p].split('*',1)[0])
				var key = dp[p].split('*')
				key.shift()
				if(typeof(divs[name])=='undefined') divs[name] = {}
				divs[name].color = key.join(',')
			}
			SaveData('divs')
			DeleteCookie('pefltables')
		}
	}

	if(divs[div_cur.did].color == '' || divs[div_cur.did].color==null){
		var dr = (divs[div_cur.did].drotate!='' ? divs[div_cur.did]['drotate'].split(',') : false)
		debug('ColorIt:'+dr)
		if(dr!=false){
			if(dr[0]==0) {
				debug('ColorIt:'+'champ')
				diap[div_cur.did].push('1-1=FCE94F')
				diap[div_cur.did].push('2-2=white')
				diap[div_cur.did].push('3-3=E9B96E')
			}else{
				diap[div_cur.did].push('1-'+dr[0]+'=white')
			}
			diap[div_cur.did].push((div_cur.nt-dr[1])+'-'+dr[1]+'=BABDB6')			
		}
	}else{
		var str = String(divs[div_cur.did].color).split(',')
		for( i in str) diap[div_cur.did].push(str[i])
	}
	ColorTable(div_cur.did);
}

/**/
function ColorTable(tableid){
	debug('ColorTable:'+tableid)
	if (diap[tableid]){
		$('td.back4 table table:first tr').each(function(i,val){
//			debug('ColorTable:'+i+':'+diap[tableid])
			for (var j in diap[tableid]) {
				var d = diap[tableid][j]
				if (i>= +d.split('=')[0].split('-')[0] && i <= +d.split('=')[0].split('-')[1]) {
					$(val).attr("bgcolor", d.split('=')[1])
				}
			}
		})
	}
	$('a#colorit').attr('href','javascript:void(ColorGet(\''+ (diap[tableid]!='' ? diap[tableid].join() : def) +'\'))')
}
/**/

function ColorGet(curVal){
	debug('ColorGet:'+div_cur.did)
	var retVal = prompt('Задайте цвет таблицы', curVal);
	if (retVal != null) {
		divs[div_cur.did].color = retVal
		diap[div_cur.did] = retVal.split(',');
		$('td.back4 table table:first tr').removeAttr('bgcolor')
		$('td.back4 table table:first tr:odd').attr('bgcolor','#a3de8f')
   		ColorIt()
		SaveData('divs')
	}
	return true
}

function ColorDel(){
	debug('ColorDel:'+div_cur.did)
	$('td.back4 table table:first tr').removeAttr('bgcolor')
	$('td.back4 table table:first tr:odd').attr('bgcolor','#a3de8f')
	divs[div_cur.did].color = ''
	diap[div_cur.did] = ''
	ColorIt()
	SaveData('divs')
	return true	
}

function SelectTeam(teamid){
	var maxturs = (parseInt($('td.back4 table table tr:last td:first').text())-1)*2
	var curgames = parseInt($('td.back4 table table tr:last td:eq(2)').text())
	var teamo = parseInt($("tr td a[href*='plug.php?p=refl&t=k&j="+teamid+"&']").parent().parent().find('td:last').text())
	var maxo = (maxturs - curgames)*3
	var bg = ''
	$('td.back4 table table tr').each(function(i,val){
		if(i > 0){
			var curteamo = parseInt($(val).find('td:last').text())
			if( curteamo < teamo + 3.1 && curteamo > teamo - 3.1) {
				bg = ' bgcolor=green'
			} else if( (curteamo  < teamo + maxo + 0.1) && (curteamo + maxo + 0.1 > teamo)) {
				bg = ' bgcolor=82df63' //A3DE8F'
			} else {
				bg = ' bgcolor=C9F8B7'
			}
			$(val).prepend('<td' + bg + '> </td>')
		} else {
			$(val).prepend('\t<th width=1%>\n')
		}

	})
	var td_data = $("tr td a[href*='plug.php?p=refl&t=k&j="+teamid+"&']").parent().html()
	$("tr td a[href*='plug.php?p=refl&t=k&j="+teamid+"&']").parent().html('<b>' + td_data + '</b>')
}

function TableCodeForForum(){

	// change big flags for eurocups in table
	$('td.back4 table table:first').find('img[src*=system/img/flags/]').each(function(){
//	debug($(this).attr('src'))
	// need fill base key=peflid, value=2 symbols tag: system/img/flags/155.gif -> system/img/flags/f-ru.gif
		var f = []
		f[1]='al';	//Албания
		f[2]='dz';	//Алжир
		f[8]='ar';	//Аргентина
		f[9]='am';	//Армения
		f[11]='au';	//Австралия
		f[12]='at';	//Австрия
		f[13]='az';	//Азербайджан
		f[18]='by';	//Беларусь
		f[19]='be';	//Бельгия
		f[24]='bo';	//Боливия
		f[25]='ba';	//Босния
		f[27]='br';	//Бразилия
		f[30]='bg';	//Болгария
		f[41]='cl';	//Чили
		f[42]='cn';	//Китай
		f[44]='co';	//Колумбия
		f[47]='cr';	//Коста-Рика
		f[48]='hr';	//Хорватия
		f[50]='cy';	//Кипр
		f[51]='cz';	//Чехия
		f[53]='dk';	//Дания
		f[58]='ec';	//Эквадор
		f[59]='eg';	//Египет
		f[61]='en';	//Англия
		f[64]='ee';	//Эстония
		f[66]='mk';	//Македония
		f[69]='fi';	//Финляндия
		f[70]='fr';	//Aранция
		f[73]='ge';	//Грузия
		f[74]='de';	//Германия
		f[76]='gr';	//Греция
		f[84]='nl';	//Голландия
		f[87]='hu';	//Венгрия
		f[88]='is';	//Исландия
		f[91]='ir';	//Иран
		f[93]='ie';	//Ирландия
		f[94]='il';	//Израиль
		f[95]='it';	//Италия
		f[96]='ci';	//Кот`д`Ивуар
		f[98]='jp';	//Япония
		f[100]='kz';	//Казахстан
		f[105]='lv';	//Латвия
		f[111]='lt';	//Литва
		f[122]='mx';	//Мексика
		f[123]='md';	//Молдова
		f[126]='ma';	//Морокко
		f[129]='nt';	//Сев. Ирландия
		f[137]='ng';	//Нигерия
		f[139]='no';	//Норвегия
		f[145]='py';	//Парагвай
		f[147]='pe';	//Перу
		f[149]='pl';	//Польша
		f[150]='pt';	//Португалия
		f[152]='qa';	//Катар
		f[154]='ro';	//Румыния
		f[155]='ru';	//Россия
		f[160]='sa';	//Сау. Аравия
		f[161]='http://pefladdons.googlecode.com/svn/trunk/f-161.gif';	//Шотландия	
		f[166]='sk';	//Словакия
		f[167]='si';	//Словения
		f[170]='za';	//ЮАР
		f[171]='kr';	//Корея
		f[172]='es';	//Испания
		f[180]='se';	//Швеция
		f[181]='ch';	//Швейцария
		f[191]='tn';	//Тунис
		f[192]='tr';	//Турция
		f[195]='ae';	//ОАЭ
		f[196]='us';	//США
		f[200]='ua';	//Украина
		f[201]='uy';	//Уругвай
		f[202]='uz';	//Узбекистан
		f[204]='ve';	//Венесуэла
		f[207]='wl';	//Уэльс
		f[209]='yu';	//!!Сербия
		f[214]='http://pefladdons.googlecode.com/svn/trunk/f-214.png';	//Черногория

		var tarr = $(this).attr('src').split('.')[0].split('/')
		var fid = tarr[tarr.length-1]
		var img = '<img src="'
		if (f[fid]) {
			if (fid == 161 || fid ==214) img += f[fid]
			else img += 'system/img/flags/f-' + f[fid] + '.gif'
		} else img += 'system/img/flags/f-00.gif'
		img += '"> '

		$(this).parent().prepend(img)
		$(this).remove()
	})

	// resize columns for forum print
	$('td.back4 table table th[width=26%]').attr('width','39%')
	$('td.back4 table table th[width=13%]').attr('width','15%')
	$('td.back4 table table th[width=7%]').removeAttr('width')
	$('td.back4 table table th[width=6%]').removeAttr('width')
	$('td.back4 table table th[width=5%]').removeAttr('width')
	//$('td.back4 table table a#f').remove()

	// generate code for forum
	var x = '<div align="right">(<a href="'+window.location.href+'">x</a>)&nbsp;</div>'
	x += '<br>Код для форума<br><br><textarea rows="20" cols="80" readonly="readonly" id="CodeTableForForum" selected>'
	x += '[b][url=plug.php?' + location.search.substring(1) + ']#[/url] '
	x += $('td.back4 td.back1').text()
	x += '[/b]\n'
	x += $('td.back4 table:eq(1)')
		.find('img').removeAttr('ilo-full-src').end()		// fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
		.find('img').removeAttr('height').end()
		.find('a.f').removeAttr('href').removeAttr('class').end()
		.html()
		.replace(/<tbody>/g,'<table width=100% bgcolor=#C9F8B7>')
		.replace(/<\/tbody>/g,'')
		.replace(/<small>/g,'')
		.replace(/<\/small>/g,'')
		.replace(/font color/g,'color')
		.replace(/\/font/g,'/color')
		.replace(/<th><a>/g,'[td][b]')
		.replace(/<\/a><\/th>/g,'[/b][/td]')
		.replace(/<\/th>/g,'')
		.replace(/\t<th(.*)>(.*)\n/g,'<td$1><b>$2</b></td>')
		.replace(/\/td><tr/g,'/td></tr><tr')
		.replace(/a href=\"/g,'url=')
		.replace(/\/a/g,'/url')
		.replace(/\</g,'[')
		.replace(/\>/g,']')
		.replace(/\&amp\;/g,'&')
		.replace(/img src="/g,'img]')
		.replace(/.gif/g,'.gif[/img')
		.replace(/.png/g,'.png[/img')
		.replace(/"/g,'')
		.replace(/ width=25/g,'')
	x += '[/table]'

	x += '\n\n\n[center]--------------- [url=forums.php?m=posts&q=173605]Крабовый VIP[/url] ---------------[/center]\n';
	x += '</textarea><br>'
	x += '<br>1. Ctrl+A: выделить весь текст в форме'
	x += '<br>2. Ctrl+C: скопировать выделеное в буфер'
	x += '<br>3. Ctrl+V: вставить из буфера в форум'

	$('td.back4').html(x)
	$('#CodeTableForForum').select()
	$('td#crabglobalright').empty()
	return true
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

function check(d) {return (d<10 ? "0"+d : d)}

function debug(text) {if(deb) {debnum++;$('td#crabgloballeft').append(debnum+'&nbsp;\''+text+'\'<br>');}}