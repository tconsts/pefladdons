// ==UserScript==
// @name           peflcontracts
// @namespace      pefl
// @description    contracts page modification (PEFL.ru and .net)
// @include        http://www.pefl.ru/plug.php?p=fin&t=ctr&*
// @include        http://pefl.ru/plug.php?p=fin&t=ctr&*
// @include        http://www.pefl.net/plug.php?p=fin&t=ctr&*
// @include        http://pefl.net/plug.php?p=fin&t=ctr&*
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'js/jquery-1.3.2.min.js';
headID.appendChild(newScript1);
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/contracts/firefox/contracts.js';
headID.appendChild(newScript2);