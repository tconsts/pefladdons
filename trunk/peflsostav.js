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
var dataall = []
var plkeys = []
var players = []
var pid = []
var stds = {pfre:[],pcor:[],pcap:[],ppen:[]}
var posmaxorder = 0
var getforumid = 9107892
var plskillmax = 15
var tabslist = ''
var maxtables = 25//25+10
var refresh = false
var list = {
	positions: 'id,filter,name,num,koff,order'
}

var fl = ['','#EF2929','#A40000','#FCE94F','#E9B96E','green','black']
var selected = ''

var skillnames = {
sor:{rshort:'срт',rlong:'Сортировка',hidden:true},
sostav:{rshort:'зв',rlong:'Игрок в заявке?'},
flag:{rshort:'фл',rlong:'Информационный флаг'},
pfre:{rshort:'иш',rlong:'Исполнители штрафных'},
pcor:{rshort:'иу',rlong:'Исполнители угловых'},
ppen:{rshort:'пн',rlong:'Исполнители пенальти'},
pcap:{rshort:'кп',rlong:'Капитаны'},
//сс
school:{rshort:'шкл',rlong:'Школьник?'},
srt:{rshort:'сила',rlong:'В % от идеала',type:'float'},
stdat:{rshort:'са',rlong:'Идет на стд. атаки'},
stdbk:{rshort:'со',rlong:'Идет на стд. обороны'},
nation:{rshort:'кСт',rlong:'Код страны'},
natfull:{rshort:'стр',rlong:'Страна',align:'left',nowrap:'1'},
secondname:{rshort:'Фам',rlong:'Фамилия',align:'left',nowrap:'1'},
firstname:{rshort:'Имя',rlong:'Имя',align:'left',nowrap:'1'},
age:{rshort:'взр',rlong:'Возраст',str:true,strmax:40},
id:{rshort:'id',rlong:'id игрока'},
internationalapps:{rshort:'иСб',rlong:'Игр за сборную',str:true,strmax:500},
internationalgoals:{rshort:'гСб',rlong:'Голов за сборную',str:true,strmax:500},
contract:{rshort:'кнт',rlong:'Контракт',str:true,strmax:5},
wage:{rshort:'зрп',rlong:'Зарплата',str:true,strmax:100,strinvert:100100},
value:{rshort:'ном',rlong:'Номинал',type:'value',str:true,strmax:50000000},
corners:{rshort:'уг',rlong:'Угловые',str:true},
crossing:{rshort:'нв',rlong:'Навесы',str:true},
dribbling:{rshort:'др',rlong:'Дриблинг',str:true},
finishing:{rshort:'уд',rlong:'Удары',str:true},
freekicks:{rshort:'шт',rlong:'Штрафные',str:true},
handling:{rshort:'ру',rlong:'Игра руками',str:true},
heading:{rshort:'гл',rlong:'Игра головой',str:true},
leadership:{rshort:'лд',rlong:'Лидерство',str:true},
longshots:{rshort:'ду',rlong:'Дальние удары',str:true},
marking:{rshort:'по',rlong:'Перс. опека',str:true},
pace:{rshort:'ск',rlong:'Скорость',str:true},
passing:{rshort:'пс',rlong:'Игра в пас',str:true},
positioning:{rshort:'вп',rlong:'Выбор позиции',str:true},
reflexes:{rshort:'ре',rlong:'Реакция',str:true},
stamina:{rshort:'вн',rlong:'Выносливость',str:true},
strength:{rshort:'мщ',rlong:'Мощь',str:true},
tackling:{rshort:'от',rlong:'Отбор мяча',str:true},
vision:{rshort:'ви',rlong:'Видение поля',str:true},
workrate:{rshort:'рб',rlong:'Работоспособность',str:true},
technique:{rshort:'тх',rlong:'Техника',str:true},
morale:{rshort:'мрл',rlong:'Мораль',str:true,strmax:100},
form:{rshort:'фрм',rlong:'Форма',str:true,strmax:100},
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
inj:{rshort:'трв',rlong:'Травма',str:true,strmax:0,strinvert:85},
sus:{rshort:'дсв',rlong:'Дисквалификация',str:true,strmax:0,strinvert:40},
syg:{rshort:'сыг',rlong:'Сыгранность',str:true,strmax:20}
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
			dataall[tmpkey] = tmpvalue;

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
			+',16,17,18,19,0'	// доп таблицы 1
			+',20,21,22,23,0'	// доп таблицы 2
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
	var s = 'sor'
    if 		(i[s] < ii[s])	return  1
    else if	(i[s] > ii[s])	return -1
    return  0
}

