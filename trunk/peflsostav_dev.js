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
var plkeys = []
var players = []
var tabslist = ''
var maxtables = 25
var positions = [
	{					name:'&nbsp;'},
	{filter:'GK', 		name:'GK', 		koff:'reflexes=reflexes*3,positioning=positioning*2,handling=handling*1.5,firstname,secondname'},
	{filter:'LR DF',	name:'LR DF',	koff:'positioning=positioning*2,tackling=tackling*1.5,firstname,secondname'},
	{filter:'C DF/SW',	name:'C DF/SW',	koff:'firstname,secondname'},
	{filter:'LR M',		name:'LR M',	koff:'firstname,secondname'},
	{filter:'C M',		name:'C M',		koff:'firstname,secondname'},
	{filter:'FW',		name:'FW',		koff:'firstname,secondname'}
]
var selected = '0,6,0,6,0,0,0,0,0,4,5,0,5,4,0,0,0,0,0,2,3,0,3,2,0,1'

$().ready(function() {
	if(deb) $('body').prepend('<div id=debug></div>')

	if(localStorage.selected != undefined){
		debug('selected from lS')
		selected = String(localStorage.selected)
	}
	selected = selected.split(',')

	var geturl = (location.search.substring(1) == 'sostav' ? 'fieldnew3.php' : 'fieldnew3_n.php')
	PrintTables(geturl)
	$.get(geturl, {}, function(datatext){
		debug('geturl')
		var dataarray = datatext.split('&');
		var i = 0;
		var check = false
		while(dataarray[i] != null) {
			tmparr = dataarray[i].split('=');
			var tmpkey = tmparr[0];
			var tmpvalue = tmparr[1];
			data[tmpkey] = tmpvalue;
			i++;
			if(tmpkey == 'nation0') check = true
			if(tmpkey == 'nation1') check = false
			if(check) plkeys.push(tmpkey.replace('0',''))
		}
		getPlayers()
		getPositions()
		FillHeaders()
	})
})

function debug(text) {if(deb) {debnum++;$('div#debug').append(debnum+'&nbsp;\''+text+'\'<br>');}}

function getPositions(){
	debug('getPositions()')
	// TODO: + custom positions(from forum)
	for(i in positions){
		var pls = []
		for(j in players){
			pls.push(positions[i].name+','+players[j].secondname)
		}
		positions[i].pls = pls
		//debug('fill '+ positions[i].pls[1])
	}
}

function getPlayers(){
	var numPlayers = parseInt(data['n'])
	debug('numPlayers:'+numPlayers)
	for(i=0;i<numPlayers;i++){
		var pl = {}
		for(j in plkeys) pl[plkeys[j]] = data[plkeys[j]+i]
		players[pl.id] = pl
	}
	//for(i in players[58279]) debug(i+':'+players[58279][i])
}

function FillHeaders(){
	debug('FillHeaders():'+maxtables)
	for(i=1;i<=maxtables;i++){
		for(j in positions) $('#select'+i).append('<option value='+j+'>'+positions[j].name+'</option>')
		var name = positions[0].name
		if(positions[selected[i]] !=undefined && positions[selected[i]].name != undefined) {
			name = positions[selected[i]].name
		}
		if (selected[i]!=undefined) $('#select'+i+' option:eq('+selected[i]+')').attr('selected', 'yes')
		$('#span'+i).html(name)
		FillData(i)
	}
}

function FillData(nt){
	var np = $('#select'+nt+' option:selected').val()
	debug('FillData('+nt+'):'+np)
/**/
	$('#table'+nt).remove()
	var html = '<table id=table'+nt+' width=100%>'
    for(t in positions[np].pls){
		var pl = positions[np].pls[t].split(',')
		html += '<tr>'
		for(p in pl) html += '<td>'+pl[p]+'</td>'
		html += '</tr>'
	}
	html += '</table>'
	$('#select'+nt).after(html)
	MouseOff(num)
/**/
}

function PrintTables(geturl) {
	debug('PrintTables()')
	var newhtml = '<br><br>'
	newhtml += '<table width=100% bgcolor=#C9F8B7>'
	var num = 1
	for(i=1;i<8;i++){
		newhtml += '<tr id=tr'+i+' bgcolor=#A3DE8F>'
		for(j=1;j<6;j++){
			if(i==1 && j==1) {
				newhtml += '<td valign=center height=90 id=td'+num+' bgcolor=#C9F8B7 align= center >'
				newhtml += '<img height=90 src=/system/img/'
				if(geturl=='fieldnew3_n.php') newhtml += (isNaN(parseInt(localStorage.myintid)) ? 'g/int.gif' : 'flags/full'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'.gif')+'>'
				else newhtml += (isNaN(parseInt(localStorage.myteamid)) ? 'g/team.gif' : 'club/'+localStorage.myteamid+'.gif')+'>'
			} else if (i==1 && j==5){
				newhtml += '<td valign=top height=90 id=td'+num+' bgcolor=#C9F8B7 align= center>'+ShowHelp()
			} else if (i>5 && j!=3){
				newhtml += '<td valign=top height=90 id=td'+num+' bgcolor=#C9F8B7 align= center>'
			} else {
				newhtml += '<td valign=top width=20% height=90 id=td'+num+' onmousedown="MouseOn(\''+num+'\')">'
				newhtml += '<div align=center id=div'+num+'>'
				newhtml += 	'<span id=span'+num+'>&nbsp;</span>'
				newhtml += 	'<select hidden id=select'+num+' onchange="FillData(\''+num+'\')">'
				newhtml += 	'</select>'
				newhtml += '</div>'
				num++
			}
			newhtml += '</td>'
		}
		newhtml += '</tr>'
	}
	newhtml += '</table>'
	$('td.back3:first').remove()
	$('td.back4').html(newhtml)
}

function MouseOn(num){
//	if($('#select'+num).is(':visible'))
		$('#span'+num).hide()
		$('#select'+num).show().select()
}
function MouseOff(num){
	if($('#select'+num).val()!=0) $('#span'+num).html('значение '+$('#select'+num).val())
	else $('#span'+num).html(positions[0].name)
	$('#select'+num).hide()
	$('#span'+num).show()
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
