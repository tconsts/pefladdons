// ==UserScript==
// @name           peflsostav
// @namespace      pefl
// @description    Display sostav
// @include        http://*pefl.*/*?sostav
// @include        http://*pefl.*/*?sostav_n
// @encoding	   windows-1251
// ==/UserScript==

var ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false);
var sostavteam = (location.search.substring(1) == 'sostav' ? true : false);
var psn = ['','GK','C SW',
	'L DF','C DF','C DF','C DF','R DF',
	'L DM','C DM','C DM','C DM','R DM',
	'L MF','C MF','C MF','C MF','R MF',
	'L AM','C AM','C AM','C AM','R AM',
	'C FW','C FW','C FW'];
var psnbetter = [[{},{}],[{},{}],[{},{}],
	[{},{}],[{},{}],[{},{}],[{},{}],[{},{}],
	[{},{}],[{},{}],[{},{}],[{},{}],[{},{}],
	[{},{}],[{},{}],[{},{}],[{},{}],[{},{}],
	[{},{}],[{},{}],[{},{}],[{},{}],[{},{}],
	[{},{}],[{},{}],[{},{}]];
positions = [];
var dataall = [];
var plkeys = [];
var players = {};
var posmaxorder = 0;
var getforumid = 9107892;
var plskillmax = 15;
var tabslist = '';
var maxtables = 25;//25+10
var showscout = true;//localStorage.peflplayer!=undefined ? true : false;
var refresh = false;
var jsonSostav = [];
var tacNum = 1;
var postbackupUrl = '';
var delbackupUrl = '';
var senddata = '';
var postBackupLimit = 1950;
var list = {
	positions: 'id,filter,name,num,koff,order'
}

var fl = ['','#EF2929','#A40000','#FCE94F','#E9B96E','green','black']
var selected = ''

var skillnames = {
	sor:{rshort:'срт',rlong:'Сортировка',hidden:true},
	sostav:{rshort:'зв',rlong:'Игрок в заявке?'},
	flag:{rshort:'фл',rlong:'Информационный флаг'},
	fre:{rshort:'иш',rlong:'Исполнители штрафных ударов',str:true},
	frh:{rshort:'ин',rlong:'Исполнители штрафных навесов',str:true,state:3},
	cor:{rshort:'иу',rlong:'Исполнители угловых',str:true},
	pen:{rshort:'пн',rlong:'Исполнители пенальти',str:true},
	cap:{rshort:'кп',rlong:'Капитаны',str:true},
	school:{rshort:'шкл',rlong:'Школьник?'},
	srt:{rshort:'сила',rlong:'В % от идеала',type:'float'},
	stdat:{rshort:'са',rlong:'Идет на стд. атаки'},
	stdbk:{rshort:'со',rlong:'Идет на стд. обороны'},
	nation:{rshort:'кСт',rlong:'Код страны'},
	natflag:{rshort:'фс',rlong:'Флаг страны',type:'flag',state:3},
	sname:{rshort:'Фам',rlong:'Фамилия',align:'left',nowrap:'1'},
	fname:{rshort:'Имя',rlong:'Имя',align:'left',nowrap:'1'},
	age:{rshort:'взр',rlong:'Возраст',str:true,strmax:40},
	id:{rshort:'id',rlong:'id игрока'},
	value:{rshort:'ном',rlong:'Номинал',type:'value',str:true,strmax:50000000},
	morale:{rshort:'мрл',rlong:'Мораль',str:true,strmax:100},
	form:{rshort:'фрм',rlong:'Форма',str:true,strmax:100},
	inj:{rshort:'трв',rlong:'Травма',str:true,strmax:0,strinvert:85},
	sus:{rshort:'дсв',rlong:'Дисквалификация',str:true,strmax:0,strinvert:40},
	syg:{rshort:'сыг',rlong:'Сыгранность',str:true,strmax:20},
	miss:{rshort:'пп',rlong:'Пропустил матчей',str:true,state:3},
	position:{rshort:'Поз',rlong:'Позиция',align:'left',nowrap:'1'},
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
 //depricated
	natfull:{rshort:'стр',rlong:'Страна',align:'left',nowrap:'1',state:2},
	internationalapps:{rshort:'иСб',rlong:'Игр за сборную',str:true,strmax:500, state:2},
	internationalgoals:{rshort:'гСб',rlong:'Голов за сборную',str:true,strmax:500, state:2},
	contract:{rshort:'кнт',rlong:'Контракт',str:true,strmax:5, state:2},					
	wage:{rshort:'зрп',rlong:'Зарплата',str:true,strmax:100,strinvert:100100, state:2},
}

$().ready(function() {

	selected = getDataSelected().split(',');
	console.log(selected);

	var strg = sostavteam ? localStorage['sostavurl'+localStorage.myteamid] : localStorage['sostavurl'+(60000+parseInt(localStorage.myintid))];
	if(strg != undefined) {
		var geturl2 = (strg.indexOf('?')>0 ? '' : 'jsonsostav3.php?') + strg;
		PrintTables();
		$.get(geturl2, {}, function(datatext2) {
			jsonSostav = JSON.parse(datatext2);
			getPlayers();
			GetData('positions');
		});
	}
})

