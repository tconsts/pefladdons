// ==UserScript==
// @name           peflteam
// @namespace      pefl
// @description    team page modification
// @include        https://*pefl.*/plug.php?p=refl&t=k&j=*
// @require			crab_funcs_db.js
// ==/UserScript==

var type 	= 'num'
var players = []
var players2= []
var players3= []
var matches2	= []
var matchespl2	= []

/**
 * Teams(work with)
 *
 * @type {*[]}
 */
let teams = [], url = new Url();
var sumax 	= 3600
var team_cur = {}
var m = []
var sumvaluechange = 0
var save = false

// Rows from web db
const list = {
	'players':	'id,tid,num,form,morale,fchange,mchange,value,valuech,name,goals,passes,ims,rate',
	'teams':	'tid,my,did,num,tdate,tplace,ncode,nname,tname,mname,ttask,tvalue,twage,tss,avTopSumSkills,age,pnum,tfin,screit,scbud,ttown,sname,ssize,mid,tform,tmorale,tsvalue'
}
var skl = {}
	skl['corners']	= 'Угловые'
	skl['crossing']	= 'Навесы'
	skl['dribbling']= 'Дриблинг'
	skl['finishing']= 'Удары'
	skl['freekicks']= 'Штрафные'
	skl['handling']	= 'Игра руками'
	skl['heading']	= 'Игра головой'
	skl['exiting']	= 'Игра на выходах'
	skl['leadership']= 'Лидерство'
	skl['longshots']= 'Дальние удары'
	skl['marking']	= 'Перс. опека'
	skl['pace']		= 'Скорость'
	skl['passing']	= 'Игра в пас'
	skl['positioning']= 'Выбор позиции'
	skl['reflexes']	= 'Реакция'
	skl['stamina']	= 'Выносливость'
	skl['strength']	= 'Мощь'
	skl['tackling']	= 'Отбор мяча'
	skl['vision']	= 'Видение поля'
	skl['workrate']	= 'Работоспособность'
	skl['technique']= 'Техника'

var rtasks = {
	'Чемпионство':1,
	'Выйти в высший Д.':2,
	'Медали':3,
	'Зона Судамерикана':4,
	'Зона ЛК':5,
	'Попасть в 3А':6,
	'Попасть в пятерку':7,
	'Попасть в десятку':8,
	'15 место':9,
	'Не вылететь':10
}

const rschools = {
	'очень слабая': 1,
	'слабая': 2,
	'средняя': 3,
	'хорошая': 4,
	'отличная': 5,
	'мирового уровня': 6,
	'одна из лучших в мире': 7
}

var sumP = 0
var sumH = false

var countSostav = 0;

/**
 * Squad counter for VIP clients
 *
 * @type {number}
 */
let countSquadVIP = 0

var countSk = [0]
var svalue = true
var nom = true
var zp  = true
var sk  = true
var age = true
var pos1 = {'C' :0}
var pos2 = {'GK':0}

/**
 * TeamId from the page
 *
 * @type {number}
 */
let cid = 0;

/**
 * Max squad counter
 *
 * @type {number}
 */
let countSquadMax = 0;

$().ready(function() {
	// Получаем teamId со страницы команды
	cid = parseInt($('td.back4 table:first table td:first').text());
	// Добавляем в команды команду, на странице которой мы сейчас находимся
	teams[cid] = {'tid': cid};

	if (url.l == 'y') {
		//Page for show skills		

	} else {
		modifyPage()
		countSquadMax  = $('tr[id^=tblRosterTr]').length;
		countRentMax 	= $('tr[id^=tblRosterRentTr]').length
		Std.debug('Main:countSquadMax=' + countSquadMax)
		EditFinance();
		GetFinish('start', true)
		if(cid==parseInt(localStorage.myteamid)) {
			delete localStorage.matches
			delete localStorage.matchespl
			getJSONlocalStorage('matches2',matches2)
			getJSONlocalStorage('matchespl2',matchespl2)
			getJSONlocalStorage('players2',players3)
		}
	}
}, false);

function GetFinish(type, res) {
	Std.debug('GetFinish:type=' + type + ':res=' + res);
	m[type] = res;

	if (m.checksu === undefined && m.pg_players && url.h !=1 ) {
		m.checksu = true
		checkDeleteMatches()
	}

	//
	if (m.getdatatm === undefined && m.start) {
		m.getdatatm = true;

		GetData('teams');
		GetInfoPageTm();
	}
	// Get players data
	if(m.getdatapl === undefined && m.pg_teams){
		m.getdatapl = true;

		GetData('players');
		GetInfoPagePl();
	}
	//
	if (m.modifyteams === undefined && m.get_teams !== undefined && m.pg_teams && m.pg_players) {
		m.modifyteams = true

		ModifyTeams();	//and save if need
		PrintRightInfo()
	}
	if(m.savedatapl === undefined && m.get_players==false && m.pg_players){
		m.savedatapl = true
		SaveData('players')
		saveJSONlocalStorage('players2',players3)
	}
	if(m.savedatapl === undefined && m.get_players && m.pg_players) {//m.trash
		m.savedatapl = true
		ModifyPlayers()// and Save if need
	}
	if(m.showvip === undefined) {
		m.showvip = true
		//RelocateGetNomData() // вернет getnomdata=true
	}
	// Print rightInfo block into team page
	if (m.rightvip === undefined 
		//&& m.getnomdata 
		&& m.pg_playersVip) {
		m.rightvip = true;

		CheckTrash();
		ModifyTeams();	//and save if need
		PrintRightInfoVip();
		ModifyPlayers('vip'); // and Save if need
	}
}

function modifyPage() {
	// исправляем размер
	drawEars();
	$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );

	preparedhtml  =	'<table width=100% id="rg"><tr><th colspan=3>Финансовое положение</th></tr>'
	preparedhtml += '<tr><td id="finance1"></td><td id="finance2" colspan=2></td></tr>'
	preparedhtml += '<tr><td id="os" colspan=3 align=center nowrap><br><b>Основной состав</b>'
	preparedhtml += (url.h == 1 ? '' : ' <a id=showvip href="javascript:void(ShowVip())">(всё)</a>')
	preparedhtml += '</td></tr>'

	// Average form
	preparedhtml += '<tr id="osform">'
	preparedhtml += '<td nowrap><b>кондиции</b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td>'
	preparedhtml += '<th id=osform align=right nowrap></th>'
	preparedhtml += '</tr>'

	// Average morale
	preparedhtml += '<tr id="osmorale">'
	preparedhtml += '<td nowrap><b>мораль</b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td>'
	preparedhtml += '<th id=osmorale align=right nowrap></th>'
	preparedhtml += '</tr>'

	// Average age
	preparedhtml += '<tr id="osage">'
	preparedhtml += '<td nowrap><b><a href="javascript:void(ShowPlayersAge())">возраст</a></b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td>'
	preparedhtml += '<th id="osage" align=right nowrap></th>'
	preparedhtml += '</tr>'

	// Average skills(all)
	preparedhtml += '<tr id="osskills">'
	preparedhtml += '<td nowrap><b><a href="javascript:void(ShowPlayersSkillChange())">скиллы</a></b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td>'
	preparedhtml += '<th id="osskills" align=right nowrap></th>'
	preparedhtml += '</tr>'

	// Average skills(all)
	preparedhtml += '<tr id="osSkills16">'
	preparedhtml += '<td nowrap><b>скиллы16</b>'+('&nbsp;(срд)').fontsize(1)+'<b>:</b></td>'
	preparedhtml += '<th id="osSkills16_th" align=right nowrap></th>'
	preparedhtml += '<td width=10%>&nbsp;<a href="#" onClick="alert(\'Средний скилл по 16 лучшим игрокам в команде(11 + 5)\')">?</a></td>'
	preparedhtml += '</tr>'

	// Face value
	preparedhtml += '<tr id="osnom">'
	preparedhtml += '<th align=left width=50% nowrap><a id="osnom" href="javascript:void(ShowPlayersValue())">номиналы</a>:</th>'
	preparedhtml += '<th id=osnom nowrap align=right></th>'
	preparedhtml += '<td id=nomch nowrap width=10%>&nbsp;</td>'
	preparedhtml += '</tr>'

	// Wage
	preparedhtml += '<tr id="oszp">'
	preparedhtml += '<th align=left nowrap><a href="javascript:void(ShowPlayersZp())">зарплаты</a>:</th>'
	preparedhtml += '<th id="oszp" align=right nowrap></th>'
	preparedhtml += '</tr>'

	preparedhtml += '</table><br>'
	preparedhtml += '<br><a href="javascript:void(ShowRoster())"><b>Ростер команды</b></a>'
	//preparedhtml += '<br><b><a id=teamskills>Скиллы игроков</a></b>'
	preparedhtml += '<br><a id=teamsu href="javascript:void(ShowSU())" style="display: none;"><b>Сверхусталость</b></a>'
	preparedhtml += '<br><br>'
	$("#crabright").html(preparedhtml)
}

