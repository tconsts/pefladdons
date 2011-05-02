// ==UserScript==
// @name           peflhist
// @namespace      pefl
// @description    history page modification (PEFL)
// @include        http://pefl.ru/hist.php?id=*&t=*
// @include        http://www.pefl.ru/hist.php?id=*&t=*
// @include        http://pefl.net/hist.php?id=*&t=*
// @include        http://www.pefl.net/hist.php?id=*&t=*
// @include        http://pefl.org/hist.php?id=*&t=*
// @include        http://www.pefl.org/hist.php?id=*&t=*
// @version			1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'http://pefladdons.googlecode.com/svn/trunk/hist/hist.js';
headID.appendChild(newScript);