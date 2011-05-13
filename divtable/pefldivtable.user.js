// ==UserScript==
// @name           pefldivtable
// @namespace      pefl
// @description    division table page modification
// @include        http://www.pefl.ru/plug.php?p=refl&t=s&*
// @include        http://pefl.ru/plug.php?p=refl&t=s&*
// @include        http://www.pefl.net/plug.php?p=refl&t=s&*
// @include        http://pefl.net/plug.php?p=refl&t=s&*
// @include        http://www.pefl.org/plug.php?p=refl&t=s&*
// @include        http://pefl.org/plug.php?p=refl&t=s&*
// @version			1.1
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/divtable/divtable.js';
headID.appendChild(newScript2);