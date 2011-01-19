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

function sSkills(i, ii) { // �� SumSkills (��������)
    if 		(i[0] < ii[0])	return  1
    else if	(i[0] > ii[0])	return -1
    else					return  0
}

function ShowAll(){
	$('td.back4 table:first table:first td').each(function(){
		$(this).css('color','black').css('background-color','#A3DE8F').find('img').show()
	})
}

function ShowSkills(skl){
	ShowAll()
	$('td.back4 table:first table:first td:even').each(function(){
		if (skl.indexOf($(this).find('script').remove().end().html().replace(/<!-- [�-�] -->/g,'')) == -1){
			$(this).css('color','#888A85').css('background-color','#C9F8B7')
			.next().css('color','#888A85').css('background-color','#C9F8B7').find('img').hide();
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
	x += '<br><br>[url=plug.php?' + location.search.substring(1) + ']' + pl.firstname + ' ' + pl.secondname + '[/url] (��=' + pl.sumskills + ')'

	if (UrlValue('t') == 'p') x += ' | [player=' + pl.id + '][img]images/eye.png[/img][/player]'

	if (pl.natfull != ' ') x+= ' | [b]' + pl.natfull + '[/b]'

	x += ' | ' + pl.position + ' ' + pl.age

	if (pl.sale == 1)	x += ' | [img]system/img/g/sale.png[/img]'

	if (pl.teamurl == '') x += ' | ' + pl.team
	else x += ' | [url=' + pl.teamurl + ']' + pl.team + '[/url]'

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

	skl['nation']	= ['nt' ,'���','��� ������']
	skl['natfull']	= ['ntf','���','������']
	skl['secondname']= ['snm','���','�������']
	skl['firstname']= ['fnm','���','���']
	skl['age']		= ['age','���','�������']
	skl['id']		= ['id' ,'id','id ������']
	skl['internationalapps'] = ['inl','���','��� �� �������']
	skl['internationalgoals']= ['ing','���','����� �� �������']
	skl['contract']	= ['cnt','���','��������']
	skl['wage']		= ['wag','���','��������']
	skl['value']	= ['val','���','�������']
	skl['corners']	= ['cn','��','�������']
	skl['crossing']	= ['cr','��','������']
	skl['dribbling']= ['dr','��','��������']
	skl['finishing']= ['fn','��','�����']
	skl['freekicks']= ['fk','��','��������']
	skl['handling']	= ['hl','��','���� ������']
	skl['heading']	= ['hd','��','���� �������']
	skl['exiting']	= ['ex','��','���� �� �������']
	skl['leadership']= ['ld','��','���������']
	skl['longshots']= ['ls','��','������� �����']
	skl['marking']	= ['mr','��','����. �����']
	skl['pace']		= ['pc','��','��������']
	skl['passing']	= ['ps','��','���� � ���']
	skl['positioning']= ['pt','��','����� �������']
	skl['reflexes']	= ['rf','��','�������']
	skl['stamina']	= ['st','��','������������']
	skl['strength']	= ['sr','��','����']
	skl['tackling']	= ['tc','��','����� ����']
	skl['vision']	= ['vs','��','������� ����']
	skl['workrate']	= ['wr','��','�����������������']
	skl['technique']= ['tc','��','�������']
	skl['morale']	= ['mrl','���','������']
	skl['form']		= ['frm','���','�����']
	skl['position']	= ['pos','���','�������']
	// champ
	skl['games']	= ['gms','���','']
	skl['goals']	= ['gls','���','']
	skl['passes']	= ['pss','���','']
	skl['mom']		= ['mom','��','']
	skl['ratingav']	= ['rat','���','']						
	// c = cup?
	skl['cgames']	= ['cgm','.','']
	skl['cgoals']	= ['cgl','.','']
	skl['cpasses']	= ['cps','.','']
	skl['cmom']		= ['cmm','.','']
	skl['cratingav']= ['crt','.','']
	//e = eurocup? (�������������)
	skl['egames']	= ['egm','.','']
	skl['egoals']	= ['egl','.','']
	skl['epasses']	= ['eps','.','']
	skl['emom']		= ['emm','.','']
	skl['eratingav']= ['ert','.','']
	//w =  (�������)
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
	// a = all (���)
	skl['vratingav']= ['art','.',''] // ����������
	skl['agames']	= ['agm','.','']
	skl['agoals']	= ['agl','.','']
	skl['apasses']	= ['aps','.','']
	skl['amom']		= ['amm','.','']

	skl['training']	= ['trn','���','����������']
	skl['inj']		= ['inj','���','������']
	skl['sus']		= ['sus','���','���������������']
	skl['syg']		= ['syg','���','�����������']

	skl['sumskills']= ['ss','��','����� ������']
	skl['team']		= ['team','���','�������']
	skl['teamurl']	= ['turl','turl','��� �������']
	skl['sale']		= ['sale','���','�� ���������?']
	skl['hash']		= ['hash','���','���']
	skl['flag']		= ['f','��','���� ���������']
	skl['u21apps']	= ['uap','���','��� �� U21']
	skl['u21goals']	= ['ugl','���','����� �� U21']

	skl['idealnum']	= ['inum','���','���� ������ � % �� ������']
	skl['idealpos']	= ['ipos','������','��������� �������']


	for (i in skl) {
//		sklse[skl[i][0]] = i
		sklsr[skl[i][1]] = i
		sklfr[skl[i][2]] = i
	}


	var poss = [['','','','','',''],
		['GK','skillsgk',  '', 'GK',0,'!���,!s=*0,��=*2,��=*2,��=*2,��=*1.5,��=*1.5,��=*0.5,f=*0,���'],
		['SW(������)','skillssw',  'C','SW',0,'!���,!s=*0,��=*2,��=*2,��=*1.6,��=*1.5,��=*1.4,f=*0,���'],
		['L DF','skillsldf', 'L','DF',0,'!���,!s=*0,��=*3,��=*1.5,��=*1.5,��=*1.3,��=*1.3,��,f=*0,���'],
		['C DF(��������)','skillslcdf','C','DF',0,'!���,!s=*0,��=*3,��=*1.7,��=*1.5,��=*1.3,f=*0,���'],
		['C DF(������������)','skillsccdf','C','DF',0,'!���,!s=*0,��=*3,��=*3,��=*1.7,��=*1.5,��=1.3,f=*0,���'],
		['C DF(����������)','skillsrcdf','C','DF',0,'!���,!s=*0,��=*3,��=*2.1,��=*2,��=*1.9,��=*1.3,��,f=*0,���'],
		['R DF','skillsrdf', 'R','DF',0,'!���,!s=*0,��=*3,��=*1.5,��=*1.5,��=*1.3,��=*1.3,��,f=*0,���'],
		['L DM','skillsldm', 'L','DM',0,'!���,!s=*0,��=*2.5,��=*2,��=*2,��=*2,��,��,��,f=*0,���'],
		['C DM(�������)','skillslcdm','C','DM',0,'!���,!s=*0,��=*2.5,��=*2.5,��=*2,��=*1.5,��=*1.5,��,��,f=*0,���'],
		['C DM(������������)','skillsccmd','C','DM',0,'!���,!s=*0,��=*3,��=*2.5,��=*1.5,��=*1.5,��,f=*0,���'],
		['C DM(�������)','skillsrcdm','C','DM',0,'!���,!s=*0,��=*2.5,��=*2.5,��=*2,��=*1.5,��=*1.5,��,��,f=*0,���'],
		['R DM','skillsrdm', 'R','DM',0,'!���,!s=*0,��=*2.5,��=*2,��=*2,��=*2,��,��,��,f=*0,���'],
		['L MF','skillslmf', 'L','M',0,'!���,!s=*0,��=*2.5,��=*2,��=*2,��=*2,��=*2,f=*0,���'],
		['C MF(������������)','skillslcmf','C','M',0,'!���,!s=*0,��=*3,��=*2,��=*2,��=*2,��=*1.5,��=*1.5,f=*0,���'],
		['C MF(��������)','skillsccmf','C','M',0,'!���,!s=*0,��=*3,��=*2,��=*2,��=*1.5,��=*1.5,f=*0,���'],
		['C MF(�������)','skillsrcmf','C','M',0,'!���,!s=*0,��=2.5,��=2,��=*2,��=*2,��=*1.5,f=*0,���'],
		['R MF','skillsrmf', 'R','M',0,'!���,!s=*0,��=*2.5,��=*2,��=*2,��=*2,��=*2,f=*0,���'],
		['L AM','skillslam', 'L','AM',0,'!���,!s=*0,��=*2.5,��=*2.5,��=*2,��=2,��=*1.5,��=*1.5,f=*0,���'],
		['C AM(������������)','skillslcam','C','AM',0,'!���,!s=*0,��=*3,��=*2,��=*2,��=*2,��=*1.5,��=*1.5,f=*0,���'],
		['C AM(��������)','skillsccam','C','AM',0,'!���,!s=*0,��=*3,��=*2,��=*2,��=*2,��,f=*0,���'],
		['C AM(�������� FW)','skillsrcam','C','AM',0,'!���,!s=*0,��=*2.5,��=*2.5,��=*2,��=*2,��,��,f=*0,���'],
		['R AM','skillsram', 'R','AM',0,'!���,!s=*0,��=*2.5,��=*2.5,��=*2,��=2,��=*1.5,��=*1.5,f=*0,���'],
		['C FW(�������)','skillslcfw','C','FW',0,'!���,!s=*0,��=*3,��=*2,��=*2,��=*1.5,��,f=*0,���'],
		['C FW(�������)','skillsccfw','C','FW',0,'!���,!s=*0,��=*3,��=*2,��=*2,��,f=*0,���'],
		['C FW(����������)','skillsrcfw','C','FW',0,'!���,!s=*0,��=*3,��=*2,��=*2,��=*2,��,f=*0,���']
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
		skillname = $(this).find('script').remove().end().html().replace(/<!-- [�-�] -->/g,'');
		skillvalue = parseInt($(this).next().find('script').remove().end().html().replace('<b>',''));
		skillsum += skillvalue;
		pl0[sklfr[skillname]] = skillvalue;
	})
	pl0.sumskills = skillsum

	//add sum of skills to page
	$('td.back4 table center:first').append('(��='+String(skillsum).fontsize(1)+')')

	//get player header info
	var ms = $('td.back4 table center:first').html().replace('<b>','').replace('</b>','').replace(/<!-- [�-�] -->/g,'').split('<br>',6)
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
		pl0.team = '���������'
	}

	pl0.id  = UrlValue('j')
	pl0.hash  = UrlValue('z')
	// ������!
	if (UrlValue('t') == 'yp') {
		pl0.flag = 5
	}
 	j++
	if (ms[j].indexOf('� ������') !=-1) j++
	pl0.age = +ms[j].split(' ',1)[0]
	if (ms[j].indexOf('(������')!=-1){
		pl0.natfull = ms[j].split(', ',2)[1].split(' (',1)[0]
		pl0.internationalapps = +ms[j].split(', ',2)[1].split('������ ',2)[1]
		pl0.internationalgoals = +ms[j].split(', ',3)[2].split(' ',2)[1].replace(')','')
		if (ms[j].indexOf('U21')!=-1){
			pl0.u21apps = +ms[j].split('/ U21 ������ ',2)[1].split(',',1)[0]
			pl0.u21goals = +ms[j].split('/ U21 ������ ',2)[1].split(', ����� ',2)[1].replace(')','')
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
	if (ms[j].indexOf('��������:')!=-1) {
		pl0.contract = +ms[j].split(' ',4)[1]
		pl0.wage = +ms[j].split(' ',4)[3].replace(/,/g,'').replace('$','')
		j++
	} else {
		pl0.contart = 0
		pl0.wage = 0
	}
	if (ms[j].indexOf('�������:') != -1) {
		pl0.value = +ms[j].split(' ',2)[1].replace(/,/g,'').replace('$','')
		j++
	} else {
		pl0.value = 0
	}
	if (ms[j].indexOf('���� �������:') != -1) {
		j++
		pl0.sale = 1
	}
	pl0.position = ms[j]


	// get post-info
	var ms2 = $('td.back4 > center:first').html().replace(/<!-- [�-�] -->/g,'').split('<br>')
	var j2 = 0
	pl0.form = +ms2[j2].split(': ',2)[1].split('%',1)[0]
	pl0.morale = +ms2[j2].split(': ',3)[2].replace('%</i>','')

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
		var sksstr = psj[5].split(',') 			// !���,!s=*0,��=*2,��=*2,��=*2,��=*1.5,��=*1.5,��,f=*0,���
		var koff = 1

		if ((pl0.position.indexOf(psj[2]) == -1) || (pl0.position.indexOf(psj[3]) == -1)) koff = 1000


		for (var s in sksstr) {
			var sks = sksstr[s].replace('!','').split('=',2)	// sks[0] = ��, sks[1] = *2
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
	text3 += '<br><a id="remember" href="javascript:void(CheckPlayer(1))">'+('���������').fontsize(1)+'</a>'
	text3 += '<br><a id="compare" href="javascript:void(CheckPlayer(0))">'+('��������').fontsize(1)+'</a><br>'

	if (UrlValue('t') != 'yp' && UrlValue('t') != 'yp2') {
		text3 += '<br><a id="codeforforum" href="javascript:void(CodeForForum())">'+('��� ��� ������').fontsize(1)+'</a><br>'
	}

	text3 += '<br><b>����&nbsp;������</b>'
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