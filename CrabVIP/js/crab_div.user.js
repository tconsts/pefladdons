// ==UserScript==
// @name           pefldivtable
// @namespace      pefl
// @description    division table page modification
// @include        http://*pefl.*/plug.php?p=refl&t=s&*
// @encoding	   windows-1251
// ==/UserScript==

deb = (localStorage.debug == '1' ? true : false)
var debnum = 0
var db = false
var teams = []
var divs = []
var div_cur = {}
var m = []
var value = []
var save  = false
var save2 = false
var mon = false
var mon_mark = '<img height=10 src="system/img/g/tick.gif">'
var imgok = '<img height=10 src="system/img/g/tick.gif">'
var sh = {} 
	sh.teams = true
	sh.sum = false
	sh.srd = false
var list2 = {
	'teams': {
		'tid':	{'num':1,'nshow':true,'type':'int'},
		'my':	{'num':2,'nshow':true},
		'did':	{'num':3,'nshow':true,'type':'int'},
		'num':	{'num':4,'nsel':true,'name':'�','com':'(�����)'},
		'tdate':{'num':5,'nsel':true,'name':'����'},
		'tplace':{'num':6,'name':'�','al':'left','type':'int','com':'(�����)'},
		'ncode':{'num':7, 'nsel':true,'name':'���','type':'int'},
		'nname':{'num':8, 'name':'������','nsel':true,'al':'left'},
		'tname':{'num':9, 'name':'�������',	'al':'left'},
		'mname':{'num':10, 'name':'��������','al':'left'},
		'ttask':{'num':11, 'name':'������',	'al':'left','type':'int'},
		'tvalue':{'num':12,'name':'���', 'type':'int','com':'<sup><font color=red>vip</font></sup>'},
		'twage':{'num':13, 'name':'��',	'nsel':true, 'type':'int','com':'<sup><font color=red>vip</font></sup>'},
		'tss':	{'num':14, 'name':'��','type':'float','com':'<sup><font color=red>vip</font></sup>'},
		'age':	{'num':15, 'name':'����','nsel':true,'type':'float'},
		'pnum':	{'num':16, 'name':'���','nsel':true,'type':'int','com':'(���-��)'},
		'tfin':	{'num':17, 'name':'���','nsel':true,'al':'left'},
		'screit':{'num':18,'name':'������','nsel':true,'al':'left'},
		'scbud':{'num':19, 'name':'�����','nsel':true,'type':'int'},
		'ttown':{'num':20, 'name':'�����','nsel':true,'al':'left'},
		'sname':{'num':21, 'name':'�������','nsel':true,'al':'left'},
		'ssize':{'num':22, 'name':'������','nsel':true,'type':'int'},
		'mid':  {'num':23, 'nshow':true,'type':'int'},
		'tform':  {'num':24,'name':'�����','nsel':true,'type':'float'},
		'tmorale':{'num':25,'name':'������','nsel':true,'type':'float'},
		'tsvalue':{'num':26,'name':'���+','nsel':true,'type':'int','com':'<sup><font color=red>vip</font></sup>'},
		'cast1':{'num':27,'name':'����1','nsel':true,'al':'left'},
		'cast2':{'num':28,'name':'����2','nsel':true,'al':'right'},
		'dname':{'num':29,'name':'��������','nsave':true,'nsel':true,'al':'left'},
		'tprize':{'num':30,'name':'����','nsave':true,'nsel':true},
		'dnum': {'num':31,'nsave':true,'nshow':true},
		'timg':	{'num':32,'name':'����','nsave':true,'nsel':true},
		'nomzp':{'num':33,'name':'�/��','nsave':true,'nsel':true,'com':'<sup><font color=red>vip</font></sup>'},
		'zpnom':{'num':34,'name':'��/�','nsave':true,'nsel':true,'com':'<sup><font color=red>vip</font></sup>'},
		'games':{'num':35,'name':'�&nbsp;','nsave':true,'nsel':true,'com':'(���)'},
		'wins':	{'num':36,'name':'�&nbsp;','nsave':true,'nsel':true,'com':'(���)'},
		'draws':{'num':37,'name':'�&nbsp;','nsave':true,'nsel':true,'com':'(���)'},
		'loses':{'num':38,'name':'�&nbsp;','nsave':true,'nsel':true,'com':'(���)'},
		'gup':	{'num':39,'name':'��','nsave':true,'nsel':true,'com':'(������)'},
		'gdown':{'num':40,'name':'��','nsave':true,'nsel':true,'com':'(����)'},
		'gpm':	{'num':41,'name':'+-','nsave':true,'nsel':true,'com':'(����)'},
		'score':{'num':42,'name':'�&nbsp;','nsave':true,'nsel':true,'com':'(����)'},
		'hide':	{'num':43,'name':'���','nsave':true,'nsel':true,'al':'center','com':'(������)'},
		'del':	{'num':44,'name':'���','nsave':true,'nsel':true,'al':'center','com':'(����)'}
		},
	'divs':{
		'did':	{'num':1, 'name':'id'},
		'my':	{'num':2, 'name':'my'},
		'dnum':	{'num':3, 'name':'dnum'},
		'nname':{'num':4, 'name':'������'},
		'dname':{'num':5, 'name':'���'},
		'drotate':{'num':6, 'name':'+-'},
		'drotcom':{'num':7, 'name':'������'},
		'dprize': {'num':8, 'name':'��������'},
		'color':  {'num':9, 'name':'��������'},
		'numteams':{'num':10, 'name':'NumTeams'},
		'curtour':{'num':11, 'name':'CurTour'}}
}

function FixColors(){
	$('td.back4 table table:first tr').removeAttr('bgcolor')
	$('td.back4 table table tr:odd').addClass(fixclass)		          
}

