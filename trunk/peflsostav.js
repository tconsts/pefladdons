// ==UserScript==
// @name           peflsostav
// @namespace      pefl
// @description    Display sostav
// @include        http://*pefl.*/*?sostav
// @include        http://*pefl.*/*?sostav_n
// @version        2.0
// ==/UserScript==

var deb = (localStorage.debug == '1' ? true : false)
var debnum = 1
var ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
var sostavteam = (location.search.substring(1) == 'sostav' ? true : false)

positions = []
var data = []
var plkeys = []
var players = []
var pid = []
var stds = {pfre:[],pcor:[],pcap:[],ppen:[]}
var plskillmax = 15
var tabslist = ''
var maxtables = 25+10
var list = {
	positions: 'id,filter,name,num,koff'
}

var fl = ['','#EF2929','#A40000','#FCE94F','#E9B96E','green','black']
var selected = ''

var skillnames = {
sostav:{rshort:'зв',rlong:'Игрок в заявке?'},
flag:{rshort:'фл',rlong:'Информационный флаг'},
pfre:{rshort:'иш',rlong:'Исполнители штрафных'},
pcor:{rshort:'иу',rlong:'Исполнители угловых'},
ppen:{rshort:'пн',rlong:'Исполнители пенальти'},
pcap:{rshort:'кп',rlong:'Капитаны'},
//сс
school:{rshort:'шкл',rlong:'Школьник?'},
srt:{rshort:'сила',rlong:'В % от идеала (профы '+plskillmax+')',type:'float'},
stdat:{rshort:'са',rlong:'Идет на стд. атаки'},
stdbk:{rshort:'со',rlong:'Идет на стд. обороны'},
nation:{rshort:'кСт',rlong:'Код страны'},
natfull:{rshort:'стр',rlong:'Страна',align:'left',nowrap:'1'},
secondname:{rshort:'Фам',rlong:'Фамилия',align:'left',nowrap:'1'},
firstname:{rshort:'Имя',rlong:'Имя',align:'left',nowrap:'1'},
age:{rshort:'взр',rlong:'Возраст'},
id:{rshort:'id',rlong:'id игрока'},
internationalapps:{rshort:'иСб',rlong:'Игр за сборную'},
internationalgoals:{rshort:'гСб',rlong:'Голов за сборную'},
contract:{rshort:'кнт',rlong:'Контракт'},
wage:{rshort:'зрп',rlong:'Зарплата'},
value:{rshort:'ном',rlong:'Номинал',type:'value'},
corners:{rshort:'уг',rlong:'Угловые'},
crossing:{rshort:'нв',rlong:'Навесы'},
dribbling:{rshort:'др',rlong:'Дриблинг'},
finishing:{rshort:'уд',rlong:'Удары'},
freekicks:{rshort:'шт',rlong:'Штрафные'},
handling:{rshort:'ру',rlong:'Игра руками'},
heading:{rshort:'гл',rlong:'Игра головой/на выходах'},
leadership:{rshort:'лд',rlong:'Лидерство'},
longshots:{rshort:'ду',rlong:'Дальние удары'},
marking:{rshort:'по',rlong:'Персональная опека'},
pace:{rshort:'ск',rlong:'Скорость'},
passing:{rshort:'пс',rlong:'Пас'},
positioning:{rshort:'вп',rlong:'Выбор позиции'},
reflexes:{rshort:'ре',rlong:'Реакция'},
stamina:{rshort:'вн',rlong:'Выносливость'},
strength:{rshort:'мщ',rlong:'Мощь'},
tackling:{rshort:'от',rlong:'Отбор'},
vision:{rshort:'ви',rlong:'Видение'},
workrate:{rshort:'рб',rlong:'Работоспособность'},
technique:{rshort:'тх',rlong:'Техника'},
morale:{rshort:'мрл',rlong:'Мораль'},
form:{rshort:'фрм',rlong:'Форма'},
position:{rshort:'Поз',rlong:'Позиция',align:'left',nowrap:'1'},
/**
games
goals
passes
mom
ratingav
cgames
cgoals
cpasses
cmom
cratingav
egames
egoals
epasses
emom
eratingav

wgames
wgoals
wpasses
wmom
wratingav

fgames
fgoals
fpasses
fmom
fratingav
vratingav
training
/**/
inj:{rshort:'трв',rlong:'Травма'},
sus:{rshort:'дсв',rlong:'Дисквалификация'},
syg:{rshort:'сыг',rlong:'Сыгранность'},
/**
agames
agoals
apasses
amom
/**/
}

