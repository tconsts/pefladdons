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
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

var data_assoc = [];
var players = [];
var groups = [[]];
var trains = [];
var trn = [0]
trains[0] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:0,name:'пусто'};
trains[1] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:2,name:'5x5 на большом поле (сред)'};
trains[2] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:2,name:'Защита в меньшестве (сред)'};
trains[3] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:0,name:'Изучение соперника (нет)'};
trains[4] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:0,name:'Индивидуальные'};
trains[5] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:2,name:'Квадраты (сред)'};
trains[6] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:3,name:'Кросс (выс)'};
trains[7] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:2,name:'Минифутбол (сред)'};
trains[8] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:1,name:'Оффсайдные ловушки (низ)'};
trains[9] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:3,name:'Переход от обороны к атаке (выс)'};
trains[10] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:2,name:'Позиционная атака (сред)'};
trains[11] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:3,name:'Прессинг (выс)'};
trains[12] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:2,name:'Спринт (сред)'};
trains[13] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:1,name:'Станд.положения (атака, низ)'};
trains[14] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:1,name:'Станд.положения (защита, низ)'};
trains[15] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:0,name:'Тактическое занятие (нет)'};
trains[16] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:4,name:'Тренажеры (оч.выс)'};
trains[17] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:4,name:'Тренировочный матч (оч.выс)'};
trains[18] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,level:-1,name:'Отдых'};

var itrains = []
itrains[0] = {count1:0,count2:0,count3:0, level: 2,name: 'Общая'}
itrains[1] = {count1:0,count2:0,count3:0, level: 0, name: 'Востановление Формы'}
itrains[2] = {count1:0,count2:0,count3:0, level: 1, name: 'Игра на 2 этаже'}
itrains[3] = {count1:0,count2:0,count3:0, level: 3, name: 'Кросс'}
itrains[4] = {count1:0,count2:0,count3:0, level: 1, name: 'Навесы'}
itrains[5] = {count1:0,count2:0,count3:0, level: 1, name: 'Отбор Мяча'}
itrains[6] = {count1:0,count2:0,count3:0, level: 1, name: 'Отражение Ударов'}
itrains[7] = {count1:0,count2:0,count3:0, level: 1, name: 'Пенальти'}
itrains[8] = {count1:0,count2:0,count3:0, level: 2, name: 'Спринт'}
itrains[9] = {count1:0,count2:0,count3:0, level: 1, name: 'Техника'}
itrains[10] = {count1:0,count2:0,count3:0, level: 4, name: 'Тренажеры'}
itrains[11] = {count1:0,count2:0,count3:0, level: 1, name: 'Угловые'}
itrains[12] = {count1:0,count2:0,count3:0, level: 1, name: 'Удары по Воротам'}
itrains[13] = {count1:0,count2:0,count3:0, level: 1, name: 'Штрафные'}
itrains[14] = {count1:0,count2:0,count3:0, level: 2, name: 'Новая позиция SW'}
itrains[15] = {count1:0,count2:0,count3:0, level: 2, name: 'Новая позиция DF'}
itrains[16] = {count1:0,count2:0,count3:0, level: 2, name: 'Новая позиция DM'}
itrains[17] = {count1:0,count2:0,count3:0, level: 2, name: 'Новая позиция AM'}
itrains[18] = {count1:0,count2:0,count3:0, level: 2, name: 'Новая позиция FW'}
itrains[29] = {count1:0,count2:0,count3:0, level: 2, name: 'Новая позиция L'}
itrains[20] = {count1:0,count2:0,count3:0, level: 2, name: 'Новая позиция C'}
itrains[21] = {count1:0,count2:0,count3:0, level: 2, name: 'Новая позиция R'}
/**
&n=18
&rmom=1
&s0=const
&sg0=2

&s1=Максим Шишкин
&btype1=21
&bvalue1=12
&sg1=1
&sw1=500
&sc1=5
&sn1=Россия

&s2=Сахид Сантана
&btype2=27
&bvalue2=7
&sg2=2
&sw2=500
&sc2=4
&sn2=Мексика

&s3=Роберт Болин
&btype3=9
&bvalue3=9
&sg3=3
&sw3=500
&sc3=5
&sn3=Швеция

&s4=Сергей Бакаев
&btype4=0
&bvalue4=0
&sg4=3
&sw4=100
&sc4=3
&sn4=Россия
/**/