var tasks	= ['','�����������','����� � ������ �.','������','���� ������������','���� ����','������� � 3�','������� � �������','������� � �������','15 �����','�� ��������']
var schools	= ['','����� ������','������','�������','�������','��������','�������� ������','���� �� ������ � ����']

var showfl = false
//var filt = {}
var srt = ''
var srtn = true

var diap = []
var url = {}
var def = '1-1=FCE94F,2-2=white,3-3=E9B96E'

//document.addEventListener('DOMContentLoaded', function(){
$().ready(function() {

	fixclass = 'back2' // ��������� ��� bgcolor=#a3de8f �� ���� �����
    FixColors()
	
	var bbig = false
	if($('table:eq(0)').attr('width')>=1000) {
		bbig = true
		$('table.border:eq(2)').attr('width',$('table:eq(0)').attr('width')-200)
	}

   	ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
	today = new Date()
	today = check(today.getDate()) + '.'+check(today.getMonth()+1)
	rseason = UrlValue('f',$('td.back4 a[href^="plug.php?p=refl&t=s&v=y&h=0&j="]:last').attr('href'))
	dseason = UrlValue('f')

	// add column with goals +/- (will be include to code for forum)
	PlusMinus();

	// Select as bold self team in my table with id=0
	if( UrlValue('k') && UrlValue('k')!=0) SelectTeam(UrlValue('k'))

	// Draw CrabVIP panel
	var preparedhtml = ''
	preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr><td width='+(bbig ? 0 : 200)+' id="crabgloballeft" valign=top></td><td id="crabglobalcenter" valign=top></td><td id="crabglobalright" width=200 valign=top>'
	preparedhtml += '<table id="crabrighttable" class=back3 width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
	preparedhtml += '</td></tr></table>'
	$('body table.border:last').before(preparedhtml)
	$('td.back4 script').remove()
	$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
	$('#crabrighttable').addClass('border') 

	GetInfoPageDiv()
	var text = '<table width=100%>'
	text += '<tr id="color"><td><a id="colorit" href="">����������</a>&nbsp(<a href="javascript:void(ColorDel())">x</a>)</td></tr>'
	text += '<tr id="CodeTableForForum"><td><a href="javascript:void(TableCodeForForum())">��� ��� ������</a>&nbsp;</td></tr>'
	text += '<tr id="trmon"><td id="tdmon"><a id="amon" href="javascript:void(Monitor())">���������� ������</a></td></tr>'
	text += '</table><br>'

	text += '<table width=100%>'
	text += '<tr id="showteams"><td colspan=4><a id="teams_cur" href="javascript:void(Print(\'teams\'))">��������&nbsp;�������</a></td><td>(<a id="tfilter" href="javascript:void(SetFilter(\'teams\'))">'+('������').fontsize(1)+'</a>)</td></tr>'
	text += '</table><br>'
/**	if(deb){
		text += '<table width=100% class="debug">'
		text += '<tr id="showdivs"><td><a id="divs" href="javascript:void(Print(\'divs\'))">debug:���������</a></td></tr>'
		text += '</table>'
	}/**/
	$("#crabright").html(text)

	GetData('teams')
	GetData('divs')

}, false);

function MarkDiv(mdid) {
	debug('MarkDiv:'+mdid)
	var dp = checkDiv(mdid)
	if(dp==''){
		value.push(mdid)
		$('td#div'+mdid).html(imgok)
	}else{
		value[dp] = null
		$('td#div'+mdid).html('')
	}
}

function Monitor(){
	debug('Monitor:'+!mon+':'+div_cur.did+':'+div_cur.nname)
	if(!mon){
		mon = true
		save = true
		$('td#tdmon').append(' ('+mon_mark+')')
		SaveData('divs')
		SaveData('teams')
	}else{
		mon = false
		save = true
		$('td#tdmon').html($('td#tdmon').find('img').remove().end().html().replace(' ()',''))
		var divs2 = []
		for(i in divs) if(divs[i].nname!=div_cur.nname) divs2[i] = divs[i]
		divs = divs2
		SaveData('divs')

		var teams2 = []
		for(i in teams) if(teams[i].nname!=div_cur.nname) teams2[i]=teams[i]
		teams = teams2
		SaveData('teams');
	}
	SetFilter('teams');
	SetFilter('teams');
}

function DelCountry(countryname) {
	var divs2 = [];
	for(i in divs) if(divs[i].nname!=countryname) divs2[i] = divs[i];
	divs = divs2;
	SaveData('divs');

	var teams2 = [];
	for(i in teams) if(teams[i].nname!=countryname) teams2[i]=teams[i];
	teams = teams2;
	SaveData('teams');

	SetFilter('teams');
	SetFilter('teams');
}

