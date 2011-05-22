// ==UserScript==
// @name           peflfinance
// @namespace      pefl
// @description    finance page modification
// @include			http://www.pefl.ru/plug.php?p=fin&z=*
// @include			http://www.pefl.ru/plug.php?p=rules&z=*
// @include			http://pefl.ru/plug.php?p=fin&z=*
// @include			http://pefl.ru/plug.php?p=rules&z=*
// @include			http://www.pefl.net/plug.php?p=fin&z=*
// @include			http://www.pefl.net/plug.php?p=rules&z=*
// @include			http://pefl.net/plug.php?p=fin&z=*
// @include			http://pefl.net/plug.php?p=rules&z=*
// @include			http://www.pefl.org/plug.php?p=fin&z=*
// @include			http://www.pefl.org/plug.php?p=rules&z=*
// @include			http://pefl.org/plug.php?p=fin&z=*
// @include			http://pefl.org/plug.php?p=rules&z=*
// @version			1.2
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/finance/ie/finance.js';
headID.appendChild(newScript2);