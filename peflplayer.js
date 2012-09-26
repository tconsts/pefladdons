// ==UserScript==
// @name           peflplayer
// @namespace      pefl
// @description    modification player page and school boys
// @include        http://*pefl.*/plug.php?p=refl&t=p*
// @include        http://*pefl.*/plug.php?p=refl&t=yp*
// ==/UserScript==
/**/

deb = (localStorage.debug == '1' ? true : false)

var debnum = 0
var ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
var db = false
var positions = []
var list = {
	positions: 'id,filter,name,num,koff'
}
function printStrench(){
	debug('printStrench()')
	if(positions.length==0) return false
	var poses = []
	for(i in positions){
		for(j in positions[i].pls){
			if(positions[i].pls[j].id0){
//				var srt = positions[i].pls[j].srt
				var srt = (positions[i].pls[j].srt!=undefined ? positions[i].pls[j].srt :positions[i].pls[j]['!srt'])
				var plx = {}
				plx.name = positions[i].name
				plx.srt = srt + (positions[i].pls[j].posf ? 1000 : 0) + (positions[i].pls[j].posfempty ? -2000 : 0)
				plx.strench = srt
				debug('printStrench:name='+plx.name+':srt='+plx.srt+':strench='+plx.strench)
				if(!isNaN(plx.srt)) poses.push(plx)
			}
		}
	}
	poses = poses.sort(sSrt)
	var hidden = 0
	var txt = ''
	for(i in poses){
		if(poses[i].srt<1000 && hidden==0) hidden = 1
		if(hidden == 1) {
			hidden = 2
			txt += '<a id="mya" href="javascript:void(OpenAll())">...</a><br><div id="mydiv" style="display: none;">'
		}
		if(poses[i].srt<-500 && hidden==2) {
			hidden = 3
			txt += '</div><div><br>'
		}
		txt += (String(poses[i].name)[0]=='!' ? '' : '<a>'+(poses[i].strench).toFixed(2)+':'+(poses[i].name).replace(/\s/g,'&nbsp;')+'</a><br>')
	}
	txt += '</div>'
	$('div#str').html(txt)
}

function sSrt(i, ii) { // по убыванию
	var s = (i.srt!=undefined ? 'srt' : '!srt')
    if 		(i[s] < ii[s])	return  1
    else if	(i[s] > ii[s])	return -1
    return  0
}

function GetData(dataname){
	debug(dataname+':GetData')
	var needsave = false
	var data = []
	var head = list[dataname].split(',')
	var text1 = String(localStorage[dataname])
	if (text1 != 'undefined' && text1 != 'null'){
		var text = text1.split('#')
		var numpos = 0
		for (i in text) {
			var x = text[i].split('|')
			var curt = {}
			var num = 0
			for(j in head){
				curt[head[j]] = (x[num]!=undefined ? x[num] : '')
				num++
			}
			data[numpos] = curt
			numpos++
		}
		switch (dataname){
			case 'positions':  positions = data;break
			default: return false
		}
		for(i=1;i<positions.length;i++) {
			countPosition(i)
		}
	}
}
function filterPosition(plpos,flpos){
		var pos = flpos.split(' ')
		var	pos0 = false
		var pos1 = false
		if(pos[1]==undefined) {
			pos1 = true
			if(plpos.indexOf(pos[0]) != -1) pos0 = true
		} else {
			for(k=0;k<3;k++) if(plpos.indexOf(pos[0][k]) != -1) pos0 = true
			pos1arr = pos[1].split('/')
			for(k in pos1arr) if((plpos.indexOf(pos1arr[k]) != -1)) pos1 = true
		}
		return (pos0 && pos1 ? true : false)
}

function countPosition(posnum){
	var ps = positions[posnum]
	ps.strmax = countStrength('ideal',ps.koff)
	var pls = []
	for(j in players){
		var pl = {}
		if(j==0) pl.id0 = true
		pl.id = players[j].id
		if(pl.id==undefined) break
		var pkoff = ps.koff.split(',')
		for(h in pkoff){
			var koff = String(pkoff[h].split('=')[0])
			if(skillnames[koff]==undefined) for(l in skillnames) if(skillnames[l].rshort==koff.replace(/\!/g,'')) koff=koff.replace(skillnames[l].rshort,l)
			pl[koff] = (players[j][koff.replace(/\!/g,'')]==undefined ? 0 : players[j][koff.replace(/\!/g,'')])
		}
		pl.posf = filterPosition(players[j].position, ps.filter)
		if(ps.filter=='') pl.posfempty = true
		var s = (pl.srt!=undefined ? 'srt' : (pl['!srt']!=undefined ? '!srt' : ''))
//		debug('countPosition:s='+s+':pl[s]='+pl[s])
		if(s!='' && pl[s]!=undefined) pl[s] = (ps.strmax==0 ? 0 : (countStrength(j,ps.koff)/ps.strmax)*100)
//		debug('countPosition:filter='+ps.filter+':strmax='+ps.strmax+':!srt='+pl['!srt']+'%:name='+players[j].secondname)

		pls.push(pl)
//		if(i==positions.length-1) debug('countPosition:'+pl.id+':sostav='+pl.sostav+':str='+pl.srt)
	}
	positions[posnum].pls = pls.sort(sSrt)
//	debug('countPosition:ps.strmax('+posnum+')='+ps.strmax)
}

function sSrt(i, ii) { // по убыванию
	var s = (i.srt!=undefined ? 'srt' : '!srt')
    if 		(i[s] < ii[s])	return  1
    else if	(i[s] > ii[s])	return -1
    return  0
}

function checkKoff(kf0){
	var res = kf0.replace(/!/g,'')
	if(skillnames[res]==undefined){
		var custom = true
		for(h in skillnames){
			if(skillnames[h].rshort==res) {
				custom = false
				res = h
			}
		}
		if(custom){
			debug('checkKoff:kf0='+res+'(add custom parametr)')
			skillnames[res] = {}
			skillnames[res].rshort = res
			skillnames[res].rlong = 'Custom параметр'
			skillnames[res].type = 'custom'
		}
	}
//	debug('checkKoff:kf0='+kf0+':res='+res)
	return res
}

function changeValue(formula,name,value){
	//debug('changeValue:formula='+formula+':name='+name+':value='+value)
	if(formula.indexOf(name)!=-1 && name!=''){
		var reg  = new RegExp(name, "g")
		formula = formula.replace(reg,value)
	}
	return formula
}

function countStrength(plid,pkoff){
	var pl = (plid=='ideal' ? players[0] : players[plid])
	//debug('countStrength:plid='+plid+':secondname='+(plid=='ideal' ? 'ideal' : pl.secondname)+':pkoff='+pkoff)
	pkoff = pkoff.split(',')
	var res = 0
	for(n in pkoff){
		var count = 0
		var koff = pkoff[n].split('=')
		var koffname = checkKoff(koff[0])
		if(koff[1]!=undefined){
			count = koff[1].replace(/\s/g,'')
			for(p in pl){
				var plp = (isNaN(parseInt(pl[p])) ? 0 : parseInt(pl[p]))
				var skill = (plid=='ideal' ? (skillnames[p]!=undefined && skillnames[p].strmax!=undefined ? skillnames[p].strmax : plskillmax) : plp)
				skill = '('+(skill-(skillnames[p]!=undefined && skillnames[p].strinvert!=undefined ? skillnames[p].strinvert : 0))+')'
				count = changeValue(count,p,skill)
				count = (skillnames[p]!=undefined ? changeValue(count,skillnames[p].rshort,skill) : count)
			}
			for(p in skillnames){
				count = changeValue(count,p,0)
				count = changeValue(count,skillnames[p].rshort,0)
			}
			//debug('countStrength:------ count='+count)
			var countval  = 0
			if(count!=undefined){
				try{
					countval = eval(count)
				}catch(e){
					debug('EVAL_ERROR:eval('+count+'):'+e)
					return 0
				}
			}
			if(plid!='ideal' && skillnames[koffname].type=='custom') {
				players[plid][koffname] = countval
				debug('countStrength:'+koffname+'='+countval+'(новый параметр игрока '+players[plid].secondname+')')
			}
			res += countval
			//debug('countStrength:- res='+res+'('+eval(count)+'):koff1='+koff[1])
		}
	}
	//debug('countStrength:- res='+res)
	return res
}

function RelocateGetNomData(){
	debug('RelocateGetNomData()')
	if(localStorage.getnomdata != undefined && String(localStorage.getnomdata).indexOf('1.1$')!=-1){
		debug('Storage.getnomdata ok!')
		GetNomData(0)
		//GetFinish('getnomdata', true)
	}else{
		var top = (localStorage.datatop != undefined ? localStorage.datatop : 9107893)
		debug('Storage.getnomdata('+top+')')

		$('td.back4').prepend('<div id=debval style="display: none;"></div>') //
		$('div#debval').load('forums.php?m=posts&p='+top+' td.back3:contains(#CrabNom1.1.'+top+'#) blockquote pre', function(){
			$('div#debval').find('hr').remove()
			//$('div#debval').html($('div#debval').html().replace('<br>#t#<br>',''))
			var data = $('#debval pre').html().split('#').map(function(val,i){
				return val.split('<br>').map(function(val2,i2){
					return $.grep(val2.split('	'),function(num, index) {return !isNaN(index)})
				})
			})
			var text = ''
			var nm = []
			for (i in data){
				var x = []
				for(j in data[i]) x[j] = data[i][j].join('!')
				nm[i] = x.join('|')
			}
			text = nm.join('#')
			localStorage.getnomdata ='1.1$'+text.replace('Code','')
			GetNomData(0)
			//GetFinish('getnomdata', true)
		})
	}
}

