// ==UserScript==
// @name           peflsostavnamatchdev
// @namespace      pefl
// @description    Get team code for forum
// @include        http://www.pefl.ru/?team
// @include        http://pefl.ru/?team
// @include        http://www.pefl.net/?team
// @include        http://pefl.net/?team
// @require       http://www.pefl.ru/js/jquery-1.3.2.min.js
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/dev/firefox/sostav_na_match/main.js';
headID.appendChild(newScript2);