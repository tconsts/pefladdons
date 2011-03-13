// ==UserScript==
// @name			peflnenuj
// @namespace		pefl
// @description		modification nenuj pages (PEFL.ru)
// @include			http://www.pefl.ru/plug.php?p=tr&t=ctrn&j=*
// @include			http://www.pefl.ru/nenuj.php*
// @include			http://pefl.ru/plug.php?p=tr&t=ctrn&j=*
// @include			http://pefl.ru/nenuj.php*
// @include			http://www.pefl.org/plug.php?p=tr&t=ctrn&j=*
// @include			http://www.pefl.org/nenuj.php*
// @include			http://pefl.org/plug.php?p=tr&t=ctrn&j=*
// @include			http://pefl.org/nenuj.php*
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'js/jquery-1.3.2.min.js';
headID.appendChild(newScript1);
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/nenuj/nenuj.js';
headID.appendChild(newScript2);