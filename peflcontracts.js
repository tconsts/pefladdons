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
	if(UrlValue('p')=='tr'){
		if(UrlValue('t')=='nc' || UrlValue('t')=='ctrf'){
		/**
			$('td.back4').append('form:<br>')
				$("form").submit(function() {
				$('td.back4').append($("input:eq(0)").val()+'<br>')
				$('td.back4').append($("select:first").val()+'<br>')
				return false;
	    	});
		/**/
		}else if(UrlValue('t')=='transfers4') {
			GetTeams(parseInt(localStorage.mycountry),localStorage.mycountry.split('.')[1])
		}
	} else if(UrlValue('p')=='fin'){
		var szp=0
		$('td.back4 td').each(function(i,val){
			if ($(val).html().indexOf('$') != -1 && !isNaN(+$(val).html().replace('$',''))){
				szp += +$(val).html().replace('$','')
			}
		});

		var addtext = '(за каждого школьника еще по +100$)'
		var schnum = parseInt(localStorage.schoolnum)
		if(!isNaN(schnum) && !UrlValue("j")){
			addtext = '(с учетом школьников: '+schnum+(schnum>0 ? ' по 100$' : '')+')'
			szp += schnum*100
		}

		var txt='<br>Сумма зарплат:';
		var newtxt = '<hr><table width=100%><tr><td width=5%></td><td width=30%></td><td width=10% ALIGN=right  bgcolor=#a3de8f><b>'+String((szp/1000).toFixed(3)).replace('.',',')+'$</b></td><td colspan=2><i>'+addtext+'</i></td></tr></table>'+txt;

		$('td.back4').each(function(){
			if ($(this).html().indexOf(txt) != -1){
				var newbody = $(this).html().replace(txt,newtxt);
				$(this).html(newbody);
			}
		});
	}
});

function GetTeams(nid,nname){
		if(ff){
			debug('GetTeams as FF')
			var list = {'teams':'tid,my,did,num,tdate,tplace,ncode,nname,tname,mname,ttask,tvalue,twage,tss,age,pnum,tfin,screit,scbud,ttown,sname,ssize,mid'}
			var head = list['teams'].split(',')
			var text1 = String(globalStorage[location.hostname]['teams'])
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
					teams[parseInt(curt['tid'])] = parseInt(curt['ncode'])
				}
			}
		}else{
			if(!db) DBConnect()
			db.transaction(function(tx) {
				tx.executeSql("SELECT tid,ncode FROM teams",[],
					function(tx, result){
						for(var i = 0; i < result.rows.length; i++) {
							var row = result.rows.item(i)
							teams[parseInt(row['tid'])] = parseInt(row['ncode'])
						}
						MarkMyCountry(nid,nname)
					},
					function(tx, error) {debug(error.message)}
				);                                           
			})		
		}

	
}

function MarkMyCountry(nid,nname){
	debug('MarkMyCountry')
	$('span.text2b').html('Помечены команды из '+nname)
	$('td.back4 table table tr:gt(0)').each(function(){
		$(this).find('td:eq(3), td:eq(4)').each(function(i,val){
			if(nid==teams[parseInt(UrlValue('j',$(val).find('a').attr('href')))]) $(this).attr('bgcolor','yellow').parent().attr('bgcolor','white')
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