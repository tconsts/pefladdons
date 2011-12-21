// ==UserScript==
// @name           peflcalendar
// @namespace      pefl
// @description    Shows current day in border
// @include        http://*pefl.*/plug.php?p=calendar&*
// @version        1.0
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScriptCal = document.createElement('script');
newScriptCal.type = 'text/javascript';
newScriptCal.src = 'http://pefladdons.googlecode.com/svn/trunk/calendar/calendar.js';
headID.appendChild(newScriptCal);