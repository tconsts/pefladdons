// ==UserScript==
// @name           pefltraining
// @namespace      pefl
// @description    modification training page
// @include        http://www.pefl.ru/plug.php?p=training*
// @include        http://pefl.ru/plug.php?p=training*
// @include        http://pefl.net/plug.php?p=training*
// @include        http://www.pefl.net/plug.php?p=training*
// @include        http://pefl.org/plug.php?p=training*
// @include        http://www.pefl.org/plug.php?p=training*
// @version			1.0
// ==/UserScript==

var data_assoc = [];
var players = [];
var groups = [[]];
var trnman = []
var trn = [0]

var itrains = []
itrains[0]	= {level:2,	tr:1,	name: 'Общая'}
itrains[1]	= {level:0,	tr:2,	name: 'Востановление Формы'}
itrains[2]	= {level:1,	tr:3,	name: 'Игра на 2 этаже'}
itrains[3]	= {level:3,	tr:4,	name: 'Кросс'}
itrains[4]	= {level:1,	tr:5,	name: 'Навесы'}
itrains[5]	= {level:1,	tr:6,	name: 'Отбор Мяча'}
itrains[6]	= {level:1,	tr:7,	name: 'Отражение Ударов'}
itrains[7]	= {level:1,	tr:8,	name: 'Пенальти'}
itrains[8]	= {level:2,	tr:9,	name: 'Спринт'}
itrains[9]	= {level:1,	tr:10,	name: 'Техника'}
itrains[10]	= {level:4,	tr:11,	name: 'Тренажеры'}
itrains[11] = {level:1,	tr:12,	name: 'Угловые'}
itrains[12] = {level:1,	tr:13,	name: 'Удары по Воротам'}
itrains[13] = {level:1,	tr:14,	name: 'Штрафные'}
itrains[14] = {level:2,	tr:0,	name: 'Новая позиция SW'}
itrains[15] = {level:2,	tr:0,	name: 'Новая позиция DF'}
itrains[16] = {level:2,	tr:0,	name: 'Новая позиция DM'}
itrains[17] = {level:2,	tr:0,	name: 'Новая позиция AM'}
itrains[18] = {level:2,	tr:0,	name: 'Новая позиция FW'}
itrains[29] = {level:2,	tr:0,	name: 'Новая позиция L'}
itrains[20] = {level:2,	tr:0,	name: 'Новая позиция C'}
itrains[21] = {level:2,	tr:0,	name: 'Новая позиция R'}

var trains = [];
//trains[0]	= {level:0,	tr:0,	name:'пусто'};
trains[1]	= {level:2,	tr:15,	ball:0,	name:'5x5 на большом поле (сред)'};
trains[2]	= {level:2,	tr:16,	ball:1,	name:'Защита в меньшестве (сред)'};
trains[3]	= {level:0,	tr:17,	ball:0,	name:'Изучение соперника (нет)'};
trains[4]	= {level:0,	tr:0,	ball:0,	name:'Индивидуальные'};
trains[5]	= {level:2,	tr:18,	ball:0,	name:'Квадраты (сред)'};
trains[6]	= {level:3,	tr:19,	ball:0,	name:'Кросс (выс)'};
trains[7]	= {level:2,	tr:20,	ball:0,	name:'Минифутбол (сред)'};
trains[8]	= {level:1,	tr:21,	ball:1,	name:'Оффсайдные ловушки (низ)'};
trains[9]	= {level:3,	tr:22,	ball:1,	name:'Переход от обороны к атаке (выс)'};
trains[10]	= {level:2,	tr:23,	ball:1,	name:'Позиционная атака (сред)'};
trains[11]	= {level:3,	tr:24,	ball:1,	name:'Прессинг (выс)'};
trains[12]	= {level:2,	tr:25,	ball:0,	name:'Спринт (сред)'};
trains[13]	= {level:1,	tr:26,	ball:1,	name:'Станд.положения (атака, низ)'};
trains[14]	= {level:1,	tr:27,	ball:1,	name:'Станд.положения (защита, низ)'};
trains[15]	= {level:0,	tr:28,	ball:1,	name:'Тактическое занятие (нет)'};
trains[16]	= {level:4,	tr:29,	ball:0,	name:'Тренажеры (оч.выс)'};
trains[17]	= {level:4,	tr:30,	ball:0,	name:'Тренировочный матч (оч.выс)'};
trains[18]	= {level:-1,tr:31,	ball:0,	name:'Отдых'};

