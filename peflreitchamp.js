// ==UserScript==
// @name           peflreitchamp
// @namespace      pefl
// @description    modification champ reit page
// @include        http://*pefl.*/plug.php?p=rating&t=cn2&j=*
// @version        2.0
// ==/UserScript==


function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if(pf[n].split('=')[0] == key) return pf[n].split('=')[1]
	return false
}


function ChangeFlag(){
	$('table.reit').find('img[src*=system/img/flags/]').each(function(i, val){
		var cid = parseInt($(val).attr('src').split('flags/')[1].split('.')[0].replace('mod/',''))

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
		f[161]='http://pefladdons.googlecode.com/svn/trunk/img/f-161.gif';	//Шотландия	
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
		f[214]='http://pefladdons.googlecode.com/svn/trunk/img/f-214.png';	//Черногория

		var img = ''
		if (f[cid]) img += (cid == 161 || cid ==214 ? f[cid] : 'system/img/flags/f-' + f[cid] + '.gif')
		else img += 'system/img/flags/f-00.gif'

		$(val).removeAttr('src')
		$(val).removeAttr('width')
		$(val).attr('src',img)

		r_new[i+1] = {}
		r_new[i+1].chid = cid
		r_new[i+1].reit = parseInt($(val).parent().next().text())
		r_new[i+1].edit = 0
	})
}

function ShowTD(){
	var country = []
	$('th:first').parent().append('<th width=30%>'+continent+'</td>')
	$('table.reit').find('img[src*=system/img/flags/]').each(function(i, val){
		var cid = $(val).attr('src').split('flags/')[1].split('.')[0]
		var cname = $(val).parent().text()
		var creit = +$(val).parent().next().text()
		country[cid] = [cname,creit]
		$(val).parent().parent().append('<td>'+cid+':'+country[cid][1]+'</td>')
		$(val).parent().next().html($(val).parent().next().html() +' (+123)')

		//$(val).css("border", "1px solid red");
	})

}

function TableCodeForForum(continent){
	$('td.back4').append('<br><hr>Код для форума<br><textarea rows="7" cols="75" readonly="readonly" id="CodeForForum"></textarea>')

	var x = '[url=plug.php?'
	x += location.search.substring(1)
	x += ']#[/url] [b]'
	x += $('td.back4 td.back1').text()
	x += '[/b] ('
	x += continent
	x += ')[spoiler]'
	x += $('table.reit').html()
		.replace(/<tbody>/g,'<table width=100% bgcolor=#C9F8B7>')
		.replace(/tbody/g,'table')
		.replace(/\</g,'[')
		.replace(/\>/g,']')
		.replace(/ height=\"12\"/g,'')
		.replace(/img src="/g,'img]')
		.replace(/.gif/g,'.gif[/img')
		.replace(/.png/g,'.png[/img')
		.replace(/"/g,'')
		.replace(/\[sup\]/g,'(')
		.replace(/\[\/sup\]/g,')')
		.replace(/\/font/g,'/color')
		.replace(/font /g,'')
	x += '\n\n[center]--------------- [url=forums.php?m=posts&q=173605]CrabVIP[/url] ---------------[/center]\n';
	x += '[/spoiler]'
	$('#CodeForForum').html(x);
}

function GetData(num){
	var text = localStorage['rchamp'+num]
	if (String(text) != 'undefined' && text != undefined){
		var x1 = text.split(';')
		for (i in x1) {
			var x2 = x1[i].split(',')
			r_old[x2[0]] = {}
			r_old[x2[0]].chid = x2[0]
			r_old[x2[0]].reit = x2[1]
			r_old[x2[0]].edit = x2[2]
		}
		return true
	} else return false
}

function SaveData(num,dt){
	var text  = '0,'+today+','+dt
	for (i in r_new){
		var rni = r_new[i]
		text += ';'+rni.chid+','+rni.reit+','+rni.edit
	}
	localStorage['rchamp'+num] = text//.replace(';','')
}

function check(d) {return (d<10 ? "0"+d : d)}

function ModifyTable(num){
	var save = false
	var dt = today
	if(GetData(num)){
		dt = r_old[0].edit
		for(i=1;i<r_new.length;i++){
			if(typeof(r_old[r_new[i].chid].reit)=='undefined' || r_new[i].reit!=r_old[r_new[i].chid].reit) {
				save = true
				dt = r_old[0].reit
				break
			}
		}
		for(i=1;i<r_new.length;i++){
			if(typeof(r_old[r_new[i].chid].reit)!='undefined') {
				if(save) r_new[i].edit = r_new[i].reit - r_old[r_new[i].chid].reit
				else 	 r_new[i].edit = r_old[r_new[i].chid].edit
			}else r_new[i].edit = 0
		}
		$('table.reit tr').each(function(i, val){
			if(i==0) ttt = '&nbsp;<sup>'+dt+'</sup>'
			else if(r_new[i].edit==0) ttt = ''
			else ttt = '&nbsp;<sup><font color='+(r_new[i].edit>0 ? 'green' : 'red')+'>'+(r_new[i].edit>0 ? '+' : '')+r_new[i].edit+'</font></sup>'
			$(val).find('td:last').append(ttt)
		})
	} else save = true
	if(save) SaveData(num,dt)
}

var r_old = []
var r_new = []
var today = new Date()

$().ready(function() {
	var areanum = parseInt(UrlValue('j'))
	var area = ['','Европа', 'Америка','ЗА']
	today = check(today.getDate()) + '.' + check(today.getMonth()+1)
//	r_new[0] = {'edit':today}

	$('td.back4 table table')
		.addClass('reit')
//		.find('tr:first').remove().end()
//		.prepend('<tr bgcolor=#a3de8f><td><b>Место</b></td><td><b>Страна</b></td><td><b>Рейтинг</b></td></tr>')
		.find('img').removeAttr('ilo-full-src').end()		// fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
//		.find('tr').addClass('save').end()

	//ShowTD()
	ChangeFlag()
	ModifyTable(areanum)
//	TableCodeForForum(area[areanum])
})
