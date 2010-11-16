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

function sSkills(i, ii) { // �� SumSkills (��������)
    if 		(i[0] < ii[0])	return  1
    else if	(i[0] > ii[0])	return -1
    else					return  0
}

function getValue(pname,cname,curVal){
	var retVal = prompt('������� ����� �������� ��� ' + pname + ', ��������(����� ������� ��� ��������):\n \
s,f,��,���,��,��,���,���,���,���,���,id,���,���,���,���,���,��,��,��,��,���,������\n ��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,���,���,���,���,���,���\n\n�������� �� ":", ��� � ���-�� ������� � ������� (0=���) \n ����. ������ ��� ���������� �������� ����� "=" � ��������, �������� ��=*2\n! - �� ����������, f - ���� ���������, s - ��������� � ������', curVal);

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
	var f�nsostavw	= ' bgcolor=red'
	var f�nzamena	= ' bgcolor=#BABDB6'
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
					case 1:  tr2f += f�nzamena;break
					case 2:  tr2f += fonsostav;break
					case 3:  tr2f += f�nsostavw;break
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
						case 1:  td2f += foninj;break;		//������
						case 2:  td2f += fonsus;break;		//������
						case 3:  td2f += fonform;break;		//�����
						case 4:  td2f += fonmorale;break;	//������
						case 5:  td2f += fonschool;break;	//������
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
	html += '<tr><td bgcolor=#FFFFFF colspan=2>'+'������'.fontsize(1)+'</td>'
	html += '<td bgcolor=#BABDB6 colspan=2>'+'������'.fontsize(1)+'</td></tr>'
	html += '<tr bgcolor=red><td colspan=4>'+'�� ���� �������'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#EF2929></td><td>'+'���'.fontsize(1)+'</td>'
	html += '<td bgcolor=#A40000></td><td>'+'���'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#FCE94F></td><td>'+'���<90'.fontsize(1)+'</td>'
	html += '<td bgcolor=#E9B96E></td><td>'+'���<80'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#729FCF></td><td>'+'���'.fontsize(1)+'</td></tr>'
	html += '</table>'
	return html
}

function ShowForumCode(fc,a){
	if (a == 0) return '����������'
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
		txt += '[/table]</textarea><br><b>������ ��� ������</b>'
		return txt
	}
}

