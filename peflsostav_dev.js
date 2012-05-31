// ==UserScript==
// @name           peflsostav
// @namespace      pefl
// @description    Display sostav
// @include        http://*pefl.*/*?sostav
// @include        http://*pefl.*/*?sostav_n
// @version        2.0
// ==/UserScript==

deb = (localStorage.debug == '1' ? true : false)
var debnum = 0

var ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
var data = []

var tabslist = ''
var positions = {
	
}

$().ready(function() {
	if(deb) $('body').prepend('<div id=debug></div>')

	var geturl = (location.search.substring(1) == 'sostav' ? 'fieldnew3.php' : 'fieldnew3_n.php')
	$.get(geturl, {}, function(datatext){
		debug('geturl')
		var dataarray = datatext.split('&');
		var i = 0;
		while(dataarray[i] != null) {
			tmparr = dataarray[i].split('=');
			var tmpkey = tmparr[0];
			var tmpvalue = tmparr[1];
			data[tmpkey] = tmpvalue;
			i++;
		}
		PrintTables(geturl)
	})
})

function debug(text) {if(deb) {debnum++;$('div#debug').append(debnum+'&nbsp;\''+text+'\'<br>');}}

function PrintTables(geturl) {
	debug('PrintTables()')
	var newhtml = '<br><br>'
	newhtml += '<table width=100% bgcolor=#C9F8B7>'
	for(i=1;i<8;i++){
		newhtml += '<tr id=tr'+i+' bgcolor=#A3DE8F>'
		for(j=1;j<6;j++){
			if(i==1 && j==1) {
				newhtml += '<td valign=center height=90 id=td'+i+j+' bgcolor=#C9F8B7 align= center >'
				newhtml += '<img height=90 src=/system/img/'
				if(geturl=='fieldnew3_n.php') newhtml += (isNaN(parseInt(localStorage.myintid)) ? 'g/int.gif' : 'flags/full'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'.gif')+'>'
				else newhtml += (isNaN(parseInt(localStorage.myteamid)) ? 'g/team.gif' : 'club/'+localStorage.myteamid+'.gif')+'>'
			} else if (i==1 && j==5){
				newhtml += '<td valign=top height=90 id=td'+i+j+' bgcolor=#C9F8B7 align= center>'+ShowHelp()
			} else if (i>5 && j!=3){
				newhtml += '<td valign=top height=90 id=td'+i+j+' bgcolor=#C9F8B7 align= center>'
			} else {
				newhtml += '<td valign=top width=20% height=90 id=td'+i+j+'>'
				newhtml += '<div align=center id=div'+i+j+' onmousedown="MouseOn(\''+i+'\',\''+j+'\')">'
				newhtml += 	'<span id=span'+i+j+'>&nbsp;</span>'
				newhtml += 	'<select hidden id=select'+i+j+' onchange="CheckT(\''+i+'\',\''+j+'\')">'
				newhtml += 		'<option selected value="0"></option>'
				newhtml += 		'<option value="1">Чебурашка</option>'
				newhtml += 		'<option value="2">Крокодил Гена</option>'
				newhtml += 		'<option value="3">Шапокляк</option>'
				newhtml += 		'<option value="4">Крыса Лариса</option>'
				newhtml += 	'</select>'
				newhtml += '</div>'
			}
			newhtml += '</td>'
		}
		newhtml += '</tr>'
	}
	newhtml += '</table>'
	$('td.back3:first').remove()
	$('td.back4').html(newhtml)
}

function MouseOn(p1,p2){
	$('#span'+p1+p2).hide()
	$('#select'+p1+p2).show()
}
function MouseOff(p1,p2){
	if($('#select'+p1+p2).val()!=0) $('#span'+p1+p2).html('значение '+$('#select'+p1+p2).val())
	else $('#span'+p1+p2).html('&nbsp;')
	$('#select'+p1+p2).hide()
	$('#span'+p1+p2).show()
}

function CheckT(p1,p2){
	var x = $('#select'+p1+p2).val()
	$('#table'+p1+p2).remove()
	if(x!=0){
		var html = '<table id=table'+p1+p2+' width=100%><tr>'
		html += '<td>0</td><td>0</td><td>'+p1+'</td><td>'+p2+'</td><td>выбрано '+x+'</td>'
		html += '</tr></table>'
		$('#select'+p1+p2).after(html)
	}
	MouseOff(p1,p2)
}

function ShowHelp(){
	var html = ''
	html += '<table bgcolor=#A3DE8F >'
	html += '<tr><th colspan=4>'+'HELP'.fontsize(1)+'</th></tr>'
	html += '<tr><td bgcolor=#FFFFFF colspan=2>'+'основа'.fontsize(1)+'</td>'
	html += '<td bgcolor=#BABDB6 colspan=2>'+'в заявке'.fontsize(1)+'</td></tr>'
	html += '<tr bgcolor=red><td colspan=4>'+'не своя позиция'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#EF2929></td><td>'+'трв'.fontsize(1)+'</td>'
	html += '<td bgcolor=#A40000></td><td>'+'дск'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#FCE94F></td><td>'+'фрм<90'.fontsize(1)+'</td>'
	html += '<td bgcolor=#E9B96E></td><td>'+'мрл<80'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#729FCF></td><td>'+'шкл'.fontsize(1)+'</td></tr>'
	html += '</table>'
	return html
}
