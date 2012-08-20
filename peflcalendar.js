// ==UserScript==
// @name           peflcalendar
// @namespace      pefl
// @description    calendar modification
// @include        http://*pefl.*/plug.php?p=calendar&*
// @version        1.0
// ==/UserScript==

deb = (localStorage.debug == '1' ? true : false)
var debnum = 1

var matches = []
var list = {
	'matches':	'id,su,place,schet,pen,weather,eid,ename,emanager,ref,hash,minutes',
}

$().ready(function() {
	GetData('matches')
	checkMatches()
	//SaveData('matches')
	markToday()
});

function toTimestamp(td){
	var mydate = new Date(td); // td = '02/04/2012'
	fakebla = mydate.valueOf();
	return fakebla;
}
function checkNum(num){
	if(num<10) return '0'+num
	else return num
}

function checkMatches(){
	debug('checkMatches()')
	var m2 = []
	var year  = parseInt(UrlValue('y',$('td.back4 a:first').attr('href')))
	var month = parseInt(UrlValue('m',$('td.back4 a:first').attr('href'))) + 1
	if(month>12) {
		month = 1
		year += 1
	}
	debug('checkMatches:month='+month+':year='+year)

	$('td.back3').each(function(){
		if($(this).find('i').length>0){
//			$(this).css("border", "1px solid red");
			var date = parseInt($(this).find('b:first').html())
			var timestamp = toTimestamp(checkNum(month)+'/'+checkNum(date)+'/'+year)
			debug('checkMatches:date='+date+':timestamp='+timestamp)
		}
	})
}

function GetData(dataname){
	debug('GetData:'+dataname)
	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'matches':	 data = matches;	break
		default: return false
	}
	var text1 = String(localStorage[dataname])
	if (text1 != 'undefined' && text1 != 'null'){
		var text = text1.split('#')
		for (i in text) {
			var x = text[i].split('|')
			var curt = {}
			var num = 0
			for(j in head){
				curt[head[j]] = (x[num]!=undefined ? x[num] : '')
				num++
			}
			data[curt[head[0]]] = {}
			if(curt[head[0]]!=undefined) data[curt[head[0]]] = curt
		}
		debug('GetData:'+dataname+':true')
	} else {
		debug('GetData:'+dataname+':false')
	}
}

function SaveData(dataname){
	debug('SaveData:'+dataname)
	var data = []
	var head = list[dataname].split(',')
	switch (dataname){
		case 'matches':	 data = matches;	break
		default: return false
	}
	var text = ''
	for (var i in data) {
		text += (text!='' ? '#' : '')
		if(typeof(data[i])!='undefined') {
			var dti = data[i]
			var dtid = []
			for(var j in head){
				dtid.push(dti[head[j]]==undefined ? '' : dti[head[j]])
			}
			text += dtid.join('|')
		}
	}
	localStorage[dataname] = text
}


function markToday(){
	debug('markToday()')
	var time=new Date();
	var currentDay = time.getDate();
	var substring = '<B>' + currentDay + ' ';
	$('td.back3').each(function(){
		if ($(this).html().toUpperCase().indexOf(substring) == 0) {
			$(this).css("border", "3px solid yellow");
		}	
	});
}
function debug(text) {
	if(deb) {
		if(debnum==1) $('body').append('<div id=debug>DEBUG INFROMATION<hr></div>')
		$('div#debug').append(debnum+'&nbsp;\''+text+'\'<br>');
		debnum++;
	}
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}