$().ready(function() {
	var text = ''
	var posfilter = []
	var forumcode = []
	var poss = [['','','',''],
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
		['C FW(����������)','skillsrcfw','C','FW',0,'!���,!s=*0,��=*3,��=*2,��=*2,��=*2,��,f=*0,���'],
		['���. �����','skillsstda','','',16,'!���,!s=*100,��=*3,��=*3,��=*2,��,��,f=*0,���,��=*0,��=*-1'],
		['���. �������','skillsstdd','','',16,'!���,!s=*100,��=*3,��=*3,��=*2,��,��,f=*0,���,��=*0,��=*-1,��=*-1'],
		['���. �������','skillscor','','',16,'!���,!s=*100,��,��,��,f=*0,���,��=*0'],
		['���. ��������','skillsfre','','',16,'!���,!s=*100,��=*2,��=*1.1,��=*1.2,��=*1.1,f=*0,���,��=*0'],
		['���. ��������','skillspen','','',16,'!���,!s=*100,���=/10,��,��,f=*0,���,��=*0'],
		['��������','skillscap','','',16,'!���,!s=*100,��=*3-5*3,��=/2,���=/2-45,���=-90,���=*5/10-23*5/10+10,���=*4-6*4,f=*0,���,��=*0'],
		['�������','skillstm','','',0,'!���,���,��,���,���,f=*0,���'],
		['���. ���������','skillsc1','','',0,'!���,!s=*0,���=*-100,���=*-100,���=-100,���=/2-50,f=*0,���'],
		['��������','skillsc2','','',0,'!���,���,���=*0.1,f=*0,���'],
		['�����������','skillsc3','','',0,'!���,!s=*0,���,f=*0,���,���'],
		['��������� �������(%)','skillsc4','','',0,'!���,���,���,������'],
		['GK �����','skillsc5','','',0,'!���,!s=*0,��=*2,��=*1.5,��=*2,��=*2,f=*0,���'],

	]

	// ������������� ��������� � posfilter �� poss
	for (var i in poss) {
		var psi = poss[i]
		// ���� ���� ����� ����, �� ������ ����� ������
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

		//�������� ����������� � ��������
		var pfi0 = posfilter[i][0]
		for (var p in pfi0) posfilter[i][0][p] = getPairKey(pfi0[p],pfi0[p])
	}
	$('.back4').html('<table border="0" cellspacing="0" cellpadding="10" width="100%" height="100%"><tr><td valign="top" class="contentframer"></td></tr></table>')

	$.get('fieldnew.php', {}, function(data){
		var dataarray = data.split('&');
		var pid = [];		// id ������� ��������� � ������
		var p0 = [];		// �������1, ����� 5 ������.
		var z0 = [];		// ������� � �������
		var pen = [];		// 
		var fre = [];		// 
		var cor = [];		// 
		var cap = [];		// 

		var sto = 's,f,��,���,��,��,���,���,���,���,���,id,���,���,���,���,���,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,���,���,���,���,���,���,���,���,���,���,���,���,��,��,��,��,���,������'.split(',');
		var st = {}
		var k = 0
		for (var i in sto) {
			if (sto[i] == '��') {
				st[sto[i]] = st['��']
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
			var stcc = st["��"]
			var stcor = st["��"]
			var sttex = st["��"]
			var stln = 41

			//  �������? 0/1
			if (cur.indexOf('new') != -1) var auto = +curval

			// �������� id ������� ��������� � ������
			if (cur.indexOf('pid') != -1) {
				
				pid.push(curval)
				players[curval] = []
				players[curval][st["s"]] = [(pnum < 11 ? 2 : 1)]
				pnum++
			}

			// ����������� ������� ������� ��������� ������� 
			if (cur.indexOf('p0_') != -1) {
				p0.push(getPairValue(cur))

				// ��������� id ������ ��������� �� ������ �������
				posfilter[getPairValue(cur)][1] = [-pid[p0num]]
				p0num++
			}

			// �������� z0 (���� ������� 1� �������)
			if (cur.indexOf('z0') != -1) {
				z0.push(curval);
				if (+curval >= 513) players[pid[z0num]][st["��"]] = '*'
				if (+curval >= 700 || (+curval>=213 && +curval < 500)) players[pid[z0num]][st["��"]] = '*'
				z0num++
			}

			// �������� ���������
			if (cur.indexOf('cap') != -1) {
				cap.push(curval)
				if (curval != 0) players[curval][st["��"]] = capnum
				capnum++
			}

			// �������� fre
			if (cur.indexOf('fre') != -1) {
				fre.push(curval)
				if (curval != 0) players[curval][st["��"]] = frenum
				frenum++
			}

			// �������� cor
			if (cur.indexOf('cor') != -1) {
				cor.push(curval)
				if (curval != 0) players[curval][st["��"]] = cornum
				cornum++
			}

			// �������� pen
			if (cur.indexOf('pen') != -1) {
				pen.push(curval)
				if (curval != 0) players[curval][st["��"]] = pennum
				pennum++
			}

			//����������� ���� ������ �������� ���� ����� ��� � ������
			for (p=26;p<posfilter.length;p++) posfilter[p][1] = [-10000]

			// �������� ������ �� �������
			if (cur.indexOf('secondname') != -1) {
				var id = getPairValue(dataarray[i+3])
				if (!players[id]) {
					players[id] = []
					players[id][st["s"]] = 0
				}

				var plid = players[id]
				plid[st["f"]] = 0
				plid[stcc] = 0
				plid[st["���"]] = 0

				if (!players[id][st["��"]]) players[id][st["��"]] = ''
				if (!players[id][st["��"]]) players[id][st["��"]] = ''

				// �������� ������
				for (var x=0; x<=stln-3; x++) plid.push(getPairValue(dataarray[i+x-2]))
				plid.push(getPairValue(dataarray[i+58]))	// ���� � ����������
				plid.push(getPairValue(dataarray[i+59]))	// ���� � ������
				plid.push(getPairValue(dataarray[i+60]))	// ���� � ������
				plid.push(getPairValue(dataarray[i+61]))	// ���� � ����������

				if (!players[id][st["��"]]) players[id][st["��"]] = ''
				if (!players[id][st["��"]]) players[id][st["��"]] = ''
				if (!players[id][st["��"]]) players[id][st["��"]] = ''
				if (!players[id][st["��"]]) players[id][st["��"]] = ''

				// ������� ����� ������ (������� ���������� � �������).
				for (var x=st["��"]; x<=st["��"]; x++) plid[stcc] += +plid[x]


				//����������� ��=100 � �������� � �������� �� ��������� ����� (21-���)
				if (plid[st["���"]]==0) plid[st["���"]] = 21-plid[st["���"]]
				if (plid[st["���"]]==0) plid[st["���"]] = 100;

				// ��������� ���� �����������
				if		(plid[st["���"]] >  0) 	plid[st["f"]] = 1 // ������
				else if	(plid[st["���"]] >  0) 	plid[st["f"]] = 2 // ���������������
				else if	(plid[st["���"]] < 90) 	plid[st["f"]] = 3 // ������ �����
				else if	(plid[st["���"]] < 80) 	plid[st["f"]] = 4 // ������ ������
				else if	(plid[st["���"]] == 0) 	plid[st["f"]] = 5 // ��������

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
			  if (players[p][st['���']]){
				var pl = players[p]
				var plpos = pl[st['���']]
				var plid = pl[st['id']]
				var osnova = 0
				if (auto == 0) {
					pl[st["s"]] = 0
					pl[st["��"]] = ''
					pl[st["��"]] = ''
				}

				// �������� � ������ ��� ������
				if (+pfi1 == -plid && auto == 1) {
					forumcode[i] = '[table bgcolor=#C9F8B7 width=100%]'
					forumcode[i] += '[tr][td][player='+plid+'][b]'+pl[st["���"]].charAt(0)+'.'+(pl[st["���"]]).replace(' ','')+'[/b][/player][/td][/tr]'
					forumcode[i] += '[tr][td]���'+pl[st["���"]]+'/���'+pl[st["���"]]+'[/td][/tr]'
					forumcode[i] += '[tr][td]'+(pl[st["���"]] !=0 ? '��� '+pl[st["���"]]+'('+pl[st["���"]]+'+'+pl[st["���"]]+')':'...')+'[/td][/tr]'
					forumcode[i] += '[tr][td]'+(pl[st["���"]] ? '�/�� '+pl[st["���"]]+'('+pl[st["���"]]+')' : '...')+'[/td][/tr]'
					forumcode[i] += '[/table]'
				}

				// �������� ������ �� ����� ������� ����������� � ������
				if (((plpos.indexOf(psi[2]) == -1) || (plpos.indexOf(psi[3]) == -1)) && +pfi1 == -plid) {
					osnova = 3
					koff = 0.5
				}
				if (((plpos.indexOf(psi[2]) != -1) && (plpos.indexOf(psi[3]) != -1)) || +pfi1 == -plid) {
					var ss = 0;
					posfilter[i][p] = []

					// 	�������� ���������� �� ������ ������ �� ������ �������
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

						if (st[zagolovok] >= st['��'] && st[zagolovok] <= st['��']) {
							sum += +sks
							summax += eval(mx+skv)
						}
						switch (zagolovok) {
							case '���':	sstnum = +j
							case 's':	sk = osnova
							//case '���':	sk = pl[st['���']].charAt(0)+'.'+sk	// ��������� ������ ����� ����� � �������
							default:						
								posfilter[i][p].push(sk)
								ss += +sks
						}
					}
					var sila = sum/summax*100
					if (i>0 && i<=25 && (!pl[st['���']] || pl[st['���']]<sila)) {
						pl[st['���']] = sila.toFixed(1)
						pl[st['������']] = psi[0]
					}

					// ��������� ����� ���������� ������
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
		text += '<a href="forums.php?m=posts&q=173605">C����� v1.2</a> (c) <a href="users.php?m=details&id=661">const</a></td></tr></table>'
/**/	$('.contentframer').html(text)
	})

})