function GetNomData(id){
	var sdata = []
	var pl = players[id]
	var tkp = 0
	var fp = {}
	var svalue = 0
	var kpkof = 1.1
	var plnom = []
	nm = String(localStorage.getnomdata).split('$')[1].split('#')
	for (i in nm){
		sdata[i] = []
		x = nm[i].split('|')
		for (j in x){
			sdata[i][j] = x[j].split('!')
		}
	}
	kpkof = parseFloat(sdata[0][0][0])
	//debug('GetNomData:pl:'+pl.value+':'+pl.age)

	var saleAge = 0
	var ages = (sdata[0][0][1]+',100').split(',')
	for(i in ages) 	if(pl.age<ages[i]) 	{saleAge = i;break;}
	//debug('SaleAge:'+saleAge+':'+ages[saleAge])

	var saleValue = 0
	var vals = ('0,'+sdata[0][0][2]+',100000').split(',')
	for(i in vals) 	if(pl.value<vals[i]*1000)	{saleValue = i-1;break;}
	//debug('SaleValue:'+saleValue+':'+vals[saleValue])

	//debug('ТСЗ:'+sdata[0][saleValue+1][0])
	fp.av = parseFloat(sdata[0][saleValue+1][0])
	fp.mn = parseFloat(sdata[0][saleValue+1][1])
	fp.mx = parseFloat(sdata[0][saleValue+1][2])
	var saleNom = ''
	var t = 0
	for(i=1;i<sdata.length;i++){
		for(n in sdata[i]){
			if(isNaN(parseInt(sdata[i][n][0])) && TrimString(sdata[i][n][0])!=''){
				t++
				plnom[t] = {psum:0,tkp:sdata[i][saleValue][saleAge]}

				var pos1 = (sdata[i][n][0].split(' ')[1]!=undefined ? sdata[i][n][0].split(' ')[0] : '')
				if(pos1=='') plnom[t].pos1 = true
				else for(h in pos1) if(pl.position.indexOf(pos1[h])!=-1) plnom[t].pos1 = true

				var pos2 = (sdata[i][n][0].split(' ')[1]==undefined ? TrimString(sdata[i][n][0].split(' ')[0]) : sdata[i][n][0].split(' ')[1]).split('/')
				for(h in pos2) if(pl.position.indexOf(pos2[h])!=-1) plnom[t].pos2 = true

				if(plnom[t].pos1 && plnom[t].pos2){
					plnom[t].psum = 1
					plnom[t].id = t
					plnom[t].pos = sdata[i][n][0]
					var count = 0
					for(j=1;j<sdata[i][n].length;j++) {
						var kof = parseFloat(sdata[i][n][j].split('-')[0])
						var skil = parseInt(pl[sdata[i][n][j].split('-')[1]])
						//var skil = parseInt(pl[skl[sdata[i][n][j].split('-')[1]]])
						if(!isNaN(skil)){
							plnom[t].psum = plnom[t].psum*Math.pow((skil<1 ? 1 : skil) ,kof)
							count += kof
						}
						//debug(skil+'^'+kof+':'+sdata[i][n][j].split('-')[1])
					}
					plnom[t].psum = Math.pow(plnom[t].psum,1/count)
					//debug(plnom[t].id+':'+plnom[t].pos+':'+(plnom[t].psum).toFixed(2)+':'+plnom[t].tkp)
				}else{
					//debug('----- no ----'+sdata[i][n][0])
				}
			}
		}
	}
	plnom = plnom.sort(sNomPsum)
	fp.res = plnom[0].psum/fp.av
	fp.res = (fp.res<fp.mn ? fp.mn : (fp.res > fp.mx ? fp.mx : fp.res))
	tkp = plnom[0].tkp/100
	//for (i=0;i<2;i++) debug('psum'+plnom[i].id+':'+(plnom[i].psum).toFixed(2))
	//debug('КП:'+(plnom[0].psum/plnom[1].psum).toFixed(3) + ' < '+kpkof)
	if(plnom[1].psum!=0 && ((plnom[0].psum/plnom[1].psum)<kpkof)) {
		tkp = Math.max(plnom[0].tkp,plnom[1].tkp)/100
	}
	//for (i=0;i<2;i++) debug('tkp:'+plnom[i].tkp)
	svalue = parseInt(pl.value*tkp*fp.res/1000)
	svalue = (svalue == 0 ? 1 : svalue)
	//debug('РН='+(pl.value/1000)+'*'+tkp+'*'+(fp.res).toFixed(3)+'='+svalue)
	$('div#SValue').html('~<font size=2>'+ShowValueFormat(svalue)+'</font>')
	//return svalue*1000
}

function sNomPsum(i, ii) { // Сортировка
    if 		(i.psum < ii.psum)	return  1
    else if	(i.psum > ii.psum)	return -1
    else					return  0
}
function ShowValueFormat(value){
	if (value > 1000)	return (value/1000).toFixed(3).replace(/\./g,',') + ',000$'
	else				return (value) + ',000$'
}

function ShowAdaptation(plnat){
	debug('ShowAdaptation:natfull='+plnat)
	if(String(localStorage.mycountry)!='undefined' && plnat!=undefined && plnat!=' '){
		$.getScript("js/adaptation.en.js", function() {
			var peflnation ={'Афганистан':0,'Албания':1,'Алжир':2,'Восточное Самоа':3,'Андорра':4,'Ангола':5,'Ангуилла':6,'Антигуа':7,'Аргентина':8,'Армения':9,'Аруба':10,'Австралия':11,'Австрия':12,'Азербайджан':13,'Багамы':14,'Бахрейн':15,'Бангладеш':16,'Барбадос':17,'Беларусь':18,'Бельгия':19,'Белиз':20,'Бенин':21,'Бермуды':22,'Бутан':23,'Боливия':24,'Босния':25,'Ботсвана':26,'Бразилия':27,'Виргинские о-ва':28,'Бруней':29,'Болгария':30,'Буркина Фасо':31,'Бурунди':32,'Комбоджа':34,'Камерун':35,'Канада':36,'Кабо-Верде':37,'Каймановы о-ва':38,'ЦАР':39,'Чад':40,'Чили':41,'Китай':42,'Тайвань':43,'Колумбия':44,'Конго':45,'О-ва Кука':46,'Коста Рика':47,'Хорватия':48,'Куба':49,'Кипр':50,'Чехия':51,'Дания':53,'Джибути':54,'Доминика':55,'Доминиканская р-ка':56,'Эквадор':58,'Египет':59,'Сальвадор':60,'Англия':61,'Экв. Гвинея':62,'Эритрея':63,'Эстония':64,'Эфиопия':65,'Македония':66,'Фарерские о-ва':67,'Фиджи':68,'Финляндия':69,'Франция':70,'Габон':71,'Гамбия':72,'Грузия':73,'Германия':74,'Гана':75,'Греция':76,'Гренада':77,'Гуам':78,'Гватемала':79,'Гвинея':80,'Гвинея-Бисау':81,'Гайана':82,'Гаити':83,'Голландия':84,'Гондурас':85,'Гон-Конг':86,'Венгрия':87,'Исландия':88,'Индия':89,'Индонезия':90,'Иран':91,'Ирак':92,'Ирландия':93,'Израиль':94,'Италия':95,'Кот`д`Ивуар':96,'Ямайка':97,'Япония':98,'Иордания':99,'Казахстан':100,'Кения':101,'Кувейт':102,'Киргизия':103,'Лаос':104,'Латвия':105,'Ливан':106,'Лесото':107,'Либерия':108,'Ливия':109,'Лихтенштейн':110,'Литва':111,'Люксембург':112,'Макао':113,'Мадагаскар':114,'Малави':115,'Малайзия':116,'Мальдивы':117,'Мали':118,'Мальта':119,'Мавритания':120,'Маврикий':121,'Мексика':122,'Молдова':123,'Монголия':124,'Монсеррат':125,'Марокко':126,'Мозамбик':127,'Мьянмар':128,'Северная Ирландия':129,'Намибия':130,'Непал':131,'Кюрасао':132,'Новая Каледония':133,'Новая Зеландия':134,'Никарагуа':135,'Нигер':136,'Нигерия':137,'Северная Корея':138,'Норвегия':139,'Оман':140,'Пакистан':141,'Палестина':142,'Панама':143,'Папуа Новая Гвинея':144,'Парагвай':145,'Перу':147,'Филиппины':148,'Польша':149,'Португалия':150,'Пуэрто-Рико':151,'Катар':152,'ДР Конго':153,'Румыния':154,'Россия':155,'Руанда':156,'Зап. Самоа':157,'Сан-Марино':158,'Томе':159,'Саудовская Аравия':160,'Шотландия':161,'Сенегал':162,'Сейшельские о-ва':163,'Сьерра-Леоне':164,'Сингапур':165,'Словакия':166,'Словения':167,'Соломоновы о-ва':168,'Сомали':169,'ЮАР':170,'Южная Корея':171,'Испания':172,'Шри-Ланка':173,'Сент-Киттс':174,'Лусия':175,'Сент-Винсент':176,'Судан':177,'Суринам':178,'Свазиленд':179,'Швеция':180,'Швейцария':181,'Сирия':182,/**'Таити':183,	//дублируется 216ым/**/'Таджикистан':184,'Танзания':185,'Таиланд':186,'Того':188,'Тонга':189,'Тринидад и Тобаго':190,'Тунис':191,'Турция':192,'Туркменистан':193,'Каикос':194,'ОАЭ':195,'США':196,'Уганда':199,'Украина':200,'Уругвай':201,'Узбекистан':202,'Вануату':203,'Венесуэла':204,'Вьетнам':205,'Уэльс':207,'Йемен':208,'Сербия':209,'Заир':153, /** 210, эт щас ДР Конго - поэтому сошлемся на его id/**/'Замбия':211,'Зимбабве':212,'Гваделупа':213,'Черногория':214,'Коморские острова':215,'Таити':216}
			var peflcountry={1:0,2:1,8:2,9:3,11:4,12:5,13:6,18:7,19:8,24:9,25:10,27:11,30:12,41:13,42:14,44:15,47:16,48:17,50:18,51:19,53:20,58:21,59:22,61:23,64:24,66:25,69:26,70:27,73:28,74:29,76:30,84:31,87:32,88:33,91:34,93:35,94:36,95:37,98:38,100:39,105:40,111:41,122:42,123:43,126:44,129:45,137:46,139:47,145:48,147:49,149:50,150:51,152:52,154:53,155:54,160:55,161:56,166:57,167:58,170:59,171:60,172:61,180:62,181:63,191:64,192:65,195:66,196:67,200:68,201:69,202:70,204:71,96:72,207:73,209:74,214:75}
			var ad = s_adaptationMap[peflnation[plnat]][peflcountry[parseInt(localStorage.mycountry)]]+'0%'
			var txt = plnat+' > '+localStorage.mycountry.split('.')[1]+': вероятность адаптации '+ad+'<br><br>'
			$('a:contains(История)').parent().before(txt)
		});
	}
}

