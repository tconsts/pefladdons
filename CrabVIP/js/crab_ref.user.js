// ==UserScript==
// @name           peflref
// @namespace      pefl
// @description    referee page modification
// @include        http://*pefl.*/*&t=ref&*
// @encoding	   windows-1251
// ==/UserScript==


var srt = 'id'
var srtn = false
var refs = []

$().ready(function() {
	$('td.back4 table table').attr('id','t1')
	$('table#t1 th:eq(0)').html('<a href="javascript:void(PrintTable(\'id\'))">'+$('table#t1 th:eq(0)').html()+'</a>')
	$('table#t1 th:eq(1)').html('<a href="javascript:void(PrintTable(\'name\'))">'+$('table#t1 th:eq(1)').html()+'</a>')
	$('table#t1 th:eq(2)').html('<a href="javascript:void(PrintTable(\'nid\'))">'+$('table#t1 th:eq(2)').html()+'</a>')
	$('table#t1 th:eq(3)').html('<a href="javascript:void(PrintTable(\'games\'))">'+$('table#t1 th:eq(3)').html()+'</a>')
	$('table#t1 th:eq(4)').html('<a href="javascript:void(PrintTable(\'ycn\'))">'+$('table#t1 th:eq(4)').html()+'</a>')
	$('table#t1 th:eq(4)').append(' (<a href="javascript:void(PrintTable(\'ycr\'))">#</a>)')
	$('table#t1 th:eq(5)').html('<a href="javascript:void(PrintTable(\'rcn\'))">'+$('table#t1 th:eq(5)').html()+'</a>')
	$('table#t1 th:eq(5)').append(' (<a href="javascript:void(PrintTable(\'rcr\'))">#</a>)')
	$('table#t1 tr:eq(0)').append('<th><a href="javascript:void(PrintTable(\'acr\'))">��+��*3</a> (<a href="javascript:void(PrintTable(\'acr\'))">#</a>)</th>')

	$('td.back4 table table tr:gt(0)').each(function(){
		var id = 0
		$(this).find('td').each(function(i,val){
			switch (i) {
			    case 0: 
					id = parseInt($(val).html())
					refs[id] = {}
					refs[id].id = id
					break;
				case 1:
					refs[id].name = $(val).html()
					break;
				case 2:
					refs[id].nid = parseInt($(val).find('img').attr('src').split('flags/')[1])
					break;
				case 3:
					refs[id].games = parseInt($(val).html())
					break;
				case 4:
					refs[id].ycn = parseInt($(val).html())
					refs[id].ycr = parseFloat($(val).html().split('(')[1])
					break;
				case 5:
					refs[id].rcn = parseInt($(val).html())
					refs[id].rcr = parseFloat($(val).html().split('(')[1])
					refs[id].acn = refs[id].ycn + refs[id].rcn*3
					refs[id].acr = refs[id].acn/refs[id].games
					break;
				default:
					break;
			}
		})
	})
	PrintTable('id')
//	for(i in refs) $('td.back4').append(i+':'+refs[i].name + ':'+ refs[i].nid +'<br>')

	SetCFF();

});

function SetCFF(){
	var tables = [];
	$('td.back4 table table').each(function(i,val){
		if($(val).attr('id')==undefined || $(val).attr('id')=='') $(val).attr('id','x'+i);
		tables.push($(val).attr('id'));
	})
	var text = '</script><script type="text/javascript" src="js/fcode2.js"></script>';
	text+='<div align=right><a href="javascript:void(ShowCode([],\''+tables.join(',')+'\',\'forumcode\'))">��� ��� ������</a></div>';
	$('td.back4 table table:first').before(text);
}

function PrintTable(sorting){
	if(sorting==srt) srtn = (srtn ? false : true)
	srt = sorting
	refs = (srtn ? refs.sort(sSortR) : refs.sort(sSort))
	$('table#t1 tr:gt(0)').remove()
	var num = 0
	for (i in refs){
		num++
		rf = refs[i]
		var tr = '<tr align=left><td>'+rf.id+'</td><td>'+rf.name+'</td><td align=center><img src="system/img/flags/'+rf.nid+'.gif" width="30"></td><td>'+rf.games+'</td><td>'+rf.ycn+' ('+rf.ycr+')'+'</td><td>'+rf.rcn+' ('+rf.rcr+')'+'</td><td>'+rf.acn+' ('+(rf.acr).toFixed(2)+')'+'</td></tr>'
		$('table#t1').append(tr)
	}
	$('table#t1 tr:gt(0):odd').attr('bgcolor','#a3de8f')
}

function sSort(i, ii) { //�� �������� � ��������
    if 		(i[srt] < ii[srt])	return  1
    else if	(i[srt] > ii[srt])	return -1
    else						return  0
}

function sSortR(i, ii) { //������, �� �������� � ��������
    if 		(i[srt] > ii[srt])	return  1
    else if	(i[srt] < ii[srt])	return -1
    else						return  0
}
