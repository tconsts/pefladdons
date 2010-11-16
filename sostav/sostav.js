function getPairValue(str,def,delim) {
	def	= (def ? def : '')
	delim	= (delim ? delim : '=')
	arr	= str.split(delim)
	return (arr[1] == undefined ? def : arr[1])
}

function getPairKeyNum(str,delim) {
	delim = (delim ? delim : '=')
	arr = str.split(delim)
	return (isNaN(+arr[0]) ? 0 : +arr[0])
}

function getPairKey(str,def,delim) {
	def	= (def ? def : '')
	delim	= (delim ? delim : '=')
	arr	= str.split(delim)
	return (arr[0] == str ? def : arr[0])
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

function sSkills(i, ii) { // По SumSkills (убыванию)
    if 		(i[0] < ii[0])	return  1
    else if	(i[0] > ii[0])	return -1
    else					return  0
}

function getValue(pname,cname,curVal){
	var retVal = prompt('Введите новые значения для ' + pname + ', варианты(через запятую без пробелов):\n \
s,f,сс,сст,са,со,КСт,стр,Фам,Имя,взр,id,иСб,гСБ,кнт,зрп,ном,пн,иш,иу,кп,идл,ИдлПоз\n уг,нв,др,уд,шт,ру,гл,вх,лд,ду,по,ск,пс,вп,ре,вн,мщ,от,ви,рб,тх,мрл,фрм,поз,трв,дск,сыг\n\nЗначения до ":", имя и кол-во записей в таблице (0=все) \n коэф. скилов для сортировки задавать через "=" и операция, например лд=*2\n! - не показывать, f - флаг состояния, s - попадания в состав', curVal);

	if (retVal != null) setCookie(cname,retVal)
	return true
}

function ShowPos(pfarr, psarr){
	var fonselectpos= ' bgcolor=#A3DE8F'
	var fonschool 	= ' bgcolor=#729FCF'
	var fonmorale 	= ' bgcolor=#E9B96E'
	var fonform 	= ' bgcolor=#FCE94F'
	var fonsus 		= ' bgcolor=#A40000'
	var foninj 		= ' bgcolor=#EF2929'
	var fonsostav	= ' bgcolor=#FFFFFF'
	var fоnsostavw	= ' bgcolor=red'
	var fоnzamena	= ' bgcolor=#BABDB6'
	var table2	= 'table width=100% height=100%'
	var tr2		= 'tr'
	var tr2f	= 'tr'
	var td2		= 'td'
	var td2f	= 'td'
	var html	= ''
	var colspan = pfarr[0].length
	if (pfarr[1] && pfarr[1]!='')	table2 += ' bgcolor=#C9F8B7'
	else 							table2 += ' bgcolor=#A3DE8F'
 
	var pf = pfarr.sort(sSkills)
	var num = (psarr[4]==0 ? pfarr.length : psarr[4])

	html+='<'+table2+'>'
	var cnum =0;
	for (var i in pf) {
		var pfi0 = pf[i][0]
		td2f = td2
		tr2f = tr2
		if (i==0) html += '<'+tr2+'><th colspan='+colspan+'><a href="javascript:void(getValue(\''+psarr[0]+'\',\''+psarr[1]+'\',\''+psarr[0]+','+psarr[4]+':'+psarr[5]+'\'))">' + psarr[0] + '</a></th></tr>'

		for (var j in pf[0]){
			var pf0j = pf[0][j]
			var pfij = pf[i][j]
			if (pf0j.replace(/!/g,'') == 's'){
				switch (+pfij){
					case 1:  tr2f += fоnzamena;break
					case 2:  tr2f += fonsostav;break
					case 3:  tr2f += fоnsostavw;break
					default: tr2f += ''
				}
			}
		}
		if (cnum<=num && (isNaN(pfi0) || pfi0>-10000)) {
			html += '<'+tr2f+'>';
			for (var j=0;j<pf[i].length;j++) {
				var pf0j = pf[0][j]
				var pfij = pf[i][j]
				if (pf0j.replace(/!/g,'') == 'f'){
					switch (+pfij){
						case 1:  td2f += foninj;break;		//травма
						case 2:  td2f += fonsus;break;		//дисква
						case 3:  td2f += fonform;break;		//форма
						case 4:  td2f += fonmorale;break;	//мораль
						case 5:  td2f += fonschool;break;	//школяр
						default: td2f += ''
					}
					if (i>0) pfij = ''
				}
    			if (pf0j.search('!') == -1){
					html += '<'+(pf0j == 'f' ? td2f : td2)+'>'
					switch (pfij){
						case 'f':	html += '';break;
						default:	html += String(pfij).fontsize(1)
					}
					html += '</td>'
				}
			}
			html += '</tr>'
		}
		cnum++
	}
	html += '</table>'
	return html
}

function ShowHelp(){
	var html = ''
	html += '<table bgcolor=#A3DE8F>'
	html += '<tr><th colspan=4>'+'HELP'.fontsize(1)+'</th></tr>'
	html += '<tr><td bgcolor=#FFFFFF colspan=2>'+'основа'.fontsize(1)+'</td>'
	html += '<td bgcolor=#BABDB6 colspan=2>'+'замена'.fontsize(1)+'</td></tr>'
	html += '<tr bgcolor=red><td colspan=4>'+'не своя позиция'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#EF2929></td><td>'+'трв'.fontsize(1)+'</td>'
	html += '<td bgcolor=#A40000></td><td>'+'дск'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#FCE94F></td><td>'+'фрм<90'.fontsize(1)+'</td>'
	html += '<td bgcolor=#E9B96E></td><td>'+'мрл<80'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#729FCF></td><td>'+'шкл'.fontsize(1)+'</td></tr>'
	html += '</table>'
	return html
}

function ShowForumCode(fc,a){
	if (a == 0) return 'Автосостав'
	else {
		var empty = '[table][tr][td][color=#A3DE8F].[/color][/td][/tr][tr][td][color=#A3DE8F].[/color][/td][/tr][/table]'
		var txt = '<textarea cols=20 rows=5 readonly>[table width=100% ]'
		txt += '[tr][td] [/td][td width=20%]'+(fc[23]?fc[23]:empty)+'[/td][td width=20%]'+(fc[24]?fc[24]:empty)+'[/td][td width=20%]'+(fc[25]?fc[25]:empty)+'[/td][td] [/td][/tr]'
		txt += '[tr][td width=20%]'+(fc[18]?fc[18]:empty)+'[/td][td width=20%]'+(fc[19]?fc[19]:empty)+'[/td][td width=20%]'+(fc[20]?fc[20]:empty)+'[/td][td width=20%]'+(fc[21]?fc[21]:empty)+'[/td][td width=20%]'+(fc[22]?fc[22]:empty)+'[/td][/tr]'
		txt += '[tr][td width=20%]'+(fc[13]?fc[13]:empty)+'[/td][td width=20%]'+(fc[14]?fc[14]:empty)+'[/td][td width=20%]'+(fc[15]?fc[15]:empty)+'[/td][td width=20%]'+(fc[16]?fc[16]:empty)+'[/td][td width=20%]'+(fc[17]?fc[17]:empty)+'[/td][/tr]'
		txt += '[tr][td width=20%]'+(fc[8]?fc[8]:empty)+'[/td][td width=20%]'+(fc[9]?fc[9]:empty)+'[/td][td width=20%]'+(fc[10]?fc[10]:empty)+'[/td][td width=20%]'+(fc[11]?fc[11]:empty)+'[/td][td width=20%]'+(fc[12]?fc[12]:empty)+'[/td][/tr]'
		txt += '[tr][td width=20%]'+(fc[3]?fc[3]:empty)+'[/td][td width=20%]'+(fc[4]?fc[4]:empty)+'[/td][td width=20%]'+(fc[5]?fc[5]:empty)+'[/td][td width=20%]'+(fc[6]?fc[6]:empty)+'[/td][td width=20%]'+(fc[7]?fc[7]:empty)+'[/td][/tr]'
		txt += '[tr][td] [/td][td] [/td][td width=20%]'+(fc[2]?fc[2]:empty)+'[/td][td] [/td][td] [/td][/tr]'
		txt += '[tr][td] [/td][td] [/td][td width=20%]'+(fc[1]?fc[1]:empty)+'[/td][td] [/td][td] [/td][/tr]'
		txt += '[/table]</textarea><br><b>Состав для форума</b>'
		return txt
	}
}

$().ready(function() {
	var text = ''
	var posfilter = []
	var forumcode = []
	var poss = [['','','',''],
		['GK','skillsgk',  '', 'GK',0,'!сст,!s=*0,ре=*2,вп=*2,вх=*2,ру=*1.5,мщ=*1.5,пс=*0.5,f=*0,Фам'],
		['SW(либеро)','skillssw',  'C','SW',0,'!сст,!s=*0,от=*2,вп=*2,гл=*1.6,ск=*1.5,мщ=*1.4,f=*0,Фам'],
		['L DF','skillsldf', 'L','DF',0,'!сст,!s=*0,от=*3,вп=*1.5,пс=*1.5,ск=*1.3,нв=*1.3,рб,f=*0,Фам'],
		['C DF(защитник)','skillslcdf','C','DF',0,'!сст,!s=*0,от=*3,мщ=*1.7,вп=*1.5,ск=*1.3,f=*0,Фам'],
		['C DF(персональщик)','skillsccdf','C','DF',0,'!сст,!s=*0,по=*3,от=*3,мщ=*1.7,вп=*1.5,ск=1.3,f=*0,Фам'],
		['C DF(головастик)','skillsrcdf','C','DF',0,'!сст,!s=*0,гл=*3,вп=*2.1,от=*2,мщ=*1.9,ск=*1.3,ви,f=*0,Фам'],
		['R DF','skillsrdf', 'R','DF',0,'!сст,!s=*0,от=*3,вп=*1.5,пс=*1.5,ск=*1.3,нв=*1.3,рб,f=*0,Фам'],
		['L DM','skillsldm', 'L','DM',0,'!сст,!s=*0,от=*2.5,нв=*2,рб=*2,пс=*2,вп,ск,ви,f=*0,Фам'],
		['C DM(стоппер)','skillslcdm','C','DM',0,'!сст,!s=*0,от=*2.5,пс=*2.5,гл=*2,вп=*1.5,мщ=*1.5,ви,тх,f=*0,Фам'],
		['C DM(персональщик)','skillsccmd','C','DM',0,'!сст,!s=*0,по=*3,от=*2.5,вп=*1.5,мщ=*1.5,ск,f=*0,Фам'],
		['C DM(стоппер)','skillsrcdm','C','DM',0,'!сст,!s=*0,от=*2.5,пс=*2.5,гл=*2,вп=*1.5,мщ=*1.5,ви,тх,f=*0,Фам'],
		['R DM','skillsrdm', 'R','DM',0,'!сст,!s=*0,от=*2.5,нв=*2,рб=*2,пс=*2,вп,ск,ви,f=*0,Фам'],
		['L MF','skillslmf', 'L','M',0,'!сст,!s=*0,нв=*2.5,тх=*2,др=*2,ви=*2,пс=*2,f=*0,Фам'],
		['C MF(дальнобойщик)','skillslcmf','C','M',0,'!сст,!s=*0,ду=*3,пс=*2,тх=*2,уд=*2,ви=*1.5,др=*1.5,f=*0,Фам'],
		['C MF(диспечер)','skillsccmf','C','M',0,'!сст,!s=*0,ви=*3,пс=*2,тх=*2,ду=*1.5,др=*1.5,f=*0,Фам'],
		['C MF(стоппер)','skillsrcmf','C','M',0,'!сст,!s=*0,от=2.5,вп=2,пс=*2,тх=*2,ви=*1.5,f=*0,Фам'],
		['R MF','skillsrmf', 'R','M',0,'!сст,!s=*0,нв=*2.5,тх=*2,др=*2,ви=*2,пс=*2,f=*0,Фам'],
		['L AM','skillslam', 'L','AM',0,'!сст,!s=*0,др=*2.5,нв=*2.5,тх=*2,уд=2,ви=*1.5,пс=*1.5,f=*0,Фам'],
		['C AM(дальнобойщик)','skillslcam','C','AM',0,'!сст,!s=*0,ду=*3,пс=*2,тх=*2,уд=*2,ви=*1.5,др=*1.5,f=*0,Фам'],
		['C AM(диспечер)','skillsccam','C','AM',0,'!сст,!s=*0,ви=*3,пс=*2,тх=*2,др=*2,ду,f=*0,Фам'],
		['C AM(отянутый FW)','skillsrcam','C','AM',0,'!сст,!s=*0,тх=*2.5,др=*2.5,уд=*2,ду=*2,ви,пс,f=*0,Фам'],
		['R AM','skillsram', 'R','AM',0,'!сст,!s=*0,др=*2.5,нв=*2.5,тх=*2,уд=2,ви=*1.5,пс=*1.5,f=*0,Фам'],
		['C FW(офсайды)','skillslcfw','C','FW',0,'!сст,!s=*0,вп=*3,уд=*2,ск=*2,тх=*1.5,др,f=*0,Фам'],
		['C FW(дриблер)','skillsccfw','C','FW',0,'!сст,!s=*0,др=*3,уд=*2,тх=*2,ск,f=*0,Фам'],
		['C FW(головастик)','skillsrcfw','C','FW',0,'!сст,!s=*0,гл=*3,уд=*2,мщ=*2,вп=*2,ск,f=*0,Фам'],
		['Стд. атаки','skillsstda','','',16,'!сст,!s=*100,вп=*3,гл=*3,мщ=*2,ск,са,f=*0,Фам,ск=*0,от=*-1'],
		['Стд. обороны','skillsstdd','','',16,'!сст,!s=*100,вп=*3,гл=*3,мщ=*2,ск,со,f=*0,Фам,ск=*0,др=*-1,уд=*-1'],
		['Исп. угловых','skillscor','','',16,'!сст,!s=*100,уг,нв,ви,f=*0,Фам,иу=*0'],
		['Исп. штрафных','skillsfre','','',16,'!сст,!s=*100,шт=*2,нв=*1.1,ду=*1.2,ви=*1.1,f=*0,Фам,иш=*0'],
		['Исп. пенальти','skillspen','','',16,'!сст,!s=*100,взр=/10,уд,лд,f=*0,Фам,пн=*0'],
		['Капитаны','skillscap','','',16,'!сст,!s=*100,лд=*3-5*3,рб=/2,мрл=/2-45,фрм=-90,взр=*5/10-23*5/10+10,орт=*4-6*4,f=*0,Фам,кп=*0'],
		['Команда','skillstm','','',0,'!сст,ном,сс,стр,взр,f=*0,Фам'],
		['Физ. состояние','skillsc1','','',0,'!сст,!s=*0,дск=*-100,трв=*-100,фрм=-100,мрл=/2-50,f=*0,Фам'],
		['Зарплаты','skillsc2','','',0,'!сст,зрп,кнт=*0.1,f=*0,Фам'],
		['Сыгранность','skillsc3','','',0,'!сст,!s=*0,Фам,f=*0,поз,сыг'],
		['Идеальная позиция(%)','skillsc4','','',0,'!сст,Фам,идл,ИдлПоз'],
		['GK скилы','skillsc5','','',0,'!сст,!s=*0,ре=*2,ру=*1.5,вп=*2,вх=*2,f=*0,Фам'],

	]

	// прописывается заголовок в posfilter из poss
	for (var i in poss) {
		var psi = poss[i]
		// если есть такая куки, то данные берем оттуда
		if (getCookie(psi[1])) {
			var x = getCookie(psi[1])
			var y = getPairKey(x,'none',':')
			if (y != 'none' && y != ''){
				psi[0] = getPairKey(y,psi[0],',').replace(/ /g,'&nbsp;')
				psi[4] = +getPairValue(y,psi[4],',')
			}
			psi[5] = getPairValue(x,psi[5],':')
		}
		posfilter[i] = [psi[5].split(',')]

		//вырезаем коффициенты и операции
		var pfi0 = posfilter[i][0]
		for (var p in pfi0) posfilter[i][0][p] = getPairKey(pfi0[p],pfi0[p])
	}
	$('.back4').html('<table border="0" cellspacing="0" cellpadding="10" width="100%" height="100%"><tr><td valign="top" class="contentframer"></td></tr></table>')

	$.get('fieldnew.php', {}, function(data){
		var dataarray = data.split('&');
		var pid = [];		// id игроков заявленых в состав
		var p0 = [];		// тактика1, всего 5 тактик.
		var z0 = [];		// задания в тактике
		var pen = [];		// 
		var fre = [];		// 
		var cor = [];		// 
		var cap = [];		// 

		var sto = 's,f,сс,сст,са,со,КСт,стр,Фам,Имя,взр,id,иСб,гСБ,кнт,зрп,ном,уг,нв,др,уд,шт,ру,гл,вх,лд,ду,по,ск,пс,вп,ре,вн,мщ,от,ви,рб,тх,мрл,фрм,поз,оиг,огл,опс,оим,орт,тре,трв,дск,сыг,пн,иш,иу,кп,идл,ИдлПоз'.split(',');
		var st = {}
		var k = 0
		for (var i in sto) {
			if (sto[i] == 'вх') {
				st[sto[i]] = st['гл']
			} else {
				st[sto[i]] = k
				k++
			}
		}

		var players = []
		var i = 0
		var p0num = 0
		var z0num = 0
		var pnum = 0
		var capnum = 1
		var frenum = 1
		var cornum = 1
		var pennum = 1
		while(dataarray[i] != null) {
			var cur = dataarray[i]
			var curval = getPairValue(cur)
			var stcc = st["сс"]
			var stcor = st["уг"]
			var sttex = st["тх"]
			var stln = 41

			//  автосос? 0/1
			if (cur.indexOf('new') != -1) var auto = +curval

			// собираем id игроков заявленых в состав
			if (cur.indexOf('pid') != -1) {
				
				pid.push(curval)
				players[curval] = []
				players[curval][st["s"]] = [(pnum < 11 ? 2 : 1)]
				pnum++
			}

			// сопоставить позицию игроков начальной тактики 
			if (cur.indexOf('p0_') != -1) {
				p0.push(getPairValue(cur))

				// указываем id игрока играющего на данной позиции
				posfilter[getPairValue(cur)][1] = [-pid[p0num]]
				p0num++
			}

			// собираем z0 (перс задания 1й тактики)
			if (cur.indexOf('z0') != -1) {
				z0.push(curval);
				if (+curval >= 513) players[pid[z0num]][st["со"]] = '*'
				if (+curval >= 700 || (+curval>=213 && +curval < 500)) players[pid[z0num]][st["са"]] = '*'
				z0num++
			}

			// собираем капитанов
			if (cur.indexOf('cap') != -1) {
				cap.push(curval)
				if (curval != 0) players[curval][st["кп"]] = capnum
				capnum++
			}

			// собираем fre
			if (cur.indexOf('fre') != -1) {
				fre.push(curval)
				if (curval != 0) players[curval][st["иш"]] = frenum
				frenum++
			}

			// собираем cor
			if (cur.indexOf('cor') != -1) {
				cor.push(curval)
				if (curval != 0) players[curval][st["иу"]] = cornum
				cornum++
			}

			// собираем pen
			if (cur.indexOf('pen') != -1) {
				pen.push(curval)
				if (curval != 0) players[curval][st["пн"]] = pennum
				pennum++
			}

			//прописываем чтоб прочие таблички цвет имели как в состав
			for (p=26;p<posfilter.length;p++) posfilter[p][1] = [-10000]

			// получить данные на игроков
			if (cur.indexOf('secondname') != -1) {
				var id = getPairValue(dataarray[i+3])
				if (!players[id]) {
					players[id] = []
					players[id][st["s"]] = 0
				}

				var plid = players[id]
				plid[st["f"]] = 0
				plid[stcc] = 0
				plid[st["сст"]] = 0

				if (!players[id][st["со"]]) players[id][st["со"]] = ''
				if (!players[id][st["са"]]) players[id][st["са"]] = ''

				// собираем данные
				for (var x=0; x<=stln-3; x++) plid.push(getPairValue(dataarray[i+x-2]))
				plid.push(getPairValue(dataarray[i+58]))	// инфа о тренировке
				plid.push(getPairValue(dataarray[i+59]))	// инфа о травме
				plid.push(getPairValue(dataarray[i+60]))	// инфа о дискве
				plid.push(getPairValue(dataarray[i+61]))	// инфа о сыгрыности

				if (!players[id][st["кп"]]) players[id][st["кп"]] = ''
				if (!players[id][st["иш"]]) players[id][st["иш"]] = ''
				if (!players[id][st["иу"]]) players[id][st["иу"]] = ''
				if (!players[id][st["пн"]]) players[id][st["пн"]] = ''

				// сичтаем сумму скилов (включая вратарские у полевых).
				for (var x=st["уг"]; x<=st["тх"]; x++) plid[stcc] += +plid[x]


				//проставляем зп=100 у школяров и контракт до истечения срока (21-взр)
				if (plid[st["кнт"]]==0) plid[st["кнт"]] = 21-plid[st["взр"]]
				if (plid[st["зрп"]]==0) plid[st["зрп"]] = 100;

				// назначить флаг отображения
				if		(plid[st["трв"]] >  0) 	plid[st["f"]] = 1 // травма
				else if	(plid[st["дск"]] >  0) 	plid[st["f"]] = 2 // дисквалификация
				else if	(plid[st["фрм"]] < 90) 	plid[st["f"]] = 3 // плохая форма
				else if	(plid[st["мрл"]] < 80) 	plid[st["f"]] = 4 // плохая мораль
				else if	(plid[st["ном"]] == 0) 	plid[st["f"]] = 5 // школьник

				i = i + 59;
			}
			i++;
		}

		for (var i in posfilter){
			var pfi0 = poss[i][5].split(',')
			if (posfilter[i][1] && i<26 && auto == 0) posfilter[i][1][0] = ''
			var pfi1 = (posfilter[i][1] ? posfilter[i][1][0] : '')
			var psi = poss[i]
			var koff = 1

			for (var p in players){
			  if (players[p][st['поз']]){
				var pl = players[p]
				var plpos = pl[st['поз']]
				var plid = pl[st['id']]
				var osnova = 0
				if (auto == 0) {
					pl[st["s"]] = 0
					pl[st["са"]] = ''
					pl[st["со"]] = ''
				}

				// добавить в состав для форума
				if (+pfi1 == -plid && auto == 1) {
					forumcode[i] = '[table bgcolor=#C9F8B7 width=100%]'
					forumcode[i] += '[tr][td][player='+plid+'][b]'+pl[st["Имя"]].charAt(0)+'.'+(pl[st["Фам"]]).replace(' ','')+'[/b][/player][/td][/tr]'
					forumcode[i] += '[tr][td]фрм'+pl[st["фрм"]]+'/мрл'+pl[st["мрл"]]+'[/td][/tr]'
					forumcode[i] += '[tr][td]'+(pl[st["оиг"]] !=0 ? 'ИГП '+pl[st["оиг"]]+'('+pl[st["огл"]]+'+'+pl[st["опс"]]+')':'...')+'[/td][/tr]'
					forumcode[i] += '[tr][td]'+(pl[st["орт"]] ? 'Р/ИМ '+pl[st["орт"]]+'('+pl[st["оим"]]+')' : '...')+'[/td][/tr]'
					forumcode[i] += '[/table]'
				}

				// пометить игрока не своей позиции назначеного в состав
				if (((plpos.indexOf(psi[2]) == -1) || (plpos.indexOf(psi[3]) == -1)) && +pfi1 == -plid) {
					osnova = 3
					koff = 0.5
				}
				if (((plpos.indexOf(psi[2]) != -1) && (plpos.indexOf(psi[3]) != -1)) || +pfi1 == -plid) {
					var ss = 0;
					posfilter[i][p] = []

					// 	добавить информацию об основе только на нужную позицию
					if (pl[st["s"]] == 1)	osnova = 1 
					else if (((+pfi1 == -plid) || pfi1==-10000) && pl[st["s"]] == 2 && osnova != 3)	osnova = 2
					else if (osnova == 3)	osnova = 3
					else osnova = 0

					var sstnum = -1
					var sum = 0
					var summax = 0
					var mx = 15
					for (j in pfi0) {
						var zagolovok = getPairKey(pfi0[j],pfi0[j]).replace(/!/g,'')
						var sk = String(pl[st[zagolovok]]).replace(/ /g,'&nbsp;')
						var skv = getPairValue(pfi0[j],'')
						var ske = sk.replace(/,/g,'')
						var sks = (isNaN(parseFloat(ske)) ? 0 : eval(parseFloat(ske)+skv))

						if (st[zagolovok] >= st['уг'] && st[zagolovok] <= st['тх']) {
							sum += +sks
							summax += eval(mx+skv)
						}
						switch (zagolovok) {
							case 'сст':	sstnum = +j
							case 's':	sk = osnova
							//case 'Фам':	sk = pl[st['Имя']].charAt(0)+'.'+sk	// подписать первую букву имени к фамилии
							default:						
								posfilter[i][p].push(sk)
								ss += +sks
						}
					}
					var sila = sum/summax*100
					if (i>0 && i<=25 && (!pl[st['идл']] || pl[st['идл']]<sila)) {
						pl[st['идл']] = sila.toFixed(1)
						pl[st['ИдлПоз']] = psi[0]
					}

					// добавляем сумму выделенных скилов
					ss = +ss*koff
					if (sstnum!=-1) posfilter[i][p][sstnum] = +ss.toFixed(1)
				}				
			  }
			}
		}

		//for (var p in players) text += players[p] + '<br>'
		text += '<br>'

		var table1 = 'table frame="void" cellpadding=5'
		var tr1 = 'tr'
		var td1 = 'td valign=top bgcolor=#A3DE8F'
		var td1e = 'td'

		text += '<' +table1+'>'
/**/	text += '<'+tr1+'><'+td1e+' valign=top>'+ShowForumCode(forumcode,auto)+'</td><'+td1+'>' +ShowPos(posfilter[23],poss[23])+ '</td><'+td1+'>' +ShowPos(posfilter[24],poss[24])+ '</td><'+td1+'>' +ShowPos(posfilter[25],poss[25])+ '</td><'+td1e+' valign=top align=center>' + ShowHelp() + '</td></tr>'
		text += '<'+tr1+'><'+td1+'>' +ShowPos(posfilter[18],poss[18])+ '</td><'+td1+'>' +ShowPos(posfilter[19],poss[19])+ '</td><'+td1+'>' +ShowPos(posfilter[20],poss[20])+ '</td><'+td1+'>' +ShowPos(posfilter[21],poss[21])+ '</td><'+td1+'>' +ShowPos(posfilter[22],poss[22])+ '</td></tr>'
		text += '<'+tr1+'><'+td1+'>' +ShowPos(posfilter[13],poss[13])+ '</td><'+td1+'>' +ShowPos(posfilter[14],poss[14])+ '</td><'+td1+'>' +ShowPos(posfilter[15],poss[15])+ '</td><'+td1+'>' +ShowPos(posfilter[16],poss[16])+ '</td><'+td1+'>' +ShowPos(posfilter[17],poss[17])+ '</td></tr>'
		text += '<'+tr1+'><'+td1+'>' +ShowPos(posfilter[8],poss[8])+ '</td><'+td1+'>' +ShowPos(posfilter[9],poss[9])+ '</td><'+td1+'>' +ShowPos(posfilter[10],poss[10])+ '</td><'+td1+'>' +ShowPos(posfilter[11],poss[11])+ '</td><'+td1+'>' +ShowPos(posfilter[12],poss[12])+ '</td></tr>'
/**/	text += '<'+tr1+'><'+td1+'>' +ShowPos(posfilter[3],poss[3])+ '</td><'+td1+'>' +ShowPos(posfilter[4],poss[4])+ '</td><'+td1+'>' +ShowPos(posfilter[5],poss[5])+ '</td><'+td1+'>' +ShowPos(posfilter[6],poss[6])+ '</td><'+td1+'>' +ShowPos(posfilter[7],poss[7])+ '</td></tr>'
		text += '<'+tr1+'><'+td1e+'></td><'+td1e+'></td><'+td1+'>' +ShowPos(posfilter[2],poss[2])+ '</td><'+td1e+'></td><'+td1e+'></td></tr>'
		text += '<'+tr1+'><'+td1e+'></td><'+td1e+'></td><'+td1+'>' +ShowPos(posfilter[1],poss[1])+ '</td><'+td1e+'></td><'+td1e+'></td></tr>'
		text += '</table>'

		text += '<br><br> <table bgcolor=#A3DE8F><tr>'
		text += '<td valign=top>' +ShowPos(posfilter[26],poss[26])+ '</td>'
		text += '<td valign=top>' +ShowPos(posfilter[27],poss[27])+ '</td>'
		text += '<td valign=top>' +ShowPos(posfilter[28],poss[28])+ '</td>'
		text += '<td valign=top>' +ShowPos(posfilter[29],poss[29])+ '</td>'
/**/	text += '<td valign=top>' +ShowPos(posfilter[30],poss[30])+ '</td>'
		text += '<td valign=top>' +ShowPos(posfilter[31],poss[31])+ '</td>'
		text += '<td></td></tr></table>'
		text += '<br><br> <table bgcolor=#A3DE8F><tr>'
		text += '<td valign=top>' +ShowPos(posfilter[32],poss[32])+ '</td>'
		text += '<td valign=top>' +ShowPos(posfilter[33],poss[33])+ '</td>'
		text += '<td valign=top>' +ShowPos(posfilter[34],poss[34])+ '</td>'
		text += '<td valign=top>' +ShowPos(posfilter[35],poss[35])+ '</td>'
		text += '<td valign=top>' +ShowPos(posfilter[36],poss[36])+ '</td>'
		text += '<td valign=top>' +ShowPos(posfilter[37],poss[37])+ '</td>'
		text += '<td></td></tr></table>'

		text += '<br><br><table bgcolor=#A3DE8F><tr><td><img src="http://pefladdons.googlecode.com/svn/trunk/crab1.png"></td><td>'
		text += '<a href="forums.php?m=posts&q=173605">Cостав v1.2</a> (c) <a href="users.php?m=details&id=661">const</a></td></tr></table>'
/**/	$('.contentframer').html(text)
	})

})