function SetValue(vl,vlch){
	debug('SetValue:'+vl/1000+':'+vlch/1000+':'+players[0].id)
	if(UrlValue('t')=='p') {
		if(ff){
			var text1 = String(localStorage['players']).split('#')
			for (i in text1){
				if(parseInt(text1[i].split('|')[0])==players[0].id){
					var text2 = text1[i].split('|')
					text2[7] = vl
					text2[8] = vlch
					text1[i] = text2.join('|')
				}
			}
			localStorage['players'] = text1.join('#')
		}else{
			if(!db) DBConnect()			
			db.transaction(function(tx) {
				tx.executeSql("UPDATE players SET value='"+vl+"', valuech='"+vlch+"' WHERE id='"+players[0].id+"'",[],
					function(tx, result){debug('saved!')},
					function(tx, error) {debug(error.message)}
				);                                           
			})		
		}		
	}
}

function GetValue(){
	debug('GetValue')
	debug('myteam:'+localStorage.myteamid)
	debug('teamid:'+players[0].teamid)
	if(localStorage.myteamid == players[0].teamid){
		var list = {'players':	'id,tid,num,form,morale,fchange,mchange,value,valuech,name'}
		var head = list['players'].split(',')
		if(ff){
			var text1 = String(localStorage['players'])
			if (text1 != 'undefined'){
				var text = text1.split('#')
				for (i in text) {
					var x = text[i].split('|')
					var curt = {}
					var num = 0
					for(j in head){
						curt[head[j]] = (x[num]!=undefined ? x[num] : '')
						num++
					}
					if(curt['id']==players[0].id) UpdateValue(parseInt(curt['value']),parseInt(curt['valuech']))
				}
			}
		}else{
			if(!db) DBConnect()
			db.transaction(function(tx) {
				tx.executeSql("SELECT * FROM players",[],
					function(tx, result){
						for(var i = 0; i < result.rows.length; i++) {
							var row = result.rows.item(i)
							if(row['id']==players[0].id) UpdateValue(row['value'],row['valuech'])
						}
					},
					function(tx, error) {debug(error.message)}
				);                                           
			})		
		}
	}
}

function UpdateValue(vl,vlch){
	debug('UpdateValue:'+vl/1000+':'+vlch/1000)
	if(vl==0){
		SetValue(players[0].value,0)
	}else{
		if(vl!=players[0].value){
			debug(vl+'!='+players[0].value)
			players[0].valuech = players[0].value - vl
			SetValue(players[0].value,players[0].valuech)
		}else{
			players[0].valuech = vlch
		}
		if(players[0].valuech!=0 && !isNaN(players[0].valuech)) PrintValue(players[0].valuech)
	}
}
function PrintValue(vlch){
	debug('PrintValue:'+vlch/1000)
	var ttext = $('td.back4 table center:first').html().split('<br>')
	for(i in ttext){
		if(ttext[i].indexOf('Номинал')!=-1) ttext[i]=ttext[i]+(vlch==0?'':' <sup>'+(vlch>0 ? '<font color=green>+'+vlch/1000 : '<font color=red>'+vlch/1000)+'</font></sup>')
	}
	$('td.back4 table center:first').html(ttext.join('<br>'))
}

function DBConnect(){
	db = openDatabase("PEFL", "1.0", "PEFL database", 1024*1024*5);
	if(!db) {debug('Open DB PEFL fail.');return false;} 
	else 	{debug('Open DB PEFL ok.')}
}

function debug(text) {
	if(deb) {
		if(debnum==1) $('body').append('<div id=debug></div>')
		$('div#debug').append(debnum+'&nbsp;\''+text+'\'<br>');
		debnum++;
	}
}


function GetPlayerHistory(n,pid){
	var stats = []
	stats[0] = {}
	stats[0].gm = 0
	stats[0].gl = 0
	stats[0].ps = 0
	stats[0].im = 0
	stats[0].sr = 0

	$('a#th2').attr('href',"javascript:void(ShowTable(2))").html('&ndash;')

	var head = '<tr><td width=3%>С</td><td width=16%>Трансфер</td><td width=3%>Сб</td><td width=3%>Мл</td><td width=10%>Игры</td><td width=13%>Голы</td><td width=13%>Пасы</td><td width=13%>ИМ</td><td width=8%>СР</td><td width=8%> </td><td width=8%> </td></tr>'
	$('#ph'+n).append(head)

	var table = '<table id=debug style="display: none;"></table>'
//	var table = '<table id=debug></table>'
	$('#ph'+n).after(table)

	$('#debug').load('hist.php?id='+pid+'&t=p table:eq(0) tr:gt(0)',function(){
		var flagT = true
		$('#debug').find('tr').each(function(){
			var d = []
			if(isNaN(parseInt($(this).find('td:first').html()))) flagT = false

			$(this).find('td').each(function(i, val){
				d[i] = $(val).html()
			})
			sid = parseInt(d[0])
			if(stats[sid]==undefined){
				stats[sid] = {}
				stats[sid].gm = 0
				stats[sid].gl = 0
				stats[sid].ps = 0
				stats[sid].im = 0
				stats[sid].sr = 0
				stats[sid].rent = 0
				stats[sid].free = 0
				stats[sid].sale = 0
				stats[sid].nat = 0
				stats[sid].u21 = 0

			}

			//определим суму транса или аренду
			if(flagT){
				if(d[1].indexOf('(')!=-1){
					var trans = d[1].split('(')[1].split(')')[0]
					if(!isNaN(parseFloat(trans.replace(',','.')))) {
						stats[sid].sale = parseFloat(trans.replace(',','.'))
						stats[sid].sale += '$' + (trans.indexOf('.') !=-1 ? 'т' : 'м')
					}else{
						if(trans.length ==6) stats[sid].rent += 1	// аренда
						if(trans.length ==9) stats[sid].free += 1	// бесплатно
					}
				}
			} else {
				if(d[1].indexOf('(')!=-1) stats[sid].u21 += 1
				else stats[sid].nat += 1
			}
			if(d[6] == '') d[6] = 0	// can delete string?
			stats[sid].sr	= (parseInt(d[2])+stats[sid].gm ==0 ? 0 : ((parseInt(d[2])*parseFloat(d[6].replace(',','.')) + (stats[sid].gm*stats[sid].sr))/(parseInt(d[2])+stats[sid].gm)).toFixed(2))
			stats[sid].gm	+= parseInt(d[2])
			stats[sid].gl	+= parseInt(d[3])
			stats[sid].ps	+= parseInt(d[4])
			stats[sid].im	+= parseInt(d[5])
			if(!isNaN(sid)){
				stats[0].sr		= (parseInt(d[2])+stats[0].gm == 0 ? 0 : ((parseInt(d[2])*parseFloat(d[6].replace(',','.')) + stats[0].gm*stats[0].sr)/(parseInt(d[2])+stats[0].gm)).toFixed(2))
				stats[0].gm		+= parseInt(d[2])
				stats[0].gl		+= parseInt(d[3])
				stats[0].ps		+= parseInt(d[4])
				stats[0].im		+= parseInt(d[5])
			}
		})
		//print
		var data = ''
		data += '<tr class=back2><td><a id=th2 href="javascript:void(ShowCar('+n+'))">+</a> </td><td colspan=3>Итого</td>' //bgcolor=#88C274
		for (p in stats[0]){
			if(p!='sale' && p!='rent' && p!='free' && p!='nat' && p!='u21') {
				data += '<td>' 
				data +=	String(stats[0][p]).replace('.',',')
				if(p!='gm' && p!='sr' && stats[0].gm!=0 && stats[0][p]!=0) {
					data += '('+parseFloat(stats[0][p]/stats[0].gm).toFixed(2)+')'
				}
				data += '</td>'
			}
		}
		data += '<td colspan=2> </td></tr>'

		for (ss=stats.length-1;ss>=1;ss--){
			if(stats[ss] !=undefined && (stats[ss].gm !=0 || stats[ss].sale!=0 || (stats[ss].free+stats[ss].rent)>0)){
					data += '<tr class=back3 id=carpl'+n+' style="display: none;"><td>'
					data += ss
					data += '</td><td>'
					if(stats[ss].sale!=0) 		data += stats[ss].sale.replace('.',',')
					else if(stats[ss].free >0)	data += 'бесплатно'
					else if(stats[ss].rent >0)	data += 'аренда'
					else data += ' '
					data += '</td><td>'
					data += (stats[ss].nat >0 ? '<img src="system/img/g/tick.gif" width=10>' : ' ')		//сборная
					data += '</td><td>'
					data += (stats[ss].u21 >0 ? '<img src="system/img/g/tick.gif" width=10>' : ' ')		//U21
					data += '</td>'
				for (p in stats[ss]){
					if(p!='sale' && p!='rent' && p!='free' && p!='nat' && p!='u21') {
						data += '<td>' + String(stats[ss][p]).replace('.',',') + '</td>'
					}
				}
				data += '<td colspan=2> </td></tr>'
			}
		}

		$('#ph'+n).append(data)
	})
}