$().ready(function() {
	var text = ''
	var today = new Date()
	today = check(today.getDate()) + '.'+check(today.getMonth()+1)


	trn[0] = [today]

	var srch="Вы вошли как "
	var curManagerNick = $('td.back3 td:contains('+srch+')').html().split(',',1)[0].replace(srch,'')

	if(UrlValue('p') == 'training') {
	$.get('training.php', {}, function(data){
		var dataarray = data.split('&');
		var i = 0;
		while(dataarray[i] != null) {
			var tmparr = dataarray[i].split('=');
			var tmpkey = tmparr[0];
			var tmpvalue = tmparr[1];
			data_assoc[tmpkey] = tmpvalue;

			if (tmpkey.indexOf('trn') != -1) trn[0].push(tmpvalue)
			i++;
		}
		var num_players 	= data_assoc["n"];
		var trnManagerNick	= data_assoc["s0"];

		// данные о тренировках
		for(i=1;i<=3;i++) {
			var gri = []
			for(j=1;j<=3;j++) gri[j] = parseInt(data_assoc["t" + i + j])
			groups[i] = gri;
		}

		// create def values
		for(p in trains){
			for(i=1;i<=3;i++){
				for(j=1;j<=3;j++) trains[p]['count'+i+j] = 0
			}
		}
		for(p in itrains){
			for(i=1;i<=3;i++){
				for(j=1;j<=3;j++) itrains[p]['count'+i+j] = 0
			}
		}

		// данные о тренерах
	    trnman[0] = {}
		trnman[0].name	= data_assoc["s0"]
		trnman[0].group	= data_assoc["sg0"]
		trnman[0].type	= 0
		trnman[0].value	= 0
		for(i=1;i<=5;i++){
			trnman[i] = {}
			if(data_assoc["s"+i]!=undefined){
				trnman[i].name	= data_assoc["s"+i]
				trnman[i].group	= data_assoc["sg"+i]
				trnman[i].type	= data_assoc["btype"+i]
				trnman[i].value	= data_assoc["bvalue"+i]
			}
		}

		// теперь собираем данные об игроках
		for(i=0;i<num_players;i++) {
			var tmpplayer = [];
			var playerid 	= data_assoc["id"+i];
			var sname 		= data_assoc["secondname"+i];
			var pg 			= tmpplayer["pg"] 		= parseInt(data_assoc["pg"+i]);
			var training 	= tmpplayer["training"] = parseInt(data_assoc["training"+i]);
			tmpplayer["firstname"] 	= data_assoc["firstname"+i];
			tmpplayer["secondname"] = sname.replace('~','').replace('*','').replace('^','');
			tmpplayer["rest"] 		= (training == 1 ? 1 : 0)
			tmpplayer["newpos"] 	= (training > 13 ? 1 : 0)
			tmpplayer["inj"] 		= data_assoc["inj"+i];
			tmpplayer["notrain"] 	= (sname.indexOf('~') > -1 ? 1 : 0)
			tmpplayer["tr1"] 		= groups[pg][1]
			tmpplayer["tr2"] 		= groups[pg][2]
			tmpplayer["tr3"] 		= groups[pg][3]

			// if индивидуалка
			for(j=1;j<=3;j++){
				if (tmpplayer["tr"+j]==4) itrains[training]['count'+pg+j] += 1
			}

			// if не сломан не отдыхает и не ~
			if(tmpplayer["inj"] < 2 && tmpplayer["rest"] == 0 && tmpplayer["notrain"] == 0){
				for(j=1;j<=3;j++) trains[tmpplayer["tr"+j]]['count'+pg+j] += 1
			}
			players[playerid] = tmpplayer;
		}

		var xtr = '<table id="trn" width=100% bgcolor=A3DE8F></td></tr>'
		xtr += '<tr><td bgcolor=C9F8B7 colspan=15><b>Тренировка основы:</b>'
		xtr += '<tr id="ball" bgcolor=white><th colspan=3 width=13%>гр1</th><th bgcolor=A3DE8F></th><th colspan=3 width=13%>гр2</th><th bgcolor=A3DE8F></th><th colspan=3 width=13%>гр3</th><th bgcolor=A3DE8F></th><th width=5%>наг</th><th width=40%>тренировка</th><th width=30%>тренер(гр)</th></tr>'
		xtr += '<tr id="ind1"><td bgcolor=C9F8B7 colspan=15><b>Индивидуальные:</b></td></tr>'
		xtr += '<tr id="ind2" bgcolor=white><th colspan=3>гр1</th><th bgcolor=A3DE8F></th><th colspan=3>гр2</th><th bgcolor=A3DE8F></th><th colspan=3>гр3</th><th bgcolor=A3DE8F></th><th>наг</th><th>тренировка</th><th>трн(гр)</th></tr>'
		xtr += '</table>'
		$('td.back4').append(xtr)
		for (p in trains){ 
			var sumtrn = 0
			for(i=1;i<=3;i++) for(j=1;j<=3;j++) sumtrn += trains[p]['count'+i+j]
			if(sumtrn>0) {
				var tp = trains[p]
				var tval = ''
				var tcolor = ''
				var gcolor = ['','','','']
				var i1 = (tp.ball == 0 ? '<i>' : '')
				var i2 = (tp.ball == 0 ? '</i>' : '')
				for(t in trnman){
					if(tp.tr == trnman[t].type && trnman[t].type!=0) {
						tval += ' '+trnman[t].value+'%('+trnman[t].group+')'
						tcolor = gcolor[trnman[t].group] = ' bgcolor=D3D7CF'
					}
				}
				xtr = '<tr'+(p==4 ? ' id="ind1"' : '')+' bgcolor=C9F8B7 align=center>'
				for(j=1;j<=3;j++) {
					for(m=1;m<=3;m++) {
						xtr += '<td'+gcolor[j]+'>'
						xtr += (tp['count'+j+m]!=0 ? tp['count'+j+m] : "&nbsp;")
						xtr += '</td>'
					}
					xtr += '<td bgcolor=A3DE8F></td>'
				}
				xtr += '<td>' + (p==4 ? "&nbsp;" : tp.level) + '</td>'
				xtr += '<td align=left>'+i1 + tp.name + i2 +'</td>'
				xtr += '<td'+tcolor+'>'
				xtr += (tval == '' ? '&nbsp;' : tval)
				xtr += '</td>'
				xtr += '</tr>'
				if(p==4) {
					$('tr#ind1').before(xtr)
				} else {
					if(parseInt(trains[p]['ball'])==1) $('tr#ball:first').after(xtr)
					else $('tr#ind1:first').before(xtr)
				}

			}
		}
		for (p in itrains){ 
			var sumtrn = 0
			var itp = itrains[p]
			for(i=1;i<=3;i++) for(j=1;j<=3;j++) sumtrn += itrains[p]['count'+i+j]
			if(sumtrn>0) {
				var tval = ''
				var tcolor = ''
				var gcolor = ['','','','']
				for(t in trnman){
					if(itp.tr == trnman[t].type && trnman[t].type!=0) {
						tval += ' '+trnman[t].value+'%('+trnman[t].group+')'
						tcolor = gcolor[trnman[t].group] = ' bgcolor=D3D7CF'
					}
				}
				xtr = '<tr bgcolor=C9F8B7 align=center>'
				for(j=1;j<=3;j++) {
					for(m=1;m<=3;m++) {
						xtr += '<td'+gcolor[j]+'>' 
						xtr += (itp['count'+j+m]!=0 ? itp['count'+j+m] : "&nbsp;")
						xtr += '</td>'
					}
					xtr += '<td bgcolor=A3DE8F></td>'
				}
				xtr += '<td>' + (p==1 ? "&nbsp;" : itp.level) + '</td>'
				xtr += '<td align=left><i>' + itp.name + '</i></td>'
				xtr += '<td'+tcolor+'>'
				xtr += (tval == '' ? '&nbsp;' : tval)
				xtr += '</td>'
				xtr += '</tr>'
				$('tr#ind2:first').after(xtr)
			}
		}


		var trnnum = 1
		if (getCookie('pefltraining') && trnManagerNick == curManagerNick){
			var x = getCookie('pefltraining').split(';')
			for (var p in x) {
				var y = x[p].split(',')
				if (y[1]==trn[0][1] && y[2]==trn[0][2]) trnnum = 0
				trn[trnnum] = y
				trnnum++
			}
		}
		var save = ''
		for (var f=0;f<4;f++){
			if (trn[f]){
				for (var l in trn[f]) save += trn[f][l] + (l<trn[f].length-1 ? ',' : '')
				save += (f<3 && trn[f+1] ? ';' :'')
			}
		}
		if (trnManagerNick == curManagerNick) setCookie('pefltraining',save)

		var tn = [0,8,9,10,2,11,13,14]

		$('td.back4 table table:eq(1)')
			.before('<div align=right><a id="end" href="javascript:void(ShowEnd())">Показать -20%</a>&nbsp;</div>')
			.attr('width',"100%")
			.attr("bgcolor","A3DE8F")
			.prepend('<tr bgcolor=white><th>На '+ num_players +' игроков</th><th>' + ($('img[src="system/img/g/ball1.gif"]').length-1) + ' мч</th></tr>')

		$('td.back4 table table:eq(1) tr').each(function(i,val){
			if (i>0) {
				$(val).attr('bgcolor','C9F8B7')
				var ctn1 = 0
				var ctn2 = 0
				var ctn3 = 0
				for(j=1;j<=3;j++) {
					var flag = 0
					var ctncur1 = trains[tn[i]]["count"+j+"1"]
					var ctncur2 = trains[tn[i]]["count"+j+"2"]
					var ctncur3 = trains[tn[i]]["count"+j+"3"]

					if (ctncur1!=0 && ctncur2!=0 && ctncur3!=0) {ctn1 += ctncur1;ctn2 += ctncur1;ctn3 += ctncur1;flag=1}

					if (ctncur1!=0 && ctncur2+ctncur3==0) {ctn1 += ctncur1;flag=1}
					if (ctncur2!=0 && ctncur1+ctncur3==0) {ctn1 += ctncur2;flag=1}
					if (ctncur3!=0 && ctncur1+ctncur2==0) {ctn1 += ctncur3;flag=1}

					if (flag==0) {ctn1 += (ctncur1+ctncur2+ctncur3)/2;ctn2 += (ctncur1+ctncur2+ctncur3)/2}

				}
				$(val).prepend('<td align=center>'+(ctn3!=0? String(ctn3).fontsize(1) :"")+'</td>')
				$(val).prepend('<td align=center>'+(ctn2!=0? String(ctn2).fontsize(1) :"")+'</td>')
				$(val).prepend('<td align=center>'+(ctn1!=0? String(ctn1).fontsize(1) :"")+'</td>')
			}
			var ht = ''
			var trnt = 0
			for (j=trn.length-1;j>=0;j--) {
				var raz = ''
				if(trnt!=0){
					var colr = 'green'
					var pref = '+'
					raz = (trn[j][i]-trnt).toFixed(4)
					if (raz<0) {colr = 'red';pref=''}
					raz = '<sup>'+(pref+raz).fontcolor(colr)+'</sup>'
				}
				if (j<3){
					if(i==0) ht = '<td id="sum'+j+'"><b>'+trn[j][i]+'</b></td>' + ht
					else	 ht = '<td>'+(trn[j][i] + raz).fontsize(1)+'</td>' + ht
				}
				trnt = trn[j][i]
			}
			$(val).append(ht)
		})
		var rzp = 0
		for(i=trn.length-1;i>=0;i--){
			var rz = 0
			for(j in trn[i]){
				if(j>0) rz += parseFloat(trn[i][j])
			}
			if(i!=trn.length-1) $('td#sum'+i).append('<sup>'+(rz>rzp?'+':'')+(rz-rzp).toFixed(4)+'</sup>')
			rzp = rz
		}

		$('td.back4 table table:eq(1) tr:first').each(function(i,val){
			$(val).prepend('<th>'+('*<sup>2</sup>').fontsize(1)+'</th>')
			$('td.back4 table table:eq(1)').after('<div align=left><b>*<sup>2</sup></b> - влияют только на 25%</div>')
			$(val).prepend('<th>'+('*<sup>1</sup>').fontsize(1)+'</th>')
			$('td.back4 table table:eq(1)').after('<br><div align=left><b>*<sup>1</sup></b> - влияют только на 50%<br></div>')
			$(val).prepend('<th></th>')
		})
	})
	}
}, false)

function setCookie(name, value) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 30); 
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

function check(d) {return (d<10 ? "0"+d : d)}

function ShowEnd(){
	var sumraz = 0
	$('td.back4 table table:eq(1) th:eq(4)').after('<td id="end"><b>-20%</b></td>')
	$('td.back4 table table:eq(1) tr:first td:eq(3)').remove()
	$('td.back4 table table:eq(1) tr').find('td:eq(4)').each(function(i,val){
		var newtrn = (trn[0][i+1]-1)*0.8+1
		var newraz = (newtrn-trn[0][i+1]).toFixed(4)
		sumraz += parseFloat(newraz)
		$(val).after('<td>'+(newtrn).toFixed(4).fontsize(1)+('<sup>'+newraz+'</sup>').fontcolor('red')+'</td>')
		$(val).parent().find('td:eq(8)').remove()
	})
	$('td#end').append('<sup>'+sumraz.toFixed(4)+'</sup>')
	$('a#end ').remove()
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}
