function setCookie(name, value) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 356); // +1 year
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

function change_field_player_uniform() {
	newfp_value = prompt("Вставьте адрес картинки", field_player_img_src);
	if (newfp_value) {
		field_player_img_src = newfp_value;
		setCookie("fp_uniform", newfp_value);
		$('#fp_uniform_image').attr('src', newfp_value);
		fillTextarea(printtype);
	}
}

function change_goalkeeper_uniform() {
	newfp_value = prompt("Вставьте адрес картинки", goalkeeper_player_img_src);
	if (newfp_value) {
		goalkeeper_player_img_src = newfp_value;
		setCookie("gk_uniform", newfp_value);
		$('#gk_uniform_image').attr('src', newfp_value);
		fillTextarea(printtype);	
	}
}

// plid = player id, type = id position, for 0 zamena
function printClassic (plid,type){
	var pl = players[plid];
	var cardhtml = '[td valign=top width=20%][center]';

	cardhtml += '[img]'
	if (type == 0){
		cardhtml += (pl["position"] == "GK" ? goalkeeper_player_img_src : field_player_img_src)
	} else {
		cardhtml += (type == 1 ? goalkeeper_player_img_src : field_player_img_src)
	}
	cardhtml += '[/img]'+ "\n"
	cardhtml += pl["firstname"] + ' ' + pl["secondname"];
	cardhtml += '[/center][/td]';

	return cardhtml;
}

function printCard (plid,type){
	var pl = players[plid];
	var playergames = pl["games"]
	var playermom = pl["mom"]
	var playergoals = pl["goals"]
	var playerpasses = pl["passes"]
	var cardhtml = '[td valign=top width=20% bgcolor=#C9F8B7][table width=100% bgcolor=#A3DE8F]';

	cardhtml += '[tr][td colspan=2][b]' + pl["firstname"][0] + '.' + (pl["secondname"]).replace(/\s/g,'').replace(/-/g,'') + '[/b][/td][/tr]';
	cardhtml += '[tr][td][player=' + plid + '][img]';
	if (type == 0){
		cardhtml += (pl["position"] == "GK" ? goalkeeper_player_img_src : field_player_img_src)
	} else {
		cardhtml += (type == 1 ? goalkeeper_player_img_src : field_player_img_src)
	}
	cardhtml += '[/img][/player][/td]';
	cardhtml += '[td valign=top height=41 ]';
	if (playergames != 0) {
		cardhtml += 'P ' + pl["ratingav"] + '\n';
		cardhtml += 'И ' + playergames;
		cardhtml += (playermom != 0 ? '(' + playermom + ')\n' : '\n');
		cardhtml += (playergoals != 0 || playerpasses != 0 ? 'ГП/' + playergoals + '+' + playerpasses : '');
	} else {
		cardhtml += ' ';
	}
	cardhtml += '[/td][/tr]';
	cardhtml += '[tr][td colspan=2 align=right]фрм' + pl["form"] + '/мрл' + pl["morale"] + '[/td][/tr]';
	if (type == 0) {
		cardhtml += '[tr][td colspan=2 align=center bgcolor=#C9F8B7]' + pl["position"] + '[/td][/tr]';
	}
	cardhtml += '[/table][/td]';

	return cardhtml;
}

function fillTextarea(pt) {
		var td_st = ''
		var td_fn = '';

		preparedhtml = '';
		preparedhtml += ' [b]Стартовый состав:[/b]\n\n';
		preparedhtml += '[table bgcolor=#C9F8B7]';

		// нападение
		preparedhtml += '[tr]';
		
		// 1
		preparedhtml += '[td width=20% height=50] [/td]';
		
		for(j=0;j<3;j++) {
			if (sostav[23+j]) {
				preparedhtml += ( pt==2 ? printCard(sostav[23+j],23+j) : printClassic(sostav[23+j],23+j));
			} else {
				preparedhtml += '[td width=20% height=50] [/td]';
			}

		}
		
		// 5
		preparedhtml += '[td width=20% height=50] [/td]';
		preparedhtml += '[/tr]';
		
		// для // AM // MF // DM // DF
		for(k=0;k<20;k+=5) {
			preparedhtml += '[tr]';
			
			for(j=0;j<5;j++) {
				if (sostav[18-k+j]) {
					preparedhtml += (pt==2 ? printCard(sostav[18-k+j],18-k+j) : printClassic(sostav[18-k+j],18-k+j))
				} else {
					preparedhtml += '[td width=20% height=50] [/td]';
				}
			}
			preparedhtml += '[/tr]';
		}
		
		// SW GK
		for(k=2;k>0;k--) {
		
			preparedhtml += '[tr]';
			
			for(j=0;j<2;j++) {
				preparedhtml += '[td width=20%';
				if (! sostav[k]) {
					preparedhtml += ' height=50';
				}
				preparedhtml += ']';
				preparedhtml += ' ';
				preparedhtml += '[/td]';
			}
			
			if ( sostav[k] ) {
					preparedhtml += (pt==2 ? printCard(sostav[k],k) : printClassic(sostav[k],k))
			} else {
				preparedhtml += '[td width=20% height=50] [/td]';
			}
			
			for(j=0;j<2;j++) {
				preparedhtml += '[td width=20%]';
				preparedhtml += ' ';
				preparedhtml += '[/td]';
			}
			preparedhtml += '[/tr]';
		}
				
		preparedhtml += '[/table]';
		
		preparedhtml += "\n\n";
		preparedhtml += '[b]Скамейка запасных:[/b]\n\n';
		preparedhtml += '[table bgcolor=#C9F8B7]';
		preparedhtml += '[tr]';
		
		for(j=12;j<=16;j++) {
			if ( pids[j] ) {
				preparedhtml += (pt==2 ? printCard(pids[j],0) : printClassic(pids[j],0))
			} else {
				preparedhtml += '[td width=20% height=50] [/td]';
			}
		}
		
		preparedhtml += '[/tr]';
		preparedhtml += '[/table]';
		
		$('#sostav_na_match').html(preparedhtml);
		$('#preview').html(preparedhtml.replace(/\[img\]/g,'<img src="').replace(/\[\/img\]/g,'">').replace(/\[/g,'<').replace(/\]/g,'>').replace(/\n/g,'<br>'))
}
var printtype = 2;
var data_assoc = [];
var pids = [];		// id игроков, заявленных в состав
var players = []; // массив игроков, в котором ключ массива - id игрока, а данные - каждые под своим ключом
var sostav = []; // массив, в котором ключ - позиция на поле, а значение - id игрока
var positions = [];
var field_player_img_src = '/field/img/146cd60f8c4985270b74f7839e98059a.png';
fp_cookie_value = getCookie("fp_uniform");
if (fp_cookie_value) {
	field_player_img_src = fp_cookie_value;
}
var goalkeeper_player_img_src = '/field/img/41ccf2617ef2be4688e36fefa1eefcb7.png';	
gk_cookie_value = getCookie("gk_uniform");
if (gk_cookie_value) {
	goalkeeper_player_img_src = gk_cookie_value;
}
	
