// ==UserScript==
// @name           peflsettings
// @namespace      pefl
// @description    add menu link to sostav
// @include        http://*pefl.*/?settings
// ==/UserScript==

deb = (localStorage.debug == '1' ? true : false)
var debnum = 0

var flag = '<img height=13 src="/system/img/g/tick.gif"></img>'
var scflags = '0:0:0:0:0:0:0:0:0:0:0:1:0:0:0:0:0:0:0:0:1:0:0:1:0'.split(':')
var scnames = [
	{'name':'Настройки',			'desc':''},
	{'name':'Состав +',				'desc':''},
	{'name':'Ростер игрока',		'desc':''},
	{'name':'Страница контрактов',	'desc':''},
	{'name':'Ростер команды',		'desc':''},
	{'name':'Турнирная таблица',	'desc':''},
	{'name':'Рейтинг чемпионатов',	'desc':''},
	{'name':'Расписание',			'desc':''},
	{'name':'Финансы',				'desc':''},
	{'name':'Состав на матч',		'desc':'команда и сборная'},
	{'name':'Рейтинг школ',			'desc':''},
	{'name':'Ненужные',				'desc':'удален так как реализован на проекте','del':true},
	{'name':'История',				'desc':''},
	{'name':'Кредит доверия',		'desc':''},
	{'name':'Матч',					'desc':''},
	{'name':'Index',				'desc':'модифицирует заглавную страницу'},
	{'name':'Личные сообщения',		'desc':''},
	{'name':'Тренировки',			'desc':''},
	{'name':'Турниры',				'desc':''},
	{'name':'Календарь',			'desc':''},
	{'name':'Форум',				'desc':'пока в разработке, недоделан'},
	{'name':'Рефери',				'desc':'позволяет сортировку страницы списка рефери'},
	{'name':'Адаптация',			'desc':'Карта адаптации в цифрах'},
	{'name':'ТВ без флеша',			'desc':'удален так как поменялось ТВ на проекте','del':true},
	{'name':'Рейтинг сборных',		'desc':'Код для форума'}
]

$().ready(function() {
	if(localStorage.scripts!=undefined && localStorage.scripts!=null) scflags = localStorage.scripts.split(':')
	var datatop = (localStorage.datatop != undefined ? localStorage.datatop : 9107893)
	if(datatop==9107892 || datatop==9107893){
		datatop = 9107893
		delete localStorage.datatop
	}

	$('td.back4').html('<br><br><div align=center><font size=3>Настройки CrabVIP скриптов</font></div>')

	var html = '<div align=right><a href="javascript:void(DropAll())">сбросить все настройки</a>&nbsp;</div>'
	html += '<br><table width=90% align=center class=back2>'
	html += '<tr class=back2><th width=5%>N</th><th width=5%>Вкл</th><th colspan=2 width=30%>Имя скрипта</th><th>Описание</th></tr>'
	for (i=1;i<scnames.length;i++) {
		html += '<tr class=back1>'
		html += '<td>'+i+'</td>'
		html += '<td id="f'+i+'">'+(parseInt(scflags[i])!=1 ? flag+(parseInt(scflags[i])>1 ? 'v'+parseInt(scflags[i]): '') : '')+'</td>'
		html += '<td colspan=2>'+(scnames[i].del ? scnames[i].name : '<a href="javascript:void(SwitchScFlag('+i+(scnames[i].versions!=undefined ? ','+parseInt(scnames[i].versions) : '')+'))">'+scnames[i].name+'</a>')+'</td>'
		html += '<td><i>'+scnames[i].desc+(scnames[i].desc != '' ? '<br>' :'')
		if(i==4){
			html += 'Номинал+: <a id="nomdata" href="javascript:void(NomDataSwitch(\''+datatop+'\'))">'+datatop+'</a> (топ с данными)'
		}
		html += '</i></td>'
		html += '</tr>'
	}
	html += '</table>'
	html += '<br>'
	html += 'Картинка вместо лого: <input name="logo" id="logo" type="text" size="40" value="'+(String(localStorage.logopic)!='undefined'?localStorage.logopic:'')+'"> <a href="javascript:void(setLogo())">установить</a>'
	html += '<br><br>&nbsp;* - <i>при появлении нового скрипта, чтобы он заработал, требуется переустановить(поставить поверх) основной скрипт: <a href="http://pefladdons.googlecode.com/svn/trunk/pefl.user.js">pefl.user.js</a>.</i>'

	html += '<br><br>&nbsp;* - <i>Вы можете поддержать проект (или например запросить сделать определенную фичу в первую очередь, или в персональное пользование), перечислив какую-либо сумму одним из следующих способов (оплата возможна через любой платёжный терминал)</i>'
	html += '<table align=center class=back2 width=50%><tr class=back1 height=50 valign=top><td><b>WebMoney</b><br>'
	html += 'R930480028049 (рубли)<br>'
	html += 'Z811907519489 (доллары)</td>'

	html += '<td><b>RBK Money</b><br>'
	html += 'RU339032359</td></tr>'

	html += '<tr class=back1 height=50 valign=top><td><b>Яндекс-деньги</b><br>'
	html += 'Счет: 41001993673065</td>'


	html += '<td><b>PayPal</b><br>'
	html += 'tconsts@gmail.com</td></tr></table>'

	$('td.back4').append(html)
});

function dropLogo(){
	debug('dropLogo()')
}
function setLogo(){
	var val = document.getElementById("logo").value
	debug('setLogo:'+val)

	if(val==''){
		//delete from lS
		delete localStorage.logopic

		//delete from input
		$('input#logo').val('')

		//delete from top
		$('img:first').attr('src','skins/refl/img/pefl.gif')
	}else{
		//set to top
		$('img:first').attr('height','88').attr('src',val)
		//save to lS
		localStorage.logopic = val
	}
}
function DropAll(){
	localStorage.clear()
	if(navigator.userAgent.indexOf('Firefox') == -1){
		db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
		db.transaction(function(tx) {
			tx.executeSql("DROP DATABASE PEFL", [],
				function(tx, result){},
				function(tx, error){debug(error)}
			)
		})
	}
	debug('DropAll() finished')
	window.location.reload( true );
}

function NomDataSwitch(curtop){
	debug('NomDataSwitch('+curtop+')')
	var newtop = parseInt(prompt('Введите номер сообщения с форума с данными\nДефоултный вариант 9107893:', curtop));
	if (!isNaN(newtop)) {
		localStorage.datatop = newtop
		delete localStorage.getnomdata
		$('a#nomdata').html(newtop)
	}
	return true
}

function SwitchScFlag(scid, ver){
	debug('SwitchScFlag('+scid+','+ver+')')
	var vmax = (isNaN(ver) ? 1 : parseInt(ver))
	debug(vmax)
	if(scflags[scid]==1){
		scflags[scid] = 0
		$('td#f'+scid).html(flag)
	}else if(scflags[scid]==2){
		scflags[scid] = 1
		$('td#f'+scid).html('')
	}else if(scflags[scid]==0 && vmax>1){
		scflags[scid] = vmax
		$('td#f'+scid).html(flag+'v'+vmax)
	}else if(scflags[scid]==0 && vmax==1){
		scflags[scid] = 1
		$('td#f'+scid).html('')
	}

	localStorage.scripts = scflags.join(':')
}

function debug(text) {if(deb) {debnum++;$('td.back4').append(debnum+'&nbsp;\''+text+'\'<br>');}}