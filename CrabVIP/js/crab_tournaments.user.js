// ==UserScript==
// @name           peflturnaments
// @namespace      pefl
// @description    pefl turnaments page modification
// @include        https://*pefl.*/plug.php?p=refl&t=cup&j=*
// @include        https://*pefl.*/plug.php?p=refl&t=ec&j=*
// @include        https://*pefl.*/plug.php?p=refl&t=t&j=*
// @include        https://*pefl.*/plug.php?p=refl&t=f&j=*
// @encoding	   windows-1251
// ==/UserScript==

var names = {
	'236': '���� ������������',
	'230': '����� ������������',
	'235': '����� ������������',
	'234': '����� ��������� 3�',
	'233': '���� ������',
	'231': '���� ���������',
	'239': '������������������',
	'238': '������',
	'237': '���������� ������'
}
$().ready(function() {
	if (UrlValue('t') == 'ec') {
		let id = UrlValue('j');

		$('td.back4 table table')
			.before('<div>'+(names[id]).fontsize(3)+'</div><br><br>')
			.append('<tr><td></td></tr>')
			.find('tr:first').append('<td width=30% rowspan=7 valign=center align=center><img height=100 src="system/img/flags/'+id+'.gif"></img></td>')
	}
}, false);