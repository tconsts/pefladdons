// ==UserScript==
// @name           peflsettings
// @namespace      pefl
// @description    add menu link to sostav
// @include        https://*pefl.*/?settings
// @encoding	   windows-1251
// ==/UserScript==

var flag = '<img height=13 src="/system/img/g/tick.gif"></img>'
var scflags = '0:0:0:0:0:0:1:0:0:0:1:1:0:0:0:0:1:0:0:0:1:0:0:1:0:0'.split(':')
var scnames = [
	{'name':'���������',			'desc':''},
	{'name':'������ +',				'desc':''},
	{'name':'������ ������',		'desc':''},
	{'name':'�������� ����������',	'desc':''},
	{'name':'������ �������',		'desc':''},
	{'name':'��������� �������',	'desc':''},
	{'name':'������� �����������',	'desc':'������ ��� ��� ���������� �� �������','del':true},
	{'name':'����������',			'desc':''},
	{'name':'�������',				'desc':''},
	{'name':'������ �� ����',		'desc':'���������� ������� �������� (c)BallaK'},
	{'name':'������� ����',			'desc':'�������� �������� ��� ��� ����������� ���������� �� �������','del':true},
	{'name':'��������',				'desc':'������ ��� ��� ���������� �� �������','del':true},
	{'name':'�������',				'desc':''},
	{'name':'������ �������',		'desc':''},
	{'name':'����',					'desc':''},
	{'name':'Index',				'desc':'������������ ��������� ��������'},
	{'name':'������ ���������',		'desc':'������ ��� ��� ���������� �� �������','del':true},
	{'name':'����������',			'desc':''},
	{'name':'�������',				'desc':''},
	{'name':'���������',			'desc':''},
	{'name':'�����',				'desc':'���� � ����������, ���������'},
	{'name':'������',				'desc':'��������� ���������� �������� ������ ������'},
	{'name':'���������',			'desc':'����� ��������� � ������'},
	{'name':'�� ��� �����',			'desc':'������ ��� ��� ���������� �� �� �������','del':true},
	{'name':'������� ������',		'desc':'�������� ����� ������ ����� ���������'},
	{'name':'�����',				'desc':''}
]

$().ready(function() {
	if(localStorage.scripts!=undefined && localStorage.scripts!=null) scflags = localStorage.scripts.split(':')

	var datatop = (localStorage.datatop != undefined ? localStorage.datatop : 9885110)
	if(datatop==9107892 || datatop==9107893 || datatop==9885110){
		datatop = 9885110
		delete localStorage.datatop
	}

	$('td.back4').html('<br><br><div align=center><font size=3>��������� CrabVIP ��������</font></div>')

	var html = '<div align=right><a href="javascript:void(DropAll())">�������� ��� ���������</a>&nbsp;</div>'
	html += '<br><table width=90% align=center class=back2>'
	html += '<tr class=back2><th width=5%>N</th><th width=5%>���</th><th colspan=2 width=30%>��� �������</th><th>��������</th></tr>'
	for (i=1;i<scnames.length;i++) {
		var trclass = 1;
		if(scnames[i].del){
			trclass = 6;
			scflags[i]=1;
		}
		html += '<tr class=back'+trclass+'>'
		html += '<td>'+i+'</td>'
		html += '<td id="f'+i+'">'+(parseInt(scflags[i])!=1 && !scnames[i].del ? flag+(parseInt(scflags[i])>1 ? 'v'+parseInt(scflags[i]): '') : '')+'</td>'
		html += '<td colspan=2>'+(scnames[i].del ? scnames[i].name : '<a href="javascript:void(SwitchScFlag('+i+(scnames[i].versions!=undefined ? ','+parseInt(scnames[i].versions) : '')+'))">'+scnames[i].name+'</a>')+'</td>'
		html += '<td><i>'+scnames[i].desc+(scnames[i].desc != '' ? '<br>' :'')
		if(i==4){
			html += '�������+: <a id="nomdata" href="javascript:void(NomDataSwitch(\''+datatop+'\'))">'+datatop+'</a> (��� � �������)'
		}
		html += '</i></td>'
		html += '</tr>'
	}
	html += '</table>'
	html += '<br>'
	html += '�������� ������ ����: <input name="logo" id="logo" type="text" size="40" value="'+(String(localStorage.logopic)!='undefined'?localStorage.logopic:'')+'"> <a href="javascript:void(setLogo())">����������</a>'

	html += '<br><br>&nbsp;* - <i>�� ������ ���������� ������ (��� �������� ��������� ������� ������������ ���� � ������ �������, ��� � ������������ �����������), ���������� �����-���� ����� ����� �� ��������� �������� (������ �������� ����� ����� �������� ��������)</i>'
	html += '<table align=center class=back2 width=50%><tr class=back1 height=50 valign=top><td><b>WebMoney (���)</b><br>'
	html += '--</td>'

	html += '<td><b>WebMoney ($)</b><br>'
	html += '--</td></tr>'

	html += '<tr class=back1 height=50 valign=top><td><b>�-money</b><br>'
	html += '����: <a href="https://yoomoney.ru/to/41001993673065">41001993673065</a><br>';
	html += '������� ������, ������� ��� � �����</td>'

	html += '<td><b>PayPal</b><br>'
	html += '--</td></tr></table>'

	$('td.back4').append(html)
});

function dropLogo(){

}

function setLogo(){
	var val = document.getElementById("logo").value

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
				function(tx, error){}
			)
		})
	}
	window.location.reload( true );
}

function NomDataSwitch(curtop){
	var newtop = parseInt(prompt('������� ����� ��������� � ������ � �������\n���������� ������� 9107893:', curtop));
	if (!isNaN(newtop)) {
		localStorage.datatop = newtop
		delete localStorage.getnomdata
		$('a#nomdata').html(newtop)
	}
	return true
}

function SwitchScFlag(scid, ver){
	var vmax = (isNaN(ver) ? 1 : parseInt(ver))
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
