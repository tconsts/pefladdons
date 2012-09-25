// ==UserScript==
// @name			peflmail
// @namespace		pefl
// @description		mail page modification
// @include			http://*pefl.*/pm.php
// @include			http://*pefl.*/pm.php?filter=*
// @include			http://*pefl.*/pm.php?m=send*
// ==/UserScript==

var mails = []
var srtflag = 1
var srtcur = 'id'
$().ready(function() {
	if(UrlValue('m')=='send') {
		$('td.back4 table tr:eq(1) td:eq(0)').html('<b>Кому:</b>')
		$('td.back4 table tr td').removeAttr('width')
		$('textarea#tex').attr('rows','30').attr('cols','78')
	}else{
		var mailcur = parseInt($('td.back4:first td.back2:first').text().split(']')[0].split(':')[1])
		var maillast = parseInt(localStorage.maillast)
		if(isNaN(maillast)) {
			maillast = mailcur
			localStorage.maillast = mailcur
		}
		if(!UrlValue('filter') && mailcur > maillast){
			mailnum = mailcur - maillast
			localStorage.maillast = mailcur
		} else if(!UrlValue('filter') && mailcur < maillast) {
			mailnum = 0
			localStorage.maillast = mailcur
		} else mailnum = 0

		var text = '<table id="mails" width=100% class=back2><tr>'
			text += '<th width=18%><a href="javascript:void(PrintMail(\'id\'))">Дата</a></th>'
			var zagtext = 'От&nbsp;кого'
			var zag = 'sender'
			if(UrlValue('filter')=='sentbox'){
				zag = 'receiver'
				zagtext = 'Кому'
			}
			text += '<th width=5%><a href="javascript:void(PrintMail(\''+zag+'\'))">'+zagtext+'</a></th>'
			text += '<th><a href="javascript:void(PrintMail(\'sshort\'))">Заголовок</a></th><th width=3%></th></tr></table>'
		$('td.back4:first td.back1:eq(1)').html(text)
		$('td.back4:first td.back2:gt(0)').each(function(i,val){
			var curmail = {}
			curmail.defhide = (i>=mailnum ? ' style="display: none;"': '')
			curmail.id 			= parseInt($(val).find('a:first').attr('name'))
			curmail.summary		= $(val).find('b:first').text()
			curmail.sshort		= curmail.summary.replace(/Re\:\s/g,'')
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
			$(val).parent().remove()
			mails.push(curmail)
		})
		$('td.back4:first tr:has(td.back4)').hide()
		PrintMail()
	}
}, false)

function PrintMail(srt){
	if(srt != undefined){
		if(srt == srtcur) srtflag = -1*srtflag
		mails.sort(function(a,b){if(a[srt] < b[srt]) return srtflag;if(b[srt] < a[srt]) return -1*srtflag;return 0})
		srtcur = srt
	}
	$('table#mails tr:gt(0)').remove()
	var mark = false
	var markdata = ''
	for(j in mails){
		var mail = mails[j]
		if(srt!='id') mark = (markdata==mail[srt] ? mark : (mark ? false : true))
		markdata = mail[srt]
		var html = ''
		html += '<tr'+(mark ? ' class=back1':'')+' height=25>'
		html += '<td>'+mail.date + '</td>'
		html += '<td>'
		html += '<a href="users.php?m=details&id='+(UrlValue('filter')=='sentbox' ? mail.receiverid : mail.senderid)+'">'+(UrlValue('filter')=='sentbox' ? mail.receiver : mail.sender)+'</a>'
		html += '</td>'
		html += '<th align=left><a href="javascript:void(OpenMail('+mail.id+'))" id=a'+mail.id+' class="off">'+mail.summary+'</a></th>'
		html += '<td align=center>'
		html += '<a href="pm.php?m=edit&a=delete&id='+mail.id+'&filter='+(!UrlValue('filter') ? '' : UrlValue('filter'))+'">x</a>'
		html += '</td>'
		html += '</tr>'
		html += '<tr id='+mail.id+mail.defhide+'>'
		html += '<td colspan=4><fieldset>'+'<legend> <b>'+mail.summary+'</b> </legend>'+mail.body+'<br><br>'
		html += (UrlValue('filter')=='sentbox' ? '' : '[<a href="pm.php?m=edit&a='+(UrlValue('filter')=='archives' ? 'unarchive' : 'archive')+'&id='+mail.id+'">'+(UrlValue('filter')=='archives' ? 'Вернуть во Входящие' : 'В архив')+'</a>] ')
		html += '[<a href="pm.php?m=edit&a=delete&id='+mail.id+'&filter='+(!UrlValue('filter') ? '' : UrlValue('filter'))+'">Удалить</a>] '
		html += (UrlValue('filter')=='sentbox' ? '' : '[<a href="pm.php?m=send&to='+mail.senderid+'&quote='+mail.id+'">Ответить отправителю</a>]')
		html += '</fieldset></td>'
		html += '</tr>'
		$('table#mails').append(html)
	}
}

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
