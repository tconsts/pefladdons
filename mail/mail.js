// ==UserScript==
// @name			peflmail
// @namespace		pefl
// @description		mail page modification
// @include			http://*pefl.*/pm.php
// @include			http://*pefl.*/pm.php?filter=*
// @include			http://*pefl.*/pm.php?m=send*
// ==/UserScript==

$().ready(function() {
	if(UrlValue('m')=='send') {
		$('td.back4 table tr:eq(1) td:eq(0)').html('<b>Кому:</b>')
		$('td.back4 table tr td').removeAttr('width')
		$('textarea#tex').attr('rows','30').attr('cols','78')
	}else{
	var mailcur = parseInt($('td.back4:first td.back2:first').text().split(']')[0].split(':')[1])
	var maillast = parseInt(localStorage.maillast)
	if(isNaN(maillast)) maillast = mailcur
	if(!UrlValue('filter') && mailcur > maillast){
		mailnum = mailcur - maillast
		localStorage.maillast = mailcur
	} else if(!UrlValue('filter') && mailcur < maillast) {
		mailnum = 0
		localStorage.maillast = mailcur
	} else mailnum = 0

	var text = '<table id="mail" width=100% bgcolor=A3DE8F><tr><th width=18%>Дата</th><th width=5%>'
		text += (UrlValue('filter')=='sentbox' ? 'Кому' : 'От&nbsp;кого')
		text += '</th><th>Заголовок</th><th width=3%></th></tr></table>'
	$('td.back4:first td.back1:eq(1)').html(text)
	$('td.back4:first tr:has(td.back4)').hide()
	$('td.back4:first td.back2:gt(0)').each(function(i,val){
		$(val).parent().hide()
		var defhide = (i>=mailnum ? ' style="display: none;"': '')
		var curmail = {}

		curmail.id 			= parseInt($(val).find('a:first').attr('name'))
		curmail.summary		= $(val).find('b:first').text()
		curmail.sender 		= $(val).find('a:eq(1)').text()
		curmail.senderid 	= UrlValue('id',$(val).find('a:eq(1)').attr('href'))
		curmail.receiver 	= $(val).find('a:eq(2)').text()
		curmail.receiverid 	= UrlValue('id',$(val).find('a:eq(2)').attr('href'))
		var newmailarr 		= $(val).html().split('<br>')
		curmail.date 		= newmailarr[1].split('- Дата: ')[1].replace(' ','&nbsp;')
		newmailarr.shift()
		newmailarr.shift()
		newmailarr.pop()
		curmail.body 		=  newmailarr.join('<br>')

		var html = ''
		html += '<tr bgcolor=C9F8B7 height=25>'
		html += '<td>'+curmail.date + '</td>'
		html += '<td>'
		html += '<a href="users.php?m=details&id='+(UrlValue('filter')=='sentbox' ? curmail.receiverid : curmail.senderid)+'">'+(UrlValue('filter')=='sentbox' ? curmail.receiver : curmail.sender)+'</a>'
		html += '</td>'
		html += '<th align=left><a href="javascript:void(OpenMail('+curmail.id+'))" id=a'+curmail.id+' class="off">'+curmail.summary+'</a></th>'
		html += '<td align=center>'
		html += '<a href="pm.php?m=edit&a=delete&id='+curmail.id+'&filter='+(!UrlValue('filter') ? '' : UrlValue('filter'))+'">x</a>'
		html += '</td>'
		html += '</tr>'
		html += '<tr id='+curmail.id+defhide+'>'
		html += '<td colspan=4>'+curmail.body+'<br><br>'
		html += (UrlValue('filter')=='sentbox' ? '' : '[<a href="pm.php?m=edit&a='+(UrlValue('filter')=='archives' ? 'unarchive' : 'archive')+'&id='+curmail.id+'">'+(UrlValue('filter')=='archives' ? 'Вернуть во Входящие' : 'В архив')+'</a>] ')
		html += '[<a href="pm.php?m=edit&a=delete&id='+curmail.id+'&filter='+(!UrlValue('filter') ? '' : UrlValue('filter'))+'">Удалить</a>] '
		html += (UrlValue('filter')=='sentbox' ? '' : '[<a href="pm.php?m=send&to='+curmail.senderid+'&quote='+curmail.id+'">Ответить отправителю</a>]')
		html += '</td>'
		html += '</tr>'
		$('table#mail').append(html)
		$(val).parent().remove()
	})
	}
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
