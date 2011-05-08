
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

function Rename(old_name){
	return old_name.replace('андартные','.')
}

var data_assoc = [];
var players = [];
var groups = [[]];
var trains = [];
trains[0] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'пусто'};
trains[1] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'5x5 на большом поле (сред)'};
trains[2] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Защита в меньшестве (сред)'};
trains[3] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Изучение соперника (нет)'};
trains[4] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Индивидуальные'};
trains[5] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Квадраты (сред)'};
trains[6] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Кросс (выс)'};
trains[7] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Минифутбол (сред)'};
trains[8] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Оффсайдные ловушки (низ)'};
trains[9] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Переход от обороны к атаке (выс)'};
trains[10] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Позиционная атака (сред)'};
trains[11] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Прессинг (выс)'};
trains[12] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Спринт (сред)'};
trains[13] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Станд.положения (атака, низ)'};
trains[14] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Станд.положения (защита, низ)'};
trains[15] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Тактическое занятие (нет)'};
trains[16] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Тренажеры (оч.выс)'};
trains[17] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Тренировочный матч (оч.выс)'};
trains[18] = {count11:0,count12:0,count13:0,count21:0,count22:0,count23:0,count31:0,count32:0,count33:0,name:'Отдых'};

/**/

$().ready(function() {

	var text = ''
	var today = new Date()
	today = check(today.getDate()) + '.'+check(today.getMonth()+1)

	var trn = [0]
	trn[0] = [today]

	var srch="Вы вошли как "
	var curManagerNick = $('td.back3 td:contains('+srch+')').html().split(',',1)[0].replace(srch,'')
	var trnManagerNick = ''

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

			if (tmpplayer["inj"] == 0 &&
				tmpplayer["rest"] == 0 &&
				tmpplayer["notrain"] == 0 &&
				(	tmpplayer["newpos"] == 0 || 
					(	tmpplayer["newpos"] > 0 && 
						tmpplayer["tr1"] != 4 && 
						tmpplayer["tr2"] != 4 && 
						tmpplayer["tr3"] != 4))) {
				for(j=1;j<=3;j++) {
					trains[tmpplayer["tr"+j]]['count'+pg+j] +=  1
				}
			}

			var playerid = data_assoc["id" + i];
			players[playerid] = tmpplayer;
		}
		var xtr = '<hr><b>Тренировка основы:</b><table width=90% bgcolor=A3DE8F>'
		xtr += '<tr bgcolor=white><th colspan=3 width=15%>гр1</th><th bgcolor=A3DE8F></th><th colspan=3 width=15%>гр2</th><th bgcolor=A3DE8F></th><th colspan=3 width=15%>гр3</th><th bgcolor=A3DE8F></th><th>тренировка</th></tr>'
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
				xtr += '<td align=left>' + Rename(trains[p]['name']) + '</td>'
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
			.attr('width',"100%")
			.attr("bgcolor","A3DE8F")
			.prepend('<tr bgcolor=white><th>Тренировки на '+ num_players +' игроков</th><th>' + ($('img[src="system/img/g/ball1.gif"]').length-1) + ' мч</th></tr>')

		var ctnsum1 = 0
		var ctnsum2 = 0
		var ctnsum3 = 0
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
				ctnsum3 += ctn3
				$(val).prepend('<td align=center>'+(ctn2!=0? String(ctn2).fontsize(1) :"")+'</td>')
				ctnsum2 += ctn2
				$(val).prepend('<td align=center>'+(ctn1!=0? String(ctn1).fontsize(1) :"")+'</td>')
				ctnsum1 += ctn1
			}
			var ht = ''
			var trnt = ''
			for (j=trn.length-1;j>=0;j--) {
				raz = (trn[j][i]-trnt).toFixed(4)
				if (raz>0) raz = ('+'+raz).fontcolor('green')
				else if (raz<0) raz = raz.fontcolor('red')
				if(i==0 && j!=trn.length-1) ht = '<th>'+trn[j][i]+'</th>' + ht
				else if(j!=trn.length-1) ht = '<td>'+(trn[j][i]+'<sup>'+raz+'</sup>').fontsize(1)+'</td>' + ht
				trnt = trn[j][i]
			}
			$(val).append(ht)
		})
		$('td.back4 table table:eq(1) tr:first').each(function(i,val){
			
			$(val).prepend('<th>'+('*<sup>2</sup>').fontsize(1)+'</th>')
			$('td.back4 table table:eq(1)').after('<div align=left><b>*<sup>2</sup></b> - влияют только на 25%</div>')

			$(val).prepend('<th>'+('*<sup>1</sup>').fontsize(1)+'</th>')
			$('td.back4 table table:eq(1)').after('<br><div align=left><b>*<sup>1</sup></b> - влияют только на 50%<br></div>')

			$(val).prepend('<th></th>')
		})
	})
}, false)