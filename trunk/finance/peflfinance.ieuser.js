// ==UserScript==
// @name           peflfinance
// @namespace      pefl
// @description    finance page modification (PEFL.ru and .net)
// @include        http://www.pefl.ru/plug.php?p=fin&z=*
// @include        http://pefl.ru/plug.php?p=fin&z=*
// @include        http://www.pefl.net/plug.php?p=fin&z=*
// @include        http://pefl.net/plug.php?p=fin&z=*
// @version			1.1
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/finance/ie/finance.js';
headID.appendChild(newScript2);