// ==UserScript==
// @name           pefllinksostav
// @namespace      pefl
// @description    add menu link to sostav
// @include        http://*pefl.*/*
// @exclude        http://*pefl.*/profile.php
// @exclude        http://*pefl.*/auth.php
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         

var newScript1 = document.createElement('script');
newScript1.type = 'text/javascript';
newScript1.src = 'http://pefladdons.googlecode.com/svn/trunk/main/main.js';
headID.appendChild(newScript1);