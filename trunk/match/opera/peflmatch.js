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

	
	var p = '<table =width=100%>'
	for (i in x) {
		var y = x[i].replace(/\.\.\./g,'...<br>').split('<br>')
		p += '<tr><td><table width=100% border=1>'
		for (j in y) {		
			p += '<tr><td width=30%></td><td>'+y[j]+'</td><td width=30%></td></tr>'
		}
		p += '</table><br></td></tr>'
	}
	p += '</table>'

	$('td.back4 table:eq(2) td').html(p)
/**/
}, false);