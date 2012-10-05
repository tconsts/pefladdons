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

deb = (localStorage.debug == '1' ? true : false)
var debnum = 1

function debug(text) {
	if(deb) {
		if(debnum==1) $('body').append('<div id=debug>DEBUG INFROMATION<hr></div>')
		$('div#debug').append(debnum+'&nbsp;\''+text+'\'<br>');
		debnum++;
	}
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

function filter(criteria){
//	if(deb) $('td.back4 table:first table').attr('border',1)
	$('td.back4 table:first table tr:not(#trnow)').each(function(){
		var txt = $(this).html()
		debug('filter:1')
		if (txt.indexOf('Матч')==-1){// && txt.indexOf('now')==-1){
/**/	    if(txt.indexOf(criteria)==-1){
		        $(this).hide();
				debug('filter:fadeOut:')
		    } else {
		    	$(this).show();
				debug('filter:fadeIn:')
		    }
/**/
		}
	})
}
function CheckInt(ddn, fl){
	var strn = ''
	strn += (ddn.getDate()<10 ? '0' : '' ) + ddn.getDate() + '.'
	strn += (ddn.getMonth()<9 ? '0' : '') + (ddn.getMonth()+1) + '.'
	strn += (ddn.getFullYear()-2000)
	var htmlnew = '<td rowspan=2 width=1% bgcolor=C9F8B7><table width=100% cellpadding="0" cellspacing="0"><tr><td> </td></tr><tr bgcolor=A3DE8F><td height=20>'+fl+'</td></tr><tr><td> </td></tr></table></td>'
	if(int.indexOf(strn)!=-1) return htmlnew
	return ''
}

var int = 	'17.01.12!31.01.12!14.02.12!28.02.12!13.03.12!27.03.12!10.04.12!24.04.12!08.05.12!22.05.12!05.06.12!19.06.12!'

var matches = []
function returnDate(tmsp){
	if(tmsp!=undefined){
		var dt = new Date(tmsp*100000)
		mdate = parseInt(dt.getDate())
		mmonth = parseInt(dt.getMonth())+1
		return (mdate<10?'0':'')+mdate+'.'+(mmonth<10?0:'')+mmonth//+ '.'+dt.getFullYear()
	}
	return ''
}

function showMatches(){
	if(String(localStorage.matches2)!='undefined') matches = JSON.parse(localStorage.matches2)
	debug('showMatches()')
	var supic = '<img src="system/img/g/tick.gif" height=12></img>'
	var myteamid = parseInt(localStorage.myteamid)
	var myteamname = ''
	$('td.back4 table:first table:eq(1) tr:eq(1) td:eq(0) a').each(function(){
		if(parseInt(UrlValue('j',$(this).attr('href'))) == myteamid) myteamname = $(this).text()
	})
	//for(p in matches)

	$('td.back4 table:first table:eq(1) tr[bgcolor]').addClass('back3').removeAttr('bgcolor')
	$('td.back4 table:first table:eq(1) tr').each(function(val){
		$(this).find('td').attr('nowrap','')
		if(val==0){
			$(this).prepend('<td title="Идет в зачет сверхусталости">СУ</td><td>дата</td>')
			$(this).find('td:eq(5)').attr('colspan',2)
		}else{
			$(this).prepend('<td></td><td nowrap></td>')
			$(this).find('td:eq(5)').after('<td nowrap></td>')
			//get match id
			var matchid = parseInt(UrlValue('j',$(this).find('td:eq(3) a').attr('href')))
			for(k in matches){
				if(matches[k]!=null&& matches[k]!=undefined && matches[k].id==matchid){
					var mch = matches[k]
					$(this).find('td:eq(0)').html((mch.su==undefined ? supic : ''))
					$(this).find('td:eq(1)').html(returnDate(mch.dt)+(mch.n==1 ? ' N' : ''))
					var t1u = ''
					var t2u = ''
					if(mch.ust!=undefined){
						var ust = mch.ust.split('.')
						t1u = (ust[1]==undefined || ust[1]=='h' ? (ust[0]=='p' ? '(прд)' : '(акт) ' ).fontcolor('red') : '') //p.h a.h p
						t2u = (ust[1]==undefined || ust[1]=='a' ? (ust[0]=='p' ? '(прд)' : '(акт)' ).fontcolor('red') : '') //p.a a.a p
					}
					$(this).find('td:eq(2)').append(t2u).html($(this).find('td:eq(2)').html().replace(' -',t1u+' -'))
					$(this).find('td:eq(3)').append((mch.pen!=undefined ? '&nbsp;(п&nbsp;'+mch.pen+')' : ''))
					$(this).find('td:eq(6)').html('&nbsp;<img height=15 src="/system/img/w'+(mch.w==undefined?0:mch.w)+'.png"></img>&nbsp;'+(mch.r==undefined?'':mch.r))
					delete matches[k]
				}
			}
		}
	})
	// дорисовываем забытые матчи
	$('td.back4 table:first table:eq(1) tr:last').attr('id','last')
	var num=0
	for(i in matches){
		mch = matches[i]
		if(mch!=null && mch!=undefined && (mch.anm==undefined || mch.hnm==undefined)){
			debug(mch.id+':'+mch.hnm+' '+mch.res+' '+ mch.anm)
			var html = '<tr'+(num%2?' class="back3"':'')+'>'
			html += '<td>'+(mch.su==undefined ? supic : '')+'</td>'
			html += '<td nowrap>'+returnDate(mch.dt)+(mch.n==1 ? ' N' : '')+'</td>'
			var t1u = ''
			var t2u = ''
			if(mch.ust!=undefined){
				var ust = mch.ust.split('.')
				t1u = (ust[1]==undefined || ust[1]=='h' ? (ust[0]=='p' ? '(прд)' : '(акт) ' ).fontcolor('red') : '') //p.h a.h p
				t2u = (ust[1]==undefined || ust[1]=='a' ? (ust[0]=='p' ? '(прд)' : '(акт)' ).fontcolor('red') : '') //p.a a.a p
			}
			html += '<td nowrap><a>'+(mch.hnm==undefined ? myteamname : mch.hnm)+'</a>'+t1u+' - <a>'+(mch.anm==undefined ? myteamname : mch.anm)+'</a>'+t2u+'</td>'
			html += '<td nowrap>'+(mch.h!=undefined?'<a href="plug.php?p=refl&t=if&j='+mch.id+'&z='+mch.h+'">':'')+mch.res+(mch.h!=undefined?'</a>':'')+(mch.pen!=undefined ? ' (п '+mch.pen+')':'')+'</td>'
			html += '<td><img src="skins/refl/img/i3.gif" width="15" border="0" align="absmiddle"></img></td>'
			html += '<td></td>'
			html += '<td nowrap>&nbsp;<img height=15 src="/system/img/w'+(mch.w==undefined?0:mch.w)+'.png"></img>&nbsp;'+(mch.r==undefined?'':mch.r)+'</td>'
			html += '<td nowrap>'+(mch.tp!=undefined ? (mch.tp=='t'?'Товарищеский':mch.tp):'')+'</td>'
			html += '</tr>'
			$('td.back4 table:first table:eq(1) tr'+(mch.h==undefined ? ':eq(0)':'#last')).after(html)
			num++
		}
	}
}

$().ready(function() {

	if(parseInt(localStorage.myteamid)==parseInt(UrlValue('j'))) showMatches()

	var imgecup = '<img height=12 src="system/img/g/e.gif">'
	var imgcup  = '<img height=12 src="plugins/s/topcontributors/img/cup-1.gif">'
	var imgint  = '<img src="system/img/g/int.gif">'
	var ecup = 	'16.11.11!25.11.11!02.12.11!14.12.11!19.12.11!26.12.11!13.01.12!18.01.12!25.01.12!03.02.12!13.02.12!20.02.12!27.02.12!12.03.12!19.03.12!02.04.12!09.04.12!23.04.12!07.05.12!18.05.12!25.05.12!01.06.12!'
	var cup = 	'21.11.11!07.12.11!23.12.11!30.01.12!08.02.12!05.03.12!26.03.12!16.04.12!'
	var excl = 	'30.12.11!02.01.12!04.01.12!06.01.12!09.01.12!30.04.12!02.05.12!04.05.12!'	
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
	filtertext += ' | <t/><a href="#" onclick="$(\'td.back4 tr\').fadeIn(); return false;">Все</a><t/>'
	$('td.back4').prepend(filtertext)
	
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
					var dd  = new Date(prevdt - i*60*60*24*1000 + 12*60*60*1000)
					var d = day[dd.getDay()]
					if (d=='пнд' || d=='срд' || d=='птн') {
						var img = ''
						var str = ''
						str += (dd.getDate()<10 ? '0' : '' ) + dd.getDate() + '.'
						str += (dd.getMonth()<9 ? '0' : '') + (dd.getMonth()+1) + '.'
						str += (dd.getFullYear()-2000)
						if(ecup.indexOf(str)!=-1)	img = imgecup
						if(cup.indexOf(str)!=-1)	img = imgcup
						if(excl.indexOf(str) == -1){
				            var ddaten = new Date(dd.getTime() + 60*60*24*1000);
							$(val).parent().prev().append(CheckInt(ddaten,imgint))

							str += '&nbsp;' + d
							var tt = '<tr class="freeId" height=25>'
							tt += '<td></td>'
							tt += '<td>'+str.fontcolor('#888A85')+'</td>'
							tt += '<td colspan=2></td>'
							tt += '<td>'+img+'</td>'
							tt += '</tr>'
							$(val).parent().before(tt)
						}
						
					}
					i++
				}
			}
            var daten = new Date(curdt.getTime() + 60*60*24*1000);
			$(val).parent().prev().append(CheckInt(daten,imgint))

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
					if(excl.indexOf(str) == -1){
			            var ddn = new Date(dd.getTime() + 60*60*24*1000);
						var strn = ''
						strn += (ddn.getDate()<10 ? '0' : '' ) + ddn.getDate() + '.'
						strn += (ddn.getMonth()<9 ? '0' : '') + (ddn.getMonth()+1) + '.'
						strn += (ddn.getFullYear()-2000)
						//if(int.indexOf(strn)!=-1) strint = '<tr bgcolor=#a3de8f><td></td><td><i>'+'</i></td><td></td><td></td><td>'+imgint+' '+(strn.fontsize(1)).fontcolor('#888A85')+'</td></tr>'
						str += '&nbsp;' + d
						$(this).append('<tr><td></td><td height=25>'+str.fontcolor('#888A85')+'</td><td></td><td></td><td>'+img+'</td>'+CheckInt(ddn,imgint)+'</tr>')
					}
				}
				i++
			}
			img = ''
			str = td.split('&nbsp;')[0]
			if(ecup.indexOf(str)!=-1)	img = imgecup
			if(cup.indexOf(str)!=-1)	img = imgcup
			$(this).append('<tr id="trnow"><td></td><td class="now" height=25>' + td.fontcolor('#888A85') + '</td><td></td><td></td><td>'+img+'</td>')
		})
		$('td.now').css("border", "1px solid green");//#a3de8f
	}
})