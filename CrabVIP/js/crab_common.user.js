// ==UserScript==
// @name           peflmenu
// @namespace      pefl
// @description    add menu
// @include        https://*pefl.*/*
// @exclude        https://*pefl.*/profile.php
// @exclude        https://*pefl.*/auth.php
// @exclude        https://*pefl.*/hist.php*
// @exclude        https://*pefl.*/loadplayer.php*
// @require			crab_funcs_std.js
// @encoding	   windows-1251
// ==/UserScript==

function getIDnum(){
	let gday = String(localStorage.gday),
	datestr = (gday=='undefined' ? 0 : parseInt(gday.split('.')[0])),	
	datecur =  new Date(),
	datecur3 = new Date(datecur.valueOf() + (datecur.getTimezoneOffset() + 4*60)*60*1000),	//-420(7h) hours, Moscow +4
	m = datecur3.getMonth()+1,
	d = datecur3.getDate(),
	datecur4 = new Date((m<10?0:'')+m+'/'+(d<10?0:'')+d+'/'+datecur3.getFullYear()),
	datecur5 = datecur4.valueOf(),
	getID = (datecur5>datestr ? true : false);	
	if (getID) {
		realday = parseInt($('td.topmenu table td:contains(" ИД")').text().split('(')[1],10);
		if(isNaN(realday)) return false;
		localStorage.gday = datecur5+'.'+realday
	}
}

function SetNation(){
	let id = parseInt(Url.value('j',$('td.back4 a:contains(Команда)')[0]))
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
	debug('insert Code for Forum');
	var tables = [];
	$('td.back4 table table').each(function(i,val){
		if($(val).attr('id')==undefined || $(val).attr('id')=='') $(val).attr('id','x'+i);
		tables.push($(val).attr('id'));
	})
	var text = '</script><script type="text/javascript" src="js/fcode5.js"></script>';
	text+='<div align=right><a href="javascript:void(ShowCode([],\''+tables.join(',')+'\',\'forumcode\'))">код для форума</a></div>';
	$('td.back4 table table:first').before(text);
}

if(typeof(jQuery)!='undefined'){ 
$().ready(function() {
	let t = UrlValue('t'), p = UrlValue('p');

	if (p && p.indexOf("squad") == 0) {
		if(clubs!=undefined) for(i=0;i<3;i++) if(clubs[i]!=undefined) localStorage['sostavurl'+clubs[i].id] = jsonsostav+'?'+clubs[i].gurl;
	}

	if($('td.topmenu:first table td:eq(1) a:contains("Вход")').length>0) return false
	setLogo()
	getIDnum()
	//FixSize()

	if (p == "nation" && !t) SetNation()

	let scflag = '0:0:0:0:0:0:1:0:0:1:1:1:0:0:0:0:1:0:0:0:1:0:0:1:1'.split(':')
	if(localStorage.scripts!=undefined && localStorage.scripts!=null) scflag = localStorage.scripts.split(':')
	if(scflag[1]==2){
		scflag[1] = 0
		localStorage.scripts = scflag.join(':')
	}

    let teamimg = '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myteamid)) ? '/system/img/g/team.gif' : '/system/img/club/'+localStorage.myteamid+'.gif')+'>',
    intimg  	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myintid)) ? '/system/img/g/int.gif' : 'system/img/flags/mod/'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'.gif')+'>',
	crabimg 	= crabImageUrl == undefined ? '' : '<img width=16 height=16 src=\''+crabImageUrl+'\'>',
	settingimg 	= '<img width=16 height=16 src="system/img/g/stats.gif"></img>',
	adaptimg 	= '<img width=16 height=16 src="system/img/g/scout.gif"></img>',
	crab = '<hr><div align=center><b>CrabVIP</b></div>'
		+ settingimg + ' <a href=\'/?settings\'>Настройки</a><br>';
	if(parseInt(scflag[1])!=1)	crab += teamimg +	' <a id=sostav href=\'/?sostav\'>Состав+(ком)</a><br>';
	if(parseInt(scflag[1])!=1 && !isNaN(parseInt(localStorage.myintid))) crab += intimg	+	' <a id=sostav_n href=\'/?sostav_n\'>Состав+(int)</a><br>';
	if(parseInt(scflag[22])!=1)	crab += adaptimg+	' <a href=\'/?adaptation\'>Адаптация</a><br>';
	crab += crabimg +	' <a href="/forums.php?m=posts&q=244387">Crab&nbsp;форум</a><br>';
	crab += ' <img src="system/img/g/stats.gif" width="16" height="16">' +	' <a href="/ban.txt">ban.txt</a>';
	
	if ( $('td.back3 table td:first a:contains(Ссылки):first').length > 0 ) {
		$('td.back3 table td:first a:contains(Ссылки):first').after(crab);
	} else {
		$('td.back3 table td:first a:contains(Статьи):first').after(crab);
	}

	if(
	 (p == 'tr' && 
		(	t == 'transfers' 
		||	t == 'transfers0'
		||	t == 'transfersr' 
		||	t == 'transfersn' 
		||	t == 'transfers3' 
		||	t == 'transfers4'
		||	t == 'tlist'
		||	t == 'alist'
		||	t == 'nlist'
		||	t == 'free'
		||	t == 'staff'
		)
	 )||(p == 'refl' &&
	  	(	t == 'khist'
		||	t == 'ref'
		||	t == 'school'
		)
	  )||(p == 'search' && t == 'res')
	) SetCFF();
})
};