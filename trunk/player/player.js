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

function sSkills(i, ii) { // �� SumSkills (��������)
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
			var data = $(val).find('script').empty().end().html().replace('<script></script>','').replace('<script type="text/javascript"></script>','').replace(/<!-- [�-�] -->/g,'')
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
	var sk = {'��':'���������','��':'��������','��':'�����','��':'���� � ���','��':'������� ����','��':'���� �������','��':'���� �� �������','��':'������','��':'������� �����','��':'����. �����','��':'�������',
			'��':'��������','��':'��������','��':'����� �������','��':'�������','��':'���� ������','��':'�������','��':'����','��':'����� ����','��':'�����������������','��':'������������'}
	var skr = {'���������':'��','��������':'��','�����':'��','���� � ���':'��','������� ����':'��','���� �������':'��','���� �� �������':'��','������':'��','������� �����':'��','����. �����':'��','�������':'��',
			'��������':'��','��������':'��','����� �������':'��','�������':'��','���� ������':'��','�������':'��','����':'��','����� ����':'��','�����������������':'��','������������':'��'}


	var sto = 's,f,��,���,��,��,���,���,���,���,���,id,���,���,���,���,���,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,��,���,���,���,���,���,���,���,���,���,���,���,��,��,��,��,���,������'.split(',');
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

	// ��������� ���� ����� �������� id ������ ���������� td - ��� ������� �� ������� ���� �� �����
	$('td').each(function(i,val){
		var str = '������'
		var str2 = '���������'
		if ($(val).html().replace(/<!-- [�-�] -->/g,'').indexOf(str) != -1) um = i
		if ($(val).html().replace(/<!-- [�-�] -->/g,'').indexOf(str2) != -1) ld = i
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
			var x = $(val).find('center').html().replace('<b>','').replace('</b>','').replace(/<!-- [�-�] -->/g,'').split('<br>',6)
			//for (var p in x) text += p+':'+x[p]+'\n'
			var j = 0
			player[st['���']] = x[j].split(' (',1)[0]; j++
			if (x[j].indexOf('� ������') !=-1) j++
			player[st['���']] = +x[j].split(' ',3)[0]
			player[st['���']] = x[j].split(', ',2)[1].split(' (',1)[0]; j++
			player[st['���']] = +x[j].split(' ',4)[1]
			player[st['���']] = +x[j].split(' ',4)[3].replace(/,/g,'').replace('$','');j++
			player[st['���']] = +x[j].split(' ',2)[1].replace(/,/g,'').replace('$','');j++
			if (x[j].indexOf('���� �������:') != -1) j++
			player[st['���']] = x[j]
		}

		if (i>=ld && i<ld+36 && next==0){
			skillname = $(val).find('script').empty().end().html().replace('<script></script>','').replace('<script type="text/javascript"></script>','').replace(/<!-- [�-�] -->/g,'')
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
		var sksstr = psj[5].split(',') 					// !���,!s=*0,��=*2,��=*2,��=*2,��=*1.5,��=*1.5,��,f=*0,���
		var koff = 1

		if ((player[st['���']].indexOf(psj[2]) == -1) || (player[st['���']].indexOf(psj[3]) == -1)) koff = 1000

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

		// ����������� �������� ��� ����������
		//posfilter[j][3] = '�������,����� �������,���� �� �������,���� ������,����,���� � ���'
	}


	posfilter.sort(sSkills)
	player[st['��']] = ss

	var tmp=''
	for (var i in posfilter) for (var s in posfilter[i]) tmp += posfilter[i][s] + '\n'


	var text1 = '<table width=100%><tr><td valign=top>'
	var text2 = '</td><td valign=top width=1%><b>����&nbsp;������</b><br>'
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
	text2 += '</div><a onclick="ShowAll('+(ld+1)+')">'+('��������').fontsize(1)+'</a></td></tr></table>'

	$(umval).each(function(j,val2){if (j==0) $(val2).html(text1+$(val2).html().replace('������</b>','������</b>(��='+String(player[st['��']]).fontsize(1)+')')+text2)})
	$("#mydiv").hide()

	//ShowSkills(ld,'"'+skills[0]+'"')
});