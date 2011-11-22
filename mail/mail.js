// ==UserScript==
// @name			peflmail
// @namespace		pefl
// @description		mail page modification
// @include			http://*pefl.*/pm.php
// ==/UserScript==

var mails = []

$().ready(function() {
	$('td.back4:first td.back1:eq(1)').hide()
	$('td.back4:first td.back2:gt(0)').each(function(i,val){
		$(val).parent().hide()
//		$(val).attr('bgcolor','white')

		var curmail = {}

		curmail.id 		= parseInt($(val).find('a:first').attr('name'))
		curmail.summary	= $(val).find('b:first').text()

		curmail.sender 		= $(val).find('a:eq(1)').text()
		curmail.senderid 	= UrlValue('id',$(val).find('a:eq(1)').attr('href'))
//		curmail.receiver 	= $(val).find('a:eq(2)').text()
//		curmail.receiverid 	= UrlValue('id',$(val).find('a:eq(2)').attr('href'))
		var newmailarr = $(val).html().split('<br>')
		curmail.date 		= newmailarr[1].split('- Дата: ')[1].replace(' ','&nbsp;')
		newmailarr.shift()
		newmailarr.shift()
		newmailarr.pop()
		curmail.body 		=  newmailarr.join('<br>')

//		var mails[curmail.id] = {}
		mails[curmail.id] = curmail
	})
	var html = '<table width=100% bgcolor=C9F8B7><tr><th>N</th><th>Дата</th><th>Отправитель</th><th>Суммари</th><th>управление</th></tr>'
	for (i in mails) {
		var mli = mails[i]
		html += '<tr bgcolor=A3DE8F>'
		html += '<td><br><a href="javascript:void(OpenMail('+mli.id+'))" id=a'+mli.id+' class="off">>>></a></td>'
		html += '<td>'+mli.date+'</td>'
		html += '<td><a href="users.php?m=details&id='+mli.senderid+'">'+mli.sender+'</a></td>'
		html += '<th align=left>'+mli.summary+'</th>'
		html += '<td align=right>'
		html += '[<a href="pm.php?m=send&to='+mli.senderid+'&quote='+mli.id+'">Ответить</a>]&nbsp;'
		html += '[<a href="">В&nbsp;архив</a>]&nbsp;'
		html += '[<a href="">Удалить</a>]'
		html += '</td>'
		html += '</tr>'
		html += '<tr id='+mli.id+' style="display: none;">'
		html += '<td colspan=5>'+mli.body+'</td>'
		html += '</tr>'
	}
	html += '</table>'	
	$('td.back4:first').append(html)

}, false)

function OpenMail(mid){
	if($('a#a'+mid).attr('class')=='off'){
		$('tr#'+mid).show()	
		$('a#a'+mid).attr('class','on')
	}else{
		$('tr#'+mid).hide()
		$('a#a'+mid).attr('class','off')
	}

}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	return false
}