function checkDiv(mdid){
	for(p in value) if(mdid==value[p]) return p
	return '';
}
function ShowType(type){
	if(sh[type]) {
		sh[type] = false
		$('td#'+type).html('')
	}else {
		sh[type] = true
		$('td#'+type).html(imgok)
	}
}
function SetFilter(dataname){
	debug('SetFilter go: '+ !showfl)
	if(showfl){
		showfl = false
		$('tr.fl').remove()
	}else{
		showfl = true
		var head = []
		for (i in list2[dataname]) {
			if(!list2[dataname][i].nshow) {
				head[list2[dataname][i].num] = {'key':i,'name':list2[dataname][i].name}
			}
		}

		var text = ''
		srt = 'nname'
		divs = divs.sort(sSortR)
		var dn = ''
		for(i in divs) {
			var dvi = divs[i]
			if(dvi.dname!=''){
				if(dn!=dvi.nname) {
					text += '<tr class="fl"><td></td><td colspan=4>'+(dvi.nname).fontsize(1)+' <a href="javascript:void(DelCountry(\''+dvi.nname+'\'))"><font color=red><b>x</b></font></a></td></tr>';
					dn = dvi.nname
				}
				text += '<tr class="fl"><td></td>'
				text += '<td id="div'+dvi.did+'">'+(checkDiv(dvi.did)=='' ? '' : imgok)+'</td>'
				text += '<td colspan=3><a href="javascript:void(MarkDiv(\''+dvi.did+'\'))">'+(dvi.dname).fontsize(1)+'</a></td>'
				text += '</tr>'
			}
		}
		text += '<tr class="fl"><td width=10%></td><td colspan=4 width=white><hr></td></tr>'
		text += '<tr class="fl"><td></td><td align=right id=teams>'+(sh['teams']? imgok :'')+'</td><td colspan=3><a href="javascript:void(ShowType(\'teams\'))">'+('�������').fontsize(1)+'</a></td></tr>'
		text += '<tr class="fl"><td></td><td align=right id=sum>'+(sh['sum']? imgok :'')+'</td><td colspan=3><a href="javascript:void(ShowType(\'sum\'))">'+('����� �� ����').fontsize(1)+'</a></td></tr>'
		text += '<tr class="fl"><td></td><td align=right id=srd>'+(sh['srd']? imgok :'')+'</td><td colspan=3><a href="javascript:void(ShowType(\'srd\'))">'+('������� �� ����').fontsize(1)+'</a></td></tr>'
		text += '<tr class="fl"><td width=10%></td><td colspan=4 width=white><hr></td></tr>'
		var p = 0
		for(i in head){
			text += (p%2 ? '' : '<tr class="fl"><td></td>')
			text += '<td align=right id='+head[i].key+'>'+(!list2[dataname][head[i].key].nsel || list2[dataname][head[i].key].nsel==undefined ? imgok : '')+'</td>'
			text += '<td><a href="javascript:void(SetHead(\''+dataname+'\',\''+head[i].key+'\'))">'+(head[i].name+(list2[dataname][head[i].key].com!=undefined?list2[dataname][head[i].key].com:'')).fontsize(1)+'</a></td>'
			text += (p%2 ? '</tr>' : '')
			p++
		}
		text += '<tr class="fl"><td width=10%></td><td colspan=4 width=white><hr></td></tr>'
		$('tr#showteams').after(text)
	}
}

function ClosePrint(){
	$('table#svod, div#svod').remove()
	$('table#orig').show()	
}

function sSort(i, ii) { //�� �������� � ��������
    if 		(i[srt] < ii[srt])	return  1
    else if	(i[srt] > ii[srt])	return -1
    else						return  0
}

function sSortR(i, ii) { //������, �� �������� � ��������
    if 		(i[srt] > ii[srt])	return  1
    else if	(i[srt] < ii[srt])	return -1
    else						return  0
}

function DeleteTeam(teamid){
	debug('DeleteTeam('+teamid+'):'+typeof(teamid))
	var teams2 = []
	for (i in teams) if(teams[i].tid!=teamid) teams2[i] = teams[i]
	teams = teams2
	Print('teams')
	SaveData('teams')
}

function HideTeam(teamid){
	debug('HideTeam('+teamid+'):'+typeof(teamid))
	var teams2 = []
	for (i in teams) if(teams[i].tid!=teamid) teams2[i] = teams[i]
	teams = teams2
	Print('teams')
	//SaveData('teams')
}

