function format(num) {
	if (num < 1000000 && num > -1000000) {
		return (num/1000).toFixed(0) + ',000jQuery'
	} else {
		return (num/1000000).toFixed(3).replace(/\./g,',') + ',000jQuery'	
	}
}

jQuery().ready(function() {
	var finance = []
	var cur = {}
	var fin = {}

	cur.bablo = parseInt(jQuery('td.back4 > table b:first').html().split('<br>')[3].split(':')[1].replace(/\,/g,'').replace('jQuery',''))

	if(jQuery('td.back4 > table b:eq(1)').html().split('<br>')[6] != undefined){
		cur.bonus = parseInt(jQuery('td.back4 > table b:eq(1)').html().split('<br>')[6].split('Бонус: ')[1].replace(/\,/g,'').replace('jQuery',''))
	} else if(jQuery('td.back4 > table b:first').html().indexOf('Бонус:') != -1){
		cur.bonus = parseInt(jQuery('td.back4 > table b:first').html().split('<br>')[11].split('Бонус: ')[1].replace(/\,/g,'').replace('jQuery',''))
	} else {
		cur.bonus = 0
	}

	jQuery('td.back4 > table table').each(function(i,val){
		var curtable = finance[i] = {}
		jQuery(val).find('td:even').each(function(){
			curtable[jQuery(this).text()] = parseInt(jQuery(this).next().text().replace(/\,/g,'').replace('jQuery',''))
		})
		jQuery(val).attr('id', i)
	})
/**
	var mm = '<br>DEBUG INFO:<br>'	
	mm += '<br>'
	for (j in finance) mm += finance[j] + '<br>'
	for (j in finance) for (k in finance[j])  mm += finance[j][k] + '<br>'
	jQuery('td.back4').append(mm)
/**/

	sponsors = finance[0]['Спонсоры']
	zp = finance[1]['Зарплаты']
	school = finance[1]['Школа']

	fin.fid = 85

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


	jQuery('table#2 td:odd, table#3 td:odd').attr('width','30%').attr('id','cur').after('<td width=30% id=fin></td>')

	var preparedhtml = '<tr><th width=40%></th><th width=30% bgcolor=#A3DE8F>Текущий '+cur.fid+' ФИД</th><th width=30% bgcolor=#A3DE8F>Прогноз на '+fin.fid+' ФИД</th></tr>'
	jQuery('table#2, table#3').prepend(preparedhtml)

	jQuery('td#cur').each(function(i, val){
		if(i==7) jQuery(val).html(jQuery(val).html()+' ('+cur.schoolperc+')')
	})

	jQuery('td#fin').each(function(i, val){
		if(i==0) jQuery(val).html((format(fin.sponsors)).bold())
		if(i==1) jQuery(val).html('~'+format(fin.stadion))
		if(i==2) jQuery(val).html(format(fin.priz).bold())
		if(i==3) jQuery(val).html(format(fin.sale).bold())
		if(i==4) jQuery(val).html('~'+format(fin.allup))

		if(i==5) jQuery(val).html(format(fin.zp).bold())
		if(i==6) jQuery(val).html(format(fin.buy).bold())
		if(i==7) jQuery(val).html(format(fin.school).bold()+' ('+fin.schoolperc+')')
		if(i==8) jQuery(val).html(format(fin.alldown).bold())
	})

	preparedhtml  = '<hr><table id="4" width=100% border=0>'
	preparedhtml += '<tr><td width=40%><b>Плюс\\Минус</b></td>'
	preparedhtml += '<td width=30%>' + (format(cur.plusminus)).bold() + '</td>'
	preparedhtml += '<td width=30%>' + (format(fin.plusminus)).bold() + '</td></tr>'
	preparedhtml += '<tr><td width=40%><b>На счету</b></td>'
	preparedhtml += '<td width=30%>' + (format(cur.bablo)).bold() + '</td>'
	preparedhtml += '<td width=30%>' + (format(fin.bablo)).bold() + '</td></tr>'
	preparedhtml += '</table>'
	jQuery('td.back4 table#3').after(preparedhtml)

	return false
})

