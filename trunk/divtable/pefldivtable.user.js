// ==UserScript==
// @name           pefldivtable
// @namespace      pefl
// @description    division table page modification (PEFL.ru and .net)
// @include        http://www.pefl.ru/plug.php?p=refl&t=s&*
// @include        http://pefl.ru/plug.php?p=refl&t=s&*
// @include        http://www.pefl.net/plug.php?p=refl&t=s&*
// @include        http://pefl.net/plug.php?p=refl&t=s&*
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'js/jquery-1.3.2.min.js';
headID.appendChild(newScript1);
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/divtable/divtable.js';
headID.appendChild(newScript2);