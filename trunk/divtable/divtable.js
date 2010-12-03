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

function ColorTable(tableid){
	if (diap[tableid]){
		$('td u').each(function(i,val){
			var x = $(val).text()
			for (var j in diap[tableid]) {
				var d = diap[tableid][j]
				if (x>= +d.split('!')[0].split('-')[0] && x <= +d.split('!')[0].split('-')[1]) {
					$(val).parent().parent().parent().css("background-color", d.split('!')[1])
				}
			}
		})
	}
}

function SelectTeam(teamid){
	$("tr td a[href*='plug.php?p=refl&t=k&j="+teamid+"&']").parent().css("font-weight", "bold")
}

function getValue(tableid,curVal){
	var retVal = prompt('������� ���� �������', curVal.join().replace(/!/g,'='));

	diap[tableid] = retVal.replace(/=/,'!').split(',');

	ColorTable(tableid);

	var cookie = ''
	for (var i in diap) cookie += (i==0 ? '' : '.') + i +'*' + diap[i].join('*');
	if (retVal != null) setCookie('pefltables',cookie)

	return true
}
function TableCodeForForum(){
	var x = '[b]'
	x += $('td.back4 td.back1').text()
	x += '[/b][spoiler]'
	x += $('td.back4 td.back1').parent().next().find('table').html()
		.replace(/<tbody>/g,'<table width=100%>')
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
		.replace(/#a3de8f/g,'C9F8B7')
		.replace(/\n/g,'')
	x += '[/spoiler]'
	return x;
}

function UrlValue(key){
	var pf = location.href.split('?',2)[1].split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

var diap = []
var url = {}
var def = []
def[0] = ['1-1!yellow','2-2!white']

$().ready(function() {

	// code for forum
	var pre = '<br><hr>��� ��� ������<br><textarea rows="5" cols="70" readonly="readonly" id="CodeTableForForum">'+TableCodeForForum()+'</textarea>'
	$('td.back4 hr').parent().append(pre)

	// select as bold self team in my table with id=0
	if( UrlValue('k') && UrlValue('k')!=0) SelectTeam(UrlValue('k'))

	var tbid = -1;
	if ( UrlValue('j') ) tbid = UrlValue('j');

	//setCookie('pefltables','0*18-22!D3D7CF*1-2!white.43*15-16!D3D7CF*1-7!FCE94F*1-2!white.44*18-22!D3D7CF*1-2!white');
	//var m='0*18-22!D3D7CF*1-2!white.43*15-16!D3D7CF*1-7!FCE94F*1-2!white.44*18-22!D3D7CF*1-2!white'

	if (getCookie('pefltables') && tbid >= 0) {
//		var dp = m.split('.')
		var dp = getCookie('pefltables').split('.')
		for (var p in dp) {
			var name = dp[p].split('*',1)[0] 
			var key = dp[p].split('*')
			key.shift()
			diap[name] = key
		}
		ColorTable(tbid);
	}

	if(tbid>=0) $('td.back1 span').parent().append(' <a href="javascript:void(getValue(' + tbid + ',\''+ (diap[tbid]?diap[tbid]:def[0]) +'\'))">#</a> ') //css("border", "1px solid black");


});