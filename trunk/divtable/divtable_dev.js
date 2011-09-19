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
var list = 'tid,tname,ttask,ttown,sname,ssize,ncode,nname,did,twage,tvalue,tdate,mname,mid,tss,pnum,tplace'

var diap = []
var url = {}
var def = '1-1!FCE94F,2-2!white,3-3!E9B96E'
var tbid = -1;

//document.addEventListener('DOMContentLoaded', function(){
$().ready(function() {
   	ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)

	// add column with goals +/- (will be include to code for forum)
	PlusMinus();

	// Colorize table if need
	ColorIt()

	// Select as bold self team in my table with id=0
	if( UrlValue('k') && UrlValue('k')!=0) SelectTeam(UrlValue('k'))

	// Draw CrabVIP panel
	var text = ''
	text += '<div id="color"><a href="javascript:void(getValue(\'' + tbid + '\',\''+ (diap[tbid] ? diap[tbid].join() : def) +'\'))">Расскрасить</a></div>'
	text += '<div id="CodeTableForForum"><a href="javascript:void(TableCodeForForum())">Код для форума</a>&nbsp;</div>'
	text += '<br>'
	text += '<div id="showtasks"><a href="javascript:void(SetTasks(1))">Показать задачи</a>&nbsp;</div>'
	text += '<div id="showstadio"><a href="javascript:void(SetTasks(2))">Показать стадионы</a>&nbsp;</div>'
	text += '<div id="showfinance"><a href="javascript:void(SetFin())">Показать финансы</a>&nbsp;</div>'
	text += '<br><br><a id="teams" href="javascript:void(PrintTeams())">Команды</a><br>'

	var preparedhtml = ''
	preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr><td width=200 id="crabgloballeft" valign=top></td><td id="crabglobalcenter" valign=top></td><td id="crabglobalright" width=200 valign=top>'
	preparedhtml += '<table id="crabrighttable" bgcolor="#C9F8B7" width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
	preparedhtml += '</td></tr></table>'
	$('body table.border:last').before(preparedhtml)
	$('td.back4 script').remove()
	$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
	$('#crabrighttable').addClass('border') 
	$("#crabright").html(text)
//	CountryInfoGet();
	GetDataTm()
}, false);


function GetFinish(type, res){
	debug(type + ' ' + res + ' ')
	m[type] = res;
	if(m.get_tm!=undefined){
		CountryInfoGet()
	}

	//PrintRightInfo()
}

function GetDataTm(){
	if(ff) {
//		delete globalStorage[location.hostname]['playersvalue']
//		delete globalStorage[location.hostname]['tasks']
		var text1 = globalStorage[location.hostname]['teams']
		if (text1 != undefined){
			var ttext = String(text1).split(',')
			for (i in ttext) {
				var zag = list.split(',')
				var x = ttext[i].split(':')
				var curt = []
				var num = 0
				for(j in zag){
					curt[zag[j]] = (x[num]!=undefined ? x[num] : '')
					num++
				}
				teams[curt.id] = []
				if(curt.id!=undefined) teams[curt.id] = curt
			}
			debug('GetDataTm ok(GS)')
			GetFinish('get_tm', true)
		} else {
			debug('GetDataTm fail(GS)')
			GetFinish('get_tm', false)
		}			

		debug('GetDataTm empty(GS)')
		GetFinish('get_tm',true)
	}else{
		if(!db) DBConnect()
		debug('GetDataTm go(DB)')
		db.transaction(function(tx) {
//			tx.executeSql("DROP TABLE IF EXISTS teams")
			tx.executeSql("SELECT * FROM teams", [],
				function(tx, result){
					debug('Select teams ok')
					for(var i = 0; i < result.rows.length; i++) {
						teams[result.rows.item(i).tid] = result.rows.item(i)
					}
					for(var i in teams) debug('g'+teams[i].tid+ '_' + teams[i].tdate + '_' + teams[i].dname)
					GetFinish('get_tm',true)
				},
				function(tx, error){
					debug(error.message)
					GetFinish('get_tm', false)
				}
			)
		})
	}
}

