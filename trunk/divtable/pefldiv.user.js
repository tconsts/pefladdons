// ==UserScript==
// @name           pefldiv
// @namespace      pefl
// @description    division table page modification
// @include        http://*pefl.*/plug.php?p=refl&t=s&*
// @version        2.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/divtable/div.js';
headID.appendChild(newScript2);