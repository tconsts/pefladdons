// ==UserScript==
// @name           peflforum
// @namespace      pefl
// @description    remove not needed info from forum
// @include        http://www.pefl.ru/forums.php?m=posts*
// @include        http://pefl.ru/forums.php?m=posts*
// @include        http://www.pefl.net/forums.php?m=posts*
// @include        http://pefl.net/forums.php?m=posts*
// @include        http://www.pefl.org/forums.php?m=posts*
// @include        http://pefl.org/forums.php?m=posts*
// ==/UserScript==

$().ready(function() {
	$('td.back4 tr:gt(2) td[width=128]').each(function(){
		var txt = $(this).html().split('<br>')
		$(this).html(txt[0]+'<br>'+txt[1]+'<br>'+txt[5].replace('Сообщений',''))
	})
	$('span.text1xs').remove()
}, false);