function ModifyHistory(){
	if(mh){
		//спрятать доп инфу
		mh = false
		$('table#ph0 tr:gt(1)').each(function(){
			$(this).find('td:eq(5)').html(parseInt($(this).find('td:eq(5)').text()))
			$(this).find('td:eq(6)').html(parseInt($(this).find('td:eq(6)').text()))
			$(this).find('td:eq(7)').html(parseInt($(this).find('td:eq(7)').text()))
		})
	}else{
		//показать доп инфу
		mh = true
		$('table#ph0 tr:gt(1)').each(function(){
			var gm = parseInt($(this).find('td:eq(4)').text())
			var gl = parseInt($(this).find('td:eq(5)').text())
			var ps = parseInt($(this).find('td:eq(6)').text())
			var im = parseInt($(this).find('td:eq(7)').text())
			if(gm!=0){ 
				if(gl!=0) $(this).find('td:eq(5)').html(gl + '('+(gl/gm).toFixed(2)+')')
				if(ps!=0) $(this).find('td:eq(6)').html(ps + '('+(ps/gm).toFixed(2)+')')
				if(im!=0) $(this).find('td:eq(7)').html(im + '('+(im/gm).toFixed(2)+')')
			}
		})
	}
}

function ShowCar(n){
	if ($('a#th2').html() == '+'){
		$('tr#carpl'+n).show()
		$('a#th2').html('&ndash;')
	}else{
		$('tr#carpl'+n).hide()
		$('a#th2').html('+')
	}
}

function ShowTable(n){
	var style = $('td.back4 table table:not(#plheader):eq('+n+')').attr('style')
	if(style == "display: none" || style == "display: none;" || style == "display: none; "){
		$('td.back4 table table:not(#plheader):eq('+n+')').show()
		$('a#th'+n).html('&ndash;')
	} else {
		$('td.back4 table table:not(#plheader):eq('+n+')').hide()
		$('a#th'+n).html('+')
	}
}

function hist(rcode,rtype)
	{ window.open('hist.php?id='+rcode+'&t='+rtype,'История','toolbar=0,location=0,directories=0,menuBar=0,resizable=0,scrollbars=yes,width=480,height=512,left=16,top=16'); }

function getPairValue(str,def,delim) {
	def	= (def ? def : '')
	delim	= (delim ? delim : '=')
	arr	= str.split(delim)
	return (arr[1] == undefined ? def : arr[1])
}

function getPairKey(str,def,delim) {
	def	= (def ? def : '')
	delim	= (delim ? delim : '=')
	arr	= str.split(delim)
	return (arr[0] == str ? def : arr[0])
}

function getCookie(name) {
	var pattern = "(?:; )?" + name + "=([^;]*);?"
	var regexp  = new RegExp(pattern)
	if (regexp.test(document.cookie)) return decodeURIComponent(RegExp["$1"])
	return false
}

function sSkills(i, ii) { // Сортировка
    if 		(i[0] < ii[0])	return  1
    else if	(i[0] > ii[0])	return -1
    else					return  0
}

function ShowAll(){
	$('td.back4 table:first table:not(#plheader):first td').each(function(){
		$(this).removeAttr('class').find('img').removeAttr('style')
	})
}

function ShowSkills(skl){
	ShowAll()
	if(compare == true) {
		$('td.back4 table:first table:not(#plheader):first td').each(function(i,val){
			if (i%3 == 0 && skl.indexOf($(val).find('script').remove().end().html().replace(/<!-- [а-я] -->/g,'')) == -1){
				$(val).attr('class','back1')
					.next().attr('class','back1').find('img').hide().end()
					.next().attr('class','back1').find('img').hide();
			}
		})
	} else {
		$('td.back4 table:first table:not(#plheader):first td:even').each(function(){
			if (skl.indexOf($(this).find('script').remove().end().html().replace(/<!-- [а-я] -->/g,'')) == -1){
				$(this).attr('class','back1')
				.next().attr('class','back1').find('img').hide();
			}
		})
	}
}

function OpenAll(){
	if ($("#mydiv").attr('style')) $("#mydiv").removeAttr('style')
	else $("#mydiv").hide()
}

function RemovePl(rem){
	if(rem!=0) players.splice(rem,1);
	RememberPl(1); // !=1: save w\o player0
	PrintPlayers();
}

function PrintPlayers(cur){
	$('div#compare').empty()
	var htmltext = '<table border=0 width=100% rules=none>'
	for (i=0;i<players.length;i++){
		if((i>0 || cur==0) && players[i].secondname != undefined){
			var secname = String(players[i].secondname).split(' ')
			var fname = String(players[i].firstname)
			var plhref = (players[i].t==undefined || players[i].t == 'yp' ? '' : ' href="plug.php?p=refl&t='+players[i].t+'&j='+players[i].id+'&z='+players[i].hash+'"')
			htmltext += '<tr><td nowrap><font size=1>'
			htmltext += '<a id="compare'+i+'" href="javascript:void(CheckPlayer('+i+'))"><</a>|'
			htmltext += '<a href="javascript:void(RemovePl('+i+'))">x</a>|'
			htmltext += '<a'+(players[i].t == 'yp' ? '' : ' href="javascript:hist(\''+players[i].id+'\',\'n\')"')+'>и</a>|'
			htmltext += players[i].id+'|'
			htmltext += '<a'+plhref+'>' + secname[secname.length-1] + '</a>'
			htmltext += '</font></td></tr>'
		}
	}
	htmltext += '</table>'
	$('div#compare').append(htmltext)
}
function RememberPl(x){
	// Save data
	var mark = 1
	var text = ''
	for (k in players){
		if (players[k].id!=undefined && ((k>0 && mark<=25) || (k==0 && x==0))){
			for (i in players[k]) text += i+'_'+mark+'='+players[k][i]+','
			mark++
		}
	}
	localStorage.peflplayer = text
	if (x==0)	PrintPlayers(0)
	else 		PrintPlayers()
}