function sNomPsum(i, ii) { // Сортировка
    if 		(i.psum < ii.psum)	return  1
    else if	(i.psum > ii.psum)	return -1
    else					return  0
}

function ShowSU(del) {
	Std.debug('ShowSU:del='+del)
	if (del) {
		$('table#tblSu, table#tblSuM, div#divSu').remove()
//		plsu.splice(0,100000)
		plsu = []
//		Std.debug('ShowSU:plsu.length:'+plsu.length)
	}
//	for(g in matches2) Std.debug('g='+g+':mid='+matches2[g].id)

	$('table#tblRosterFilter').hide()
	$('table#tblRoster').hide()

//	Std.debug('ShowSU:размер(tblSu)='+$('table#tblSu').length)
	if ($('table#tblSu').length>0) {
		$('table#tblSu').show()
		$('table#tblSuM').show()
		$('div#divSu').show()
	} else {
		var plsu = []
		var plexl = String(localStorage.plexl)
		var teamminutes = 0
		for(i in matchespl2){
			var num = plsu.length
			plsu[num] = {'name':i, 'minutesu':0,'minute':0,'matches':0,'matches2':0,'del':(plexl.indexOf('|'+i+'|') != -1 ? true : false)}
			for (j in matchespl2[i]){
				var mth = matchespl2[i][j]
				var mch2 = {}
				for(g in matches2){
					if(matches2[g]!=null && matches2[g]!=undefined && parseInt(matches2[g].id)==parseInt(j)) {
						mch2 = matches2[g];
						break
					}
				}
				var countminutes = (mth.h==undefined && (mch2.hnm==undefined || mch2.anm==undefined) ? true : false)
				var minute = 0
				if(mth.mr!=undefined){
					//минут в матче или свои или полный матч.
					if(mth.m==undefined){
						minute = parseInt(mch2.m)
						if(minute>119) minute=120
						else if(minute>89) minute=90
					}else{
						minute = (mth['in']==1 ? parseInt(mth.m)+5+90-parseInt(mch2.m) : parseInt(mth.m)+5)
					}
					plsu[num].matches2 	+= 1
					if(countminutes) {
						//учитывать ли вообще сыграные минуты для высчета тильд
						plsu[num].minute 	+= minute
					}
					if(mch2.su==undefined && mth.h!=1){
						// если сверхусталость включена у матча, то добавляем игроку
						plsu[num].minutesu	+= minute
						plsu[num].matches 	+= 1
					}
				}
                if(!plsu[num].del && countminutes) teamminutes += minute
//				Std.debug('ShowSU:'+i+':minute='+minute+':teamminutes='+teamminutes+':mch2='+mch2.id)
			}
		}
		var teamm = 0
		for(i in matches2) {
			Std.debug('ShowSU:h='+matches2[i].h+':hnm'+matches2[i].hnm+':anm='+matches2[i].anm)
			if(matches2[i].h!=undefined && (matches2[i].hnm==undefined || matches2[i].anm==undefined)){
				teamm += parseInt(matches2[i].m)
				Std.debug('ShowSU:teamm='+teamm)
			}
		}
//		Std.debug('ShowSU:teamm='+teamm)
		for(i in plsu) {
			plsu[i].tilda = (plsu[i].del ? 'none' : parseFloat(plsu[i].minute/(teamminutes/countSquadMax)*100))
			plsu[i].tilda2 = (plsu[i].del ? 'none' : parseInt(plsu[i].minute-(teamminutes/countSquadMax*40/100)))
			//Std.debug('ShowSU:'+i+':'+plsu[i].minute+':'+teamminutes+':'+countSquadMax)
		}

		var preparedhtml = '<table id="tblSu" class=back1 width=100%>' //BFDEB3
		preparedhtml += '<tr align=left>'
		preparedhtml += '<td></td>'
		preparedhtml += '<th>N</th>'
		preparedhtml += '<th nowrap>~(%)</th>'
		preparedhtml += '<th nowrap>~(мин)</th>'
//		if(deb) preparedhtml += '<th nowrap>%(2)</th>'
		preparedhtml += '<th>Имя</th>'
		preparedhtml += '<th>СУ: Минут</th>'
		preparedhtml += '<th>Матчей</th>'
		preparedhtml += '<th>Осталось</th>'
		preparedhtml += '</tr>'
		var pls = plsu.sort(function(a,b){return (((b.del ? -10000 : 0) + b.minutesu + b.minute*0.001) - ((a.del ? -10000 : 0) + a.minutesu + a.minute*0.001))})
		var num = 1
		for (i in pls) {
			var plsi = pls[i]
			var ost = sumax - plsi.minutesu
			var ostmatch = Math.floor(ost/90)
			var ostminute = ost - ostmatch*90
			var trclass = (plsi.del ? ' bgcolor='+(num%2==1 ? 'BABDB6' : 'D3D7CF') : ' class=back'+(num%2==1 ? 2 : 1))
			preparedhtml += '<tr'+trclass+'>'
			preparedhtml += '<td align=center width=1%><a href="javascript:void(DeletePl(\''+plsi.name+'\','+plsi.del+'))"><font color=red>X</font></a></td>'
			preparedhtml += '<td>'+(parseInt(i)+1)+'</td>'
			preparedhtml += '<td align=right width=5%'+(plsi.tilda!='none' && plsi.tilda<=40 ? ' bgcolor=yellow' : '')+'><a href="javascript:void(suMarkDel(\''+plsi.name+'\','+plsi.del+'))">'+(plsi.tilda=='none' ? '&nbsp;&nbsp;&nbsp;' : (plsi.tilda).toFixed(1)) +'</a></td>'
			preparedhtml += '<td align=right width=5%'+(plsi.tilda2!='none' && plsi.tilda2<=0 ? ' bgcolor=yellow' : '')+'><a href="javascript:void(suMarkDel(\''+plsi.name+'\','+plsi.del+'))">'+(plsi.tilda2=='none' ? '&nbsp;&nbsp;&nbsp;' : plsi.tilda2) +'</a></td>'
//			if(deb) preparedhtml += '<td align=right width=5%'+(plsi.tilda2!='none' && plsi.tilda2<=40 && teamm!=0? ' bgcolor=yellow' : '')+'><a href="javascript:void(suMarkDel(\''+plsi.name+'\','+plsi.del+'))">'+(plsi.tilda2=='none' ? '&nbsp;&nbsp;&nbsp;' : (plsi.tilda2).toFixed(1)) +'</a></td>'
			preparedhtml += '<td><a href="javascript:void(ShowPlM(\''+plsi.name+'\','+plsi.del+'))"><b>'+plsi.name+'</b></a></td>'
			preparedhtml += '<td><b>'+plsi.minutesu+'</b>'+(plsi.minute>0 ? '<font size=1> ('+plsi.minute+')</font>' : '')+'</td>'
			preparedhtml += '<td><b>'+plsi.matches+'</b>'+(plsi.matches2>0 ? '<font size=1> ('+plsi.matches2+')</font>' : '')+'</td>'
			preparedhtml += '<td><b>'+ost+'</b>'
			preparedhtml += (ost>0 ? '<font size=1> ('+(ostmatch>0 ? '90*'+ostmatch+' + ' : '')+ostminute+')</font>' : '')
			preparedhtml += '</td>'
			preparedhtml += '</tr>'
			num++
		}
		preparedhtml += '</table>'
		preparedhtml += '<div id="divSu">'
		preparedhtml += '<br>1. с однофамильцами могут быть проблемы'
		preparedhtml += '<br>2. желтым должны быть помечены игроки с тильдами(~)'
		preparedhtml += '<br>3. серым помечено то что не идет в подсчет % минут'
		preparedhtml += '<br>4. <a>&ndash;</a> матч ненадо учитывать при подсчете % минут (например при подписывании школьника)'
		preparedhtml += '<br>5. <font color=red>X</font> удалить: игрока, игрока из матча или матч целиком'
		preparedhtml += '<br>6. нажмите на Имя игрока чтобы посмотреть в каких матчах и сколько он играл'
		preparedhtml += '<br>7. для отображения дат и турниров сходите в календарь'
		preparedhtml += '<br>8. сортировка матчей идет так: вначале матчи без дат(по id), потом по датам'

		preparedhtml += '</div><br><br>'

		preparedhtml += '<table id="tblSuM" width=100% style="border-spacing:1px 0px"></table>'

		$('table#tblRoster').after(preparedhtml)
//		$('table#tblSu tr:even').attr('class','back2')
//		$('table#tblSu tr:odd').attr('class','back1')
	}
	ShowPlM(0)
}

