// ==UserScript==
// @name           peflplayer
// @namespace      pefl
// @description    modification player page and school boys
// @include        http://www.pefl.ru/plug.php?p=refl&t=p*
// @include        http://www.pefl.ru/plug.php?p=refl&t=yp*
// @include        http://pefl.ru/plug.php?p=refl&t=p*
// @include        http://pefl.ru/plug.php?p=refl&t=yp*
// @include        http://www.pefl.net/plug.php?p=refl&t=p*
// @include        http://www.pefl.net/plug.php?p=refl&t=yp*
// @include        http://pefl.net/plug.php?p=refl&t=p*
// @include        http://pefl.net/plug.php?p=refl&t=yp*
// ==/UserScript==
/**/

//(function(){ // for ie

function GetPlayerHistory(n,pid){
	var stats = []
	stats[0] = {}
	stats[0].gm = 0
	stats[0].gl = 0
	stats[0].ps = 0
	stats[0].im = 0
	stats[0].sr = 0

	$('a#th2').attr('href',"javascript:void(ShowTable(2))").html('&ndash;')

	var head = '<tr><td width=25%> </td><td width=10%>����</td><td width=10%>����</td><td width=10%>����</td><td width=10%>��</td><td width=10%>��</td><td width=10%> </td><td width=10%> </td></tr>'
	$('#ph'+n).append(head)

	var table = '<table id=debug style="display: none;"></table>'
	$('#ph'+n).after(table)

	$('#debug').load('hist.php?id='+pid+'&t=p table:eq(0) tr:gt(0)',function(){
		$('#debug').find('tr').each(function(){
			var d = []
			if(isNaN(parseInt($(this).find('td:first').html()))) $(this).remove()

			$(this).find('td').each(function(i, val){
				d[i] = $(val).html()
			})
			sid = parseInt(d[0])
			if(stats[sid]==undefined){
				stats[sid] = {}
				stats[sid].gm = 0
				stats[sid].gl = 0
				stats[sid].ps = 0
				stats[sid].im = 0
				stats[sid].sr = 0
			}
			if(d[6] == '') d[6] = 0
			stats[sid].sr	= ((parseInt(d[2])*parseFloat(d[6]) + stats[sid].gm*stats[sid].sr)/(parseInt(d[2])+stats[sid].gm)).toFixed(2)
			stats[sid].gm	+= parseInt(d[2])
			stats[sid].gl	+= parseInt(d[3])
			stats[sid].ps	+= parseInt(d[4])
			stats[sid].im	+= parseInt(d[5])
			if(!isNaN(sid)){
				stats[0].sr		= ((parseInt(d[2])*parseFloat(d[6]) + stats[0].gm*stats[0].sr)/(parseInt(d[2])+stats[0].gm)).toFixed(2)
				stats[0].gm		+= parseInt(d[2])
				stats[0].gl		+= parseInt(d[3])
				stats[0].ps		+= parseInt(d[4])
				stats[0].im		+= parseInt(d[5])
			}
		})
		var data = ''
		for (ss=stats.length-1;ss>=0;ss--){
//		for (ss in stats){
			if(stats[ss] !=undefined && stats[ss].gm != ''){
				if (ss==0)	data += '<tr bgcolor=#88C274><td>�����</td>'
				else 		data += '<tr bgcolor=A3DE8F><td>����� '+ss+'</td>'
				for (p in stats[ss]) data += '<td>'+ stats[ss][p]+'</td>'
				data += '<td> </td><td> </td></tr>'
			}
		}
		$('#ph'+n).append(data)


	})
}

function ShowTable(n){
	var style = $('td.back4 table table:not(#plheader):eq('+n+')').attr('style')
	if(style == "display: none" || style == "display: none;" || style == "display: none; "){
		$('td.back4 table table:not(#plheader):eq('+n+')').show()
		$('a#th'+n).html('&ndash;')
	} else {
		$('td.back4 table table:not(#plheader):eq('+n+')').hide()
		$('a#th'+n).html('+')
	}
}

function hist(rcode,rtype)
	{ window.open('hist.php?id='+rcode+'&t='+rtype,'�������','toolbar=0,location=0,directories=0,menuBar=0,resizable=0,scrollbars=yes,width=480,height=512,left=16,top=16'); }

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

function sSkills(i, ii) { // ����������
    if 		(i[0] < ii[0])	return  1
    else if	(i[0] > ii[0])	return -1
    else					return  0
}

function ShowAll(){
	$('td.back4 table:first table:not(#plheader):first td').each(function(){
		$(this).removeAttr('bgcolor').find('img').removeAttr('style')
	})
}

