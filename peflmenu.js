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

function CheckNewMail(){
	var maillast = parseInt(localStorage.maillast)
	if(!isNaN(maillast) && (localStorage.scripts==undefined || (localStorage.scripts!=null && localStorage.scripts.split(':')[16]==0))){
		var mailcur = parseInt($('td.topmenu b:last').html())
		if(mailcur>maillast) $('td.topmenu b:last').append('<sup>+'+(mailcur-maillast)+'</sup>')
	}
}

function SetNumShcoolers(){
	var pls = $('td.back4 table table:eq(0) tr').length + $('td.back4 table table:eq(1) tr').length
	$('td.back4 table table:eq(1) tr').each(function(){
		pls += '.'+$(this).find('td:eq(2)').text() + ':' + $(this).find('td:eq(0)').text()
	})
	$('td.back4 table table:eq(0) tr').each(function(){
		pls += '.'+$(this).find('td:eq(2)').text()
	})
	localStorage.schoolnum = pls

	// fix colors
	$('td.back4 table table tr').removeAttr('bgcolor')
	$('td.back4 table table tr:odd').addClass('back3')
	
}
function SetNation(){
	var id = parseInt(UrlValue('j',$('td.back4 a:contains(Команда)').attr('href')))
	if(isNaN(id)) delete localStorage.myintid
	else localStorage.myintid = (id>1000 ? id-1000 : id)
}

$().ready(function() {
//	delete localStorage.debug

	if (UrlValue("p")=="nation" && !UrlValue("t")) SetNation()

	var scflag = '0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:1:0:0:0'.split(':')
	if(localStorage.scripts!=undefined && localStorage.scripts!=null) scflags = localStorage.scripts.split(':')
    var teamimg 	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myteamid)) ? '/system/img/g/team.gif' : '/system/img/club/'+localStorage.myteamid+'.gif')+'>'
    var teamimg2	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myteamid)) ? '/system/img/g/team.gif' : '/system/img/forms/'+(localStorage.myteampic!=undefined && localStorage.myteampic!=null ? localStorage.myteampic : localStorage.myteamid+'a')+'.png')+'>'
    var intimg  	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myintid)) ? '/system/img/g/int.gif' : 'system/img/flags/mod/'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'.gif')+'>'
    var intimg2  	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myintid)) ? '/system/img/g/int.gif' : 'system/img/forms/n'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'a.png')+'>'
	var crabimg 	= '<img width=16 height=16 src=\'http://pefladdons.googlecode.com/svn/trunk/img/crab1.png\'>'
	var sostavimg 	= '<img width=16 height=16 src="system/img/g/sostav.gif">'
	var settingimg 	= '<img width=16 height=16 src="system/img/g/stats.gif"></img>'
	var adaptimg 	= '<img width=16 height=16 src="system/img/g/scout.gif"></img>'
	var crab = new String()
	crab += '<div align=center><b>CrabVIP</b></div>'
	crab += settingimg+	' <a href=\'/?settings\'>Настройки</a><br>'
	if(parseInt(scflag[1])!=1)	crab += teamimg +	' <a href=\'/?sostav\'>Состав+(ком)</a><br>'
	if(parseInt(scflag[9])!=1)	crab += teamimg2+	' <a href=\'/?team\'>На&nbsp;форум(ком)</a><br>'
	if(parseInt(scflag[1])!=1 && !isNaN(parseInt(localStorage.myintid))) crab += intimg	+	' <a href=\'/?sostav_n\'>Состав+(сбр)</a><br>'
	if(parseInt(scflag[9])!=1 && !isNaN(parseInt(localStorage.myintid))) crab += intimg2	+	' <a href=\'/?team_n\'>На&nbsp;форум(сбр)</a><br>'
	if(parseInt(scflag[22])!=1)	crab += adaptimg+	' <a href=\'/?adaptation\'>Адаптация</a><br>'
	crab += crabimg +	' <a href="/forums.php?m=posts&q=173605">Crab&nbsp;Форум</a><br>'
	crab += '<hr>'
	$('td.back3 table td:first span.text1 hr:eq(4)').after(crab)

	CheckNewMail()
	if (UrlValue("t")=="school") SetNumShcoolers()

});
