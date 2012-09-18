// ==UserScript==
// @name           peflcontracts
// @namespace      pefl
// @description    contracts modification
// @include        http://*pefl.*/plug.php?p=fin&t=ctr&*
// @include        http://*pefl.*/plug.php?p=tr&*
// @version        1.0
// ==/UserScript==

deb = (localStorage.debug == '1' ? true : false)
var debnum = 0
var db = false
var ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
var teams = []


$().ready(function() {
	var t = UrlValue('t')
	var p = UrlValue('p')
	if(p=='tr'){
		if(t=='nc' || t=='ctrf'){
		/**
			$('td.back4').append('form:<br>')
				$("form").submit(function() {
				$('td.back4').append($("input:eq(0)").val()+'<br>')
				$('td.back4').append($("select:first").val()+'<br>')
				return false;
	    	});
		/**/
		}else if(t=='staff' || t=='alist' || t=='nlist' || t=='tlist' || t=='free'){
			$('td.back4 table tr[bgcolor]').addClass('back3').removeAttr('bgcolor')
		}else if(t=='transfers' || t=='transfers3' || t=='transfers4') {
			// fix table colors
			$('td.back4 table tr[bgcolor]').addClass('back3').removeAttr('bgcolor')
			GetTeams(parseInt(localStorage.mycountry),localStorage.mycountry.split('.')[1])
		}
	} else if(p=='fin'){
		// fix table colors
		$('td.back4 table table tr[bgcolor]').addClass('back3').removeAttr('bgcolor')

		var schnum = parseInt(localStorage.schoolnum)
		var schpls = String(localStorage.schoolnum)
		var schtable = ''
        if(schnum!=0 && schpls != 'undefined'){
			schtable += '<hr>Школьники:<hr>'
			schtable += '<table width=100% id=sch>'
			schpls = schpls.split('.')
			for(i in schpls){
				if(i>0 && schpls[i]!=undefined && !UrlValue('j')){
					schtable += '<tr>'
					schtable += '<td width=5%>'+i+'</td>'
					schtable += '<td width=30%>'+(schpls[i].split(':')[1]==undefined ? 'школьник' : schpls[i].split(':')[1] )+'</td>'
					schtable += '<td width=10% align=right>100$</td>'
					schtable += '<td width=5%  align=center>'+(21-parseInt(schpls[i]))+'г.</td>'
					schtable += '<td></td>'
					schtable += '<td width=5% align=right class=sch>0$</td>'
					schtable += '</tr>'
				}
			}
			schtable += '</table>'
		}
		$('td.back4 table table:last').after(schtable)
		$('table#sch tr:odd').addClass('back3')

		// расчет и отображение суммы увольнения и подсчет суммы зарплат
		var szp=0
		$('td.back4 table table tr').each(function(){
			var wage = parseInt($(this).find('td:eq(2)').html())
			var cnt = parseInt($(this).find('td:eq(3)').html())
			szp += wage
			$(this).find('td:last:not(.sch)').after('<td width=5% align=right>'+((wage*cnt*25)/1000).toFixed(3)+'$</td>')
		})
		var szptxt = '<hr><table width=100%><tr><td width=5%></td><td width=30% class=back3><b>Точная сумма зарплат:</b></td><td width=10% ALIGN=right class=back3><b>'+String((szp/1000).toFixed(3)).replace('.',',')+'$</b></td><td colspan=2></td></tr></table>';
		$('td.back4 table table:last').after(szptxt)
		$('td.back4').append('<br>*  - последняя колонка показывает сумму компенсации при увольнении')
		$('td.back4').append('<br>** - для учета в подсчете школьников сходите в школу')
	}
});

function GetTeams(nid,nname){
		debug('GetTeams:nid='+nid+':nname='+nname)
		if(ff){
			debug('GetTeams as FF')
			var list = {'teams':'tid,my,did,num,tdate,tplace,ncode,nname,tname,mname,ttask,tvalue,twage,tss,age,pnum,tfin,screit,scbud,ttown,sname,ssize,mid'}
			var head = list['teams'].split(',')
			var text1 = String(localStorage['teams'])
			if (text1 != 'undefined'){
				var text = text1.split('#')
				for (i in text) {
					var x = text[i].split('|')
					var curt = {}
					var num = 0
					for(j in head){
						curt[head[j]] = (x[num]!=undefined ? x[num] : '')
						num++
					}
					teams[parseInt(curt['tid'])] = curt['nname']
				}
				MarkMyCountry(nid,nname)
			}
		}else{
			if(!db) DBConnect()
			db.transaction(function(tx) {
				tx.executeSql("SELECT tid,nname,tname FROM teams",[],
					function(tx, result){
						for(var i = 0; i < result.rows.length; i++) {
							var row = result.rows.item(i)
							//debug('GetTeams:tid='+row['tid']+':nname='+row['nname']+':tname='+row['tname'])
							teams[parseInt(row['tid'])] = row['nname']
						}
						MarkMyCountry(nid,nname)
					},
					function(tx, error) {debug(error.message)}
				);                                           
			})		
		}
}

function MarkMyCountry(nid,nname){
	debug('MarkMyCountry:nid='+nid+':nname='+nname)
	$('span.text2b').html('Помечены команды: '+nname)
	var t1=0
	var t2=0
	$('td.back4 table table tr:eq(0) td').each(function(k,kval){
		if($(kval).text().trim()=='Откуда')	t1=k
		if($(kval).text().trim()=='Куда')	t2=k
	})
	debug('MarkMyCountry:t1='+t1+':t2='+t2)
	$('td.back4 table table tr:gt(0)').each(function(k,kval){
		$(kval).find('td:eq('+t1+'), td:eq('+t2+')').each(function(){
			if(nname==teams[parseInt(UrlValue('j',$(this).find('a').attr('href')))]) {
				debug('MarkMyCountry:teamid='+parseInt(UrlValue('j',$(this).find('a').attr('href')))+':nname='+teams[parseInt(UrlValue('j',$(this).find('a').attr('href')))])
				$(this).find('a').attr('style','border-bottom:1px solid blue').end()
					.attr('bgcolor','D3D7CF')
					.parent().removeAttr('class').attr('bgcolor','white')
			}
		})
	})
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}
function debug(text) {if(deb) {debnum++;$('td.back4').append(debnum+'&nbsp;\''+text+'\'<br>');}}