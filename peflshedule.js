// ==UserScript==
// @name           peflshedule
// @namespace      pefl
// @description    modification shedule page
// @include        http://www.pefl.ru/plug.php?p=refl&t=last&j=*
// @include        http://pefl.ru/plug.php?p=refl&t=last&j=*
// @include        http://www.pefl.net/plug.php?p=refl&t=last&j=*
// @include        http://pefl.net/plug.php?p=refl&t=last&j=*
// @include        http://www.pefl.org/plug.php?p=refl&t=last&j=*
// @include        http://pefl.org/plug.php?p=refl&t=last&j=*
// @version        1.2

// ==/UserScript==

function filter(criteria){
		$('.back4 tr').each(function(index,value){
			if ($(this).html().indexOf('Матч')<0 && $(this).html().indexOf('now')<0){
			    if($(this).html().indexOf(criteria)<0){
			        $(this).fadeOut();
			    } else {
			    	$(this).fadeIn();
			    }
			}
		})
}

$().ready(function() {

	var imgecup = '<img height=12 src="system/img/g/e.gif">'
	var imgcup = '<img height=12 src="plugins/s/topcontributors/img/cup-1.gif">'
	var ecup = 	'16.11.11!25.11.11!02.12.11!14.12.11!19.12.11!26.12.11!13.01.12!18.01.12!25.01.12!03.02.12!13.02.12!20.02.12!27.02.12!12.03.12!19.03.12!02.04.12!09.04.12!23.04.12!07.05.12!18.05.12!25.05.12!01.06.12!'
	var cup = 	'21.11.11!07.12.11!23.12.11!30.01.12!08.02.12!05.02.12!26.03.12!16.04.12!'
	var excl = 	'30.12.11!02.01.12!04.01.12!06.01.12!09.01.12!02.05.12!04.05.12!'	
	var competitions=[];
	var i=0;
	$('td.back4 td:contains("Предстоящие игры") table tr:not(:contains("Матч")) td:last-child').contents().each(function(index,value){
	    if ($.inArray(value.textContent, competitions)<0){
	        competitions[i++]=value.textContent
	    }
	})
	
	var filtertext = '<br><b>Фильтр:</b> '
	
	for (var i in competitions){
		filtertext += ' | <a href="#" onclick="filter(\''+competitions[i]+'\'); return false;">'+competitions[i]+'</a>'
	}
	filtertext += ' | <t/><a href="#" onclick="$(\'.back4 tr\').fadeIn(); return false;">Все</a><t/>'
	$('.back4').prepend(filtertext)
	
	var day = ['вск','пнд','втр','срд','чтв','птн','суб'] 
	var prevdt = ''
	var today = new Date()
	var shownow = 0
	$('td.back4 td').each(function(i,val){
		if ($(val).text().search(/[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]/) == 0) {
			$(val).parent().attr('bgcolor','#a3de8f')
			var dt = $(val).text().split('.')
			dt[0] = parseInt((dt[0][0]==0? dt[0][1]:dt[0]))
			dt[1] = parseInt((dt[1][0]==0? dt[1][1]:dt[1]))-1
			dt[2] = parseInt((dt[2][0]==0? dt[2][1]:dt[2]))+2000

			var curdt = new Date(dt[2],dt[1],dt[0])

			if (curdt.getDate() == today.getDate() && curdt.getMonth() == today.getMonth()) shownow = 1;

			if (prevdt!=''){
				var p = (prevdt - curdt)/1000/60/60/24
				var i=1
				while ( i < p ){
					var dd = new Date(prevdt - i*60*60*24*1000 + 12*60*60*1000)
					var d = day[dd.getDay()]
					if (d=='пнд' || d=='срд' || d=='птн') {
						var img = ''
						var str = (dd.getDate()<10 ? '0' : '' ) + dd.getDate() + '.'
						str += (dd.getMonth()<9 ? '0' : '') + (dd.getMonth()+1) + '.'
						str += (dd.getFullYear()-2000)
						if(ecup.indexOf(str)!=-1)	img = imgecup
						if(cup.indexOf(str)!=-1)	img = imgcup
						if(excl.indexOf(str) == -1){
							str += '&nbsp;' + d
							$(val).parent().before('<tr class="freeId"><td></td><td>'+str.fontcolor('#888A85')+'</td><td colspan=2></td><td>'+img+'</td></tr>')
						}
					}
					i++
				}
			}
			var newtext = $(val).text()+'&nbsp;' + day[curdt.getDay()]
			if (shownow==1) $(val).css("border", "1px solid green");
			$(val).html(newtext)
			prevdt = curdt
		}
	})
	if (shownow == 0) {
		var td = (today.getDate()<10 ? '0' : '' ) + today.getDate() + '.'
		td += (today.getMonth()<9 ? '0' : '') + (today.getMonth()+1) + '.'
		td += (today.getFullYear()-2000) + '&nbsp;' + day[today.getDay()]
		$('td.back4 td:contains("Предстоящие игры") table:first').each(function(){
			var p = (prevdt - today)/1000/60/60/24
			var i=1
			var img = ''
			while ( i < p ){
				var dd = new Date(prevdt - i*60*60*24*1000 + 12*60*60*1000)
				var d = day[dd.getDay()]
				if (d=='пнд' || d=='срд' || d=='птн') {
					var str = (dd.getDate()<10 ? '0' : '' ) + dd.getDate() + '.'
					str += (dd.getMonth()<9 ? '0' : '') + (dd.getMonth()+1) + '.'
					str += (dd.getFullYear()-2000)
					if(ecup.indexOf(str)!=-1)	img = imgecup
					if(cup.indexOf(str)!=-1)	img = imgcup
					str += '&nbsp;' + d

					$(this).append('<tr><td></td><td height=25>'+str.fontcolor('#888A85')+'</td><td></td><td></td><td>'+img+'</td></tr>')
				}
				i++
			}
			img = ''
			str = td.split('&nbsp;')[0]
			if(ecup.indexOf(str)!=-1)	img = imgecup
			if(cup.indexOf(str)!=-1)	img = imgcup
			$(this).append('<tr><td></td><td class="now" height=25>' + td.fontcolor('#888A85') + '</td><td></td><td></td><td>'+img+'</td>')
		})
		$('td.now').css("border", "1px solid green");//#a3de8f
	}
	
	
})