function Print(dataname, sr){
	ClosePrint()
	debug('Print:'+dataname+':'+sr)
	var name = 'did'
//	for(p in value) debug('p'+value[p])
	$('td.back4 table table').attr('id','orig').hide()

	var head = []
	for (i in list2[dataname]) {
		var lsti = list2[dataname][i]
		if(!lsti.nshow) {
			head[lsti.num] = {'key':i,'name':lsti.name,'al':(lsti.al!=undefined ? ' align='+lsti.al : ''),'type':(lsti.type!=undefined ? lsti.type : '')}
		}
	}

	var data = []
	switch (dataname){
//		case 'players': data = players;	break
		case 'teams': 	data = teams;	break
		case 'divs'	: 	data = divs;	break
		default: return false
	}
	if(sr==srt)	srtn = (srtn ? false : true)
	else srt = (srt =='' || srt =='nname'? 'tplace' : sr)

	for(i in data) for(j in head) {
		if(data[i][head[j].key]==undefined) data[i][head[j].key] = ''
		if(head[j].type=='float')	data[i][head[j].key] = (!isNaN(parseFloat(data[i][head[j].key])) ? parseFloat(data[i][head[j].key]) : '')
		if(head[j].type=='int')		data[i][head[j].key] = (!isNaN(parseInt(data[i][head[j].key])) ? parseInt(data[i][head[j].key]) : '')
	}

//	for(i in data) debug('d1'+typeof(data[i]['nomzp'])+data[i]['nomzp'])
	data = (srtn ? data.sort(sSort) : data.sort(sSortR))
//	for(i in data) debug('d2'+typeof(data[i]['nomzp'])+data[i]['nomzp'])	  

	var text = ''
	text += '<table width=100% id="svod" border="0" cellpadding="4" cellspacing="2"><tr align=left>'
	for(j in head) {
		if(list2[dataname][head[j].key].nsel!=true && head[j].key!='timg') {
			text += '<th>'
			text += '<a class="f" href="javascript:void(Print(\''+dataname+'\',\''+head[j].key+'\'))">'
			text += head[j].name
			text += (head[j].key==srt ? '*' : '')
			text += '</a>'
			text += '</th>'
		}
	}
	text+= '</tr>'
	var num=1
	for(i in data){
		var show = true
		var dti = data[i]
		var shownum = 0
		if(name!=undefined && value!=undefined) for(p in value) if(dti[name]==value[p]) shownum++
		if(shownum==0 || (dti.divsum==undefined && dti.divsrd==undefined && !sh.teams) || (dti.divsum && !sh.sum) || (dti.divsrd && !sh.srd))  show = false
//		debug('p'+dti.tname+':'+dti.divsum+':'+dti.divsrd)
		if(show){
			text += '<tr align=right>'
			for(j in head) if(list2[dataname][head[j].key].nsel!=true && head[j].key!='timg') {
				var tt = dti[head[j].key]
				var al = ''
//				debug(head[j].key+':'+tt)
				if(tt == undefined || tt==''){
//					debug(head[j].key+':'+tt)
					switch (head[j].key){
						case 'cast1':
						case 'cast2': tt = '<a class="'+head[j].key+'" id="'+dti.tid+'_'+head[j].key+'" href="javascript:void(AddInfo('+dti.tid+',\''+head[j].key+'\','+i+'))"><b>+</b></a> ';
								break;
						default: tt = '&nbsp;';
					}
				} else {
//					debug(head[j].key+':'+tt)
					switch (head[j].key){
						case 'tname':
							tt = (list2[dataname]['timg'].nsel ? '' : '<img class="imgteam" src="system/img/club/'+dti['tid']+'.gif" height=12>&nbsp;') + tt
							tt = (dti['thash']!=undefined ? '<a href="plug.php?p=refl&t=k&j='+dti['tid']+'&z='+dti['thash']+'">'+tt+'</a>' : (dti['div']==undefined ? '<font color=3465A4>' + tt + '</font>': tt))
							break;
						case 'mname':
							tt = (dti['mid']==undefined || dti['mid']=='' ? tt : '<a href="users.php?m=details&id='+dti['mid']+'">'+tt+'</a>')
							break;
						case 'tvalue':
						case 'tsvalue':
						case 'tprize':	tt = ShowValueFormat(tt)+'�';break;
						case 'twage':	tt = ShowValueFormat(tt);break;
						case 'nomzp':	tt = (isNaN(tt) ? '' : (tt/100).toFixed(2));break;
						case 'zpnom':	tt = (isNaN(tt) ? '' : ShowValueFormat(tt*10));break;
						case 'ncode':	tt = '<img height=12 src="system/img/flags/mod/'+tt+'.gif">';break;
						case 'tplace':	tt = '<font color=3465A4><u>'+parseInt((1000 - tt - dti['dnum']*100))+'</u></font>';break;
						case 'tdate':	tt = (tt==today ? ' ' : tt);break;
						case 'ttask':	tt = (tasks[tt]!=undefined ? tasks[tt] : tt);break;
						case 'screit':	tt = (schools[tt]!=undefined ? schools[tt] : tt);break;
						case 'num':		tt = num;break;
						case 'del':		tt = '<a class="del" href="javascript:void(DeleteTeam('+dti.tid+'))">�</a> ';break
						case 'hide':	tt = '<a class="hide" href="javascript:void(HideTeam('+dti.tid+'))">&ndash;</a> ';break
						case 'cast1':
						case 'cast2': 	tt = tt+' '+'<a class="'+head[j].key+'" id="'+dti.tid+'_'+head[j].key+'" href="javascript:void(AddInfo('+dti.tid+',\''+head[j].key+'\','+i+'))"><b>*</b></a> '
										break;
						default:
							if(head[j].type=='float') tt = tt.toFixed(2)
					}
				}
				text += '<td'+head[j].al+'>'+tt+'</td>';
			}
			text += '</tr>'
			num++
		}
	}
	text += '</table>'
	text += '<div align=right id="svod"><a href="javascript:void(ClosePrint())">(�������)&nbsp;</a></div>'
	$('table#orig').before(text)
	$('table#svod tr:even:gt(0)').attr('bgcolor','#A3DE8F')
//	ColorIt()
	if(save2){
		save2 = false;
		SaveData('divs');
	}
}

function AddInfo(itid,icast,ii){
	var prres = prompt('�������� ������', '');
	if(prres!=null && prres!='') {
		$('#'+itid+'_'+icast).parent().html(prres);
		teams[ii][icast] = prres;
		debug(teams[ii]['tid'] + ' '+teams[ii][icast]);
		SaveData('teams');
	}
}

function ShowValueFormat(value){
	if (value > 1000)	return (value/1000).toFixed(3).replace(/\./g,',') + '$'
	else				return (value) + '$'
}

function SetHead(dataname, name){ // teams, nname
	var imgok = '<img height=10 src="system/img/g/tick.gif">'

	if(!list2[dataname][name].nsel || list2[dataname][name].nsel==undefined) {
		list2[dataname][name].nsel = true
		$('td#'+name).html('')
	}
	else {
		list2[dataname][name].nsel = false
		$('td#'+name).html(imgok)
	}
	save2 = true
}

function GetFinish(type, res){
	debug(type + '(' + res + ')')
	m[type] = res;

	if(m.cm==undefined && m.get_teams!=undefined && m.get_pgdivs && m.get_divs!=undefined){
		m.cm = true
		CheckMy()
	}
	if(m.divs==undefined && m.get_divs!=undefined && m.get_pgdivs && m.checkmy){
		m.divs = true
		ModifyDivs()
		ColorIt()
	}
	if(m.teams==undefined && m.get_teams!=undefined && m.get_pgdivs && m.md_divs){
		m.teams = true
		ModifyTeams()
	}
	if(m.shdel==undefined && m.get_divs!=undefined && m.get_teams!=undefined){
		m.shdel = true
		if(mon) $('td#tdmon').append(' ('+mon_mark+')')
	}
}

function CheckMy(){
	if(typeof(divs[div_cur.did])!='undefined'){
		mon = true
		save = true
	}
	for(i in teams){
		if(teams[i].nname==div_cur.nname) {
			save = true
			if(!mon){
				//$('td#monitor').prepend(mon_mark)
				mon = true
			}
		}
		if(teams[i].did==div_cur.did && teams[i].my) {
			div_cur.my = true
			for(g in divs) delete divs[g].my
			divs[div_cur.did].my = true
		}
	}
	GetFinish('checkmy', true)
}

