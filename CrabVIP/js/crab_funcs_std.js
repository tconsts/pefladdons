class Std {
	static #deb = (!!localStorage.debug);

    /**
	 * @param {any=} v1 
	 * @param  {...any=} args 
	 */
	static debug(v1, ...args) {
        if ( this.#deb) {
            const scriptName = document.currentScript != null && document.currentScript != undefined 
                ? document.currentScript.src.split('crab_')[1].split('.')[0]
                : "???"
            if (typeof v1 === 'string' || v1 instanceof String || v1 === undefined) {
                console.log("["+scriptName+ "] "+ (v1 ?? ''), ...args);
            } else {
                console.log("["+scriptName+ "]", v1, ...args);
            }		
        }
    }
	/**
	 * @param {string} sInString 
	 * @returns {string}
	 */
	static trim(sInString) {
		return sInString.replace(/\&nbsp\;/g,' ').trim();
	}

	/**
	 * Sort by property prop as number
	 * @param {string} prop 
	 * @param {boolean} direction 
	 * @returns 
	 */
	static nSort(prop,direction) {
		return function(a, b) {			
			return direction ? a[prop] - b[prop] : b[prop] - a[prop];
		};
	};
}
class Url {
	/**
	 * @param {string=} url 
	 */
	constructor(url) {
		const pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&');
		for (let n in pf) {	
			this[pf[n].split('=')[0]] = pf[n].split('=')[1];
		}
	}
	/**
	 * @param {string} key 
	 * @param {string=} url 
	 * @returns  {string}
	 */
	static value(key, url) {
		return new Url(url)[key];
	}
}

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

function drawEars()
{	
	let sz = parseInt($('body').attr('data-size'));
	Std.debug('size',sz);

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

/**
 * @param {string} key 
 * @param {string} url 
 * @returns 
 * @deprecated since 2.0.20 use Url.value
 */
function UrlValue(key, url) { return Url.value(key, url) ?? false; }

/**
 * @param {any=} text
 * @param  {...any=} args
 * @deprecated since 2.0.20, use Std.debug
 */
function debug(text, ...args) { Std.debug(text, ...args); }