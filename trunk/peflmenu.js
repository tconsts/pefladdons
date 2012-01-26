// ==UserScript==
// @name           peflmenu
// @namespace      pefl
// @description    add menu
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

	// Show new mail
	var maillast = parseInt(localStorage.maillast)
	if(!isNaN(maillast) && !isNaN(localStorage.scripts) && localStorage.scripts.split(':')[16]==0){
		var mailcur = parseInt($('td.topmenu b:last').html())
		if(mailcur>maillast) $('td.topmenu b:last').append('<sup>+'+(mailcur-maillast)+'</sup>')
	}

    var teamimg 	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myteamid)) ? '/system/img/g/team.gif' : '/system/img/club/'+localStorage.myteamid+'.gif')+'>'
    var teamimg2	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myteamid)) ? '/system/img/g/team.gif' : '/system/img/forms/'+(localStorage.myteampic!=undefined && localStorage.myteampic!=null ? localStorage.myteampic : localStorage.myteamid+'a')+'.png')+'>'
    var intimg  	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myintid)) ? '/system/img/g/int.gif' : 'system/img/forms/n'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'a.png')+'>'
	var crabimg 	= '<img width=16 height=16 src=\'http://pefladdons.googlecode.com/svn/trunk/img/crab1.png\'>'
	var sostavimg 	= '<img width=16 height=16 src="system/img/g/sostav.gif">'
	var settingimg 	= '<img width=16 height=16 src="system/img/g/stats.gif"></img>'
	var crab = new String()
	crab += '<div align=center><b>CrabVIP</b></div>'
	crab += settingimg+	' <a href=\'/?settings\'>Настройки</a><br>'
	crab += teamimg +	' <a href=\'/?sostav\'>Состав +</a><br>'
	crab += teamimg2+	' <a href=\'/?team\'>На форум(ком)</a><br>'
	crab += intimg +	' <a href=\'/?team_n\'>На форум(сбр)</a><br>'
	crab += crabimg +	' <a href="/forums.php?m=posts&q=173605">Crab Форум</a><br>'
	crab += '<hr>'
	$('td.back3 table td:first span.text1 hr:eq(4)').after(crab)

});
