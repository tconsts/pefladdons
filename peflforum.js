// ==UserScript==
// @name           peflforum
// @namespace      pefl
// @description    remove not needed info from forum
// @include        http://*pefl.*/forums.php?m=posts*
// @version        1.0
// ==/UserScript==

$().ready(function() {
	$('td.back4 tr:gt(2) td[width=128]').each(function(){
		var txt = $(this).html().split('<br>')
		$(this).html(txt[0]+'<br>'+txt[1]+'<br>'+txt[5].replace('Сообщений',''))
	})
	$('span.text1xs').remove()
}, false);