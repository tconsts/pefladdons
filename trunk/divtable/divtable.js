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

$().ready(function() {
	// need develop function of get from url (0 is my table). debug:
	var tableid = location.href.split('?',2)[1].split('&',4)[3].split('=',2)[1]

	// need develop function of get(and set) from cockie... debug:
	var diap = []
	diap[0]=['18-22:grey','1-2:white']					// my current div
	diap[43]=['15-16:grey','1-6:yellow','1-2:white']	// Russian PL
	diap[44]=['18-22:grey','1-2:white']					// Russian PD

	if (diap[tableid]){
		$('td u').each(function(i,val){
			var x = $(val).text()
			for (var j in diap[tableid]) {
				var d = diap[tableid][j]
				if (x>= +d.split(':')[0].split('-')[0] && x <= +d.split(':')[0].split('-')[1]) {
					$(val).parent().parent().parent().css("background-color", d.split(':')[1])
				}
			}
		})
	}
});