function ShowSkills(skl){
	ShowAll()
	if(compare == true) {
		$('td.back4 table:first table:not(#plheader):first td').each(function(i,val){
			if (i%3 == 0 && skl.indexOf($(val).find('script').remove().end().html().replace(/<!-- [�-�] -->/g,'')) == -1){
				$(val).attr('bgcolor','#C9F8B7')
					.next().attr('bgcolor','#C9F8B7').find('img').hide().end()
					.next().attr('bgcolor','#C9F8B7').find('img').hide();
			}
		})
	} else {
		$('td.back4 table:first table:not(#plheader):first td:even').each(function(){
			if (skl.indexOf($(this).find('script').remove().end().html().replace(/<!-- [�-�] -->/g,'')) == -1){
				$(this).attr('bgcolor','#C9F8B7')
				.next().attr('bgcolor','#C9F8B7').find('img').hide();
			}
		})
	}
}

function OpenAll(){
	if ($("#mydiv").attr('style')) $("#mydiv").removeAttr('style')
	else $("#mydiv").hide()
}

function RemovePl(rem){
	if(rem!=0) players.splice(rem,1);
	RememberPl(1); // !=1: save w\o player0
	PrintPlayers();
}

function PrintPlayers(cur){
	$('div#compare').empty()
	for (i=0;i<players.length;i++){
		if((i>0 || cur==0) && players[i].secondname != undefined){
			var secname = String(players[i].secondname).split(' ')
			var fname = String(players[i].firstname)
			var plhref = (players[i].t==undefined || players[i].t == 'yp' ? '' : ' href="plug.php?p=refl&t='+players[i].t+'&j='+players[i].id+'&z='+players[i].hash+'"')
			var htmltext = '<a id="compare'+i+'" href="javascript:void(CheckPlayer('+i+'))"><</a>|'
			htmltext += '<a href="javascript:void(RemovePl('+i+'))">x</a>|'
			htmltext += '<a'+(players[i].t == 'yp' ? '' : ' href="javascript:hist(\''+players[i].id+'\',\'n\')"')+'>�</a>|'
			htmltext += players[i].id+'|'
			htmltext += '<a'+plhref+'>' + secname[secname.length-1] + '</a>'
			$('div#compare').append(htmltext.fontsize(1)+'<br>')
		}
	}
}
function RememberPl(x){
	// Save data
	var mark = 1
	var text = ''
	for (k in players){
		if (players[k].id!=undefined && ((k>0 && mark<=10) || (k==0 && x==0))){
			for (i in players[k]) text += i+'_'+mark+'='+players[k][i]+','
			mark++
		}
	}
	if (navigator.userAgent.indexOf('Firefox') != -1) globalStorage[location.hostname].peflplayer = text
	else sessionStorage.peflplayer = text
	if (x==0)	PrintPlayers(0)
	else 		PrintPlayers()
}

