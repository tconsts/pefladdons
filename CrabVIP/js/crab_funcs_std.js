let crabImageUrl,
ff = (navigator.userAgent.indexOf('Firefox') !== -1);

document.addEventListener('getCrabImageUrlEvent', function (e)
{
    crabImageUrl=e.detail;
});


function debug(text) {
	console.log(text);
}
/**
function getPairValue(num,str,def,delim) {
	def	= (def ? def : '');
	delim = (delim ? delim : '=');
	arr	= str.split(delim);
	return (arr[num] == undefined ? def : arr[num]);
}
**/

function UrlValue(key, url) {
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&');
	for (n in pf) {	if( pf[n].split('=')[0] == key ) { return pf[n].split('=')[1]; }}
	return false
}

function TrimString(sInString){
	return sInString.replace(/\&nbsp\;/g,' ').replace(/(^\s+)|(\s+$)/g, '');
}
