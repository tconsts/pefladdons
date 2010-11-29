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

function sSkills(i, ii) { // ѕо SumSkills (убыванию)
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
			var data = $(val).find('script').empty().end().html().replace('<script></script>','').replace('<script type="text/javascript"></script>','').replace(/<!-- [а-€] -->/g,'')
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

function CheckPlayer(x){
	if (x==1) alert('«апомнить игрока')
}

$().ready(function() {
/**/
	var sk = {'лд':'Ћидерство','др':'ƒриблинг','уд':'”дары','пс':'»гра в пас','ви':'¬идение пол€','гл':'»гра головой','вх':'»гра на выходах','нв':'Ќавесы','ду':'ƒальние удары','по':'ѕерс. опека','ре':'–еакци€',
			'ск':'—корость','шт':'Ўтрафные','вп':'¬ыбор позиции','уг':'”гловые','ру':'»гра руками','тх':'“ехника','мщ':'ћощь','от':'ќтбор м€ча','рб':'–аботоспособность','вн':'¬ыносливость'}
	var skr = {'Ћидерство':'лд','ƒриблинг':'др','”дары':'уд','»гра в пас':'пс','¬идение пол€':'ви','»гра головой':'гл','»гра на выходах':'вх','Ќавесы':'нв','ƒальние удары':'ду','ѕерс. опека':'по','–еакци€':'ре',
			'—корость':'ск','Ўтрафные':'шт','¬ыбор позиции':'вп','”гловые':'уг','»гра руками':'ру','“ехника':'тх','ћощь':'мщ','ќтбор м€ча':'от','–аботоспособность':'рб','¬ыносливость':'вн'}


	var sto = 's,f,сс,сст,са,со, —т,стр,‘ам,»м€,взр,id,и—б,г—б,кнт,зрп,ном,уг,нв,др,уд,шт,ру,гл,вх,лд,ду,по,ск,пс,вп,ре,вн,мщ,от,ви,рб,тх,мрл,фрм,поз,оиг,огл,опс,оим,тре,трв,дск,сыг,пн,иш,иу,кп,идл,»длѕоз,hash,ићл,гћл'.split(',');
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
		['GK','skillsgk',  '', 'GK',0,'!сст,!s=*0,ре=*2,вп=*2,вх=*2,ру=*1.5,мщ=*1.5,пс=*0.5,f=*0,‘ам'],
		['SW(либеро)','skillssw',  'C','SW',0,'!сст,!s=*0,от=*2,вп=*2,гл=*1.6,ск=*1.5,мщ=*1.4,f=*0,‘ам'],
		['L DF','skillsldf', 'L','DF',0,'!сст,!s=*0,от=*3,вп=*1.5,пс=*1.5,ск=*1.3,нв=*1.3,рб,f=*0,‘ам'],
		['C DF(защитник)','skillslcdf','C','DF',0,'!сст,!s=*0,от=*3,мщ=*1.7,вп=*1.5,ск=*1.3,f=*0,‘ам'],
		['C DF(персональщик)','skillsccdf','C','DF',0,'!сст,!s=*0,по=*3,от=*3,мщ=*1.7,вп=*1.5,ск=1.3,f=*0,‘ам'],
		['C DF(головастик)','skillsrcdf','C','DF',0,'!сст,!s=*0,гл=*3,вп=*2.1,от=*2,мщ=*1.9,ск=*1.3,ви,f=*0,‘ам'],
		['R DF','skillsrdf', 'R','DF',0,'!сст,!s=*0,от=*3,вп=*1.5,пс=*1.5,ск=*1.3,нв=*1.3,рб,f=*0,‘ам'],
		['L DM','skillsldm', 'L','DM',0,'!сст,!s=*0,от=*2.5,нв=*2,рб=*2,пс=*2,вп,ск,ви,f=*0,‘ам'],
		['C DM(стоппер)','skillslcdm','C','DM',0,'!сст,!s=*0,от=*2.5,пс=*2.5,гл=*2,вп=*1.5,мщ=*1.5,ви,тх,f=*0,‘ам'],
		['C DM(персональщик)','skillsccmd','C','DM',0,'!сст,!s=*0,по=*3,от=*2.5,вп=*1.5,мщ=*1.5,ск,f=*0,‘ам'],
		['C DM(стоппер)','skillsrcdm','C','DM',0,'!сст,!s=*0,от=*2.5,пс=*2.5,гл=*2,вп=*1.5,мщ=*1.5,ви,тх,f=*0,‘ам'],
		['R DM','skillsrdm', 'R','DM',0,'!сст,!s=*0,от=*2.5,нв=*2,рб=*2,пс=*2,вп,ск,ви,f=*0,‘ам'],
		['L MF','skillslmf', 'L','M',0,'!сст,!s=*0,нв=*2.5,тх=*2,др=*2,ви=*2,пс=*2,f=*0,‘ам'],
		['C MF(дальнобойщик)','skillslcmf','C','M',0,'!сст,!s=*0,ду=*3,пс=*2,тх=*2,уд=*2,ви=*1.5,др=*1.5,f=*0,‘ам'],
		['C MF(диспечер)','skillsccmf','C','M',0,'!сст,!s=*0,ви=*3,пс=*2,тх=*2,ду=*1.5,др=*1.5,f=*0,‘ам'],
		['C MF(стоппер)','skillsrcmf','C','M',0,'!сст,!s=*0,от=2.5,вп=2,пс=*2,тх=*2,ви=*1.5,f=*0,‘ам'],
		['R MF','skillsrmf', 'R','M',0,'!сст,!s=*0,нв=*2.5,тх=*2,др=*2,ви=*2,пс=*2,f=*0,‘ам'],
		['L AM','skillslam', 'L','AM',0,'!сст,!s=*0,др=*2.5,нв=*2.5,тх=*2,уд=2,ви=*1.5,пс=*1.5,f=*0,‘ам'],
		['C AM(дальнобойщик)','skillslcam','C','AM',0,'!сст,!s=*0,ду=*3,пс=*2,тх=*2,уд=*2,ви=*1.5,др=*1.5,f=*0,‘ам'],
		['C AM(диспечер)','skillsccam','C','AM',0,'!сст,!s=*0,ви=*3,пс=*2,тх=*2,др=*2,ду,f=*0,‘ам'],
		['C AM(от€нутый FW)','skillsrcam','C','AM',0,'!сст,!s=*0,тх=*2.5,др=*2.5,уд=*2,ду=*2,ви,пс,f=*0,‘ам'],
		['R AM','skillsram', 'R','AM',0,'!сст,!s=*0,др=*2.5,нв=*2.5,тх=*2,уд=2,ви=*1.5,пс=*1.5,f=*0,‘ам'],
		['C FW(офсайды)','skillslcfw','C','FW',0,'!сст,!s=*0,вп=*3,уд=*2,ск=*2,тх=*1.5,др,f=*0,‘ам'],
		['C FW(дриблер)','skillsccfw','C','FW',0,'!сст,!s=*0,др=*3,уд=*2,тх=*2,ск,f=*0,‘ам'],
		['C FW(головастик)','skillsrcfw','C','FW',0,'!сст,!s=*0,гл=*3,уд=*2,мщ=*2,вп=*2,ск,f=*0,‘ам'],
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

	// отдельный цикл чтобы получить id именно последнего td - как сделать по другому пока не думал
	$('td').each(function(i,val){
//		var str = '”мени€'
		var str2 = 'Ћидерство'
		var str3 = 'Ќациональные турниры:'
//		if ($(val).html().replace(/<!-- [а-€] -->/g,'').indexOf(str) != -1) um = i
		if ($(val).html().replace(/<!-- [а-€] -->/g,'').indexOf(str2) != -1) ld = i
		if ($(val).html().replace(/<!-- [а-€] -->/g,'').indexOf(str3) != -1) fr = i
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
					var x = $(val).find('center').html().replace('<b>','').replace('</b>','').replace(/<!-- [а-€] -->/g,'').split('<br>',6)
					var j = 0
					var name = x[j].split(' (',1)[0]

					player[st['id']]  = location.href.split('?',2)[1].split('&',3)[2].split('=',2)[1]
					player[st['hash']]  = location.href.split('?',2)[1].split('&',4)[3].split('=',2)[1]
					if (location.href.split('?',2)[1].split('&',2)[1].split('=',2)[1] == 'yp') { 
						player[st['f']]  = 5		// школ€р!
					}

					if (name.indexOf(' ')!=-1){
						player[st['»м€']] = name.split(' ',1)[0]
						player[st['‘ам']] = name.replace(player[st['»м€']]+' ','').replace(player[st['»м€']]+'-','')
					} else {
						player[st['»м€']] = ''
						player[st['‘ам']] = name
					}	
					j++
					if (x[j].indexOf('в аренде') !=-1) j++
					player[st['взр']] = +x[j].split(' ',1)[0]
					if (x[j].indexOf('(матчей')!=-1){
						player[st['стр']] = x[j].split(', ',2)[1].split(' (',1)[0]
						player[st['и—б']] = +x[j].split(', ',2)[1].split('матчей ',2)[1]
						player[st['г—б']] = +x[j].split(', ',3)[2].split(' ',2)[1].replace(')','')
						if (x[j].indexOf('U21')!=-1){
							player[st['ићл']] = +x[j].split('/ U21 матчей ',2)[1].split(',',1)[0]
							player[st['гћл']] = +x[j].split('/ U21 матчей ',2)[1].split(', голов ',2)[1].replace(')','')
						} else {
							player[st['ићл']] = 0
							player[st['гћл']] = 0
						}
					} else {
						player[st['стр']] = ' '
						player[st['и—б']] = 0
						player[st['г—б']] = 0
						player[st['ићл']] = 0
						player[st['гћл']] = 0
					}
					j++
					if (x[j].indexOf(' онтракт:')!=-1) {
						player[st['кнт']] = +x[j].split(' ',4)[1]
						player[st['зрп']] = +x[j].split(' ',4)[3].replace(/,/g,'').replace('$','')
						j++
					} else {
						player[st['кнт']] = 0
						player[st['зрп']] = 0
					}
					if (x[j].indexOf('Ќоминал:') != -1) {
						player[st['ном']] = +x[j].split(' ',2)[1].replace(/,/g,'').replace('$','')
						j++
					} else {
						player[st['ном']] = 0
					}
					if (x[j].indexOf(' луб требует:') != -1) j++
					player[st['поз']] = x[j]

				} else if (m==2){
					var j = 0
					var x = $(valm).html().replace(/<!-- [а-€] -->/g,'').split('<br>')
					player[st['фрм']] = +x[j].split(': ',2)[1].split('%',1)[0]
					player[st['мрл']] = +x[j].split(': ',3)[2].replace('%</i>','')

				}
			})
			
		}

		if (i>=ld && i<ld+36 && next==0){
			skillname = $(val).find('script').empty().end().html().replace('<script></script>','').replace('<script type="text/javascript"></script>','').replace(/<!-- [а-€] -->/g,'')
			next = i + 1
		}
		if (i>=ld && i<ld+36 && i == next){
			skillvalue = parseInt($(val).find('script').empty().end().html().replace('<script></script>','').replace('<script type="text/javascript"></script>','').replace('<b>',''))
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
		var sksstr = psj[5].split(',') 					// !сст,!s=*0,ре=*2,вп=*2,вх=*2,ру=*1.5,мщ=*1.5,пс,f=*0,‘ам
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
	player[st['»длѕоз']] = posfilter[1][1]


	var tmp=''
	for (var i in posfilter) for (var s in posfilter[i]) tmp += posfilter[i][s] + '\n'


	var text1 = '<table width=100%><tr><td valign=top>'
	var text2 = '</td><td valign=top width=1%><a onclick="ShowAll('+(ld+1)+')">'+('—бросить').fontsize(1)+'</a><br><b>—ила&nbsp;игрока</b><br>'
	var hidden = 0
	var pfs3pre = ''
	var pflinkpre = ''
	for (var s in posfilter) {
		if (!isNaN(posfilter[s][2])) {
			var linktext = String(posfilter[s][2]+':'+posfilter[s][1].replace(' ','&nbsp;'))
			if (posfilter[s][0]<1 && hidden == 0) hidden = 1
			if ( hidden ==1) {
				hidden = 2
				text2 += '<a id="mya" onclick="OpenAll()">...</a><br><div id="mydiv">'
			}
			if (pfs3pre != posfilter[s][3] || pflinkpre != linktext) text2 += '<a onclick="ShowSkills('+(ld+1)+',\''+posfilter[s][3]+'\')">'+linktext.fontsize(1)+'</a><br>'
		}
		var pfs3pre = posfilter[s][3]
		var pflinkpre = linktext
	}
	for (i in st) text2 += i + ':' + player[st[i]]+'<br>'

	text2 += '</div></td></tr></table>'

	$(umval).each(function(j,val2){if (j==0) $(val2).html(text1+$(val2).html().replace('”мени€</b>','”мени€</b>(сс='+String(player[st['сс']]).fontsize(1)+')')+text2)})
	$("#mydiv").hide()

	//ShowSkills(ld,'"'+skills[0]+'"')
});