function suMarkDel(plid,del){
	Std.debug('suMarkDel:'+localStorage.plexl)
	Std.debug('suMarkDel:plid='+plid+':del='+del+':'+(del ? 'стираем':'добавляем'))
	if(del) localStorage.plexl = String(localStorage.plexl).replace(plid+'|','')
	else	localStorage.plexl = (String(localStorage.plexl)=='undefined' ? '|' : String(localStorage.plexl)) + plid+'|'
	Std.debug('suMarkDel:'+localStorage.plexl)
	ShowSU(true)
	ShowPlM(plid)
}

function ShowPlM(plid,pdel){
	Std.debug('ShowPlM:plid='+plid+':pdel='+pdel)
	var matchpos = [,'GK',,
	,,'SW',,,
	'R DF','C DF','C DF','C DF','L DF',
	'R DM','C DM','C DM','C DM','L DM',
	'R M','C M','C M','C M','L M',
	'R AM','C AM','C AM','C AM','L AM',
	,'FW','FW','FW',,
	,'FW','FW','FW',,
	'L AM','C AM','C AM','C AM','R AM',
	'L M','C M','C M','C M','R M',
	'L DM','C DM','C DM','C DM','R DM',
	'L DF','C DF','C DF','C DF','R DF',
	,,'SW',,,
	,'GK']

	$('table#tblSuM tr').remove()
	pdel = (pdel==undefined ? false : pdel)

	var plcount = 0
	var plname = (plid==0 ? '&nbsp;' : plid)
	var plinfo = '<br>&nbsp;'
	var plposition = false
	if(plid!=0) for(m in players) {
//		Std.debug('ShowPlM:'+String(players[m].name)[0]+'=='+plid.split('.')[0]+':'+players[m].name+'=='+plid.split('.')[1])
		if(	String(players[m].name)[0]==(plid.split('.')[1]==undefined ? plid[0] : plid.split('.')[0]) && 
			players[m].name.indexOf((plid.split('.')[1]==undefined ? plid : plid.split('.')[1]))!=-1)
		{
			plcount++
			if(plcount==1){
				plposition = players[m].position
				plname = players[m].name +'('+plposition+')'
				plinfo  = '<br><img src="system/img/flags/'+players[m].nid+'.gif" width=20></img> '
				plinfo += 'возраст: '+players[m].age+', номинал: '+ShowValueFormat(players[m].value/1000)+'т'
				plinfo += ', форма/мораль: '+players[m].form+'/'+players[m].morale
			}
			if(plcount>1){
				plname = plid
				plinfo = ''
				plposition = false
			}
		}
	}
	
	var prehtml = ''
	prehtml += '<tr>'
	prehtml += '<td colspan='+(plid!=0 ? '17 style="border-bottom:1px solid;"' : '7')+'><font size=3><b>'+plname+'</b></font>'+plinfo+'</td>'
	prehtml += (plid==0 ? '<td colspan=10 style="border-bottom:1px solid;">&nbsp;</td>' : '')
	prehtml += '</tr>'
	prehtml += '<tr id=zagolovok height=20>'
	if(plid!=0){
		prehtml += '<td style="border-left:1px solid;">&nbsp;</td>'
		prehtml += '<td></td>'
		prehtml += '<td>&nbsp;N</td>'
		prehtml += '<td>мин</td>'
		prehtml += '<td>поз</td>'
		prehtml += '<td>рейт</td>'
		prehtml += '<td>голы</td>'
		prehtml += '<td style="border-right:1px solid;">&nbsp;</td>'
	}else prehtml += '<td colspan=7 class=back1></td>'
	prehtml += '<td style="border-left:1px solid;">&nbsp;</td>'
	prehtml += '<td>N</td>'
	prehtml += '<td>Дата</td>'
	prehtml += '<td>СУ</td>'
	prehtml += '<td>&nbsp;</td>'
	prehtml += '<td colspan=3 align=center>матч</td>'
	prehtml += '<td style="border-right:1px solid;">турнир</td>'
	prehtml += '</tr>'
	prehtml += '<tr>'
	prehtml += '<td colspan=7 class=back1'+(plid!=0 ? ' style="border-top:1px solid;"' : '')+'>&nbsp;</td>'
	prehtml += '<td colspan=10 width=65% class=back1 style="border-top:1px solid;">&nbsp;</td>'
	prehtml += '</tr>'
	$('table#tblSuM').html(prehtml)

	var num = 1
	var num2 = 0
	var matches22 = []
	matches22 = matches2
	matches22.sort(function(a,b){if(a!=null&&b!=null) return (((a.dt==undefined?(a.hnm!=undefined&&a.anm!=undefined?0:100000000):a.dt) + a.id*0.0000001) - ((b.dt==undefined?(b.hnm!=undefined&&b.anm!=undefined?0:100000000):b.dt) + b.id*0.0000001))})
	for(j in matches22){
		prehtml = ''
		var mch = matches22[j]
		if(mch!=null && mch!=undefined && mch.res!=undefined){

		var mchpl	= (matchespl2[plid]!=undefined && matchespl2[plid][mch.id]!=undefined ? matchespl2[plid][mch.id] : false)
		if(mchpl.mr==undefined && mch.hnm!=undefined && mch.anm!=undefined){

		}else{
		var t1 	= (mch.hnm==undefined ? '<b>'+team_cur.tname+'</b>' : mch.hnm)
		var t2 	= (mch.anm==undefined ? '<b>'+team_cur.tname+'</b>' : mch.anm)
		var t1u = ''
		var t2u = ''
		if(mch.ust!=undefined){
			var ust = mch.ust.split('.')
			t1u = (ust[1]==undefined || ust[1]=='h' ? (ust[0]=='p' ? '(прд)' : '(акт)' ).fontcolor('red') : '') //p.h a.h p
			t2u = (ust[1]==undefined || ust[1]=='a' ? (ust[0]=='p' ? '(прд)' : '(акт)' ).fontcolor('red') : '') //p.a a.a p
		}
		var date = '&nbsp;'
		if(mch.dt!=undefined){
			var dt = new Date(mch.dt*100000)
			mdate = parseInt(dt.getDate())
			mmonth = parseInt(dt.getMonth())+1
			date =  (mdate<10?'0':'')+mdate+'.'+(mmonth<10?0:'')+mmonth//+ '.'+dt.getFullYear()
		}
		var type	= '&nbsp;'
		if(mch.tp!=undefined){
			switch(mch.tp){
				case 't': type='Товарищеский';break;
				case 'ch': type='Чемпионат';break;
//				case 'cp': type='Кубок';break;
				default: type = mch.tp
			}
		}
		var minute	= '&nbsp;'
		var mark	= '&nbsp;'
		var im		= false
		var cp		= ''
		var goals	= '&nbsp;'
		var cards	= '&nbsp;'
		var inz		= '&nbsp;'
		var pos		= ''
		if(plid!=0 && mchpl && mchpl.mr!=undefined){
			minute	= (mchpl.m==undefined ? mch.m : mchpl.m)
			mark	= (mchpl.mr!=undefined ? mchpl.mr : '&nbsp;')
			im		= (mchpl.im!=undefined ? true : false)
			cp		= (mchpl.cp!=undefined ? 'кэп&nbsp;' : '')
			goals	= (mchpl.g!=undefined ? '<img src="system/img/refl/ball.gif" width=10></img>'+(mchpl.g==2 ? '<img src="system/img/refl/ball.gif" width=10></img>' : (mchpl.g>2 ? '('+mchpl.g+')' : '')) : '&nbsp;')
			cards	= (mchpl.cr!=undefined ? '<img src="system/img/gm/'+mchpl.cr+'.gif"></img>' : '&nbsp;')
			cards	= cards + (mchpl.t==1 ? '&nbsp;<img src="system/img/refl/krest.gif" width=10></img>':'')
			inz		= (mchpl['in']!=undefined ? '<img src="system/img/gm/in.gif"></img>' : (minute<mch.m ? '<img src="system/img/gm/out.gif"></img>':'&nbsp;'))
			if(mchpl.ps!=undefined){
				var posarr = String(mchpl.ps).split(':')
				for(n in posarr){
					var posname = matchpos[parseInt(posarr[n])]
					var red1 = ''
					var red2 = ''
					if(plposition && !filterPosition(plposition,posname)){
						red1 = '<font color=red>'
						red2 = '</font>'
					}
					pos	+= (pos==''?'':',')+red1+posname+red2
				}
			}else pos = '&nbsp;'
			minute	= minute +'\''
			num2++
		}
		var countmatch = (mch.hnm!=undefined && mch.anm!=undefined ? false : true)
		var trcolor = ''
		if(!countmatch) trcolor = ' bgcolor='+(num%2==1 ? 'BABDB6' : 'D3D7CF')
		else trcolor = ' class=back'+(num%2==1 ? 2 : 1)
		var tdcolor = ''
		if(pdel || mchpl.h!=undefined) tdcolor = ' bgcolor='+(num%2==1 ? 'BABDB6' : 'D3D7CF')

		prehtml += '<tr'+trcolor+' id="tr'+mch.id+'">'
		if(plid!=0){
			prehtml += '<td'+tdcolor+' width=1% style="border-left:1px solid;">'+(minute!='&nbsp;' ? '<a href="javascript:void(MinutesPl('+mch.id+',\''+plid+'\',\'del\'))"><font color=red>X</font></a>' : '&nbsp;')+'</td>'
			prehtml += '<td'+tdcolor+' width=1%>'+(minute!='&nbsp;' && mchpl.h==undefined && countmatch ? '<a href="javascript:void(MinutesPl('+mch.id+',\''+plid+'\',\'hide\'))">&ndash;</a>' : '&nbsp;')+'</td>'
			prehtml += '<td'+tdcolor+' align=right>'+(minute!='&nbsp;' ? '<b>'+String(num2).fontsize(1)+'</b>' : '&nbsp;')+'</td>'
			prehtml += '<td'+tdcolor+' nowrap align=right>'+inz+minute+'</td>'
			prehtml += '<td'+tdcolor+' nowrap>'+pos+'</td>'
			prehtml += '<td'+tdcolor+' align=right>'+(im ? '<b>' : '')+mark+(im ? '</b>' : '')+'</td>'
			prehtml += '<td'+tdcolor+' nowrap>'+goals+'</td>'
			prehtml += '<td'+tdcolor+' nowrap style="border-right:1px solid;" align=left width=5%>'+cp+cards+'</td>'
		}else prehtml += '<td colspan=7 class=back1></td>'
		prehtml += '<td style="border-left:1px solid;"><a href="javascript:void(SuDelMatch(\''+mch.id+'\',\'del\',\''+plid+'\'))"><font color=red>X</font></a></td>'
		prehtml += '<td align=right><b>'+String(num).fontsize(1)+'</b></td>'
		prehtml += '<td nowrap align=right>'+date.fontsize(1)+'</td>'
		prehtml += '<th id="tdsu'+mch.id+'">'+(mch.su==undefined ? '<a href="javascript:void(SuDelMatch(\''+mch.id+'\',\'suoff\',\''+plid+'\'))"><img src="system/img/g/tick.gif" height=12></img></a>' : '<a href="javascript:void(SuDelMatch(\''+mch.id+'\',\'suon\',\''+plid+'\'))">&nbsp;&nbsp;&nbsp;</a>')+'</th>'
//		prehtml += '<td>'+mch.m+'\'</td>'
		prehtml += '<td valign=center nowrap><img height=15 src="/system/img/w'+(mch.w!=undefined ? mch.w : 0)+'.png"></img>'+(mch.n!=undefined ? '<sup>N</sup>' : '&nbsp;')+'</td>'
		prehtml += '<td align=right nowrap>'+t1+t1u+'</td>'
		prehtml += '<td nowrap align=center>'+(mch.h!=undefined ? '<a href="plug.php?p=refl&t=if&j='+mch.id+'&z='+mch.h+'">':'')+mch.res+(mch.h!=undefined?'</a>':'')+(mch.pen!=undefined ? '(п'+mch.pen+')' : '')+'</td>'
		prehtml += '<td nowrap>'+t2+t2u+'</td>'
		prehtml += '<td nowrap style="border-right:1px solid;">'+type.fontsize(1)+'</td>'
//		prehtml += '<td nowrap style="border-right:1px solid;">'+(mch.r!=undefined ? mch.r.split(' (')[0] : '&nbsp;')+'</td>'
		prehtml += '</tr>'
		num++
		$('table#tblSuM tr#zagolovok').after(prehtml)
		}
		}
	}
}
function filterPosition(plpos,flpos){
		var pos = flpos.split(' ')
		var	pos0 = false
		var pos1 = false
		if(pos[1]==undefined) {
			pos1 = true
			if(plpos.indexOf(pos[0]) != -1) pos0 = true
		}else{
			for(k=0;k<3;k++) if(plpos.indexOf(pos[0][k]) != -1) pos0 = true
			pos1arr = pos[1].split('/')
			for(k in pos1arr) if((plpos.indexOf(pos1arr[k]) != -1)) pos1 = true
		}
		return (pos0 && pos1 ? true : false)
}

