// ==UserScript==
// @name           peflschool
// @namespace      pefl
// @description    modification school page
// @include        http://*pefl.*/plug.php?p=refl&t=school&k=*
// @encoding	   windows-1251
// ==/UserScript==


function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) { if (pf[n].split('=')[0] == key) return pf[n].split('=')[1]; }
	return false
}

function SetCFF(){
	var tables = [];
	$('td.back4 table table').each(function(i,val){
		if($(val).attr('id')==undefined || $(val).attr('id')=='') $(val).attr('id','x'+i);
		tables.push($(val).attr('id'));
	})
	var text = '</script><script type="text/javascript" src="js/fcode4.js"></script>';
	text+='<div align=right><a href="javascript:void(ShowCode([],\''+tables.join(',')+'\',\'forumcode\'))">код для форума</a></div>';
	$('td.back4 table table:first').before(text);
}
function fixImages(){
	$('td.back4 table table img').each(function(){
		var src = $(this).attr('src');
		if(src.indexOf('/mod/')<0) $(this).attr('src',src.replace('/flags/','/flags/mod/'));
	});
}

$().ready(function() {
	console.log('run crab_school...');
	players = [];

	fixImages();

	$('td.back4 table table:eq(1) tr:has(img),td.back4 table table:eq(0) tr:has(img)').each(function(){
		var pl = {};
		pl.name = $(this).find('td:eq(0)').text();
		pl.url = $(this).find('td:eq(0) a').attr('href');
		pl.id = UrlValue('j',pl.url);
		pl.type = UrlValue('t',pl.url);
		pl.nat = parseInt($(this).find('td:eq(1) img').attr('src').split('flags/mod/')[1], 10);
		pl.age = parseInt($(this).find('td:eq(2)').text(), 10);
		pl.position = $(this).find('td:eq(3)').text();
		if (pl.name.indexOf('игрок')>-1) pl.name = pl.name + ' ('+pl.position+')';

		players.push(pl);
	});
	localStorage.schoolers = JSON.stringify(players);
	delete localStorage.schoolnum;
	SetCFF();

/*
	var pls = $('td.back4 table table:eq(0) tr').length + $('td.back4 table table:eq(1) tr:has(img)').length

	$('td.back4 table table:eq(1) tr:has(img)').each(function(){
		pls += '.'+$(this).find('td:eq(2)').text() + ':' + $(this).find('td:eq(0)').text();
	})
	$('td.back4 table table:eq(0) tr').each(function(){
		pls += '.'+$(this).find('td:eq(2)').text();
	})
	localStorage.schoolnum = pls
*/
});