function getPlayers() {
	if (jsonSostav==undefined || jsonSostav.players == undefined) {console.error('none players');return;}
	// Подгрузить игроков из списка мониторинга если их тут нету еще с флагом "чужой".
	if(showscout){
		var text1 = String(localStorage.peflplayer);
		var pl2 = [];
		if (text1 != 'undefined') {
			var pl = text1.split(',');
			for (i in pl) {
				var key = pl[i].split('=');
				var pn = (key[0].split('_')[1] == undefined ? 2 : key[0].split('_')[1]);
				if(pl2[pn]==undefined) pl2[pn] = {};
				pl2[pn][key[0].split('_')[0]] = [key[1]];
			}
		}
		for (k in pl2) if (pl2[k].id!=undefined) {
			var pl2id = 'p'+pl2[k].id;
			if(players[pl2id]==undefined) {
				var pl = pl2[k];
				pl.fname = pl2[k].firstname;
				pl.sname = pl2[k].secondname;
				pl.flag = 6;
				pl.syg = 0;
				pl.sostav = 0;
				pl.stdA = [false,false,false,false,false,false];
				pl.stdD = [false,false,false,false,false,false];
				//players[pl2id].natflag = '<img src="system/img/flags/mod/'+players[pl2id].nation+'.gif" width="15">';
				pl.natflag = pl.nation;
				players[pl2id] = pl;
			}
		}
	}
	//обрабатываем игроков
	for(y in jsonSostav.players) {
		var pl = jsonSostav.players[y];
		pl.form = parseInt(pl.form,10);
		pl.morale = parseInt(pl.morale,10);
		pl.value = parseInt(pl.value,10)*1000;
		pl.syg = parseInt(pl.syg,10);
		pl.propustil = parseInt(pl.propustil,10);
		pl.nation = parseInt(pl.nation,10);
		pl.age = parseInt(pl.age,10);
		pl.clubcontracted = parseInt(pl.clubcontracted,10);
		pl.stdA = [false,false,false,false,false,false];
		pl.stdD = [false,false,false,false,false,false];
		if(isNaN(pl.value)) pl.value = 0;
		//pl.natflag = '<img src="system/img/flags/mod/'+pl.nation+'.gif" width="15">';
		pl.natflag = pl.nation;
		pl.sostav = 0;

		pl.flag = 0;
		if(pl.inj > 0) pl.flag = 1;
		else if(pl.sus > 0) pl.flag = 2;
		else if(pl.form < 90) pl.flag = 3;
		else if(pl.morale < 80) pl.flag = 4;
		else if(pl.value == 0) pl.flag = 5;

		players['p'+pl.id] = pl;
	}

	//оцениваем кто в составе
	for(k in jsonSostav.sostav) if(k>0) {
		var plsid = 'p'+jsonSostav.sostav[k];
		if (players[plsid]==undefined) createFakePlayer(jsonSostav.sostav[k]);
		players[plsid]['sostav'] = (k<12 ? 2 : 1);
	}

	//собираем ходящих стандарты
	for(l=1;l<=5;l++){
		for(m=1;m<=11;m++) {
			if(jsonSostav['sostav'+l] != undefined && jsonSostav['sostav'+l][m] != undefined){
				var tn = jsonSostav['sostav'+l][m];
				var plstdid = 'p'+jsonSostav.sostav[m];
				if (players[plstdid]==undefined) createFakePlayer(jsonSostav.sostav[m]);
				if (tn.stda == 1) players[plstdid]['stdA'][l] = true;
				if (tn.stdo == 1) players[plstdid]['stdD'][l] = true;
			}
		}
	}

	//стандартчики
	for (g=1; g<=10; g++) {
		if (g <= 5) {
			if (players['p'+jsonSostav.cap[g]] != undefined) players['p'+jsonSostav.cap[g]].cap = g;
			if (players['p'+jsonSostav.cor[g]] != undefined) players['p'+jsonSostav.cor[g]].cor = g;
			if (players['p'+jsonSostav.fre[g]] != undefined) players['p'+jsonSostav.fre[g]].fre = g;
			if (players['p'+jsonSostav.frh[g]] != undefined) players['p'+jsonSostav.frh[g]].frh = g;
		}
		if (players['p'+jsonSostav.pen[g]] != undefined) players['p'+jsonSostav.pen[g]].pen = g;
	}
	//определяем годность позиции
	for (j in players) {
		players[j].psn = [];
		var plposition = String(players[j].position);		
		if (~plposition.indexOf('AM') || ~plposition.indexOf('DM')) plposition+='/MF';
		if ((~plposition.indexOf('L') || ~plposition.indexOf('R')) && ~plposition.indexOf('FW')) plposition+='/AM';
		for (c in psn) {
			if (c > 0) players[j].psn[c] = filterPosition(psn[c], plposition);
		}
	}
}

function getDataSelected(){
	var dataname = (sostavteam ? 'selected' : 'selectedn')
	var datavalue = String(localStorage[dataname])

	if(datavalue == 'undefined'){
		datavalue = ''
			+',0,0'			// линия Gk & SW
			+',0,0,0,0,0'	// линия DF
			+',0,0,0,0,0'	// линия DM
			+',0,0,0,0,0'	// линия MF
			+',0,0,0,0,0'	// линия AM
			+',0,0,0'		// линия FW
			+',27,28,29,0,0'	// доп таблицы 1
			+',30,31,0,0,0'	// доп таблицы 2
	}
	return datavalue
}
function createFakePlayer(id) {
	var xpl = {
		id: id,
		fname: '',
		sname: 'Игрок-'+id,
		flag: 6,
		syg: 0,
		stdA: [false,false,false,false,false,false],
		stdD: [false,false,false,false,false,false],
		natflag: 0
	}
	players['p'+id] = xpl
}

function saveDataSelected(){
	var dataname = (sostavteam ? 'selected' : 'selectedn')
	var datavalue = selected.join(',')	

	localStorage[dataname] = datavalue
}


function sSrt(i, ii) { // по убыванию
	var s = 'sor'
    if 		(i[s] < ii[s])	return  1
    else if	(i[s] > ii[s])	return -1
    return  0
}