$().ready(function() {

	selected = getDataSelected().split(',')

	var geturl = (sostavteam ? 'fieldnew3.php' : 'fieldnew3_n.php')
	PrintTables(geturl)
	$.get(geturl, {}, function(datatext){
		debug('geturl')
		var dataarray = datatext.split('&');
		var i = 0;
		var pid_num = 0
		var check = false
		while(dataarray[i] != null) {
			tmparr = dataarray[i].split('=');
			i++;
			var tmpkey = tmparr[0];
			var tmpvalue = tmparr[1];
			data[tmpkey] = tmpvalue;

			// данные о заявке
			if (tmpkey.indexOf('pid') != -1) {
				var tmpnum = parseInt(tmpkey.replace('pid',''))
//				debug('pid:'+tmpkey+':'+tmpvalue+':'+tmpnum)
				if(pid[tmpnum]==undefined) pid[tmpnum] = {}
				pid[tmpnum].pid = tmpvalue;
			}
			// изначальная тактика
			if (tmpkey.indexOf('p0_') != -1) {
				var tmpnum = parseInt(tmpkey.replace('p0_',''))
//				debug('p0:'+tmpkey+':'+tmpvalue+':'+tmpnum)
				pid[tmpnum].p0 = tmpvalue;
			}
			// смещения изначальной тактики 
			if (tmpkey.indexOf('pm0_') != -1) {
				var tmpnum = parseInt(tmpkey.replace('pm0_',''))
				pid[tmpnum].pm0 = tmpvalue;
			}
			// испольнители штрафных
			if (tmpkey.indexOf('fre') != -1) {
				stds.pfre[tmpvalue] = parseInt(tmpkey.replace('fre',''))
			}
			// испольнители угловых
			if (tmpkey.indexOf('cor') != -1) {
				stds.pcor[tmpvalue] = parseInt(tmpkey.replace('cor',''))
			}
			// испольнители penalty
			if (tmpkey.indexOf('pen') != -1) {
				stds.ppen[tmpvalue] = parseInt(tmpkey.replace('pen',''))
			}
			// капитаны
			if (tmpkey.indexOf('cap') != -1) {
				stds.pcap[tmpvalue] = parseInt(tmpkey.replace('cap',''))
			}

			// собираем z0 (перс задания 1й тактики)
			if (tmpkey.indexOf('z0') != -1) {
				var tmpnum = parseInt(tmpkey.replace('z0_',''))
				pid[tmpnum].z0bk = (tmpvalue>=513 ? true : false)
				pid[tmpnum].z0at = ((tmpvalue>=213 && tmpvalue<500) || tmpvalue>=700 ? true : false)
			}

			// ключи скилов игроков
			if(tmpkey == 'nation0') check = true
			if(tmpkey == 'nation1') check = false
			if(check) plkeys.push(tmpkey.replace('0',''))
		}
//		for(h in pid) debug(h+':'+pid[h].z0at+':'+pid[h].z0bk)
		getPlayers()
		GetData('positions')
	})
})

function getDataSelected(){
	var dataname = (sostavteam ? 'selected' : 'selectedn')
	var datavalue = String(localStorage[dataname])
	debug('getDataSelected:'+ dataname +':'+datavalue)
	if(datavalue == 'undefined'){
		datavalue = ''
			+',1,2'			// линия Gk & SW
			+',3,7,7,7,4'	// линия DF
			+',5,8,8,8,6'	// линия DM
			+',10,9,9,9,11'	// линия MF
			+',13,12,12,12,14'	// линия AM
			+',15,15,15'		// линия FW
			+',16,17,18,19,20'	// доп таблицы 1
			+',21,0,0,0,0'		// доп таблицы 2
	}
	return datavalue
}

function saveDataSelected(){
	var dataname = (sostavteam ? 'selected' : 'selectedn')
	var datavalue = selected.join(',')	
	debug('saveDataSelected:'+datavalue)
	localStorage[dataname] = datavalue
}

function debug(text) {
	if(deb) {
		if(debnum==1) $('body').append('<div id=debug>DEBUG INFROMATION<hr></div>')
		$('div#debug').append(debnum+'&nbsp;\''+text+'\'<br>');
		debnum++;
	}
}

function sSrt(i, ii) { // по убыванию
	var s = (i.srt!=undefined ? 'srt' : '!srt')
    if 		(i[s] < ii[s])	return  1
    else if	(i[s] > ii[s])	return -1
    return  0
}

