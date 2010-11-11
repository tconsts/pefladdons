function getCookie(name) {
	    var pattern = "(?:; )?" + name + "=([^;]*);?"
	    var regexp  = new RegExp(pattern)
	     
	    if (regexp.test(document.cookie)) return decodeURIComponent(RegExp["$1"])
	    return false
}


$().ready(function() {
	var substring = '<u>1</u>'
	var txt = ''

	$('td').each(function(i,val){
		if ($(val).html().indexOf(substring) != -1 && i==12) {
			$(val).css("background-color", "white");
			$(val).css("border", "1px solid black");
			txt += i + ' ' 
			//alert($(this).html())
		}
	});
	//alert(txt)
});