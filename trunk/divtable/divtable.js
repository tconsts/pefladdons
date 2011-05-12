
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

function SetTasks(){
	// task for club
	var task = []

	// Get info fom Global or Session Storage
	var text1 = ''
	if (navigator.userAgent.indexOf('Firefox') != -1){
		text1 = String(globalStorage[location.hostname].tasks)
	} else {
		text1 = String(sessionStorage.tasks)
	}
	if (text1 != 'undefined'){
		var t1 = text1.split(',')
		for (i in t1) {
			var t2 = t1[i].split(':')
			task[t2[0]] = t2[1]
		}
	}
	$('td.back4 table table th[width=13%]').attr('width','26%')
	$("td.back4 table table tr td a[href*='plug.php?p=refl&t=s_graph']").each(function(){
		var tid = UrlValue('n',$(this).attr('href'))
		$(this).parent().find('img').remove() //.html().replace(/(\d*)/g,'')
		var td_data = $(this).parent().html().replace(/\(\d*\)/g,'')

		if (task[tid]) td_data += ' <small>'+task[tid]+'</small>'
		$(this).parent().html(td_data)
	})
	$('div#tasks').html('Показать задачи')
}

function PlusMinus(){
	$('th:last').before('<th width="6%">+/-\n\t').append('\n')
	$('th:contains(№)').parent().parent().find('tr').each(function(){
		var gz = +$(this).find('td:last').prev().prev().text()
		var gp = +$(this).find('td:last').prev().text()
		var td  = '<td>' +  (gz > gp ? '+' : '') + (gz-gp) + '</td>'
		$(this).find('td:last').before(td)
	})
}

function ColorIt(){
	if ( UrlValue('j') ) tbid = UrlValue('j');

	if (tbid == 0){
		var divname = 
		$("td.back4 a").each(function(){
			if ($(this).text() == $('td.back1 span').text().split(', ',2)[1]) {
				tbid = UrlValue('j',$(this).attr('href'))
			}
		})
	}

	if (getCookie('pefltables') && tbid >= 0) {
		var dp = getCookie('pefltables').split('.')
		for (var p in dp) {
			var name = dp[p].split('*',1)[0] 
			var key = dp[p].split('*')
			key.shift()
			diap[name] = key
		}
		ColorTable(tbid);
	}
}

