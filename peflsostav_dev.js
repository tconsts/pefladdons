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
/**  1 **/	{filter:'GK', 		name:'GK', 		koff:'reflexes=reflexes*3,positioning=positioning*2,handling=handling*1.5,firstname,secondname'},
/**  2 **/	{filter:'C SW',		name:'C SW',	koff:'positioning=positioning*2,tackling=tackling*1.5,firstname,secondname'},
/**  3 **/	{filter:'L DF',		name:'L DF',	koff:'positioning=positioning*2,tackling=tackling*1.5,firstname,secondname'},
/**  4 **/	{filter:'R DF',		name:'R DF',	koff:'positioning=positioning*2,tackling=tackling*1.5,firstname,secondname'},
/**  5 **/	{filter:'L DM',		name:'L DM',	koff:'positioning=positioning*2,tackling=tackling*1.5,firstname,secondname'},
/**  6 **/	{filter:'R DM',		name:'R DM',	koff:'positioning=positioning*2,tackling=tackling*1.5,firstname,secondname'},
/**  7 **/	{filter:'C DF',		name:'C DF',	koff:'firstname,secondname'},
/**  8 **/	{filter:'C DM',		name:'C DM',	koff:'firstname,secondname'},
/**  9 **/	{filter:'C M',		name:'C M',		koff:'firstname,secondname'},
/** 10 **/	{filter:'L M',		name:'L M',		koff:'firstname,secondname'},
/** 11 **/	{filter:'R M',		name:'R M',		koff:'firstname,secondname'},
/** 12 **/	{filter:'C AM',		name:'C AM',	koff:'firstname,secondname'},
/** 13 **/	{filter:'L AM',		name:'L AM',	koff:'firstname,secondname'},
/** 14 **/	{filter:'R AM',		name:'R AM',	koff:'firstname,secondname'},
/** 15 **/	{filter:'C FW',		name:'C FW',	koff:'firstname,secondname'}
]
var selected = '0,'+'0,15,0,'+'0,12,0,0,14,'+'10,0,9,0,0,'+'0,0,8,0,6,'+'3,0,0,7,0,'+'2,1'

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
			i++;
			var tmpkey = tmparr[0];
			var tmpvalue = tmparr[1];
			data[tmpkey] = tmpvalue;
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

function sSrt(i, ii) { // по убыванию
    if 		(i.srt < ii.srt)	return  1
    else if	(i.srt > ii.srt)	return -1
    return  0
}


function getPositions(){
	debug('getPositions()')
	// TODO: + custom positions(from forum)


	for(i=1;i<positions.length;i++){
		var pls = []
		var pos = positions[i].filter.split(' ')
		for(j in players){
			var pl = {}
			var	pos0 = false
			var pos1 = false
			var plpos = players[j].position
			if(pos[1]==undefined) {
				pos1 = true
				if(plpos.indexOf(pos[0]) != -1) pos0 = true
			} else {
				for(k=0;k<3;k++) if(plpos.indexOf(pos[0][k]) != -1) pos0 = true
				pos1arr = pos[1].split('/')
				for(k in pos1arr) if((plpos.indexOf(pos1arr[k]) != -1)) pos1 = true
			}
			pl.posf = (pos0 && pos1 ? true : false)

			//TODO: посчитать силу
			pl.srt = parseFloat(((Math.random())*100).toFixed(1))

			//TODO: добавить все параметры
			pl.secondname = players[j].secondname

			pls.push(pl)
		}
		positions[i].pls = pls.sort(sSrt)
	}
}

function FillData(nt){
	var np = $('#select'+nt+' option:selected').val()
	//debug('FillData('+nt+'):'+np)
/**/
	$('#table'+nt).remove()
	if(np!=0){
		var html = '<table id=table'+nt+' width=100%>'
    	for(t in positions[np].pls){
			var pl = positions[np].pls[t]
			html += '<tr '+(!pl.posf ? 'hidden' : '')+'>'
			for(p in pl) if(p!='posf') html += '<td>'+pl[p]+'</td>'
			html += '</tr>'
		}
		html += '</table>'
		$('#select'+nt).after(html)
	}
	MouseOff(nt)
/**/
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
				newhtml += '<div id=div'+num+'>'
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
	if($('#select'+num).val()!=0) $('#span'+num).html($('#select'+num+' option:selected').text())
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
