// ==UserScript==
// @name           peflsostav
// @namespace      pefl
// @description    Display sostav
// @include        http://pefl.ru/pfs.php?sostav
// @include        http://www.pefl.ru/pfs.php?sostav
// @include        http://pefl.net/pfs.php?sostav
// @include        http://www.pefl.net/pfs.php?sostav
// @include        http://pefl.org/pfs.php?sostav
// @include        http://www.pefl.org/pfs.php?sostav
// @version			1.1
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/sostav/sostav.js';
headID.appendChild(newScript2);