function ColorTable(tableid){
	if (diap[tableid]){
//		$('th:contains(№)').parent().parent().find('tr').each(function(i,val){
		$('td.back4 table table tr').each(function(i,val){
			for (var j in diap[tableid]) {
				var d = diap[tableid][j]
				if (i>= +d.split('!')[0].split('-')[0] && i <= +d.split('!')[0].split('-')[1]) {
					$(val).attr("bgcolor", d.split('!')[1])
				}
			}
		})
	}
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

function getValue(tableid,curVal){
	var retVal = prompt('Задайте цвет таблицы', curVal.replace(/!/g,'='));
	if (retVal != null) {
		var cookie = ''
		diap[tableid] = retVal.replace(/=/g,'!').split(',');
		ColorTable(tableid);
		for (var i in diap) if(i!=0 && diap[i].join('*')!='') cookie += '.' + i +'*' + diap[i].join('*');
		setCookie('pefltables',cookie.replace('.',''))
	}
	return true
}
function TableCodeForForum(){

	// change big flags for eurocups in table
	$('td.back4 td.back1').parent().next().find('table').find('img[src*=system/img/flags/]').each(function(){
	// need fill base key=peflid, value=2 symbols tag: system/img/flags/155.gif -> system/img/flags/f-ru.gif
		var f = []
		f[1]='al';	//Албания
		f[2]='dz';	//Алжир
		f[8]='ar';	//Аргентина
		f[9]='am';	//Армения
		f[11]='au';	//Австралия
		f[12]='at';	//Австрия
		f[13]='az';	//Азербайджан
		f[18]='by';	//Беларусь
		f[19]='be';	//Бельгия
		f[24]='bo';	//Боливия
		f[25]='ba';	//Босния
		f[27]='br';	//Бразилия
		f[30]='bg';	//Болгария
		f[41]='cl';	//Чили
		f[42]='cn';	//Китай
		f[44]='co';	//Колумбия
		f[47]='cr';	//Коста-Рика
		f[48]='hr';	//Хорватия
		f[50]='cy';	//Кипр
		f[51]='cz';	//Чехия
		f[53]='dk';	//Дания
		f[58]='ec';	//Эквадор
		f[59]='eg';	//Египет
		f[61]='en';	//Англия
		f[64]='ee';	//Эстония
		f[66]='mk';	//Македония
		f[69]='fi';	//Финляндия
		f[70]='fr';	//Aранция
		f[73]='ge';	//Грузия
		f[74]='de';	//Германия
		f[76]='gr';	//Греция
		f[84]='nl';	//Голландия
		f[87]='hu';	//Венгрия
		f[88]='is';	//Исландия
		f[91]='ir';	//Иран
		f[93]='ie';	//Ирландия
		f[94]='il';	//Израиль
		f[95]='it';	//Италия
		f[96]='ci';	//Кот`д`Ивуар
		f[98]='jp';	//Япония
		f[100]='kz';	//Казахстан
		f[105]='lv';	//Латвия
		f[111]='lt';	//Литва
		f[122]='mx';	//Мексика
		f[123]='md';	//Молдова
		f[126]='ma';	//Морокко
		f[129]='nt';	//Сев. Ирландия
		f[137]='ng';	//Нигерия
		f[139]='no';	//Норвегия
		f[145]='py';	//Парагвай
		f[147]='pe';	//Перу
		f[149]='pl';	//Польша
		f[150]='pt';	//Португалия
		f[152]='qa';	//Катар
		f[154]='ro';	//Румыния
		f[155]='ru';	//Россия
		f[160]='sa';	//Сау. Аравия
		f[161]='http://pefladdons.googlecode.com/svn/trunk/f-161.gif';	//Шотландия	
		f[166]='sk';	//Словакия
		f[167]='si';	//Словения
		f[170]='za';	//ЮАР
		f[171]='kr';	//Корея
		f[172]='es';	//Испания
		f[180]='se';	//Швеция
		f[181]='ch';	//Швейцария
		f[191]='tn';	//Тунис
		f[192]='tr';	//Турция
		f[195]='ae';	//ОАЭ
		f[196]='us';	//США
		f[200]='ua';	//Украина
		f[201]='uy';	//Уругвай
		f[202]='uz';	//Узбекистан
		f[204]='ve';	//Венесуэла
		f[207]='wl';	//Уэльс
		f[209]='yu';	//!!Сербия
		f[214]='http://pefladdons.googlecode.com/svn/trunk/f-214.png';	//Черногория

		var fid=$(this).attr('src').split('flags/')[1].split('.')[0]
		var img = '<img src="'
		if (f[fid]) {
			if (fid == 161 || fid ==214) img += f[fid]
			else img += 'system/img/flags/f-' + f[fid] + '.gif'
		} else img += 'system/img/flags/f-00.gif'
		img += '"> '

		$(this).parent().prepend(img)
		$(this).remove()
	})

	// resize columns for forum print
	$('td.back4 table table th[width=26%]').attr('width','37%')
	$('td.back4 table table th[width=13%]').attr('width','15%')

	// generate code for forum
	var x = '<div align="right">(<a href="'+window.location.href+'">x</a>)&nbsp;</div>'
	x += '<br>Код для форума<br><br><textarea rows="20" cols="80" readonly="readonly" id="CodeTableForForum">'
	x += '[b]'
	x += $('td.back4 td.back1').text()
	x += '[/b][spoiler]'
	x += $('td.back4 table:eq(1)')
		.find('img').removeAttr('height').end()
		.html()
		.replace(/<tbody>/g,'<table width=100% bgcolor=#C9F8B7>')
		.replace(/<\/tbody>/g,'')
		.replace(/<small>/g,'')
		.replace(/<\/small>/g,'')
		.replace(/\t<th(.*)>(.*)\n/g,'<td$1><b>$2</b></td>')
		.replace(/\th/g,'td')
		.replace(/\/td><tr/g,'/td></tr><tr') // for Opera
		.replace(/\</g,'[')
		.replace(/\>/g,']')
		.replace(/a href=\"/g,'url=')
		.replace(/\/a/g,'/url')
		.replace(/\&amp\;/g,'&')
//		.replace(/\[img src="(.*)"/g,'[img]$1[/img]')
		.replace(/img src="/g,'img]')
		.replace(/.gif/g,'.gif[/img')
		.replace(/.png/g,'.png[/img')
		.replace(/"/g,'')
		.replace(/ width=25/g,'')
	x += '[/table]'

	x += '\n\n\n[center]--------------- [url=forums.php?m=posts&q=173605]Крабовый VIP[/url] ---------------[/center]\n';
	x += '[/spoiler]'
	x += '</textarea>'

	$('td.back4').html(x)
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

var diap = []
var url = {}
var def = '1-1!FCE94F,2-2!white,3-3!E9B96E'
var tbid = -1;

//document.addEventListener('DOMContentLoaded', function(){
$().ready(function() {

	// add column with goals +/- (will be include to code for forum)
	PlusMinus();

	// Colorize table if need
	ColorIt()

	// Select as bold self team in my table with id=0
	if( UrlValue('k') && UrlValue('k')!=0) SelectTeam(UrlValue('k'))

	// Draw CrabVIP panel
	var text = ''
	text += '<div id="color"><a href="javascript:void(getValue(\'' + tbid + '\',\''+ (diap[tbid] ? diap[tbid].join() : def) +'\'))">Расскрасить</a></div>'
	text += '<div id="tasks"><a href="javascript:void(SetTasks())">Показать задачи</a>&nbsp;</div>'
	text += '<div id="CodeTableForForum"><a href="javascript:void(TableCodeForForum())">Код для форума</a>&nbsp;</div>'

	var preparedhtml = ''
	preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr><td width=200></td><td id="crabglobalcenter"></td><td id="crabglobalright" width=200 valign=top>'
	preparedhtml += '<table id="crabrighttable" bgcolor="#C9F8B7" width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
	preparedhtml += '</td></tr></table>'
	$('body table.border:last').before(preparedhtml)
	$('td.back4 script').remove()
	$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
	$('#crabrighttable').addClass('border') 
	$("#crabright").html(text)

}, false);