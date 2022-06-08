// ==UserScript==
// @name			peflfinance
// @namespace		pefl
// @description		finance page modification
// @include			http://*pefl.*/plug.php?p=fin&z=*
// @include			http://*pefl.*/plug.php?p=rules&z=*
// @encoding	   windows-1251
// ==/UserScript==

deb = (localStorage.debug === '1')
var debnum = 0
var db = false
var divs = []
var fin = {}
var cur = {}
var zp = 0;
var sponsors = 0;
var last_sp = 0;
var list = {
	'teams':'tid,my,did,num,tdate,tplace,ncode,nname,tname,mname,ttask,tvalue,twage,tss,avTopSumSkills,age,pnum,tfin,screit,scbud,ttown,sname,ssize,mid',
	'divs':	'did,my,dnum,nname,dname,drotate,drotcom,dprize,color,numteams,curtour'
}
var m = []
var dprize = 0
var dnum2  = 0
var dteams = 0
var dtour  = 0
var tplace = 0
var school = 0
var cm = 0
var curhometour = 0;
var maxhometour = 0;
var divpriz = 0;

function GetFinish(type, res) {
	debug('GetFinish:type=' + type + ':res=' + res);
	m[type] = res;
	if(m.divs === undefined && m.get_divs !== undefined) {
		m.divs = true;
		ModifyDivs();
	}
	if((m.dprize && m.tplace) || m.dprize!=undefined || m.tplace!=undefined) {
		var d = 1000 - tplace - dnum2 * 100 - 1;
		if(m.school !== undefined && m.ed==undefined) {
			debug(tplace + ':' + dnum2 + ':' + dprize + ':' + dteams + ':' + dtour);
			if(dprize[d]!=undefined) {
				divpriz = parseInt(dprize[d]) * 1000;
			}
			//EditFinance(school,(dprize[d]==undefined ? 0 : parseInt(dprize[d]))*1000, dteams,dtour)
			EditFinance(school,dteams,dtour)
			m.ed = true;
		}
	}	
}

function ModifyDivs() {
	debug('ModifyDivs go');
	for(i in divs) {
		var divt = divs[i]
		GetDivInfo(divt.did,divt.nname,parseInt(divt.dnum));
	}
	SaveData('divs')
}

function GetDivInfo(did, nname, dnum) {
	debug('GetDivInfo:' + did + ':' + nname + ':' + dnum);

	$('td.back4 table:eq(1) tr').each(function(i,val) {
		if(nname === $(val).find('td:first').text()) {
			$(val).find('td:first').attr('bgcolor', 'yellow');
			$('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(2)').attr('bgcolor', 'white');
			$('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(3)').attr('bgcolor', 'white');

   			var up 	= parseInt($('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(2)').html());
			var upc = parseInt($('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(2) sup').text());

			var down  = parseInt($('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(3)').html());
			var downc = parseInt($('td.back4 table:eq(1) tr:eq('+(i+dnum-1)+') td:eq(3) sup').text());

			drotcomlink = '';
			if(!isNaN(upc) && !isNaN(downc)) drotcomlink = upc
			else if (!isNaN(upc)) 		 	 drotcomlink = upc
			else if (!isNaN(downc))			 drotcomlink = downc

			drotcom = (drotcomlink!='' ? $('td.back4 table:eq(1) ~ b:has(sup:contains('+drotcomlink+'):first)').html() : '');

			divs[did].drotate = (isNaN(up) ? 0 : up) + ',' + (isNaN(down) ? 0 : down);
			divs[did].drotcom = drotcom;
		}
	})
	var dprize = [];
	$('td.back4 table:eq(1) tr:gt(0)').each(function(i,val){
		dprize.push(parseInt(val.cells[3].innerText.replace(',','')))
	})
	divs[did].dprize = dprize.join(',')
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}

