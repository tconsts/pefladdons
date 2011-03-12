// ==UserScript==
// @name           matchStats
// @namespace      pefl
// @description    player Stats (PEFL.ru)
// @include        http://www.pefl.ru/plug.php?p=refl&t=if*
// @include        http://pefl.ru/plug.php?p=refl&t=if*
// @include        http://www.pefl.net/plug.php?p=refl&t=if*
// @include        http://pefl.net/plug.php?p=refl&t=if*

// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'js/jquery-1.3.2.min.js';
headID.appendChild(newScript1);
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/dev/firefox/matchStats/matchStats.user.js';
headID.appendChild(newScript2);