function GetData(dataname){
	debug(dataname+':GetData')
	var needsave = false
	var data = []
	var head = list[dataname].split(',')
	var text1 = String(localStorage[dataname])
	if (text1 != 'undefined' && text1 != 'null'){
		var text = text1.split('#')
		var numpos = 0
		for (i in text) {
			var x = text[i].split('|')
			var curt = {}
			var num = 0
			for(j in head){
				curt[head[j]] = (x[num]!=undefined ? x[num] : '')
				num++
			}
			data[numpos] = curt
			numpos++
		}
	}else{
		needsave = true
	// TODO: загрузить дефоултные positions(from forum) вместо констант тут.
		data = [
			{filter:'',		name:'&nbsp;',	num:0,	koff:''},
/**  1 **/	{filter:'GK', 	name:'GK', 		num:0,	koff:'ре=ре*3,вп=вп*2,гл=гл*2,ру=ру*1.5,!мщ=мщ*0.7,!ск=ск*0.4,фл,Фам,сила,зв'},
/**  2 **/	{filter:'C SW',	name:'C SW',	num:0,	koff:'вп=вп*2,от=от*1.5,гл=гл,ск=ск,!мщ,фл,Фам,сила,зв'},
/**  3 **/	{filter:'L DF',	name:'L DF',	num:0,	koff:'вп=вп*2,от=от*1.5,ск=ск*1.5,нв=нв,фл,Фам,сила,зв'},
/**  4 **/	{filter:'R DF',	name:'R DF',	num:0,	koff:'вп=вп*2,от=от*1.5,ск=ск*1.5,нв=нв,фл,Фам,сила,зв'},
/**  5 **/	{filter:'L DM',	name:'L DM',	num:0,	koff:'от=от*1.5,ск=ск*1.5,ви=ви,нв=нв,фл,Фам,сила,зв'},
/**  6 **/	{filter:'R DM',	name:'R DM',	num:0,	koff:'от=от*1.5,ск=ск*1.5,ви=ви,нв=нв,фл,Фам,сила,зв'},
/**  7 **/	{filter:'C DF',	name:'C DF',	num:0,	koff:'от=от*3,вп=вп*3,мщ=мщ*1.5,ск=ск*1.5,гл=гл*1.5,фл,Фам,сила,зв'},
/**  8 **/	{filter:'C DM',	name:'C DM',	num:0,	koff:'вп=вп*3,от=от*3,ви=ви*2,рб=рб*2,!тх=тх*1.5,!пс=пс*1.5,фл,Фам,сила,зв'},
/**  9 **/	{filter:'C M',	name:'C M',		num:0,	koff:'вп=вп*2,ви=ви*2,пс=пс*2,тх=тх*1.5,!от=от,!ду=ду*0.5,фл,Фам,сила,зв'},
/** 10 **/	{filter:'L M',	name:'L M',		num:0,	koff:'ск=ск*2,др=др*2,пс=пс*2,ви=ви*2,!нв=нв*1.5,!от=от*1.5,!тх=тх,фл,Фам,сила,зв'},
/** 11 **/	{filter:'R M',	name:'R M',		num:0,	koff:'ск=ск*2,др=др*2,пс=пс*2,ви=ви*2,!нв=нв*1.5,!от=от*1.5,!тх=тх,фл,Фам,сила,зв'},
/** 12 **/	{filter:'C AM',	name:'C AM',	num:0,	koff:'вп=вп*2,ви=ви*2,пс=пс*2,тх=тх*2,!ду=ду,!др=др,фл,Фам,сила,зв'},
/** 13 **/	{filter:'L AM',	name:'L AM',	num:0,	koff:'ск=ск*3,др=др*2.5,нв=нв*2,ви=ви*1.5,!пс=пс*1.5,!тх=тх,фл,Фам,сила,зв'},
/** 14 **/	{filter:'R AM',	name:'R AM',	num:0,	koff:'ск=ск*3,др=др*2.5,нв=нв*2,ви=ви*1.5,!пс=пс*1.5,!тх=тх,фл,Фам,сила,зв'},
/** 15 **/	{filter:'C FW',	name:'C FW',	num:0,	koff:'уд=уд*3,вп=вп*2,ск=ск*2,др=др*1.5,!гл=гл*1.5,!мщ=мщ*1.5,фл,Фам,сила,зв'},
/** 16 **/	{filter:'',		name:'Стд. атаки',	num:18,	koff:'зв=зв*200,гл=гл*5,вп=вп,мщ=мщ*0.5,са,фл,Фам,от,ск,!сила'},
/** 17 **/	{filter:'',		name:'Стд. обороны',num:18,	koff:'зв=зв*200,гл=гл*5,вп=вп,мщ=мщ*0.5,со,фл,Фам,др,ск,!сила'},
/** 18 **/	{filter:'',		name:'Исп. угловых',num:18,	koff:'зв=зв*200,уг=уг*10,нв=нв*2,ви,фл,Фам,иу,!сила'},
/** 19 **/	{filter:'',		name:'Исп. штрафных',num:18,koff:'зв=зв*200,шт=шт*10,ду=ду,нв=нв,ви,фл,Фам,иш,!сила'},
/** 20 **/	{filter:'',		name:'Исп. пенальти',num:18,koff:'зв=зв*200,взр=взр,уд=уд*0.3,лд=лд*0.3,фл,Фам,пн,!сила'},
/** 21 **/	{filter:'',		name:'Сыгранность',	num:0,	koff:'зв,сыг=сыг,фл,Фам,Поз,!сила'},
		]
	}
	switch (dataname){
		case 'positions':  positions = data;break
		default: return false
	}
	for(i=1;i<positions.length;i++) {
		countPosition(i)
	}
	if(needsave) SaveData('positions')
	FillHeaders()
	fillPosEdit(0)
}