function CheckPlayer(nn){
	// Get data and compare players
	ShowAll()
//	$('a[id="th2"]').html('+')
	$('div#kar, #th2, table#ph0, table#debug').remove()

	$('td.back4').prepend('<div align="right">(<a href="'+window.location.href+'">x</a>)&nbsp;</div>')
	$('a#remember, a[id^="compare"]').removeAttr('href')
	compare = true

	var header = '<table width=100% id="plheader">'
	// ���, �������
	header += '<tr align=center><td width=50% valign=top>'
	header += '<b>' + players[0].firstname + ' ' + players[0].secondname + '</b>'
	header += (players[0].teamid != undefined ? ' (<a href="plug.php?p=refl&t=k&j='+players[0].teamid+'&z='+players[0].teamhash+'">' : ' (')
	header += players[0].team
	header += (players[0].teamid != undefined ? '</a>)' : ')')
	header += '</td>'
	header += '<td width=50% valign=top>'
	header += '<b>' + players[nn].firstname + ' ' + players[nn].secondname + '</b>'
	header += (players[nn].teamid != undefined ? ' (<a href="plug.php?p=refl&t=k&j='+players[nn].teamid+'&z='+players[nn].teamhash+'">' : ' (')
	header += players[nn].team
	header += (players[nn].teamid != undefined ? '</a>)' : ')')
	header += '</td></tr>'
	// �������, �����������, ���� �� �������
	header += '<tr align=center><td valign=top>'
	header += players[0].age +' ���' + (players[0].natfull != ' ' ? ', ' + players[0].natfull : '')
	if(	parseInt(players[0].internationalapps) != 0
		|| parseInt(players[nn].internationalapps) != 0
		|| parseInt(players[0].u21apps) != 0
		|| parseInt(players[nn].u21apps) != 0)
	{
		header += ', ' + players[0].internationalapps +'('+players[0].u21apps+') ������, '+players[0].internationalgoals+'('+players[0].u21goals+') �����'
	}
	header += '</td>'
	header += '<td valign=top>'
	header += players[nn].age +' ���'+ (players[nn].natfull != ' ' ? ', ' + players[nn].natfull : '')
	if(	parseInt(players[0].internationalapps) != 0
		|| parseInt(players[nn].internationalapps) != 0
		|| parseInt(players[0].u21apps) != 0
		|| parseInt(players[nn].u21apps) != 0)
	{
		header += ', ' + players[nn].internationalapps +'('+players[nn].u21apps +') ������, '+players[nn].internationalgoals+'('+players[nn].u21goals+') �����'
	}
	header += '</td></tr>'
	//���������
	header += '<tr align=center><td>'
	if(players[0].wage != 0){
		header += players[0].contract +' �. �� '
		header += (players[0].wage > 999 ? String((players[0].wage/1000).toFixed(3)).replace(/\./g,',') : players[0].wage)
		header += '$ � ��'
	}
	header += ' </td>'
	header += '<td>'
	if(players[nn].wage != 0){
		header += players[nn].contract +' �. �� '
		header += (players[nn].wage > 999 ? String((players[nn].wage/1000).toFixed(3)).replace(/\./g,',') : players[nn].wage)
		header += '$ � ��'
	}
	header += ' </td></tr>'
	// ��������
	if( players[0].value != 0 || players[nn].value != 0){
		header += '<tr align=center><td>'
		if (players[0].value != 0)	header += '�������: '+String(players[0].value < 1000000 ? (players[0].value/1000).toFixed(3) : (players[0].value/1000000).toFixed(3) + ',000').replace(/\./g,',')+'$'
		header += ' </td>'
		header += '<td>'
		if (players[nn].value != 0)	header += '�������: '+String(players[nn].value < 1000000 ? (players[nn].value/1000).toFixed(3) : (players[nn].value/1000000).toFixed(3) + ',000').replace(/\./g,',')+'$'
		header += ' </td></tr>'
	}
	// �������
	header += '<tr align=center><td><b>'
	header += '<b>' + players[0].position + '</b>'
	header += '</td>'
	header += '<td>'
	header += '<b>' + players[nn].position + '</b>'
	header += '</td></tr>'
	// ������
	header += '<tr align=center><td>'
	header += '��='+ players[0].sumskills
	header += '</td>'
	header += '<td>'
	header += '��='+players[nn].sumskills
	header += '</td></tr>'

	header += '</table>'

	$('td.back4 table:first center:first').remove()
	$('div#th0').before(header)

	var skillupsumm = 0
	// Skills:
	$('td.back4 table:first table:not(#plheader):first td:even').each(function(i, val){
		var skillname = sklfr[$(val).text()]
		var skillvalue0 = players[0][skillname]
		var skillvalue1 = (players[nn][skillname] == undefined ? '??' : players[nn][skillname])
		var skillup0 = parseInt(skillvalue0)*7 + parseInt(ups[String(skillvalue0).split('.')[1]])
		var skillup1 = parseInt(skillvalue1)*7 + parseInt(ups[String(skillvalue1).split('.')[1]])
		var raz = parseInt(skillvalue0)-parseInt(skillvalue1)
		skillupsumm += skillup0 - skillup1
		var razcolor = 'red'
		if(raz == 0 || isNaN(raz)) raz = '&nbsp;&nbsp;&nbsp;&nbsp;'
		else if (raz>0) {
				raz = '+' + raz
				razcolor = 'green'
		}
		var skilltext0 = String(skillvalue0).split('.')[0]
		skilltext0 += '<sup><font color="' + razcolor + '">'+raz+'</font></sup>'
		if (String(skillvalue0).split('.')[1]){
			skilltext0 += ' <img height="12" src="system/img/g/' + String(skillvalue0).split('.')[1] + '.gif">'
		}
		var skilltext = '<td width=10%>'
		skilltext += String(skillvalue1).split('.')[0]
		if (String(skillvalue1).split('.')[1]){
			skilltext += ' <img height="12" src="system/img/g/' + String(skillvalue1).split('.')[1] + '.gif">'
		}
		skilltext += '</td>'
		$(val)
			.next().attr('width','10%')
			.html(skilltext0)
			.after(skilltext)
	})
	if(players[0].id == players[nn].id && (players[0].t == 'yp' || players[0].t == 'yp2')){
		var skilltext =  '<tr><td colspan=6>&nbsp;</td></tr><tr><td colspan=6 align=center><b>���������</b>(���): '
		if (skillupsumm > 0){
			skilltext +=  '<font color="green">+' + skillupsumm + '</font>'
		} else if (skillupsumm < 0){
			skilltext +=  '<font color="red">' + skillupsumm + '</font>'
		} else skilltext += ' ���'
		skilltext += '</td></tr><tr><td colspan=6>&nbsp;</td></tr>'
		$('td.back4 table:first table:not(#plheader):eq(0)').append(skilltext)
	}

	$('td.back4 table:first table:not(#plheader):eq(1) tr:first td:gt(0)').attr('colspan','3').attr('align','center')
	$('td.back4 table:first table:not(#plheader):eq(1) tr:gt(0)').each(function(i,val){
		if(i!=1) $(val).find('td:eq(7)').after('<td'+(i==0 ? ' rowspan=2':'')+'>'+(players[nn]['kk'+i]!=undefined ? players[nn]['kk'+i] : '?')+'</td><td'+(i==0 ? ' rowspan=2':'')+' bgcolor=C9F8B7 width=1%> </td>')
		if(i!=1) $(val).find('td:eq(6)').after('<td'+(i==0 ? ' rowspan=2':'')+'>'+(players[nn]['zk'+i]!=undefined ? players[nn]['zk'+i] : '?')+'</td><td'+(i==0 ? ' rowspan=2':'')+' bgcolor=C9F8B7 width=1%> </td>')

		$(val).find('td:eq(5)').after('<td>'+(parseFloat(players[nn]['sr'+i])==0 || players[nn]['sr'+i]==undefined ? ' ':(parseFloat(players[nn]['sr'+i])).toFixed(2))+'</td><td bgcolor=C9F8B7 width=1%> </td>')
		$(val).find('td:eq(4)').after('<td>'+(players[nn]['im'+i]!=undefined ? players[nn]['im'+i] : '?')+'</td><td bgcolor=C9F8B7 width=1%> </td>')
		$(val).find('td:eq(3)').after('<td>'+(players[nn]['ps'+i]!=undefined ? players[nn]['ps'+i] : '?')+'</td><td bgcolor=C9F8B7 width=1%> </td>')
		$(val).find('td:eq(2)').after('<td>'+(players[nn]['gl'+i]!=undefined ? players[nn]['gl'+i] : '?') +'</td><td bgcolor=C9F8B7 width=1%> </td>')
		$(val).find('td:eq(1)').after('<td>'+(players[nn]['ig'+i]!=undefined ? players[nn]['ig'+i] : '?')+'</td><td bgcolor=C9F8B7 width=1%> </td>').before('<td bgcolor=C9F8B7 width=1%> </td>')
	})
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
	var x = '<div align="right">(<a href="'+window.location.href+'">x</a>)&nbsp;</div>'
	var pl = players[0]
	var ptype = UrlValue('t')
	var skillsshow = ($('a[id="th0"]').html() == '+' ? false : true)
	var seasonstatshow = ($('a[id="th1"]').html() == '+' ? false : true)
	var fullstatshow = ($('a[id="th2"]').html() == '+' ? false : true)
	// ���� �� ��������, �� �������� ��� ��� ������ ����.
	if (compare == false && ptype != 'yp' && ptype != 'yp2') {
		x += '<br><b>���������� �������</b>:<br><br>'
		x += '[url=plug.php?' + location.search.substring(1) + ']' + pl.firstname + ' ' + pl.secondname + '[/url] (��=' + pl.sumskills + ')'
		if (ptype == 'p') x += ' | [player=' + pl.id + '][img]images/eye.png[/img][/player]'
		if (pl.natfull != ' ') x+= ' | [b]' + pl.natfull + '[/b]'
		x += ' | ' + pl.position + ' ' + pl.age
		if (pl.sale == 1)	x += ' | [img]system/img/g/sale.png[/img]'
		if (pl.teamurl == '') x += ' | ' + pl.team
		else x += ' | [url=' + pl.teamurl + ']' + pl.team + '[/url]'
		x+= '<br>'
	}

	$('td.back4 table:first table:not(#plheader):first img').removeAttr('style')
	x += '<br><hr><b>������ �������</b>:<br>'
	x +='<textarea rows="20" cols="80" readonly="readonly" id="CodeForForum">'

	x += '[table width=100% bgcolor=#C9F8B7][tr][td]\n[center]'
	if (compare == true) {
		x += $('table#plheader')
			.find('a:contains("������������")').removeAttr('href').end()
			.find('a[id="th0"]').remove().end()
			.find('center, b, td').removeAttr('id').end()
			.find('img').removeAttr('width').end()
			.html()
			.replace('\/flags\/','/flags/mod/')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/\<a\>������������\<\/a\>/g,'������������')
			.replace(/<!-- [�-�] -->/g,'')
			.replace(/<tbody>/g,'<table width=100%>')
			.replace(/tbody/g,'table')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/a href=\"/g,'url=')
			.replace(/\/a/g,'/url')
			.replace(/\&amp\;/g,'&')
			.replace(/"/g,'')
			.replace(/\[br\]/g,'\n')
//		x += '\n'

	} else {
		x += '[url=plug.php?' + location.search.substring(1) + ']#[/url] [b]'
		x += $('td.back4 table center:first b:first')
			.find('a[id="th0"]').remove().end()
			.find('img').removeAttr('width').end()
			.html()
			.replace('\/flags\/','/flags/mod/')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/\<a\>������������\<\/a\>/g,'������������')
			.replace(/<!-- [�-�] -->/g,'')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/a href=\"/g,'url=')
			.replace(/\/a/g,'/url')
			.replace(/\&amp\;/g,'&')
			.replace(/"/g,'')
			.replace(/\[br\]/g,'\n')
		if(ptype == 'yp' || ptype == 'yp2') x += '[/b]\n'+players[0].position+'[b]'
		x += '\n\n������[/b](��='+players[0].sumskills+')[/center]\n\n'
	}

	// skills
	if(skillsshow){
		x += $('td.back4 table table:not(#plheader):first')
			.find('sup').remove().end()
			.html()
			.replace(/<!-- [�-�] -->/g,'')
			.replace(/<tbody>/g,'<table width=100%>')
			.replace(/tbody/g,'table')
			.replace(/<font /g,'[')
			.replace(/\/font/g,'/color')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/ height=\"12\"/g,'')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/"/g,'')
			.replace(/\n/g,'')
			if (navigator.userAgent.indexOf('Opera') != -1 && ptype != 'yp' && ptype != 'yp2') x += '[/table]'
	}
	// stat of season
	if (seasonstatshow && (ptype == 'p' || ptype == 'pp')){
		x += '\n\n[center][b]���������� ������[/b][/center]\n\n'
		x += $('table#stat').html()
			.replace(/<!-- [�-�] -->/g,'')
			.replace(/<tbody>/g,'<table width=100%>')
			.replace(/tbody/g,'table')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/"/g,'')
			.replace(/\[td\]\[\/td\]/g,'[td] [/td]')
	}
	// fullstat
