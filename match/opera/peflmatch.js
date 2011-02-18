// ==UserScript==                                     
// @name           peflmatch
// @namespace      pefl
// @description    match page modification (PEFL.ru and .net)
// @include        http://www.pefl.ru/plug.php?p=refl&t=if&*
// @include        http://pefl.ru/plug.php?p=refl&t=if&*
// @include        http://www.pefl.net/plug.php?p=refl&t=if&*
// @include        http://pefl.net/plug.php?p=refl&t=if&*
// ==/UserScript==

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

document.addEventListener('DOMContentLoaded', function(){

//	$('td.back4 table:first').attr('border','5')	// расстановка
//	$('td.back4 table:eq(1)').attr('border','1')	// все вместе кроме расстановки
//	$('td.back4 table:eq(2)').attr('border','1')	// отчет
//	$('td.back4 table:eq(3)').attr('border','2')	// заголовок матча
//	$('td.back4 table:eq(4)').attr('border','3')	// голы\лого
//	$('td.back4 table:eq(5)').attr('border','4')	// стата
//	$('td.back4 table:eq(6)').attr('border','5')	// оценки

/**/

	var x = $('td.back4 table:eq(2) td')
		.find('script').remove().end()
		.find('a').remove().end()
		.find('img').remove().end()
		.html().split('<br><br>')

	var team1name = 'Анжи' //$('td.back4 table:eq(3) tr:first td:first').text()
	var team2name = 'Динамо Брн' //$('td.back4 table:eq(3) tr:first td:last').text() //.replace('&nbsp;','')
//	alert('"'+team1name+'"')
//	alert('"'+team2name+'"')
	
	var p = '<table width=100%>'
	var flag = 0
	for (i in x) {
		var y = x[i].replace(/\.\.\./g,'...<br>').split('<br>')
		p += '<tr><td><table width=100% border=1><tr><td width=33%>'+team1name+'</td><td></td><td width=33%>'+team2name+'</td></tr>'
		flag = 0
		for (j in y) {
			var t1 = y[j].indexOf(team1name)
			var t2 = y[j].indexOf(team2name)
			var p1 = ''
			var p2 = ''
			var p0 = ''
			if ((t2 != -1 && t1 == -1) || (t2 != -1 && t1 != -1 && t2 < t1)) {
				p2 = y[j]
				flag = 2
			} else if ((t1 != -1 && t2 == -1) || (t1 != -1 && t2 != -1 && t1 < t2)) {
				p1 = y[j] 				
				flag = 1
			} else if (flag == 2){
				p2 = y[j]
				flag = 2
			} else if (flag == 1){
				p1 = y[j]
				flag = 1
			} else {
				p0 = y[j]
				flag = 0
			}

			p += '<tr><td>'+p1+'</td><td>'+p0+'</td><td>'+p2+'</td></tr>'
		}
		p += '</table><br></td></tr>'
	}
	p += '</table>'

	$('td.back4 table:eq(2) td').html(p)
/**/
}, false);