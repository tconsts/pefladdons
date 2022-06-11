// ==UserScript==
// @name           peflschool
// @namespace      pefl
// @description    modification school page
// @include        http://*pefl.*/plug.php?p=refl&t=school&k=*
// @encoding	   windows-1251
// ==/UserScript==

function fixImages(){
	$('td.back4 table table img').each(function() {
		let src = $(this).attr('src');
		if(src.indexOf('/mod/')<0) $(this).attr('src',src.replace('/flags/','/flags/mod/'));
	});
}

$().ready(function() {
	let players = [];

	fixImages();

	$('td.back4 table table:eq(1) tr:has(img),td.back4 table table:eq(0) tr:has(img)').each(function() {
		let pl = {};
		pl.name = $(this).find('td:eq(0)').text();
		pl.url = $(this).find('td:eq(0) a').attr('href');
		pl.id = UrlValue('j',pl.url);
		pl.type = UrlValue('t',pl.url);
		pl.nat = parseInt($(this).find('td:eq(1) img').attr('src').split('flags/mod/')[1], 10);
		pl.age = parseInt($(this).find('td:eq(2)').text(), 10);
		pl.position = $(this).find('td:eq(3)').text();
		if (pl.name.indexOf('игрок') >-1 ) pl.name = pl.name + ' ('+pl.position+')';

		players.push(pl);
	});
	localStorage.schoolers = JSON.stringify(players);
	delete localStorage.schoolnum;
});