function SaveData(dataname){
	debug(dataname+':SaveData')
	if(!save || (rseason!=dseason) || parseInt(UrlValue('h'))>=0) {
		debug(dataname+':SaveData false')
		return false
	}
	var data = []
	var idname = 'id'
//	var head = list[dataname].split(',')
	var head = []
	for (i in list2[dataname]) {
		if(!list2[dataname][i].nsave) head[list2[dataname][i].num-1] = i;
	}
	switch (dataname){
		case 'players':	data = players;				break
		case 'teams': 	data = teams;idname='tid';	break
		case 'divs': 	data = divs; idname='did';	break
		default: 		debug('dataname wrong'); return false
	}
	if(ff) {
		var text = ''
		for (var i in data) {
			text += (text!='' ? '#' : '')
			if(typeof(data[i])!='undefined' && data[i].div==undefined) {
				var dti = data[i]
				var dtid = []
				for(var j in head){
					dtid.push(dti[head[j]]==undefined ? '' : dti[head[j]])
				}
				text += dtid.join('|')
			}
		}
		localStorage[dataname] = text
	}else{
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE IF EXISTS "+dataname,[],
				function(tx, result){debug(dataname+':drop ok')},
				function(tx, error) {debug(error.message)}
			);                                           
			tx.executeSql("CREATE TABLE IF NOT EXISTS "+dataname+" ("+head+")", [],
				function(tx, result){debug(dataname+':create ok')},
				function(tx, error) {debug('db table create error: '+error.message);debug(JSON.stringify(head))}
			);
			for(var i in data) {
			  if(data[i].div==undefined){
				var dti = data[i]
				var x1 = []
				var x2 = []
				var x3 = []
				for(var j in head){
					x1.push(head[j])
					x2.push('?')
					x3.push((dti[head[j]]==undefined ? '' : dti[head[j]]))
				}
				if(x3[0]==43) debug(dataname+':s'+x1[0]+'|'+x1[9]+'|'+x1[10]);
				if(x3[0]==43) debug(dataname+':s'+x3[0]+'|'+x3[9]+'|'+x3[10]);
				tx.executeSql("INSERT INTO "+dataname+" ("+x1+") values("+x2+")", x3,
					function(tx, result){},
					function(tx, error) {debug(dataname+':insert('+i+') error:'+error.message);
				});
			  }
			}
		});
	}
}

function GetData(dataname){
	debug(dataname+':GetData')
	var data = []
	var idname = 'id'
//	var head = list[dataname].split(',')
	var head = []
	for (i in list2[dataname]) {
		if(!list2[dataname][i].nsave) head[list2[dataname][i].num-1] = i	
	}
	switch (dataname){
		case 'players': data = players2;			break
		case 'teams': 	data = teams;idname='tid';	break
		case 'divs'	: 	data = divs; idname='did';	break
		default: return false
	}
	if(ff) {
		var text1 = String(localStorage[dataname])
		if (text1 != 'undefined'){
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
			GetFinish('get_'+dataname, true)
		} else {
			GetFinish('get_'+dataname, false)
		}			
	}else{
		if(!db) DBConnect()
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM "+dataname, [],
				function(tx, result){
					debug(dataname+':Select ok')
					for(var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i)
						var id = row[idname]
						data[id] = {}
						for(j in row) data[id][j] = row[j]
//						debug(dataname+':g'+id+':'+data[id].my)
					}
					GetFinish('get_'+dataname,true)
				},
				function(tx, error){
					debug(error.message)
					GetFinish('get_'+dataname, false)
				}
			)
		})
	}
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*10);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}

