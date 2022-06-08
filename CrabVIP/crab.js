// ==UserScript==
// @name           peflmain
// @namespace      pefl
// @description    modify site
// @include        http://*pefl.*/*
// @exclude        http://*pefl.*/profile.php
// @exclude        http://*pefl.*/auth.php
// @author         const
// ==/UserScript==

let newScriptMenu, 
scflag = (localStorage.scripts != undefined && localStorage.scripts != null ? localStorage.scripts : '0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:1:0:0:0:1:0:0:1:1:0').split(':'),
scriptnames = [
	'settings', 
	'sostav', 
	'player', 
	'contracts', 
	'team', 
	'div', 
	'new_sostav', //  6 SostavNaMatch
	'schedule', 
	'finance', 
	'snm', //  9 SostavNaMatch (removed)
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
	'summary', // reit int: removed
	'school'
],
url2 = location.search.substring(1),
t = UrlValue('t');

InsertScript('funcs_std');
newScriptMenu.onload = function(){
	var url=chrome.runtime.getURL("img/crab1.png");
	var evt=document.createEvent("CustomEvent");
	evt.initCustomEvent("getCrabImageUrlEvent", true, true, url);
	document.dispatchEvent(evt);
};

InsertScript('funcs_db');
AddScriptJS();

switch (location.pathname.substring(1)) {
	case 'forums.php':
		if (UrlValue('m') == 'posts') { AddScriptJS(20); }
		break;
	
	case 'index.php':
	case '':
		if (url2 == '') {AddScriptJS(15); }
		if (url2 == 'settings') {AddScriptJS(0); }
		if (url2 == 'sostav' || url2 == 'sostav_n') { AddScriptJS(1,'funcs_pls');}
		if (url2 == 'adaptation') { AddScriptJS(22); }
		break;
		
	case 'hist.php': AddScriptJS(12); break;
	
	case 'plug.php':
		switch (UrlValue('p')) {
			case 'refl':
				if (t == 'p' || t == 'p2' || t == 'pp' || t == 'yp2' || t == 'yp') { AddScriptJS(2,'funcs_pls'); }
				if (t == 'k') { AddScriptJS(4); }
				if (t == 's') { AddScriptJS(5); }
				if (t == 'last') { AddScriptJS(7); }
				if (t == 'dov') { AddScriptJS(13); }
				if (t == 'if' || t == 'code') { AddScriptJS(14); }
				if (t == 'cup' || t == 'ec' || t == 't' || t == 'f') { AddScriptJS(18); }
				if (t == 'ref') { AddScriptJS(21); }
				if (t == 'khist') { AddScriptJS(24); }
				if (t == 'school') { AddScriptJS(25); }
				break;

			case 'fin':
				if (t == 'ctr') { AddScriptJS(3); }
				if (!t || t == 'prizef') { AddScriptJS(8); }
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
			case 'squad4':
				AddScriptJS(9);
				break;
			case 'squad7':
				AddScriptJS(6);
				break;

		}
		break;
}

function AddScriptJS(flag,name) {
	if(flag!=undefined && scflag[flag] == undefined) scflag[flag]=0;
	if (flag == undefined || scflag[flag] == 0 || flag == 6 || flag == 24) {
		if (name != undefined) InsertScript(name);
		InsertScript((flag == undefined ? 'common' : scriptnames[flag]) + '.user');		
	}	
}

function InsertScript(name) {
	console.log('InsertScript',name);
	newScriptMenu = document.createElement('script');
	newScriptMenu.type = 'text/javascript';
	newScriptMenu.src = chrome.extension.getURL('js/crab_'+name+'.js');
	document.getElementsByTagName("head")[0].appendChild(newScriptMenu);
}

function UrlValue (key, url) {
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&');
	for (n in pf) { if(pf[n].split('=')[0] == key) { return pf[n].split('=')[1]; }}
	return false;
}