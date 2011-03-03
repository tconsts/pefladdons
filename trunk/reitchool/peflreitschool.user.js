// ==UserScript==
// @name           peflreitschool
// @namespace      pefl
// @description    school reit page modification (PEFL.ru and .net)
// @include        http://www.pefl.ru/plug.php?p=rating&t=s&n=*
// @include        http://www.pefl.net/plug.php?p=rating&t=s&n=*
// @include        http://pefl.ru/plug.php?p=rating&t=s&n=*
// @include        http://pefl.net/plug.php?p=rating&t=s&n=*
// @require        http://www.pefl.ru/js/jquery-1.3.2.min.js
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'http://pefladdons.googlecode.com/svn/trunk/reitschool/reitschool.js';
headID.appendChild(newScript);