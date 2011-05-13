// ==UserScript==
// @name           peflplayer
// @namespace      pefl
// @description    modification player page and school boys
// @include        http://www.pefl.ru/plug.php?p=refl&t=p*
// @include        http://www.pefl.ru/plug.php?p=refl&t=yp*
// @include        http://pefl.ru/plug.php?p=refl&t=p*
// @include        http://pefl.ru/plug.php?p=refl&t=yp*
// @include        http://www.pefl.net/plug.php?p=refl&t=p*
// @include        http://www.pefl.net/plug.php?p=refl&t=yp*
// @include        http://pefl.net/plug.php?p=refl&t=p*
// @include        http://pefl.net/plug.php?p=refl&t=yp*
// @include        http://www.pefl.org/plug.php?p=refl&t=p*
// @include        http://www.pefl.org/plug.php?p=refl&t=yp*
// @include        http://pefl.org/plug.php?p=refl&t=p*
// @include        http://pefl.org/plug.php?p=refl&t=yp*
// @version			1.1
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/player/player_ie.js';
headID.appendChild(newScript2);