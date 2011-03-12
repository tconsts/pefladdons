function findPlayer(playerName) {
	$('p.matchMoment').each(function(index){
		$(this).css('background-color','');
		if ($(this).text().indexOf(playerName)>0){
			$(this).css('background-color','#FFE971');
		}
	});
}

$().ready(function() {
	var x = $('td.back4 table:eq(2) td').html().split('<br><br>');

	var content = "";
	for (i=0;i<x.length;i++){
	    x[i] = "<p class='matchMoment'>"+x[i]+"</p>"
	    content+=x[i]+'<br>';
	}
	$('td.back4 table:eq(2) td').html(content);

	$('td.back4 table:last tr td:nth-child(2)').each(function(index){
	    var player = $(this).html().replace('<b>(ê)</b>','').replace('<b><font color="#ff3333">','').replace('</font></b><font color="#ff3333"></font>','');
	 if (player.indexOf('.')>0){
	        player = player.substr(player.indexOf('.')+1);
	 }
	 $(this).attr("width","150");
	 var color = $(this).attr("bgcolor");
	 $(this).after("<td bgcolor='"+color+"'><a href='#' onclick=\"findPlayer('"+player+"');return false;\">...</a></td>");
	});

	$('td.back4 table:last tr td:nth-child(8)').each(function(index){
	    var player = $(this).html().replace('<b>(ê)</b>','').replace('<b><font color="#ff3333">','').replace('</font></b><font color="#ff3333"></font>','');
	 if (player.indexOf('.')>0){
	        player = player.substr(player.indexOf('.')+1);
	 }
	 $(this).attr("width","150");
	 var color = $(this).attr("bgcolor");
	 $(this).after("<td bgcolor='"+color+"'><a href='#' onclick=\"findPlayer('"+player+"');return false;\">...</a></td>");
	});
	return false;
});