function SaveData(dataname){
	debug(dataname+':SaveData')
	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'positions':	data = positions;		break
		default: return false
	}
	var text = ''
	for (var i in data) {
		text += (text!='' ? '#' : '')
		if(typeof(data[i])!='undefined') {
			var dti = data[i]
			var dtid = []
			for(var j in head){
				dtid.push(dti[head[j]]==undefined ? '' : dti[head[j]])
			}
			text += dtid.join('|')
		}
	}
	localStorage[dataname] = text
}

function filterPosition(plpos,flpos){
		var pos = flpos.split(' ')
		var	pos0 = false
		var pos1 = false
		if(pos[1]==undefined) {
			pos1 = true
			if(plpos.indexOf(pos[0]) != -1) pos0 = true
		} else {
			for(k=0;k<3;k++) if(plpos.indexOf(pos[0][k]) != -1) pos0 = true
			pos1arr = pos[1].split('/')
			for(k in pos1arr) if((plpos.indexOf(pos1arr[k]) != -1)) pos1 = true
		}
		return (pos0 && pos1 ? true : false)
}

function countPosition(posnum){
	var ps = positions[posnum]
	ps.strmax = countStrength('ideal',ps.koff)
	var pls = []
	for(j in players){
		var pl = {}
		if(j==0) pl.id0 = true
		pl.id = players[j].id
		if(pl.id==undefined) break
		var pkoff = ps.koff.split(',')
		for(h in pkoff){
			var koff = String(pkoff[h].split('=')[0])
			if(skillnames[koff]==undefined) for(l in skillnames) if(skillnames[l].rshort==koff.replace(/\!/g,'')) koff=koff.replace(skillnames[l].rshort,l)
			pl[koff] = (players[j][koff.replace(/\!/g,'')]==undefined ? 0 : players[j][koff.replace(/\!/g,'')])
		}
		pl.posf = filterPosition(players[j].position, ps.filter)
		if(ps.filter=='') pl.posfempty = true
		var s = (pl.srt!=undefined ? 'srt' : (pl['!srt']!=undefined!=undefined ? '!srt' : ''))
		if(s!='' && pl[s]!=undefined) pl[s] = (ps.strmax==0 ? 0 : (countStrength(j,ps.koff)/ps.strmax)*100)
//		debug('countPosition:'+ps.filter+':'+'/'+ps.strmax+'='+pl.srt+'%:'+players[j].secondname)

		pls.push(pl)
//		if(i==positions.length-1) debug('countPosition:'+pl.id+':sostav='+pl.sostav+':str='+pl.srt)
	}
	positions[posnum].pls = pls.sort(sSrt)
//	debug('countPosition:ps.strmax('+posnum+')='+ps.strmax)
}

