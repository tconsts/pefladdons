$().ready(function() {
	var szp=0
	$('td.back4 td').each(function(i,val){
		if ($(val).html().indexOf('$') != -1 && !isNaN(+$(val).html().replace('$',''))){
			szp += +$(val).html().replace('$','')
		}
	});
	var txt='<br>Сумма зарплат:';
	var newtxt = '<hr><table width=100%><tr><td width=5%></td><td width=30%></td><td width=10% ALIGN=right  bgcolor=#a3de8f><b>'+String((szp/1000).toFixed(3)).replace('.',',')+'$</b></td><td colspan=2><i>(за каждого школьника еще по +100$)</i></td></tr></table>'+txt;
	
	$('td.back4').each(function(){
		if ($(this).html().indexOf(txt) != -1){
			var newbody = $(this).html().replace(txt,newtxt);
			$(this).html(newbody);
		}
	});
});