function GetData2(){
	debug('GetData2')
	if(ff) {
		debug('ff='+true)
		var head = list['divs'].split(',')
		var text1 = String(localStorage['divs'])
		if (text1 != 'undefined') {
			var text = text1.split('#')
			for (i in text) {
				var x = text[i].split('|')
				var curt = {}
				var num = 0
				for(j in head){
					curt[head[j]] = x[num]
					num++
				}
				if(curt['my']) {
					dprize = (curt['dprize']!=undefined ? curt['dprize'].split(',') : 0)
					dnum2  = (curt['dnum']  !=undefined ? parseInt(curt['dnum']) : 0)
					dteams = (curt['numteams'] !=undefined ? parseInt(curt['numteams']) : 0)
					dtour  = (curt['curtour'] ==undefined || isNaN(parseInt(curt['curtour'])) ? 0 : parseInt(curt['curtour']))
				}
			}
			GetFinish('dprize',true)
		} else {
			GetFinish('dprize',false)
		}			

		head = list['teams'].split(',')
		var text2 = String(localStorage['teams'])
		if (text2 != 'undefined'){
			var text = text2.split('#')
			for (i in text) {
				var x = text[i].split('|')
				var curt = {}
				var num = 0
				for(j in head){
					curt[head[j]] = x[num]
					num++
				}
				if(curt['my']) tplace = (curt['tplace']!=undefined ? parseInt(curt['tplace']) : 0)
			}
			GetFinish('tplace',true)
		} else {
			GetFinish('tplace',false)
		}			
	} else {
		if(!db) DBConnect()
		db.transaction(function(tx) {
			tx.executeSql("SELECT dprize,dnum,numteams,curtour FROM divs WHERE my='true'", [],
				function(tx, result){
					for(var i = 0; i < result.rows.length; i++) {
						dprize = result.rows.item(i)['dprize'].split(',')
						dnum2  = result.rows.item(i)['dnum']
						dteams = result.rows.item(i)['numteams']
						dtour  = result.rows.item(i)['curtour']
					}
					GetFinish('dprize',true)
				},
				function(tx, error){
					debug(error.message)
					GetFinish('dprize',false)
				}
			)
		});
		db.transaction(function(tx) {
			tx.executeSql("SELECT tplace,my FROM teams WHERE my='true'", [],
				function(tx, result){
					for(var i = 0; i < result.rows.length; i++) {
						tplace = result.rows.item(i)['tplace']
						GetFinish('tplace', true)
					}
				},
				function(tx, error){
					debug(error.message)
					GetFinish('tplace', false)
				}
			)
		})
/**/
	}
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
		localStorage[dataname] = text
	} else {
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE IF EXISTS "+dataname,[],
				function(tx, result){},
				function(tx, error) {debug(error.message)}
			);                                           
			tx.executeSql("CREATE TABLE IF NOT EXISTS "+dataname+" (" + list[dataname] + ")", [],
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
				tx.executeSql("INSERT INTO " + dataname + " (" + x1 + ") values(" + x2 + ")", x3,
					function(tx, result){},
					function(tx, error) {debug(dataname+':insert('+ i +') error:' + error.message)
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
		var text1 = String(localStorage[dataname])
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
	} else {
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

function EditFinance(school, dteams, dtour) {
	debug('EditFinance('+school+','+dteams+','+dtour+')');
		var finance = [];
		var ffn 	= $('td.back4 > table td:eq(1)').html();
		zp	 		= parseInt(ffn.split('Сумма зарплат: ')[1].split(',000$')[0].replace(/\,/g,'')) * 1000;
		sponsors 	= parseInt(ffn.split('Всего ')[1].split(',000$')[0].replace(/\,/g,'')) * 1000;
		last_sp		= parseInt(ffn.split(',000$ в ИД / 4 г.')[0].split('$ в ИД / 3 г.')[1].split('>')[1].replace(/\,/g,''));
		cur.bablo	= parseInt(ffn.split('Финансы: ')[1].split('$')[0].replace(/\,/g,''));
		cur.bonus	= (ffn.indexOf('Бонус:') !== -1 ? parseInt(ffn.split('Бонус:')[1].split('<br>')[0].replace(/\,/g,'').replace('$','')) : 0);

		var tmenu = $('td.topmenu table td:contains(" ФИД")').text();
		cur.fid = isNaN(parseInt(tmenu.split('(')[1],10)) ? 0 : parseInt(tmenu.split('(')[1],10);
		fin.fid = localStorage['finFID'] != undefined ? localStorage['finFID'] : (!isNaN(parseInt(tmenu.split('/')[1],10)) ? parseInt(tmenu.split('/')[1],10) : 81);

		// get info from tables
		$('td.back4 > table table').each(function(i,val) {
			var curtable = finance[i] = {};
			$(val).attr('id', i);
			curtable.name = $(val).prev().text();
			$(val).find('td:even').each(function() {
				curtable[$(this).text().split(' ')[0]] = parseInt($(this).next().text().replace(/\,/g,'').replace('$',''));
			})
		})
		for(i in finance[1]) {
			debug(i + ':' + finance[1]);
		}

		if(isNaN(school)) {
			school = finance[1]['Школа'] - Math.floor(((finance[0]['Продажа'] + finance[1]['Покупка'])*0.05)/1000)*1000
		}
		//fill finances
		cur.sponsors = finance[2]['Спонсоры'];
		cur.stadion = finance[2]['Стадион'];
		cur.priz = finance[2]['Призовые'];
		cur.sale = finance[2]['Продажа'];
		cur.allup =	finance[2]['Всего'];

		cur.zp = finance[3]['Зарплаты'];
		cur.buy = finance[3]['Покупка'];
		cur.agentsBonus = finance[3]['Бонусы'];
		cur.school = finance[3]['Школа'];
		cur.alldown = finance[3]['Всего'];
		cur.plusminus =	cur.allup - cur.alldown;
		cur.zpperc = (cur.sponsors === 0 ? 0 + '%' : (cur.zp/cur.sponsors * 100).toFixed(1) + '%');
		cur.schoolperc = (cur.sponsors === 0 ? 0 + '%' : (cur.school/cur.sponsors * 100).toFixed(1) + '%');


		if(cur.fid>fin.fid) fin.fid = cur.fid

		// set div prizes
		var divprizmark = (' <i>*1</i>').fontcolor('red').fontsize(1)
		var divpriztext = ('<i>*1 - без учета бонуса по итогам чемпионата, требуется сходить в "Дополнительный призовой фонд".</i>').fontcolor('red').fontsize(1)
		if(divpriz !== 0){
			if (finance[1]['Зарплаты'] === 0 && cur.zp > zp * 10) {
				divprizmark = ('<i>*1</i>').fontsize(1);
				divpriztext = ('<i>*1 - бонус по итогам чемпионата: ' + divpriz/1000 + ',000$ за ' + (1000-tplace-dnum2*100) + ' место.</i>').fontsize(1);
			} else {
				divprizmark = ('<i>*1</i>').fontcolor('green').fontsize(1);
				divpriztext = ('<i>*1 - учтен бонус по итогам чемпионата: ' + divpriz/1000 + ',000$ за ' + (1000-tplace-dnum2*100) + ' место.</i>').fontcolor('green').fontsize(1);
			}
		}

		countFin();

		$('table#0 td:odd, table#1 td:odd').attr('width','14%').attr('align','right').after('<td width=56%></td>');
		$('table#2 td:odd, table#3 td:odd').attr('width','15%').attr('align','right').attr('id','cur').after('<td></td><td width=15% id=fin align=right></td><td></td>');

		var preparedhtml = '<tr><th width=40%></th><th width=30% class=back3 colspan=2>Текущий ' + cur.fid + ' ФИД</th>';
		if(fin.fid !== cur.fid) {
			preparedhtml += '<th width=30% class=back3 colspan=2>Прогноз на <span class="ffid">' + fin.fid + '</span> ФИД (<a href="javascript:void(ChangeFID(\'-\'))">&ndash;</a> <a href="javascript:void(ChangeFID(\'+\'))">+</a>)</th>'
		} else if(finance[1]['Зарплаты'] === 0 && cur.zp > zp * 10) {
			preparedhtml += '<th width=30% class=back3 colspan=2>В следующем сезоне</th>';
		} //bgcolor=#A3DE8F
		preparedhtml += '</tr>';
		$('table#2, table#3').prepend(preparedhtml);

		preparedhtml  = '<hr><table width=100% id="4">';
		preparedhtml += '<tr><td width=40%><b>Плюс\\Минус</b></td>';
		preparedhtml += '<td width=15% align=right>' + (format(cur.plusminus)).bold() + '</td><td></td>';

		if(fin.fid !== cur.fid) {
			preparedhtml += '<td width=15% align=right id="fplusminus"></td><td></td>';
		} else {
			preparedhtml += '<td width=15%></td><td></td>';
		}

		preparedhtml += '</tr>';
		preparedhtml += '<tr><td><b>На счету</b></td>';
		preparedhtml += '<td align=right>' + (format(cur.bablo)).bold() + '</td><td></td>';
		if(fin.fid !== cur.fid) {
			preparedhtml += '<td align=right id="fbablo"></td><td></td>';
		}
		preparedhtml += '</tr>';
		preparedhtml += '</table>';
		$('td.back4 table#3').after(preparedhtml);

		$('td[id=cur]:eq(7)').next().append(' (' + cur.schoolperc + ')');

		$('table#2 tr:eq(2) td:first').append((' <i>*3</i>').fontsize(1));
		var ttt = '<i>*3 - считаем что уже сыгранно домашних игр:';
		ttt += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;чемпионат: ' + curhometour + ' (максимум ' + maxhometour + ')';
		ttt += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;остальное: <font size=1 id="cm">'+cm+'</font> (<a href="javascript:void(CountStad(\'-\'))">&ndash;</a> <a href="javascript:void(CountStad(\'+\'))">+</a>)';
		ttt += '</i><br>';
		$('table#4').after(ttt.fontsize(1));

		$('table#3 tr:eq(3) td:first').append((' <i>*2</i>').fontsize(1));
		$('table#3 tr:eq(5) td:first').append('<b><sup><a href = "#" onClick = "alert(\'5% от сделки при продаже игрока, что не сыграл в команде 30 офц игр после покупки\')"> ?</a></sup></b>');
		$('table#4').after(('<i>*2 - в скобках указано соотношение вложений в школу по сравнению со спонсорскими.</i><br>').fontsize(1));
		$('table#2 tr:eq(3) td:first').append(divprizmark);
		$('table#4').after(divpriztext + '<br>');

        setFin();
		$('table#4').after('<hr>');

		return false
}

function countFin(){
		// Count finish finance
		fin.sponsors = sponsors * fin.fid + cur.bonus;
		fin.dopFond = sponsors  * fin.fid * 0.09;

//		fin.stadion = (cur.fid == 0 ? 0 : cur.stadion*fin.fid/cur.fid)
		cm = (isNaN(parseInt(localStorage.cupmatches)) ? cm : parseInt(localStorage.cupmatches));
		curhometour = parseFloat((dtour/2).toFixed(1));
		maxhometour = (dteams==0 ? 0 : (dteams-1)*(dteams<13 ? 2 : 1));
		debug(cur.stadion+':'+curhometour+':'+maxhometour+':'+cm);

		fin.stadion = (cur.fid === 0 ? 0 : (curhometour === 0 ? cur.stadion : parseInt((cur.stadion/(curhometour+cm)*(maxhometour+cm)).toFixed(0))));
		fin.priz = cur.priz + (dtour==0 ? 0 : divpriz);
		fin.sale = cur.sale;
		fin.allup = fin.sponsors + fin.stadion + fin.priz + fin.sale;

		fin.zp = cur.zp + (fin.fid - cur.fid) * zp;
		fin.zpperc = (fin.zp / fin.sponsors * 100).toFixed(1) + '%';
		fin.buy = cur.buy;
		fin.agentsBonus = cur.agentsBonus;
		fin.school = cur.school + (fin.fid-cur.fid) * school;
		fin.schoolperc = (fin.school / fin.sponsors * 100).toFixed(1) + '%';
		fin.alldown = fin.zp + fin.buy + fin.agentsBonus + fin.school + fin.dopFond;
		fin.plusminus = fin.allup - fin.alldown;
		fin.bablo = (fin.allup - cur.allup) - (fin.alldown - cur.alldown) + cur.bablo;
}

function setFin(){
		if(fin.fid !== cur.fid) {
			$('td[id=fin]:eq(7)').next().html(' (' + fin.schoolperc + ')');
//			$('td[id=fin]:eq(2)').next().append(divprizmark)

			$('td[id=fin]:eq(0)').html(format(fin.sponsors).bold());
			$('td[id=fin]:eq(1)').html('~' + format(fin.stadion).bold());
			$('td[id=fin]:eq(2)').html(format(fin.priz).bold());
			$('td[id=fin]:eq(3)').html(format(fin.sale).bold());
			$('td[id=fin]:eq(4)').html(format(fin.allup).bold());

			$('td[id=fin]:eq(5)').html(format(fin.zp).bold());
			$('td[id=fin]:eq(6)').html(format(fin.buy).bold());
			$('td[id=fin]:eq(7)').html(format(fin.school).bold());
			$('td[id=fin]:eq(8)').html(format(fin.dopFond).bold());
			$('td[id=fin]:eq(9)').html(format(fin.agentsBonus).bold());
			$('td[id=fin]:eq(10)').html(format(fin.alldown).bold());
		} else if (finance[1]['Зарплаты'] === 0 && cur.zp > zp * 10) {
			let spraz = parseInt((sponsors - (cur.sponsors) / fin.fid) / 1000)
			if(spraz !== 0){
				var prev_sp = last_sp - spraz
				debug('spraz=' + spraz + ', last_sp=' + last_sp + ', prev_sp=' + prev_sp)
				if (spraz>0) {
					spraz = '+' + spraz
				}
				var nhtml = $('td.back4 > table td:eq(1)').html()
				var sp_text = ('Спонсорские контракты:<br><font color="red">' + prev_sp + ',000$ в ИД / ушедший</font>')
				$('td.back4 > table td:eq(1)').html(nhtml.replace('Спонсорские контракты:', sp_text))
			}
			$('td[id=fin]:eq(0)').html(format(fin.sponsors).bold())
			$('td[id=fin]:eq(5)').html(format(zp*fin.fid).bold())
			$('td[id=fin]:eq(7)').html(format(school*fin.fid).bold())
		}
		$('#fbablo').html((format(fin.bablo)).bold());
		$('#fplusminus').html((format(fin.plusminus)).bold());
}

function ChangeFID(type){
	if (type=='+') {
		fin.fid++;
		if (fin.fid > 200 ) fin.fid = 200;
	} else {
		fin.fid--;
		if (fin.fid < cur.fid) fin.fid = cur.fid;
	}
	localStorage['finFID'] = fin.fid;
	$('.ffid').html(fin.fid);
	countFin();
	setFin();
}

function CountStad(type){
	if(type=='+')	cm = cm+1
	else 			cm = (cm==0 ? 0: cm-1)
	localStorage.cupmatches = cm
	fin.allup		= fin.allup 	- fin.stadion
	fin.plusminus	= fin.plusminus - fin.stadion
	fin.bablo		= fin.bablo 	- fin.stadion
	fin.stadion = (cur.fid == 0 ? 0 : (curhometour==0 ? cur.stadion : parseInt((cur.stadion/(curhometour+cm)*(maxhometour+cm)).toFixed(0))))
	fin.allup		= fin.allup 	+ fin.stadion
	fin.plusminus	= fin.plusminus + fin.stadion
	fin.bablo		= fin.bablo 	+ fin.stadion
	$('td[id=fin]:eq(1)').html('~'+format(fin.stadion).bold())
	$('td[id=fin]:eq(4)').html(format(fin.allup).bold())
	$('td#fplusminus').html((format(fin.plusminus)).bold())
	$('td#fbablo').html((format(fin.bablo)).bold())
	debug(format(fin.stadion)+':'+fin.allup)
	$('font#cm').html(cm)
}

function format(num) {
	if (num < 1000000 && num > -1000000) {
		return (num / 1000).toFixed(0) + (num === 0 ? '' : ',000') + '$';
	} else {
		return (num / 1000000).toFixed(3).replace(/\./g,',') + (num === 0 ? '' : ',000') + '$'
	}
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}
function debug(text) {
	if (deb) {
		console.log(text);
	}
}

$().ready(function() {   	
	var urltype = UrlValue('p')
	var urlTValue = UrlValue('t')
	if(urltype== 'fin' && urlTValue == 'prizef'){
		GetData('divs')
	}else if(urltype == 'fin' && $('div.debug').length === 0){
		GetData2()
		$('td.back4').prepend('<div id=debug style="display: none;"></div>')
		$('#debug').load($('a:contains("изменить")').attr('href') + ' span.text2b',function(){
			school = parseInt($('#debug').html().split(' ')[3])
			if(!isNaN(school)) $('a:contains("изменить")').before(' ' + format(school) + ' в ИД | ')
			else school = 0
			GetFinish('school',true)
		})
	}
}, false)