function countStrength(plid,pkoff){
	var pl = (plid=='ideal' ? players[players.length-1] : players[plid])
	//debug('countStrength:plid='+plid+':secondname='+(plid=='ideal' ? 'ideal' : pl.secondname)+':pkoff='+pkoff)
	pkoff = pkoff.split(',')
	var res = 0
	for(n in pkoff){
		var koff = pkoff[n].replace(/\s/g,'').split('=')
		var count = 0
		if(koff[1]!=undefined){
			for(p in pl){
				var plp = (isNaN(parseInt(pl[p])) ? 0 : parseInt(pl[p]))
				var p2 = (skillnames[p]!=undefined ? skillnames[p].rshort : ' ')
				//debug('countStrength:---- p='+p+':p2='+p2+':plp='+plp)
				if((koff[1].indexOf(p)!=-1 || koff[1].indexOf(p2)!=-1) && p!=''){
					var reg  = new RegExp(p, "g")
					var reg2 = new RegExp(p2,"g")
					count = koff[1].replace(reg,(plid=='ideal' ? plskillmax : plp)).replace(reg2,(plid=='ideal' ? plskillmax : plp))
					//debug('countStrength:--- reg='+reg+':reg2='+reg2+':count='+count)
				}
			}
		}
		res += (count==undefined ? 0 : eval(count))
		//debug('countStrength:- res='+res+'('+eval(count)+'):koff1='+koff[1])
	}
	//debug('countStrength:- res='+res)
	return res
}

function Print(val,sn){
//	debug('Print('+val+','+sn+')')
	switch(skillnames[sn].type){
		case 'float':
			return (val).toFixed(1)
		case 'value':
			if(val>=1000000) return parseFloat(val/1000000).toFixed(3)+'м'
			else if(val==0) return '??'
			else return parseInt(val/1000)+'т'
		default:
			return val
	}
}

function FillData(nt){
	$('#table'+nt).remove()
	var np = $('#select'+nt+' option:selected').val()
	//debug('FillData('+nt+'):'+np)
	if(np!=0){
		var selpl = 0
		for(h in pid) if(pid[h].p0 == nt) selpl = pid[h].pid
		var html = '<table id=table'+nt+' width=100% style="border:0px">'
		var head = true
		var nummax = (positions[np].num==0 ? positions[np].pls.length : positions[np].num)
    	for(t=0;t<nummax;t++){
			var pl = positions[np].pls[t]
			var trbgcolor = (selpl==pl.id || (positions[np].filter == '' && pl.sostav==2) ? ' bgcolor=white' : (pl.sostav > 0 ? ' bgcolor=#BABDB6' : ''))
			var plhtml = '<tr align=right'
			plhtml += (!pl.posf && selpl!=pl.id ? ' hidden abbr=wrong' : '')
			plhtml += trbgcolor+'>'
			var font1 = (!pl.posf ? '<font color=red>' : '')
			var font2 = (!pl.posf ? '</font>' : '')
			if(head) var headhtml = '<tr align=center>'
			for(pp in pl) {
				if(pp=='flag'){
					plhtml += '<td'+(pl[pp]>0 ? ' bgcolor='+fl[pl[pp]] : trbgcolor)+'></td>'
					if(head) headhtml += '<td width=1%></td>'
				}else if(pp!='posf' && pp!='posfempty' && pp!='sostav' && pp!='id'){
					var hidden = ''
					var p = pp
					if(pp.indexOf('!')!=-1){
						p = pp.replace(/\!/g,'')
						hidden = ' hidden abbr=hidden'
					}
					if(skillnames[p] == undefined) {
						debug('FillData:p='+p+'(add custom parametr)')
						skillnames[p] = {}
						skillnames[p].rshort = p
						skillnames[p].rlong = 'Custom параметр'
						skillnames[p].type = 'custom'
					}
					var skp = skillnames[p]
					var align = (skp.align!=undefined ? ' align='+skp.align : '')
					var nowrap = (skp.nowrap!=undefined ? ' nowrap' : '')
					//debug('FillData:'+nt+':'+pp+':'+p)
					plhtml += '<td'+align+hidden+nowrap+'>'+font1
					plhtml += Print(pl[pp],p)
					plhtml += font2+'</td>'
					if(head) {
						headhtml += '<td'+hidden+(skp.rlong!=undefined ? ' title="'+skp.rlong+'"' : '')+'>'
						headhtml += (skp.rshort!=undefined ? skp.rshort : p)
						headhtml += '</td>'
					}
				}
			}
			plhtml += '</tr>'
			if(head) headhtml += '</tr>'
			html += (head ? headhtml : '') + plhtml
			head = false
		}
		html += '</table>'
		$('#htable'+nt).after(html)
	}
	if(selected[nt]!=np && np!=0) {
		selected[nt] = np
		saveDataSelected()
//		debug('FillData('+nt+') -- '+selected[nt]+':selected='+selected.join(','))
	}
	MouseOff(nt)
/**/
}

