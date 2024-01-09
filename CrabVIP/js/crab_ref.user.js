// ==UserScript==
// @name           peflref
// @namespace      pefl
// @description    referee page modification
// @include        https://*pefl.*/*&t=ref&*
// @encoding	   windows-1251
// ==/UserScript==

let srtn = false,
refs = [],
tb,
fields = ['id','name','nid','games','ycn','rcn'];

$().ready(function() {
	tb = $('td.back4 table table');
	tb.find('th').each(function(i,th) {
		if (i != 1) $(th).wrapInner('<a href="javascript:void(PrintTable(\''+fields[i]+'\'))"></a>');
		if (i === 4) $(th).append(' (<a href="javascript:void(PrintTable(\'ycr\'))">#</a>)');
		if (i === 5) $(th).append(' (<a href="javascript:void(PrintTable(\'rcr\'))">#</a>)');
	});	
	tb.find('tr:eq(0)').append('<th><a href="javascript:void(PrintTable(\'acn\'))">жк+кк*3</a> (<a href="javascript:void(PrintTable(\'acr\'))">#</a>)</th>');

	tb.find('tr:gt(0)').each(function() {
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
});

function PrintTable(sorting) {
	srtn = !srtn;
	refs = refs.sort(Std.nSort(sorting,srtn));
	tb.find('tr:gt(0)').remove();
	for (i in refs) {
		rf = refs[i];
		tb.append('<tr align=left><td>'+rf.id+'</td><td>'+rf.name+'</td><td align=center><img src="system/img/flags/'+rf.nid+'.gif" width="30"></td><td>'+rf.games+'</td><td>'+rf.ycn+' ('+rf.ycr+')'+'</td><td>'+rf.rcn+' ('+rf.rcr+')'+'</td><td>'+rf.acn+' ('+(rf.acr).toFixed(2)+')'+'</td></tr>');
	}
	tb.find('tr:gt(0):odd').addClass('back2')
}
	