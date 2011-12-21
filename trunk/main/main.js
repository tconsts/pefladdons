// ==UserScript==
// @name           pefllinksostav
// @namespace      pefl
// @description    add menu link to sostav
// @include        http://*pefl.*/*
// @exclude        http://*pefl.*/profile.php
// @exclude        http://*pefl.*/auth.php
// ==/UserScript==

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if(pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}

$().ready(function() {
    var teamimg = '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myteamid)) ? '/system/img/g/team.gif' : '/system/img/club/'+localStorage.myteamid+'.gif')+'>'
    var teamimg2 ='<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myteamid)) ? '/system/img/g/team.gif' : '/system/img/forms/'+localStorage.myteamid+'a.png')+'>'
    var intimg  = '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myintid)) ? '/system/img/g/int.gif' : 'system/img/forms/n'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'a.png')+'>'
	var crabimg = '<img width=16 height=16 src=\'http://pefladdons.googlecode.com/svn/trunk/crab1.png\'>'
	var sostavimg = '<img src="system/img/g/sostav.gif" width=16 height=16>'
	var crab = new String()
	crab += '<div align=center><b>CrabVIP:</b></div>'
	crab += crabimg +	' <a href="/forums.php?m=posts&q=173605">Форум</a><br>'
	crab += teamimg +	' <a href=\'/?sostav\'>Состав +</a><br>'
	crab += teamimg2+	' <a href=\'/?team\'>На форум(ком)</a><br>'
	crab += intimg +	' <a href=\'/?team_n\'>На форум(сбр)</a>'
	crab += '<hr>'
	$('td.back3 table td:first span.text1 hr:eq(2)').after(crab)

});