function GetData(dataname){
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
			{filter:'',			name:'&nbsp;',		num:0, koff:'idealsk=15,idealage=40,idealval=50000000,maxt=10'},
/**  1 **/	{filter:'GK', 		name:'Вратарь',		num:5, koff:'ре=ре*3,вп=вп*2,гл=гл*2,ру=ру*2,!мщ=мщ,фл,Фам,сила,зв'},
/**  2 **/	{filter:'GK', 		name:'Либеро',		num:5, koff:'ре=ре*3,вп=вп*2,гл=гл*2,ру=ру*2,ск=ск,!мщ=мщ,!ви=ви,!пс=пс,!тх=тх,фл,Фам,сила,зв'},
/**  3 **/	{filter:'C SW',		name:'Либеро',		num:5, koff:'вп=вп*2,от=от*1.5,гл=гл,мщ=мщ,ск=ск,фл,Фам,сила,зв'},
/**  4 **/	{filter:'C SW/DF',	name:'Диспетчер',	num:5, koff:'вп=вп*2,от=от*1.5,гл=гл,!мщ=мщ,ск=ск,ви=ви,пс=пс,!нв=нв,!тх=тх,фл,Фам,сила,зв'},
/**  5 **/	{filter:'LR DF',	name:'Крайний',		num:5, koff:'от=от*3,вп=вп*2,ск=ск*3,нв=нв,фл,Фам,сила,зв'},
/**  6 **/	{filter:'LR DF',	name:'Атакующий',	num:5, koff:'от=от*3,вп=вп*2,ск=ск*3,нв=нв,др=др,!уд=уд,!тх=тх,фл,Фам,сила,зв'},
/**  7 **/	{filter:'LR DF/DM/MF',name:'Латераль',	num:5, koff:'ск=ск*3,рб=рб*2,вн=вн*3,от=от*2,др=др,!нв=нв,!тх=тх,фл,Фам,сила,зв'},
/**  8 **/	{filter:'LCR DF/DM,C MF',name:'Персональщик',num:5, koff:'по=по*5,от=от*3,вп=вп*3,ск=ск*3,фл,Фам,сила,зв'},
/**  9 **/	{filter:'C DF',		name:'Центральный',	num:5,	koff:'от=от*4,гл=гл*3,вп=вп*2,мщ=мщ*2,ск=ск*2,фл,Фам,сила,зв'},
/** 10 **/	{filter:'C DF',		name:'Ведущий',		num:5,	koff:'от=от*4,гл=гл*3,вп=вп*2,мщ=мщ*2,ск=ск*2,вд=вд,!лд=лд,!взр=взр,фл,Фам,сила,зв'},
/** 11 **/	{filter:'LR DM/MF',	name:'Оборонительный',num:5,koff:'от=от*3,ск=ск*3,нв=нв,тх=тх,фл,Фам,сила,зв'},
/** 12 **/	{filter:'LR DM/MF',	name:'Крайний',		num:5,	koff:'ск=ск*1.5,от=от*1.5,др=др,нв=нв,пс=пс,!тх=тх,фл,Фам,сила,зв'},
/** 13 **/	{filter:'C DM/MF',	name:'Оборонительный',num:5,koff:'рб=рб*2,от=от*3,пс=пс*2,вп=вп*3,гл=гл*2,фл,Фам,сила,зв'},
/** 14 **/	{filter:'C DM/MF/AM',name:'Диспетчер',	num:5,	koff:'ви=ви*4,пс=пс*4,др=др*2,тх=тх*2,от=от,!ду=ду,фл,Фам,сила,зв'},
/** 15 **/	{filter:'C DM/MF',	name:'Бокс-ту-Бокс',num:5,	koff:'вн=вн*2,рб=рб*2,от=от*3,пс=пс*2,ск=ск,!ду=ду,фл,Фам,сила,зв'},
/** 16 **/	{filter:'LR MF/AM',	name:'Атакующий',	num:5,	koff:'ск=ск*2,др=др*2,пс=пс*2,нв=нв*1.5,!тх=тх,фл,Фам,сила,зв'},
/** 17 **/	{filter:'LR MF/AM',	name:'Инсайд',		num:5,	koff:'др=др*2,пс=пс*2,ви=ви*2,ду=ду*1.5,!уд=уд,!ск=ск,фл,Фам,сила,зв'},
/** 18 **/	{filter:'C MF',		name:'Центральный',	num:5,	koff:'пс=пс*3,ви=ви*3,тх=тх*2,ду=ду,фл,Фам,сила,зв'},
/** 19 **/	{filter:'C MF/AM',	name:'Атакующий',	num:5,	koff:'пс=пс*3,ви=ви*3,др=др*2,тх=тх*2,ду=ду,уд=уд,фл,Фам,сила,зв'},
/** 20 **/	{filter:'LCR AM/FW,C MF',name:'Художник',	num:5,	koff:'ск=ск*3,др=др*3,тх=тх*2,ви=ви*3,уд=уд,ду=ду,фл,Фам,сила,зв'},
/** 21 **/	{filter:'LR AM',	name:'Вингер',		num:5,	koff:'ск=ск*3,др=др*3,уд=уд*2,тх=тх*2,фл,Фам,сила,зв'},
/** 22 **/	{filter:'C AM/FW',	name:'Оттянутый нап',num:5,	koff:'уд=уд*3,др=др*3,пс=пс*2,тх=тх*2,!ду=ду,!ви=ви,фл,Фам,сила,зв'},
/** 23 **/	{filter:'C FW',		name:'Нападающий',	num:5,	koff:'уд=уд*3,др=др*3,вп=вп*3,ск=ск*2,гл=гл*2,тх=тх,фл,Фам,сила,зв'},
/** 24 **/	{filter:'C FW',		name:'Столб',		num:5,	koff:'гл=гл*5,мщ=мщ*3,вп=вп*2,пс=пс,уд=уд*2,фл,Фам,сила,зв'},
/** 25 **/	{filter:'C FW',		name:'На грани',	num:5,	koff:'вп=вп*5,ск=ск*3,уд=уд*2,тх=тх,фл,Фам,сила,зв'},
/** 26 **/	{filter:'C FW',		name:'Наконечник',	num:5,	koff:'уд=уд*5,гл=гл*2,ск=ск*2,вп=вп*2,ду=ду,фл,Фам,сила,зв'},
/** 27 **/	{filter:'',		name:'Стандарты',		num:18,	koff:'зв=зв*200,гл=гл*5,вп=вп,мщ=мщ*0.5,са,со,иш,ин,иу,фл,Фам,сила,от,ск,др'},
/** 28 **/	{filter:'',		name:'Исп. угловых',	num:18,	koff:'зв=зв*200,уг=уг*10,нв=нв*2,ви=ви,фл,Фам,иу,сила,гл,вп,мщ'},
/** 29 **/	{filter:'',		name:'Исп. штрафных',	num:18,koff:'зв=зв*200,шт=шт*10,ду=ду,нв=нв,ви=ви,фл,Фам,иш,ин,сила,гл,вп,мщ'},
/** 30 **/	{filter:'',		name:'!Сыгранность',	num:0,	koff:'зв,сыг=сыг,фл,Фам,Поз,!сила,трв,дсв'},
/** 31 **/	{filter:'',		name:'!Номиналы',		num:0,	koff:'ном=ном,взр=взр,фл,фс,Имя,Фам,!сила'}
		]
	}
	//translate all to rshort and fix order
	var fixorder = ':'
	for(i in data) {
		for(j in skillnames) changeValue(data[i].koff,j,skillnames[j].rshort)
		if(data[i].order == ''|| data[i].order ==undefined) data[i].order = i
		if(fixorder.indexOf(':'+data[i].order+':') !=-1) {
			data[i].order = posmaxorder + 1
		}
		fixorder += data[i].order+':'
		if(posmaxorder<parseInt(data[i].order)) {
			posmaxorder = parseInt(data[i].order)
		}

	}
	switch (dataname){
		case 'positions':  positions = data;break
		default: return false
	}
	getParams();
	fillPosEdit(0);
	PrintAdditionalTables();
	for (f in positions){
		countPosition(f);
	}
	FillHeaders();
	if(needsave) SaveData('positions');
}
function getParams(){
	var params = positions[0].koff.split(',')
	for(k in params){
		var pname = params[k].split('=')[0]
		var pvalue = parseInt(params[k].split('=')[1],10)
		switch (pname){
			case 'data': break;
			case 'idealsk': plskillmax=pvalue; break;
			case 'idealage':skillnames.age.strmax = pvalue;break;
			case 'idealval':skillnames.value.strmax = pvalue;break;
			case 'maxt':	maxtables += pvalue;
							for(l=1;l<=maxtables;l++){
								if(selected[l]==undefined) selected[l] = 0
							}
							for(l=selected.length-1;l>0;l--) if(l>maxtables) selected.pop()
							saveDataSelected()
							break;
			case 'idealnat':skillnames.internationalapps.strmax = pvalue;
							skillnames.internationalgoals.strmax = pvalue;break;
			default:
		}
	}
}