function DeletePl(pid,del){
	Std.debug('DeletePl:pid='+pid+':del='+del)
	delete matchespl2[pid]
	saveJSONlocalStorage('matchespl2',matchespl2)
	if(del) localStorage.plexl = String(localStorage.plexl).replace(pid+'|','')
	ShowSU(true)
	ShowPlM(0)
}

function MinutesPl(mid,pid,type){
	Std.debug('MinutesPl:mid='+mid+':pid='+pid+':type='+type)
	if(type=='del'){
		delete matchespl2[pid][mid]
		saveJSONlocalStorage('matchespl2',matchespl2)
		var delmatch = true
		for(i in matchespl2) if(matchespl2[i][mid]!=undefined) {
			delmatch = false;
			break;
		}
		if(delmatch){
			for(k in matches2) if(matches2[k].id==mid){
				delete matches2[k]
				break
			}
			saveJSONlocalStorage('matches2',matches2)
		}
	}
	else if(type=='hide'){
		matchespl2[pid][mid].h = 1
		saveJSONlocalStorage('matchespl2',matchespl2)
	}
	else return false
	ShowSU(true)
	ShowPlM(pid)
}

function SuDelMatch(mid, type, plid){
	Std.debug('SuDelMatch:mid='+mid+':type='+type+':plid='+plid)
	if(type=='del'){
		//удалить матч из базы
		for(k in matches2) if(matches2[k]==null || matches2[k].id==mid){
			delete matches2[k]
			break
		}
		for(i in matchespl2) delete matchespl2[i][mid]
		saveJSONlocalStorage('matchespl2',matchespl2)
	}else if(type=='suoff'){
		//снять флаг сверхусталости
		for(k in matches2) if(matches2[k]!=null && matches2[k].id==mid){
			matches2[k].su = false
			break
		}
	}else if(type=='suon'){
		//поставить флаг сверхусталости
		for(k in matches2) if(matches2[k]!=null && matches2[k].id==mid){
	 		delete matches2[k].su
			break
		}
	}
	//SaveData2('matches')
	saveJSONlocalStorage('matches2',matches2)
	ShowSU(true)
	ShowPlM(plid)
}

function CheckTrash() {
	Std.debug('Start --> CheckTrash()')

	//count top11
	var pls = players.sort(sSkills)
	var num = 0
	var ss = 0
	for(i in pls){
		if (num<11) ss += pls[i].sumskills
		num++
	}
	ss = (ss/11)*0.8
	Std.debug('CheckTrash:ss='+ss)
	if(isNaN(ss)) return false
	team_cur.age = 0
	team_cur.tmorale = 0
	team_cur.tform = 0
	team_cur.pnum = 0
	for (let i in players) {
		var pli = players[i]
		if (pli.sumskills < ss) {
			pli.trash = true
		} else {
			team_cur.tss 	= ((team_cur.tss * team_cur.pnum) + pli.sumskills)/(team_cur.pnum+1)
			team_cur.age 	= ((team_cur.age*team_cur.pnum)+pli.age)/(team_cur.pnum+1)
			team_cur.tform 	= ((team_cur.tform*team_cur.pnum)+pli.form)/(team_cur.pnum+1)
			team_cur.tmorale = ((team_cur.tmorale*team_cur.pnum)+pli.morale)/(team_cur.pnum+1)
			team_cur.pnum = team_cur.pnum+1
		}
	}
	team_cur.tss = parseFloat(team_cur.tss).toFixed(2)
	team_cur.avTopSumSkills = getAverageStatFromTopPlayersInTeam('sumskills');
	team_cur.age = parseFloat(team_cur.age).toFixed(2)
	team_cur.tform = parseFloat(team_cur.tform).toFixed(2)
	team_cur.tmorale = parseFloat(team_cur.tmorale).toFixed(2)

	GetFinish('trash', true)
}

