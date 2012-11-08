// ==UserScript==
// @name           peflnationalteamratings
// @namespace      pefl
// @description    national teams ratings page modification
// @include        http://*pefl.*/plug.php?p=rating&t=sb2&j=*
// @version	       1.0
// ==/UserScript==

var TableToForum = {
	
	buttonSelector: '',
	codeWrapperSelector: '',
	tableSelector: '',
	
	init: function(params) {
		this.ChangeFlag();
	
		this.buttonSelector = params.buttonSelector;
		this.codeWrapperSelector = params.codeWrapperSelector;
		this.tableSelector = params.tableSelector;
		
		$(this.buttonSelector).click(TableToForum.generateCode);
	},
	
	ChangeFlag: function(){
		$('td.back4 table').find('img[src*=system/img/flags/]').each(function(i, val){
			var cid = parseInt($(val).attr('src').split('flags/')[1].split('.')[0])

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

			$(val).removeAttr('src');
			$(val).removeAttr('width');
			$(val).attr('src',img);
		})
	},
	
	generateCode: function() {
		var html = '<textarea cols="50" rows="30">';
		html += '[table]';
		html += TableToForum.htmlToForum( $(TableToForum.tableSelector).html() );
		html += '[/table]';
		
		html += '\r\n\r\n[center]--------------- [url=forums.php?m=posts&q=173605]Крабовый VIP[/url] ---------------[/center]';
		
		html += '</textarea>';
		
		$(TableToForum.codeWrapperSelector).html(html);
	},
	
	htmlToForum: function(html) {
		var txt = '';
		txt = html.replace(/\</g, '[');
		txt = txt.replace(/\>/g, ']');
		
		// remove [tbody] & [/tbody]
		txt = txt.replace(/\[\/?tbody\]/ig, '');
		
		// change width="\"15%\"" to width=15%, and height="\"15%\"" to height=15%
		txt = txt.replace(/ (width|height)\=[^\]\d]*(\d+)\%[^\]]*\]/ig, function(match, attrName, percentage) {
			return ' ' + attrName + '=' + percentage + '%]';
		});
		
		// change [a href="url"]anchor[/a] to [url=url]anchor[/url]
		txt = txt.replace(/\[a href\=\"([^\]]*)\"\]([^\[]*)\[\/a\]/ig, function(match, link, anchorText) {
			return '[url='+ link + ']' + anchorText + '[/url]';
		});
		
		// change [img src="url"] to [img]url[/img]
		txt = txt.replace(/\[img\ src\=\"([^\]]*)\"]/ig, function(match, link) {
			return '[img]' + link + '[/img]';
		});
		
		// change bgcolor="#777777" to bgcolor=#777777
		txt = txt.replace(/bgcolor\=\"([^\"]+)\"/ig, function(match, bgcolor) {
			if (bgcolor == "#a3de8f") {
				bgcolor = "#C9F8B7";
			}
			return 'bgcolor='+bgcolor;
		});
		
		// change [th] to [td][b] & [/th] to [/b][/td]
		txt = txt.replace(/\[th([^\]]*)\]/ig, function(match, inner) {
			return '[td'+ inner + '][b]';
		});
		txt = txt.replace(/\[\/th\]/ig, function(match) {
			return '[/b][/td]';
		});
		
		// change ="left" to =left
		txt = txt.replace(/ align\=\"(left|center|right)\"/ig, function(match, alignment) {
			return ' align=' + alignment;
		});
		
		// change [br] to '<br />';
		txt = txt.replace(/\[br\]/ig, '\r\n');
		
		txt = txt.replace(/\" width\=\"30/ig, '');
		
		txt = txt.replace(/\" height\=\"12/ig, '');
		
		// fix flags
		// temporary fix: remove flags
		//txt = txt.replace(/\[img\]system\/img\/flags\/([\d]+)\.gif\[\/img\]/ig, '');
		
		return txt;
	}
	
}

$().ready(function() {
	$('td.back4').append('<input type="button" class="code-to-forum" value="Код для форума" /><div class="code2forum"></div>');
	TableToForum.init({buttonSelector: '.code-to-forum', codeWrapperSelector: '.code2forum', tableSelector: 'td.back4 table table'});
/**/
}, false);