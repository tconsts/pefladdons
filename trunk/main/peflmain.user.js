// ==UserScript==
// @name           peflmain
// @namespace      pefl
// @description    modify site
// @include        http://*pefl.*/*
// @exclude        http://*pefl.*/profile.php
// @exclude        http://*pefl.*/auth.php
// @require        http://pefl.ru/js/jquery-1.3.2.min.js
// @version        1.0
// @author         const
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
if(url1=='index.php'|| (url1=='' && url2=='')){
	var newScriptIndex = document.createElement('script');
	newScriptIndex.type = 'text/javascript';
	newScriptIndex.src = 'http://pefladdons.googlecode.com/svn/trunk/index/index.js';
	headID.appendChild(newScriptIndex);
}
if(url2.indexOf('&t=dov&')!=-1){
	var newScriptDov = document.createElement('script');
	newScriptDov.type = 'text/javascript';
	newScriptDov.src = 'http://pefladdons.googlecode.com/svn/trunk/doverie/doverie.js';
	headID.appendChild(newScriptDov);
}
if(url2.indexOf('p=calendar&')!=-1){
	var newScriptCal = document.createElement('script');
	newScriptCal.type = 'text/javascript';
	newScriptCal.src = 'http://pefladdons.googlecode.com/svn/trunk/calendar/calendar.js';
	headID.appendChild(newScriptCal);
}
if(url2.indexOf('p=fin&t=ctr&')!=-1){
	var newScriptContract = document.createElement('script');
	newScriptContract.type = 'text/javascript';
	newScriptContract.src = 'http://pefladdons.googlecode.com/svn/trunk/contracts/firefox/contracts.js';
	headID.appendChild(newScriptContract);
}
if(url2.indexOf('p=refl&t=s&k=')!=-1){
	var newScriptDiv = document.createElement('script');
	newScriptDiv.type = 'text/javascript';
	newScriptDiv.src = 'http://pefladdons.googlecode.com/svn/trunk/divtable/div.js';
	headID.appendChild(newScriptDiv);
}
if(url2.indexOf('p=fin&z=')!=-1){
	var newScriptFin = document.createElement('script');
	newScriptFin.type = 'text/javascript';
	newScriptFin.src = 'http://pefladdons.googlecode.com/svn/trunk/finance/finance.js';
	headID.appendChild(newScriptFin);
}
if(url2.indexOf('p=rules&z=')!=-1){
	var newScriptRul = document.createElement('script');
	newScriptRul.type = 'text/javascript';
	newScriptRul.src = 'http://pefladdons.googlecode.com/svn/trunk/finance/finance.js';
	headID.appendChild(newScriptRul);
}
if(url2.indexOf('&t=if&')!=-1 || url2.indexOf('&t=code&')!=-1){
	var newScriptMatch = document.createElement('script');
	newScriptMatch.type = 'text/javascript';
	newScriptMatch.src = 'http://pefladdons.googlecode.com/svn/trunk/match/match.js';
	headID.appendChild(newScriptMatch);
}
if(url2.indexOf('p=refl&t=p')!=-1 || url2.indexOf('p=refl&t=yp')!=-1){
	var newScriptPlayer = document.createElement('script');
	newScriptPlayer.type = 'text/javascript';
	newScriptPlayer.src = 'http://pefladdons.googlecode.com/svn/trunk/player/player.js';
	headID.appendChild(newScriptPlayer);
}
if(url2.indexOf('p=rating&t=cn2&j=')!=-1){
	var newScriptReitCh = document.createElement('script');
	newScriptReitCh.type = 'text/javascript';
	newScriptReitCh.src = 'http://pefladdons.googlecode.com/svn/trunk/reitchamp/reitchamp.js';
	headID.appendChild(newScriptReitCh);
}
if(url2.indexOf('p=rating&t=s&n=')!=-1){
	var newScriptReitSch = document.createElement('script');
	newScriptReitSch.type = 'text/javascript';
	newScriptReitSch.src = 'http://pefladdons.googlecode.com/svn/trunk/reitschool/reitschool.js';
	headID.appendChild(newScriptReitSch);
}
if(url2.indexOf('p=refl&t=last&j=')!=-1){
	var newScriptShedule = document.createElement('script');
	newScriptShedule.type = 'text/javascript';
	newScriptShedule.src = 'http://pefladdons.googlecode.com/svn/trunk/shedule/shedule.js';
	headID.appendChild(newScriptShedule);
}
if(url2=='sostav'){
	var newScriptSostav = document.createElement('script');
	newScriptSostav.type = 'text/javascript';
	newScriptSostav.src = 'http://pefladdons.googlecode.com/svn/trunk/sostav/sostav.js';
	headID.appendChild(newScriptSostav);
}
if(url2=='team'){
	var newScriptTeamC = document.createElement('script');
	newScriptTeamC.type = 'text/javascript';
	newScriptTeamC.src = 'http://pefladdons.googlecode.com/svn/trunk/sostav_na_match/firefox/main.js';
	headID.appendChild(newScriptTeamC);
}
if(url2=='team_n'){
	var newScriptTeamN = document.createElement('script');
	newScriptTeamN.type = 'text/javascript';
	newScriptTeamN.src = 'http://pefladdons.googlecode.com/svn/trunk/sostav_na_match/firefox/main_n.js';
	headID.appendChild(newScriptTeamN);
}
if(url2.indexOf('p=refl&t=k&j=')!=-1){
	var newScriptTeam= document.createElement('script');
	newScriptTeam.type = 'text/javascript';
	newScriptTeam.src = 'http://pefladdons.googlecode.com/svn/trunk/team/team.js';
	headID.appendChild(newScriptTeam);
}
if(url2.indexOf('p=training')!=-1){
	var newScriptTrain = document.createElement('script');
	newScriptTrain.type = 'text/javascript';
	newScriptTrain.src = 'http://pefladdons.googlecode.com/svn/trunk/training/training.js';
	headID.appendChild(newScriptTrain);
}