//document.addEventListener('DOMContentLoaded', function(){
//(function(){
$().ready(function() {
	var dov1 = [
		'В городе подумывают об установке Вам памятника',
		'Руководство собирается повесить Ваш портрет в зале славы клуба',
		'Руководство считает вас идеальным тренером', 
		'Руководство клуба довольно вашими успехами',
		'Руководство, в целом, положительно оценивает Ваши результаты',
		'В целом, руководство Вам доверяет',
		'Руководство клуба надеется, что вы способны на большее',
		'Руководство клуба недовольно Вами',
		'Руководство опровергает слуxи о Вашем увольнении',
		'Руководство клуба начинает подыскивать Вам замену'
	]
	var dov2 = [
		'великолепно',
		'отлично',
		'хорошо',
		'неплохо',
		'неважно',
		'слабо',
		'очень плохо',
	]
	var mdov1 = $('td.back4 table tr:eq(1) td').text().split('.')[0]
	var mdov2 = $('td.back4 table tr:eq(1) td').text().split('.')[1].split('команда ')
    var text = ''

	text += '<hr><table align=center width=100%><tr><td><table bgcolor=A3DE8F width=100%>'
	text += '<tr><th>Оценка управления клубом</th></tr>'
	for (i in dov1)	text += '<tr bgcolor=C9F8B7><td ' + (mdov1==dov1[i] ? ' bgcolor=white': '') + '>' + dov1[i] + '.</td></tr>'
	text += '</table></td>'

	text += '<td valign=top><table bgcolor=A3DE8F width=100%>'
	text += '<tr><th>' + mdov2[0] + ' команда</th></tr>'
	for (i in dov2)	text += '<tr bgcolor=C9F8B7><td align=center ' + (mdov2[1] == dov2[i] ? ' bgcolor=white': '') + '>' + dov2[i] + '</td></tr>'
	text += '</table></tr></td>'

	$('td.back4').append(text)
}, false);
//})();