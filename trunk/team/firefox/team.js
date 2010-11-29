$().ready(function() {
	var txt = 'Фин. положение: '
	$('td.l4:contains('+txt+')').each(function(){
			var fin = $(this).text().replace(txt,'').replace(/,/g,'').replace('$','')
			var newtxt = '';
			switch (fin){
				case 'банкрот': newtxt = ' (меньше 0)';break;
				case 'жалкое': newtxt = ' (1т-200т)';break;
				case 'бедное': newtxt =  ' (200т-500т)';break;
				case 'среднее': newtxt =  ' (500т-1м)';break;
				case 'нормальное': newtxt = ' (1м-3м)';break;
				case 'благополучное': newtxt = ' (3м-6м)';break;
				case 'отличное': newtxt =  ' (6м-15м)';break;
				case 'богатое': newtxt =  ' (15м-40м)';break;
				case 'некуда деньги девать :-)': newtxt =  ' (>40м)';break;
				default:
					if (fin >= 40000000) newtxt = ' (некуда девать)'
					else if (fin >= 15000000) newtxt = ' (богатое)'
					else if (fin >= 6000000) newtxt = ' (отличное)'
					else if (fin >= 3000000) newtxt = ' (благополучное)'
					else if (fin >= 1000000) newtxt = ' (нормальное)'
					else if (fin >= 500000) newtxt = ' (среднее)'
					else if (fin >= 200000) newtxt = ' (бедное)'
					else if (fin >=0) newtxt = ' (жалкое)'
					else if (fin < 0) newtxt = ' (банкрот)'
			}
			var preparedhtml = 'Фин: '+$(this).text().replace(txt,'').replace(' :-)','')+newtxt.fontsize(1)
			$(this).html(preparedhtml);
	});
});