function CheckPlayer(nn){
	// Get data and compare players
	ShowAll()
//	$('a[id="th2"]').html('+')
	$('div#kar, #th2, table#ph0, table#plst, table#debug').remove()

	$('td.back4').prepend('<div align="right">(<a href="'+window.location.href+'">x</a>)&nbsp;</div>')
	$('a#remember, a[id^="compare"]').removeAttr('href')
	compare = true

	var header = '<table width=100% id="plheader">'
	// имя, команда
	header += '<tr align=center><td width=50% valign=top>'
	header += '<b>' + players[0].firstname + ' ' + players[0].secondname + '</b>'
	header += (players[0].teamid != undefined ? ' (<a href="plug.php?p=refl&t=k&j='+players[0].teamid+'&z='+players[0].teamhash+'">' : ' (')
	header += players[0].team
	header += (players[0].teamid != undefined ? '</a>)' : ')')
	header += '</td>'
	header += '<td width=50% valign=top>'
	header += '<b>' + players[nn].firstname + ' ' + players[nn].secondname + '</b>'
	header += (players[nn].teamid != undefined ? ' (<a href="plug.php?p=refl&t=k&j='+players[nn].teamid+'&z='+players[nn].teamhash+'">' : ' (')
	header += players[nn].team
	header += (players[nn].teamid != undefined ? '</a>)' : ')')
	header += '</td></tr>'
	// возраст, гражданство, игры за сборные
	header += '<tr align=center><td valign=top>'
	header += players[0].age +' лет' + (players[0].natfull != ' ' ? ', ' + players[0].natfull : '')
	if(	parseInt(players[0].internationalapps) != 0
		|| parseInt(players[nn].internationalapps) != 0
		|| parseInt(players[0].u21apps) != 0
		|| parseInt(players[nn].u21apps) != 0)
	{
		header += ', ' + players[0].internationalapps +'('+players[0].u21apps+') матчей, '+players[0].internationalgoals+'('+players[0].u21goals+') голов'
	}
	header += '</td>'
	header += '<td valign=top>'
	header += players[nn].age +' лет'+ (players[nn].natfull != ' ' ? ', ' + players[nn].natfull : '')
	if(	parseInt(players[0].internationalapps) != 0
		|| parseInt(players[nn].internationalapps) != 0
		|| parseInt(players[0].u21apps) != 0
		|| parseInt(players[nn].u21apps) != 0)
	{
		header += ', ' + players[nn].internationalapps +'('+players[nn].u21apps +') матчей, '+players[nn].internationalgoals+'('+players[nn].u21goals+') голов'
	}
	header += '</td></tr>'
	//контракты
	header += '<tr align=center><td>'
	if(players[0].wage != 0){
		header += players[0].contract +' г. по '
		header += (players[0].wage > 999 ? String((players[0].wage/1000).toFixed(3)).replace(/\./g,',') : players[0].wage)
		header += '$ в ИД'
	}
	header += ' </td>'
	header += '<td>'
	if(players[nn].wage != 0){
		header += players[nn].contract +' г. по '
		header += (players[nn].wage > 999 ? String((players[nn].wage/1000).toFixed(3)).replace(/\./g,',') : players[nn].wage)
		header += '$ в ИД'
	}
	header += ' </td></tr>'
	// Номиналы
	if( players[0].value != 0 || players[nn].value != 0){
		header += '<tr align=center><td>'
		if (players[0].value != 0)	header += 'Номинал: '+String(players[0].value < 1000000 ? (players[0].value/1000).toFixed(3) : (players[0].value/1000000).toFixed(3) + ',000').replace(/\./g,',')+'$'
		header += ' </td>'
		header += '<td>'
		if (players[nn].value != 0)	header += 'Номинал: '+String(players[nn].value < 1000000 ? (players[nn].value/1000).toFixed(3) : (players[nn].value/1000000).toFixed(3) + ',000').replace(/\./g,',')+'$'
		header += ' </td></tr>'
	}
	// позиция
	header += '<tr align=center><td>'
	header += '<b>' + players[0].position + '</b>'
	if(players[0].newpos != '' && players[0].newpos != undefined) header += ' (' + players[0].newpos + ')'
	header += '</td>'
	header += '<td>'
	header += '<b>' + players[nn].position + '</b>'
	if(players[nn].newpos != '' && players[nn].newpos != undefined) header += ' (' + players[nn].newpos + ')'
	header += '</td></tr>'
	// умения
	header += '<tr align=center><td>'
	header += 'сс='+ players[0].sumskills
	header += '</td>'
	header += '<td>'
	header += 'сс='+players[nn].sumskills
	header += '</td></tr>'

	header += '</table>'

	$('td.back4 table:first center:first').remove()
	$('div#th0').before(header)

	var skillupsumm = 0
	var skillupsumm2 = 0
	// Skills:
	$('td.back4 table:first table:not(#plheader):first td:even').each(function(i, val){
		var skillname = sklfr[$(val).text()].elong
		var skillvalue0 = players[0][skillname]
		var skillvalue1 = (players[nn][skillname] == undefined ? '??' : players[nn][skillname])
		var skillup0 = parseInt(skillvalue0)*7 + parseInt(ups[String(skillvalue0).split('.')[1]])
		var skillup1 = parseInt(skillvalue1)*7 + parseInt(ups[String(skillvalue1).split('.')[1]])
		var skillup2 = parseInt(skillvalue1)*7 + parseInt(ups[(String(skillvalue1).split('.')[1] == 'next' ? 'a1e' : String(skillvalue1).split('.')[1])])
		var raz = parseInt(skillvalue0)-parseInt(skillvalue1)
		skillupsumm += skillup0 - skillup1
		skillupsumm2 += skillup0 - skillup2
		var razcolor = 'red'
		if(raz == 0 || isNaN(raz)) raz = '&nbsp;&nbsp;&nbsp;&nbsp;'
		else if (raz>0) {
				raz = '+' + raz
				razcolor = 'green'
		}
		var skilltext0 = String(skillvalue0).split('.')[0]
		skilltext0 += '<sup><font color="' + razcolor + '">'+raz+'</font></sup>'
		if (String(skillvalue0).split('.')[1]){
			skilltext0 += ' <img height="12" src="system/img/g/' + String(skillvalue0).split('.')[1] + '.gif">'
		}
		var skilltext = '<td width=10%>'
		skilltext += String(skillvalue1).split('.')[0]
		if (String(skillvalue1).split('.')[1]){
			skilltext += ' <img height="12" src="system/img/g/' + String(skillvalue1).split('.')[1] + '.gif">'
		}
		skilltext += '</td>'
		$(val)
			.next().attr('width','10%')
			.html(skilltext0)
			.after(skilltext)
	})
	if(players[0].id == players[nn].id && (players[0].t == 'yp' || players[0].t == 'yp2')){
		var skilltext =  '<tr><td colspan=6>&nbsp;</td></tr>'
		skilltext += '<tr><td colspan=6 align=center><b>Изменения</b> (апы): '
		skilltext +=  '<font color='+(skillupsumm < 0 ? 'red' : 'green')+'>'+ (skillupsumm > 0 ? '+' : '') + skillupsumm + '</font>'
		skilltext += '</td></tr>'
		skilltext += '<tr><td colspan=6 align=center><b>зел = жел</b> (апы): '
		skilltext +=  '<font color="'+(skillupsumm2 < 0 ? 'red' : 'green')+'">'+ (skillupsumm2 > 0 ? '+' : '') + skillupsumm2 + '</font>'
		skilltext += '</td></tr>'
		skilltext += '<tr><td colspan=6>&nbsp;</td></tr>'
		$('td.back4 table:first table:not(#plheader):eq(0)').append(skilltext)
	}

	$('td.back4 table:first table:not(#plheader):eq(1) tr:first td:gt(0)').attr('colspan','3').attr('align','center')
	$('td.back4 table:first table:not(#plheader):eq(1) tr:gt(0)').each(function(i,val){
		if(i!=1) $(val).find('td:eq(7)').after('<td'+(i==0 ? ' rowspan=2':'')+'>'+(players[nn]['kk'+i]!=undefined ? players[nn]['kk'+i] : '?')+'</td><td'+(i==0 ? ' rowspan=2':'')+' class=back1 width=1%> </td>')
		if(i!=1) $(val).find('td:eq(6)').after('<td'+(i==0 ? ' rowspan=2':'')+'>'+(players[nn]['zk'+i]!=undefined ? players[nn]['zk'+i] : '?')+'</td><td'+(i==0 ? ' rowspan=2':'')+' class=back1 width=1%> </td>')

		$(val).find('td:eq(5)').after('<td>'+(parseFloat(players[nn]['sr'+i])==0 || players[nn]['sr'+i]==undefined ? '0,00' : String((parseFloat(players[nn]['sr'+i])).toFixed(2)).replace('.',','))+'</td><td class=back1 width=1%> </td>')
		$(val).find('td:eq(4)').after('<td>'+(players[nn]['im'+i]!=undefined ? players[nn]['im'+i] : '?')+'</td><td class=back1 width=1%> </td>')
		$(val).find('td:eq(3)').after('<td>'+(players[nn]['ps'+i]!=undefined ? players[nn]['ps'+i] : '?')+'</td><td class=back1 width=1%> </td>')
		$(val).find('td:eq(2)').after('<td>'+(players[nn]['gl'+i]!=undefined ? players[nn]['gl'+i] : '?') +'</td><td class=back1 width=1%> </td>')
		$(val).find('td:eq(1)').after('<td>'+(players[nn]['ig'+i]!=undefined ? players[nn]['ig'+i] : '?')+'</td><td class=back1 width=1%> </td>').before('<td class=back1 width=1%> </td>')
	})
	return false
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
}

