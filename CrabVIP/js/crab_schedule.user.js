// ==UserScript==
// @name           peflschedule
// @namespace      pefl
// @description    modification schedule page
// @include        https://*pefl.*/plug.php?p=refl&t=last&j=*
// @encoding	   windows-1251
// ==/UserScript==

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
	matches.sort(function(a,b){if(a!=null&&b!=null) return (((a.dt==undefined?(a.hnm!=undefined&&a.anm!=undefined?0:100000000):a.dt) + a.id*0.0000001) - ((b.dt==undefined?(b.hnm!=undefined&&b.anm!=undefined?0:100000000):b.dt) + b.id*0.0000001))})
	var supic = '<img src="system/img/g/tick.gif" height=12></img>'
	var myteamid = parseInt(localStorage.myteamid)
	var myteamname = ''
	$('td.back4 table:first table:eq(1) tr:eq(1) td:eq(0) a').each(function(){
		if(parseInt(Url.value('j',$(this))) == myteamid) myteamname = $(this).text()
	})

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
			var matchid = parseInt(Url.value('j',$(this).find('td:eq(3) a')[0]))
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

let matches = [];
$().ready(function() {
	if (parseInt(localStorage.myteamid) == parseInt(Url.value('j'))) showMatches();
})