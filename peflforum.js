// ==UserScript==
// @name           peflforum
// @namespace      pefl
// @description    remove not needed info from forum
// @include        http://*pefl.*/forums.php?m=posts*
// @version        1.0
// ==/UserScript==

$().ready(function() {

	var forumflags = '0:0:0:0:0:0:0:0:0:0:0:0:0:0'.split(':')
	if(localStorage.forum!=undefined && localStorage.forum!=null) forumflags = localStorage.forum.split(':')

	var txt = ''
	$('td.back4 table tr:gt(2) td[width=128]').each(function(){

		// span.text2b a(имя) img(человечек) img($, может не быть)
		if(forumflags[1]==1) $(this).find('span.text2b img').remove()

		// a(клуб)
		if(forumflags[2]==1) $(this).find('a[href^="plug.php?p=refl&t=k&j="]').remove()

		// span.text1s a(Пользователь) br
		if(forumflags[3]==1) $(this).find('span.text1s:has(a:contains(Пользователь))').remove()

		// img(грузовички)
		if(forumflags[4]==1) {
			$(this).find('span.text1s ~ img:first').remove()
		}

		// сообщений кл-во
//		if(forumflags[5]==1)

		// репутация a(-1) a(0) a(+1)
//		if(forumflags[6]==1)

		// репа[] 
//		if(forumflags[7]==1)

		//img(репа)
		if(forumflags[8]==1){
			$(this).find('img[src*=system/smilies/]')
				.next('br').remove().end()
				.remove()
		}

		// " "
		// img(аватарка, может не быть)
		if(forumflags[9]==1) {
			$(this).find('img[src*=datas/users/]')
				.prev('br').remove().end()
				.next('br').remove().end()
				.remove()
		}

		// " "
		// span.text1xs "откуда" img(flag) <br> профессия <hr> img a(сборная) <hr> регалии
		if(forumflags[10]==1) $(this).find('span.text1xs').remove()


	});

	//подпись
	if(forumflags[11]==1) $('td.back4 table td.back3 span.text1xs').remove()


	// from заголовок
	if(forumflags[12]==1) $('td.back4 table tr:gt(2) td.back2:contains(From:)').each(function(){$(this).html($(this).html().replace('GMT','').split('<br>')[0])});

	// пожаловаться модератору
	if(forumflags[13]==1) $('td.back4 table tr:gt(2) td.back2:contains(Пожаловаться модераторам)').each(function(){$(this).html($(this).html().split('<br>')[0])});


}, false);
