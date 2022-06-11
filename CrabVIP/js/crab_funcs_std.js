// Common standard functions and variables

const ff = (navigator.userAgent.indexOf('Firefox') !== -1),
curManagerNick = ($('td.back3 tr:eq(1) td:eq(0)').text().match(/\s([a-zA-Z0-9\.\_]+)\,/)??["",false])[1];

let crabImageUrl, deb = (!!localStorage.debug);

document.addEventListener('getCrabImageUrlEvent', (e) => { crabImageUrl = e.detail; });

function debug(text, ...args) {
	if (deb) {
		const scriptName = document.currentScript != null && document.currentScript != undefined 
			? document.currentScript.src.split('crab_')[1].split('.')[0]
			: "???"
		console.log("["+scriptName+ "] "+ (text == undefined ? '' : text), ...args);
	}
}

function nSort(srt,nap) {	
	return function(a, b) {
		return nap ? a[srt] - b[srt] : b[srt] - a[srt];
	};
};

/**
function getPairValue(num,str,def,delim) {
	def	= (def ? def : '');
	delim = (delim ? delim : '=');
	arr	= str.split(delim);
	return (arr[num] == undefined ? def : arr[num]);
}
**/

function UrlValue(key, url) {
	const pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&');
	for (n in pf) {	if( pf[n].split('=')[0] == key ) { return pf[n].split('=')[1]; }}
	return false
}

function TrimString(sInString){
	return sInString.replace(/\&nbsp\;/g,' ').replace(/(^\s+)|(\s+$)/g, '');
}