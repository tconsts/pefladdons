// ==UserScript==
// @name           peflplayer
// @namespace      pefl
// @description    modification player page (PEFL.ru and .net) and school boys
// @include        http://www.pefl.ru/plug.php?p=refl&t=p*
// @include        http://www.pefl.ru/plug.php?p=refl&t=yp*
// @include        http://pefl.ru/plug.php?p=refl&t=p*
// @include        http://pefl.ru/plug.php?p=refl&t=yp*
// @include        http://www.pefl.net/plug.php?p=refl&t=p*
// @include        http://www.pefl.net/plug.php?p=refl&t=yp*
// @include        http://pefl.net/plug.php?p=refl&t=p*
// @include        http://pefl.net/plug.php?p=refl&t=yp*

// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'js/jquery-1.3.2.min.js';
headID.appendChild(newScript1);
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/player/player.js';
headID.appendChild(newScript2);