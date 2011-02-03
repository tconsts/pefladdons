function setCookie(name, value) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 30); 
	if (!name || !value) return false;
	document.cookie = name + '=' + encodeURIComponent(value) + '; expires='+ exdate.toUTCString() + '; path=/'
	return true
}
function getCookie(name) {
	    var pattern = "(?:; )?" + name + "=([^;]*);?"
	    var regexp  = new RegExp(pattern)
	     
	    if (regexp.test(document.cookie)) return decodeURIComponent(RegExp["$1"])
	    return false
}

function check(d) {return (d<10 ? "0"+d : d)}
                   
$().ready(function() {
	var text = ''
	var today = new Date()
	today = check(today.getDate()) + '.'+check(today.getMonth()+1)

	var nump = 0
	var tt = []
	tt[1] = [0]
	tt[2] = [0]
	tt[3] = [0]
	var trn = [0]
	trn[0] = [today]

	var srch="Вы вошли как "
	var curManagerNick = $('td.back3 td:contains('+srch+')').html().split(',',1)[0].replace(srch,'')
	var trnManagerNick = ''

	$.get('training.php', {}, function(data){
		var i = 0
		var dataarray = data.split('&');
    	while(dataarray[i] != null) {
			var cur = dataarray[i]
			var curval = cur.split('=')[1]
			if (cur.indexOf('trn') != -1) {
				trn[0].push(curval)
			}
			// получить трени t
			if (cur.search(/(^t)(\d)/) != -1) {
				tt[+cur[1]][+cur[2]] = curval
			}

			// получить кол-во игроков в трени
			if (cur.indexOf('pg') != -1) {
				tt[+curval][0] += 1
			}
			if (cur.search(/^n=/) != -1) {
				nump = curval
			}
			if (cur.search(/^s0=/) != -1) {
				trnManagerNick = curval;
			}
			i++
		}

		text += trn[0] + '\n'
		var trnnum = 1
		if (getCookie('pefltraining') && trnManagerNick == curManagerNick){
			var x = getCookie('pefltraining').split(';')
			for (var p in x) {
				var y = x[p].split(',')
				text += y + '\n'
				if (y[1]==trn[0][1] && y[2]==trn[0][2]) trnnum = 0
				trn[trnnum] = y
				text += trn[trnnum] + '\n'
				trnnum++
			}
		}
		var save = ''
		for (var f=0;f<4;f++){
			if (trn[f]){
				for (var l in trn[f]) save += trn[f][l] + (l<trn[f].length-1 ? ',' : '')
				save += (f<3 && trn[f+1] ? ';' :'')
			}
		}
		if (trnManagerNick == curManagerNick) setCookie('pefltraining',save)

		var search = 'Искусственные оффсайды'
		var key = -1
		var keyt = -1
		$('table').each(function(i,val) {
			if ($(val).html().indexOf(search) != -1) {
				keyt = i
			}			
		})
		$('td').each(function(i,val) {
			if ($(val).html() == search) key = i+1			
		})
		var t = 1
		var tn = [8,9,10,2,11,13,14]
		var tnnum = 0
		$('td').each(function(i,val) {
			if (i == key-1) {
				var sum = 0
				for (var x in tt) for (y in tt[x]) if (y != 0 && tt[x][y] == tn[tnnum]) sum += tt[x][0]
				tnnum++
				var nm = '<table width=100%><tr><td>'+($(val).html()).replace('артные', '.')+'</td>'
				if (sum != 0) nm += '<td width=1>'+ ((sum/nump*100).toFixed(0) +'%').fontsize(1)+'</td>'
				nm += '</tr></table>'
				$(val).html(nm)
			}
			if (i == key){
				key = i + 2
				var balls = '<table width=100%><tr><td>'+$(val).html()+'</td>'
				var h=0
				var text = ''
				while(trn[h] != null && h<3){
    				var ch = ''
					if (trn[h+1]) {
						ch = parseFloat(trn[h][t])-parseFloat(trn[h+1][t])
						if (t<8) trn[h][8] = (trn[h][8] ? parseFloat(trn[h][8])+parseFloat(ch) : parseFloat(ch))
						ch = ch.toFixed(4)
						ch = (ch>0 ? '('+('+'+ch).fontcolor('green')+')' : ('('+ch.fontcolor('red')+')'))
					}
					balls += '<td width=100>'+(parseFloat(trn[h][t]).toFixed(4)+ch).fontsize(1)+'</td>'
					h++
				}
				balls += '</tr></table>'
				$(val).html(balls)
				t++
			}
		})
/**/
		$('table').each(function(i,val) {
			if (i==keyt) {
				var trn0text = '<tr><td></td><td><table width=100%><tr><th>'+($('img[src="system/img/g/ball1.gif"]').length-1)+'</td>'
				for (var h=0;h<3;h++){
					if (trn[h]){
						trn0text += '<th width=100 bgcolor="#A3DE8F">'+trn[h][0]+(trn[h][8] ? ('('+(trn[h][8]).toFixed(4)+')').fontsize(1): '')+'</th>'
					}
				}
				trn0text += '</tr></table></td></tr>'
				$(val).prepend(trn0text)

				var h=0
				var sum15 = 0
				//var sum17 = 0
				for (var i in tt) for (var j in tt[i]) {
					if (j!=0 && tt[i][j] == 15) sum15 += tt[i][0]
					//if (j!=0 && tt[i][j] == 17) sum17 += tt[i][0]
				}
				trn0text  = (sum15==0 ? '' : '<tr><td><table width=100%><tr><td>Тактическое занятие</td><td width=1>'+((sum15/nump*100).toFixed(0) +'%').fontsize(1)+'</td></tr></table></td><td></td></tr>')
				//trn0text += (sum17==0 ? '' : '<tr><td><table width=100%><tr><td>Тренировочный матч</td><td width=1>'+((sum17/nump*100).toFixed(0) +'%').fontsize(1)+'</td></tr></table></td><td></td></tr>')
				$(val).append(trn0text)
			}
		})
/**/
	})
})