function SaveData(dataname){
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

//проверяем что plpos входит в fl
function filterPosition(plpos,fl) {
	if (fl=='') return true;
	var flpos = fl.split(',');
	for(v in flpos) {		
		var pos = flpos[v].split(' ');
		var	pos0 = false;
		var pos1 = false;
		if(pos[1]==undefined) {
			pos1 = true
			if(plpos.indexOf(pos[0]) != -1) pos0 = true;
		} else {
			for(k=0;k<3;k++) if(plpos.indexOf(pos[0][k]) != -1) pos0 = true;
			pos1arr = pos[1].split('/')
			for(k in pos1arr) if((plpos.indexOf(pos1arr[k]) != -1)) pos1 = true;
		}
		//if (flpos.length>1) console.log('filterPosition "' +plpos+ '" in "'+fl+'"('+flpos[v]+') = '+pos0 +':'+ pos1);
		if (pos0 && pos1) return true;
	}
	return false;
}

//обсчитываем конкретную позицию и записываем игроков
function countPosition(posnum,ppsn) 
{
	if (ppsn == undefined) ppsn = 0;
	var ps = positions[posnum];	
	var sf = countStrength('ideal',ps.koff).split(':');
	ps.strmax = sf[0];
	ps.sormax = sf[1];
	var pls = [];
	for(j in players) {
		//if (posnum==15) console.log('countPosition='+posnum+' pl='+j);
		var pl = {};
		//if(j==0) pl.id0 = true;
		pl.id = players[j].id;
		pl.psn = players[j].psn;

		if(posnum==5) console.log(posnum, ppsn, j, players[j].position, pl.psn[ppsn]);

		if (pl.id==undefined) break;

		if ((ppsn<=25 && ppsn>0 && !pl.psn[ppsn])) continue;
		
		var pkoff = ps.koff.split(',');
		for(h in pkoff){
			var koff = String(pkoff[h].split('=')[0]);
			if(skillnames[koff]==undefined) for(l in skillnames) if(skillnames[l].rshort==koff.replace(/\!/g,'')) koff=koff.replace(skillnames[l].rshort,l);
			pl[koff] = (players[j][koff.replace(/\!/g,'')]==undefined ? 0 : players[j][koff.replace(/\!/g,'')]);
		}
		//if (posnum==15) console.log('countPosition for pl'+j+' pos="'+players[j].position+'" in filter "'+ps.filter+'"');
		/*
		var plposition = String(players[j].position);
		pl.psn = [];
		if (~plposition.indexOf('AM') || ~plposition.indexOf('DM')) plposition+='/MF';
		if ((~plposition.indexOf('L') || ~plposition.indexOf('R')) && ~plposition.indexOf('FW')) plposition+='/AM';
		for(c in psn) {
			if(c>0) pl.psn[c] = filterPosition(psn[c], plposition);
		}
		*/
		var s = (pl.srt!=undefined ? 'srt' : (pl['!srt']!=undefined ? '!srt' : ''));
		if(s!='' && pl[s]!=undefined) {
			var sfp = countStrength(j,ps.koff).split(':');
			pl[s] = (ps.strmax==0 ? 0 : (sfp[0]/ps.strmax)*100);
			pl.sor = (ps.sormax==0 ? 0 : (sfp[1]/ps.sormax)*100);
		}
		pls.push(pl);
	}
	positions[posnum].pls = pls.sort(sSrt);
	//if (positions[posnum].pls[0].srt!=undefined) positions[posnum].maxsrt = positions[posnum].pls[0].srt;
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
			skillnames[res] = {}
			skillnames[res].rshort = res
			skillnames[res].rlong = 'Custom параметр'
			skillnames[res].type = 'custom'
		}
	}
	return res
}

function changeValue(formula,name,value){
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
		return 'x'
	}
}
//подсчет игрока по кофу
function countStrength(plid,pkoff)
{
	var pl;
	if (plid=='ideal'){
		var keys = Object.keys(players);
		for (s=1; s<2; s++) {pl = players[keys[s]];break;}
	} else {
		pl = players[plid];
	}
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
			var countval  = tryEval(count)
			var countval2 = tryEval(count2)
			if(countval=='x') {
				if(plid=='ideal') alert('!!Ошибка подсчета в "'+pkoff[n]+'":('+koff[1]+')')
				return '0:0'
			}
			if(plid!='ideal' && skillnames[koffname].type=='custom') {
				players[plid][koffname] = countval
			}
			res  += countval
			res2 += countval2
		}
	}
	return res2+':'+res
}

function krPrint(val,sn){
	switch(skillnames[sn].type){
		case 'float':
			return (val).toFixed(1);
		case 'value':
			if(val>=1000000) return parseFloat(val/1000000).toFixed(3)+'м';
			else if(val==0) return '??';
			else return parseInt(val/1000)+'т';
		case 'flag':
			return '<img src="system/img/flags/mod/'+val+'.gif" width="15">';
		default:
			return (skillnames[sn].str ? (isNaN(parseInt(val)) || val==0 ? ' ' : parseInt(val)) : val);
	}
}