function getPlayers(){
	var numPlayers = parseInt(data['n'])
	debug('numPlayers:'+numPlayers)
	for(i=0;i<numPlayers;i++){
		var pl = {}
		for(j in plkeys) {
			var name = plkeys[j]
			var val = data[name+i]
			switch (name){
				case 'contract':
					val = (parseInt(val)==0 ? 21-parseInt(data['age'+i]): parseInt(val)); break;
				case 'wage':
					val = (parseInt(val)==0 ? 100 : parseInt((val).replace(/\,/g,''))); break;
				case 'value':
					if(parseInt(val)==0) pl.school = true // значит это школьник!
					val = parseInt((val).replace(/\,/g,''));break;
//				default:
			}
			pl[name] = val
		}
		pl.sostav = 0
		for(k in pid) {
			if(pid[k].pid==pl.id){
				pl.sostav = (k<12 ? 2 : 1)
				pl.stdat = (pid[k].z0at ? '*' : '')
				pl.stdbk = (pid[k].z0bk ? '*' : '')
			}
//			if(i==0) debug(k+':'+pid[k].z0at+':'+pid[k].z0bk)
		}
		for(k in stds) pl[k] = (stds[k][pl.id]!=undefined ? stds[k][pl.id] : '')

		pl.flag = 0
		if(data['inj'+i]>0) pl.flag = 1
		else if(data['sus'+i]>0) pl.flag = 2
		else if(data['form'+i]<90) pl.flag = 3
		else if(data['morale'+i]<80) pl.flag = 4
		else if(data['value'+i]==0) pl.flag = 5

//		debug(pl.secondname+':'+pl.flag)
		players[pl.id] = pl
	}
	// Подгрузить игроков из списка мониторинга если их тут нету еще с флагом "чужой".
}

function FillHeaders(){
//	debug('FillHeaders:maxtables='+maxtables)
//	debug('FillHeaders:-- selected='+selected)
	for(i=1;i<=maxtables;i++){
//		if(i<4)	for(j in pid) debug(i+':'+j+':pid='+pid[j].pid+':p0='+pid[j].p0)
        var sel = false
		for(j in pid) if(pid[j].p0 == i) sel = true

		$('#select'+i).empty()
		for(j in positions) $('#select'+i).append('<option value='+j+'>'+positions[j].name+'</option>')
		var name = positions[0].name
		$('#span'+i).html(name)
		if(positions[selected[i]] !=undefined && positions[selected[i]].name != undefined) {
			name = positions[selected[i]].name
		}
		if ((sel || i>25) && selected[i]!=undefined) $('#select'+i+' option:eq('+selected[i]+')').attr('selected', 'yes')
		if(sel) $('td#td'+i).attr('class','back2')
		FillData(i)
	}
}

function fillPosEdit(num){
	debug('fillPosEdit:num='+num)
	var html = ''
	html += '<table width=100% class=back1><tr valign=top><td width=150>'
	html += '<select id=selpos size=30 class=back2 style="border:1px solid;min-width:100;max-width=150;padding-left:5px" onChange="javascript:void(PosChange())">'
	for(i in positions)	html += '<option value='+i+(num==i ? ' selected' :'')+'>'+(i==0 ? '--- Создать ---' : positions[i].name)+'</option>'
	html += '</select></td>'
	html += '<td><table width=100%><tr><th width=10% align=right>Название:</th><td><input class=back1 style="border:1px solid;" id=iname name="name" type="text" size="40" value="'+(num!=undefined && num!=0 ? positions[num].name :'')+'"></td>'
	html += '<tr><th align=right>Кол-во:</th><td><input class=back1 style="border:1px solid;" id=inum name="num" type="text" size="3" value="'+(num!=undefined && num!=0 && positions[num].num!=undefined ? positions[num].num :'')+'"> Сколько max отображать игроков(0=все)</td></tr>'
	html += '<tr><th align=right>Фильтр:</th><td><input class=back1 style="border:1px solid;" id=ifilter name="filter" type="text" size="10" value="'+(num!=undefined && num!=0  ? positions[num].filter :'')+'"> Формат: "LC DF/DM"(пусто=все)</td></tr>'
	html += '<tr><th align=right>Коэффициенты:</th><td><textarea class=back1 style="border:1px solid;" id=ikoff name="koff" cols="40" rows="5">'+(num!=undefined && num!=0  ? positions[num].koff :'')+'</textarea></td></tr>'
	html += '<tr><th height=20 class=back2 onmousedown="javascript:void(PosSave())" onMouseOver="this.style.cursor=\'pointer\'" style="border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Сохранить</th><td></td></tr>'
	html += '<tr><th height=20 class=back2 onmousedown="javascript:void(PosDel())" onMouseOver="this.style.cursor=\'pointer\'" style="border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Сбросить</th><td></td></tr>'
	html += '</table></td>'
	html += '<td><table width=100% align=top>'
	html += '<tr><td>!</td><td colspan=2>значит по дефоулту поле не отображать</td></tr>'
	html += '<tr><td>=</td><td colspan=2>эти скилы учавствуют в подсчете силы</td></tr>'
	for(m in skillnames) html += '<tr><td>'+skillnames[m].rshort+'</td><td>'+m+'</td><td>'+skillnames[m].rlong+'</td></tr>'
	html += '</table></td></tr>'
	html += '</table>'
	$('div#divedit').html(html)
}

