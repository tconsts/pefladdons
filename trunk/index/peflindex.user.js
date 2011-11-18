// ==UserScript==
// @name			peflindex
// @namespace		pefl
// @description		index.php
// @include			http://*pefl.*/index.php
// @include			http://*pefl.*/
// @version		    1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'http://pefladdons.googlecode.com/svn/trunk/index/index.js';
headID.appendChild(newScript);