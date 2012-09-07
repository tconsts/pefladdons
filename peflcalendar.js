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

var gdaylist = []

$().ready(function() {
	markToday()
	getJSONlocalStorage('matches2',matches)
	getPageMatches()
	checkMatches()
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
/**
	for (i in gdaylist){
		debug('checkMatches:gdaylist:'+i+'-----------------')
		if(deb) for(g in gdaylist[i]) debug('checkMatches:gdaylist:'+g+'='+gdaylist[i][g])
	}
	for (i in matches){
		debug('checkMatches:matches:'+i+'-----------------')
		if(deb) for(g in matches[i]) debug('checkMatches:matches:'+g+'='+matches[i][g])
	}
/**/

	for(i in gdaylist){
		var gdli = gdaylist[i]
		for(k in matches){
			var countmark = 0
			var countall = 0
			var counttext = ''
			var counttext2 = ''
			var mch = matches[k]
//			debug('checkMatches:-----:gdli='+gdli.dt+':mch='+mch.id)
			for(j in gdli){
				if(j!='mday' && j!='iday' && j!='tp' && j!='dt'){
					countall++
					if(gdli[j]==mch[j] 
						|| (j=='w' && gdli[j]==0 && mch[j]==undefined)
//						|| ()
					){
						countmark++
						counttext += j+','
						//debug('checkMatches:true :gdli='+gdli.dt+':mch='+mch.id+':'+j+':gdli='+gdli[j]+':mch='+mch[j])
					}else{
						counttext2 += j+'('+gdli[j]+'!='+mch[j]+'),'
						//debug('checkMatches:false:gdli='+gdli.dt+':mch='+mch.id+':'+j+':gdli='+gdli[j]+':mch='+mch[j])
					}
				}
			}
			debug('checkMatches:gdli='+gdli.dt+':mch='+mch.id+':all='+countall+':mark='+countmark+':'+counttext+':'+counttext2)
			if(countall!=0 && countmark == countall){
				mch.dt = gdli.dt
				mch.tp = gdli.tp
				matches[k] = mch
				saveJSONlocalStorage('matches2',matches)
				debug('checkMatches:'+gdli.dt+'-----------------')
				if(deb) for(g in mch) debug('checkMatches:matches:'+g+'='+mch[g])
				break;
			}
		}
	}
}

function getPageMatches(){
	debug('getPageMatches()')
	var m2 = []
	var year  = parseInt(UrlValue('y',$('td.back4 a:first').attr('href')))
	var month = parseInt(UrlValue('m',$('td.back4 a:first').attr('href'))) + 1
	if(month>12) {
		month = 1
		year += 1
	}
	debug('getPageMatches:month='+month+':year='+year)

	var count = 0
	$('td.back3').each(function(){
		// есть игровой день!
		if($(this).find('img').length>0){
			var date 	  = parseInt($(this).find('b:first').html())
			var timestamp = parseInt(toTimestamp(checkNum(month)+'/'+checkNum(date)+'/'+year))/100000
			var gdli = {'dt':timestamp}
			if($(this).find('img:first').attr('src') == 'system/img/g/ball1.gif') 	 gdli.mday = true
			else if($(this).find('img:first').attr('src') == 'system/img/g/int.gif') gdli.iday = true

			if($(this).find('i').length>0){
				// есть матч!!!
				//club
				var place = ($(this).find('b a').length>0 ? 'a' : 'h')
				gdli[place+'id'] = parseInt(UrlValue('j',$(this).find('a:first').attr('href')))
				gdli[place+'nm'] = $(this).find('a:first').text()

				//weather
				var weather = parseInt(($(this).find('img:eq(1)').attr('src')).split('/w')[1].split('.')[0])
				gdli.w = weather

				//нейтральное поле
				if($(this).html().indexOf('Нейтр. поле')!=-1) gdli.n = 1

				//судья
				if($(this).find('b:contains("R")').length>0) {
					gdli.r = $(this).html().split('<b>R</b>')[1].split('<')[0].trim()
				}

				var arr = $(this).html().split('<br>')
				//счет
				if($(this).html().indexOf(':')!=-1 && $(this).html().indexOf('*:*')==-1){
					for(h in arr) if(arr[h].indexOf(':')!=-1){
						var res = arr[h].split('</')[0].trim()
						if(place == 'h'){
							// надо перевернуть
							var re = /([0-9]+)\:([0-9]+)/;
							res = res.replace(re, "$2:$1");
						}
						gdli.res = res
					}
				}

				//type
				gdli.tp = getTypeMatch(arr[1].trim())
			}
			gdaylist[count] = gdli
			count++
		}
	})
}

function getTypeMatch(mtype){
	switch(mtype){
		case 'Товарищеские': return 't'
		default: return mtype
	}
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
		$('div#debug').append(checkNum(debnum)+'&nbsp;\''+text+'\'<br>');
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
function getJSONlocalStorage(dataname,data){
	debug('getJSONlocalStorage:'+dataname)
	if(String(localStorage[dataname])!='undefined'){
		var data2 = JSON.parse(localStorage[dataname]);
		switch(dataname){
			default:
				for(k in data2) {
					if(data2[k].id!=undefined) data[data2[k].id]= data2[k]
					else data[k]= data2[k]
				}
		}
	} else return false
}
function saveJSONlocalStorage(dataname,data){
	debug('saveJSONlocalStorage:'+dataname)
	switch(dataname){
		default:
			var data2 = []
			debug('default преобразования')
			for(i in data) data2.push(data[i])
	}
	localStorage[dataname] = JSON.stringify(data2)
}
