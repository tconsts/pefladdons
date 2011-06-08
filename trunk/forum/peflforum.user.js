// ==UserScript==
// @name           peflforum
// @namespace      pefl
// @description    remove not needed info from forum
// @include        http://www.pefl.ru/forums.php?m=posts*
// @include        http://pefl.ru/forums.php?m=posts*
// @include        http://www.pefl.net/forums.php?m=posts*
// @include        http://pefl.net/forums.php?m=posts*
// @include        http://www.pefl.org/forums.php?m=posts*
// @include        http://pefl.org/forums.php?m=posts*
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript2 = document.createElement('script');
newScript2.type = 'text/javascript';
newScript2.src = 'http://pefladdons.googlecode.com/svn/trunk/forum/forum.js';
headID.appendChild(newScript2);