function ModifyTeams() {
	Std.debug('Start --> ModifyTeams()');

	if (!save && typeof(teams[team_cur.tid].tname) !== 'undefined') {
		save = true
		Std.debug('ModifyTeams:need save(have)')
	}
	let tmt = {}
	for(let i in team_cur) {
		tmt[i] = (team_cur[i] != '' ? team_cur[i] : (typeof(teams[cid][i])!='undefined' ? teams[cid][i] : ''))
	}
	teams[cid] = tmt;

	SaveData('teams');
}

function GetInfoPageTm() {
	Std.debug('Start --> GetInfoPageTm()');

	// Get current club data
	var task_name   = $('table.layer1 td.l4:eq(3)').text().split(': ',2)[1]
	var screit_name = $('table.layer1 td.l2:eq(1)').text().split(': ',2)[1].split(' (')[0]

	team_cur.tid	= cid
	team_cur.tdate	= today
	team_cur.tname	= $('td.back4 table table table:first td:last').text().split(' (')[0]
	team_cur.ttown	= $('td.back4 table table table:first td:last').text().split('(')[1].split(',')[0]
	team_cur.ttask	= (rtasks[task_name]!=undefined ? rtasks[task_name] : task_name)
	team_cur.twage	= 0
	team_cur.tvalue	= 0
	team_cur.tsvalue= 0
	team_cur.tss	= 0;
	team_cur.avTopSumSkills = 0;
	team_cur.age	= 0
	team_cur.tplace	= ''
	team_cur.sname	= $('table.layer1 td.l4:eq(0)').text().split(': ',2)[1]
	team_cur.ssize	= parseInt($('table.layer1 td.l4:eq(2)').text().split(': ',2)[1])
	team_cur.ncode	= parseInt(Url.value('j',$('td.back4 table table:first table:first td:eq(1) a')[0]))
	team_cur.nname	= $('td.back4 table table:first table td:eq(3) font').text().split(', ')[1].split(')')[0]
	team_cur.did	= ''
	team_cur.mname	= $('td.back4 td.l3:first span').text()
	team_cur.mid	= parseInt(Url.value('id',$('td.back4 td.l3:first a')[0]))
	team_cur.pnum	= 0
	team_cur.scbud	= parseInt($('table.layer1 td.l2:eq(1)').text().split('(',2)[1].split(')')[0])
	team_cur.screit	= (rschools[screit_name]!=undefined ? rschools[screit_name] : screit_name)
	team_cur.my		= (team_cur.mname == curManagerNick ? true : false)
	team_cur.tform	= 0
	team_cur.tmorale= 0

	// Save my team id for script "match"
	if(team_cur.my) {
		$('a#teamsu').show()
		save = true
		localStorage.myteamid = cid
		localStorage.mycountry = team_cur.ncode + '.' + team_cur.nname
		var pic = ($('table.layer1 td[rowspan=3] img:first').attr('src')).split('/')[3].split('.')[0]
		if(cid+'a'!=pic){
			localStorage.myteampic = pic;
		} else {
			delete localStorage.myteampic;
		}
	}
	// проверим что команда из моей страны - тогда сохраним
	if(!save && localStorage.mycountry!=undefined && String(localStorage.mycountry).split('.')[1]==team_cur.nname) {
		save = true
	}

	Std.debug('End --> GetInfoPageTm()');

	GetFinish('pg_teams', true);
}

function Print(dataname){
	Std.debug('Print:'+dataname)
	var head = list[dataname].split(',')
	var data = []
	switch (dataname){
		case 'players': data = players;	break
		case 'teams': 	data = teams;	break
//		case 'divs'	: 	data = divs;	break
		default: return false
	}
	var text = '<table width=100% border=1>'
	text+= '<tr>'
	for(j in head) text += '<th>'+head[j]+'</th>'
	text+= '</tr>'
	for(i in data){
		text += '<tr>'
		for(j in head) text += '<td>' + (data[i][head[j]]!=undefined ? data[i][head[j]] : '_')  + '</td>'
		text += '</tr>'
	}
	text += '</table>'
	$('td.back4').prepend(text)
}
function getJSONlocalStorage(dataname,data){
	Std.debug('getJSONlocalStorage:'+dataname)
	if(String(localStorage[dataname])!='undefined'){
		var data2 = JSON.parse(localStorage[dataname]);
		switch(dataname){
			case 'matchespl2': 
				for(k in data2){
					data[k] = []
					for(l in data2[k]){
						if(data2[k][l].id!=undefined) data[k][data2[k][l].id]= data2[k][l]
						else data[k][l]= data2[k][l]
					}
				}
				break
			default:
				for(k in data2) data[k] = data2[k]
		}
//		for(g in matches2) Std.debug('g='+g+':data='+matches2[g].id)
	} else return false
}
function saveJSONlocalStorage(dataname,data){
	Std.debug('saveJSONlocalStorage:'+dataname)
	switch(dataname){
		case 'matchespl2': 
			var data2 = {}
			for(k in data){
				var d2 = []
				for(l in data[k]){
					d2.push(data[k][l])
				}
				data2[k] = d2
			}
			break
		default:
			var data2 = []
			for(i in data) if(data[i]!=null) data2.push(data[i])
	}
	localStorage[dataname] = JSON.stringify(data2)
}

/**
 * Save into web db
 *
 * @param dataName string db name
 * @returns {boolean}
 */
async function SaveData(dataName) {
	Std.debug('SaveData:' + dataName + ':save=' + save);

	if (!save || url.h == 1 || (dataName == 'players' && url.j != 99999)) {
		return false
	}

	let data = [];
	let head = list[dataName].split(',');
	switch (dataName) {
		case 'players':
			data = players;
			break;
		case 'teams':
			data = teams;
			break;

		default:
			return false;
	}
	// If client use FF
	if (ff) {
		var text = ''
		for (let i in data) {
			text += (text != '' ? '#' : '')
			if(typeof(data[i])!='undefined') {
				var dti = data[i]
				var dtid = []
				for(let j in head) {
					dtid.push(dti[head[j]] === undefined ? '' : dti[head[j]])
				}
				text += dtid.join('|')
			}
		}
		localStorage[dataName] = text
	} else {
		for (let i in data) {
			// Необходимый объект для записи в бд
			let dti = data[i];
			// Ключ по которому сохраняем в бд (id)
			//let key = dti[head[0]];
			// Небольшой костыль для таблицы команд, у них tid -> id
			if (head[0] === 'tid') {
				dti['id'] = dti['tid'];
			}

			let result = await addObject(dataName, dti);

			Std.debug(result);
		}
	}
}

/**
 * Получение данных из web db
 *
 * @param dataName string Название таблицы
 * @returns {boolean}
 */
async function GetData(dataName) {
	Std.debug('Start --> GetData from ' + dataName);

	let data = [];
	// Название столбцов в бд
	let head = list[dataName].split(',');
	switch (dataName) {
		case 'players':
			data = players2;
			break;
		case 'teams':
			data = teams;
			break;
//		case 'matches':	 data = matches;	break
//		case 'matchespl':data = matchespl;	break
		default:
			return false;
	}

	// Если юзер сидит в FF
	if (ff) {
		var text1 = String(localStorage[dataName])
		if (text1 != 'undefined' && text1 != 'null') {
			var text = text1.split('#')
			for (i in text) {
				var x = text[i].split('|')
				var curt = {}
				var num = 0
				for(j in head){
					curt[head[j]] = (x[num]!=undefined ? x[num] : '')
					num++
				}
				data[curt[head[0]]] = {}
				if(curt[head[0]]!=undefined) data[curt[head[0]]] = curt
			}
			GetFinish('get_' + dataName, true)
		} else {
			GetFinish('get_' + dataName, false)
		}			
	} else {
		// Если indexedDb not init, пытаемся это сделать
		if (!db) {
			await DBConnect();
		}

		// Если хранилища не было -> выходим
		if (!db.objectStoreNames.contains(dataName)) {
			GetFinish('get_' + dataName, true);
		}

		// Получаем все данные из необходимой таблицы
		const requestResult = await getAll(dataName);
		// Если есть данные какие-либо данные в хранилище
		if (requestResult !== undefined && requestResult.length > 0) {
			Std.debug('GetData from ' + dataName + ' --> success');
			Std.debug('Found rows: ' + requestResult.length);

			// Идем по столбцам и записываем себе
			for (let i = 0; i < requestResult.length; i++) {
				let row = requestResult[i];
				let id = row[head[0]];

				data[id] = row;
			}
		}

		GetFinish('get_' + dataName,true);
	}
}

