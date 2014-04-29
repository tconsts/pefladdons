// ==UserScript==
// @name           peflmenu
// @namespace      pefl
// @description    add menu
// @include        http://*pefl.*/*
// @exclude        http://*pefl.*/profile.php
// @exclude        http://*pefl.*/auth.php
// @exclude        http://*pefl.*/hist.php*
// ==/UserScript==

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if(pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}

function getIDnum(){
	var gday = String(localStorage.gday)
	var datestr = (gday=='undefined' ? 0 : parseInt(gday.split('.')[0]))
	var idcur 	= (gday=='undefined' ? 0 : parseInt(gday.split('.')[1]))
	var datecur =  new Date()
	var datecur3 = new Date(datecur.valueOf() + (datecur.getTimezoneOffset() + 4*60)*60*1000)	//-420(7h) hours, Moscow +4
	var m = datecur3.getMonth()+1
	var d = datecur3.getDate()
	var datecur4 = new Date((m<10?0:'')+m+'/'+(d<10?0:'')+d+'/'+datecur3.getFullYear())
	var datecur5 = datecur4.valueOf()
	var getID = (datecur5>datestr ? true : false)
	if(getID){
		$('td.back4').prepend('<div style="display: none;" id=debugid></div>') //
		$('#debugid').load('plug.php?p=fri&t=r&tur=0&z=d48354e9dfc841580edc9a181fd0cb18 td.back4 a:last',function(){
			idcur = parseInt($('#debugid').text())
			if(!isNaN(idcur)){
				localStorage.gday = datecur5+'.'+idcur
				$('td.topmenu:first table td:last').append('&nbsp;('+(idcur+1)+'й ИД)')
			}
			$('div#debugid').remove()
		})
	}else{
		if(!isNaN(idcur)) $('td.topmenu:first table td:last').append('&nbsp;('+(idcur+1)+'й ИД)')
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
	//$('td.back4 table table tr').removeAttr('bgcolor')
	//$('td.back4 table table tr:odd').addClass('back3')
	
}
function SetNation(){
	var id = parseInt(UrlValue('j',$('td.back4 a:contains(Команда)').attr('href')))
	if(isNaN(id)) delete localStorage.myintid
	else localStorage.myintid = (id>1000 ? id-1000 : id)
}

function FixSize() {
	if($('table:eq(0)').attr('width')>=1000) {
		$('td.back3:eq(0)').attr('width','160')
	}
}

function setLogo(){
	if(String(localStorage.logopic)!='undefined') $('img:first').attr('height','88').attr('src',localStorage.logopic)
}

function SetCFF(){
	var tables = [];
	$('td.back4 table table').each(function(i,val){
		if($(val).attr('id')==undefined || $(val).attr('id')=='') $(val).attr('id','x'+i);
		tables.push($(val).attr('id'));
	})
	var text = '</script><script type="text/javascript" src="js/fcode2.js"></script>';
	text+='<div align=right><a href="javascript:void(ShowCode([],\''+tables.join(',')+'\',\'forumcode\'))">код для форума</a></div>';
	$('td.back4 table table:first').before(text);
}

if(typeof(jQuery)!='undefined'){ $().ready(function() {
//	delete localStorage.debug

	if($('td.topmenu:first table td:eq(1) a:contains("Вход")').length>0) return false
	setLogo()
	getIDnum()
	FixSize()

	if (UrlValue("p")=="nation" && !UrlValue("t")) SetNation()

	var scflag = '0:0:0:0:0:0:1:0:0:1:1:1:0:0:0:0:1:0:0:0:1:0:0:1:1'.split(':')
	if(localStorage.scripts!=undefined && localStorage.scripts!=null) scflag = localStorage.scripts.split(':')
	if(scflag[1]==2){
		scflag[1] = 0
		localStorage.scripts = scflag.join(':')
	}

    var teamimg 	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myteamid)) ? '/system/img/g/team.gif' : '/system/img/club/'+localStorage.myteamid+'.gif')+'>'
    var intimg  	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myintid)) ? '/system/img/g/int.gif' : 'system/img/flags/mod/'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'.gif')+'>'
	var crabimg 	= '<img width=16 height=16 src=\'http://pefladdons.googlecode.com/svn/trunk/img/crab1.png\'>'
	var sostavimg 	= '<img width=16 height=16 src="system/img/g/sostav.gif">'
	var settingimg 	= '<img width=16 height=16 src="system/img/g/stats.gif"></img>'
	var adaptimg 	= '<img width=16 height=16 src="system/img/g/scout.gif"></img>'
	var crab = new String()
	crab += '<hr><div align=center><b>CrabVIP</b></div>'
	crab += settingimg+	' <a href=\'/?settings\'>Настройки</a><br>'
	if(parseInt(scflag[1])!=1)	crab += teamimg +	' <a id=sostav href=\'/?sostav\'>Состав+(ком)</a><br>'
	if(parseInt(scflag[1])!=1 && !isNaN(parseInt(localStorage.myintid))) crab += intimg	+	' <a id=sostav_n href=\'/?sostav_n\'>Состав+(сбр)</a><br>'
	if(parseInt(scflag[22])!=1)	crab += adaptimg+	' <a href=\'/?adaptation\'>Адаптация</a><br>'
	crab += crabimg +	' <a href="/forums.php?m=posts&q=203048">Crab&nbsp;Форум</a>'
	$('td.back3 table td:first a:contains(Ссылки):first').after(crab)

	if (UrlValue("t")=="school"){
		SetNumShcoolers();
		SetCFF();
	}
	if(
	 (UrlValue('p')=='tr' && 
		(	UrlValue('t')=='transfers' 
		||	UrlValue('t')=='transfers0'
		||	UrlValue('t')=='transfersr' 
		||	UrlValue('t')=='transfersn' 
		||	UrlValue('t')=='transfers3' 
		||	UrlValue('t')=='transfers4'
		||	UrlValue('t')=='tlist'
		||	UrlValue('t')=='alist'
		||	UrlValue('t')=='nlist'
		||	UrlValue('t')=='free'
		||	UrlValue('t')=='staff'
		)
	 )||(UrlValue('p')=='search' && UrlValue('t')=='res')
	) SetCFF();

})};
