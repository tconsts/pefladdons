// ==UserScript==
// @name           peflsostav
// @namespace      pefl
// @description    Display sostav
// @include        http://pefl.ru/pfs.php?sostav
// @include        http://www.pefl.ru/pfs.php?sostav
// @include        http://pefl.net/pfs.php?sostav
// @include        http://www.pefl.net/pfs.php?sostav
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'js/jquery-1.3.2.min.js';
headID.appendChild(newScript1);
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/sostav/sostav.js';
headID.appendChild(newScript2);