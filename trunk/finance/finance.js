// ==UserScript==
// @name			peflfinance
// @namespace		pefl
// @description		finance page modification
// @include			http://*pefl.*/plug.php?p=fin&z=*
// @include			http://*pefl.*/plug.php?p=rules&z=*
// @version		    2.0
// ==/UserScript==

//document.addEventListener('DOMContentLoaded', function(){
//(function(){ 		// for ie

if(typeof (deb) == 'undefined') deb = false
var debnum = 0
var db = false
var divs = []
var list = {
	'divs':	'did,my,nname,dname,dnum,drotate,drotcom,dprize'
}
var m = []

var tdivarr = []
$().ready(function() {
   	ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
	var urltype = UrlValue('p')
	if( urltype== 'rules'){
		GetData('divs')
	} else if(urltype == 'fin'){
		$('td.back4').prepend('<div id=debug style="display: none;"></div>')
		$('#debug').load($('a:contains("изменить финансирование")').attr('href') + ' span.text2b',function(){
			var school = parseInt($('#debug').html().split(' ')[3])
			if(!isNaN(school)) $('a:contains("изменить финансирование")').before(' ' + format(school) + ' в ИД | ')
			EditFinance(school)
		})
	}
}, false)

function GetFinish(type, res){
	debug(type + '(' + res + ')')
	m[type] = res;
	if(m.divs==undefined && m.get_divs!=undefined){
		m.divs = true
		ModifyDivs()
	}
}

function ModifyDivs(){
	for(i in divs){
		var divt = divs[i]
		GetDivInfo(divt.did,divt.nname,divt.dnum)
	}
	SaveData('divs')
}

function GetDivInfo(did,nname,dnum){
//	var div_cur = {}

	$('td.back4 table:eq(1) tr').each(function(i,val){
		if(nname == $(val).find('td:first').text()){
			$(val).find('td:first').attr('bgcolor', 'yellow')
			$('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(2)').attr('bgcolor', 'white')
			$('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(3)').attr('bgcolor', 'white')

   			var up 	= parseInt($('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(2)').html())
			var upc = parseInt($('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(2) sup').text())

			var down  = parseInt($('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(3)').html())
			var downc = parseInt($('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(3) sup').text())

			drotcomlink = '' 
			if(!isNaN(upc) && !isNaN(downc)) drotcomlink = upc
			else if (!isNaN(upc)) 		 	 drotcomlink = upc
			else if (!isNaN(downc))			 drotcomlink = downc

			drotcom = (drotcomlink!='' ? $('td.back4 table:eq(1) ~ b:has(sup:contains('+drotcomlink+'):first)').html() : '')
//			drotcom = (drotcomlink!='' ? $('td.back4 table:eq(1) ~ b:first').text() : '')

			debug(did+':'+drotcom)

			divs[did].drotate = (isNaN(up) ? 0 : up) + ',' + (isNaN(down) ? 0 : down)
			divs[did].drotcom = drotcom
//			debug(did +':'+nname+':'+dnum+':'+ div_cur.drotate)
		}
	})
	$('td.back4 table:eq(2) tr:gt(0)').each(function(i,val){
		if(nname == $(val).find('td:first b').text()){
			$('td.back4 table:eq(2) tr:eq('+(i+1)+')').attr('bgcolor', 'yellow')
			$('td.back4 table:eq(2) tr:eq('+(i+dnum+1)+')').attr('bgcolor', 'white')

			var dprize = []
			$('td.back4 table:eq(2) tr:eq('+(i+dnum+1)+') td').each(function(){
				dprize.push(parseInt($(this).text()))
			})
			divs[did].dprize = dprize.join(',')
//			debug(did+':'+div_cur.dprize)
		}
	})
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}

