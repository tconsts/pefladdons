$().ready(function() {
	var day = ['вск','пнд','втр','срд','чтв','птн','суб']
	var prevdt = ''
	var today = new Date()
	$('td.back4 td').each(function(i,val){
		if ($(val).text().search(/[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]/) == 0) {
			$(val).parent().attr('bgcolor','#a3de8f')
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
						var str = (dd.getDate()<10 ? '0' : '' ) + dd.getDate() + '.'
						str += (dd.getMonth()<9 ? '0' : '') + (dd.getMonth()+1) + '.'
						str += (dd.getFullYear()-2000) + '&nbsp;' + d
						if (curdt == today) str.bold()
						$(val).parent().before('<tr><td></td><td>'+str.fontcolor('#888A85')+'</td><td colspan=3></td></tr>')
					}
					i++
				}
			}
			$(val).html($(val).text()+'&nbsp;' + day[curdt.getDay()])
			prevdt = curdt
		}
	})
	if( today!=prevdt ) {
		var td = (today.getDate()<10 ? '0' : '' ) + today.getDate() + '.'
		td += (today.getMonth()<9 ? '0' : '') + (today.getMonth()+1) + '.'
		td += (today.getFullYear()-2000) + '&nbsp;' + day[today.getDay()]
		$('td.back4 td:contains("Предстоящие игры") table:first').each(function(){
			var p = (prevdt - today)/1000/60/60/24
			var i=1
			while ( i < p ){
				var dd = new Date(prevdt - i*60*60*24*1000)
				var d = day[dd.getDay()]
				if (d=='пнд' || d=='срд' || d=='птн') {
					var str = (dd.getDate()<10 ? '0' : '' ) + dd.getDate() + '.'
					str += (dd.getMonth()<9 ? '0' : '') + (dd.getMonth()+1) + '.'
					str += (dd.getFullYear()-2000) + '&nbsp;' + d
					$(this).append('<tr><td></td><td>'+str.fontcolor('#888A85')+'</td><td colspan=3></td></tr>')
				}
				i++
			}
			$(this).append('<tr><td></td><td height=25><b>' + td.fontcolor('#888A85') + '</b></td><td colspan=3></td>')
		})

	}
})