function PosChange(){
	var selnum = $('#selpos option:selected').val()
	debug('PosChange():'+selnum)
	fillPosEdit(selnum)
}
function PosDel(){
	delete localStorage.positions
	chMenu('tdsost')
	GetData('positions')
}

function PosSave(){
	var num = $('#selpos option:selected').val()
	if(num==0) num = positions.length
	debug('PosSave():'+num)
	var ps = {
		name: 	$('#iname').val(),
		num: 	($('#inum').val() == '' ? 0 : $('#inum').val()),
		filter: $('#ifilter').val(),
		koff: 	$('#ikoff').val(),
	}
	// провалидировать поля и обновить
	if(ps.num!=parseInt(ps.num) ||
		ps.name == '' ||
		ps.koff == ''){
			alert('Неправильно введены параметры!')
			return false
	}
	positions[num] = ps
	countPosition(num)
	chMenu('tdsost')
	fillPosEdit(num)
	FillHeaders()
	SaveData('positions')
}

function chMenu(mid){
	debug('chMenu('+mid+')')
	switch (mid){
		case 'tdedit':
			$('th#tdsost,th#tddopt').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tdedit').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tablesost, table#tabledopt').hide()
			$('div#divedit').show()
			break;
		case 'tddopt':
			$('th#tdsost,th#tdedit').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tddopt').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tablesost, div#divedit').hide()
			$('table#tabledopt').show()
			break;
		default:
			$('th#tdedit,th#tddopt').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tdsost').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tabledopt, div#divedit').hide()
			$('table#tablesost').show()
	}
}
function close(){
	$('td#sostavplus').hide()
	$('td.back3:first').show()
	$('td.back4:first').show()
}

function open(){
	$('td#sostavplus').show()
	$('td.back3:first').hide()
	$('td.back4:first').hide()
	if(sostavteam) $('a#sostav').attr('href','javascript:void(open())')
	else $('a#sostav_n').attr('href','javascript:void(open())')
}

function PrintTables(geturl) {
	debug('PrintTables()')
	open()

	var html = '<div align=right><a href="javascript:void(close())">закрыть</a>&nbsp;</div>'
	html += '<table align=center id=tmenu width=98% class=back1 style="border-spacing:1px 0px" cellpadding=5><tr height=25>'
	html += '<td width=5 style="border-bottom:1px solid">&nbsp;</td>'
	html += '<th id=tdsost width=150 onmousedown="javascript:void(chMenu(\'tdsost\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border-top:1px solid;border-left:1px solid;border-right:1px solid" onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back1\'">Состав+</th>'
	html += '<th id=tddopt width=150 onmousedown="javascript:void(chMenu(\'tddopt\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border:1px solid;" class=back2 onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back2\'">Доп. таблицы</th>'
	html += '<th id=tdedit width=150 onmousedown="javascript:void(chMenu(\'tdedit\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border:1px solid;" class=back2 onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back2\'">Настроить кофы</th>'
	html += '<td style="border-bottom:1px solid;">&nbsp;</td><tr>'
	html += '<tr><td style="border-left:1px solid;border-right:1px solid;border-bottom:1px solid;" colspan=5>'
	html += '<br><table id=tablesost width=100% class=back1>' //#C9F8B7	#A3DE8F
	var nm = 25
	for(i=1;i<8;i++){
		html += '<tr id=tr'+i+' bgcolor=#BFDEB3>'
		var newtr = ''
		for(j=1;j<6;j++){
			var htmltd = ''
			if(i==1 && j==5) {
				htmltd += '<td valign=center height=90 class=back1 align=center>'
				htmltd += '<img height=90 src=/system/img/'
				if(sostavteam)	htmltd += (isNaN(parseInt(localStorage.myteamid)) ? 'g/team.gif' : 'club/'+localStorage.myteamid+'.gif')+'>'
				else 			htmltd += (isNaN(parseInt(localStorage.myintid)) ? 'g/int.gif' : 'flags/full'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'.gif')+'>'
				htmltd += '</td>'				
			} else if (i==1 && j==1){
				htmltd += '<td valign=top height=90 class=back1 align=center>'+ShowHelp()+'</td>'
			} else if (i>5 && j!=3){
				htmltd += '<td valign=top height=90 class=back1></td>'
			} else {
				htmltd += PrintTd(nm)
				nm--
			}
			newtr = htmltd + newtr
		}
		html += newtr + '</tr>'
	}
	html += '</table>'

	nm = 26
	for(i=1;i<=2;i++){
		html += '<table id=tabledopt width=100% class=back1 style="display:none;">'
		html += '<tr id=tr'+(i+25)+' class=back2 align=center>'
		for(j=1;j<=5;j++){
			html += PrintTd(nm)
			nm++
		}
		html += '</tr></table>'
	}
	html += '<div id=divedit style="display:none;"></div>'
	html += '<br></td></tr></table><br><br>'
	$('td.back4').after('<td class=back4 id=sostavplus>'+html+'</td>')
}

