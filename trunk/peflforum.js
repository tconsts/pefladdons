// ==UserScript==
// @name           peflforum
// @namespace      pefl
// @description    remove not needed info from forum
// @include        http://*pefl.*/forums.php?m=posts*
// @version        1.0
// ==/UserScript==

$().ready(function() {

	var forumflags = '0:0:1:0:0:0'.split(':')
	if(localStorage.forum!=undefined && localStorage.forum!=null) forumflags = localStorage.forum.split(':')

	var txt = ''
	$('td.back4 tr:gt(2) td[width=128]').each(function(){

		// span.text2b a(имя) img(человечек) img($, может не быть)
		if(forumflags[0]==1) $(this).find('span.text2b img').remove()

		// a(клуб)
		if(forumflags[1]==1) $(this).find('a[href^="plug.php?p=refl&t=k&j="]').remove()

		// span.text1s a(Пользователь) br
		if(forumflags[2]==1) $(this).find('span.text1s:has(a:contains(Пользователь))').remove()

		// img(грузовички)
//		if(forumflags[1]==1) //$(this).find()

		// сообщений кл-во

		// репутация a(-1) a(0) a(+1)
		// репа[] img
		// " "
		// img(аватарка, может не быть)
		// " "
		// span.text1xs "откуда" img(flag) <br> профессия <hr> img a(сборная) <hr> регалии
	});

}, false);
