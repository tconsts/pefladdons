$().ready(function() {
	var prevdt = ''
	$('td.back4 td').each(function(i,val){
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
				var i=1
				while ( i < p ){
					var dd = new Date(prevdt - i*60*60*24*1000)
					var d = day[dd.getDay()]
					if (d=='пнд' || d=='срд' || d=='птн') {
						var str += (dd.getDate()<10 ? '0' : '' ) + dd.getDate() + '.'
						str += (dd.getMonth()<9 ? '0' : '') + (dd.getMonth()+1) + '.'
						str += (dd.getYear()-2000) + '&nbsp;' + d +
						$(val).parent().before('<tr bgcolor=white><td></td><td>'+str.fontsize(1)+'</td><td></td><td></td><td></td></tr>')
					}
					i++
				}
			}
			$(val).html($(val).text()+'&nbsp;' + day[curdt.getDay()])
			prevdt = curdt
		}
	})
})