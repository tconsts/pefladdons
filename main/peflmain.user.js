// ==UserScript==
// @name           peflmain
// @namespace      pefl
// @description    modify site
// @include        http://*pefl.*/*
// @exclude        http://*pefl.*/profile.php
// @exclude        http://*pefl.*/auth.php
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         

var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'http://pefladdons.googlecode.com/svn/trunk/main/main.js';
headID.appendChild(newScript1);

var url1 = location.pathname.substring(1)
var url2 = location.search.substring(1)

if(url1=='pm.php'){
	var newScriptMail = document.createElement('script');
	newScriptMail.type = 'text/javascript';
	newScriptMail.src = 'http://pefladdons.googlecode.com/svn/trunk/mail/mail.js';
	headID.appendChild(newScriptMail);
}