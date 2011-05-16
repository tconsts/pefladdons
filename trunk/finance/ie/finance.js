// ==UserScript==
// @name           peflfinance
// @namespace      pefl
// @description    finance page modification
// @include        http://www.pefl.ru/plug.php?p=fin&z=*
// @include        http://pefl.ru/plug.php?p=fin&z=*
// @include        http://www.pefl.net/plug.php?p=fin&z=*
// @include        http://pefl.net/plug.php?p=fin&z=*
// @include        http://www.pefl.org/plug.php?p=fin&z=*
// @include        http://pefl.org/plug.php?p=fin&z=*
// @version			1.1
// ==/UserScript==

function format(num) {
	if (num < 1000000 && num > -1000000) {
		return (num/1000).toFixed(0) + ',000$'
	} else {
		return (num/1000000).toFixed(3).replace(/\./g,',') + ',000$'	
	}
}

//document.addEventListener('DOMContentLoaded', function(){
(function(){ 		// for ie
//$().ready(function() {
	var finance = []
	var cur = {}
	var fin = {}

	var ffn = $('td.back4 > table td:eq(1)').html()
	var zp = parseInt(ffn.split('Сумма зарплат:')[1].split('<br>')[0].replace(/\,/g,'').replace('$',''))
	cur.bablo = parseInt(ffn.split('Финансы:')[1].split('<br>')[0].replace(/\,/g,'').replace('$',''))
	cur.bonus = (ffn.indexOf('Бонус:') != -1 ? parseInt(ffn.split('Бонус:')[1].split('<br>')[0].replace(/\,/g,'').replace('$','')) : 0)

	$('td.back4 > table table').each(function(i,val){
		var curtable = finance[i] = {}
		$(val).attr('id', i)
		curtable.name = $(val).prev().text()
		$(val).find('td:even').each(function(){
			curtable[$(this).text()] = parseInt($(this).next().text().replace(/\,/g,'').replace('$',''))
		})
	})

	var chbonus = Math.floor(((finance[0]['Продажа игроков'] + finance[1]['Покупка игроков'])*0.05)/1000)*1000

	var sponsors = finance[0]['Спонсоры']
//	zp = finance[1]['Зарплаты']
	var school = finance[1]['Школа'] - chbonus

	fin.fid = 81

	cur.sponsors = finance[2]['Спонсоры']
	cur.stadion = finance[2]['Стадион']
	cur.priz = finance[2]['Призовые']
	cur.sale = finance[2]['Продажа игроков']
	cur.allup = finance[2]['Всего']

	cur.zp = finance[3]['Зарплаты игрокам']
	cur.zpperc = (cur.zp/cur.sponsors*100).toFixed(1)+'%'
	cur.buy = finance[3]['Покупка игроков']
	cur.school = finance[3]['Школа']
	cur.schoolperc = (cur.school/cur.sponsors*100).toFixed(1)+'%'
	cur.alldown = finance[3]['Всего']
	cur.plusminus = cur.allup - cur.alldown

	cur.fid = (cur.sponsors - cur.bonus)/sponsors

	if(cur.fid>fin.fid) fin.fid = cur.fid

	fin.sponsors = sponsors * fin.fid + cur.bonus
	fin.stadion = cur.stadion*fin.fid/cur.fid
	fin.priz = cur.priz
	fin.sale = cur.sale
	fin.allup = fin.sponsors + fin.stadion + fin.priz + fin.sale

	fin.zp = cur.zp + (fin.fid-cur.fid)*zp
	fin.zpperc = (fin.zp/fin.sponsors*100).toFixed(1) + '%'
	fin.buy = cur.buy
	fin.school = cur.school + (fin.fid-cur.fid)*school
	fin.schoolperc = (fin.school/fin.sponsors*100).toFixed(1)+'%'
	fin.alldown = fin.zp + fin.buy + fin.school
	fin.plusminus = fin.allup - fin.alldown
	fin.bablo = (fin.allup - cur.allup) - (fin.alldown - cur.alldown) + cur.bablo


	$('table#2 td:odd, table#3 td:odd').attr('width','30%').attr('id','cur').after('<td width=30% id=fin></td>')

	var preparedhtml = '<tr><th width=40%></th><th width=30% bgcolor=#A3DE8F>Текущий '+cur.fid+' ФИД</th>'
	if(fin.fid != cur.fid) preparedhtml += '<th width=30% bgcolor=#A3DE8F>Прогноз на '+fin.fid+' ФИД</th>'
	preparedhtml += '</tr>'
	$('table#2, table#3').prepend(preparedhtml)

	$('td[id=cur]:eq(7)').append(' ('+cur.schoolperc+')')
	if(fin.fid != cur.fid) {
		$('td[id=fin]:eq(0)').html((format(fin.sponsors)).bold())
		$('td[id=fin]:eq(1)').html('~'+format(fin.stadion))
		$('td[id=fin]:eq(2)').html(format(fin.priz).bold())
		$('td[id=fin]:eq(3)').html(format(fin.sale).bold())
		$('td[id=fin]:eq(4)').html('~'+format(fin.allup))

		$('td[id=fin]:eq(5)').html(format(fin.zp).bold())
		$('td[id=fin]:eq(6)').html(format(fin.buy).bold())
		$('td[id=fin]:eq(7)').html(format(fin.school).bold()+' ('+fin.schoolperc+')')
		$('td[id=fin]:eq(8)').html(format(fin.alldown).bold())
	}
	preparedhtml  = '<hr><table width=100% id="4">'
	preparedhtml += '<tr><td width=40%><b>Плюс\\Минус</b></td>'
	preparedhtml += '<td width=30%>' + (format(cur.plusminus)).bold() + '</td>'
	if(fin.fid != cur.fid) preparedhtml += '<td width=30%>' + (format(fin.plusminus)).bold() + '</td>'
	else preparedhtml += '<td width=30%></td>'
	preparedhtml += '</tr>'
	preparedhtml += '<tr><td><b>На счету</b></td>'
	preparedhtml += '<td>' + (format(cur.bablo)).bold() + '</td>'
	if(fin.fid != cur.fid) preparedhtml += '<td>' + (format(fin.bablo)).bold() + '</td>'
	preparedhtml += '</tr>'
	preparedhtml += '</table>'
	$('td.back4 table#3').after(preparedhtml)

	return false
//}, false)
})(); // for ie
