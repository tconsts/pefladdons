// ==UserScript==
// @name			peflmail
// @namespace		pefl
// @description		mail page modification
// @include			http://*pefl.*/pm.php
// @include			http://*pefl.*/pm.php?filter=*
// @include			http://*pefl.*/pm.php?m=send*
// @version        1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/mail/mail.js';
headID.appendChild(newScript2);