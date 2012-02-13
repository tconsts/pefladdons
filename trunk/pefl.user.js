// ==UserScript==
// @name           peflmain
// @namespace      pefl
// @description    modify site
// @include        http://*pefl.*/*
// @exclude        http://*pefl.*/profile.php
// @exclude        http://*pefl.*/auth.php
// @version        1.1
// @author         const
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         

// Show always
var newScriptMenu = document.createElement('script');
newScriptMenu.type = 'text/javascript';
newScriptMenu.src = 'http://pefladdons.googlecode.com/svn/trunk/peflmenu.js';
headID.appendChild(newScriptMenu);

var url1 = location.pathname.substring(1)
var url2 = location.search.substring(1)

var scflag = '0:0:0:0:0:0:0:0:0:0:0:1:1:0:0:0:0:0:0:0:1:0'.split(':')
if(localStorage.scripts!=undefined && localStorage.scripts!=null) scflag = localStorage.scripts.split(':')

// 0 Settings
if(url2=='settings'){
	var newScriptSettings = document.createElement('script');
	newScriptSettings.type = 'text/javascript';
	newScriptSettings.src = 'http://pefladdons.googlecode.com/svn/trunk/peflsettings.js';
	headID.appendChild(newScriptSettings);
}
// 1 Sostav
if(scflag[1]==0 && url2=='sostav'){
	var newScriptSostav = document.createElement('script');
	newScriptSostav.type = 'text/javascript';
	newScriptSostav.src = 'http://pefladdons.googlecode.com/svn/trunk/peflsostav.js';
	headID.appendChild(newScriptSostav);
}
// 2 Player
if(scflag[2]==0 && (url2.indexOf('p=refl&t=p')!=-1 || url2.indexOf('p=refl&t=yp')!=-1)){
	var newScriptPlayer = document.createElement('script');
	newScriptPlayer.type = 'text/javascript';
	newScriptPlayer.src = 'http://pefladdons.googlecode.com/svn/trunk/peflplayer.js';
	headID.appendChild(newScriptPlayer);
}
//3 Contracts
if(scflag[3]==0 && (url2.indexOf('p=fin&t=ctr&')!=-1 || url2.indexOf('p=tr&')!=-1)){
	var newScriptContract = document.createElement('script');
	newScriptContract.type = 'text/javascript';
	newScriptContract.src = 'http://pefladdons.googlecode.com/svn/trunk/peflcontracts.js';
	headID.appendChild(newScriptContract);
}
// 4 Team
if(scflag[4]==0 && url2.indexOf('p=refl&t=k&j=')!=-1){
	var newScriptTeam= document.createElement('script');
	newScriptTeam.type = 'text/javascript';
	newScriptTeam.src = 'http://pefladdons.googlecode.com/svn/trunk/peflteam.js';
	headID.appendChild(newScriptTeam);
}
//  5 DivTable
if(scflag[5]==0 && url2.indexOf('p=refl&t=s&k=')!=-1){
	var newScriptDiv = document.createElement('script');
	newScriptDiv.type = 'text/javascript';
	newScriptDiv.src = 'http://pefladdons.googlecode.com/svn/trunk/pefldivtable.js';
	headID.appendChild(newScriptDiv);
}
//  6 ReitChamps
if(scflag[6]==0 && url2.indexOf('p=rating&t=cn2&j=')!=-1){
	var newScriptReitCh = document.createElement('script');
	newScriptReitCh.type = 'text/javascript';
	newScriptReitCh.src = 'http://pefladdons.googlecode.com/svn/trunk/peflreitchamp.js';
	headID.appendChild(newScriptReitCh);
}
//  7 Shedule
if(scflag[7]==0 && url2.indexOf('p=refl&t=last&j=')!=-1){
	var newScriptShedule = document.createElement('script');
	newScriptShedule.type = 'text/javascript';
	newScriptShedule.src = 'http://pefladdons.googlecode.com/svn/trunk/peflshedule.js';
	headID.appendChild(newScriptShedule);
}
//  8 Finance
if(scflag[8]==0 && (url2.indexOf('p=fin&z=')!=-1 || url2.indexOf('p=rules&z=')!=-1)){
	var newScriptFin = document.createElement('script');
	newScriptFin.type = 'text/javascript';
	newScriptFin.src = 'http://pefladdons.googlecode.com/svn/trunk/peflfinance.js';
	headID.appendChild(newScriptFin);
}
//  9 SostavNaMatch
if(scflag[9]==0 && url2=='team'){
	var newScriptTeamC = document.createElement('script');
	newScriptTeamC.type = 'text/javascript';
	newScriptTeamC.src = 'http://pefladdons.googlecode.com/svn/trunk/peflsostavnamatch.js';
	headID.appendChild(newScriptTeamC);
}
if(scflag[9]==0 && url2=='team_n'){
	var newScriptTeamN = document.createElement('script');
	newScriptTeamN.type = 'text/javascript';
	newScriptTeamN.src = 'http://pefladdons.googlecode.com/svn/trunk/peflsostavnamatch_n.js';
	headID.appendChild(newScriptTeamN);
}
// 10 ReitSchool
if(scflag[10]==0 && url2.indexOf('p=rating&t=s&n=')!=-1){
	var newScriptReitSch = document.createElement('script');
	newScriptReitSch.type = 'text/javascript';
	newScriptReitSch.src = 'http://pefladdons.googlecode.com/svn/trunk/peflreitschool.js';
	headID.appendChild(newScriptReitSch);
}
// 11 NN (removed)
// 12 History
if(scflag[12]==0 && url1=='hist.php'){
	var newScriptHist = document.createElement('script');
	newScriptHist.type = 'text/javascript';
	newScriptHist.src = 'http://pefladdons.googlecode.com/svn/trunk/peflhist.js';
	headID.appendChild(newScriptHist);
}
// 13 Doverie
if(scflag[13]==0 && url2.indexOf('&t=dov&')!=-1){
	var newScriptDov = document.createElement('script');
	newScriptDov.type = 'text/javascript';
	newScriptDov.src = 'http://pefladdons.googlecode.com/svn/trunk/pefldoverie.js';
	headID.appendChild(newScriptDov);
}
// 14 Match
if(scflag[14]==0 && (url2.indexOf('&t=if&')!=-1 || url2.indexOf('&t=code&')!=-1)){
	var newScriptMatch = document.createElement('script');
	newScriptMatch.type = 'text/javascript';
	newScriptMatch.src = 'http://pefladdons.googlecode.com/svn/trunk/peflmatch.js';
	headID.appendChild(newScriptMatch);
}
// 15 Index
if(scflag[15]==0 && (url1=='index.php' || (url1=='' && url2==''))){
	var newScriptIndex = document.createElement('script');
	newScriptIndex.type = 'text/javascript';
	newScriptIndex.src = 'http://pefladdons.googlecode.com/svn/trunk/peflindex.js';
	headID.appendChild(newScriptIndex);
}
// 16 Mail
if(scflag[16]==0 && url1=='pm.php'){
	var newScriptMail = document.createElement('script');
	newScriptMail.type = 'text/javascript';
	newScriptMail.src = 'http://pefladdons.googlecode.com/svn/trunk/peflmail.js';
	headID.appendChild(newScriptMail);
}
// 17 Training
if(scflag[17]==0 && (url2.indexOf('p=training')!=-1 || url2.indexOf('p=trainplan')!=-1)){
	var newScriptTrain = document.createElement('script');
	newScriptTrain.type = 'text/javascript';
	newScriptTrain.src = 'http://pefladdons.googlecode.com/svn/trunk/pefltraining.js';
	headID.appendChild(newScriptTrain);
}
// 18 Tournaments
if(scflag[18]==0 && (url2.indexOf('p=refl&t=cup&j=')!=-1 || url2.indexOf('p=refl&t=ec&j=')!=-1 || url2.indexOf('p=refl&t=t&j=')!=-1 || url2.indexOf('p=refl&t=f&j=')!=-1)){
	var newScriptTours= document.createElement('script');
	newScriptTours.type = 'text/javascript';
	newScriptTours.src = 'http://pefladdons.googlecode.com/svn/trunk/pefltournaments.js';
	headID.appendChild(newScriptTours);
}
// 19 Calendar
if(scflag[19]==0 && url2.indexOf('p=calendar&')!=-1){
	var newScriptCal = document.createElement('script');
	newScriptCal.type = 'text/javascript';
	newScriptCal.src = 'http://pefladdons.googlecode.com/svn/trunk/peflcalendar.js';
	headID.appendChild(newScriptCal);
}
// 20 Forum
if(scflag[20]==0 && url1=='forums.php' && url2.indexOf('m=posts')!=-1){
	var newScriptForum = document.createElement('script');
	newScriptForum.type = 'text/javascript';
	newScriptForum.src = 'http://pefladdons.googlecode.com/svn/trunk/peflforum.js';
	headID.appendChild(newScriptForum);
}
// 21 referee
if(scflag[21]==0 && url2.indexOf('t=ref&')!=-1){
	var newScriptRef = document.createElement('script');
	newScriptRef.type = 'text/javascript';
	newScriptRef.src = 'http://pefladdons.googlecode.com/svn/trunk/peflref.js';
	headID.appendChild(newScriptRef);
}
