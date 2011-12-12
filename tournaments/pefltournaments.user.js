// ==UserScript==
// @name           peflturnaments
// @namespace      pefl
// @description    pefl turnaments page modification
// @include        http://*pefl.*/plug.php?p=refl&t=cup&j=*
// @include        http://*pefl.*/plug.php?p=refl&t=ec&j=*
// @include        http://*pefl.*/plug.php?p=refl&t=t&j=*
// @include        http://*pefl.*/plug.php?p=refl&t=f&j=*
// @version        1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/tournaments/tournaments.js';
headID.appendChild(newScript2);