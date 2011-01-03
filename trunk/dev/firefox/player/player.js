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

function CheckPlayer(x ,y){
	if (x==1) {
		// Save data to a the current session's store
		sessionStorage.peflplayer = 'запомнили: ' + y + ' ';
	} else {
		// Access some stored data
		alert( "peflplayer = " + sessionStorage.peflplayer );
	}
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

function CodeForForum(player,st){
	var x = '' 

	x += '[url=plug.php?' + location.search.substring(1) + ']' + player[st['Имя']] + '  ' + player[st['Фам']] + '[/url] (сс=' + player[st['сс']] + ')'

	if (UrlValue('t') == 'p') x += ' | [player=' + player[st["id"]] + '][img]images/eye.png[/img][/player]'

	if (player[st['стр']] != ' ') x+= ' | [b]' + player[st['стр']] + '[/b]'

	x += ' | ' + player[st['поз']] + ' ' + player[st['взр']]

	if (player[st['трн']] == 1)	x += ' | [img]system/img/g/sale.png[/img]'

	if (player[st['turl']] == '') x += ' | ' + player[st['ком']]
	else x += ' | [url=' + player[st['turl']] + ']' + player[st['ком']] + '[/url]'

	return x
}

$().ready(function() {
/**/

	var rempid = 1
	var sk = {'лд':'Лидерство','др':'Дриблинг','уд':'Удары','пс':'Игра в пас','ви':'Видение поля','гл':'Игра головой','вх':'Игра на выходах','нв':'Навесы','ду':'Дальние удары','по':'Перс. опека','ре':'Реакция',
			'ск':'Скорость','шт':'Штрафные','вп':'Выбор позиции','уг':'Угловые','ру':'Игра руками','тх':'Техника','мщ':'Мощь','от':'Отбор мяча','рб':'Работоспособность','вн':'Выносливость'}
	var skr = {'Лидерство':'лд','Дриблинг':'др','Удары':'уд','Игра в пас':'пс','Видение поля':'ви','Игра головой':'гл','Игра на выходах':'вх','Навесы':'нв','Дальние удары':'ду','Перс. опека':'по','Реакция':'ре',
			'Скорость':'ск','Штрафные':'шт','Выбор позиции':'вп','Угловые':'уг','Игра руками':'ру','Техника':'тх','Мощь':'мщ','Отбор мяча':'от','Работоспособность':'рб','Выносливость':'вн'}


	var sto = 's,f,сс,сст,са,со,КСт,стр,Фам,Имя,взр,id,иСб,гСб,кнт,зрп,ном,уг,нв,др,уд,шт,ру,гл,вх,лд,ду,по,ск,пс,вп,ре,вн,мщ,от,ви,рб,тх,мрл,фрм,поз,оиг,огл,опс,оим,тре,трв,дск,сыг,пн,иш,иу,кп,идл,ИдлПоз,hash,иМл,гМл,ком,turl,трн'.split(',');
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


	var poss = [['','','','','',''],
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
	]
	
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

	// отдельный цикл чтобы получить id именно последнего td - как сделать по другому пока не думал
	$('td').each(function(i,val){
//		var str = 'Умения'
		var str2 = 'Лидерство'
		var str3 = 'Национальные турниры:'
//		if ($(val).html().replace(/<!-- [а-я] -->/g,'').indexOf(str) != -1) um = i
		if ($(val).html().replace(/<!-- [а-я] -->/g,'').indexOf(str2) != -1) ld = i
		if ($(val).html().replace(/<!-- [а-я] -->/g,'').indexOf(str3) != -1) {
			fr = i;
		} else {
			// для школьников
			if ($(val).html() == '<span class="text2b"></span>') {
				fr = i+1;
			}
		}
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
		if (i == fr) {
			umval = val
			$(val).find('center').each(function(m,valm){
				if (m==0) {
					var x = $(val).find('center').html().replace('<b>','').replace('</b>','').replace(/<!-- [а-я] -->/g,'').split('<br>',6)
					var j = 0
					var name = x[j].split(' (',1)[0]

					player[st['ком']] = ''
					player[st['turl']] = ''
					player[st['трн']] = 0

					if (UrlValue('t') =='p') {
						player[st['turl']] = $('td.back4 a:first').attr('href')
						player[st['ком']] = $('td.back4 a:first').text()
					} else if (UrlValue('t') =='p2'){
						player[st['ком']] = 'свободный'
					}

					player[st['id']]  = UrlValue('j')
					player[st['hash']]  = UrlValue('z')
					if (UrlValue('t') == 'yp') player[st['f']]  = 5	// школяр!

					if (name.indexOf(' ')!=-1){
						player[st['Имя']] = name.split(' ',1)[0]
						player[st['Фам']] = name.replace(player[st['Имя']]+' ','').replace(player[st['Имя']]+'-','')
					} else {
						player[st['Имя']] = ''
						player[st['Фам']] = name
					}	
					j++
					if (x[j].indexOf('в аренде') !=-1) j++
					player[st['взр']] = +x[j].split(' ',1)[0]
					if (x[j].indexOf('(матчей')!=-1){
						player[st['стр']] = x[j].split(', ',2)[1].split(' (',1)[0]
						player[st['иСб']] = +x[j].split(', ',2)[1].split('матчей ',2)[1]
						player[st['гСб']] = +x[j].split(', ',3)[2].split(' ',2)[1].replace(')','')
						if (x[j].indexOf('U21')!=-1){
							player[st['иМл']] = +x[j].split('/ U21 матчей ',2)[1].split(',',1)[0]
							player[st['гМл']] = +x[j].split('/ U21 матчей ',2)[1].split(', голов ',2)[1].replace(')','')
						} else {
							player[st['иМл']] = 0
							player[st['гМл']] = 0
						}
					} else {
						player[st['стр']] = ' '
						player[st['иСб']] = 0
						player[st['гСб']] = 0
						player[st['иМл']] = 0
						player[st['гМл']] = 0
					}
					j++
					if (x[j].indexOf('Контракт:')!=-1) {
						player[st['кнт']] = +x[j].split(' ',4)[1]
						player[st['зрп']] = +x[j].split(' ',4)[3].replace(/,/g,'').replace('$','')
						j++
					} else {
						player[st['кнт']] = 0
						player[st['зрп']] = 0
					}
					if (x[j].indexOf('Номинал:') != -1) {
						player[st['ном']] = +x[j].split(' ',2)[1].replace(/,/g,'').replace('$','')
						j++
					} else {
						player[st['ном']] = 0
					}
					if (x[j].indexOf('Клуб требует:') != -1) {
						j++
						player[st['трн']] = 1
					}
					player[st['поз']] = x[j]

				} else if (m==2){
					var j = 0
					var x = $(valm).html().replace(/<!-- [а-я] -->/g,'').split('<br>')
					player[st['фрм']] = +x[j].split(': ',2)[1].split('%',1)[0]
					player[st['мрл']] = +x[j].split(': ',3)[2].replace('%</i>','')

				}
			})
			
		}

		// $('td.back4 table:first table:first td').each(function(){
		//		if (x % 2 == 0)

		// })
		if (i>=ld && i<ld+36 && next==0){
			skillname = $(val).find('script').remove().end().html().replace(/<!-- [а-я] -->/g,'')
			next = i + 1
		}
		if (i>=ld && i<ld+36 && i == next){
			skillvalue = parseInt($(val).find('script').remove().end().html().replace('<b>',''))
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
			}
			
		}
		posfilter[j][0] = sst/ideal*100
		posfilter[j][2] = posfilter[j][0].toFixed(1)
		posfilter[j][0] = posfilter[j][0]/koff
		posfilter[j][1] = psj[0]		// GK
	}

	posfilter.sort(sSkills)
	player[st['сс']] = ss
	player[st['идл']] = posfilter[1][2]
	player[st['ИдлПоз']] = posfilter[1][1]

	var tmp=''
	for (var i in posfilter) for (var s in posfilter[i]) tmp += posfilter[i][s] + '\n'

	var text3 = ''
//	text3 += '<br><a id="remember" onclick="CheckPlayer(1,'+player[st['id']]+')">'+('Запомнить').fontsize(1)+'</a>'
//	text3 += '<br><a id="compare" onclick="CheckPlayer(0)">'+('Сравнить').fontsize(1)+'</a><br>'

	text3 += '<br><b>Сила&nbsp;игрока</b>'
	text3 += '&nbsp;(<a onclick="ShowAll('+(ld+2)+')">'+('x').fontsize(1)+'</a>)'

	var hidden = 0
	var pfs3pre = ''
	var pflinkpre = ''
	for (var s in posfilter) {
		if (!isNaN(posfilter[s][2])) {
			var linktext = String(posfilter[s][2]+':'+posfilter[s][1].replace(' ','&nbsp;'))
			if (posfilter[s][0]<1 && hidden == 0) hidden = 1
			if ( hidden ==1) {
				hidden = 2
				text3 += '<br><a id="mya" onclick="OpenAll()">...</a>'
				text3 += '<br><div id="mydiv">'
			}
			if (pfs3pre != posfilter[s][3] || pflinkpre != linktext) text3 += '<br><a onclick="ShowSkills('+(ld+2)+',\''+posfilter[s][3]+'\')">'+linktext.fontsize(1)+'</a>'
		}
		var pfs3pre = posfilter[s][3]
		var pflinkpre = linktext
	}
	text3 += '</div>'

	$(umval).each(function(j,val2){
			if (j==0) {
				$(val2).html($(val2).html().replace('Умения</b>','Умения</b>(сс='+String(player[st['сс']]).fontsize(1)+')'))
			}
	})

//	$('td.back4 script').remove()
	$('body').append('<table align=center cellspacing="0" cellpadding="0"><tr><td width=200></td><td id="crabcenter"></td><td width=200 valign=top><table height=100%  width=100%><tr><td height=86></td></tr><tr><td height=20></td></tr><tr><td height=100% valign=top id="crabright"></td></tr></table></td></tr></table>')
	$('table.border').appendTo( $('td#crabcenter') );

	$("#crabright").html(text3)
	$("#mydiv").hide()


	//ShowSkills(ld,'"'+skills[0]+'"')
	if (UrlValue('t') != 'yp' && UrlValue('t') != 'yp2') {
		var prehtml = '<br>Код для форума:<hr>' + CodeForForum(player,st) + '<hr>'
		$("td.back4").append(prehtml)
	}

});