function ModifyTeams(){
	debug('teams: ModifyTeams go')
	var zag = {}
	$('td.back4 table:first table:first tr:eq(0) th').each(function(i, val){
		zag[$(val).text().split('\n')[0]] = i
	})
//	for (i in zag) debug(i+':'+zag[i])
	$('td.back4 table:first table:first tr:gt(0)').each(function(i, val){
		var id = parseInt(UrlValue('n',$(val).find('a:has(u)').attr('href')))
		if(typeof(teams[id])=='undefined') {
			teams[id] = {}
			teams[id].tid = id
			teams[id].tname = $(val).find('a[href^="plug.php?p=refl&t=k&j='+id+'&z="]').text()
		}
		teams[id].games = $(val).find('td:eq('+zag['�']+')').text()
		teams[id].wins 	= $(val).find('td:eq('+zag['�']+')').text()
		teams[id].draws	= $(val).find('td:eq('+zag['�']+')').html()
		teams[id].loses	= $(val).find('td:eq('+zag['�']+')').html()
		teams[id].gup	= $(val).find('td:eq('+zag['��']+')').html()
		teams[id].gdown	= $(val).find('td:eq('+zag['��']+')').html()
		teams[id].gpm	= $(val).find('td:eq('+zag['+-']+')').html()
		teams[id].score	= $(val).find('td:eq('+zag['�']+')').html()
		teams[id].thash = UrlValue('z',$(val).find('a[href^="plug.php?p=refl&t=k&j='+id+'&z="]').attr('href'))
		teams[id].tplace= 1000-div_cur.dnum*100-i-1
		teams[id].did   = div_cur.did
		teams[id].nname = div_cur.nname
	})
	for (i in teams){
		teams[i].num = i
		teams[i].del = i
		teams[i].hide = i
		teams[i].timg = i
		teams[i].nomzp = (teams[i]['twage']==0 || teams[i]['twage']=='' ? '' : parseInt((teams[i]['tvalue']/teams[i]['twage'])*100));
		teams[i].zpnom = (teams[i]['tvalue']==0 || teams[i]['tvalue']=='' ? '' : parseInt((teams[i]['twage']/teams[i]['tvalue'])*100));
		var tmi = teams[i]
		tmi.tprize = ''
		if(tmi.did!='' && typeof(divs[tmi.did])!='undefined' && typeof(divs[tmi.did]['dprize'])!='undefined' && divs[tmi.did]['dprize']!='') {
			tmi.tprize = parseInt((divs[tmi.did].dprize).split(',')[1000-divs[tmi.did].dnum*100-tmi.tplace-1])
			if(isNaN(tmi.tprize)) tmi.tprize = 0
//			debug(tmi.tid+':'+tmi.tprize)
		}
		if(tmi.did!='' && divs[tmi.did]!=undefined) {
			tmi.dname = divs[tmi.did].dname
			tmi.dnum = divs[tmi.did].dnum
		}
	}
	for (i in teams){
		var tmi = teams[i]
		if(tmi.did!='' && !isNaN(parseInt(tmi.tvalue))){
//			debug('tid:'+i+' did:'+tmi.did)
			if(typeof(teams[parseInt(tmi.did)+10000])=='undefined') teams[parseInt(tmi.did)+10000] = {}
			if(typeof(teams[parseInt(tmi.did)+20000])=='undefined') teams[parseInt(tmi.did)+20000] = {}
			var tmd = teams[parseInt(tmi.did)+10000]
			var tms = teams[parseInt(tmi.did)+20000]
			tmd.div = (tmd.div==undefined ? 1 : tmd.div+1)
			tms.div = tmd.div
            tmd.divsum = true
            tms.divsrd = true
			for(p in tmi) {
				switch(p){
					case 'tname':
						tmd[p] = '<b>�����</b> ('+tmd.div+')';
						tms[p] = '<b>�������</b> ('+tms.div+')';
						break;
					case 'did':
					case 'dname':
					case 'nname':
					case 'ncode':
					case 'num':
						tmd[p] = tmi[p];
						tms[p] = tmi[p];
						break;
					case 'tvalue':
					case 'twage':
					case 'tprize':
					case 'ssize':
					case 'pnum':
						tmd[p] = (tmd[p]==undefined ? parseInt(tmi[p]) : tmd[p] + parseInt(tmi[p]));
						tms[p] = (tmd[p]/tms.div).toFixed(2)
						break;
					case 'tss':
					case 'age':
					case 'zpnom':
					case 'nomzp':
						tmd[p] = (tmd[p]==undefined ? parseFloat(tmi[p]) : tmd[p] + parseFloat(tmi[p]));
						tms[p] = (tmd[p]/tms.div).toFixed(2)
						break;
					default:
				}
			}
		}
	}

	GetFinish('md_teams',true)
	SaveData('teams')
}

function ModifyDivs(){
	debug('divs: ModifyDivs go')
	value.push(div_cur.did)
	var divt = []
	var id = div_cur.did
	if(typeof(divs[id])=='undefined') divs[id] = {}
	if(div_cur.curtour==0) div_cur.curtour='0'
	for(var i in div_cur){
		divt[i] = (div_cur[i] != '' ? div_cur[i] : (typeof(divs[id][i])!='undefined' ? divs[id][i] : ''))
	}
	divs[id] = divt
	if(divs[id].drotcom!='') $('td.back4 table:eq(1)').after('<br><i><b>�������� �� ������ � ��������� ������ ����� �����������</b>:<br>*'+divs[id].drotcom+'</i><br>')

	GetFinish('md_divs',true)
	SaveData('divs')
}

function GetInfoPageDiv(){
	debug('GetInfoDivs')
	div_cur.nname = $('td.back4 td.back1').text().split(', ')[0]
	div_cur.dname = $('td.back4 td.back1').text().split(', ')[1]
	div_cur.my = ''
	div_cur.nt = parseInt($('td.back4 table:first table:first tr:last u').html())
//	debug('nt='+div_cur.nt)
	$('a[href*="p=refl&t=s&k=0&"]').each(function(i, val){
		if($(val).text() == div_cur.dname) {
			div_cur.dnum = i+1
			div_cur.did = parseInt(UrlValue('j',$(val).attr('href')))
		}
	})
	div_cur.dprize  = ''
	div_cur.drotate = ''
	div_cur.drotcom = ''
	div_cur.color = ''
	div_cur.curtour = parseInt($('td.back4 table:first table:first tr td:has(a[href^="plug.php?p=refl&t=k&j="]):first').next().text())
	div_cur.numteams= parseInt($('a[href^="plug.php?p=refl&t=s_graph&j="]:last u').text())
	debug('cur&num:'+div_cur.curtour+':'+div_cur.numteams)

	GetFinish('get_pgdivs',true)
}

function ShowPriz(x){
	var y = x.split('-')
	$('td.back1 span.text2b').append(' (��������)')
	$('td.back4 table table th[width=13%]').before('<th>��������\n\t')
	$("td.back4 table table tr:gt(0)").each(function(i,val){
		var htm = 	'<td align=right>'
		htm += 		(y[i] == undefined || y[i] == 0 ? 0 : y[i]+',000')
		htm += 		'$</td>'
		$(val).find('td:has(u)').before(htm)
	})
	$('div[id^="show"] a').removeAttr('href')
}

function getCookie(name) {
    var pattern = "(?:; )?" + name + "=([^;]*);?"
    var regexp  = new RegExp(pattern)
    if (regexp.test(document.cookie)) return decodeURIComponent(RegExp["$1"])
    return false
}

function PlusMinus(){
	$('td.back4 table table th[width="7%"]').attr('width','6%')
	$('td.back4 table table th[width="13%"]').attr('width','11%')
	$('td.back4 table table th[width="44%"]').attr('width','41%')
	$('th:last').before('<th width="6%">+-\n\t').append('\n')
	$('th:contains(�)').parent().parent().find('tr').each(function(){
		var gz = +$(this).find('td:last').prev().prev().text()
		var gp = +$(this).find('td:last').prev().text()
		var td  = '<td>' +  (gz > gp ? '+' : '') + (gz-gp) + '</td>'
		$(this).find('td:last').before(td)
	})
}