//	alert($('table#ph0').html()!=null)
	if ($('table#ph0').html()!=null && fullstatshow && (ptype == 'p' || ptype == 'pp')){
		x += '\n\n[center][b]�������[/b][/center]\n\n'
		x += $('table#ph0').html()
			.replace(/<!-- [�-�] -->/g,'')
			.replace(/<tbody>/g,'<table width=100%>')
			.replace(/tbody/g,'table')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/"/g,'')
			.replace(/\[td\]\[\/td\]/g,'[td] [/td]')
	}

	x += '[/td][/tr][/table]'
	x += '\n\n'
	x +='[center]--------------- [url=forums.php?m=posts&q=173605]�������� VIP[/url] ---------------[/center]\n';
//	x += '[/spoiler]'
	x += '</textarea>'

	$('td.back4').html(x)
	$('td#crabglobalright').empty()

	return true
}

var players = [[]]
players[0] = []
players[1] = []
players[2] = []
players[3] = []
players[4] = []
players[5] = []
players[6] = []
players[7] = []
players[8] = []
players[9] = []
players[10] = []
players[11] = []
var skl = []
var sklse = []
var sklsr = []
var sklfr = []
var compare = false

var ups = {	"a0e":"-2",
			"a1e":"-1",
			"a2e":"1",
			"a3e":"2",
			"a5e":"3",
			"a6e":"-3",
			"next":"-3",
			"last":"3",
			"undefined":"0"	
		}

