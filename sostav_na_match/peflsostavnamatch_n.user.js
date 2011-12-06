// ==UserScript==
// @name           peflsostavnamatch_n
// @namespace      pefl
// @description    Get team national code for forum
// @include        http://*pefl.*/?team_n
// @version        2.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/sostav_na_match/firefox/main_n.js';
headID.appendChild(newScript2);