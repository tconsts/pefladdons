// ==UserScript==
// @name           peflmain
// @namespace      pefl
// @description    modify site
// @include        http://*pefl.*/*
// @exclude        http://*pefl.*/profile.php
// @exclude        http://*pefl.*/auth.php
// @author         const
// ==/UserScript==

var scflag = (localStorage.scripts != undefined && localStorage.scripts != null ? localStorage.scripts : '0:0:0:0:0:0:1:0:0:1:1:1:0:0:0:0:1:0:0:0:1:0:0:1:1:0').split(':'),
scriptnames = [
	'settings', 
	'sostav', 
	'player', 
	'contracts', 
	'team', 
	'div', 
	'', //  6 ReitChamps (removed)
	'schedule', 
	'finance', 
	'', //  9 SostavNaMatch (removed)
	'', // 10 ReitSchool (removed)
	'', // 11 NN (removed)
	'hist', 
	'dov', 
	'match', 
	'index', 
	'', // 16 Mail: removed
	'train', 
	'tournaments', 
	'calendar', 
	'forum', 
	'ref', 
	'adaptation',
	'', // TV: removed
	'', // reit int: removed
	'school'
],
url2 = location.search.substring(1),
t = UrlValue('t');

console.log('crab.UrlValue: p(%s), t(%s)',UrlValue('p'),UrlValue('t'));

var newScriptMenu = document.createElement('script');
newScriptMenu.type = 'text/javascript';
newScriptMenu.src = chrome.extension.getURL('js/crab_funcs_std.js');
document.getElementsByTagName("head")[0].appendChild(newScriptMenu);

var newScriptMenu = document.createElement('script');
newScriptMenu.type = 'text/javascript';
newScriptMenu.src = chrome.extension.getURL('js/crab_funcs_db.js');
document.getElementsByTagName("head")[0].appendChild(newScriptMenu);

AddScriptJS();
switch (location.pathname.substring(1)) {
	case 'forums.php':
		if (UrlValue('m') == 'posts') { AddScriptJS(20); }
		break;
	
	case 'index.php':
	case '':
		if (url2 == '') {AddScriptJS(15); }
		if (url2 == 'settings') {AddScriptJS(0); }
		if (url2 == 'sostav' || url2 == 'sostav_n') { AddScriptJS(1); }
		if (url2 == 'adaptation') { AddScriptJS(22); }
		break;
		
	case 'hist.php': AddScriptJS(12); break;
	
	case 'plug.php':
		switch (UrlValue('p')) {
			case 'refl':
				if (t == 'p' || t == 'p2' || t == 'pp' || t == 'yp2' || t == 'yp') { AddScriptJS(2); }
				if (t == 'k') { AddScriptJS(4); }
				if (t == 's') { AddScriptJS(5); }
				if (t == 'last') { AddScriptJS(7); }
				if (t == 'dov') { AddScriptJS(13); }
				if (t == 'if' || t == 'code') { AddScriptJS(14); }
				if (t == 'cup' || t == 'ec' || t == 't' || t == 'f') { AddScriptJS(18); }
				if (t == 'ref') { AddScriptJS(21); }
				if (t == 'school') { AddScriptJS(25); }
				break;

			case 'fin':
				if (t == 'ctr') { AddScriptJS(3); }
				if (!t) { AddScriptJS(8); }
				break;
				
			case 'rules':
				AddScriptJS(8);
				break;
				
			case 'tr':
				AddScriptJS(3);
				break;
			
			case 'training':
			case 'trainplan':
				AddScriptJS(17);
				break;
			
			case 'calendar':
				AddScriptJS(19);
				break;
		}
		break;
}

function AddScriptJS(flag) {
	if(flag!=undefined && scflag[flag] == undefined) scflag[flag]=0;
	if (flag == undefined || scflag[flag] == 0) {
		var newScriptMenu = document.createElement('script');
		newScriptMenu.type = 'text/javascript';
		newScriptMenu.src = chrome.extension.getURL('js/crab_' + (flag == undefined ? 'common' : scriptnames[flag]) + '.user.js');
		document.getElementsByTagName("head")[0].appendChild(newScriptMenu);
	}
}

function UrlValue (key, url) {
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&');
	for (n in pf) { if(pf[n].split('=')[0] == key) { return pf[n].split('=')[1]; }}
	return false;
}
