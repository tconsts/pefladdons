// ==UserScript==
// @name           pefldivtable
// @namespace      pefl
// @description    division table page (PEFL.ru)
// @include        http://www.pefl.ru/plug.php?p=refl&t=s&k=0&j=*
// @include        http://pefl.ru/plug.php?p=refl&t=s&k=0&j=*
// @include        http://www.pefl.net/plug.php?p=refl&t=s&k=0&j=*
// @include        http://pefl.net/plug.php?p=refl&t=s&k=0&j=*
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'js/jquery-1.3.2.min.js';
headID.appendChild(newScript1);
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://code.google.com/p/pefladdons/source/browse/trunk/divtable/divtable.js';
headID.appendChild(newScript2);