//1-200� ������
//200-500� ������
//500 - 1� �������
//1-3� ����������
//3-6� �������������
//6-15� ��������
//������ 15 - �������
//������ 40 - ������ ������ ������

$().ready(function() {

	var txt = '���. ���������: '

	$('td.l4:contains('+txt+')').each(function(){
			var fin = $(this).text().replace(txt,'').replace(/,/g,'').replace('$','')
			if (fin == '������') var newtxt =  $(this).text() + ' (1-200�)'
			if (fin >=1000000 && fin<3000000) var newtxt =  $(this).text()+ ' (����������)'
			$(this).html(newtxt);
	});
});