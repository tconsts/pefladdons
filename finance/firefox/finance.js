$().ready(function() {
	var finance = []
	var cur = {}
	var fin = {}

	cur.bablo = $('td.back4 > table b').html().split('<br>')[3].split(':')[1].replace(/\,/g,'').replace('$','')
	
	$('td.back4 > table table').each(function(i,val){
		var curtable = finance[i] = {}
		$(val).attr('id', i)
		curtable.name = $(val).prev().text()
		$(val).find('td:even').each(function(){
			curtable[$(this).text()] = parseInt($(this).next().text().replace(/\,/g,'').replace('$',''))
		})
	})

	fin.id = 81
	cur.id = finance[2]['Спонсоры']/finance[0]['Спонсоры']

	cur.zpperc = (finance[3]['Зарплаты игрокам']/finance[2]['Спонсоры']*100).toFixed(1)+'%'
	cur.schoolperc = (finance[3]['Школа']/finance[2]['Спонсоры']*100).toFixed(1)+'%'
	
	fin.sponsors = finance[0]['Спонсоры'] * 81
	fin.zp = finance[3]['Зарплаты игрокам'] + (fin.id-cur.id)*finance[1]['Зарплаты']
	fin.zpperc = (fin.zp/fin.sponsors*100).toFixed(1)+'%'
	fin.school = finance[3]['Школа'] + (fin.id-cur.id)*finance[1]['Школа']
	fin.schoolperc = (fin.school/fin.sponsors*100).toFixed(1)+'%'


	$('table#2 td:odd, table#3 td:odd').attr('width','30%').attr('id','cur').after('<td width=30% id=fin></td>')

	var preparedhtml = '<tr><th width=40%></th><th width=30% bgcolor=#A3DE8F>Текущий '+cur.id+' ИД</th><th width=30% bgcolor=#A3DE8F>Прогноз на '+fin.id+' ИД</th></tr>'
	$('table#2, table#3').prepend(preparedhtml)

	$('td#cur').each(function(i, val){
		if(i==7) $(val).html($(val).html()+' ('+cur.schoolperc+')')
	})

	$('td#fin').each(function(i, val){
		if(i==0) $(val).html(((fin.sponsors/1000000).toFixed(3).replace(/\./g,',')+',000$').bold())
		if(i==5) $(val).html(((fin.zp/1000000).toFixed(3).replace(/\./g,',')+',000$').bold())
		if(i==7) $(val).html(((fin.school/1000000).toFixed(3).replace(/\./g,',')+',000$').bold()+' ('+fin.schoolperc+')')
	})
	return false
})

