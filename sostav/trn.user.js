// ==UserScript==
// @name           pefltraining
// @namespace      pefl
// @description    modification training page
// @include        http:/*pefl.*/plug.php?p=training*
// @version        2.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];
var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'http://pefladdons.googlecode.com/svn/trunk/sostav/tmp.js';

headID.appendChild(newScript1);