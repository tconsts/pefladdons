// ==UserScript==
// @name           peflmatch
// @namespace      pefl
// @description    match page modification (PEFL.ru and .net)
// @include        http://www.pefl.ru/plug.php?p=refl&t=if&*
// @include        http://www.pefl.ru/plug.php?p=refl&t=code&*
// @include        http://pefl.ru/plug.php?p=refl&t=if&*
// @include        http://pefl.ru/plug.php?p=refl&t=code&*
// @include        http://www.pefl.net/plug.php?p=refl&t=if&*
// @include        http://www.pefl.net/plug.php?p=refl&t=code&*
// @include        http://pefl.net/plug.php?p=refl&t=if&*
// @include        http://pefl.net/plug.php?p=refl&t=code&*
// @version			1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/match/match.js';
headID.appendChild(newScript2);