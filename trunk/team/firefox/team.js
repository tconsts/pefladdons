$().ready(function() {
	var txt = '���. ���������: '
	$('td.l4:contains('+txt+')').each(function(){
			var fin = $(this).text().replace(txt,'').replace(/,/g,'').replace('$','')
			var newtxt = '';
			switch (fin){
				case '�������': newtxt = ' (������ 0)';break;
				case '������': newtxt = ' (1�-200�)';break;
				case '������': newtxt =  ' (200�-500�)';break;
				case '�������': newtxt =  ' (500�-1�)';break;
				case '����������': newtxt = ' (1�-3�)';break;
				case '�������������': newtxt = ' (3�-6�)';break;
				case '��������': newtxt =  ' (6�-15�)';break;
				case '�������': newtxt =  ' (15�-40�)';break;
				case '������ ������ ������ :-)': newtxt =  ' (>40�)';break;
				default:
					if (fin >= 40000000) newtxt = ' (������ ������)'
					else if (fin >= 15000000) newtxt = ' (�������)'
					else if (fin >= 6000000) newtxt = ' (��������)'
					else if (fin >= 3000000) newtxt = ' (�������������)'
					else if (fin >= 1000000) newtxt = ' (����������)'
					else if (fin >= 500000) newtxt = ' (�������)'
					else if (fin >= 200000) newtxt = ' (������)'
					else if (fin >=0) newtxt = ' (������)'
					else if (fin < 0) newtxt = ' (�������)'
			}
			var preparedhtml = '���: '+$(this).text().replace(txt,'').replace(' :-)','')+newtxt.fontsize(1)
			$(this).html(preparedhtml);
	});
});