//document.addEventListener('DOMContentLoaded', function(){
$().ready(function() {

/**/
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
		sklsr[skl[i][1]] = i	// sklsr['��'] = leadership
		sklfr[skl[i][2]] = i	// sklfr['���������'] = leadership
	}


	var poss = [['','','','','',''],
		['GK','skillsgk',  '', 'GK',0,				'!���,!s=*0,��=*2,��=*2,��=*2,��=*1.5,��=*1.5,��=*0.5,f=*0,���'],
		['SW(������)','skillssw',  'C','SW',0,		'!���,!s=*0,��=*2,��=*2,��=*1.6,��=*1.5,��=*1.4,f=*0,���'],
		['L DF','skillsldf', 'L','DF',0,			'!���,!s=*0,��=*3,��=*1.5,��=*1.5,��=*1.3,��=*1.3,��=*1,f=*0,���'],
		['C DF(��������)','skillslcdf','C','DF',0,	'!���,!s=*0,��=*3,��=*1.7,��=*1.5,��=*1.3,f=*0,���'],
		['C DF(������������)','skillsccdf','C','DF',0,'!���,!s=*0,��=*3,��=*3,��=*1.7,��=*1.5,��=*1.3,f=*0,���'],
		['C DF(����������)','skillsrcdf','C','DF',0,'!���,!s=*0,��=*3,��=*2.1,��=*2,��=*1.9,��=*1.3,��,f=*0,���'],
		['R DF','skillsrdf', 'R','DF',0,			'!���,!s=*0,��=*3,��=*1.5,��=*1.5,��=*1.3,��=*1.3,��=*1,f=*0,���'],
		['L DM','skillsldm', 'L','DM',0,			'!���,!s=*0,��=*2.5,��=*2,��=*2,��=*2,��=*1,��=*1,��=*1,f=*0,���'],
		['C DM(�������)','skillslcdm','C','DM',0,	'!���,!s=*0,��=*2.5,��=*2.5,��=*2,��=*1.5,��=*1.5,��=*1,��=*1,f=*0,���'],
		['C DM(������������)','skillsccmd','C','DM',0,'!���,!s=*0,��=*3,��=*2.5,��=*1.5,��=*1.5,��=*1,f=*0,���'],
		['C DM(�������)','skillsrcdm','C','DM',0,	'!���,!s=*0,��=*2.5,��=*2.5,��=*2,��=*1.5,��=*1.5,��=*1,��=*1,f=*0,���'],
		['R DM','skillsrdm', 'R','DM',0,			'!���,!s=*0,��=*2.5,��=*2,��=*2,��=*2,��=*1,��=*1,��=*1,f=*0,���'],
		['L MF','skillslmf', 'L','M',0,				'!���,!s=*0,��=*2.5,��=*2,��=*2,��=*2,��=*2,f=*0,���'],
		['C MF(������������)','skillslcmf','C','M',0,'!���,!s=*0,��=*3,��=*2,��=*2,��=*2,��=*1.5,��=*1.5,f=*0,���'],
		['C MF(���������)','skillsccmf','C','M',0,	'!���,!s=*0,��=*3,��=*2,��=*2,��=*1.5,��=*1.5,f=*0,���'],
		['C MF(�������)','skillsrcmf','C','M',0,	'!���,!s=*0,��=*2.5,��=*2,��=*2,��=*2,��=*1.5,f=*0,���'],
		['R MF','skillsrmf', 'R','M',0,				'!���,!s=*0,��=*2.5,��=*2,��=*2,��=*2,��=*2,f=*0,���'],
		['L AM','skillslam', 'L','AM',0,			'!���,!s=*0,��=*2.5,��=*2.5,��=*2,��=*2,��=*1.5,��=*1.5,f=*0,���'],
		['C AM(������������)','skillslcam','C','AM',0,'!���,!s=*0,��=*3,��=*2,��=*2,��=*2,��=*1.5,��=*1.5,f=*0,���'],
		['C AM(���������)','skillsccam','C','AM',0,	'!���,!s=*0,��=*3,��=*2,��=*2,��=*2,��=*1,f=*0,���'],
		['C AM(��������� FW)','skillsrcam','C','AM',0,'!���,!s=*0,��=*2.5,��=*2.5,��=*2,��=*2,��=*1,��=*1,f=*0,���'],
		['R AM','skillsram', 'R','AM',0,			'!���,!s=*0,��=*2.5,��=*2.5,��=*2,��=*2,��=*1.5,��=*1.5,f=*0,���'],
		['C FW(�������)','skillslcfw','C','FW',0,	'!���,!s=*0,��=*3,��=*2,��=*2,��=*1.5,��=*1,f=*0,���'],
		['C FW(�������)','skillsccfw','C','FW',0,	'!���,!s=*0,��=*3,��=*2,��=*2,��=*1,f=*0,���'],
		['C FW(����������)','skillsrcfw','C','FW',0,'!���,!s=*0,��=*3,��=*2,��=*2,��=*2,��=*1,f=*0,���']
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

	// get player skills
	var skillsum = 0
	$('td.back4 table:first table:first td:even').each(function(){
		var skillarrow = ''
		var skillname = $(this).find('script').remove().end().html().replace(/<!-- [�-�] -->/g,'');
		var skillvalue = parseInt($(this).next().find('script').remove().end().html().replace('<b>',''));
		if ($(this).next().find('img').attr('src') != undefined){
			skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
		}
		skillsum += skillvalue;
		players[0][sklfr[skillname]] = skillvalue + skillarrow;
	})
	players[0].sumskills = skillsum

	//add sum of skills to page
	$('td.back4 table center:first').append('(��='+String(skillsum)+')')

	//get player header info
	var ms = $('td.back4 table center:first').html().replace('<b>','').replace('</b>','').replace(/<!-- [�-�] -->/g,'').split('<br>',6)
	var j = 0

	var name = ms[j].split(' (',1)[0].split(' <',1)[0]
	if (name.indexOf(' ')!=-1){
		players[0].firstname = name.split(' ',1)[0]
		players[0].secondname = name.replace(players[0].firstname+' ' ,'')
	} else {
		players[0].firstname = ''
		players[0].secondname = name
	}	

	players[0].team = ''
	players[0].sale = 0

	players[0].t = UrlValue('t')

	if (players[0].t =='p') {
		players[0].teamid = UrlValue('j',$('td.back4 a:first').attr('href'))
		players[0].teamhash = UrlValue('z',$('td.back4 a:first').attr('href'))

		players[0].team = $('td.back4 a:first').text()
	} else if (players[0].t =='p2'){
		players[0].team = '���������'
	}

	players[0].id  = UrlValue('j')
	players[0].hash  = UrlValue('z')
	// ������!
	if (players[0].t == 'yp' || players[0].t == 'yp2') {
		players[0].flag = 5
	}
 	j++
	if (ms[j].indexOf('� ������') !=-1) j++
	players[0].age = +ms[j].split(' ',1)[0]
	if (ms[j].indexOf('(������')>-1){
		players[0].natfull = ms[j].split(', ',2)[1].split(' (',1)[0]
		players[0].internationalapps = +ms[j].split(', ',2)[1].split('������ ',2)[1]
		players[0].internationalgoals = +ms[j].split(', ',3)[2].split(' ',2)[1].replace(')','')
		if (ms[j].indexOf('U21')>-1){
			players[0].u21apps = +ms[j].split('/ U21 ������ ',2)[1].split(',',1)[0]
			players[0].u21goals = +ms[j].split('/ U21 ������ ',2)[1].split(', ����� ',2)[1].replace(')','')
		} else {
			players[0].u21apps = 0
			players[0].u21goals = 0
		}
	} else {
		players[0].natfull = ' '
		players[0].internationalapps = 0
		players[0].internationalgoals = 0
		players[0].u21apps = 0
		players[0].u21goals = 0
	}
//	$('td.back4').prepend('get '+players[0].internationalapps+players[0].u21apps +'<br>')
	j++
	if (ms[j].indexOf('��������:')!=-1) {
		players[0].contract = +ms[j].split(' ',4)[1]
		players[0].wage = +ms[j].split(' ',4)[3].replace(/,/g,'').replace('$','')
		j++
	} else {
		if (UrlValue('t') == 'yp' || UrlValue('t') == 'yp2'){
			players[0].contract = 21 - players[0].age
			players[0].wage = 100
		} else {
			players[0].contract = 0
			players[0].wage = 0
		}
	}
	if (ms[j].indexOf('�������:') != -1) {
		players[0].value = +ms[j].split(' ',2)[1].replace(/,/g,'').replace('$','')
		j++
	} else {
		players[0].value = 0
	}
	if (ms[j].indexOf('���� �������:') != -1) {
		j++
		players[0].sale = 1
	}
	players[0].position = ms[j]

	$('td.back4 table:first table:eq(1) tr:gt(0)').each(function(i, val){
		players[0]['ig'+i] = parseInt($(val).find('td:eq(1)').text())
		players[0]['gl'+i] = parseInt($(val).find('td:eq(2)').text())
		players[0]['ps'+i] = parseInt($(val).find('td:eq(3)').text())
		players[0]['im'+i] = parseInt($(val).find('td:eq(4)').text())
		players[0]['sr'+i] = parseFloat(($(val).find('td:eq(5)').text() == '' ? 0 : $(val).find('td:eq(5)').text()))
	})
	
	// get post-info
	var ms2 = $('td.back4 > center:first').html()
	if (ms2 != null){
		var j2 = 0
		ms2 = ms2.replace(/<!-- [�-�] -->/g,'').split('<br>')
		players[0].form = +ms2[j2].split(': ',2)[1].split('%',1)[0]
		players[0].morale = +ms2[j2].split(': ',3)[2].replace('%</i>','')
		j2++;j2++;j2++;j2++
		// ������������ �������:
		if(ms2[j2].split(': ',2)[0]=='�����������������') j2++
		players[0].zk0 = +ms2[j2].split(': ',2)[1]
		j2++
		players[0].kk0 = +ms2[j2].split(': ',2)[1]
		j2++;j2++;j2++
		// ������������� �������:
		if(ms2[j2].split(': ',2)[0]=='�����������������') j2++
		players[0].zk2 = +ms2[j2].split(': ',2)[1]
		j2++
		players[0].kk2 = +ms2[j2].split(': ',2)[1]
		j2++;j2++;j2++
		// �������:
		if(ms2[j2].split(': ',2)[0]=='�����������������') j2++
		players[0].zk3 = +ms2[j2].split(': ',2)[1]
		j2++
		players[0].kk3 = +ms2[j2].split(': ',2)[1]
		players[0].zk4 = ' '
		players[0].kk4 = ' '

		$('td.back4 table:first table:eq(1) tr:first td:gt(0)').attr('width','10%')
		$('td.back4 table:first table:eq(1) tr:first').append('<td width=10%>�� <img src="system/img/gm/y.gif"></img></td><td width=10%>�� <img src="system/img/gm/r.gif"></img></td>')
		$('td.back4 table:first table:eq(1) tr:gt(0)').each(function(i,val){
			if(i==0)		$(val).append('<td rowspan=2>'+players[0].zk0+'</td><td rowspan=2>'+players[0].kk0+'</td>')
			else if(i==2)	$(val).append('<td>'+players[0].zk2+'</td><td>'+players[0].kk2+'</td>')
			else if(i==3)	$(val).append('<td>'+players[0].zk3+'</td><td>'+players[0].kk3+'</td>')
			else if(i==4)	$(val).append('<td></td><td></td>')
		})
	} else {
		players[0].form = 0
		players[0].morale = 0
		for(i=0;i<=4;i++){
			players[0]['ig'+i] = 0
			players[0]['gl'+i] = 0
			players[0]['ps'+i] = 0
			players[0]['im'+i] = 0
			players[0]['sr'+i] = 0
			players[0]['zk'+i] = 0
			players[0]['kk'+i] = 0
		}

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
		var sksstr = psj[5].split(',') 			// !���,!s=*0,��=*2,��=*2,��=*2,��=*1.5,��=*1.5,��,f=*0,���
		var koff = 1

		if ((players[0].position.indexOf(psj[2]) == -1) || (players[0].position.indexOf(psj[3]) == -1)) koff = 1000


		for (var s in sksstr) {
			var sks = sksstr[s].replace('!','').split('=',2)	// sks[0] = ��, sks[1] = *2
			if ( sklsr[sks[0]]) {
				var skillname = sklsr[sks[0]]	// reflex
				var skilloperation = (sks[1] ? sks[1] : '*0')
				var skillvalue = (isNaN(parseInt(players[0][skillname])) ? 1 : parseInt(players[0][skillname]))
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
	
	posfilter[0][0] = 0
	posfilter.sort(sSkills)

	players[0].idealnum = posfilter[1][2]
	players[0].idealpos = posfilter[1][1]

	var text3 = ''
	text3 += '<br><a id="remember" href="javascript:void(RememberPl(0))">'+('���������').fontsize(1)+'</a><br>'
	text3 += '<div id="compare"></div>'
	text3 += '<br><br><a id="codeforforum" href="javascript:void(CodeForForum())">'+('��� ��� ������').fontsize(1)+'</a><br>'
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

	// Draw left panel and fill data
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
	$('center:eq(1) ~ br:first').before('<div id="th0"><a id="th0" href="javascript:void(ShowTable(0))">&ndash;</a></div>').remove()
	$('center:eq(2) ~ br').before('<div id="th1"><a id="th1" href="javascript:void(ShowTable(1))">&ndash;</a></div>').remove()

	$('td.back4 table table:eq(1)').attr('id','stat')

	var statseasons = '<br><div id="kar" align=center>�������</div>'
	statseasons += '<div id="th2" align=left><a id="th2" href="javascript:void(GetPlayerHistory(0,'+players[0].id+'))">+</a></div>'
	statseasons += '<table width=100% id=ph0></table>'
	$('td.back4 table table:eq(1)').after(statseasons)

	// Get info fom Global or Session Storage
	var text1 = String(navigator.userAgent.indexOf('Firefox') != -1 ? globalStorage[location.hostname].peflplayer : sessionStorage.peflplayer)
	if (text1 != 'undefined'){
		var pl = text1.split(',');
		for (i in pl) {
			key = pl[i].split('=')
			var pn = (key[0].split('_')[1] == undefined ? 2 : key[0].split('_')[1])
			players[pn][key[0].split('_')[0]] = [key[1]]
		}
		PrintPlayers()
	}
	//GetPlayerHistory(0,players[0].id)

}, false)
//})();	// for ie