$().ready(function() {
		
	$('.back4').html('<table border="0" cellspacing="0" cellpadding="10" width="100%" height="100%"><tr><td valign="top" class="contentframer"></td></tr></table>');
	$.get('fieldnew.php', {}, function(data){
		var dataarray = data.split('&');
		
		// бежим по всему массиву dataarray
		// и преобразовываем его в ассоциативный, например:
		// data_assoc["corners9"] = 9;
		// и так далее
		var i = 0;
		while(dataarray[i] != null) {
			tmparr = dataarray[i].split('=');
			var tmpkey = tmparr[0];
			var tmpvalue = tmparr[1];
			data_assoc[tmpkey] = tmpvalue;
			i++;
		}
		
		// теперь мы собираем id всех игроков, заявленных в состав
		for(i=1;i<=16;i++) {
			pids[i] = data_assoc["pid" + i];
			var position = data_assoc["p0_" + i];
			sostav[position] = pids[i]; // сохраняем позиции на поле
		}
		
		// теперь собираем данные об игроках
		var num_players = data_assoc["n"];
		
		for(i=0;i<num_players;i++) {
			// пока только имя и фамилию
			var tmpplayer = [];
			tmpplayer["firstname"] = data_assoc["firstname"+i];
			tmpplayer["secondname"] = data_assoc["secondname"+i];
			tmpplayer["position"] = data_assoc["position"+i];
			tmpplayer["ratingav"] = data_assoc["ratingav"+i];
			tmpplayer["games"] = data_assoc["games"+i];
			tmpplayer["mom"] = data_assoc["mom"+i];
			tmpplayer["goals"] = data_assoc["goals"+i];
			tmpplayer["passes"] = data_assoc["passes"+i];
			tmpplayer["form"] = data_assoc["form"+i];
			tmpplayer["morale"] = data_assoc["morale"+i];
			var playerid = data_assoc["id" + i];
			players[playerid] = tmpplayer;
		}
		
		
		// сбор данных закончен, можно выводить
		preparedhtml = '<table><tr><td>';

		preparedhtml += '<b>Форма игрока</b><br><table><tr><td>'
		preparedhtml += '<img src="'+ field_player_img_src +'" alt="" id="fp_uniform_image" />'
		preparedhtml += '</td><td>'
		preparedhtml += 'Полевого<br />';
		preparedhtml += '<a href="javascript: change_field_player_uniform();">Поменять</a><br />';
		preparedhtml += '</td></tr>'
		preparedhtml += '<tr><td>';
		preparedhtml += '<img src="'+ goalkeeper_player_img_src +'" alt="" id="gk_uniform_image" />';
		preparedhtml += '</td><td>'
		preparedhtml += 'Вратаря<br />';
		preparedhtml += '<a href="javascript: change_goalkeeper_uniform();">Поменять</a><br /><br />';
		preparedhtml += '</td></tr></table>'

		preparedhtml += '</td><td valign=top>'

		preparedhtml += '<b>Вид отображения</b><br>'
		preparedhtml += '<input type="radio" name="prtype" onchange="printtype=1;fillTextarea(printtype)"> классический<br>'
		preparedhtml += '<input type="radio" name="prtype" onchange="printtype=2;fillTextarea(printtype)" checked> карточка игрока'
		preparedhtml += ''

		preparedhtml += '</td></tr></table>'

		preparedhtml += '<textarea rows="10" cols="80" readonly="readonly" id="sostav_na_match">';
		preparedhtml += '</textarea>';
		preparedhtml += '<br><br><span id="preview"></span>'
		$('.contentframer').html(preparedhtml);	
		fillTextarea(printtype);
	});
	
}, false);