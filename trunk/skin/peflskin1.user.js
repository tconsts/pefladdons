// ==UserScript==
// @name           peflskin1
// @namespace      pefl
// @description    Alternative skin for PEFL #1
// @include        http://*pefl.*/*
// @version        1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newCSS = document.createElement('style');
newCSS.type = 'text/css';
newCSS.innerHTML = '.back3 { background-color: #ffffff; } .back2 { background-color: #efefef; } .back1 { background-color: #e6e6e6; } .back4 { background-color: #ededed; } .back5 { background-color: #dfdfdf; } .topmenu { background-color: #ececec; }';
headID.appendChild(newCSS);