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

function sSkills(i, ii) { // Сортировка
    if 		(i[0] < ii[0])	return  1
    else if	(i[0] > ii[0])	return -1
    else					return  0
}

function ShowAll(){
	$('td.back4 table:first table:first td').each(function(){
		$(this).removeAttr('bgcolor').find('img').removeAttr('style')
	})
}

function ShowSkills(skl){
	ShowAll()
	$('td.back4 table:first table:first td:even').each(function(){
		if (skl.indexOf($(this).find('script').remove().end().html().replace(/<!-- [а-я] -->/g,'')) == -1){
			$(this).attr('bgcolor','#C9F8B7')
			.next().attr('bgcolor','#C9F8B7').find('img').hide();
		}
	})
}

function OpenAll(){
	if ($("#mydiv").attr('style') == 'display: none;') $("#mydiv").show()
	else $("#mydiv").hide()
}

function CheckPlayer(x){
	if (x == 0) {
		// Access some stored data
		var text = ''
		for (i in pl0){
			 text += i +'='+pl0[i]+', '
		}
		$('td.back4').prepend(text + '<br>')
		$('td.back4').prepend(sessionStorage.peflplayer + '<br><br>')
	} else {
		// Save data to a the current session's store
		var text = ''
		for (i in pl0){
			 text += i+'='+pl0[i]+', '
		}
		sessionStorage.peflplayer = text
		alert('Store: ' + text)
	}
	return false
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

function CodeForForum(){
	var x = ''
	var pl = players[0]
	var ptype = UrlValue('t')
	// если не школьник, то короткий код для форума есть.
	if (ptype != 'yp' && ptype != 'yp2') {
		x += '<br><b>Упрощенный вариант</b>:<br><br>'
		x += '[url=plug.php?' + location.search.substring(1) + ']' + pl.firstname + ' ' + pl.secondname + '[/url] (сс=' + pl.sumskills + ')'
		if (ptype == 'p') x += ' | [player=' + pl.id + '][img]images/eye.png[/img][/player]'
		if (pl.natfull != ' ') x+= ' | [b]' + pl.natfull + '[/b]'
		x += ' | ' + pl.position + ' ' + pl.age
		if (pl.sale == 1)	x += ' | [img]system/img/g/sale.png[/img]'
		if (pl.teamurl == '') x += ' | ' + pl.team
		else x += ' | [url=' + pl.teamurl + ']' + pl.team + '[/url]'
		x+= '<br>'
	}

	$('td.back4 table:first table:first img').removeAttr('style')
	x += '<br><hr><b>Полный вариант</b>:<br>'
	x +='<textarea rows="7" cols="90" readonly="readonly" id="CodeForForum">'

	x += '[table width=100% bgcolor=#C9F8B7][tr][td]\n[center]'
	x += $('td.back4 table center:first').find('a:contains("интересуются")').removeAttr('href').end().html()
		.replace(/\<a\>интересуются\<\/a\>/g,'интересуются')
		.replace(/<!-- [а-я] -->/g,'')
		.replace(/\</g,'[')
		.replace(/\>/g,']')
		.replace(/a href=\"/g,'url=')
		.replace(/\/a/g,'/url')
		.replace(/\&amp\;/g,'&')
		.replace(/"/g,'')
		.replace(/\[br\]/g,'\n')
	x += '[/center]\n\n'

	x += $('td.back4 table table:first').html()
		.replace(/<!-- [а-я] -->/g,'')
		.replace(/<tbody>/g,'<table width=100%>')
		.replace(/tbody/g,'table')
		.replace(/\</g,'[')
		.replace(/\>/g,']')
		.replace(/ height=\"12\"/g,'')
		.replace(/img src="/g,'img]')
		.replace(/.gif/g,'.gif[/img')
		.replace(/"/g,'')
		.replace(/\n/g,'')

	if (UrlValue('t') == 'p' ||UrlValue('t') == 'pp'){
		x += '\n\n[center][b]Статистика сезона[/b][/center]\n\n'
		x += $('td.back4 table table:last').html()
			.replace(/<!-- [а-я] -->/g,'')
			.replace(/<tbody>/g,'<table width=100%>')
			.replace(/tbody/g,'table')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/"/g,'')
			.replace(/\[td\]\[\/td\]/g,'[td] [/td]')
	}
	x += '[/td][/tr][/table]'
	x += '\n\n\n[center]--------------- [url=forums.php?m=posts&q=173605]Крабовый VIP[/url] ---------------[/center]\n';
//	x += '[/spoiler]'
	x += '</textarea>'



	$('td.back4').html(x)
	$('td#crabglobalright').empty()

	return true
}

var players = [[]]
var pl0 = players[0]

$().ready(function(){

	var skl = []
	var sklse = []
	var sklsr = []
	var sklfr = []

	skl['nation']	= ['nt' ,'КСт','Код страны']
	skl['natfull']	= ['ntf','стр','страна']
	skl['secondname']= ['snm','Фам','Фамилия']
	skl['firstname']= ['fnm','Имя','Имя']
	skl['age']		= ['age','взр','Возраст']
	skl['id']		= ['id' ,'id','id игрока']
	skl['internationalapps'] = ['inl','иСб','Игр за сборную']
	skl['internationalgoals']= ['ing','гСб','Голов за сборную']
	skl['contract']	= ['cnt','кнт','Контракт']
	skl['wage']		= ['wag','зрп','Зарплата']
	skl['value']	= ['val','ном','Номинал']
	skl['corners']	= ['cn','уг','Угловые']
	skl['crossing']	= ['cr','нв','Навесы']
	skl['dribbling']= ['dr','др','Дриблинг']
	skl['finishing']= ['fn','уд','Удары']
	skl['freekicks']= ['fk','шт','Штрафные']
	skl['handling']	= ['hl','ру','Игра руками']
	skl['heading']	= ['hd','гл','Игра головой']
	skl['exiting']	= ['ex','вх','Игра на выходах']
	skl['leadership']= ['ld','лд','Лидерство']
	skl['longshots']= ['ls','ду','Дальние удары']
	skl['marking']	= ['mr','по','Перс. опека']
	skl['pace']		= ['pc','ск','Скорость']
	skl['passing']	= ['ps','пс','Игра в пас']
	skl['positioning']= ['pt','вп','Выбор позиции']
	skl['reflexes']	= ['rf','ре','Реакция']
	skl['stamina']	= ['st','вн','Выносливость']
	skl['strength']	= ['sr','мщ','Мощь']
	skl['tackling']	= ['tc','от','Отбор мяча']
	skl['vision']	= ['vs','ви','Видение поля']
	skl['workrate']	= ['wr','рб','Работоспособность']
	skl['technique']= ['tc','тх','Техника']
	skl['morale']	= ['mrl','мрл','Мораль']
	skl['form']		= ['frm','фрм','Форма']
	skl['position']	= ['pos','поз','Позиция']
	// champ
	skl['games']	= ['gms','игр','']
	skl['goals']	= ['gls','гол','']
	skl['passes']	= ['pss','пас','']
	skl['mom']		= ['mom','им','']
	skl['ratingav']	= ['rat','ртг','']						
	// c = cup?
	skl['cgames']	= ['cgm','.','']
	skl['cgoals']	= ['cgl','.','']
	skl['cpasses']	= ['cps','.','']
	skl['cmom']		= ['cmm','.','']
	skl['cratingav']= ['crt','.','']
	//e = eurocup? (международные)
	skl['egames']	= ['egm','.','']
	skl['egoals']	= ['egl','.','']
	skl['epasses']	= ['eps','.','']
	skl['emom']		= ['emm','.','']
	skl['eratingav']= ['ert','.','']
	//w =  (сборные)
	skl['wgames']	= ['wgm','.','']
	skl['wgoals']	= ['wgl','.','']
	skl['wpasses']	= ['wps','.','']
	skl['wmom']		= ['wmm','.','']
	skl['wratingav']= ['wrt','.','']
	// f = friends
	skl['fgames']	= ['fgm','.','']
	skl['fgoals']	= ['fgl','.','']
	skl['fpasses']	= ['fps','.','']
	skl['fmom']		= ['fmm','.','']
	skl['fratingav']= ['frt','.','']
	// a = all (все)
	skl['vratingav']= ['art','.',''] // округленый
	skl['agames']	= ['agm','.','']
	skl['agoals']	= ['agl','.','']
	skl['apasses']	= ['aps','.','']
	skl['amom']		= ['amm','.','']

	skl['training']	= ['trn','тре','Тренировка']
	skl['inj']		= ['inj','трв','Травма']
	skl['sus']		= ['sus','дск','Дисквалификация']
	skl['syg']		= ['syg','сыг','Сыгранность']

	skl['sumskills']= ['ss','сс','Сумма скилов']
	skl['team']		= ['team','ком','Команда']
	skl['teamurl']	= ['turl','turl','Урл команды']
	skl['sale']		= ['sale','трн','На трансфере?']
	skl['hash']		= ['hash','хэш','Хэш']
	skl['flag']		= ['f','фс','флаг состояния']
	skl['u21apps']	= ['uap','иМл','Игр за U21']
	skl['u21goals']	= ['ugl','гМл','Голов за U21']

	skl['idealnum']	= ['inum','идл','Сила игрока в % от идеала']
	skl['idealpos']	= ['ipos','ИдлПоз','Идеальная позиция']


	for (i in skl) {
//		sklse[skl[i][0]] = i
		sklsr[skl[i][1]] = i
		sklfr[skl[i][2]] = i
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
		['C FW(головастик)','skillsrcfw','C','FW',0,'!сст,!s=*0,гл=*3,уд=*2,мщ=*2,вп=*2,ск,f=*0,Фам']
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

	var posfilter = []
	var ssp = 0

	var skillname = ''
	var skillvalue = 0
	var skillsum = 0

	// get player skills
	$('td.back4 table:first table:first td:even').each(function(){
		skillname = $(this).find('script').remove().end().html().replace(/<!-- [а-я] -->/g,'');
		skillvalue = parseInt($(this).next().find('script').remove().end().html().replace('<b>',''));
		skillsum += skillvalue;
		pl0[sklfr[skillname]] = skillvalue;
	})
	pl0.sumskills = skillsum

	//add sum of skills to page
	$('td.back4 table center:first').append('(сс='+String(skillsum)+')')

	//get player header info
	var ms = $('td.back4 table center:first').html().replace('<b>','').replace('</b>','').replace(/<!-- [а-я] -->/g,'').split('<br>',6)
	var j = 0

	var name = ms[j].split(' (',1)[0]
	if (name.indexOf(' ')!=-1){
		pl0.firstname = name.split(' ',1)[0]
		pl0.secondname = name.split(' ',2)[1]
	} else {
		pl0.firstname = ''
		pl0.secondname = name
	}	

	pl0.team = ''
	pl0.teamurl = ''
	pl0.sale = 0

	if (UrlValue('t') =='p') {
		pl0.teamurl = $('td.back4 a:first').attr('href')
		pl0.team = $('td.back4 a:first').text()
	} else if (UrlValue('t') =='p2'){
		pl0.team = 'свободный'
	}

	pl0.id  = UrlValue('j')
	pl0.hash  = UrlValue('z')
	// школяр!
	if (UrlValue('t') == 'yp') {
		pl0.flag = 5
	}
 	j++
	if (ms[j].indexOf('в аренде') !=-1) j++
	pl0.age = +ms[j].split(' ',1)[0]
	if (ms[j].indexOf('(матчей')!=-1){
		pl0.natfull = ms[j].split(', ',2)[1].split(' (',1)[0]
		pl0.internationalapps = +ms[j].split(', ',2)[1].split('матчей ',2)[1]
		pl0.internationalgoals = +ms[j].split(', ',3)[2].split(' ',2)[1].replace(')','')
		if (ms[j].indexOf('U21')!=-1){
			pl0.u21apps = +ms[j].split('/ U21 матчей ',2)[1].split(',',1)[0]
			pl0.u21goals = +ms[j].split('/ U21 матчей ',2)[1].split(', голов ',2)[1].replace(')','')
		} else {
			pl0.u21apps = 0
			pl0.u21goals = 0
		}
	} else {
		pl0.natfull = ' '
		pl0.internationalapps = 0
		pl0.internationalgoals = 0
		pl0.u21apps = 0
		pl0.u21goals = 0
	}
	j++
	if (ms[j].indexOf('Контракт:')!=-1) {
		pl0.contract = +ms[j].split(' ',4)[1]
		pl0.wage = +ms[j].split(' ',4)[3].replace(/,/g,'').replace('$','')
		j++
	} else {
		pl0.contart = 0
		pl0.wage = 0
	}
	if (ms[j].indexOf('Номинал:') != -1) {
		pl0.value = +ms[j].split(' ',2)[1].replace(/,/g,'').replace('$','')
		j++
	} else {
		pl0.value = 0
	}
	if (ms[j].indexOf('Клуб требует:') != -1) {
		j++
		pl0.sale = 1
	}
	pl0.position = ms[j]


	// get post-info
	var ms2 = $('td.back4 > center:first').html()
	if (ms2 != null){
		var j2 = 0
		ms2 = ms2.replace(/<!-- [а-я] -->/g,'').split('<br>')
		pl0.form = +ms2[j2].split(': ',2)[1].split('%',1)[0]
		pl0.morale = +ms2[j2].split(': ',3)[2].replace('%</i>','')
	} else {
		//
		pl0.form = 0
		pl0.morale = 0
	}

	var mm = ''
	// fill poss masive
	for (var j in poss) {
		posfilter[j] = [0]
		posfilter[j][3] = ''
		posfilter[j][0] = 0
		posfilter[j][2] = 0
		ideal = 0
		sst = 0
		var psj = poss[j]
		var sksstr = psj[5].split(',') 			// !сст,!s=*0,ре=*2,вп=*2,вх=*2,ру=*1.5,мщ=*1.5,пс,f=*0,Фам
		var koff = 1

		if ((pl0.position.indexOf(psj[2]) == -1) || (pl0.position.indexOf(psj[3]) == -1)) koff = 1000


		for (var s in sksstr) {
			var sks = sksstr[s].replace('!','').split('=',2)	// sks[0] = ре, sks[1] = *2
			if ( sklsr[sks[0]]) {
				var skillname = sklsr[sks[0]]	// reflex
				var skilloperation = (sks[1] ? sks[1] : '*0')
				var skillvalue = (isNaN(parseInt(pl0[skillname])) ? 1 : parseInt(pl0[skillname]))
				posfilter[j][3] += skl[skillname][2] + ','
				ideal += eval(15 + skilloperation)
				sst += eval( skillvalue + skilloperation )
			}
		}

		posfilter[j][0] = sst/ideal*100
		posfilter[j][2] = posfilter[j][0].toFixed(1)
		posfilter[j][0] = posfilter[j][0]/koff
		posfilter[j][1] = psj[0]
	}

	posfilter.sort(sSkills)
	pl0.idealnum = posfilter[1][2]
	pl0.idealpos = posfilter[1][1]

	var text3 = ''
//	text3 += '<br><a id="remember" href="javascript:void(CheckPlayer(1))">'+('Запомнить').fontsize(1)+'</a>'
//	text3 += '<br><a id="compare" href="javascript:void(CheckPlayer(0))">'+('Сравнить').fontsize(1)+'</a><br>'

	text3 += '<br><a id="codeforforum" href="javascript:void(CodeForForum())">'+('Код для форума').fontsize(1)+'</a><br>'
	text3 += '<br><b>Сила&nbsp;игрока</b>'
	text3 += '&nbsp;(<a href="javascript:void(ShowAll())">'+('x').fontsize(1)+'</a>)'

	var hidden = 0
	var pfs3pre = ''
	var pflinkpre = ''
	for (var s in posfilter) {
		if (!isNaN(posfilter[s][2])) {
			var linktext = String(posfilter[s][2]+':'+posfilter[s][1].replace(' ','&nbsp;'))
			if (posfilter[s][0]<1 && hidden == 0) hidden = 1
			if ( hidden ==1) {
				hidden = 2
				text3 += '<br><a id="mya" href="javascript:void(OpenAll())">...</a>'
				text3 += '<div id="mydiv">'
			}
			if (pfs3pre != posfilter[s][3] || pflinkpre != linktext) text3 += '<br><a href="javascript:void(ShowSkills(\''+posfilter[s][3]+'\'))">'+linktext.fontsize(1)+'</a>'
		}
		var pfs3pre = posfilter[s][3]
		var pflinkpre = linktext
	}
	text3 += '</div>'

	var preparedhtml = ''
	preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr><td width=200></td><td id="crabglobalcenter"></td><td id="crabglobalright" width=200 valign=top>'
	preparedhtml += '<table id="crabrighttable" bgcolor="#C9F8B7" width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
	preparedhtml += '</td></tr></table>'
	$('body table.border:last').before(preparedhtml)
	$('td.back4 script').remove()
	$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
	$('#crabrighttable').addClass('border') 
	$("#crabright").html(text3)
	$("#mydiv").hide()
	return false
});