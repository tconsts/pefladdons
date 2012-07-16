// ==UserScript==
// @name			peflindex
// @namespace		pefl
// @description		index.php
// @include			http://*pefl.*/index.php
// @include			http://*pefl.*/
// @version		    1.0
// ==/UserScript==

$().ready(function(){

	if($('table:eq(0)').attr('width')>=1000) {
		$('td.back4 table:eq(0) tr:eq(0) > td:eq(1)').attr('width','250')
	}

	var text = ''
	text = $('table.back3').html()
		.replace(/\<br\>\&nbsp\;\<br\>/g,'<br>')
		.replace(/\<br\>\&nbsp\;\<br\>/g,'<br>')
		.replace(/\<br\>\<br\>/g,'<br>')
		.replace(/\<br\>\<hr\>/g,'')
		.replace(/\<hr\>/g,'')
	$('table.back3').html(text)

	// last forum messages
	text = '<table width=100% class=back1 cellpadding=3 cellspacing=2><tr><td>' // bgcolor=C9F8B7
		 + $('table.back3 li:eq(0)').html()
			.replace(/[0-9][0-9]\-[0-9][0-9] ([0-9][0-9]:[0-9][0-9])/g,'</td></tr><tr class=back2><td>$1') //bgcolor=A3DE8F
		 + '</td></tr></table>'
	$('table.back3 li:eq(0)').html(text)

	// last press
	text = '<table width=100% class=back1 cellpadding=3 cellspacing=2><tr><td>'
		 + $('table.back3 li:eq(1)').html()
			.replace(/201[0-9]\-[0-9][0-9]\-[0-9][0-9] ([0-9][0-9]:[0-9][0-9]),/g,'</td></tr><tr class=back2><td>$1')
//			.replace(/,/g,'')
		 + '</td></tr></table>'
	$('table.back3 li:eq(1)').html(text)

	// last print
	text = '<table width=100% class=back1 cellpadding=3 cellspacing=2><tr><td>'
		 + $('table.back3 li:eq(2)').html()
			.replace('</b><br>','</b></td></tr><tr class=back2><td>')
			.replace(/(, 201[0-9]\-[0-9][0-9]\-[0-9][0-9]\))\<br\>/g,'$1</td></tr><tr class=back2><td>')
		 + '</td></tr></table>'
	$('table.back3 li:eq(2)').html(text)

	// last vote
	text = '<table width=100% class=back1 cellpadding=3 cellspacing=2><tr><td>'
		 + $('table.back3 li:eq(3)').html()
			.replace('</b>','</b></td></tr><tr class=back2><td>')
			.replace(/\<br\>/g,'</td></tr><tr class=back2><td>')
		 + '</td></tr></table>'
	$('table.back3 li:eq(3)').html(text)

	// last links
	text = '<table width=100% class=back1 cellpadding=3 cellspacing=2><tr><td>'
		 + $('table.back3 li:eq(4)').html()
			.replace('</b>','</b></td></tr><tr class=back2><td>')
			.replace(/\<br\>/g,'</td></tr><tr class=back2><td>')
		 + '</td></tr></table>'
	$('table.back3 li:eq(4)').html(text)

	//common
	text = $('table.back3').html()
		.replace(/\<li\>/g,'')
		.replace(/\<\/li\>/g,'')
	$('table.back3').html(text)

}, false);