function checkDeleteMatches(){
	Std.debug('checkDeleteMatches()')
	if (url.j != 99999 || url.j != parseInt(localStorage.myteamid)) return false
	var checksu = 0
	for (i in players) checksu += parseInt(players[i].games)
	Std.debug('checkDeleteMatches:checksu='+checksu)
	if(checksu==0){
		Std.debug('checkDeleteMatches:true')
		matches2.length = 0
		matchespl2.length = 0
//		plsu.length = 0
		ShowSU(true)
		ShowRoster()
		delete localStorage.matches2
		delete localStorage.matchespl2
	}
}

function GetInfoPagePl() {
	Std.debug('GetInfoPagePl()')
	$('tr[id^=tblRosterTr]').each(function(i,val) {

		const eurl	= $(val).find('a[trp="1"]').attr('href'),
			nameElement = $(val).find('.nameUrl a'),			
			pid 	= Url.value('j',nameElement[0]),
			age		= parseInt($(val).find('.age').text()),
			morale	= parseInt($(val).find('.moraleFormat').text()),
			form	= parseInt($(val).find('.conditionFormat').text());

		players[pid] = {
			'num': 		i,
			'id':		pid,
			'tid':		cid,
			'pn':		parseInt($(val).find('td.npp').text()),
			'name':		Std.trim(nameElement.text()),
			'playerUrl':nameElement.attr('href'),
			'hash':		Url.value('z',nameElement[0]),
			'position':	$(val).find('td.position').text(),
			'age':		age,
			'morale':	morale,
			'mchange':	0,
			'form':		form,
			'fchange':	0,
			'value':	0,
			'valuech':	0,
			'games':	parseInt($(val).find('td.game').text()),
			'goals':	parseInt($(val).find('td.goals').text()),
			'passes':	parseInt($(val).find('td.pass').text()),
			'ims':		parseInt($(val).find('td.im').text()),
			'rate':		parseFloat($(val).find('td.ar').text()),
			'd':		$(val).find('.extra img[src*=system/img/g/d.png]').attr('src') || 0,
			't':		$(val).find('.extra img[src*=system/img/g/t]').attr('src') || 0,
			'nid':		$(val).find('img.nation').attr('alt')
		}

		if (eurl !== undefined) players[pid].eurl = eurl		
		
		Std.debug('pl', players[pid]);		

		team_cur.tform 		= ((team_cur.tform * team_cur.pnum) + form)/(team_cur.pnum + 1);
		team_cur.tmorale 	= ((team_cur.tmorale * team_cur.pnum) + morale)/(team_cur.pnum + 1);
		team_cur.age 		= ((team_cur.age * team_cur.pnum) +  age)/(team_cur.pnum+1);
		team_cur.pnum 		= team_cur.pnum + 1;

		Ready()
	})
	Std.debug('GetInfoPagePl:done')
}

function Ready(vip = undefined) {
	if (vip === undefined) {
		countSostav++
		if (countSostav === countSquadMax) {
			GetFinish('pg_players', true);
		}
	} else {
		countSquadVIP++;
		// fulfill all players from squad
		if (countSquadVIP === countSquadMax) {
			for (let i in players) {
				GetPl(i);
			}

			GetFinish('pg_playersVip', true);
		}
	}
}

function ModifyPlayers(vip = undefined) {
	//'id,tid,num,form,morale,fchange,mchange,value,valuech,name,goals,passes,ims,rate',
	Std.debug('ModifyPlayers:my=' + team_cur.my)

	if (!team_cur.my) {
		return false;
	}
	let remember = false;
	// Check for update
	for(let i in players) {
		let pl = players[i]
//		Std.debug('Check:'+pl.id+':'+typeof(players2[pl.id]))
		if (typeof(players2[pl.id])!='undefined') {
			let pl2 = players2[pl.id]
			if (!remember && (pl.morale != pl2.morale || pl.form != pl2.form || (pl.value!=0 && pl.value != pl2.value))){
				remember = true
				Std.debug('ModifyPlayers:NeedSave:id='+pl.id+':morale='+pl.morale +'/'+pl2.morale+':form='+pl.form+'/'+pl2.form+':value='+pl.value+'/'+pl2.value)
				break;
			}
		}
	}

	// Calculate
	Std.debug('Start --> ModifyPlayers:calculate');

	for (let i in players) {
		let pl = players[i];
		if (typeof(players2[pl.id])!='undefined') {
			let pl2 = players2[pl.id]
			//Std.debug(pl.id+':'+pl.goals+'='+pl2.goals)
			if (remember) {
				players[i].mchange = pl.morale - pl2.morale
				players[i].fchange = pl.form   - pl2.form
				if (pl.value!=0) {
					players[i].valuech = pl.value   - pl2.value
				} else {
					if(pl2.value>0) players[i].value = pl2.value
				}
			} else {
				players[i]['mchange'] = pl2.mchange
				players[i]['fchange'] = pl2.fchange
				players[i]['valuech'] = pl2.valuech
			}
			//Std.debug('plCalc '+pl.id+':'+pl.form+'/'+pl.fchange)
		}
	}

	Std.debug('End --> ModifyPlayers:calculate');
	// Update page
	Std.debug('Start --> ModifyPlayers:UpdatePage');

	if (vip === undefined) {
		for (let i in players) {
			let pl = players[i]
//		$('table#tblRoster tr#tblRosterTr'		+ pl.pn + ' td:eq(4)').append(ShowChange(pl.mchange))
//		$('table#tblRoster tr#tblRosterRentTr'	+ pl.pn + ' td:eq(4)').append(ShowChange(pl.mchange))
			if (typeof(players2[pl.id])!='undefined') {
				let pl2 = players2[pl.id]
				$('table#tblRoster tr#tblRosterTr'	+ pl.pn + ' td:eq(7)').append(ShowChange(pl.goals-pl2.goals, true))
				$('table#tblRoster tr#tblRosterTr'	+ pl.pn + ' td:eq(8)').append(ShowChange(pl.passes-pl2.passes, true))
				$('table#tblRoster tr#tblRosterTr'	+ pl.pn + ' td:eq(9)').append(ShowChange(pl.ims-pl2.ims, true))
			}
			sumvaluechange += pl.valuech/1000;
		}
	}

	Std.debug('ModifyPlayers:sumvaluechange=' + sumvaluechange);
	// Save if not team21
	if (remember) {
		SaveData('players')
	}

	var remember3 = false
	var lsgday = String(localStorage.gday)
	var curgday = 0
	if (!team_cur.my || lsgday=='undefined' || isNaN(parseInt(lsgday.split('.')[1]))){
		return false;
	}
	else curgday = parseInt(lsgday.split('.')[1])

	if (players3[0]==undefined) {
		remember3 = true
		players3[0] = curgday
		for (let i in players) {
			var pl = players[i]
			var pl3 = {}
			pl3.id	= pl.id
			if(pl.morale!=100)	pl3.m	= pl.morale
//			if(pl.value!=0)		pl3.v	= pl.value
			if(pl.goals!=0)		pl3.g	= pl.goals
			if(pl.ims!=0)		pl3.i	= pl.ims
			if(pl.passes!=0)	pl3.p	= pl.passes
			if(pl.rate!=0)		pl3.r	= pl.rate
			if(pl.games!=0)		pl3.m	= pl.games
			players3.push(pl3)
		}
		Std.debug('ModifyPlayers:save(first)')
	} else {
		// проверяем и считаем и сохраняем
		var dgday = parseInt(players3[0])
//		if(dgday==curgday)
	}

	if (remember3) {
		saveJSONlocalStorage('players2', players3);
	}
}

