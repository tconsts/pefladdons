// ==UserScript==
// @name           peflcontracts
// @namespace      pefl
// @description    contracts page modification
// @include        http://www.pefl.ru/plug.php?p=fin&t=ctr&*
// @include        http://pefl.ru/plug.php?p=fin&t=ctr&*
// @include        http://www.pefl.net/plug.php?p=fin&t=ctr&*
// @include        http://pefl.net/plug.php?p=fin&t=ctr&*
// @include        http://www.pefl.org/plug.php?p=fin&t=ctr&*
// @include        http://pefl.org/plug.php?p=fin&t=ctr&*
// @version			1.1
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/contracts/firefox/contracts.js';
headID.appendChild(newScript2);