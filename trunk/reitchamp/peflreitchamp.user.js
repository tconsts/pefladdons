// ==UserScript==
// @name           peflreitchamp
// @namespace      pefl
// @description    modification champ reit page
// @include        http://www.pefl.ru/plug.php?p=rating&t=cn2&j=*
// @include        http://pefl.ru/plug.php?p=rating&t=cn2&j=*
// @include        http://www.pefl.net/plug.php?p=rating&t=cn2&j=*
// @include        http://pefl.net/plug.php?p=rating&t=cn2&j=*
// @include        http://www.pefl.org/plug.php?p=rating&t=cn2&j=*
// @include        http://pefl.org/plug.php?p=rating&t=cn2&j=*
// @version			1.1
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/reitchamp/reitchamp.js';
headID.appendChild(newScript2);