function CodeForForum(){
	var x = '<div align="right">(<a href="'+window.location.href+'">x</a>)&nbsp;</div>'
	var pl = players[0]
	var ptype = UrlValue('t')
	var skillsshow		= ($('a#th0').html() == '+' ? false : true)
	var seasonstatshow	= ($('a#th1').html() == '+' ? false : true)
	var fullstatshow 	= ($('a#th2').html() == '+' ? false : true)
	var lastplstatshow	= ($('a#plst').length>0 && $('a#plst').html() == '+' ? false : true)

	$('td.back4 table:first table:not(#plheader):first img').removeAttr('style')
	x += '<br><hr><b>Полный вариант</b>:<br>'
	x += '<textarea rows="20" cols="80" readonly="readonly" id="CodeForForum">'
	x += '[spoiler]'
	x += '[table width=100% bgcolor=#C9F8B7][tr][td]\n[center]'
	if (compare == true) {
		x += $('table#plheader')
			.find('a:contains("интересуются")').removeAttr('href').end()
			.find('a[id="th0"]').remove().end()
			.find('center, b, td').removeAttr('id').end()
			.find('img').removeAttr('width').end()
			.html()
			.replace('\/flags\/','/flags/mod/')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/\<a\>интересуются\<\/a\>/g,'интересуются')
			.replace(/<!-- [а-я] -->/g,'')
			.replace(/<tbody>/g,'<table width=100%>')
			.replace(/tbody/g,'table')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/a href=\"/g,'url=')
			.replace(/\/a/g,'/url')
			.replace(/\&amp\;/g,'&')
			.replace(/"/g,'')
			.replace(/\[br\]/g,'\n')
//		x += '\n'

	} else {
//		x += '[url=plug.php?' + location.search.substring(1) + ']#[/url] [b]'
		x += '[url=plug.php?p=refl&t='+pl.t+'&j='+pl.id+'&z='+pl.hash+']#[/url] [b]'
		x += $('td.back4 table center:first b:first')
			.find('a[id="th0"]').remove().end()
			.find('img').removeAttr('width').end()
			.html()
			.replace('\/flags\/','/flags/mod/')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/\<a\>интересуются\<\/a\>/g,'интересуются')
			.replace(/<!-- [а-я] -->/g,'')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/a href=\"/g,'url=')
			.replace(/\/a/g,'/url')
			.replace(/\&amp\;/g,'&')
			.replace(/"/g,'')
			.replace(/\[br\]/g,'\n')
			.replace(/\[sup\]/g,'(')
			.replace(/\[\/sup\]/g,')')
			.replace(/font /g,'')
			.replace(/font/g,'color')
		if(ptype == 'yp' || ptype == 'yp2') x += '[/b]\n'+pl.position+'[b]'
		if(pl.newpos != '' && pl.newpos != undefined) x += '[/b] (' +pl.newpos + ')[b]'
		x += '\n\nУмения[/b](сс='+pl.sumskills
		x += (pl.flag==5 ? ', школьник':'')
		x += (pl.flag==7 ? ', молодеж':'')
		x += (pl.t=='p2' ? ', свободный':'')
		x += ')[/center]'

	}

	// skills
	if(skillsshow){
		x += '\n'
		x += $('td.back4 table table:not(#plheader):first')
			.find('tr.back2').removeAttr('class').end()
			.find('tr.back3').removeAttr('class').attr('bgcolor','#A3DE8F').end()
			.find('td.back1').removeAttr('class').attr('bgcolor','#C9F8B7').end()
			.find('img').removeAttr('ilo-full-src').end()		// fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
			.find('sup').remove().end()
			.html()
			.replace(/<!-- [а-я] -->/g,'')
			.replace(/<tbody>/g,'<table width=100%>')
			.replace(/tbody/g,'table')
			.replace(/<font /g,'[')
			.replace(/\/font/g,'/color')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/ height=\"12\"/g,'')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/"/g,'')
			.replace(/\n/g,'')
	}
	var y = x 
	
	// stat of season
	if (seasonstatshow && (ptype == 'p' || ptype == 'pp')){
		x += '\n[center][b]Статистика сезона[/b][/center]\n'
		x += $('table#stat')
			.find('tr.back2').removeAttr('class').end()
			.find('tr.back3').removeAttr('class').attr('bgcolor','#A3DE8F').end()
			.find('td.back1').removeAttr('class').attr('bgcolor','#C9F8B7').end()
			.find('img').removeAttr('ilo-full-src').end()		// fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
			.html()
			.replace(/<!-- [а-я] -->/g,'')
			.replace(/<tbody>/g,'<table width=100%>')
			.replace(/tbody/g,'table')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/"/g,'')
			.replace(/\[td\]\[\/td\]/g,'[td] [/td]')
	}
	// fullstat
	if ($('table#ph0').html()!=null && fullstatshow && (ptype == 'p' || ptype == 'pp')){
		x += '\n[center][b][url=hist.php?id=' + pl.id + '&t=p]Карьера[/url][/b][/center]\n'
		x += $('table#ph0')
			.find('tr.back2').removeAttr('class').end()
			.find('tr.back3').removeAttr('class').attr('bgcolor','#A3DE8F').end()
			.find('img')
				.removeAttr('ilo-full-src')		// fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
				.removeAttr('width')
				.end()
			.find('a#th2').remove().end()
			.find('tr').removeAttr('style').removeAttr('id').end()
			.html()
			.replace(/<!-- [а-я] -->/g,'')
			.replace(/<tbody>/g,'<table width=100%>')
			.replace(/tbody/g,'table')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/"/g,'')
			.replace(/\[td\]\[\/td\]/g,'[td] [/td]')
	}
	if($('table#plst').html()!=null && lastplstatshow){
		x += '\n[center][b]Последние матчи[/b][/center]\n'
		x += $('table#plst')
			.find('tr.back2').removeAttr('class').end()
			.find('tr.back3').removeAttr('class').attr('bgcolor','#A3DE8F').end()
			.find('td.back1').removeAttr('class').attr('bgcolor','#C9F8B7').end()
			.find('img')
				.removeAttr('ilo-full-src')		// fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
				.removeAttr('width')
				.end()
			.find('tr').removeAttr('style').removeAttr('id').end()
			.html()
			.replace(/<tbody>/g,'<table width=100%>')
			.replace(/tbody/g,'table')
			.replace(/<font /g,'[')
			.replace(/\/font/g,'/color')
			.replace(/a href=\"/g,'url=')
			.replace(/\/a/g,'/url')
			.replace(/\</g,'[')
			.replace(/\>/g,']')
			.replace(/img src="/g,'img]')
			.replace(/.gif/g,'.gif[/img')
			.replace(/.png/g,'.png[/img')
			.replace(/"/g,'')
			//.replace(/\[td\]\[\/td\]/g,'[td] [/td]')
	}

	x += '[/td][/tr][/table]'
	x += '\n\n'
	x +='[center]--------------- [url=forums.php?m=posts&q=173605]Крабовый VIP[/url] ---------------[/center]\n';
	x += '[/spoiler]'
	x += '</textarea><hr>'
/**
	x += '<b>Текстовый вариант:</b><br><br>'
	x += pl.firstname + ' ' +pl.secondname+' (' + pl.team +')<br>'
	x += pl.age +' лет, '+ pl.natfull+'<br>'
	x += 'Контракт: '+pl.contract +' г., '+ pl.wage+' в игровой день<br>'
	x += 'Номинал: '+pl.value +'<br>'
	x += pl.position + ' (' + pl.newpos+ ')'+'<br>'
	x += '<br>'
	x += 'Умения ('+pl.sumskills+')<br>'
	x += lp('Лидерство')		+parseInt(pl.leadership)+' '+lp('Дриблинг')		+parseInt(pl.dribbling)+'<br>'
	x += lp('Удары')			+parseInt(pl.finishing)+' '	+lp('Игра в пас')	+parseInt(pl.passing)+'<br>'
	x += lp('Видение поля')		+parseInt(pl.vision)+' '	+lp('Игра головой')	+parseInt(pl.heading)+'<br>'
	x += lp('Навесы','.')		+parseInt(pl.crossing)+' '	+lp('Дальние удары')+parseInt(pl.longshots)+'<br>'
	x += lp('Перс. опека')		+parseInt(pl.marking)+' '	+lp('Скорость')		+parseInt(pl.pace)+'<br>'
	x += lp('Штрафные')			+parseInt(pl.freekicks)+' '	+lp('Выбор позиции')+parseInt(pl.positioning)+'<br>'
	x += lp('Угловые')			+parseInt(pl.corners)+' '	+lp('Техника')		+parseInt(pl.technique)+'<br>'
	x += lp('Мощь')				+parseInt(pl.strenght)+' '	+lp('Отбор мяча')	+parseInt(pl.tackling)+'<br>'
	x += lp('Работоспособность')+parseInt(pl.workrate)+' '	+lp('Выносливость')	+parseInt(pl.stamina)+'<br>'
	x += '<br>'
	x += 'Форма: '+pl.form+'% | Мораль: '+pl.morale+'%<br>'
/**/
	$('td.back4').html(x)
	$('td#crabglobalright').empty()

	return true
}
function lp(txt){
	var num = 19-txt.length
	for(i=0;i<num;i++) txt += '_'
	return txt
}

function TrimString(sInString){
	sInString = sInString.replace(/\&nbsp\;/g,' ');
	return sInString.replace(/(^\s+)|(\s+$)/g, '');
}

var players = []
for (i=0;i<26;i++) players[i] = []

//var skl = []
//var sklse = []
//var sklsr = []
var sklfr = []
//var poss = []
var compare = false
var mh = false

var ups = {	"a0e":"-2",
			"a1e":"-1",
			"a2e":"1",
			"a3e":"2",
			"a5e":"3",
			"a6e":"-3",
			"next":"-3",
			"last":"3",
			"undefined":"0"	
		}
var plskillmax = 15
var skillnames = {
sostav:{rshort:'зв',rlong:'Игрок в заявке?'},
flag:{rshort:'фл',rlong:'Информационный флаг'},
pfre:{rshort:'иш',rlong:'Исполнители штрафных'},
pcor:{rshort:'иу',rlong:'Исполнители угловых'},
ppen:{rshort:'пн',rlong:'Исполнители пенальти'},
pcap:{rshort:'кп',rlong:'Капитаны'},
//сс
school:{rshort:'шкл',rlong:'Школьник?'},
srt:{rshort:'сила',rlong:'В % от идеала (профы '+plskillmax+')',type:'float'},
stdat:{rshort:'са',rlong:'Идет на стд. атаки'},
stdbk:{rshort:'со',rlong:'Идет на стд. обороны'},
nation:{rshort:'кСт',rlong:'Код страны'},
natfull:{rshort:'стр',rlong:'Страна',align:'left',nowrap:'1'},
secondname:{rshort:'Фам',rlong:'Фамилия',align:'left',nowrap:'1'},
firstname:{rshort:'Имя',rlong:'Имя',align:'left',nowrap:'1'},
age:{rshort:'взр',rlong:'Возраст',str:true,strmax:40},
id:{rshort:'id',rlong:'id игрока'},
internationalapps:{rshort:'иСб',rlong:'Игр за сборную',str:true,strmax:500},
internationalgoals:{rshort:'гСб',rlong:'Голов за сборную',str:true,strmax:500},
contract:{rshort:'кнт',rlong:'Контракт',strmax:5},
wage:{rshort:'зрп',rlong:'Зарплата',strmax:100,strinvert:1000100},
value:{rshort:'ном',rlong:'Номинал',type:'value',strmax:50000000},
corners:{rshort:'уг',rlong:'Угловые',str:true},
crossing:{rshort:'нв',rlong:'Навесы',str:true},
dribbling:{rshort:'др',rlong:'Дриблинг',str:true},
finishing:{rshort:'уд',rlong:'Удары',str:true},
freekicks:{rshort:'шт',rlong:'Штрафные',str:true},
handling:{rshort:'ру',rlong:'Игра руками',str:true},
heading:{rshort:'гл',rlong:'Игра головой',str:true},
leadership:{rshort:'лд',rlong:'Лидерство',str:true},
longshots:{rshort:'ду',rlong:'Дальние удары',str:true},
marking:{rshort:'по',rlong:'Перс. опека',str:true},
pace:{rshort:'ск',rlong:'Скорость',str:true},
passing:{rshort:'пс',rlong:'Игра в пас',str:true},
positioning:{rshort:'вп',rlong:'Выбор позиции',str:true},
reflexes:{rshort:'ре',rlong:'Реакция',str:true},
stamina:{rshort:'вн',rlong:'Выносливость',str:true},
strength:{rshort:'мщ',rlong:'Мощь',str:true},
tackling:{rshort:'от',rlong:'Отбор мяча',str:true},
vision:{rshort:'ви',rlong:'Видение поля',str:true},
workrate:{rshort:'рб',rlong:'Работоспособность',str:true},
technique:{rshort:'тх',rlong:'Техника',str:true},
morale:{rshort:'мрл',rlong:'Мораль',str:true,strmax:100},
form:{rshort:'фрм',rlong:'Форма',str:true,strmax:100},
position:{rshort:'Поз',rlong:'Позиция',align:'left',nowrap:'1'},
/**
games
goals
passes
mom
ratingav
cgames
cgoals
cpasses
cmom
cratingav
egames
egoals
epasses
emom
eratingav

wgames
wgoals
wpasses
wmom
wratingav

fgames
fgoals
fpasses
fmom
fratingav
vratingav
training
/**/
inj:{rshort:'трв',rlong:'Травма'},
sus:{rshort:'дсв',rlong:'Дисквалификация'},
syg:{rshort:'сыг',rlong:'Сыгранность'},
/**
agames
agoals
apasses
amom
/**/
}
function getJSONlocalStorage(dataname){
	if(String(localStorage[dataname])!='undefined'){
		var data = []
		var data2 = JSON.parse(localStorage[dataname]);
		switch(dataname){
			case 'matchespl2': 
				for(k in data2){
					data[k] = []
					for(l in data2[k]){
						if(data2[k][l].id!=undefined) data[k][data2[k][l].id]= data2[k][l]
						else data[k][l]= data2[k][l]
					}
				}
				return data
				break
			default:
				return data2
		}
	} else return false
}
function filterPosition(plpos,flpos){
		var pos = flpos.split(' ')
		var	pos0 = false
		var pos1 = false
		if(pos[1]==undefined) {
			pos1 = true
			if(plpos.indexOf(pos[0]) != -1) pos0 = true
		}else{
			for(k=0;k<3;k++) if(plpos.indexOf(pos[0][k]) != -1) pos0 = true
			pos1arr = pos[1].split('/')
			for(k in pos1arr) if((plpos.indexOf(pos1arr[k]) != -1)) pos1 = true
		}
		return (pos0 && pos1 ? true : false)
}

function ShowLastStats(){
	debug('LastStats()')
	if($('table#plst tr').length==0){
		var matches = getJSONlocalStorage('matches2')
		var matchespl = getJSONlocalStorage('matchespl2')
		var html = '<tr><td>нет данных</td></tr>'
		if(matches && matchespl){
			html = ''
			var num = 1
			for(i in matchespl){
				var mpl = matchespl[i]
//				debug(String(players[0].firstname)[0]+'.'+players[0].secondname + ':'+i)
				if(i==String(players[0].firstname)[0]+'.'+players[0].secondname){
					var matchpos = [,'GK',,
					,,'SW',,,
					'R DF','C DF','C DF','C DF','L DF',
					'R DM','C DM','C DM','C DM','L DM',
					'R M','C M','C M','C M','L M',
					'R AM','C AM','C AM','C AM','L AM',
					,'FW','FW','FW',,
					,'FW','FW','FW',,
					'L AM','C AM','C AM','C AM','R AM',
					'L M','C M','C M','C M','R M',
					'L DM','C DM','C DM','C DM','R DM',
					'L DF','C DF','C DF','C DF','R DF',
					,,'SW',,,
					,'GK']

					for(j in matches){
						var mch = matches[j]
						if(mpl[mch.id]!=undefined){
							var mchpl = mpl[mch.id]
							var date = '&nbsp;'
							if(mch.dt!=undefined){
								var dt = new Date(mch.dt*100000)
								mdate = parseInt(dt.getDate())
								mmonth = parseInt(dt.getMonth())+1
								date =  (mdate<10?'0':'')+mdate+'.'+(mmonth<10?0:'')+mmonth//+ '.'+dt.getFullYear()
							}
							var type	= '&nbsp;'
							if(mch.tp!=undefined){
								switch(mch.tp){
									case 't': type='Товарищеский';break;
									//case 'c': type='Кубок'
									default: type = mch.tp
								}
							}
							var t1 	= (mch.hnm==undefined ? '<b>'+players[0].team+'</b>' : mch.hnm)
							var t2 	= (mch.anm==undefined ? '<b>'+players[0].team+'</b>' : mch.anm)
							var t1u = ''
							var t2u = ''
							if(mch.ust!=undefined){
								var ust = mch.ust.split('.')
								t1u = (ust[1]==undefined || ust[1]=='h' ? (ust[0]=='p' ? '(прд)' : '(акт)' ).fontcolor('red') : '') //p.h a.h p
								t2u = (ust[1]==undefined || ust[1]=='a' ? (ust[0]=='p' ? '(прд)' : '(акт)' ).fontcolor('red') : '') //p.a a.a p
							}
							var minute	= (mchpl.m==undefined ? (mch.m==undefined?'&nbsp;':mch.m+'\'') : mchpl.m+'\'')
							var im		= (mchpl.im!=undefined ? true : false)
							var mark	= (mchpl.mr!=undefined ? (im?'<b>':'')+mchpl.mr+(im?'</b>':'') : '&nbsp;')
							var cp		= (mchpl.cp!=undefined ? 'кэп' : '')+'&nbsp;'
							//var goals	= (mchpl.g!=undefined ? '<img src="system/img/refl/ball.gif" width=10></img>'+(mchpl.g==2 ? '<img src="system/img/refl/ball.gif" width=10></img>' : (mchpl.g>2 ? '('+mchpl.g+')' : '')) : '&nbsp;')
							var goals	= (mchpl.g!=undefined ? mchpl.g : '&nbsp;')
							var cards	= (mchpl.cr!=undefined ? '<img src="system/img/gm/'+mchpl.cr+'.gif"></img>' : '&nbsp;')
							var inz		= (mchpl.in!=undefined ? '<img src="system/img/gm/in.gif"></img>' : (minute<mch.m ? '<img src="system/img/gm/out.gif"></img>':'&nbsp;'))
							var pos		= '&nbsp;'
							if(mchpl.ps!=undefined){
								pos = ''
								var posarr = String(mchpl.ps).split(':')
								for(n in posarr){
									var posname = matchpos[parseInt(posarr[n])]
									var red1 = ''
									var red2 = ''
									if(players[0].position && !filterPosition(players[0].position,posname)){
										red1 = '<font color=red>'
										red2 = '</font>'
									}
									pos	+= (n==0?'':',')+red1+posname+red2
								}
							}

							var tr = '<tr class=back3>'
							tr += '<td align=right>'+date+'</td>'
							tr += '<td align=right>'+inz+minute+'</td>'
							tr += '<td>'+pos+'</td>'
							tr += '<td align=right>'+mark+'</td>'
							tr += '<td align=center>'+goals+'</td>'
							tr += '<td>'+cards+cp+'</td>'
							//tr += '<td><img src="system/img/w'+(mch.w==undefined?0:mch.w)+'.png"></img> '+(mch.n!=undefined?'N':'')+'</td>'
							tr += '<td align=right>'+t1+t1u+'</td>'
							tr += '<td align=center>'+(mch.h!=undefined?'<a href="plug.php?p=refl&t=if&j='+mch.id+'&z='+mch.h+'">':'')+mch.res+(mch.h!=undefined?'</a>':'')+'</td>'
							tr += '<td>'+t2+t2u+'</td>'
							//tr += '<td>'+type+'</td>'
							tr += '</tr>'
							html = tr+html
							num++
						}
					}
					html = '<tr class=back2 height=20><td>N</td><td>мин</td><td>поз</td><td>рейт</td><td>голы</td><td>&nbsp;</td>'
					//		+'<td>&nbsp;</td>'
							+'<td colspan=3 align=center>матч</td>'
					//		+'<td>турнир</td>'
							+'</tr>'
							+html
					break
				}
			}
		}
		$('table#plst').append(html)
	}
	if ($('a#plst').html() == '+'){
		$('table#plst tr').show()
		$('a#plst').html('&ndash;')
	}else{
		$('table#plst tr').hide()
		$('a#plst').html('+')
	}
}

$().ready(function() {
	debug('размер0:'+$('table:eq(0)').attr('width'))
	var bbig = false
	if($('table:eq(0)').attr('width')>=1000) {
		bbig = true
		$('table.border:eq(2)').attr('width',$('table:eq(0)').attr('width')-200)
	}

	$('td.back4 table table tr[bgcolor=#a3de8f]').removeAttr('bgcolor').addClass('back3')

	if(UrlValue('t')=='plast' || UrlValue('t')=='plast2') return false
	today = new Date()
	todayTmst = today.valueOf()

	// Draw left and right panels
	var preparedhtml = ''
	preparedhtml += '<table align=center cellspacing="0" cellpadding="0" id="crabglobal"><tr>'
	preparedhtml += '<td id="crabgloballeft" width='+(bbig ? 0 : 200)+' valign=top></td>'
	preparedhtml += '<td id="crabglobalcenter" valign=top></td>'
	preparedhtml += '<td id="crabglobalright" width=200 valign=top>'
	preparedhtml += '<table id="crabrighttable" class=back3 width=100%><tr><td height=100% valign=top id="crabright"></td></tr></table>'
	preparedhtml += '</td></tr></table>'
	$('body table.border:last').before(preparedhtml)

	var ssp = 0


	for(i in skillnames){
		sklfr[skillnames[i].rlong] = skillnames[i]
		sklfr[skillnames[i].rlong].elong = i
	}
	sklfr['Игра на выходах'] = sklfr['Игра головой']

	// get player skills
	var skillsum = 0
	$('td.back4 table:first table:first td:even').each(function(){
		var skillarrow = ''
		var skillname = $(this).find('script').remove().end().html().replace(/<!-- [а-я] -->/g,'');
		var skillvalue = parseInt($(this).next().find('script').remove().end().html().replace('<b>',''));
		if ($(this).next().find('img').attr('src') != undefined){
			skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
		}
		skillsum += (isNaN(skillvalue) ? 0 : skillvalue);
		if(sklfr[skillname]!=undefined) players[0][sklfr[skillname].elong] = skillvalue + skillarrow;
	})
	if(players[0].heading==undefined) players[0].heading = '??'
	if(players[0].handling==undefined) players[0].handling = '??'
	if(players[0].reflexes==undefined) players[0].reflexes = '??'

	players[0].sumskills = skillsum

	//add sum of skills to page
	$('td.back4 table center:first').append('(сс='+String(skillsum)+')')

	//get player header info
	var ms = $('td.back4 table center:first').html().replace('<b>','').replace('</b>','').replace(/<!-- [а-я] -->/g,'').split('<br>',6)
	var j = 0

	var name = ms[j].split(' (',1)[0].split(' <',1)[0]
	if (name.indexOf(' ')!=-1){
		players[0].firstname = name.split(' ',1)[0]
		players[0].secondname = name.replace(players[0].firstname+' ' ,'')
	} else {
		players[0].firstname = ''
		players[0].secondname = name
	}	

	players[0].team = ''
	players[0].sale = 0

	players[0].t = UrlValue('t')

	if (players[0].t =='p' ||players[0].t =='pp') {
		players[0].team		= $('td.back4 a:first').text()
		players[0].teamid	= UrlValue('j',$('td.back4 a:first').attr('href'))
		players[0].teamhash = UrlValue('z',$('td.back4 a:first').attr('href'))
	} else if (players[0].t =='p2'){
		players[0].team = 'свободный'
	}
	// школяр!
	if (players[0].t == 'yp' || players[0].t == 'yp2') {
		players[0].flag = 5
	}
	players[0].id  = UrlValue('j')
	players[0].hash = UrlValue('z')
	if($('a:[href^="plug.php?p=tr&t=ncyf&n=yf"]').length>0){
		//значит молодеж
		players[0].flag = 7
	}

 	j++
	if (ms[j].indexOf('в аренде') !=-1) j++
	players[0].age = +ms[j].split(' ',1)[0]
	if (ms[j].indexOf('(матчей')>-1){
		players[0].natfull = ms[j].split(', ',2)[1].split(' (',1)[0]
		players[0].internationalapps = +ms[j].split(', ',2)[1].split('матчей ',2)[1]
		players[0].internationalgoals = +ms[j].split(', ',3)[2].split(' ',2)[1].replace(')','')
		if (ms[j].indexOf('U21')>-1){
			players[0].u21apps = +ms[j].split('/ U21 матчей ',2)[1].split(',',1)[0]
			players[0].u21goals = +ms[j].split('/ U21 матчей ',2)[1].split(', голов ',2)[1].replace(')','')
		} else {
			players[0].u21apps = 0
			players[0].u21goals = 0
		}
	} else {
		players[0].natfull = ' '
		players[0].internationalapps = 0
		players[0].internationalgoals = 0
		players[0].u21apps = 0
		players[0].u21goals = 0
	}
//	$('td.back4').prepend('get '+players[0].internationalapps+players[0].u21apps +'<br>')
	j++
	if (ms[j].indexOf('Контракт:')!=-1) {
		players[0].contract = +ms[j].split(' ',4)[1]
		players[0].wage = +ms[j].split(' ',4)[3].replace(/,/g,'').replace('$','')
		j++
	} else {
		if (UrlValue('t') == 'yp' || UrlValue('t') == 'yp2'){
			players[0].contract = 21 - players[0].age
			players[0].wage = 100
		} else {
			players[0].contract = 0
			players[0].wage = 0
		}
	}
	if (ms[j].indexOf('Номинал:') != -1) {
		players[0].value = +ms[j].split(' ',2)[1].replace(/,/g,'').replace('$','')
		j++
	} else {
		players[0].value = 0
	}
	players[0].valuech = 0

	if (ms[j].indexOf('Клуб требует:') != -1) {
		j++
		players[0].sale = 1
	}
	players[0].position = ms[j]

	$('td.back4 table:first table:eq(1) tr:gt(0)').each(function(i, val){
		players[0]['ig'+i] = parseInt($(val).find('td:eq(1)').text())
		players[0]['gl'+i] = parseInt($(val).find('td:eq(2)').text())
		players[0]['ps'+i] = parseInt($(val).find('td:eq(3)').text())
		players[0]['im'+i] = parseInt($(val).find('td:eq(4)').text())
		players[0]['sr'+i] = parseFloat(($(val).find('td:eq(5)').text() == '' ? 0 : $(val).find('td:eq(5)').text()))
	})

	players[0].newpos = ''	
	// get post-info
	var ms2 = $('td.back4 > center:first').html()
	if (ms2 != null){
		if(ms2.indexOf('New pos:')!=-1) {
			players[0].newpos = ms2.split('New pos: ')[1].split('<')[0]
			$('td.back4 table center:first b:first').after(' ('+players[0].newpos + ')')
		}

		var j2 = 0
		ms2 = ms2.replace(/<!-- [а-я] -->/g,'').split('<br>')
		players[0].form = +ms2[j2].split(': ',2)[1].split('%',1)[0]
		players[0].morale = +ms2[j2].split(': ',3)[2].replace('%</i>','')
		j2++;j2++;j2++;j2++
		// Национальные турниры:
		if(ms2[j2].split(': ',2)[0]=='Дисквалифицирован') j2++
		players[0].zk0 = +ms2[j2].split(': ',2)[1]
		j2++
		players[0].kk0 = +ms2[j2].split(': ',2)[1]
		j2++;j2++;j2++
		// Международные турниры:
		if(ms2[j2].split(': ',2)[0]=='Дисквалифицирован') j2++
		players[0].zk2 = +ms2[j2].split(': ',2)[1]
		j2++
		players[0].kk2 = +ms2[j2].split(': ',2)[1]
		j2++;j2++;j2++
		// Сборная:
		if(ms2[j2].split(': ',2)[0]=='Дисквалифицирован') j2++
		players[0].zk3 = +ms2[j2].split(': ',2)[1]
		j2++
		players[0].kk3 = +ms2[j2].split(': ',2)[1]

		players[0].zk4 = ' '
		players[0].kk4 = ' '

		$('td.back4 table:first table:eq(1) tr:first')
			.find('td:eq(0)').attr('width','27%').end()
			.find('td:eq(1)').attr('width','10%').end()
			.find('td:gt(1)').attr('width','13%').end()
			.find('td:last').attr('width','8%').end()
			.append('<td width=8%>ЖК <img src="system/img/gm/y.gif"></img></td><td width=8%>КК <img src="system/img/gm/r.gif"></img></td>')
		$('td.back4 table:first table:eq(1) tr:gt(0)').each(function(i,val){
			if(i==0)		$(val).append('<td rowspan=2>'+players[0].zk0+'</td><td rowspan=2>'+players[0].kk0+'</td>')
			else if(i==2)	$(val).append('<td>'+players[0].zk2+'</td><td>'+players[0].kk2+'</td>')
			else if(i==3)	$(val).append('<td>'+players[0].zk3+'</td><td>'+players[0].kk3+'</td>')
			else if(i==4)	$(val).append('<td></td><td></td>')
		})
	} else {
		players[0].form = 0
		players[0].morale = 0
		for(i=0;i<=4;i++){
			players[0]['ig'+i] = 0
			players[0]['gl'+i] = 0
			players[0]['ps'+i] = 0
			players[0]['im'+i] = 0
			players[0]['sr'+i] = 0
			players[0]['zk'+i] = 0
			players[0]['kk'+i] = 0
		}

	}

	var mm = ''
	// fill poss masive

	var text3 = ''
	text3 += '<br><b>Номинал+</b>: <b><sup><a href="#" onClick="alert(\'Корректировка номинала получена с помощью оценки сделок предыдущего ТО по игрокам данной категории (позиция, возраст, номинал, некоторые профы)\')">?</a></sup></b><br>'
	text3 += '<div id="SValue"><a href="javascript:void(RelocateGetNomData())">Показать</a></div>'
	text3 += '<br><a id="remember" href="javascript:void(RememberPl(0))">'+('Запомнить игрока').fontsize(1)+'</a><br>'
	text3 += '<div id="compare"></div>'
	text3 += '<br><br><a id="codeforforum" href="javascript:void(CodeForForum())">'+('Код для форума').fontsize(1)+'</a><br><br>'
	text3 += '<b>Сила&nbsp;игрока</b><div id=str>'
	text3 += '<i><font size=1>сходите в Состав+</font></i>'
	text3 += '</div>'
//	text3 += '&nbsp;(<a href="javascript:void(ShowAll())">'+('x').fontsize(1)+'</a>)'

	var hidden = 0
	var pfs3pre = ''
	var pflinkpre = ''
/**
	for (var s in posfilter) {
		if (!isNaN(posfilter[s][2])) {
			var linktext = String(posfilter[s][2]+':'+posfilter[s][1].replace(' ','&nbsp;'))
			if (posfilter[s][0]<1 && hidden == 0) hidden = 1
			if ( hidden ==1) {
				hidden = 2
				text3 += '<br><a id="mya" href="javascript:void(OpenAll())">...</a>'
				text3 += '<div id="mydiv">'
			}
			if (pfs3pre != posfilter[s][3] || pflinkpre != linktext) text3 += '<br><a href="javascript:void(ShowSkills(\''+posfilter[s][3]+'\'))">'+linktext.fontsize(1)+'</a>'
		}
		var pfs3pre = posfilter[s][3]
		var pflinkpre = linktext
	}

	text3 += '</div>'
/**/
	// Modify page and fill data
	$('td.back4 script').remove()
	$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
	$('#crabrighttable').addClass('border') 
	$("#crabright").html(text3)
	$("#mydiv").hide()
	$('center:eq(1) ~ br:first').before('<div id="th0"><a id="th0" href="javascript:void(ShowTable(0))">&ndash;</a></div>').remove()
	$('center:eq(2) ~ br').before('<div id="th1"><a id="th1" href="javascript:void(ShowTable(1))">&ndash;</a></div>').remove()

	$('td.back4 table table:eq(1)').attr('id','stat')

	if(players[0].teamid == parseInt(localStorage.myteamid)){
		var statsplayer = '<br><div id="plst" align=center>Последние матчи</div>'
		statsplayer += '<div id="plst"><a id="plst" href="javascript:void(ShowLastStats())">+</a></div>'
		statsplayer += '<table width=100% id="plst"></table>'
		$('td.back4 table table:eq(1)').after(statsplayer)
	}

	var statseasons = '<br><div id="kar" align=center>Карьера '+('(<a id="mh" href="javascript:void(ModifyHistory())">more</a>)').fontsize(1)+'</div><br>'
	statseasons += '<table width=100% id=ph0></table>'
	$('td.back4 table table:eq(1)').after(statseasons)

	// добавим ссылку на заметки
	if(UrlValue('t')!='yp') $('td.back4'+(UrlValue('t')!='yp2' ? ' center:last' : '')).append("<br><a href=\"javascript:hist('"+players[0].id+"','n')\">Заметки</a>")

	// Get info fom Global or Session Storage
	var text1 = String(localStorage.peflplayer)
	if (text1 != 'undefined'){
		var pl = text1.split(',');
		for (i in pl) {
			key = pl[i].split('=')
			var pn = (key[0].split('_')[1] == undefined ? 2 : key[0].split('_')[1])
			players[pn][key[0].split('_')[0]] = [key[1]]
		}
		PrintPlayers()
	}
	GetPlayerHistory(0,players[0].id)
	GetValue()
	ShowAdaptation(players[0].natfull)
	RelocateGetNomData()
	GetData('positions')
	printStrench()
}, false)
