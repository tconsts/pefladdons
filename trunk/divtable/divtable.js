function setCookie(name, value) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 356); // +1 year
	if (!name || !value) return false;
	document.cookie = name + '=' + encodeURIComponent(value) + '; expires='+ exdate.toUTCString() + '; path=/'
	return true
}
function getCookie(name) {
	    var pattern = "(?:; )?" + name + "=([^;]*);?"
	    var regexp  = new RegExp(pattern)
	     
	    if (regexp.test(document.cookie)) return decodeURIComponent(RegExp["$1"])
	    return false
}

function PlusMinus(){
	$('th:last').before('<th width="6%">+/-</td>')
	$('th:contains(�)').parent().parent().find('tr').each(function(){
		var gz = +$(this).find('td:last').prev().prev().text()
		var gp = +$(this).find('td:last').prev().text()
		var td  = '<td>' +  (gz > gp ? '+' : '') + (gz-gp) + '</td>'
		$(this).find('td:last').before(td)
	})
}

function ColorTable(tableid){
	if (diap[tableid]){
		$('th:contains(�)').parent().parent().find('tr').each(function(i,val){
			for (var j in diap[tableid]) {
				var d = diap[tableid][j]
				if (i>= +d.split('!')[0].split('-')[0] && i <= +d.split('!')[0].split('-')[1]) {
					$(val).css("background-color", d.split('!')[1])
				}
			}
		})
	}
}

function SelectTeam(teamid){
	$("tr td a[href*='plug.php?p=refl&t=k&j="+teamid+"&']").parent().css("font-weight", "bold")
}

