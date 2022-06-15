// Common standard functions and variables

const ff = (navigator.userAgent.indexOf('Firefox') !== -1),
curManagerNick = ($('td.back3 tr:eq(1) td:eq(0)').text().match(/\s([a-zA-Z0-9\.\_]+)\,/)??["",false])[1];

let crabImageUrl, 
deb = (!!localStorage.debug),
today = new Date(),
todayTmst = today.valueOf();

today = check(today.getDate()) + '.'+check(today.getMonth()+1);

document.addEventListener('getCrabImageUrlEvent', (e) => { crabImageUrl = e.detail; });

function check(d) {	return (d < 10 ? "0" + d : d); }

function debug(text, ...args) {
	if (deb) {
		const scriptName = document.currentScript != null && document.currentScript != undefined 
			? document.currentScript.src.split('crab_')[1].split('.')[0]
			: "???"
		if (typeof text === 'string' || text instanceof String || text === undefined) {
			console.log("["+scriptName+ "] "+ (text ?? ''), ...args);
		} else {
			console.log("["+scriptName+ "] ",text, ...args);
		}		
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

function drawEars()
{	
	let sz = parseInt($('body').attr('data-size'));
	debug('size',sz);

    if (sz >= 1000) $('body table.border:has(td.back4)').attr('width', sz - 200);
	else $('body table:eq(0) tr > td:eq(2) table tr:eq(1) td:eq(0)').attr('id','crabglobalright').css("padding-top","22px");    
		
	// Draw left and right panels
    let preparedhtml = '<table align=center cellspacing="0" cellpadding="0" id="crabglobal">'
		+ '<tr><td id="crabglobalcenter" valign=top></td>'
    	+ (sz >= 1000 ? '<td id="crabglobalright" width=200 valign=top></td>' : '')
    	+ '</tr></table>';
	
	$('body table.border:last').before(preparedhtml);
	$('#crabglobalright').prepend('<table id="crabrighttable" class=back3 width=200><tr><td height=100% valign=top id="crabright" nowrap></td></tr></table>');

	$('td.back4 script').remove();
}