function ColorIt(){
	debug('ColorIt div_cur.did:'+div_cur.did)
	debug('ColorIt divs[div_cur.did].color:'+divs[div_cur.did].color)
//	for( i in divs) debug('ColorIt:'+divs[i].did+':'+divs[i].nname)
	diap[div_cur.did] = []	

	if(divs[div_cur.did].color == '' || divs[div_cur.did].color==null){
//		debug('empty'+divs[div_cur.did].color)
		if (getCookie('pefltables')) {
			var dp = getCookie('pefltables').replace(/\!/g,'=').split('.')	// '43*1-2!white*3-6!FCE94F*15-26!BABDB6.44*1-2!white*18-22!BABDB6'
			for (var p in dp) {
				//debug(dp[p])
				var name = parseInt(dp[p].split('*',1)[0])
				var key = dp[p].split('*')
				key.shift()
				if(typeof(divs[name])=='undefined') divs[name] = {}
				divs[name].color = key.join(',')
			}
			SaveData('divs')
		}
	}

	if(divs[div_cur.did].color == '' || divs[div_cur.did].color==null){
		var dr = (divs[div_cur.did].drotate!='' ? divs[div_cur.did]['drotate'].split(',') : false)
		debug('ColorIt dr:'+dr)
		if(dr!=false){
			if(dr[0]==0) {
//				debug('ColorIt:'+'champ')
				diap[div_cur.did].push('1-1=FCE94F')
				diap[div_cur.did].push('2-2=white')
				diap[div_cur.did].push('3-3=E9B96E')
			}else{
				diap[div_cur.did].push('1-'+dr[0]+'=white')
			}
			diap[div_cur.did].push((div_cur.nt-dr[1]+1)+'-'+div_cur.nt+'=BABDB6')
//			debug('dr[1]='+dr[1]+':'+div_cur.nt+':'+diap[div_cur.did][diap[div_cur.did].length-1])
		}
	}else{
		var str = String(divs[div_cur.did].color).split(',')
		for( i in str) diap[div_cur.did].push(str[i])
	}
	ColorTable(div_cur.did);
}

/**/
function ColorTable(tableid){
	debug('ColorTable:'+tableid)
	if (diap[tableid]){
		$('td.back4 table table:first tr').each(function(i,val){
//			debug('ColorTable:'+i+':'+diap[tableid])
			for (var j in diap[tableid]) {
				var d = diap[tableid][j]
				if (i>= +d.split('=')[0].split('-')[0] && i <= +d.split('=')[0].split('-')[1]) {
					$(val).removeClass(fixclass).attr("bgcolor", d.split('=')[1])
				}
			}
		})
	}
	$('a#colorit').attr('href','javascript:void(ColorGet(\''+ (diap[tableid]!='' ? diap[tableid].join() : def) +'\'))')
}
/**/

function ColorGet(curVal){
	debug('ColorGet:'+div_cur.did)
	var retVal = prompt('������� ���� �������', curVal);
	if (retVal != null) {
		divs[div_cur.did].color = retVal
		diap[div_cur.did] = retVal.split(',');
//		$('td.back4 table table:first tr').removeAttr('bgcolor')
		FixColors()
//		$('td.back4 table table:first tr:odd').attr('bgcolor','#a3de8f')
   		ColorIt()
		SaveData('divs')
	}
	return true
}

function ColorDel(){
	debug('ColorDel:'+div_cur.did)
	FixColors()
	divs[div_cur.did].color = ''
	diap[div_cur.did] = ''
	ColorIt()
	SaveData('divs')
	return true	
}

function SelectTeam(teamid){
	var maxturs = (parseInt($('td.back4 table table tr:last td:first').text())-1)*2
	var curgames = parseInt($('td.back4 table table tr:last td:eq(2)').text())
	var teamo = parseInt($("tr td a[href*='plug.php?p=refl&t=k&j="+teamid+"&']").parent().parent().find('td:last').text())
	var maxo = (maxturs - curgames)*3
	var bg = ''
	$('td.back4 table table tr').each(function(i,val){
		if(i > 0){
			var curteamo = parseInt($(val).find('td:last').text())
			if( curteamo < teamo + 3.1 && curteamo > teamo - 3.1) {
				bg = ' bgcolor=green'
			} else if( (curteamo  < teamo + maxo + 0.1) && (curteamo + maxo + 0.1 > teamo)) {
				bg = ' bgcolor=82df63' //A3DE8F'
			} else {
				bg = ' bgcolor=C9F8B7'
			}
			$(val).prepend('<td' + bg + '> </td>')
		} else {
			$(val).prepend('\t<th width=1%>\n')
		}

	})
	var td_data = $("tr td a[href*='plug.php?p=refl&t=k&j="+teamid+"&']").parent().html()
	$("tr td a[href*='plug.php?p=refl&t=k&j="+teamid+"&']").parent().html('<b>' + td_data + '</b>')
}