/**
 * Get player info from url and load into hidden table
 *
 */
function GetInfoPagePlVip() {
	Std.debug('Start --> GetInfoPagePlVip()',players);

	for (let k in players) {		
		let eUrl = players[k].eurl
		Std.debug('get url', eUrl);
		if (eUrl !== undefined) {
			$('td.back4').append('<table id=pl' + k + ' hidden><tr><td id=pl' + k + '></td></tr></table>');
			$('td#pl'+ k).load(eUrl + ' center:first', function() {
				Ready('vip');
			});
		}
	}

	Std.debug('End --> GetInfoPagePlVip');
}

/**
 * Fulfill player info from hidden table
 *
 * @param pid player ID
 */
function GetPl(pid) {
	// get player skills with number pid
	var skillsum = 0
	var skillchange = []
	$('td#pl' + pid + ' table:first td:even').each(function() {
		var skillarrow = ''
		var skillname = $(this).html();
		var skillvalue = parseInt($(this).next().html().replace('<b>',''));
		if ($(this).next().find('img').attr('src') != undefined){
			skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
		}
		skillsum += skillvalue;
		players[pid][skillname] = skillvalue + skillarrow

		if($(this).next().html().indexOf('*') != -1) {
			skillchange.push(skillname)
		}
	})
	players[pid].sumskills	= skillsum
	players[pid].sorting	= skillsum
	players[pid].skchange	= (skillchange[0] != undefined ? skillchange.join(',') : '')

	// get player header info
	$('td#pl'+pid+' table').remove()
	var head = $('td#pl'+pid+' b:first').html()
	players[pid].rent		= (head.indexOf('в аренде из клуба') != -1 ? true : false)
	players[pid].natfull 	= head.split(' (матчей')[0].split(', ')[1]
	players[pid].value		= parseInt(head.split('Номинал: ')[1].split(',000$')[0].replace(/,/g,''))*1000
	players[pid].valuech	= 0
	players[pid].contract 	= parseInt(head.split('Контракт: ')[1])
	players[pid].wage 		= parseInt(head.split('г., ')[1].split('$')[0].replace(/,/g,''))

	team_cur.twage	+= players[pid].wage
	team_cur.tvalue	+= players[pid].value/1000
	team_cur.tsvalue+= players[pid].svalue/1000

	// Remove hided(autogen) player table
	$('table#pl' + pid).remove();
}

/**
 * Метод производит рассчет данных основного состава(плашка справа на странице команды)
 *
 */
function ShowVip() {
	Std.debug('Start --> ShowVip()');

	$('a#showvip').removeAttr('href');

	GetInfoPagePlVip();

	Std.debug('End --> ShowVip()');
}

function PrintRightInfo() {
	Std.debug('PrintRightInfo()')
	$('th#osform').html(parseFloat(team_cur.tform).toFixed(2) + '&nbsp;')
	$('th#osmorale').html(parseFloat(team_cur.tmorale).toFixed(2) + '&nbsp;')
	$('th#osage').html(parseFloat(team_cur.age).toFixed(2) + '&nbsp;')
}

/**
 * Print info into right block for VIP clients
 */
function PrintRightInfoVip() {
	Std.debug('Start --> PrintRightInfoVip()');

	const notvip ='<font color=BABDB6>для VIP</font>';

	$('th#osform').html(team_cur.tform + '&nbsp;');
	$('th#osmorale').html(team_cur.tmorale + '&nbsp;');
	$('th#osage').html(team_cur.age + '&nbsp;');
	$('th#osskills').html((team_cur.tss !== 0 ? team_cur.tss + '&nbsp;' : notvip));
	// calculate average sumSkills from top16 players
	$('th#osSkills16_th').html(team_cur.avTopSumSkills !== 0 ? team_cur.avTopSumSkills + '&nbsp;' : notvip)
	//$('th#ossvalue').html((team_cur.tsvalue!=0 ? ShowValueFormat(team_cur.tsvalue)+'т' : notvip));
	$('th#osnom').html((team_cur.tvalue!=0 ? ShowValueFormat(team_cur.tvalue)+'т' : notvip));
	$('th#nomch').html((sumvaluechange!= 0 ? '&nbsp;'+ShowChange(sumvaluechange) : notvip));
	$('th#oszp').html((team_cur.twage!=0 ? ShowValueFormat(team_cur.twage)+'&nbsp;' : notvip));

//	if(team_cur.tss!=0)	
	//$('a#teamskills').attr('href','javascript:void(ShowSkills(1))')
//	else $('a#teamskills').after('&nbsp;'+notvip)

	Std.debug('End --> PrintRightInfoVip()');
}

function EditFinance(){
	Std.debug('EditFinance()')
	var txt = $('table.layer1 td.l4:eq(1)').text().split(': ')[1]
	var txt2 = ''
	switch (txt){
		case 'банкрот': 				 txt2 += 'меньше 0';	break;
		case 'жалкое': 					 txt2 += '1$т-500$т';	break;
		case 'бедное': 					 txt2 += '500$т-2$м';	break;
		case 'удовлетворительное': 		 txt2 += '2$м-5$м';		break;
		case 'нормальное': 				 txt2 += '5$м-15$м';	break;
		case 'благополучное': 			 txt2 += '15$м-30$м';	break;
		case 'отличное': 				 txt2 += '30$м-50$м';	break;
		case 'богатое': 				 txt2 += '50$м-80$м';	break;
		case 'некуда деньги девать :-)': txt2 += 'больше 80$м';	break;
		default:
			var fin = parseInt(txt.replace(/,/g,'').replace('$',''))
			if 		(fin >  80000000)	{txt = 'некуда деньги девать';	txt2 = 'больше 80$м'}
			else if (fin >= 50000000)	{txt = 'богатое';				txt2 = '50$м-80$м'}
			else if (fin >= 30000000) 	{txt = 'отличное';				txt2 = '30$м-50$м'}
			else if (fin >= 15000000) 	{txt = 'благополучное';			txt2 = '15$м-30$м'}
			else if (fin >=  5000000) 	{txt = 'нормальное';			txt2 = '5$м-15$м'}
			else if (fin >=  2000000) 	{txt = 'удовлетворительное';	txt2 = '2$м-5$м'}
			else if (fin >=   500000) 	{txt = 'бедное';				txt2 = '500$т-2$м'}
			else if (fin >=		   0)	{txt = 'жалкое';				txt2 = '1$т-500$т'}
			else if (fin < 		   0)	{txt = 'банкрот';				txt2 = 'меньше 0'}
	}
	$('#finance1').html(txt)
	$('#finance2').html(txt2)
	team_cur.tfin = txt2
}


function ShowSkillsY() {
	Std.debug('ShowSkillsY()')
	switch (type){
		case 'num': 
			$('table#tblRostSkills img').attr('height','10').show();
			type = 'img'; break
		case 'img':
			$('table#tblRostSkills img').hide();
			type = 'num';break
		default:
			Std.debug('Error ShowSkillsY: unknown type:<'+type+'>')
	}
	$('table#tblRostSkills tr').each(function(){
		$(this).find('td:eq(1)').html(
			$(this).find('td:eq(1)').html().replace('<br>','&nbsp;')
		)
	})
}

function ShowPlayersValue() {
	Std.debug('ShowPlayersValue()')
	if (team_cur.tvalue === 0) return false
	if (nom) {
		nom = false
		var nomtext = ''
		var pls = players.sort(sValue)
		var sumval = 0
		var numpl = 0
		for(let i in pls) {
			numpl++
			sumval += pls[i].value
			var clss = ''
			var style = '';
			if (i == 15) style = ' style="border-bottom:1px black solid;"'
			if (i < 5)  clss = 'back3'//1
			var f1 = (pls[i].trash ? '<font color=#888A85>' : '')
			var f2 = (pls[i].trash ? '</font>' : '')
			nomtext += '<tr class="nom '+clss+'">'
			nomtext += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+' nowrap'+style+'>' +f1+ ShowShortName(pls[i].name).fontsize(1) +f2+ '</td>'
			nomtext += '<td align=right'+style+'>' + (ShowValueFormat(pls[i].value/1000) + 'т').fontsize(1) + '</td>'
			nomtext += (pls[i].valuech==0 ? '' : '<td>&nbsp;'+ShowChange(pls[i].valuech/1000)+'</td>')
			nomtext += '</tr>'
		}
		nomtext += '<tr class="nom"><td><i>'+('средняя').fontsize(1)+'</i></td><td align=right><i>'+(ShowValueFormat(parseInt(sumval/numpl)/1000) + 'т').fontsize(1)+'</i></td><td></td></tr>'
		$('#osnom').after(nomtext + '<tr class="nom"><td>&nbsp;</td></tr>')
	} else {
		nom = true
		$('tr.nom').remove()
	}
}