function PrintTd(num){
	var newhtml = '<td valign=top width=20% height=90 id=td'+num+'>'
	newhtml += '<table id=htable'+num+' width=100%><tr><td onmousedown="MouseOn(\''+num+'\')">'
	newhtml +=  '<div id=div'+num+'>'
	newhtml += 	 '<span id=span'+num+'>&nbsp;</span>'
	newhtml += 	 '<select hidden id=select'+num+' onchange="FillData(\''+num+'\')" class=back1 style="border:1px solid">'
	newhtml += 	 '</select>'
	newhtml +=  '</div>'
	newhtml += '</td><td id=links'+num+' align=right hidden>'
	newhtml +=  '<a href="javascript:void(showAll(\''+num+'\'))">*</a>'
	newhtml += '</td></tr></table>'
	newhtml += '</td>'
	return newhtml
}

function showAll(nt){
	if($('table#table'+nt+' tr[abbr*=wrong]:first').is(':visible')
		||$('table#table'+nt+' td[abbr*=hidden]:first').is(':visible')) {
			$('table#table'+nt+' tr[abbr*=wrong]').hide()
			$('table#table'+nt+' td[abbr*=hidden]').hide()
	} else{
			$('table#table'+nt+' tr[abbr*=wrong]').show()
			$('table#table'+nt+' td[abbr*=hidden]').show()
	}
}

function MouseOn(num){
//	if($('#select'+num).is(':visible'))
		$('#span'+num).hide()
		$('#links'+num).hide()
		$('#select'+num).show().select()
}
function MouseOff(num){
	if($('#select'+num).val()!=0) {
		$('#span'+num).html('<b>'+$('#select'+num+' option:selected').text()+'</b>')
		$('#links'+num).show()
	} else {
		$('#span'+num).html(positions[0].name)
	}
	$('#select'+num).hide()
	$('#span'+num).show()

}

function ShowHelp(){
	var html = ''
	html += '<table class=back2>'
	html += '<tr><th colspan=4>'+'HELP'.fontsize(1)+'</th></tr>'
	html += '<tr><td bgcolor=#FFFFFF colspan=2>'+'основа'.fontsize(1)+'</td>'
	html += '<td bgcolor=#BABDB6 colspan=2>'+'в заявке'.fontsize(1)+'</td></tr>'
	html += '<tr><td colspan=4><font color=red size=1>не своя позиция</font></td></tr>'
	html += '<tr><td bgcolor='+fl[1]+'></td><td>'+'трв'.fontsize(1)+'</td>'
	html += '<td bgcolor='+fl[2]+'></td><td>'+'дск'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor='+fl[3]+'></td><td>'+'фрм<90'.fontsize(1)+'</td>'
	html += '<td bgcolor='+fl[4]+'></td><td>'+'мрл<80'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor='+fl[5]+'></td><td>'+'шкл'.fontsize(1)+'</td>'
//	html += '<td bgcolor='+fl[6]+'></td><td>'+'чужой'.fontsize(1)+'</td>'
	html += '</tr>'
	html += '</table>'
	return html
}