function TableCodeForForum(){

	// change big flags for eurocups in table
	$('td.back4 table table:first').find('img[src*=system/img/flags/]').each(function(){
//	debug($(this).attr('src'))
	// need fill base key=peflid, value=2 symbols tag: system/img/flags/155.gif -> system/img/flags/f-ru.gif
		var f = []
		f[1]='al';	//�������
		f[2]='dz';	//�����
		f[8]='ar';	//���������
		f[9]='am';	//�������
		f[11]='au';	//���������
		f[12]='at';	//�������
		f[13]='az';	//�����������
		f[18]='by';	//��������
		f[19]='be';	//�������
		f[24]='bo';	//�������
		f[25]='ba';	//������
		f[27]='br';	//��������
		f[30]='bg';	//��������
		f[41]='cl';	//����
		f[42]='cn';	//�����
		f[44]='co';	//��������
		f[47]='cr';	//�����-����
		f[48]='hr';	//��������
		f[50]='cy';	//����
		f[51]='cz';	//�����
		f[53]='dk';	//�����
		f[58]='ec';	//�������
		f[59]='eg';	//������
		f[61]='en';	//������
		f[64]='ee';	//�������
		f[66]='mk';	//���������
		f[69]='fi';	//���������
		f[70]='fr';	//A������
		f[73]='ge';	//������
		f[74]='de';	//��������
		f[76]='gr';	//������
		f[84]='nl';	//���������
		f[87]='hu';	//�������
		f[88]='is';	//��������
		f[91]='ir';	//����
		f[93]='ie';	//��������
		f[94]='il';	//�������
		f[95]='it';	//������
		f[96]='ci';	//���`�`�����
		f[98]='jp';	//������
		f[100]='kz';	//���������
		f[105]='lv';	//������
		f[111]='lt';	//�����
		f[122]='mx';	//�������
		f[123]='md';	//�������
		f[126]='ma';	//�������
		f[129]='nt';	//���. ��������
		f[137]='ng';	//�������
		f[139]='no';	//��������
		f[145]='py';	//��������
		f[147]='pe';	//����
		f[149]='pl';	//������
		f[150]='pt';	//����������
		f[152]='qa';	//�����
		f[154]='ro';	//�������
		f[155]='ru';	//������
		f[160]='sa';	//���. ������
		f[161]='st';	//���������	
		f[166]='sk';	//��������
		f[167]='si';	//��������
		f[170]='za';	//���
		f[171]='kr';	//�����
		f[172]='es';	//�������
		f[180]='se';	//������
		f[181]='ch';	//���������
		f[191]='tn';	//�����
		f[192]='tr';	//������
		f[195]='ae';	//���
		f[196]='us';	//���
		f[200]='ua';	//�������
		f[201]='uy';	//�������
		f[202]='uz';	//����������
		f[204]='ve';	//���������
		f[207]='wl';	//�����
		f[209]='rs';	//!!������
		f[214]='me';	//����������

		var tarr = $(this).attr('src').split('.')[0].split('/')
		var fid = tarr[tarr.length-1]
		var img = '<img src="'
		if (f[fid]) {
			img += 'system/img/flags/f-' + f[fid] + '.gif'
//			if (fid == 161 || fid ==214) img += f[fid]
//			else img += 'system/img/flags/f-' + f[fid] + '.gif'
		} else img += 'system/img/flags/f-00.gif'
		img += '"> '

		$(this).parent().prepend(img)
		$(this).remove()
	})

	// resize columns for forum print
	$('td.back4 table table th[width=26%]').attr('width','39%')
	$('td.back4 table table th[width=13%]').attr('width','15%')
	$('td.back4 table table th[width=7%]').removeAttr('width')
	$('td.back4 table table th[width=6%]').removeAttr('width')
	$('td.back4 table table th[width=5%]').removeAttr('width')
	//$('td.back4 table table a#f').remove()

	// generate code for forum
	var x = '<div align="right">(<a href="'+window.location.href+'">x</a>)&nbsp;</div>'
	x += '<br>��� ��� ������<br><br><textarea rows="20" cols="80" readonly="readonly" id="CodeTableForForum" selected>'
	if(value.length==1){
		x += '[b][url=plug.php?' + location.search.substring(1) + ']#[/url] '
		x += $('td.back4 td.back1').text()
		x += '[/b]\n'
	}
	x += $('td.back4 table:eq(1)')
		.find('a.del').remove().end()
		.find('a.hide').remove().end()
		.find('a.cast1').remove().end()
		.find('a.cast2').remove().end()
		.find('img.imgteam').remove().end()
		.find('img').removeAttr('ilo-full-src').end()		// fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
		.find('img').removeAttr('height').end()
		.find('a.f').removeAttr('href').removeAttr('class').end()
		.html()
		.replace(/<tbody>/g,'<table width=100% bgcolor=#C9F8B7>')
		.replace(/<\/tbody>/g,'')
		.replace(/<small>/g,'')
		.replace(/<\/small>/g,'')
		.replace(/font color/g,'color')
		.replace(/\/font/g,'/color')
		.replace(/<th><a>/g,'[td][b]')
		.replace(/<\/a><\/th>/g,'[/b][/td]')
		.replace(/<\/th>/g,'')
		.replace(/\t<th(.*)>(.*)\n/g,'<td$1><b>$2</b></td>')
		.replace(/\/td><tr/g,'/td></tr><tr')
		.replace(/a href=\"/g,'url=')
		.replace(/\/a/g,'/url')
		.replace(/\</g,'[')
		.replace(/\>/g,']')
		.replace(/\&amp\;/g,'&')
		.replace(/img src="/g,'img]')
		.replace(/.gif/g,'.gif[/img')
		.replace(/.png/g,'.png[/img')
		.replace(/"/g,'')
		.replace(/ width=25/g,'')
	x += '[/table]'

	x += '\n\n[center]--------------- [url=forums.php?m=posts&q=173605]CrabVIP[/url] ---------------[/center]\n';
	x += '</textarea><br>'
	x += '<br>1. Ctrl+A: �������� ���� ����� � �����'
	x += '<br>2. Ctrl+C: ����������� ��������� � �����'
	x += '<br>3. Ctrl+V: �������� �� ������ � �����'

	$('td.back4').html(x)
	$('#CodeTableForForum').select()
	$('td#crabglobalright').empty()
	return true
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

function check(d) {return (d<10 ? "0"+d : d)}

function debug(text) {
	if(deb) {
		debnum++;
//		$('td.back4').append(debnum+'&nbsp;\''+text+'\'<br>');
		console.log(debnum+': '+text);
	}
}