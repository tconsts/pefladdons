// ==UserScript==
// @name           peflskin1
// @namespace      pefl
// @description    Alternative skin for PEFL #1
// @include        https://*pefl.*/*
// @exclude        https://*pefl.*/hist.php*
// @version        1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newCSS = document.createElement('style');
newCSS.type = 'text/css';
newCSS.innerHTML  = '.topmenu	{ background-color: #ececec; }'; // #A3DE8F 

newCSS.innerHTML += '.back1 	{ background-color: #efefef; }'; // #C9F8B7 
newCSS.innerHTML += '.back2		{ background-color: #e6e6e6; }'; // #A3DE8F
newCSS.innerHTML += '.back3		{ background-color: #ffffff; }'; // #A3DE8F
newCSS.innerHTML += '.back4		{ background-color: #ededed; }'; // #C9F8B7
newCSS.innerHTML += '.back5		{ background-color: #dfdfdf; }'; // #505660
headID.appendChild(newCSS);