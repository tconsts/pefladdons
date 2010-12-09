$().ready(function() {
	$('td.back4 td').each(function(i,val){
		if ($(val).text().search(/[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]/) == 0) {
			//$(val).css("border", "1px solid red");
			var day = ['вск','пнд','втр','срд','чтв','птн','суб']
			var dt = $(val).text().split('.')
			dt[0] = parseInt((dt[0][0]==0? dt[0][1]:dt[0]))
			dt[1] = parseInt((dt[1][0]==0? dt[1][1]:dt[1]))-1
			dt[2] = parseInt((dt[2][0]==0? dt[2][1]:dt[2]))+2000

			var dateObj = new Date(dt[2],dt[1],dt[0])
			$(val).html($(val).text()+'&nbsp;' + day[getDay(dateObj)])
		}
	})
})