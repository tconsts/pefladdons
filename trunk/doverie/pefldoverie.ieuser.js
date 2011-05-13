// ==UserScript==
// @name           pefldov
// @namespace      pefl
// @description    modification credit page
// @include        http://www.pefl.ru/plug.php?p=refl&t=dov&*
// @include        http://pefl.ru/plug.php?p=refl&t=dov&*
// @include        http://www.pefl.net/plug.php?p=refl&t=dov&*
// @include        http://pefl.net/plug.php?p=refl&t=dov&*
// @include        http://www.pefl.org/plug.php?p=refl&t=dov&*
// @include        http://pefl.org/plug.php?p=refl&t=dov&*
// @version			1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/doverie/doverie_ie.js';
headID.appendChild(newScript2);