function GetData(dataname){
	debug(dataname+':GetData')
	refresh = false
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
			{filter:'',		name:'&nbsp;',	num:0,	koff:'data=9107892,idealsk=15,idealage=40,idealval=50000000,idealnat=500,maxt=10'},
/**  1 **/	{filter:'GK', 	name:'GK', 		num:5,	koff:'ре=ре*3,вп=вп*2,гл=гл*2,ру=ру*1.5,!мщ=мщ*0.7,!ск=ск*0.4,фл,Фам,сила,зв'},
/**  2 **/	{filter:'C SW',	name:'C SW',	num:5,	koff:'вп=вп*2,от=от*1.5,гл=гл,ск=ск,!мщ,фл,Фам,сила,зв'},
/**  3 **/	{filter:'L DF',	name:'L DF',	num:5,	koff:'вп=вп*2,от=от*1.5,ск=ск*1.5,нв=нв,фл,Фам,сила,зв'},
/**  4 **/	{filter:'R DF',	name:'R DF',	num:5,	koff:'вп=вп*2,от=от*1.5,ск=ск*1.5,нв=нв,фл,Фам,сила,зв'},
/**  5 **/	{filter:'L DM',	name:'L DM',	num:5,	koff:'от=от*1.5,ск=ск*1.5,ви=ви,нв=нв,фл,Фам,сила,зв'},
/**  6 **/	{filter:'R DM',	name:'R DM',	num:5,	koff:'от=от*1.5,ск=ск*1.5,ви=ви,нв=нв,фл,Фам,сила,зв'},
/**  7 **/	{filter:'C DF',	name:'C DF',	num:5,	koff:'от=от*3,вп=вп*3,мщ=мщ*1.5,ск=ск*1.5,гл=гл*1.5,фл,Фам,сила,зв'},
/**  8 **/	{filter:'C DM',	name:'C DM',	num:5,	koff:'вп=вп*3,от=от*3,ви=ви*2,рб=рб*2,!тх=тх*1.5,!пс=пс*1.5,фл,Фам,сила,зв'},
/**  9 **/	{filter:'C M',	name:'C M',		num:5,	koff:'вп=вп*2,ви=ви*2,пс=пс*2,тх=тх*1.5,!от=от,!ду=ду*0.5,фл,Фам,сила,зв'},
/** 10 **/	{filter:'L M',	name:'L M',		num:5,	koff:'ск=ск*2,др=др*2,пс=пс*2,ви=ви*2,!нв=нв*1.5,!от=от*1.5,!тх=тх,фл,Фам,сила,зв'},
/** 11 **/	{filter:'R M',	name:'R M',		num:5,	koff:'ск=ск*2,др=др*2,пс=пс*2,ви=ви*2,!нв=нв*1.5,!от=от*1.5,!тх=тх,фл,Фам,сила,зв'},
/** 12 **/	{filter:'C AM',	name:'C AM',	num:5,	koff:'вп=вп*2,ви=ви*2,пс=пс*2,тх=тх*2,!ду=ду,!др=др,фл,Фам,сила,зв'},
/** 13 **/	{filter:'L AM',	name:'L AM',	num:5,	koff:'ск=ск*3,др=др*2.5,нв=нв*2,ви=ви*1.5,!пс=пс*1.5,!тх=тх,фл,Фам,сила,зв'},
/** 14 **/	{filter:'R AM',	name:'R AM',	num:5,	koff:'ск=ск*3,др=др*2.5,нв=нв*2,ви=ви*1.5,!пс=пс*1.5,!тх=тх,фл,Фам,сила,зв'},
/** 15 **/	{filter:'C FW',	name:'C FW',	num:5,	koff:'уд=уд*3,вп=вп*2,ск=ск*2,др=др*1.5,!гл=гл*1.5,!мщ=мщ*1.5,фл,Фам,сила,зв'},
/** 16 **/	{filter:'',		name:'Стд. атаки',	num:18,	koff:'зв=зв*200,гл=гл*5,вп=вп,мщ=мщ*0.5,са,сила,фл,Фам,от,ск'},
/** 17 **/	{filter:'',		name:'Стд. обороны',num:18,	koff:'зв=зв*200,гл=гл*5,вп=вп,мщ=мщ*0.5,со,сила,фл,Фам,др,ск'},
/** 18 **/	{filter:'',		name:'Исп. угловых',num:18,	koff:'зв=зв*200,уг=уг*10,нв=нв*2,ви,фл,Фам,иу,сила'},
/** 19 **/	{filter:'',		name:'Исп. штрафных',num:18,koff:'зв=зв*200,шт=шт*10,ду=ду,нв=нв,ви,фл,Фам,иш,сила'},
/** 20 **/	{filter:'',		name:'Исп. пенальти',num:18,koff:'зв=зв*200,взр=взр,уд=уд*0.3,лд=лд*0.3,фл,Фам,пн,сила'},
/** 21 **/	{filter:'',		name:'!Сыгранность',	num:0,	koff:'зв,сыг=сыг,фл,Фам,Поз,!сила'},
/** 22 **/	{filter:'',		name:'!Зарплаты',	num:0,	koff:'зрп=зрп,кнт=-кнт*100,фл,Фам,!сила'},
/** 23 **/	{filter:'',		name:'!Номиналы',	num:0,	koff:'ном=ном,взр,фл,Фам,!сила'}
		]
	}
	//translate all to rshort and fix order
	for(i in data) {
		for(j in skillnames) changeValue(data[i].koff,j,skillnames[j].rshort)
		if(data[i].order == ''|| data[i].order ==undefined) data[i].order = i
		if(posmaxorder<data[i].order) posmaxorder = data[i].order
	}
	switch (dataname){
		case 'positions':  positions = data;break
		default: return false
	}
	getParams()
	fillPosEdit(0)
	PrintAdditionalTables()
	//for(i=1;i<positions.length;i++) countPosition(i)
	FillHeaders()
	if(needsave) SaveData('positions')
}
function getParams(){
	var params = positions[0].koff.split(',')
	for(k in params){
		var pname = params[k].split('=')[0]
		var pvalue = parseInt(params[k].split('=')[1])
		debug('getParams:param='+pname+':value='+pvalue)
		switch (pname){
			case 'data': break;
			case 'idealsk': plskillmax=pvalue; break;
			case 'idealage':skillnames.age.strmax = pvalue;break;
			case 'idealval':skillnames.value.strmax = pvalue;break;
			case 'maxt':	maxtables += pvalue
							for(l=1;l<=maxtables;l++){
								if(selected[l]==undefined) selected[l] = 0
							}
							for(l=selected.length-1;l>0;l--) if(l>maxtables) selected.pop()
							saveDataSelected()
							break;
			case 'idealnat':skillnames.internationalapps.strmax = pvalue;
							skillnames.internationalgoals.strmax = pvalue;break;
			default: debug('getParams:param='+pname+':value='+pvalue+'(Unknown!)')
		}
	}
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
	var sf = countStrength('ideal',ps.koff).split(':')
	ps.strmax = sf[0]
	ps.sormax = sf[1]
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
		var s = (pl.srt!=undefined ? 'srt' : (pl['!srt']!=undefined ? '!srt' : ''))
		if(s!='' && pl[s]!=undefined) {
			var sfp = countStrength(j,ps.koff).split(':')
			pl[s] = (ps.strmax==0 ? 0 : (sfp[0]/ps.strmax)*100)
			pl.sor = (ps.sormax==0 ? 0 : (sfp[1]/ps.sormax)*100)
		}
//		debug('countPosition:'+ps.filter+':'+'/'+ps.strmax+'='+pl.srt+'%:'+players[j].secondname)

		pls.push(pl)
//		if(i==positions.length-1) debug('countPosition:'+pl.id+':sostav='+pl.sostav+':str='+pl.srt)
	}
	positions[posnum].pls = pls.sort(sSrt)
	debug('countPosition:ps.strmax('+posnum+')='+ps.strmax)
}
function checkKoff(kf0){
	var res = kf0.replace(/!/g,'')
	if(skillnames[res]==undefined){
		var custom = true
		for(h in skillnames){
			if(skillnames[h].rshort==res) {
				custom = false
				res = h
			}
		}
		if(custom){
			debug('checkKoff:kf0='+res+'(add custom parametr)')
			skillnames[res] = {}
			skillnames[res].rshort = res
			skillnames[res].rlong = 'Custom параметр'
			skillnames[res].type = 'custom'
		}
	}
//	debug('checkKoff:kf0='+kf0+':res='+res)
	return res
}

