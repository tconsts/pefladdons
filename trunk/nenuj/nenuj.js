
function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

$().ready(function(){
	var players = []

	// id:ИмяФам,id:ИмяФам,
	var text1 = ''
	if (navigator.userAgent.indexOf('Firefox') != -1){
		text1 = String(globalStorage[location.hostname].peflnnlist)
	} else {
		text1 = String(sessionStorage.peflnnlist)
	}
	if (text1 != 'undefined'){
		var pl = text1.split(',');
		for (var i in pl) {
			sk = pl[i].split(':')
			players[sk[0]] = []
			players[sk[0]]['name'] = sk[1]
		}
	}


	// refresh=true список игроков с предложеными контрактами, тут надо получить имена к id
	if (UrlValue('refresh') == 'true') {
		var players = ''
		$('table').each(function(){
			var name = $(this).find('tr:eq(1) td:eq(1) a').text()
			var id = UrlValue('j',$(this).find('tr:eq(1) td:eq(1) a').attr('href'))
			players += id+':'+name+','
		})
		if (navigator.userAgent.indexOf('Firefox') != -1){
			globalStorage[location.hostname].peflnnlist = players
		} else {	
			sessionStorage.peflnnlist = players
		}
	}

	// t=chn - Изменить предложение, надо подписать имя
	if (UrlValue('t') == 'chn') {
		var pl = players[UrlValue('j')]
		$('body').prepend('<b>'+pl['name']+'</b><br><br>')
	}

	// t=ctrn страница предожения контракта (не только ненужного)

	// t=scout - список с листа скаута, подписать урлы

	// t=list - тут торги по игроку


}, false);