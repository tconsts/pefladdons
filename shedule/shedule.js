$().ready(function() {
	$('td.back4 td').each(function(i,val){
		var prevdt = ''
		if ($(val).text().search(/[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]/) == 0) {
			//$(val).css("border", "1px solid red");
			var day = ['вск','пнд','втр','срд','чтв','птн','суб']
			var dt = $(val).text().split('.')
			dt[0] = parseInt((dt[0][0]==0? dt[0][1]:dt[0]))
			dt[1] = parseInt((dt[1][0]==0? dt[1][1]:dt[1]))-1
			dt[2] = parseInt((dt[2][0]==0? dt[2][1]:dt[2]))+2000

			var curdt = new Date(dt[2],dt[1],dt[0])
			if (prevdt!=''){
				var p = (prevdt - curdt)/1000/60/60/24
				i=1
				while ( i < p ){
					var dd = new Date(prevdt - i*60*60*24*1000)
					var d = day[dd.getDay()]
					if (d=='пнд' || d=='срд' || d=='птн') $(val).parent().before('<tr bgcolor=white><td colspan=5> <td></tr>')
					i++
				}
				prevdt = curdt
			}
			$(val).html($(val).text()+'&nbsp;' + day[curdt.getDay()])
		}
	})
})