//заполнение карточки позиции данными
function FillData(nt)
{
	//var maxsrt = 0;
	$('#table'+nt).remove();

	var selpl = 0;//выбраный игрок на позиции в составе
	if (jsonSostav['sostav'+tacNum] != undefined) {
		for(h in jsonSostav['sostav'+tacNum]) if(jsonSostav['sostav'+tacNum][h].pos == nt) {
			selpl = jsonSostav.sostav[h];
			break;
		}
	}

	var ns = ($('#select'+nt+' option:selected').length>0 ? $('#select'+nt+' option:selected').val() : 0);
	var np = 0;
	for(g in positions)	if(parseInt(positions[g].order,10) == parseInt(ns,10)) {
		np = g;
		break;
	}
	if(np!=0) {
		if(positions[np].pls==undefined) {
//			refresh = true
//			return false
			countPosition(np,nt);
		}
		var html = '<table id=table'+nt+' width=100% border=0 rules=none>'
		var head = true
		var nummax = (positions[np].num==0 ? positions[np].pls.length : positions[np].num)
		var numshow = 0
    	for(t=0;t<positions[np].pls.length;t++) 
		{
			var pl = positions[np].pls[t]
			if (jsonSostav.sostav != undefined){
				var trbgcolor = ((nt<26 && selpl==pl.id) || (nt>25 && pl.sostav ==2) ? ' bgcolor=white' : (pl.sostav > 0 ? ' bgcolor=#BABDB6' : ''));
			}
			var plhtml = '<tr align=right'
			if(((!pl.psn[nt] && pl.psn[nt]!=undefined) || numshow>=nummax) && selpl!=pl.id) plhtml += ' hidden abbr=wrong';
			else {
				//if (maxsrt==0 && pl.srt!=undefined) {
					//maxsrt = pl.srt;
					//$('#select'+nt+' option[value='+np+']').append(' ('+krPrint(pl.srt,'srt')+')');
				//}
				numshow++;
			}

			plhtml += trbgcolor+'>'
			var font1 = (!pl.psn[nt] && pl.psn[nt]!=undefined ? '<font color=red>' : (pl.flag==6 ? '<font color=888A85>' : ''));
			var font2 = ((!pl.psn[nt] && pl.psn[nt]!=undefined) || pl.flag==6 ? '</font>' : '');

			if(head) var headhtml = '<tr align=center>'
			for(pp in pl) {
				if(pp=='flag'){
					plhtml += '<td'+(pl[pp]>0 ? ' bgcolor='+fl[pl[pp]] : trbgcolor)+'></td>'
					if(head) headhtml += '<td width=1%></td>'
				}else if(pp!='posf' && pp!='posfempty' && pp!='sostav' && pp!='id' && pp!='sor' && pp!='psn' && pp!='stdA' && pp!='stdD') {
					var hidden = ''
					var p = pp
					if(pp.indexOf('!')!=-1){
						p = pp.replace(/\!/g,'')
						hidden = ' hidden abbr=hidden'
					}
					var skp = skillnames[p]
					var align = (skp!=undefined && skp.align!=undefined ? ' align='+skp.align : '')
					var nowrap = (skp!=undefined && skp.nowrap!=undefined ? ' nowrap' : '')

					if (pp=='stdat') {
						pl.stdat = (players['p'+pl.id].stdA[tacNum] ? '*' : '');
					} else if (pp=='stdbk') {
						pl.stdbk = (players['p'+pl.id].stdD[tacNum] ? '*' : '');
					}
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
		selected[nt] = positions[np].order
		saveDataSelected();
	}

	MouseOff(nt)
/**/
}

function FillHeaders(){
	for (i=1;i<=maxtables;i++) {
        var sel = false;
		var selnum = selected[i];
        if (jsonSostav['sostav'+tacNum] != undefined){
	        for (j in jsonSostav['sostav'+tacNum]) {
	        	if (jsonSostav['sostav'+tacNum][j].pos == i) sel = true;
	        }
        }
		$('#select'+i).empty()
		var selopts = '<option value="0">&nbsp;&nbsp;&nbsp;</option>';
		var selarr = [];
		var selsel = 0;
		for (j in positions) if (j > 0) 
		{
			var psj = positions[j];
			if (i<=25 && psj.filter!= '' && filterPosition(psn[i], psj.filter)) 
			{
				var nm = '';
				if (psj.pls!=undefined) {
					for(v in psj.pls) {
						if (psj.pls[v].psn[i] && psj.pls[v].srt!=undefined) {
							if (nm=='') nm = krPrint(psj.pls[v].srt,'srt');

							if (i==4||i==9||i==14||i==19||i==23||i==6||i==11||i==16||i==21||i==25) {
								break;
							} else {
								if (psnbetter[i][0].mark==undefined || psnbetter[i][0].mark < psj.pls[v].srt) {
									if (psnbetter[i][0].mark!=undefined) {
										psnbetter[i][1] = jQuery.extend(true, {}, psnbetter[i][0]);;
									}
									psnbetter[i][0].mark = psj.pls[v].srt;
									psnbetter[i][0].posname = psj.name;
									psnbetter[i][0].plname = psj.pls[v].sname;
									//if (rem >= remmax) break;
								} else if (psnbetter[i][1].mark==undefined || psnbetter[i][1].mark < psj.pls[v].srt) {
									psnbetter[i][1].mark = psj.pls[v].srt;
									psnbetter[i][1].posname = psj.name;
									psnbetter[i][1].plname = psj.pls[v].sname;
								}
							}
						}
					}
				}
				selarr.push({
					'id': j,
					'value': psj.order,
					'name': nm+' '+psj.name,
					'str': nm,
					'selected': (selected[i]!=undefined && selected[i]==j)
				});
			}
			if (i>25 && psj.filter=='') {
				selarr.push({
					'id': j,
					'value': psj.order,
					'name': psj.name,
					'str': 0,
					'selected': (selected[i]!=undefined && selected[i]==j)
				});
			}
		}
		selarr.sort(function (a, b) {
			if (a.str < b.str) return 1;
			if (a.str > b.str) return -1;
			return 0;
		});
		for (a in selarr) selopts+= '<option '+(selarr[a].selected ? 'selected ':'')+'value='+selarr[a].value+'>'+selarr[a].name+'</option>';

		$('#select'+i).append(selopts);
		if(sel) $('td#td'+i).attr('class','back2');
		var name = '&nbsp;'
		$('#span'+i).html(name)
		if(positions[selnum] != undefined && positions[selnum].name != undefined) {
			name = positions[selnum].name
		}
		if ((sel || i>25) && selnum!=undefined) {
			if (sel && selnum==0 && $('#select'+i+' option:eq(1)').length>0){
				$('#select'+i).val($('#select'+i+' option:eq(1)').attr('value')).change();
			} else {
				$('#select'+i).val(selnum).change();
			}
		} else {
			FillData(i);
		}
		if(refresh) break
	}
	if(refresh) {
		maxtables = 25
		GetData('positions');
	}
	printBetter();
}

function printBetter() {
	var bres = '';
	var trres = '';
	for(b=1;b<psnbetter.length;b++) if(b!=25&&b!=23&&b!=21&&b!=19&&b!=16&&b!=14&&b!=11&&b!=9&&b!=6&&b!=4) {
		trres+='<td bgcolor=#BFDEB3 style="white-space:nowrap;padding:2px 0px;overflow:hidden;max-width:120px">';
		for(m in psnbetter[b]) {
			if (psnbetter[b][m].mark!=undefined) {
				trres+= '<span style="font-size:8px;" title="'+psnbetter[b][m].plname+'('+psnbetter[b][m].posname+')">'+krPrint(psnbetter[b][m].mark,'srt')+' '+psnbetter[b][m].plname+'('+psnbetter[b][m].posname+')</span>';
				trres+= '<br>';
			}			
		}
		trres+='<br></td>';
		if(b==24||b==2||b==1) trres ='<td></td>'+trres+'<td></td>';
		if(b==24||b==22||b==17||b==12||b==7||b==2||b==1) {bres = '<tr>'+trres+'</tr>'+bres;trres='';}
	}
	$('#ltd4').html('Лучшие: <table id=res>'+bres+'</table>');
}

function fillPosEdit(num){
	var html = '';
	html += '<table width=100% class=back1><tr valign=top>'
	html += '<td width=400>'

	html += '<div style="margin-bottom:5px;">'
	html += '<div style="padding:5px;text-align:center;" class=back2><label><b>Коэффициент</b></label></div>';
	html += '<div style="margin:2px;"><label style="width:70px;margin:2px;display:inline-block;">Название:</label><input maxlength=40 class=back1 style="border:1px solid;" id=iname name="name" type="text" value="'+(num!=undefined && num!=0 ? positions[num].name :'')+'"></div>';
	html += '<div style="margin:2px;"><label style="width:70px;margin:2px;display:inline-block;">Фильтр:</label><input maxlength=20 class=back1 style="border:1px solid;" id=ifilter name="filter" type="text" value="'+(num!=undefined && num!=0  ? positions[num].filter :'')+'"><label> LC DF/DM"(пусто=все)</label></div>';
	html += '<div style="margin:2px;"><label style="width:70px;margin:2px;display:inline-block;">Кол-во:</label><input maxlength=4 class=back1 style="border:1px solid;" id=inum name="num" type="text" size="3" value="'+(num!=undefined && num!=0 && positions[num].num!=undefined ? positions[num].num :'')+'"><label> Сколько игроков отображать(0=все)</label></div>';
	html += '<div style="margin:2px;"><textarea class=back1 style="width:100%;border:1px solid;" id=ikoff name="koff" rows="5">'+(num!=undefined && num!=0  ? positions[num].koff :'')+'</textarea></div>';
	html += '</div>';
	html += '<br><div style="margin-bottom:5px;">'
	html += '<label style="margin:2px 2px;padding:5px;text-align:center;border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;" class="back2 button" onmousedown="javascript:void(PosSave())" onMouseOver="this.style.cursor=\'pointer\'">Сохранить</label>'
	html += '<label style="margin:2px 2px;padding:5px;text-align:center;border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;" class="back2 button" onmousedown="javascript:void(PosDel())" onMouseOver="this.style.cursor=\'pointer\'">Удалить</label>'
	html += '</div>'
	html += '<br><div style="margin-bottom:5px;">'
	html += '<div style="padding:5px;text-align:center;" class=back2><label><b>Список</b></label></div>';
	html += '<div style="display:inline-block; vertical-align:top; overflow:hidden; border:solid grey 1px;width:400px;"><select size=40 style="width:425px;padding:10px; margin:-5px -20px -5px -5px;" id=selpos class=back2 onChange="javascript:void(PosChange())">'

	html += '<option value=0'+(num==0 ? ' selected' :'')+'>--- Создать ---</option>'
	for(i=1;i<positions.length;i++)	html += '<option value='+i+(num==i ? ' selected' :'')+'>'+(i==0 ? '--- Создать ---' : positions[i].name + (positions[i].filter==''?'':' ('+positions[i].filter+')'))+'</option>'
	html += '</select>'
	html += '</div></div>';

	html += '</td>'
	html += '<td>';
	html += '<div style="padding:5px;text-align:center;" class=back2><label><b>Help</b></label></div>';
	html += '<div><label style="width:30px;margin:2px;display:inline-block;">!</label><label>значит по дефоулту поле не отображать</label></div>';
	html += '<div><label style="width:30px;margin:2px;display:inline-block;">=</label><label>эти скилы учавствуют в подсчете силы</label></div>' ;
	for(m in skillnames){
		var style = '';
		var pic = '';
		if (skillnames[m].state!=undefined && skillnames[m].state==2) {
			style = ' style="color:gray;text-decoration:line-through;"';
			pic = '<img height=10 src="system/img/g/last.gif">&nbsp;';
		}
		if (skillnames[m].state!=undefined && skillnames[m].state==3) {
			style = ' style="color:green"';
			pic = '<img height=10 src="system/img/g/next.gif">&nbsp;';
		}
		if (!skillnames[m].hidden) {
			html += '<div'+style+'>';
			html += '<label style="text-decoration:inherit;width:30px;margin:2px;display:inline-block;">'+skillnames[m].rshort+'</label>';
			html += '<label style="text-decoration:inherit;width:110px;margin:2px;display:inline-block;">'+m+'</label>'; 
			html += '<label>'+pic+skillnames[m].rlong+'</label>';
			html += '</div>';
		}
	}
	html += '</td></tr>'
	html += '</table>'
	$('div#divkoff').html(html)

	html = '<table width=100% class=back1>'
	html += '<tr valign=top>';
	html +=  '<td width=300><table width=100%>';
	html += 	'<tr><th colspan=3 style="padding:5px;" class=back2>Основные</th></tr>';
	html += 	'<tr><th style="width:15%;" align=right>Таблиц:</th><td colspan=2><input class=back1 style="border:1px solid;" id=itables name="itables" type="text" size="10" value="'+(maxtables-25)+'"> (Кол-во доп. таблиц)</td></tr>';
	html += 	'<tr><th colspan=3>&nbsp;</th></tr>'
	html += 	'<tr><th colspan=3 style="padding:5px;" class=back2>Идеальный игрок</th></tr>'
	html += 	'<tr><th align=right>Скиллы:</th><td colspan=2><input class=back1 style="border:1px solid;" id=iskills name="iskills" type="text" size="10" value="'+plskillmax+'"></td></tr>'
	html += 	'<tr><th align=right>Номинал:</th><td colspan=2><input class=back1 style="border:1px solid;" id=inominal name="inominal" type="text" size="10" value="'+skillnames.value.strmax+'"></td></tr>'
	html += 	'<tr><th align=right>Возраст:</th><td colspan=2><input class=back1 style="border:1px solid;" id=iage name="iage" type="text" size="10" value="'+skillnames.age.strmax+'"></td></tr>'
	html += 	'<tr><th colspan=3>&nbsp;</th></tr>'
	html += 	'<tr><td></td><th width=100 class=back2 onmousedown="javascript:void(PosSaveAll())" onMouseOver="this.style.cursor=\'pointer\'" style="height:20px;padding:3px;border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Сохранить</th><td></td></tr>'
	html +=  '</table></td>';
	html +=  '<td><table width=100%>'
	html += 	'<tr><th colspan=2 style="padding:5px;" class=back2>BackUp <span style="font-weight: normal;">(сохранение и загрузка своих коэфициентов)</span></th></tr>';
	html += 	'<tr id=svbktr><th title="Сделать бекап коэффициентов на сервере из поля ввода" width=100 class=back2 onmousedown="javascript:void(sendBackUp())" onMouseOver="this.style.cursor=\'pointer\'" style="height:20px;padding:3px;border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Backup</th><td>нет сохраненого бекапа, нажмите что бы сделать(данные возьмутся из поля ввода!)</td></tr>';
//	html += 	'<tr><th height=20 width=100 class=back2 onmousedown="javascript:void(removeBackUp())" onMouseOver="this.style.cursor=\'pointer\'" style="border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Удалить</th><td id=tdbk></td></tr>';
	html += 	'<tr id=rmbktr><th title="Загрузить коэффициенты из бекапа в форму ввода" width=100 class=back2 onmousedown="javascript:void(getBackUp())" onMouseOver="this.style.cursor=\'pointer\'" style="height:20px;padding:3px;border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Загрузить</th><td>бекап за <b><span id=dtbk></span></b> [<a href="javascript:void(removeBackUp())">удалить</a>]</td></tr>';
	html += 	'<tr><th colspan=2>&nbsp;</th></tr>'
	html += 	'<tr><th title="Применить коэффициенты введеные в форму ввода" width=100 class=back2 onmousedown="javascript:void(applyBackUp())" onMouseOver="this.style.cursor=\'pointer\'" style="height:20px;padding:3px;border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Применить</th>'
	html += 		'<td rowspan=7><textarea class=back1 style="width:100%;border:1px solid;" id=bk name="bk" rows="25"></textarea></td></tr>';
	html += 	'<tr><td style="height:20px;">&nbsp;</td><td></td></tr>'
	html += 	'<tr><th title="Вставить в форму ввода текущие коэффициенты" width=100 class=back2 onmousedown="javascript:void(printToBackUp())" onMouseOver="this.style.cursor=\'pointer\'" style="height:20px;padding:3px;border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Текущее</th><td></td></tr>'
	html += 	'<tr><td style="height:20px;">&nbsp;</td><td></td></tr>'
	html += 	'<tr><th title="Сбросить коэффициенты на значения по умолчанию" width=100 class=back2 onmousedown="javascript:void(PosDrop())" onMouseOver="this.style.cursor=\'pointer\'" style="height:20px;padding:3px;border:1px solid;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;">Сбросить</th><td></td></tr>'
	html += 	'<tr><td>&nbsp;</td><td></td></tr>'
	html +=  '</table></td><tr>';
	html += '</table>'
	$('div#divedit').html(html)

}

function PosChange(){
	var selnum = $('#selpos option:selected').val()
	fillPosEdit(selnum)
}
function PosDel(){
	var selnum = $('#selpos option:selected').val()
	if(selnum==0) {return false;}
	positions.splice(selnum,1)
	SaveData('positions')
	chMenu('tdsost')
	maxtables = 25
	posmaxorder = 0
	GetData('positions')
}

function PosDrop(){
	delete localStorage.positions
	delete localStorage.selected
	maxtables = 25
	posmaxorder = 0
	chMenu('tdsost');
	GetData('positions');
}
function PosSaveAll(){
	var pr = {
		itables: ($('#itables').val() == '' ? 0 : $('#itables').val()),
		iskills: ($('#iskills').val() == '' ? 15 : $('#iskills').val()),
		inominal: ($('#inominal').val() == '' ? 50000000 : $('#inominal').val()),
		iage: ($('#iage').val() == '' ? 40 : $('#iage').val()),
	}
	if(pr.itables>30) pr.itables = 30

	if(pr.itables!=parseInt(pr.itables)
		|| pr.iskills!=parseInt(pr.iskills)
		|| pr.inominal!=parseInt(pr.inominal)
		|| pr.iage!=parseInt(pr.iage)
	){
			alert('Неправильно введены параметры!');
			return false;
	}
	positions[0].koff = 'idealsk='+pr.iskills+',idealage='+pr.iage+',idealval='+pr.inominal+',maxt='+pr.itables;
	SaveData('positions');
	maxtables = 25;
	posmaxorder = 0;
	chMenu('tdsost');
	GetData('positions');
}

function PosSave(){
	var num1 = $('#selpos option:selected').val();
	var num = num1;
	var order = 0;
	if(num1==0) {
		num = positions.length;
		order = posmaxorder = parseInt(posmaxorder)+1;
	}else{
		order = positions[num].order;
	}
	var ps = {
		name: 	$('#iname').val(),
		num: 	($('#inum').val() == '' ? 0 : $('#inum').val()),
		filter: $('#ifilter').val(),
		koff: 	$('#ikoff').val(),
		order:	order
	}
	// провалидировать поля и обновить
	if(ps.num!=parseInt(ps.num) ||
		ps.name == '' ||
		ps.koff == ''
	){
		alert('Неправильно введены параметры!');
		return false;
	}
	positions[num] = ps;
	fillPosEdit(num);
	countPosition(num);
	chMenu('tdsost');
	SaveData('positions');
	FillHeaders();
}

function postBackUpData() {
	if (senddata!='' && senddata.length<postBackupLimit*3) {
		var dda;
		if(senddata.length>postBackupLimit) {
			dda = senddata.substr(0,postBackupLimit);
			senddata = senddata.substr(postBackupLimit);
		} else{
			dda=senddata;
			senddata = '';
		}
		//console.log('отправляем: '+dda+', осталось: '+senddata);
		$.ajax({
			type: "POST",
			url: postBackupUrl,
			data: {rtext: '[list]'+dda},
			dataType: "text",			
			success: function(){
				console.log('save backup success');
				setTimeout(postBackUpData, 1000);
			},
			error: function(response, status, xhr){
				console.error(status+': ' +xhr.status + ' ' + xhr.statusText);
			}			
		});
	} else {
		console.log('send data empty or over limit - finish posting');
		loadBackUpPage();
	}
};

function printToBackUp(){
	var bak ='';
	for(i in positions){
		var p=positions[i];
		if(i>0) bak+= p.name+'|'+p.filter+'|'+p.num+'|'+p.koff+'$';
	}
	$('#bk').val(bak);
}

function sendBackUp(){
	senddata = translit($('#bk').val().replace(/([A-Za-z]+[A-Za-z0-9\s\/\=\*\,]*[A-Za-z]+|[A-Za-z]+)/g,'[$1]'));

	if (senddata=='') return false;
	if (postBackupUrl!='') {
		postBackUpData();
	} else {
		alert('Неизвестно куда делать бекап, урл пуст');
		return false;
	}
}

function removeBackUp(){
	if (delBackupUrl!='') {
		var delarr = delBackupUrl.split('|');
		if (delarr.length==0 || delarr.length>3) {
			delBackupUrl ='';
			return false;
		}
		delBackupUrl = delarr.slice(1).join('|');
		//console.log('удаляем '+delarr[0] + ', осталось '+delBackupUrl);

		$.ajax({
			type: "GET",
			url: delarr[0],
			success: function(){
				console.log('remove backup success');
				//removeBackUp();
				setTimeout(removeBackUp,1000);
			}		  
		});
	} else {
		console.log('урлы удаления закончились');
		loadBackUpPage();
	}	
}

function getBackUp() {
	$('#bk').val( translit($('#debug').find('ul').text(),true,'[,]'));
}

function applyBackUp(){
	var pss = $('#bk').val().split('$');
	var nnum = 0;
	positions.splice(1);
	for(n in pss){
		nnum = parseInt(n,10)+1;
		if(pss[n]!=undefined && pss[n]!=''){
			var stt = pss[n].split('|');
			console.log(nnum+': name:'+stt[0]+' filter:'+stt[1]+' max:'+stt[2]+ ' koff:'+stt[3]);
			positions[nnum] = {
				filter: stt[1],
				name: stt[0],
				num: stt[2],
				koff: stt[3],
				order: nnum
			}		
			fillPosEdit(nnum);
			countPosition(nnum);
		}
	}
	positions.splice(nnum);
	posmaxorder = nnum;
	chMenu('tdsost');
	SaveData('positions');
	FillHeaders();
}

function loadBackUpPage()
{
	if ($('#debug').length == 0){
		$('div#divedit').append('<div id=debug style="display:none;">x</div>');
	} 
	$('#debug').load('hist.php?t=n&id=0' + ' center:first',function(response, status, xhr) {
		if (status == "error") {
			var msg = "Sorry but there was an error: ";
			$('div#divedit').append('<font color=red>'+msg + xhr.status + " " + xhr.statusText+'</font>');
		} else {
			postBackupUrl = $('#debug').find('form').attr('action');
			console.log('postBackupUrl='+postBackupUrl);

			if ($('#debug').find('ul').length>0) {
				var delarr = [];
				$('#debug').find('a').each(function(){
					delarr.push($(this).attr('href'));
				});
				delBackupUrl = delarr.join('|');

				console.log('delBackupUrl='+delBackupUrl);
				var tm = $('#debug').find('a').parent().find('b').remove().end().text().split(' ');
				$('#dtbk').html(tm[1]+' '+tm[2]);
				$('#svbktr').hide();
				$('#rmbktr').show();
			}else{
				delBackupUrl = '';
				$('#dtbk').html('none');
				$('#svbktr').show();
				$('#rmbktr').hide();
			}
		}
		$('div#divedit').show();
	});
}

function chMenu(mid)
{
	switch (mid){
		case 'tdedit':
			$('th#tdsost,th#tddopt,th#tdkoff').addClass('back2').css('border-bottom','1px solid').attr('onMouseOut','this.className=\'back2\'')
			$('th#tdedit').addClass('back1').css('border-bottom','0px').attr('onMouseOut','this.className=\'back1\'')
			$('table#tablesost, table#tabledopt, div#divkoff').hide()
			printToBackUp();
			loadBackUpPage();
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

function PrintTables() {
	krOpen()

	var html = '<div align=right style="margin:0px 5px">[<a href="javascript:void(close())">закрыть</a>]</div>'
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
			} else if (i==1 && j==1) {
				htmltd += '<td valign=top height=90 class=back1 align=center>'+ShowHelp()+'</td>'
			} else if (i==6 && j!=3) {
				if (j==1 || j==4) htmltd += '<td valign=top class=back1 colspan=2 rowspan=3 id=ltd'+j+'></td>'
				//htmltd += '<td valign=top height=90 class=back1>6</td>'
			} else if (i==7 && j!=3) {
				//htmltd += '<td valign=top height=90 class=back1>7</td>'
			} else {
				htmltd += PrintTd(nm)
				nm--
			}
			newtr = htmltd + newtr
		}
		html += newtr + '</tr>'
	}
	html += '<tr><td></td></tr></table>'
	html += '<table id=tabledopt width=100% class=back1 style="display:none;"></table>'
	html += '<div id=divkoff style="display:none;"></div>'
	html += '<div id=divedit style="display:none;"></div>'
	html += '<br></td></tr></table><br><br>'
	$('td.back4').after('<td class=back4 id=sostavplus>'+html+'</td>')
}
function PrintAdditionalTables(){
	var html = '<tr><td>';
	html += '<table witdh=100% bgcolor=black><tr class=back2 align=center>';
	for(i=26;i<=maxtables;i++){
		html += PrintTd(i);
		if(i%5==0 && i!=25 && i!=(maxtables)) html += '</tr></table><br><table witdh=100% bgcolor=black><tr class=back2 align=center>';
	}
	html += '</tr></table>';
	html += '</td></tr>';
	$('table#tabledopt').html(html);
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

function showAll(nt) {
	if($('table#table'+nt+' tr[abbr*=wrong]:first').is(':visible')
		||$('table#table'+nt+' td[abbr*=hidden]:first').is(':visible')) {
			$('table#table'+nt+' tr[abbr*=wrong]').hide()
			$('table#table'+nt+' td[abbr*=hidden]').hide()
	} else{
		if (Object.keys(players).length > positions[nt].pls.length) {
			countPosition($('#select'+nt).val());
			FillData(nt);
		}
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
function translit(text, engToRus, replace){
 var
  rus = "щшчцюяёжъыэабвгдезийклмнопрстуфхь".split(""),
  eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(" ")
  for(var x = 0; x < rus.length; x++){
  text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
   text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase()); 
 }
 if(replace){
   r = replace.split(",")
   try{
     pr =  new RegExp("([^\\"+r[0]+"]+)(?=\\"+r[1]+")","g")
      text.match(pr).forEach(function(i){
        text=text.split(r[0]+i+r[1]).join(translit(i, engToRus ? "" : true))
     })
   }catch(e){}
 }
  return text;
}

function ShowHelp(){
	var html = ''
	html += '<table class=back2>';
	html += '<tr><th colspan=4>'+'HELP'.fontsize(1)+'</th></tr>';
	html += '<tr><td bgcolor=#FFFFFF colspan=2>'+'основа'.fontsize(1)+'</td>';
	html += '<td bgcolor=#BABDB6 colspan=2>'+'в заявке'.fontsize(1)+'</td></tr>';
	html += '<tr><td colspan=4><font color=red size=1>не своя позиция</font></td></tr>';
	html += '<tr><td bgcolor='+fl[1]+'></td><td>'+'трв'.fontsize(1)+'</td>';
	html += '<td bgcolor='+fl[2]+'></td><td>'+'дск'.fontsize(1)+'</td></tr>';
	html += '<tr><td bgcolor='+fl[3]+'></td><td>'+'фрм<90'.fontsize(1)+'</td>';
	html += '<td bgcolor='+fl[4]+'></td><td>'+'мрл<80'.fontsize(1)+'</td></tr>';
	html += '<tr><td bgcolor='+fl[5]+'></td><td>'+'шкл'.fontsize(1)+'</td>';
	html += '<td bgcolor='+fl[6]+'></td><td>'+(showscout ? '<font color=888A85>'+'чужой'.fontsize(1)+'</font>' : '&nbsp;')+'</td>';
	html += '</tr>';
	html += '</table>';
	return html;
}
