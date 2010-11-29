//1-200т жалкое
//200-500т бедное
//500 - 1м среднее
//1-3м нормальное
//3-6м благополучное
//6-15м отличное
//Ѕольше 15 - богатое
//Ѕольше 40 - некуда деньги девать

$().ready(function() {

	var txt = '‘ин. положение: '

	$('td.l4:contains('+txt+')').each(function(){
			var fin = $(this).text().replace(txt,'').replace(/,/g,'').replace('$','')
			if (fin == 'жалкое') var newtxt =  $(this).text() + ' (1-200т)'
			if (fin >=1000000 && fin<3000000) var newtxt =  $(this).text()+ ' (нормальное)'
			$(this).html(newtxt);
	});
});