function getValue(tableid,curVal){
	var retVal = prompt('������� ���� �������', curVal.replace(/!/g,'='));
	if (retVal != null) {
		var cookie = ''
		diap[tableid] = retVal.replace(/=/g,'!').split(',');
		ColorTable(tableid);

		for (var i in diap) if(i!=0 && diap[i].join('*')!='') cookie += '.' + i +'*' + diap[i].join('*');

		setCookie('pefltables',cookie.replace('.',''))
	}
	return true
}
function TableCodeForForum(){

	// change big flags for eurocups in table
	$('td.back4 td.back1').parent().next().find('table').find('img[src*=system/img/flags/]').each(function(){
	// need fill base key=peflid, value=2 symbols tag: system/img/flags/155.gif -> system/img/flags/f-ru.gif
		var f = []
		f[1]='al';	//�������
		f[2]='dz';	//�����
		f[8]='ar';	//���������
		f[9]='am';	//�������
		f[11]='au';	//���������
		f[12]='at';	//�������
		f[13]='az';	//�����������
		f[18]='by';	//��������
		f[19]='be';	//�������
		f[24]='bo';	//�������
		f[25]='ba';	//������
		f[27]='br';	//��������
		f[30]='bg';	//��������
		f[41]='cl';	//����
		f[42]='cn';	//�����
		f[44]='co';	//��������
		f[47]='cr';	//�����-����
		f[48]='hr';	//��������
		f[50]='cy';	//����
		f[51]='cz';	//�����
		f[53]='dk';	//�����
		f[58]='ec';	//�������
		f[59]='eg';	//������
		f[61]='en';	//������
		f[64]='ee';	//�������
		f[66]='mk';	//���������
		f[69]='fi';	//���������
		f[70]='fr';	//A������
		f[73]='ge';	//������
		f[74]='de';	//��������
		f[76]='gr';	//������
		f[84]='nl';	//���������
		f[87]='hu';	//�������
		f[88]='is';	//��������
		f[91]='ir';	//����
		f[93]='ie';	//��������
		f[94]='il';	//�������
		f[95]='it';	//������
		f[96]='ci';	//���`�`�����
		f[98]='jp';	//������
		f[100]='kz';	//���������
		f[105]='lv';	//������
		f[111]='lt';	//�����
		f[122]='mx';	//�������
		f[123]='md';	//�������
		f[126]='ma';	//�������
		f[129]='nt';	//���. ��������
		f[137]='ng';	//�������
		f[139]='no';	//��������
		f[145]='py';	//��������
		f[147]='pe';	//����
		f[149]='pl';	//������
		f[150]='pt';	//����������
		f[152]='qa';	//�����
		f[154]='ro';	//�������
		f[155]='ru';	//������
		f[160]='sa';	//���. ������
		f[161]='http://pefladdons.googlecode.com/svn/trunk/f-161.gif';	//���������	
		f[166]='sk';	//��������
		f[167]='si';	//��������
		f[170]='za';	//���
		f[171]='kr';	//�����
		f[172]='es';	//�������
		f[180]='se';	//������
		f[181]='ch';	//���������
		f[191]='tn';	//�����
		f[192]='tr';	//������
		f[195]='ae';	//���
		f[196]='us';	//���
		f[200]='ua';	//�������
		f[201]='uy';	//�������
		f[202]='uz';	//����������
		f[204]='ve';	//���������
		f[207]='wl';	//�����
		f[209]='yu';	//!!������
		f[214]='http://pefladdons.googlecode.com/svn/trunk/f-214.png';	//����������

		var fid=$(this).attr('src').split('flags/')[1].split('.')[0]
		var img = '<img src="'
		if (f[fid]) {
			if (fid == 161 || fid ==214) img += f[fid]
			else img += 'system/img/flags/f-' + f[fid] + '.gif'
		} else img += 'system/img/flags/f-00.gif'
		img += '"> '

		$(this).parent().prepend(img)
		$(this).remove()
	})

	// generate code for forum
	var x = '[b]'
	x += $('td.back4 td.back1').text()
	x += '[/b][spoiler]'
	x += $('td.back4 td.back1').parent().next().find('table').html()
		.replace(/<tbody>/g,'<table width=100% bgcolor=#C9F8B7>')
		.replace(/tbody/g,'table')
		.replace(/<th/g,'[td')
		.replace(/<\/th>/g,'[/td]')
		.replace(/\</g,'[')
		.replace(/\>/g,']')
		.replace(/ height=\"12\"/g,'')
		.replace(/a href=\"/g,'url=')
		.replace(/\/a/g,'/url')
		.replace(/\&amp\;/g,'&')
		.replace(/img src="/g,'img]')
		.replace(/.gif/g,'.gif[/img')
		.replace(/.png/g,'.png[/img')
		.replace(/"/g,'')
//		.replace(/#a3de8f/g,'C9F8B7')
		.replace(/ width=25/g,'')
		.replace(/\n/g,'')
	x += '\n\n\n[center]--------------- [url=forums.php?m=posts&q=173605]�������� VIP[/url] ---------------[/center]\n';
	x += '[/spoiler]'
	return x;
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

var diap = []
var url = {}
var def = '1-1!FCE94F,2-2!white,3-3!E9B96E'

$().ready(function() {


	// add column with goals +/- (will be include to code for forum)
	PlusMinus();

	// code for forum
	var pre = '<br><hr>��� ��� ������<br><textarea rows="5" cols="70" readonly="readonly" id="CodeTableForForum">'+TableCodeForForum()+'</textarea>'
	$('td.back4').append(pre)

	// select as bold self team in my table with id=0
	if( UrlValue('k') && UrlValue('k')!=0) SelectTeam(UrlValue('k'))

	var tbid = -1;
	if ( UrlValue('j') ) tbid = UrlValue('j');

	if (tbid == 0){
		var divname = 
		$("td.back4 a").each(function(){
			if ($(this).text() == $('td.back1 span').text().split(', ',2)[1]) {
				tbid = UrlValue('j',$(this).attr('href'))
			}
		})
	}


	if (getCookie('pefltables') && tbid >= 0) {
		var dp = getCookie('pefltables').split('.')
		for (var p in dp) {
			var name = dp[p].split('*',1)[0] 
			var key = dp[p].split('*')
			key.shift()
			diap[name] = key
		}
		ColorTable(tbid);
	}

	if(tbid>=0) $('td.back1 span').parent().append(' <a href="javascript:void(getValue(\'' + tbid + '\',\''+ (diap[tbid] ? diap[tbid].join() : def) +'\'))">#</a> ') //css("border", "1px solid black");

});