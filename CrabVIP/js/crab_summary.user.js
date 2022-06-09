// ==UserScript==
// @name           teamshistory
// @namespace      pefl
// @description    modification teams history page
// @include        http://*pefl.*/plug.php?p=refl&t=khist&n=*
// @require			crab_funcs_std.js
// @encoding	   windows-1251
// ==/UserScript==

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
	console.log("run summary");

	$('td.back4 table table').each(function(i,val){
		$(val).find('tr:eq(0)').addClass('back2').attr('height','20');
		$(val).find('td:has(hr)').text('-');
		$(val).find('a img').attr('height',15);
	});

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
	const DARK = true;
	const TOURN = {
		max : 0
	};

	// function countGameInfo(gameRaw, tArr) {
	// 	for(let i = 0; i < tArr.length ; i++) {
	// 		tArr[i] += gameRaw[i];
	// 	};
	// }

	// let champ = [].concat(zeroRow);
	// let cup = [].concat(zeroRow);
	// let supercup = [].concat(zeroRow);
	// let sum = [].concat(zeroRow);
	// let frendly = [].concat(zeroRow);
	
	const summaryTotal = [];

	function newSummaryLine(tournName) {
		const line = [].concat(zeroRow);
		line[CUP_TYPE] = tournName;
		return line;
	}

	$('#x0 tr').each(function(i) {
		
		if (i===0) return;
		const scorestring = $(this).find("td:nth-child(2)").text().match(/[0-9]+:[0-9]+/g);
		if (!scorestring) return;

		const cupType = $(this).find("td:nth-child(5)").text().trim();
		if (TOURN[cupType] === undefined) {
			TOURN[cupType] = TOURN.max;
			summaryTotal.push(newSummaryLine(cupType));
			TOURN.max++;
		} 
		
		summaryTotal[TOURN[cupType]][MATCHES]++;

		const teams = $(this).find("td:first-child").text().trim().split(' - ');
		const ahome = teams[0] === home;
		const score = scorestring[0].split(':');

		const scored  = parseInt(ahome ? score[0] : score[1]);
		const missed  = parseInt(ahome ? score[1] : score[0]);
		
		summaryTotal[TOURN[cupType]][SCORED] += scored;
		summaryTotal[TOURN[cupType]][MISSED] += missed;

		if (scored > missed) {
			summaryTotal[TOURN[cupType]][WIN]++;
		} else if (scored < missed) {
			summaryTotal[TOURN[cupType]][LOST]++;
		} else {
			summaryTotal[TOURN[cupType]][DRAW]++;
		};
		 
	});
	console.log(summaryTotal);
	console.log(TOURN);

	function dressUpRow (arr, title, darkback) {
		const row = $("<tr>");
		if (darkback) row.attr("class", 'back2');
		const label = $("<td>"+ title + "</td>");
		label.attr("width", "20%");
		label.attr("style","font-weight:bold");
		row.append(label);		
		for (let i = 0; i < arr.length -1; i++) {
			row.append("<td>"+ arr[i]+ "</td>");
		}
		return row;
	}

	const sumTable = $("<table>");
	sumTable.attr("id", "summary");
	sumTable.attr("font-size", "x-large");
	sumTable.attr("cellpadding", "5px");
	sumTable.attr("cellspacing", "2px");
	sumTable.css("min-width", "400px");

	let frendlies;
	if (TOURN["Товарищеский"]) {
		console.log("eject frendlies", TOURN["Товарищеский"]);
		frendlies = summaryTotal.splice(TOURN["Товарищеский"],1);	
	}
	const totalIndex = summaryTotal.push(newSummaryLine("ВСЕГО")) - 1;

	for (let r = 0; r < summaryTotal.length - 1; r++) {
		for (let c = 0; c < summaryTotal[r].length - 1; c++) {
			summaryTotal[totalIndex][c] += summaryTotal[r][c];
		}
	}

	const titles = $("<tr>");
	titles.attr("style","font-weight:bold; font-size:normal");
	titles.attr("font-size","normal");
	titles.append($("<td> </td><td>Игр</td><td>Выг</td><td>Нич</td><td>Пор</td><td>ГлЗ</td><td>ГлП</td>"));
	sumTable.append(titles);

	for (r = 0; r < summaryTotal.length; r++) {
		sumTable.append(dressUpRow(summaryTotal[r], summaryTotal[r][CUP_TYPE], r % 2 === 0 ? DARK : false) );
	}

	if (TOURN["Товарищеский"])	{
		sumTable.append(dressUpRow(frendlies[0], "Товарищеский", false) );
	}

	$("td.back4 > table").after(sumTable);
	$('#summary').after('<p>* - игры официальных товарищеских турниров учитываются как игры Кубков, по техничеcким причинам</p>');
})