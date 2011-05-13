// ==UserScript==
// @name           peflsostavnamatch
// @namespace      pefl
// @description    Get team code for forum
// @include        http://www.pefl.ru/?team
// @include        http://pefl.ru/?team
// @include        http://www.pefl.net/?team
// @include        http://pefl.net/?team
// @include        http://www.pefl.org/?team
// @include        http://pefl.org/?team
// @version			1.1
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/sostav_na_match/firefox/main.js';
headID.appendChild(newScript2);