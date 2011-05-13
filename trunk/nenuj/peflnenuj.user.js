// ==UserScript==
// @name			peflnenuj
// @namespace		pefl
// @description		modification nenuj pages
// @include			http://www.pefl.ru/plug.php?p=tr&t=ctrn&j=*
// @include			http://www.pefl.ru/nenuj.php*
// @include			http://pefl.ru/plug.php?p=tr&t=ctrn&j=*
// @include			http://pefl.ru/nenuj.php*
// @include			http://www.pefl.net/plug.php?p=tr&t=ctrn&j=*
// @include			http://www.pefl.net/nenuj.php*
// @include			http://pefl.net/plug.php?p=tr&t=ctrn&j=*
// @include			http://pefl.net/nenuj.php*
// @include			http://www.pefl.org/plug.php?p=tr&t=ctrn&j=*
// @include			http://www.pefl.org/nenuj.php*
// @include			http://pefl.org/plug.php?p=tr&t=ctrn&j=*
// @include			http://pefl.org/nenuj.php*
// @version			1.1
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/nenuj/nenuj.js';
headID.appendChild(newScript2);