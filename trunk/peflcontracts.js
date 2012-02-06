// ==UserScript==
// @name           peflcontracts
// @namespace      pefl
// @description    contracts modification
// @include        http://*pefl.*/plug.php?p=fin&t=ctr&*
// @version        1.0
// ==/UserScript==

$().ready(function() {
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
});

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}