function changeValue(formula,name,value){
	//debug('changeValue:formula='+formula+':name='+name+':value='+value)
	if(formula.indexOf(name)!=-1 && name!=''){
		var reg  = new RegExp(name, "g")
		formula = formula.replace(reg,value)
	}
	return formula
}
function tryEval(formula){
	try{
		return eval(formula)
	}catch(e){
		debug('tryEval:error:'+formula+':'+e)
		return 'x'
	}
}

function countStrength(plid,pkoff){
	var pl = (plid=='ideal' ? players[players.length-1] : players[plid])
	//debug('countStrength:plid='+plid+':secondname='+(plid=='ideal' ? 'ideal' : pl.secondname)+':pkoff='+pkoff)
	pkoff = pkoff.split(',')
	var res  = 0
	var res2 = 0
	for(n in pkoff){
		var count = 0		// filter
		var count2 = 0		// strench
		var koff = pkoff[n].split('=')
		var koffname = checkKoff(koff[0])
		if(koff[1]!=undefined){
			count  = koff[1].replace(/\s/g,'')
			count2 = koff[1].replace(/\s/g,'')
			for(p in pl){
				var plp = (isNaN(parseInt(pl[p])) ? 0 : parseInt(pl[p]))
				var skill = (plid=='ideal' ? (skillnames[p]!=undefined && skillnames[p].strmax!=undefined ? skillnames[p].strmax : plskillmax) : plp)
				skill = '('+(skill-(skillnames[p]!=undefined && skillnames[p].strinvert!=undefined ? skillnames[p].strinvert : 0))+')'
				count = changeValue(count,p,skill)
				count = (skillnames[p]!=undefined ? changeValue(count,skillnames[p].rshort,skill) : count)
				if(skillnames[p]!=undefined && !skillnames[p].str) skill = 0
				count2 = changeValue(count2,p,skill)
				count2 = (skillnames[p]!=undefined ? changeValue(count2,skillnames[p].rshort,skill) : count2)
			}
			for(p in skillnames){
				count = changeValue(count,p,0)
				count = changeValue(count,skillnames[p].rshort,0)
				count2 = changeValue(count2,p,0)
				count2 = changeValue(count2,skillnames[p].rshort,0)
			}
			//debug('countStrength:------ count='+count)
			var countval  = tryEval(count)
			var countval2 = tryEval(count2)
			if(countval=='x') {
				debug('countStrength:countval==x, ERROR EXIT!')
				if(plid=='ideal') alert('!!Ошибка подсчета в "'+pkoff[n]+'":('+koff[1]+')')
				return '0:0'
			}
			if(plid!='ideal' && skillnames[koffname].type=='custom') {
				players[plid][koffname] = countval
				debug('countStrength:'+koffname+'='+countval+'(новый параметр игрока '+players[plid].secondname+')')
			}
			res  += countval
			res2 += countval2
			//debug('countStrength:- res='+res+'('+eval(count)+'):koff1='+koff[1])
		}
	}
	//debug('countStrength:- res='+res)
	return res2+':'+res
}

