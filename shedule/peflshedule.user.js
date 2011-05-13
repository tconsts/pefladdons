// ==UserScript==
// @name           peflshedule
// @namespace      pefl
// @description    modification shedule page
// @include        http://www.pefl.ru/plug.php?p=refl&t=last&j=*
// @include        http://pefl.ru/plug.php?p=refl&t=last&j=*
// @include        http://www.pefl.net/plug.php?p=refl&t=last&j=*
// @include        http://pefl.net/plug.php?p=refl&t=last&j=*
// @include        http://www.pefl.org/plug.php?p=refl&t=last&j=*
// @include        http://pefl.org/plug.php?p=refl&t=last&j=*
// @version			1.1

// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/shedule/shedule.js';
headID.appendChild(newScript2);