function SaveData(dataname){
	debug(dataname+':SaveData')
	if(UrlValue('h')==1 || (dataname=='teams' && UrlValue('j')==99999)) return false

	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'players':	data = players;	break
		case 'teams': 	data = teams;	break
		case 'divs': 	data = divs;	break
		default: 		return false
	}
	if(ff) {
		var text = ''
		for (var i in data) {
			if(typeof(data[i])!='undefined') {
				var dti = data[i]
				text += dti[head[0]]
				for(var j in head) text += ':' + (dti[head[j]]==undefined ? '' : dti[head[j]])
				text += ','
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
					x3.push(dti[head[j]])
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
	debug(dataname+':GetData')
	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'players': data = players2;break
		case 'teams': 	data = teams;	break
		case 'divs'	: 	data = divs;	break
		default: return false
	}
	if(ff) {
		var text1 = globalStorage[location.hostname][dataname]
		if (text1 != undefined){
			var ttext = String(text1).split(',')
			for (i in ttext) {
				var x = ttext[i].split(':')
				var curt = []
				var num = 0
				for(j in head){
					curt[head[j]] = (x[num]!=undefined ? x[num] : '')
					num++
				}
				data[curt[head[0]]] = []
				if(curt[head[0]]!=undefined) data[curt.id] = curt
			}
			GetFinish('get_'+dataname, true)
		} else {
			GetFinish('get_'+dataname, false)
		}			
	}else{
		if(!db) DBConnect()
		db.transaction(function(tx) {
//			tx.executeSql("DROP TABLE IF EXISTS players")
//			tx.executeSql("DROP TABLE IF EXISTS teams")
//			tx.executeSql("DROP TABLE IF EXISTS divs")
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

function EditFinance(school){
		var fin = {}
		var finance = []
		var cur = {}

		var ffn 		= $('td.back4 > table td:eq(1)').html()
		var zp 			= parseInt(ffn.split('Сумма зарплат: ')[1].split(',000$')[0].replace(/\,/g,''))*1000
		var sponsors 	= parseInt(ffn.split('Всего ')[1].split(',000$')[0].replace(/\,/g,''))*1000
		var last_sp		= parseInt(ffn.split(',000$ в ИД / 4 г.')[0].split('$ в ИД / 3 г.')[1].split('>')[1].replace(/\,/g,''))
		cur.bablo 		= parseInt(ffn.split('Финансы: ')[1].split('$')[0].replace(/\,/g,''))
		cur.bonus 		= (ffn.indexOf('Бонус:') != -1 ? parseInt(ffn.split('Бонус:')[1].split('<br>')[0].replace(/\,/g,'').replace('$','')) : 0)

		fin.fid = 81

		// get info from tables
		$('td.back4 > table table').each(function(i,val){
			var curtable = finance[i] = {}
			$(val).attr('id', i)
			curtable.name = $(val).prev().text()
			$(val).find('td:even').each(function(){
				curtable[$(this).text()] = parseInt($(this).next().text().replace(/\,/g,'').replace('$',''))
			})
		})

		if(isNaN(school)) {
			school = finance[1]['Школа'] - Math.floor(((finance[0]['Продажа игроков'] + finance[1]['Покупка игроков'])*0.05)/1000)*1000
		}

		cur.sponsors =	finance[2]['Спонсоры']
		cur.stadion =	finance[2]['Стадион']
		cur.priz =		finance[2]['Призовые']
		cur.sale =		finance[2]['Продажа игроков']
		cur.allup =		finance[2]['Всего']

		cur.zp =		finance[3]['Зарплаты игрокам']
		cur.buy =		finance[3]['Покупка игроков']
		cur.school =	finance[3]['Школа']
		cur.alldown =	finance[3]['Всего']
		cur.plusminus =	cur.allup - cur.alldown
		cur.zpperc = 	 (cur.sponsors ==0 ? 0+'%' : (cur.zp/cur.sponsors*100).toFixed(1)+'%')
		cur.schoolperc = (cur.sponsors ==0 ? 0+'%' : (cur.school/cur.sponsors*100).toFixed(1)+'%')

		if(finance[1]['Зарплаты'] == 0 && cur.zp > zp*10) cur.fid = fin.fid
		else cur.fid = (cur.sponsors - cur.bonus)/sponsors

		if(cur.fid>fin.fid) fin.fid = cur.fid

		// set div prizes
		var divpriz = 0
		var divprizmark =	(('<i>*1</i>').fontcolor('red')).fontsize(1)
		var divpriztext =	('<i>*1 - без учета бонуса по итогам чемпионата, требуется сходить в "Правила".</i>').fontcolor('red').fontsize(1)
		if(tdivarr[4]!=undefined && tdivarr[4]!='' && cur.fid > 1){
			divpriz = 		parseInt(tdivarr[4].split('-')[parseInt(tdivarr[3])-1])*1000
			divprizmark = 	(('<i>*1</i>').fontcolor('green')).fontsize(1)
			divpriztext = 	('<i>*1 - учтен бонус по итогам чемпионата: '+divpriz/1000+',000$ за '+tdivarr[3]+' место ('+tdivarr[1]+', '+tdivarr[2]+').</i>').fontcolor('green').fontsize(1)
		}

		// Count finish finance
		fin.sponsors = sponsors * fin.fid + cur.bonus
		fin.stadion = (cur.fid == 0 ? 0 : cur.stadion*fin.fid/cur.fid)
		fin.priz = cur.priz + divpriz
		fin.sale = cur.sale
		fin.allup = fin.sponsors + fin.stadion + fin.priz + fin.sale

		fin.zp = cur.zp + (fin.fid-cur.fid)*zp
		fin.zpperc = (fin.zp/fin.sponsors*100).toFixed(1) + '%'
		fin.buy = cur.buy
		fin.school = cur.school + (fin.fid-cur.fid)*school
		fin.schoolperc = (fin.school/fin.sponsors*100).toFixed(1)+'%'
		fin.alldown = fin.zp + fin.buy + fin.school
		fin.plusminus = fin.allup - fin.alldown
		fin.bablo = (fin.allup - cur.allup) - (fin.alldown - cur.alldown) + cur.bablo

/**/
		$('table#0 td:odd, table#1 td:odd').attr('width','14%').attr('align','right').after('<td width=56%></td>')
		$('table#2 td:odd, table#3 td:odd').attr('width','15%').attr('align','right').attr('id','cur').after('<td></td><td width=15% id=fin align=right></td><td></td>')

		var preparedhtml = '<tr><th width=40%></th><th width=30% bgcolor=#A3DE8F colspan=2>Текущий '+cur.fid+' ФИД</th>'
		if(fin.fid != cur.fid) preparedhtml += '<th width=30% bgcolor=#A3DE8F colspan=2>Прогноз на '+fin.fid+' ФИД</th>'
		else if(finance[1]['Зарплаты'] == 0 && cur.zp > zp*10) preparedhtml += '<th width=30% bgcolor=#A3DE8F colspan=2>В следующем сезоне</th>'
		preparedhtml += '</tr>'
		$('table#2, table#3').prepend(preparedhtml)

		preparedhtml  = '<hr><table width=100% id="4">'
		preparedhtml += '<tr><td width=40%><b>Плюс\\Минус</b></td>'
		preparedhtml += '<td width=15% align=right>' + (format(cur.plusminus)).bold() + '</td><td></td>'

		if(fin.fid != cur.fid) preparedhtml += '<td width=15% align=right>' + (format(fin.plusminus)).bold() + '</td><td></td>'
//		else if(finance[0]['Спонсоры'] == 0 && cur.sponsors > fin.fid*4000) preparedhtml += '<td width=15% align=right>сссс</td><td></td>'
		else preparedhtml += '<td width=15%></td><td></td>'

		preparedhtml += '</tr>'
		preparedhtml += '<tr><td><b>На счету</b></td>'
		preparedhtml += '<td align=right>' + (format(cur.bablo)).bold() + '</td><td></td>'
		if(fin.fid != cur.fid) preparedhtml += '<td align=right>'+(format(fin.bablo)).bold() + '</td><td></td>'
//		else if(finance[0]['Спонсоры'] == 0 && cur.sponsors > fin.fid*4000) preparedhtml += '<td align=right>выаываыва</td><td></td>'
		preparedhtml += '</tr>'
		preparedhtml += '</table>'
		$('td.back4 table#3').after(preparedhtml)

		$('td[id=cur]:eq(7)').next().append(' ('+cur.schoolperc+')')

		$('table#3 tr:eq(3) td:first').append((' <i>*2</i>').fontsize(1))
		$('table#4').after(('<i>*2 - в скобках указано соотношение вложений в школу по сравнению со спонсорскими.</i><br>').fontsize(1))

		if(fin.fid != cur.fid) {
			$('td[id=fin]:eq(7)').next().append(' ('+fin.schoolperc+')')
			$('td[id=fin]:eq(2)').next().append(divprizmark)

			$('td[id=fin]:eq(0)').html(format(fin.sponsors).bold())
			$('td[id=fin]:eq(1)').html('~'+format(fin.stadion).bold())
			$('td[id=fin]:eq(2)').html(format(fin.priz).bold())
			$('td[id=fin]:eq(3)').html(format(fin.sale).bold())
			$('td[id=fin]:eq(4)').html(format(fin.allup).bold())

			$('td[id=fin]:eq(5)').html(format(fin.zp).bold())
			$('td[id=fin]:eq(6)').html(format(fin.buy).bold())
			$('td[id=fin]:eq(7)').html(format(fin.school).bold())
			$('td[id=fin]:eq(8)').html(format(fin.alldown).bold())
			$('table#4').after(divpriztext+'<br>')
		}else if (finance[1]['Зарплаты'] == 0 && cur.zp > zp*10){
			var spraz = parseInt((sponsors - cur.sponsors/fin.fid)/1000)
			var prev_sp = last_sp-spraz
			if (spraz>0) spraz = '+'+spraz
			var nhtml = $('td.back4 > table td:eq(1)').html()
			var sp_text = ('Спонсорские контракты:<br><font color="red">'+prev_sp+',000$ в ИД / ушедший</font>')
			$('td.back4 > table td:eq(1)').html(nhtml.replace('Спонсорские контракты:', sp_text))

//			$('td[id=fin]:eq(0)').next().append(' ('+spraz+'т$ в ИД)')
			$('td[id=fin]:eq(0)').html(format(fin.sponsors).bold())
			$('td[id=fin]:eq(5)').html(format(zp*fin.fid).bold())			
		}
		$('table#4').after('<hr>')
/**/		

		return false
}

function format(num) {
	if (num < 1000000 && num > -1000000)	return (num/1000).toFixed(0) + (num==0 ? '' : ',000') + '$'
	else 									return (num/1000000).toFixed(3).replace(/\./g,',') + (num==0 ? '' : ',000') + '$'
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
function debug(text) {if(deb) {debnum++;$('td.back4').append(debnum+'&nbsp;\''+text+'\'<br>');}}