function krPrint(val,sn){
//	debug('krPrint('+val+','+sn+')')
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
	var ns = ($('#select'+nt+' option:selected').length>0 ? $('#select'+nt+' option:selected').val() : 0)
	var np = 0
	for(g in positions)	if(parseInt(positions[g].order) == parseInt(ns)) {
		np = g
		break
	}
	debug('FillData:nt='+nt+':ns='+ns+':np='+np+':length='+$('#select'+nt+' option:selected').length)

	if(np!=0){
		if(positions[np].pls==undefined) {
//			refresh = true
//			debug('FillData:positions['+np+'].pls=undefined (need refresh)')
//			return false
			countPosition(np)
		}
		var selpl = 0
		for(h in pid) if(pid[h].p0 == nt) selpl = pid[h].pid
		var html = '<table id=table'+nt+' width=100% style="border:0px">'
		var head = true
		var nummax = (positions[np].num==0 ? positions[np].pls.length : positions[np].num)
		var numshow = 0
    	for(t=0;t<positions[np].pls.length;t++){
			var pl = positions[np].pls[t]
			var trbgcolor = (selpl==pl.id || (positions[np].filter == '' && pl.sostav==2) ? ' bgcolor=white' : (pl.sostav > 0 ? ' bgcolor=#BABDB6' : ''))
			var plhtml = '<tr align=right'
			if((!pl.posf || numshow>=nummax) && selpl!=pl.id) 	plhtml += ' hidden abbr=wrong'
			else numshow++

			plhtml += trbgcolor+'>'
			var font1 = (!pl.posf ? '<font color=red>' : '')
			var font2 = (!pl.posf ? '</font>' : '')
			if(head) var headhtml = '<tr align=center>'
			for(pp in pl) {
				if(pp=='flag'){
					plhtml += '<td'+(pl[pp]>0 ? ' bgcolor='+fl[pl[pp]] : trbgcolor)+'></td>'
					if(head) headhtml += '<td width=1%></td>'
				}else if(pp!='posf' && pp!='posfempty' && pp!='sostav' && pp!='id' && pp!='sor'){
					var hidden = ''
					var p = pp
					if(pp.indexOf('!')!=-1){
						p = pp.replace(/\!/g,'')
						hidden = ' hidden abbr=hidden'
					}
					var skp = skillnames[p]
					var align = (skp!=undefined && skp.align!=undefined ? ' align='+skp.align : '')
					var nowrap = (skp!=undefined && skp.nowrap!=undefined ? ' nowrap' : '')
					//debug('FillData:'+nt+':'+pp+':'+p)
					plhtml += '<td'+align+hidden+nowrap+'>'+font1
					plhtml += krPrint(pl[pp],p)
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
	if(selected[nt]!=positions[np].order) {
		if(np==0 && nt<=25){
			debug('FillData:np=0 nt='+nt+'(selected ненадо записывать)')
		}else{
			selected[nt] = positions[np].order
			saveDataSelected()
		}
//		debug('FillData('+nt+') -- '+selected[nt]+':selected='+selected.join(','))
	}
	MouseOff(nt)
/**/
}

function getPlayers(){
	var numPlayers = parseInt(dataall['n'])
	debug('numPlayers:'+numPlayers)
	for(i=0;i<numPlayers;i++){
		var pl = {}
		for(j in plkeys) {
			var name = plkeys[j]
			var val = dataall[name+i]
			switch (name){
				case 'contract':
					val = (parseInt(val)==0 ? 21-parseInt(dataall['age'+i]): parseInt(val)); break;
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
		if(dataall['inj'+i]>0) pl.flag = 1
		else if(dataall['sus'+i]>0) pl.flag = 2
		else if(dataall['form'+i]<90) pl.flag = 3
		else if(dataall['morale'+i]<80) pl.flag = 4
		else if(dataall['value'+i]==0) pl.flag = 5

//		debug(pl.secondname+':'+pl.flag)
		players[pl.id] = pl
	}
	// Подгрузить игроков из списка мониторинга если их тут нету еще с флагом "чужой".
}

function FillHeaders(){
	debug('FillHeaders:maxtables='+maxtables)
//	debug('FillHeaders:-- selected='+selected)
	for(i=1;i<=maxtables;i++){
//		if(i<4)	for(j in pid) debug(i+':'+j+':pid='+pid[j].pid+':p0='+pid[j].p0)
        var sel = false
		var selnum = selected[i]
		for(j in pid) if(pid[j].p0 == i) sel = true

		$('#select'+i).empty()
		for(j in positions) {
			var psj = positions[j]
			$('#select'+i).append('<option value='+psj.order+'>'+psj.name+'</option>')
		}
		var name = '&nbsp;'
		$('#span'+i).html(name)
		if(positions[selnum] !=undefined && positions[selnum].name != undefined) {
			name = positions[selnum].name
		}
		if ((sel || i>25) && selnum!=undefined) $('#select'+i+' option:eq('+selnum+')').attr('selected', 'yes')
		if(sel) $('td#td'+i).attr('class','back2')
		FillData(i)
		if(refresh) break
	}
	if(refresh) {
		maxtables = 25
		GetData('positions')
	}
}

function fillPosEdit(num){
	debug('fillPosEdit:num='+num)
	var html = ''
	html += '<table width=100% class=back1><tr valign=top><td width=150>'
	html += '<select id=selpos size=30 class=back2 style="border:1px solid;min-width:100;max-width=150;padding-left:5px" onChange="javascript:void(PosChange())">'
	html += '<option value=0'+(num==0 ? ' selected' :'')+'>--- Создать ---</option>'
	for(i=1;i<positions.length;i++)	html += '<option value='+i+(num==i ? ' selected' :'')+'>'+(i==0 ? '--- Создать ---' : positions[i].name)+'</option>'
	html += '</select></td>'
	html += '<td><table width=100%>'
	html += '<tr><th colspan=2 class=back2>Коэффициент</th></tr>'
	html += '<tr><th width=10% align=right>Название:</th><td><input class=back1 style="border:1px solid;" id=iname name="name" type="text" size="40" value="'+(num!=undefined && num!=0 ? positions[num].name :'')+'"></td></tr>'
	html += '<tr><th align=right>Кол-во:</th><td><input class=back1 style="border:1px solid;" id=inum name="num" type="text" size="3" value="'+(num!=undefined && num!=0 && positions[num].num!=undefined ? positions[num].num :'')+'"> Сколько max отображать(0=все)</td></tr>'
	html += '<tr><th align=right>Фильтр:</th><td><input class=back1 style="border:1px solid;" id=ifilter name="filter" type="text" size="10" value="'+(num!=undefined && num!=0  ? positions[num].filter :'')+'"> "LC DF/DM"(пусто=все)</td></tr>'
	html += '<tr><td colspan=2><textarea class=back1 style="border:1px solid;" id=ikoff name="koff" cols="50" rows="5">'+(num!=undefined && num!=0  ? positions[num].koff :'')+'</textarea></td></tr>'
	html += '<tr><th colspan=2>&nbsp;</th></tr>'
	html += '</table><br><table>'
	html += '<tr><th height=20 width=100 class=back2 onmousedown="javascript:void(PosSave())" onMouseOver="this.style.cursor=\'pointer\'" style="border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Сохранить</th><td></td></tr>'
//	html += '<tr><th height=20 class=back2 onmousedown="javascript:void(PosDel())" onMouseOver="this.style.cursor=\'pointer\'" style="border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Удалить</th><td></td></tr>'
	html += '</table></td>'
	html += '<td><table width=100% align=top>'
	html += '<tr><td>!</td><td colspan=2>значит по дефоулту поле не отображать</td></tr>'
	html += '<tr><td>=</td><td colspan=2>эти скилы учавствуют в подсчете силы</td></tr>'
	for(m in skillnames) if(!skillnames[m].hidden) html += '<tr><td>'+skillnames[m].rshort+'</td><td>'+m+'</td><td>'+skillnames[m].rlong+'</td></tr>'
	html += '</table></td></tr>'
	html += '</table>'
	$('div#divkoff').html(html)

	html = '<table width=100% class=back1><tr valign=top>'
	html += '<td width=50%><table width=100%>'
	html += '<tr><th colspan=2 class=back2>Основные</th></tr>'
	html += '<tr><th width=15% align=right nowrap>С форума:</th><td><input class=back1 style="border:1px solid;" id=iforum name="iforum" type="text" size="10" value="'+getforumid+'"></td></tr>'
	html += '<tr><th width=15% align=right>Таблиц:</th><td><input class=back1 style="border:1px solid;" id=itables name="itables" type="text" size="10" value="'+(maxtables-25)+'"> (Кол-во доп. таблиц)</td></tr>'
	html += '<tr><th colspan=2>&nbsp;</th></tr>'
	html += '</table></td>'
	html += '<td width=50%><table width=100%>'
	html += '<tr><th colspan=2 class=back2>Идеальный игрок</th></tr>'
	html += '<tr><th width=15% align=right>Скиллы:</th><td><input class=back1 style="border:1px solid;" id=iskills name="iskills" type="text" size="10" value="'+plskillmax+'"></td></tr>'
	html += '<tr><th width=15% align=right>Номинал:</th><td><input class=back1 style="border:1px solid;" id=inominal name="inominal" type="text" size="10" value="'+skillnames.value.strmax+'"></td></tr>'
	html += '<tr><th width=15% align=right>Возраст:</th><td><input class=back1 style="border:1px solid;" id=iage name="iage" type="text" size="10" value="'+skillnames.age.strmax+'"></td></tr>'
	html += '<tr><th width=15% align=right>Сборная:</th><td><input class=back1 style="border:1px solid;" id=inational name="inational" type="text" size="10" value="'+skillnames.internationalapps.strmax+'"> (Игр и голов)</td></tr>'
	html += '<tr><th colspan=2>&nbsp;</th></tr>'
	html += '</table></td><tr>'
	html += '<tr><td clospan=2><table>'
	html += '<tr><th height=20 width=100 class=back2 onmousedown="javascript:void(PosSaveAll())" onMouseOver="this.style.cursor=\'pointer\'" style="border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Сохранить</th><td></td></tr>'
	html += '</table></td><tr>'
	html += '</table>'
	$('div#divedit').html(html)

}

function PosChange(){
	var selnum = $('#selpos option:selected').val()
	debug('PosChange():'+selnum)
	fillPosEdit(selnum)
}
function PosDel(){
	var selnum = $('#selpos option:selected').val()
	debug('PosDel:'+selnum)
	if(selnum==0) {debug('PosDel:cancel');return false}
	positions.splice(selnum,1)
	SaveData('positions')
	chMenu('tdsost')
	maxtables = 25
	GetData('positions')
}

function PosDrop(){
	delete localStorage.positions
	maxtables = 25
	chMenu('tdsost')
	GetData('positions')
}
function PosSaveAll(){
	var pr = {
		iforum: ($('#iforum').val() == '' ? getforumid : $('#iforum').val()),
		itables: ($('#itables').val() == '' ? 0 : $('#itables').val()),
		iskills: ($('#iskills').val() == '' ? 15 : $('#iskills').val()),
		inominal: ($('#inominal').val() == '' ? 50000000 : $('#inominal').val()),
		iage: ($('#iage').val() == '' ? 40 : $('#iage').val()),
		inational: ($('#inational').val() == '' ? 500 : $('#inational').val()),
	}
	if(pr.itables>30) pr.itables = 30
	for(g in pr) debug('PosSave:g='+g+':pr[g]='+pr[g])

	if(pr.iforum!=parseInt(pr.iforum) ||
		pr.itables!=parseInt(pr.itables) ||
		pr.iskills!=parseInt(pr.iskills) ||
		pr.inominal!=parseInt(pr.inominal) ||
		pr.iage!=parseInt(pr.iage) ||
		pr.inational!=parseInt(pr.inational)){
			debug('PosSave:pr wrong!')
			alert('Неправильно введены параметры!')
			return false
	}
	positions[0].koff = 'data='+pr.iforum+',idealsk='+pr.iskills+',idealage='+pr.iage+',idealval='+pr.inominal+',idealnat='+pr.inational+',maxt='+pr.itables
	SaveData('positions')
	maxtables = 25
	chMenu('tdsost')
	GetData('positions')
}

function PosSave(){
	var num = $('#selpos option:selected').val()
	if(num==0) num = positions.length
	debug('PosSave:num='+num)
	var ps = {
		name: 	$('#iname').val(),
		num: 	($('#inum').val() == '' ? 0 : $('#inum').val()),
		filter: $('#ifilter').val(),
		koff: 	$('#ikoff').val(),
		order:	posmaxorder+1
	}
	// провалидировать поля и обновить
	if(ps.num!=parseInt(ps.num) ||
		ps.name == '' ||
		ps.koff == ''){
			alert('Неправильно введены параметры!')
			return false
	}
	positions[num] = ps
	fillPosEdit(num)
	countPosition(num)
	chMenu('tdsost')
	SaveData('positions')
	FillHeaders()
}

function chMenu(mid){
	debug('chMenu('+mid+')')
	switch (mid){
		case 'tdedit':
			$('th#tdsost,th#tddopt,th#tdkoff').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tdedit').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tablesost, table#tabledopt, div#divkoff').hide()
			$('div#divedit').show()
			break;
		case 'tdkoff':
			$('th#tdsost,th#tddopt,th#tdedit').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tdkoff').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tablesost, table#tabledopt, div#divedit').hide()
			$('div#divkoff').show()
			break;
		case 'tddopt':
			$('th#tdsost,th#tdedit,th#tdkoff').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tddopt').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tablesost, div#divedit, div#divkoff').hide()
			$('table#tabledopt').show()
			break;
		default:
			$('th#tdedit,th#tddopt,th#tdkoff').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tdsost').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tabledopt, div#divedit, div#divkoff').hide()
			$('table#tablesost').show()
	}
}
function close(){
	$('td#sostavplus').hide()
	$('td.back3:first').show()
	$('td.back4:first').show()
}

function krOpen(){
	$('td#sostavplus').show()
	$('td.back3:first').hide()
	$('td.back4:first').hide()
	if(sostavteam) $('a#sostav').attr('href','javascript:void(krOpen())')
	else $('a#sostav_n').attr('href','javascript:void(krOpen())')
}

function PrintTables(geturl) {
	debug('PrintTables()')
	krOpen()

	var html = '<div align=right><a href="javascript:void(close())">закрыть</a>&nbsp;</div>'
	html += '<div align=right><a href="javascript:void(PosDrop())" >сбросить кофы</a>&nbsp;</div>'
	html += '<table align=center id=tmenu width=98% class=back1 style="border-spacing:1px 0px" cellpadding=5><tr height=25>'
	html += '<td width=5 style="border-bottom:1px solid">&nbsp;</td>'
	html += '<th id=tdsost width=130 onmousedown="javascript:void(chMenu(\'tdsost\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border-top:1px solid;border-left:1px solid;border-right:1px solid" onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back1\'">Состав+</th>'
	html += '<th id=tddopt width=130 onmousedown="javascript:void(chMenu(\'tddopt\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border:1px solid;" class=back2 onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back2\'">Доп. таблицы</th>'
	html += '<th id=tdkoff width=130 onmousedown="javascript:void(chMenu(\'tdkoff\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border:1px solid;" class=back2 onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back2\'">Коэфициенты</th>'
	html += '<th id=tdedit width=130 onmousedown="javascript:void(chMenu(\'tdedit\'))" style="border-top-left-radius:7px;border-top-right-radius:7px;border:1px solid;" class=back2 onMouseOver="this.className=\'back1\';this.style.cursor=\'pointer\'" onMouseOut="this.className=\'back2\'">Настройки</th>'
	html += '<td style="border-bottom:1px solid;">&nbsp;</td><tr>'
	html += '<tr><td style="border-left:1px solid;border-right:1px solid;border-bottom:1px solid;" colspan=6>'
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
	html += '<table id=tabledopt width=100% class=back1 style="display:none;"></table>'
	html += '<div id=divkoff style="display:none;"></div>'
	html += '<div id=divedit style="display:none;"></div>'
	html += '<br></td></tr></table><br><br>'
	$('td.back4').after('<td class=back4 id=sostavplus>'+html+'</td>')
}
function PrintAdditionalTables(){
	var html = '<tr><td>'
	html += '<table witdh=100% bgcolor=black><tr class=back2 align=center>'
	for(i=26;i<=maxtables;i++){
		debug('PrintAdditionalTables:i='+i+':i%5='+(i%5)+':mt='+maxtables)
		html += PrintTd(i)
		if(i%5==0 && i!=25 && i!=(maxtables)) html += '</tr></table><br><table witdh=100% bgcolor=black><tr class=back2 align=center>'
	}
	html += '</tr></table>'
	html += '</td></tr>'
	$('table#tabledopt').html(html)
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