function ShowPlayersZp() {
	Std.debug('Start --> ShowPlayersZp()');
	if (team_cur.twage === 0) {
		return false
	}

	if (zp) {
		zp = false
		var text = ''
		var pls = players.sort(sZp)
		var sumzp = 0
		var plsnum = 0
		for(i in pls) {
			sumzp += pls[i].wage
			plsnum++
			var bgcolor = ''
			var f1 = (pls[i].trash ? '<font color=#888A85>' : '')
			var f2 = (pls[i].trash ? '</font>' : '')
			if(pls[i].contract==1) bgcolor = ' bgcolor=#FF9966' //red
			if(pls[i].contract==2) bgcolor = ' bgcolor=#FCE93B' //yellow
			if(pls[i].contract==5) bgcolor = ' bgcolor=#A3DE8F' //green
			text += '<tr id="zp">'
			text += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+' nowrap>' +f1+ ShowShortName(pls[i].name).fontsize(1) +f2+ '</td>'
			text += '<td align=right>' + (ShowValueFormat(pls[i].wage) + '&nbsp;').fontsize(1) + '</td>'
			text += '<td'+bgcolor+'>' + (pls[i].contract + (pls[i].contract == 5 ? 'л.' : 'г.')).fontsize(1) + '</td>'
			text += '</tr>'
		}
		Std.debug('ShowPlayersZp:sumzp='+sumzp)
		text += '<tr id="zp"><td><i>'+('средняя').fontsize(1)+'</i></td><td align=right><i>'+(ShowValueFormat(parseInt(sumzp/plsnum)) + '&nbsp;').fontsize(1)+'</i></td><td></td><tr>'
		$('#oszp').after(text + '<tr id="zp"><td>&nbsp;</td></tr>')
	}else{
		zp = true
		$('tr#zp').remove()
	}
}

function ShowPlayersAge(){
	Std.debug('ShowPlayersAge()')
	if(age) {
		age = false
		var text = ''
		var pls = players.sort(sAge)
		for(i in pls) {
			var f1 = (pls[i].trash ? '<font color=#888A85>' : '')
			var f2 = (pls[i].trash ? '</font>' : '')
			text += '<tr id="age"'+(pls[i].age<30 && pls[i].age>21 ? '' : ' class=back3')+'>'
			text += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+' nowrap>' 
			text +=  f1 + ShowShortName(pls[i].name).fontsize(1) + f2
			text += '</td>'
			text += '<td align=right>'+f1 + (pls[i].age+'&nbsp;').fontsize(1) + f2+'</td>'
			text += '</tr>'
		}
		$('#osage').after(text + '<tr id="age"><td>&nbsp;</td></tr>')
	} else {
		age = true
		$('tr#age').remove()
	}
}

function ShowPlayersSkillChange(){
	Std.debug('ShowPlayersSkillChange()')
	if(team_cur.tss == 0) return false
	if(sk) {
		sk = false
		var text = ''
		var pls = players.sort(sSkills)
		for(i in pls) {
			var f1 = (pls[i].trash ? '<font color=#888A85>' : '')
			var f2 = (pls[i].trash ? '</font>' : '')
			text += '<tr id="skills">'
			text += '<td'+(pls[i].rent ? ' bgcolor=#a3de0f' : '')+' nowrap>' 
			text +=  f1 + ShowShortName(pls[i].name).fontsize(1) + f2
			text += '</td>'
			text += '<td align=right>'+f1 + (pls[i].sumskills + '&nbsp;').fontsize(1) + f2 +'</td>'
//			text += '<td>' + (pls[i].contract + (pls[i].contract == 5 ? 'л.' : 'г.')).fontsize(1) + '</td>'
			if (pls[i].skchange != '') {
				var skillchange = pls[i].skchange.split(',')
				for(j in skillchange) {
					text += '<tr id="skills"><td align=right colspan=2><i>'+f1+(skillchange[j] + '&nbsp;').fontsize(1)
					text += (pls[i][skillchange[j]].split('.')[0] + '&nbsp;').fontsize(1) +f2+'</i></td>'
					if(pls[i][skillchange[j]].split('.')[1] != undefined) {
						text += '<td><img height="8" src="system/img/g/'+pls[i][skillchange[j]].split('.')[1]+'.gif"></img></td>'
					}
					text += '</tr>'
				}
			}
			text += '</tr>'
		}
		$('#osskills').after(text + '<tr id="skills"><td>&nbsp;</td></tr>')
	} else {
		sk = true
		$('tr#skills').remove()
	}
}
function ShowRoster(){
	Std.debug('ShowRoster()')
//	$('table[background]:eq(1)').show()
	$('table#tblSu').hide()
	$('table#tblSuM').hide()
	$('div#divSu').hide()

	$('table#tblRoster').show()
	$('table#tblRosterFilter').show()
}

function ShowSkills(param){
	Std.debug('ShowSkills:param='+param)
	if(param == 1){
//		$('table[background]:eq(1)').hide()
		//$('td#crabglobalright').html('')

		$('table#tblSu').hide()
		$('table#tblSuM').hide()
		$('div#divSu').hide()
		$('table#tblRoster').hide()
		$('table#tblRosterFilter').hide()
	}

	if(param == 2) type = (type=='img' ? 'num' : 'img')

}

function ShowHols(p){
	Std.debug('ShowHols:p='+p)
	sumH = (sumH ? false : true)
}

function ShowShortName(fullname){
	Std.debug('ShowShortName:fullname='+fullname)
	var namearr = fullname.replace(/^\s+/, "").replace(/\s+$/, "").split(' ')
	var shortname = ''
	for(n in namearr) {
		if(n==0){
			if(namearr[1] == undefined) shortname += namearr[n]
			else shortname += namearr[n][0] + '.'
		} else {
			shortname += namearr[n] + '&nbsp;'
		}
	}
	return shortname
}

/**
 * Fix value for displaying
 *
 * @param value
 * @returns {string}
 */
function ShowValueFormat(value) {
	if (value > 1000) {
		return (value/1000).toFixed(3).replace(/\./g,',') + '$';
	} else {
		return (value) + '$';
	}
}

function sSkills(i, ii) { // По SumSkills (убыванию)
    if 		(i.sorting < ii.sorting)	return  1
    else if	(i.sorting > ii.sorting)	return -1
    else								return  0
}
function sValue(i, ii) { // По value (убыванию)
    if 		(i.value < ii.value)	return  1
    else if	(i.value > ii.value)	return -1
    else							return  0
}
function sSValue(i, ii) { // По value (убыванию)
    if 		(i.svalue < ii.svalue)	return  1
    else if	(i.svalue > ii.svalue)	return -1
    else							return  0
}
function sZp(i, ii) { // По zp (убыванию)
    if 		(i.wage < ii.wage)	return  1
    else if	(i.wage > ii.wage)	return -1
    else						return  0
}
function sAge(i, ii) { // По zp (убыванию)
    if 		(i.age < ii.age)	return  1
    else if	(i.age > ii.age)	return -1
    else						return  0
}

function ShowChange(value,hide){
	if(value > 0) 		return '<sup><font color="green">+' + (hide ? ''  : value) + '</font></sup>'
	else if(value < 0)	return '<sup><font color="red">' 	+ (hide ? '-' : value) + '</font></sup>'
	else 		  		return ''
}

/**
 * Get average stat(field) from current team
 *
 * @param field Field name(for filter)
 * @param count how many players for your top u need, default = 16(11 +5)
 *
 * @return string
 */
function getAverageStatFromTopPlayersInTeam(field, count = 16) {
	// if somehow we don't have any players
	if (players.length === 0) {
		return '0';
	}

	let topSumSkills = 0;
	let playersSortedBySumSkills = players.sort(sSkills);

	for (let i = 0; i < count; i++) {
		let sumSkills = playersSortedBySumSkills[i][field];
		// if somehow we don't have 16 players
		topSumSkills += typeof sumSkills !== undefined ? sumSkills : 0;
	}

	let averageValue = topSumSkills / count;

	return parseFloat(averageValue.toString()).toFixed(2);
}
