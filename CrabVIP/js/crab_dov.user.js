// ==UserScript==
// @name           pefldoverie
// @namespace      pefl
// @description    doverie
// @include        https://*pefl.*/plug.php?p=refl&t=dov&k=*
// @encoding	   windows-1251
// ==/UserScript==

$().ready(function() {
	var dov1 = [
		'� ������ ���������� �� ��������� ��� ���������',
		' ����������� ���������� �������� ��� ������� � ���� ����� �����',
		'����������� ����� ������� ��� ��������� ��������', 
		'����������� ����� �������� ������ ��������',
		'�����������, � �����, ������������ ��������� ���� ����������',
		'� �����, ����������� ��� ��������',
		'����������� �����, ��� �� ������� ������� ���� �� ����� �������',
		'����������� ����� ��������, ��� �� �������� �� �������',
		'����������� ����� ���������� ����',
		'����������� ����� ����������� ����� � ����� ����������',
		'����������� ����� �������� ����������� ��� ������'
	]
	var dov2 = [
		'�����������',
		'�������',
		'������',
		'�������',
		'�������',
		'�����',
		'����� �����',
	]
	var mdov1 = $('td.back4 table tr:eq(1) td').text().split('.')[0]
	var x = $('td.back4 table tr:eq(1) td').text().split(' ')
	var mdov2 = []
	mdov2[0] = ($('td.back4 table tr:eq(1) td').text().split('. ')[1]==undefined? '&nbsp;' : $('td.back4 table tr:eq(1) td').text().split('. ')[1].split('�������')[0])
	mdov2[1] = x[x.length-1].split('.')[0]

    var text = ''
	text += '<hr><table align=center width=100%><tr><td><table bgcolor=A3DE8F width=100%>'
	text += '<tr><th>������ ���������� ������</th></tr>'
	for (i in dov1)	text += '<tr bgcolor=C9F8B7><td ' + (mdov1==dov1[i] ? ' bgcolor=white': '') + '>' + dov1[i] + '.</td></tr>'
	text += '</table></td>'

	text += '<td valign=top><table bgcolor=A3DE8F width=100%>'
	text += '<tr><th>' + mdov2[0] + '</th></tr>'
	for (i in dov2)	text += '<tr bgcolor=C9F8B7><td align=center ' + (mdov2[1] == dov2[i] ? ' bgcolor=white': '') + '>' + dov2[i] + '</td></tr>'
	text += '</table></tr></td>'

	$('td.back4').append(text)

	var tables = [];
	$('td.back4 table table').each(function(i,val){
		if($(val).attr('id')==undefined || $(val).attr('id')=='') $(val).attr('id','x'+i);
		tables.push($(val).attr('id'));
	})
	var text = '</script><script type="text/javascript" src="js/fcode2.js"></script>';
	text+='<div align=right><a href="javascript:void(ShowCode([],\''+tables.join(',')+'\',\'forumcode\'))">��� ��� ������</a></div>';
	$('td.back4').prepend(text).find('br:first').remove();

}, false);
//})();