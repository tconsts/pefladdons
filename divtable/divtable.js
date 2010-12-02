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

	// need develop function of get(and set) from cockie... debug:
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

function getValue(curVal){
	var retVal = prompt('Задайте цвет таблицы', curVal);

	if (retVal != null) setCookie('pefltables',retVal)

	return true

}

var diap = []
$().ready(function() {
	
//	setCookie('pefltables','0*18-22!D3D7CF*1-2!white.43*15-16!D3D7CF*1-6!FCE94F*1-2!white.44*18-22!D3D7CF*1-2!white');
//	var m='0*18-22!D3D7CF*1-2!white.43*15-16!D3D7CF*1-6!FCE94F*1-2!white.44*18-22!D3D7CF*1-2!white'

	if (getCookie('pefltables')) {
		var tbid = location.href.split('?',2)[1].split('&',4)[3].split('=',2)[1]
		var dp = getCookie('pefltables').split('.') //m.split('.')

		for (var p in dp) diap[dp[p].split('*',2)[0]] =dp[p].split('*');
//		diap[0]=['18-22:D3D7CF','1-2:white']					// my current div
//		diap[43]=['15-16:D3D7CF','1-6:FCE94F','1-2:white']		// Russian PL
//		diap[44]=['18-22:D3D7CF','1-2:white']					// Russian PD

		ColorTable(tbid);
	}

	$('td.back1 span').parent().append(' <a href="javascript:void(getValue(\''+ diap +'\'))">#</a> ') //css("border", "1px solid black");




	// select as bold self team in my table with id=0
	SelectTeam(location.href.split('?',2)[1].split('&',3)[2].split('=',2)[1])

});