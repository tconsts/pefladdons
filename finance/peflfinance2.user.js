// ==UserScript==
// @name           peflfinance
// @namespace      pefl
// @description    finance page modification
// @include			http://*pefl.*/plug.php?p=fin&z=*
// @include			http://*pefl.*/plug.php?p=rules&z=*
// @version			2.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/finance/finance.js';
headID.appendChild(newScript2);