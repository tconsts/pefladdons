// ==UserScript==
// @name           pefltraining
// @namespace      pefl
// @description    modification training page (PEFL.ru)
// @include        http://www.pefl.ru/plug.php?p=training*
// @include        http://pefl.ru/plug.php?p=training*
// @include        http://pefl.net/plug.php?p=training*
// @include        http://www.pefl.net/plug.php?p=training*
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];
var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'http://pefladdons.googlecode.com/svn/trunk/sostav/tmp.js';

headID.appendChild(newScript1);