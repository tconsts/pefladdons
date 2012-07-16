// ==UserScript==
// @name           peflskin1
// @namespace      pefl
// @description    Alternative skin for PEFL #2
// @include        http://*pefl.*/*
// @version        1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];
var newCSS = document.createElement('style');
newCSS.type = 'text/css';
newCSS.innerHTML  = '.topmenu { background-color: #D3D3D3;}'//#A3DE8F	#ececec
newCSS.innerHTML += '.back1 { background-color: #E6E6FA; }'	//#C9F8B7	#efefef	#E0FFFF	#E0FFFF	#E6E6FA
newCSS.innerHTML +=	'.back2 { background-color: #D3D3D3; }'	//#A3DE8F	#e6e6e6	#ADD8E6	#B0C4DE	#D3D3D3
newCSS.innerHTML +=	'.back3 { background-color: #D3D3D3; }'	//#A3DE8F	#ffffff
newCSS.innerHTML +=	'.back4 { background-color: #E6E6FA; }' //#C9F8B7	#ededed
newCSS.innerHTML +=	'.back5 { background-color: #505660; }';//#505660	#dfdfdf
headID.appendChild(newCSS);
//body														//#888888	#888888			#5F9EA0

$().ready(function() {
//	$('body').attr('bgcolor','#5F9EA0')
	$('body table:eq(0)').remove()
	
}, false)