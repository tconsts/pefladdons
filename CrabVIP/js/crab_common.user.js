// ==UserScript==
// @name           peflmenu
// @namespace      pefl
// @description    add menu
// @include        http://*pefl.*/*
// @exclude        http://*pefl.*/profile.php
// @exclude        http://*pefl.*/auth.php
// @exclude        http://*pefl.*/hist.php*
// @exclude        http://*pefl.*/loadplayer.php*
// @encoding	   windows-1251
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
		var realday = parseInt($('td.topmenu table td:contains(" ��")').text().split('(')[1],10);
		if(isNaN(realday)) return false;
		localStorage.gday = datecur5+'.'+realday
	}else{
		//if(!isNaN(idcur)) $('td.topmenu:first table td:last').append('&nbsp;('+(idcur+1)+'� ��)')
	}
}

function SetNation(){
	var id = parseInt(UrlValue('j',$('td.back4 a:contains(�������)').attr('href')))
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
	text+='<div align=right><a href="javascript:void(ShowCode([],\''+tables.join(',')+'\',\'forumcode\'))">code for forum</a></div>';
	$('td.back4 table table:first').before(text);
}

if(typeof(jQuery)!='undefined'){ 
$().ready(function() {
	console.log('run the crab_common...');
	const submenues = $('.submenu2');
	

	if (submenues.length > 0) {
		console.log("submenu2 ", submenues.length);
		const HMREF = 'http://kes-pefl.appspot.com/heatmaps.html?';
		submenues.each(function(i, val){
			if ($(val).find('li').length > 2 ) return; // ���� ���� ������� � ������.
			const tvRef = $(val).find('a:nth-child(1)').attr('href')
			.replace('&gm=k','')
			.replace('http://pefl.ru/tv/#/', HMREF)
			.replace('tv/#/',HMREF);

			const heatmapsRef = $('<li>');
			// const heatmapsRef = $("<li>", {
			// 	append: $('<a>', {
			// 				text : "����������",
			// 				target:"_blank",
			// 				href: tvRef
			// 			})
			// })
			// ;
			const hmAnchor = $('<a>');
			hmAnchor.attr("href", tvRef);
			hmAnchor.attr("text", "����������");
			hmAnchor.attr("target", "_blank");
			heatmapsRef.append(hmAnchor);
			$(val).append(heatmapsRef);
		})
	}

	if (UrlValue("p") && UrlValue("p").indexOf("squad") == 0) {
		if(clubs!=undefined) for(i=0;i<3;i++) if(clubs[i]!=undefined) localStorage['sostavurl'+clubs[i].id] = jsonsostav+'?'+clubs[i].gurl;
	}

	if($('td.topmenu:first table td:eq(1) a:contains("����")').length>0) return false
	setLogo()
	getIDnum()
	//FixSize()

	if (UrlValue("p")=="nation" && !UrlValue("t")) SetNation()

	var scflag = '0:0:0:0:0:0:1:0:0:1:1:1:0:0:0:0:1:0:0:0:1:0:0:1:1'.split(':')
	if(localStorage.scripts!=undefined && localStorage.scripts!=null) scflag = localStorage.scripts.split(':')
	if(scflag[1]==2){
		scflag[1] = 0
		localStorage.scripts = scflag.join(':')
	}

    var teamimg 	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myteamid)) ? '/system/img/g/team.gif' : '/system/img/club/'+localStorage.myteamid+'.gif')+'>';
    var intimg  	= '<img width=16 height=16 src='+(isNaN(parseInt(localStorage.myintid)) ? '/system/img/g/int.gif' : 'system/img/flags/mod/'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'.gif')+'>';
	var crabimg 	= crabImageUrl == undefined ? '' : '<img width=16 height=16 src=\''+crabImageUrl+'\'>';
	var sostavimg 	= '<img width=16 height=16 src="system/img/g/sostav.gif">';
	var settingimg 	= '<img width=16 height=16 src="system/img/g/stats.gif"></img>';
	var adaptimg 	= '<img width=16 height=16 src="system/img/g/scout.gif"></img>';
	var crab = new String()
	crab += '<hr><div align=center><b>CrabVIP</b></div>';
	crab += settingimg+	' <a href=\'/?settings\'>���������</a><br>';
	if(parseInt(scflag[1])!=1)	crab += teamimg +	' <a id=sostav href=\'/?sostav\'>������+(���)</a><br>';
	if(parseInt(scflag[1])!=1 && !isNaN(parseInt(localStorage.myintid))) crab += intimg	+	' <a id=sostav_n href=\'/?sostav_n\'>������+(int)</a><br>';
	if(parseInt(scflag[22])!=1)	crab += adaptimg+	' <a href=\'/?adaptation\'>���������</a><br>';
	crab += crabimg +	' <a href="/forums.php?m=posts&q=244387">Crab&nbsp;�����</a><br>';
	crab += ' <img src="system/img/g/stats.gif" width="16" height="16">' +	' <a href="/ban.txt">ban.txt</a>';
	$('td.back3 table td:first a:contains(������):first').after(crab);

/**
	if(UrlValue("t")=="school"){
		SetNumShcoolers();
		SetCFF();
	}
**/
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
	  ||(UrlValue('p')=='refl' && UrlValue('t')=='khist')
	) SetCFF();
})
};
