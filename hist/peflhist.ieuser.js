// ==UserScript==
// @name           peflhist
// @namespace      pefl
// @description    history page modification
// @include        http://*pefl.*/hist.php?*
// @version			1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'http://pefladdons.googlecode.com/svn/trunk/peflhist.js';
headID.appendChild(newScript);