$().ready(function() {
//document.addEventListener('DOMContentLoaded', function(){
	var text = ''
	var today = new Date()
	today = check(today.getDate()) + '.'+check(today.getMonth()+1)


	trn[0] = [today]

	var srch="Вы вошли как "
	var curManagerNick = $('td.back3 td:contains('+srch+')').html().split(',',1)[0].replace(srch,'')
	var trnManagerNick = ''

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
		var num_players = data_assoc["n"];
		var trnManagerNick = data_assoc["s0"];

		// данные о тренировках
		for(i=1;i<=3;i++) {
			var gri = []
			for(j=1;j<=3;j++) {
				gri[j] = parseInt(data_assoc["t" + i + j]);
			}
			groups[i] = gri;
		}

		// теперь собираем данные об игроках
		for(i=0;i<num_players;i++) {
			var tmpplayer = [];
			var sname = data_assoc["secondname"+i];
			var pg = data_assoc["pg"+i];
			tmpplayer["firstname"] = data_assoc["firstname"+i];
			tmpplayer["secondname"] = sname.replace('~','').replace('*','').replace('^','');
			tmpplayer["training"] = data_assoc["training"+i];
			tmpplayer["rest"] = (tmpplayer["training"] == 1 ? 1 : 0)
			tmpplayer["newpos"] = (tmpplayer["training"] > 13 ? 1 : 0)
			tmpplayer["pg"] = parseInt(pg);
			tmpplayer["inj"] = data_assoc["inj"+i];
			tmpplayer["notrain"] = (sname.indexOf('~') > -1 ? 1 : 0)
			tmpplayer["tr1"] = groups[pg][1]
			tmpplayer["tr2"] = groups[pg][2]
			tmpplayer["tr3"] = groups[pg][3]

			if (tmpplayer["tr1"] ==4 || tmpplayer["tr2"] == 4 || tmpplayer["tr3"] == 4 || tmpplayer["training"] == 1){
				itrains[tmpplayer["training"]]['count'+pg] += 1
			}

			if (tmpplayer["inj"] < 2 && tmpplayer["rest"] == 0 && tmpplayer["notrain"] == 0){
				for(j=1;j<=3;j++) trains[tmpplayer["tr"+j]]['count'+pg+j] +=  1
			}

			var playerid = data_assoc["id" + i];
			players[playerid] = tmpplayer;
		}

		var xtr = '<hr><b>Тренировка основы:</b><table width=90% bgcolor=A3DE8F>'
		xtr += '<tr bgcolor=white><th colspan=3 width=15%>гр1</th><th bgcolor=A3DE8F></th><th colspan=3 width=15%>гр2</th><th bgcolor=A3DE8F></th><th colspan=3 width=15%>гр3</th><th bgcolor=A3DE8F></th><th>наг</th><th>тренировка</th></tr>'
		for (p in trains){ 
			var sumtrn = trains[p]['count11']+trains[p]['count12']+trains[p]['count13']+trains[p]['count21']+trains[p]['count22']+trains[p]['count23']+trains[p]['count31']+trains[p]['count32']+trains[p]['count33']
			if(sumtrn>0) {
				xtr += '<tr bgcolor=C9F8B7 align=center>'
				for(j=1;j<=3;j++) {
					for(m=1;m<=3;m++) {
						xtr += '<td>'
						if(trains[p]['count'+j+m]!=0) xtr += trains[p]['count'+j+m]
						else xtr += "&nbsp;"
						xtr += '</td>'
					}
					xtr += '<td bgcolor=A3DE8F></td>'
				}
				xtr += '<td>' + (p==4 ? "&nbsp;" : trains[p]['level']) + '</td>'
				xtr += '<td align=left>' + trains[p]['name'] + '</td>'
				xtr += '</tr>'
			}
		}
		xtr += '</table>'
		$('td.back4').append(xtr)

		xtr = '<br><b>Индивидуальные:</b><table width=90% bgcolor=A3DE8F>'
		xtr += '<tr bgcolor=white><th width=15%>гр1</th><th bgcolor=A3DE8F></th><th width=15%>гр2</th><th bgcolor=A3DE8F></th><th width=15%>гр3</th><th bgcolor=A3DE8F></th><th width=1%>наг</th></th><th>тренировка</th></tr>'
		for (p in itrains){ 
			if(itrains[p]['count1']+itrains[p]['count2']+itrains[p]['count3']!=0) {
				xtr += '<tr bgcolor=C9F8B7 align=center>'
				for(j=1;j<=3;j++) {
					xtr += '<td>' 
					xtr += (itrains[p]['count'+j]!=0 ? itrains[p]['count'+j] : "&nbsp;")
					xtr += '</td>'
					xtr += '<td bgcolor=A3DE8F></td>'
				}
				xtr += '<td>' + itrains[p]['level'] + '</td>'
				xtr += '<td align=left>' + itrains[p]['name'] + '</td>'
				xtr += '</tr>'
			}
		}
		xtr += '</table>'
		$('td.back4').append(xtr)		

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