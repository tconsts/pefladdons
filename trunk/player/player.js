function getPairValue(str,def,delim) {
	def	= (def ? def : '')
	delim	= (delim ? delim : '=')
	arr	= str.split(delim)
	return (arr[1] == undefined ? def : arr[1])
}

function getPairKey(str,def,delim) {
	def	= (def ? def : '')
	delim	= (delim ? delim : '=')
	arr	= str.split(delim)
	return (arr[0] == str ? def : arr[0])
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

function ShowAll(k){
	$('td').each(function(i,val){
		if (i>=k && i<k+36) $(val).css('color','black').css('background-color','#A3DE8F')
		if ($(val).find('img')) $(val).find('img').show()
	})
}

function ShowSkills(k,skl){
	ShowAll(k)
	var flag = 1
	$('td').each(function(i,val){
		if (i>=k && i<k+36) {
			var data = $(val).find('script').empty().end().html().replace('<script></script>','').replace('<script type="text/javascript"></script>','').replace(/<!-- [а-я] -->/g,'')
			if (skl.indexOf(data) == -1 && flag != 0){ 
				$(val).css('color','#888A85').css('background-color','#C9F8B7');
				if ($(val).find('img')) $(val).find('img').hide()
			} else {
				flag = (flag == 0 ? 1 : 0)
			}
		}
	});
}

function OpenAll(){
	if ($("#mydiv").attr('style') == 'display: none;') $("#mydiv").show()
	else $("#mydiv").hide()
}

$().ready(function() {
/**/
	var sk = {'лд':'Лидерство','др':'Дриблинг','уд':'Удары','пс':'Игра в пас','ви':'Видение поля','гл':'Игра головой','вх':'Игра на выходах','нв':'Навесы','ду':'Дальние удары','по':'Перс. опека','ре':'Реакция',
			'ск':'Скорость','шт':'Штрафные','вп':'Выбор позиции','уг':'Угловые','ру':'Игра руками','тх':'Техника','мщ':'Мощь','от':'Отбор мяча','рб':'Работоспособность','вн':'Выносливость'}
	var skr = {'Лидерство':'лд','Дриблинг':'др','Удары':'уд','Игра в пас':'пс','Видение поля':'ви','Игра головой':'гл','Игра на выходах':'вх','Навесы':'нв','Дальние удары':'ду','Перс. опека':'по','Реакция':'ре',
			'Скорость':'ск','Штрафные':'шт','Выбор позиции':'вп','Угловые':'уг','Игра руками':'ру','Техника':'тх','Мощь':'мщ','Отбор мяча':'от','Работоспособность':'рб','Выносливость':'вн'}


	var sto = 's,f,сс,сст,са,со,КСт,стр,Фам,Имя,взр,id,иСб,гСБ,кнт,зрп,ном,уг,нв,др,уд,шт,ру,гл,вх,лд,ду,по,ск,пс,вп,ре,вн,мщ,от,ви,рб,тх,мрл,фрм,поз,оиг,огл,опс,оим,тре,трв,дск,сыг,пн,иш,иу,кп,идл,ИдлПоз'.split(',');
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
/**/]
	
	for (var i in poss) {
		psi = poss[i]
		if (getCookie(psi[1])) {
			var x = getCookie(psi[1])
			var y = getPairKey(x,'none',':')
			if (y != 'none' && y != ''){
				psi[0] = getPairKey(y,psi[0],',').replace(/ /g,'&nbsp;')
				psi[4] = +getPairValue(y,psi[4],',')
			}
			psi[5] = getPairValue(x,psi[5],':')
		}
	}
/**/

	// отдельный цикл чтобы получить id именно последнего td - как сделать по дургому пока не думал
	$('td').each(function(i,val){
		var str = 'Умения'
		var str2 = 'Лидерство'
		if ($(val).html().replace(/<!-- [а-я] -->/g,'').indexOf(str) != -1) um = i
		if ($(val).html().replace(/<!-- [а-я] -->/g,'').indexOf(str2) != -1) ld = i
	})

	var player = [] 
	var posfilter = []
	var next = 0
	var skillname = ''
	var skillvalue = 0
	var ss = 0
	var ssp = 0
	var umval = ''
	$('td').each(function(i,val){
		if (i == um){
			umval = val
			var x = $(val).find('center').html().replace('<b>','').replace('</b>','').replace(/<!-- [а-я] -->/g,'').split('<br>',6)
			//for (var p in x) text += p+':'+x[p]+'\n'
			var j = 0
			player[st['Фам']] = x[j].split(' (',1)[0]; j++
			if (x[j].indexOf('в аренде') !=-1) j++
			player[st['взр']] = +x[j].split(' ',3)[0]
			player[st['стр']] = x[j].split(', ',2)[1].split(' (',1)[0]; j++
			player[st['кнт']] = +x[j].split(' ',4)[1]
			player[st['зрп']] = +x[j].split(' ',4)[3].replace(/,/g,'').replace('$','');j++
			player[st['ном']] = +x[j].split(' ',2)[1].replace(/,/g,'').replace('$','');j++
			if (x[j].indexOf('Клуб требует:') != -1) j++
			player[st['поз']] = x[j]
		}

		if (i>=ld && i<ld+36 && next==0){
			skillname = $(val).find('script').empty().end().html().replace('<script></script>','').replace('<script type="text/javascript"></script>','').replace(/<!-- [а-я] -->/g,'')
			next = i + 1
		}
		if (i>=ld && i<ld+36 && i == next){
			skillvalue = parseInt($(val).find('script').empty().end().html().replace('<script></script>','').replace('<script type="text/javascript"></script>','').replace('<b>',''))
			//alert(skillname+"("+skr[skillname]+")='"+skillvalue+"'")
			next = 0
			if (skr[skillname]) {
				player[st[skr[skillname]]] = skillvalue
				ss += skillvalue
			}
		}

	})

	for (var j in poss) {
		posfilter[j] = [0]
		posfilter[j][3] = ''
		posfilter[j][0] = 0
		posfilter[j][2] = 0
		ideal = 0
		sst = 0
		var psj = poss[j]
		var sksstr = psj[5].split(',') 					// !сст,!s=*0,ре=*2,вп=*2,вх=*2,ру=*1.5,мщ=*1.5,пс,f=*0,Фам
		var koff = 1

		if ((player[st['поз']].indexOf(psj[2]) == -1) || (player[st['поз']].indexOf(psj[3]) == -1)) koff = 1000

		for (var s in sksstr) {
			var sks = sksstr[s].replace('!','').split('=',2)
			if (sk[sks[0]] ) {
				posfilter[j][3] += sk[sks[0]]+','
				ideal += eval(15+(sks[1]?sks[1]:''))
				sst += eval((player[st[sks[0]]]?player[st[sks[0]]]:1)+(sks[1]?sks[1]:''))

//				if (j==2) alert(sks[0]+':'+ideal+':'+player[st[sks[0]]]+(sks[1]?sks[1]:''))


			}
			
		}
		posfilter[j][0] = sst/ideal*100
		posfilter[j][2] = posfilter[j][0].toFixed(1)
		posfilter[j][0] = posfilter[j][0]/koff
		//posfilter[j][0] = ssp
		//posfilter[j][2] = ssp/100

		posfilter[j][1] = psj[0]		// GK

		// подставляем значения для отображени
		//posfilter[j][3] = 'Реакция,Выбор позиции,Игра на выходах,Игра руками,Мощь,Игра в пас'
	}


	posfilter.sort(sSkills)
	player[st['сс']] = ss

	var tmp=''
	for (var i in posfilter) for (var s in posfilter[i]) tmp += posfilter[i][s] + '\n'


	var text1 = '<table width=100%><tr><td valign=top>'
	var text2 = '</td><td valign=top width=1%><b>Сила&nbsp;игрока</b><br>'
	var hidden = 0
	for (var s in posfilter) {
		if (!isNaN(posfilter[s][2])) {
			var linktext = String(posfilter[s][2]+':'+posfilter[s][1].replace(' ','&nbsp;'))
			if (posfilter[s][0]<1 && hidden == 0) {
				//linktext = String(linktext).italic()
				hidden = 1
			}

			if ( hidden ==1) {
				text2 += '<a id="mya" onclick="OpenAll()">...</a><br><div id="mydiv">'
				hidden = 2
			}
			text2 += '<a onclick="ShowSkills('+(ld+1)+',\''+posfilter[s][3]+'\')">'+linktext.fontsize(1)+'</a><br>'
		}
	}
	text2 += '</div><a onclick="ShowAll('+(ld+1)+')">'+('Сбросить').fontsize(1)+'</a></td></tr></table>'

	$(umval).each(function(j,val2){if (j==0) $(val2).html(text1+$(val2).html().replace('Умения</b>','Умения</b>(сс='+String(player[st['сс']]).fontsize(1)+')')+text2)})
	$("#mydiv").hide()

	//ShowSkills(ld,'"'+skills[0]+'"')
});