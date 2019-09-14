// ==UserScript==
// @name           peflschedule
// @namespace      pefl
// @description    modification schedule page
// @include        http://*pefl.*/plug.php?p=refl&t=khist&n=*
// @encoding	   windows-1251
// ==/UserScript==

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) { if (pf[n].split('=')[0] == key) return pf[n].split('=')[1]; }
	return false
}

if( typeof Array.prototype.push==='undefined' ) {
	Array.prototype.push = function() {
	 for( var i = 0, b = this.length, a = arguments, l = a.length; i<l; i++ ) {
	  this[b+i] = a[i];
	 }
	 return this.length;
	};
   }

var matches = [];
$().ready(function() {
	// if(parseInt(localStorage.myteamid)==parseInt(UrlValue('j'))) showMatches();
	console.log("run summary");
	const homeID = UrlValue('n');
	const awayID = UrlValue('j');

	const team1 = $('#x0 tr:nth-child(2) > td:nth-child(1) > a:nth-child(1)');
	const team2 = $('#x0 tr:nth-child(2) > td:nth-child(1) > a:nth-child(2)');

	let home = '';
	let away = '';

	if (UrlValue('j', team1.attr("href")) == homeID ) {
		home = team1.text(); away = team2.text();
	} else {
		home = team2.text(); away = team1.text();
	}
	console.log(homeID, home, awayID, away);
	const sumrow = {win: 0, draw:0, lost:0, scored:0, missed:0};
	const zeroRow = [0, 0, 0, 0, 0, 0];
	const MATCHES = 0;
	const WIN = 1;
	const DRAW = 2;
	const LOST = 3;
	const SCORED = 4;
	const MISSED = 5;
	const CUP_TYPE = 6;

	function countGameInfo(gameRaw, tArr) {

		for(let i = 0; i < tArr.length ; i++) {
			tArr[i] += gameRaw[i];
		};
		// console.log(gameRaw, tArr);
		// return tArr;
	}

	let champ = [].concat(zeroRow);
	let cup = [].concat(zeroRow);
	let supercup = [].concat(zeroRow);
	let sum = [].concat(zeroRow);
	let frendly = [].concat(zeroRow);
// debugger;

	$('#x0 tr').each(function(i) {
		
		if (i===0) return;
		const scorestring = $(this).find("td:nth-child(2)").text().match(/[0-9]+:[0-9]+/g);
		if (!scorestring) return;

		const cupType = $(this).find("td:nth-child(5)").text().trim();
		const teams = $(this).find("td:first-child").text().trim().split(' - ');
		const ahome = teams[0] === home;
		const score = scorestring[0].split(':');

		const scored  = parseInt(ahome ? score[0] : score[1]);
		const missed  = parseInt(ahome ? score[1] : score[0]);
		let win, lost, draw;

		if (scored > missed) {
			win= 1; lost = 0; draw = 0;
		} else if (scored < missed) {
			win = 0; lost = 1; draw = 0;
		} else {
			win = 0; lost = 0; draw = 1;
		};

		const rlt = [win + draw + lost, win, draw, lost, scored, missed, cupType];
		if ( cupType == 'Чемпионат' ) { 
			countGameInfo(rlt, champ);
		} else if (cupType === "Кубок") {
			countGameInfo(rlt, cup);
		} else if (cupType === "Товарищеский") {
			countGameInfo(rlt, frendly);
		} else if (cupType === "Суперкубок") {
			countGameInfo(rlt, supercup);
		}
	// if (i<20) console.log(i, teams, score, scorestring, rlt);
		 
	});
	
	const summary = {champ: champ,
		cup: cup,
		supercup:supercup,
		sum:sum,
		frendly:frendly,
	}

	
	console.log(summary);

})