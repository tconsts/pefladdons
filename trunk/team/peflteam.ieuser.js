// ==UserScript==
// @name           peflteam
// @namespace      pefl
// @description    roster team page modification
// @include        http://www.pefl.ru/plug.php?p=refl&t=k&j=*
// @include        http://pefl.ru/plug.php?p=refl&t=k&j=*
// @include        http://www.pefl.net/plug.php?p=refl&t=k&j=*
// @include        http://pefl.net/plug.php?p=refl&t=k&j=*
// @include        http://www.pefl.org/plug.php?p=refl&t=k&j=*
// @include        http://pefl.org/plug.php?p=refl&t=k&j=*
// @version			1.1
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/team/ie/team.js';
headID.appendChild(newScript2);