function SaveDataTm(){
	if(ff) {
		var text = ''
		for (var i in teams) {
			if(typeof(teams[i])!='undefined') {
				var tmi = teams[i]
				var zag = list.split(',')
				text += tmi.tid
				for(var j in zag) text += ':' + (tmi[zag[j]]==undefined ? '' : tmi[zag[j]])
				text += ','
			}
		}
		globalStorage[location.hostname]['teams'] = text
		debug('SaveDataTM ok(GS)')
	}else{
		debug('SaveDataTM go(DB)')
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE IF EXISTS teams",[],
				function(tx, result){},
				function(tx, error) {debug('drop tmtable error' + error.message)}
			);                                           
			tx.executeSql("CREATE TABLE IF NOT EXISTS teams ("+list+")", [],
				function(tx, result){debug('create tmtable ok')},
				function(tx, error) {debug('create tmtable error'	+error.message)}
			);
			for(var i in teams) {
				var tmi = teams[i]
				var zag1 = []
				var zag2 = []
				var zag3 = []
				for(var j in tmi){
					zag1.push(j)
					zag2.push('?')
					zag3.push(tmi[j])
				}
				tx.executeSql("INSERT INTO teams ("+zag1+") values("+zag2+")", zag3,
					function(tx, result){},
					function(tx, error) {debug('insert tmdata error:'+error.message)
				});
			}
		});
	}
}

function PrintTeams(){
	var zag = list.split(',')
	var text = '<table width=100% border=1>'
	text+= '<tr>'
	for(j in zag) text += '<th>'+zag[j]+'</th>'
	text+= '</tr>'
	for(i in teams){
		text += '<tr>'
		for(j in zag) text += '<td>' + (teams[i][zag[j]]!=undefined ? teams[i][zag[j]] : '_')  + '</td>'
		text += '</tr>'
	}
	text += '</table>'
	$('td.back4').prepend(text)
}

function PrintRightInfo(){
	debug('PrintRightInfo')
	if(div_cur.dpriz!=undefined && div_cur.dpriz!=''){
		$("#crabright").append('<div id="showpriz"><a href="javascript:void(ShowPriz(\''+div_cur.dpriz+'\'))">Показать призовые</a>&nbsp;</div>')
	}
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}

