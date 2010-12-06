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
	$('th:contains(№)').parent().parent().find('tr').each(function(){
		var gz = +$(this).find('td:last').prev().prev().text()
		var gp = +$(this).find('td:last').prev().text()
		var td  = '<td>' +  (gz > gp ? '+' : '') + (gz-gp) + '</td>'
		$(this).find('td:last').before(td)
	})
}

function ColorTable(tableid){
	if (diap[tableid]){
		$('th:contains(№)').parent().parent().find('tr').each(function(i,val){
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
	var retVal = prompt('Задайте цвет таблицы', curVal.replace(/!/g,'='));

	diap[tableid] = retVal.replace(/=/g,'!').split(',');

	ColorTable(tableid);

	var cookie = ''
	for (var i in diap) if(i!=0 && diap[i].join('*')!='') cookie += '.' + i +'*' + diap[i].join('*');

	if (retVal != null) setCookie('pefltables',cookie.replace('.',''))

	return true
}
function TableCodeForForum(){
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
		.replace(/\n/g,'')
	x += '\n\n\n[center]--------------- [url=forums.php?m=posts&q=173605]Крабовый VIP[/url] ---------------[/center]\n';
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
	var pre = '<br><hr>Код для форума<br><textarea rows="5" cols="70" readonly="readonly" id="CodeTableForForum">'+TableCodeForForum()+'</textarea>'
	$('td.back4 hr').parent().append(pre)

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