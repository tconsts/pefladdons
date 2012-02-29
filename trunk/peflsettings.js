// ==UserScript==
// @name           peflsettings
// @namespace      pefl
// @description    add menu link to sostav
// @include        http://*pefl.*/?settings
// ==/UserScript==

deb = (localStorage.debug == '1' ? true : false)
var debnum = 0

var flag = '<img height=13 src="/system/img/g/tick.gif"></img>'
var scflags = '0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:1:0:0'.split(':')
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
	{'name':'Адаптация',			'desc':'Карта адаптации в цифрах'}
]

$().ready(function() {
	if(localStorage.scripts!=undefined && localStorage.scripts!=null) scflags = localStorage.scripts.split(':')

	$('td.back4').html('<br><br><div align=center><font size=3>Настройки CrabVIP скриптов</font></div>')

	var html = '<br><table width=90% align=center bgcolor=#C9F8B7>'
	html += '<tr bgcolor=#C9F8B7><th width=5%>N</th><th width=5%>Вкл</th><th colspan=2 width=30%>Имя скрипта</th><th>Описание</th></tr>'
	for (i=1;i<scnames.length;i++) {
		html += '<tr bgcolor=#A3DE8F>'
		html += '<td>'+i+'</td>'
		html += '<th id="f'+i+'">'+(parseInt(scflags[i])==0 ? flag : '')+'</th>'
		html += '<td colspan=2>'+(scnames[i].del ? scnames[i].name : '<a href="javascript:void(SwitchScFlag('+i+'))">'+scnames[i].name+'</a>')+'</td>'
		html += '<td><i>'+scnames[i].desc+'</i></td>'
		html += '</tr>'
	}
	html += '</table>'
	html += '<br><br>&nbsp;* - <i>при появлении нового скрипта, чтобы он заработал, требуется переустановить(поставить поверх) основной скрипт: <a href="http://pefladdons.googlecode.com/svn/trunk/pefl.user.js">pefl.user.js</a>.</i>'

	html += '<br><br>&nbsp;* - <i>Вы можете поддержать проект (или например запросить сделать определенную фичу в первую очередь, или в персональное пользование), перечислив какую-либо сумму одним из следующих способов (оплата возможна через любой платёжный терминал)</i>'
	html += '<table align=center bgcolor=A3DE8F><tr bgcolor=C9F8B7 height=30><th>WebMoney</th>'
	html += '<td>R930480028049 (рубли)<br>'
	html += 'Z811907519489 (доллары)</td></tr>'

	html += '<tr bgcolor=C9F8B7 height=30><th>Яндекс-деньги</th>'
	html += '<td>Счет: 41001993673065</td></tr>'

	html += '<tr bgcolor=C9F8B7 height=30><th><b>RBK Money</th>'
	html += '<td>RU339032359</td></tr>'

	html += '<tr bgcolor=C9F8B7 height=30><th><b>PayPal</th>'
	html += '<td>tconsts@gmail.com</td></tr></table>'

	$('td.back4').append(html)
});

function SwitchScFlag(scid){
	debug('SwitchScFlag('+scid+')')
	if(scflags[scid]==0){
		scflags[scid] = 1
		$('th#f'+scid).html('')
	}else{
		scflags[scid] = 0
		$('th#f'+scid).html(flag)
	}
	localStorage.scripts = scflags.join(':')
}

function debug(text) {if(deb) {debnum++;$('td.back4').append(debnum+'&nbsp;\''+text+'\'<br>');}}