function CountryInfoGet(){
	debug('CountryInfoGet')

	div_cur.dpriz = ''
	div_cur.did	  = UrlValue('j')
	div_cur.nname = $('td.back4 td.back1').text().split(', ')[0]
	div_cur.dname = $('td.back4 td.back1').text().split(', ')[1]
	$('a[href*="p=refl&t=s&k=0&"]').each(function(i, val){
		if($(val).text() == div_cur.dname) div_cur.dnum = i+1
	})
	debug(div_cur.dname)
	debug(div_cur.nname)
	debug('div_cur.did:'+div_cur.did)
	debug('div_cur.dnum:'+div_cur.dnum)

	var teams2 = []
	$('td.back4 table:first table:first tr:gt(0)').each(function(i, val){
		var tid = UrlValue('n',$(val).find('a:has(u)').attr('href'))
		teams2[tid] = {}
		teams2[tid].tid = tid
		teams2[tid].did = div_cur.did
		teams2[tid].tplace = i+1
		teams2[tid].tname = $(val).find('a[href^="plug.php?p=refl&t=k&j='+tid+'&z="]').text()
	})
	for (var i in teams2) {
		if(typeof(teams[i])=='undefined') teams[i] = teams2[i]
		else teams[i].did = teams2[i].did
	}

//	a href="plug.php?p=refl&t=k&j=722&z=2e1449f3185f813db9d49651fd9375a4">Химки</a>

	for (var i in teams) debug('p'+i+'_'+teams[i].tplace+'_'+teams[i].tname+'_'+teams[i].did)

	SaveDataTm()

/**
	var tDiv = ''
	var tPos = 0

	var tdiv = getCookie('teamdiv');
//	$('td.back4').prepend(tdiv)
	var tdivarr = []
	if(tdiv != false) {
		tdivarr = tdiv.split('!')
		var tplace = parseInt($('a[href*="&n='+tdivarr[0]+'&"]:has(u)').text())
		if(tplace!= '' && !isNaN(tplace)){
			tdivarr[2] = $('td.back4 td.back1').text().split(', ')[1]
			tdivarr[3] = tplace
			var ck = ''
			ck = tdivarr.join('!')

			setCookie('teamdiv',ck);

			if(tdivarr[4]!=undefined && tdivarr[4]!=''){
				$("#crabright").append('<div id="showpriz"><a href="javascript:void(ShowPriz(\''+tdivarr[4]+'\'))">Показать призовые</a>&nbsp;</div>')
			}
    	}
	}
/**/
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

function SetFin(){
	var tfin = []
	var text1 = sessionStorage.teamsfin
	if (text1 != undefined){
//		$('td.back4').prepend('l '+text1+'<br>')	
		var t1 = text1.split(',')
		for(j in t1){
			var t2 = t1[j].split(':')
			var tf = {}
			tf.zp = ((t2[1])/1000).toFixed(3).replace(/\./g,',')+'$'
			tf.nom = ((t2[2])/1000).toFixed(3).replace(/\./g,',')+',000$'
			if(t2[0]) tfin[t2[0]] = tf
		}
	}
	$('td.back1 span.text2b').append(' (финансы)')
	$('td.back4 table table th[width=13%]').attr('width','5%').before('<th>Номиналы\n\t<th>Зарплаты\n\t')
	$('td.back4 table table th[width=7%]').attr('width','5%')
	$('td.back4 table table th[width=6%]').attr('width','5%')
	$("td.back4 table table tr td a[href*='plug.php?p=refl&t=s_graph']").each(function(){
		var tid = UrlValue('n',$(this).attr('href'))
		$(this).parent().find('img').remove() 
		var td_data = $(this).parent().html().replace(/\(\d*\)/g,'')
		var td_data1 = '<td> </td><td> </td>'

		if (tfin[tid] != undefined && tfin[tid].zp != undefined) td_data1 = '<td align=right><small>'+tfin[tid].nom+ '</small> </td><td align=right><small>' +tfin[tid].zp+'</small> </td>'

		$(this).parent().before(td_data1).html(td_data)
	})
	$('div[id^="show"] a').removeAttr('href')
}

function SetTasks(x){
	// task for club
	var team = []

	// Get info fom Global or Session Storage
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
	if (x==1){
		$('td.back1 span.text2b').append(' (задачи)')
		$('td.back4 table table th[width=13%]').attr('width','26%')
		$("td.back4 table table tr td a[href*='plug.php?p=refl&t=s_graph']").each(function(){
			var tid = UrlValue('n',$(this).attr('href'))
			$(this).parent().find('img').remove() 
			var td_data = $(this).parent().html().replace(/\(\d*\)/g,'')

			if (team[tid] != undefined && team[tid].ttask != undefined) td_data += ' <small>'+team[tid].ttask+'</small>'
			$(this).parent().html(td_data)
		})
	} else if (x==2) {
		$('td.back1 span.text2b').append(' (стадионы)')
		$('td.back4 table table th[width=13%]').attr('width','5%').before('<th width=30% colspan=2>Стадионы\n\t')
		$('td.back4 table table th[width=7%]').attr('width','5%')
		$('td.back4 table table th[width=6%]').attr('width','5%')
		$("td.back4 table table tr td a[href*='plug.php?p=refl&t=s_graph']").each(function(){
			var tid = UrlValue('n',$(this).attr('href'))
			$(this).parent().find('img').remove() 
			var td_data = $(this).parent().html().replace(/\(\d*\)/g,'')
			var td_data1 = '<td> </td><td> </td>'

			if (team[tid] != undefined && team[tid].sname != undefined) td_data1 = '<td><small>'+team[tid].sname+ '</small> </td><td><small>' +team[tid].ssize+'</small> </td>'

			$(this).parent().before(td_data1).html(td_data)
//			$(this).parent().before(td_data1)
		})
	}
	$('div[id^="show"] a').removeAttr('href')
}

function PlusMinus(){
	$('th:last').before('<th width="6%">+/-\n\t').append('\n')
	$('th:contains(№)').parent().parent().find('tr').each(function(){
		var gz = +$(this).find('td:last').prev().prev().text()
		var gp = +$(this).find('td:last').prev().text()
		var td  = '<td>' +  (gz > gp ? '+' : '') + (gz-gp) + '</td>'
		$(this).find('td:last').before(td)
	})
}

function ColorIt(){
	if ( UrlValue('j') ) tbid = UrlValue('j');

	if (tbid == 0){
		var divname = 
		$("td.back4 a").each(function(){
			if ($(this).text() == $('td.back1 span').text().split(', ',2)[1]) {
				tbid = UrlValue('j',$(this).attr('href'))
			}
		})
	}

	if (getCookie('pefltables') && tbid >= 0) {
		var dp = getCookie('pefltables').split('.')
		for (var p in dp) {
			var name = dp[p].split('*',1)[0] 
			var key = dp[p].split('*')
			key.shift()
			diap[name] = key
		}
		ColorTable(tbid);
	}
}

function ColorTable(tableid){
	if (diap[tableid]){
//		$('th:contains(№)').parent().parent().find('tr').each(function(i,val){
		$('td.back4 table table tr').each(function(i,val){
			for (var j in diap[tableid]) {
				var d = diap[tableid][j]
				if (i>= +d.split('!')[0].split('-')[0] && i <= +d.split('!')[0].split('-')[1]) {
					$(val).attr("bgcolor", d.split('!')[1])
				}
			}
		})
	}
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

function getValue(tableid,curVal){
	var retVal = prompt('Задайте цвет таблицы', curVal.replace(/!/g,'='));
	if (retVal != null) {
		var cookie = ''
		diap[tableid] = retVal.replace(/=/g,'!').split(',');
		ColorTable(tableid);
		for (var i in diap) if(i!=0 && diap[i].join('*')!='') cookie += '.' + i +'*' + diap[i].join('*');
		setCookie('pefltables',cookie.replace('.',''))
	}
	return true
}
function TableCodeForForum(){

	// change big flags for eurocups in table
	$('td.back4 td.back1').parent().next().find('table').find('img[src*=system/img/flags/]').each(function(){
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

		var fid=$(this).attr('src').split('flags/')[1].split('.')[0]
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

	// generate code for forum
	var x = '<div align="right">(<a href="'+window.location.href+'">x</a>)&nbsp;</div>'
	x += '<br>Код для форума<br><br><textarea rows="20" cols="80" readonly="readonly" id="CodeTableForForum">'
	x += '[b][url=plug.php?' + location.search.substring(1) + ']#[/url] '
	x += $('td.back4 td.back1').text()
	x += '[/b]\n'
	x += $('td.back4 table:eq(1)')
		.find('img').removeAttr('ilo-full-src').end()		// fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
		.find('img').removeAttr('height').end()
		.html()
		.replace(/<tbody>/g,'<table width=100% bgcolor=#C9F8B7>')
		.replace(/<\/tbody>/g,'')
		.replace(/<small>/g,'')
		.replace(/<\/small>/g,'')
		.replace(/<\/th>/g,'')
		.replace(/\t<th(.*)>(.*)\n/g,'<td$1><b>$2</b></td>')
		.replace(/\th/g,'td')
		.replace(/\/td><tr/g,'/td></tr><tr')
		.replace(/\</g,'[')
		.replace(/\>/g,']')
		.replace(/a href=\"/g,'url=')
		.replace(/\/a/g,'/url')
		.replace(/\&amp\;/g,'&')
		.replace(/img src="/g,'img]')
		.replace(/.gif/g,'.gif[/img')
		.replace(/.png/g,'.png[/img')
		.replace(/"/g,'')
		.replace(/ width=25/g,'')
	x += '[/table]'

	x += '\n\n\n[center]--------------- [url=forums.php?m=posts&q=173605]Крабовый VIP[/url] ---------------[/center]\n';
	x += '</textarea>'

	$('td.back4').html(x)
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

function debug(text) {if(deb) {debnum++;$('td#crabgloballeft').append(debnum+'&nbsp;\''+text+'\'<br>');}}