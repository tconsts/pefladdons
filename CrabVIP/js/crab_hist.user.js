// ==UserScript==
// @name           peflhist
// @namespace      pefl
// @description    history page modification
// @include        http://*pefl.*/hist.php?*
// @encoding	   windows-1251
// ==/UserScript==

function replaceOneChar(s,c,n){
var re = new RegExp('^(.{'+ --n +'}).(.*)$','');
return s.replace(re,'$1'+c+'$2');
};

// Array.push() - Add an element to the end of an array, return the new length
if( typeof Array.prototype.push==='undefined' ) {
 Array.prototype.push = function() {
  for( var i = 0, b = this.length, a = arguments, l = a.length; i<l; i++ ) {
   this[b+i] = a[i];
  }
  return this.length;
 };
}


var type = UrlValue('t')
	// c = club
	// cw = club winners
	// m = manager
	// p = player

if (type == 'p') {
	function PlayerStat()
	{
		this.nGames = 0;
		this.nGoals = 0;
		this.nAssists = 0;
		this.nMVP = 0;
		this.nAvgMark = 0;
	}

	var tbody = document.getElementsByTagName('tbody').item(0); 
	var aPlayerStats = new Array();
	
	var bCanParseStats = false;
	for (var i=1; i<tbody.rows.length; i++) 
	{ 
		var cols =  tbody.rows[i].cells;

		if (cols[0].innerHTML.indexOf('Сезон') >= 0 ||
			cols[0].innerHTML.indexOf('Всего') >= 0) 	
		{
			bCanParseStats = true;
			continue;
		} 

		if (!bCanParseStats) 		
			continue; // не добрались еще до клубов в статистике

		var iCurrentClubIndex = aPlayerStats.length - 1;

		iCurrentClubIndex = aPlayerStats.push(new PlayerStat()) - 1; 
		var ps = aPlayerStats[iCurrentClubIndex];
		ps.nGames = parseInt(cols[2].innerHTML);
		ps.nGoals = parseInt(cols[3].innerHTML);
		ps.nAssists = parseInt(cols[4].innerHTML);
		ps.nMVP = parseInt(cols[5].innerHTML);
		var fCP = parseFloat(replaceOneChar(cols[6].innerHTML,'.',2));
		if (fCP > 1)
			ps.nAvgMark = fCP*ps.nGames;
	}

	var nTotalGames = 0;
	var nTotalGoals = 0;
	var nTotalAssists = 0; 
	var nTotalMVP = 0;
	var nAMSum = 0;
	var nAMCount = 0; 

	for( var tIdx = 0; tIdx < aPlayerStats.length; tIdx++ )
	{
		nTotalGames += aPlayerStats[tIdx].nGames;
		nTotalGoals += aPlayerStats[tIdx].nGoals;
		nTotalAssists += aPlayerStats[tIdx].nAssists;
		nTotalMVP += aPlayerStats[tIdx].nMVP;
		if (aPlayerStats[tIdx].nAvgMark > 1) 
			nAMSum += aPlayerStats[tIdx].nAvgMark;
	}
	var nAvgMark = nAMSum / nTotalGames;

	var resRow = tbody.insertRow(-1);
	resRow = tbody.insertRow(-1);
	for( i = 0; i < tbody.rows[0].cells.length; i++)
	{
		var newCell = resRow.insertCell(-1);	
		newCell.innerHTML = "<b></b>";
		newCell.bgColor = "#88C274";
	}

	resRow.cells[0].innerHTML = "<b>Итого</b>";
	resRow.cells[2].innerHTML = "<b>"+nTotalGames+"</b>";
	resRow.cells[3].innerHTML = "<b>"+nTotalGoals+"</b>";
	resRow.cells[4].innerHTML = "<b>"+nTotalAssists+"</b>";
	resRow.cells[5].innerHTML = "<b>"+nTotalMVP+"</b>";
	resRow.cells[6].innerHTML = "<b>"+(nAvgMark).toFixed(2)+"</b>";

} else if(type == 'n') {
	var text = document.getElementsByName('rtext')
	var ses = parseInt(localStorage.season, 10);
	var day = parseInt(localStorage.gday.split('.')[1], 10);
	if(!isNaN(ses)) text[0].value = ses+'.'+('00' + day).substr(-3,3)+': ';
	else text[0].value = (day+1)+"й ИД: ";
	text[0].focus()
} else {

}