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

function RelocateGetNomData(arch){
	debug('RelocateGetNomData('+arch+')')
	if(arch==undefined) arch = '';
	if(localStorage.getnomdata != undefined && String(localStorage.getnomdata).indexOf('1.1$')!=-1){
		debug('Storage.getnomdata ok!')
		GetNomData(0)
		//GetFinish('getnomdata', true)
	}else{
		var top = (localStorage.datatop != undefined ? localStorage.datatop : 9885110) //9107893
		debug('Storage.getnomdata('+top+')')
		var url_top = 'm=posts'+arch+'&p='+top

		if($('#debval').length==0) $('td.back4').prepend('<div style="display: none;" id=debval></div>') 
		$('div#debval').load('forums.php?'+url_top+' td.back3:contains(#CrabNom1.1.'+top+'#) blockquote pre', function(){
			if($('#debval').html()=='' && arch==''){
				RelocateGetNomData('&arch=1')
			}else{
				$('div#debval').find('hr').remove()
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
			}
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
			var peflnation ={'Албания':1,'Алжир':2,'Восточное Самоа':3,'Андорра':4,'Ангола':5,'Ангуилла':6,'Антигуа':7,'Аргентина':8,'Армения':9,'Аруба':10,'Австралия':11,'Австрия':12,'Азербайджан':13,'Багамы':14,'Бахрейн':15,'Бангладеш':16,'Барбадос':17,'Беларусь':18,'Бельгия':19,'Белиз':20,'Бенин':21,'Бермуды':22,'Бутан':23,'Боливия':24,'Босния':25,'Ботсвана':26,'Бразилия':27,'Виргинские о-ва':28,'Бруней':29,'Болгария':30,'Буркина Фасо':31,'Бурунди':32,'Комбоджа':34,'Камерун':35,'Канада':36,'Кабо-Верде':37,'Каймановы о-ва':38,'ЦАР':39,'Чад':40,'Чили':41,'Китай':42,'Тайвань':43,'Колумбия':44,'Конго':45,'О-ва Кука':46,'Коста Рика':47,'Хорватия':48,'Куба':49,'Кипр':50,'Чехия':51,'Дания':53,'Джибути':54,'Доминика':55,'Доминиканская р-ка':56,'Эквадор':58,'Египет':59,'Сальвадор':60,'Англия':61,'Экв. Гвинея':62,'Эритрея':63,'Эстония':64,'Эфиопия':65,'Македония':66,'Фарерские о-ва':67,'Фиджи':68,'Финляндия':69,'Франция':70,'Габон':71,'Гамбия':72,'Грузия':73,'Германия':74,'Гана':75,'Греция':76,'Гренада':77,'Гуам':78,'Гватемала':79,'Гвинея':80,'Гвинея-Бисау':81,'Гайана':82,'Гаити':83,'Голландия':84,'Гондурас':85,'Гон-Конг':86,'Венгрия':87,'Исландия':88,'Индия':89,'Индонезия':90,'Иран':91,'Ирак':92,'Ирландия':93,'Израиль':94,'Италия':95,'Кот`д`Ивуар':96,'Ямайка':97,'Япония':98,'Иордания':99,'Казахстан':100,'Кения':101,'Кувейт':102,'Киргизия':103,'Лаос':104,'Латвия':105,'Ливан':106,'Лесото':107,'Либерия':108,'Ливия':109,'Лихтенштейн':110,'Литва':111,'Люксембург':112,'Макао':113,'Мадагаскар':114,'Малави':115,'Малайзия':116,'Мальдивы':117,'Мали':118,'Мальта':119,'Мавритания':120,'Маврикий':121,'Мексика':122,'Молдова':123,'Монголия':124,'Монсеррат':125,'Марокко':126,'Мозамбик':127,'Мьянмар':128,'Северная Ирландия':129,'Намибия':130,'Непал':131,'Кюрасао':132,'Новая Каледония':133,'Новая Зеландия':134,'Никарагуа':135,'Нигер':136,'Нигерия':137,'Северная Корея':138,'Норвегия':139,'Оман':140,'Пакистан':141,'Палестина':142,'Панама':143,'Папуа Новая Гвинея':144,'Парагвай':145,'Перу':147,'Филиппины':148,'Польша':149,'Португалия':150,'Пуэрто-Рико':151,'Катар':152,'ДР Конго':153,'Румыния':154,'Россия':155,'Руанда':156,'Зап. Самоа':157,'Сан-Марино':158,'Томе':159,'Саудовская Аравия':160,'Шотландия':161,'Сенегал':162,'Сейшельские о-ва':163,'Сьерра-Леоне':164,'Сингапур':165,'Словакия':166,'Словения':167,'Соломоновы о-ва':168,'Сомали':169,'ЮАР':170,'Южная Корея':171,'Испания':172,'Шри-Ланка':173,'Сент-Киттс':174,'Лусия':175,'Сент-Винсент':176,'Судан':177,'Суринам':178,'Свазиленд':179,'Швеция':180,'Швейцария':181,'Сирия':182,/**'Таити':183,	//дублируется 216ым/**/'Таджикистан':184,'Танзания':185,'Таиланд':186,'Того':188,'Тонга':189,'Тринидад и Тобаго':190,'Тунис':191,'Турция':192,'Туркменистан':193,'Каикос':194,'ОАЭ':195,'США':196,'Уганда':199,'Украина':200,'Уругвай':201,'Узбекистан':202,'Вануату':203,'Венесуэла':204,'Вьетнам':205,'Уэльс':207,'Йемен':208,'Сербия':209,'Заир':153, /** 210, эт щас ДР Конго - поэтому сошлемся на его id/**/'Замбия':211,'Зимбабве':212,'Гваделупа':213,'Черногория':214,'Коморские острова':215,'Таити':216,'Афганистан':217}
			var peflcountry={1:0,2:1,8:2,9:3,11:4,12:5,13:6,18:7,19:8,24:9,25:10,27:11,30:12,41:13,42:14,44:15,47:16,48:17,50:18,51:19,53:20,58:21,59:22,61:23,64:24,66:25,69:26,70:27,73:28,74:29,76:30,84:31,87:32,88:33,91:34,93:35,94:36,95:37,98:38,100:39,105:40,111:41,122:42,123:43,126:44,129:45,137:46,139:47,145:48,147:49,149:50,150:51,152:52,154:53,155:54,160:55,161:56,166:57,167:58,170:59,171:60,172:61,180:62,181:63,191:64,192:65,195:66,196:67,200:68,201:69,202:70,204:71,96:72,207:73,209:74,214:75}
			var ad = s_adaptationMap[peflnation[plnat]][peflcountry[parseInt(localStorage.mycountry)]]+'0%'
			var txt = plnat+' > '+localStorage.mycountry.split('.')[1]+':<br>вероятность адаптации <b>'+ad+'</b><br><br>'
			$("#crabright").append('<br><br>'+txt)
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
/**
	var ttext = $('td.back4 table center:first').html().split('<br>')
	for(i in ttext){
		if(ttext[i].indexOf('Номинал')!=-1) ttext[i]=ttext[i]+(vlch==0?'':' <sup>'+(vlch>0 ? '<font color=green>+'+vlch/1000 : '<font color=red>'+vlch/1000)+'</font></sup>')
	}
	$('td.back4 table center:first').html(ttext.join('<br>'))
/**/
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

function sSkills(i, ii) { // Сортировка
    if 		(i[0] < ii[0])	return  1
    else if	(i[0] > ii[0])	return -1
    else					return  0
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

	var season = 0;
	var data ={};
	for(i in players[nn]){
		debug('case \''+i+'\':')
		switch(i){
		case 'sumskills':
		case 's':
		case 't':
		case 'flag':
		case 'team':
		case 'teamid':
		case 'teamhash':
		case 'id':
		case 'hash':
		case 'contract':
		case 'valuech':
		case 'newpos':
		case 'ig0':
		case 'gl0':
		case 'ps0':
		case 'im0':
		case 'sr0':
		case 'zk0':
		case 'kk0':
		case 'zk1':
		case 'kk1':
		case 'ig1':
		case 'gl1':
		case 'ps1':
		case 'im1':
		case 'sr1':
		case 'ig2':
		case 'gl2':
		case 'ps2':
		case 'im2':
		case 'sr2':
		case 'zk2':
		case 'kk2':
		case 'ig3':
		case 'gl3':
		case 'ps3':
		case 'im3':
		case 'sr3':
		case 'zk3':
		case 'kk3':
		case 'ig4':
		case 'gl4':
		case 'ps4':
		case 'im4':
		case 'sr4':
		case 'zk4':
		case 'kk4':
		case 'sale':
		case 'morale':
		case 'form':
		case 'natfull':
		case 'nation':
		case 'internationalgoals':
		case 'u21goals':
		case 'firstname':break;
		case 'secondname': data['pname'] = (players[nn].nation!=undefined ? players[nn].nation : 217)+'|'+players[nn]['firstname']+' '+players[nn][i]+'|p=refl&t='+players[nn]['t']+'&j='+players[nn]['id']+'&z='+players[nn]['hash'];break;
		case 'internationalapps': data['int'] =players[nn][i]+'.'+players[nn]['internationalgoals'];break;
		case 'u21apps':data['u21'] =players[nn][i]+'.'+players[nn]['u21goals'];break;
		case 'value':
			data[i]=ShowValueFormat(players[nn][i]/1000);
			break;
		default: data[i]=String(players[nn][i]);
		}
	}
	var cur = {
		'pname':'<img height="12" src="system/img/flags/mod/'+players[0].nation+'.gif"> '+'<b>'+players[0]['firstname']+' '+players[0]['secondname']+'</b>',
		'age':players[0]['age'],
		'value':ShowValueFormat(players[0]['value']/1000),
		'int':'матчей '+players[0]['internationalapps']+', голов '+players[0]['internationalgoals'],
		'u21':'матчей '+players[0]['u21apps']+', голов '+players[0]['u21goals'],
		'position':players[0]['position'],
		'wage':players[0]['wage'],
		'curseason':13
	}

	$('table#stat,span#err,#dcode1').hide();
	$('#dcode1').html('');
	$('table#res,table#skills').show();
	if(sknum==3){
		sknum=0;
		$('table[id^="res"], td[id^="res"]').remove();
	}
	if(sknum==0) $('table#stat').before('<table id=res class=back1 align=center width=70% cellpadding=2 cellspacing=1><tr><td nowrap id=thx align=center class=back2>[<a href="javascript:void(SkReset())"><font color=red>Х</font> сбросить</a>]</td></tr></table>');
	sknum++;
	$('td#thx').after('<td nowrap width=30%>'+(season!=0 ? '<b>'+season+' сезон</b>' : ' ')+'</td>');
	var ssn = 0;
	if(data['pname']==undefined) data['pname']='';
	for(i in data){
		var nm = (lc[i]==undefined ? i : lc[i].rn);
		if($('td#'+i).length==0){
			$('table#res').prepend('<tr class=back2><td nowrap id='+i+'>'+nm+'</td><td nowrap>'+(cur!=undefined && cur[i]!=undefined ? cur[i] : '')+'</td></tr>');
		}
		switch(i){
		case 'dribbling':
		case 'finishing':
		case 'passing':
		case 'crossing':
		case 'longshots':
		case 'technique':
		case 'tackling':
		case 'heading':
		case 'handling':
		case 'corners':
		case 'freekicks':
		case 'positioning':
		case 'vision':
		case 'workrate':
		case 'reflexes':
		case 'marking':
		case 'leadership':
		case 'pace':
		case 'strength':
		case 'stamina':
			if($('td#'+i).length>0){
				var x=data[i].split('.');
				ssn = ssn+(isNaN(parseInt(x[0])) ? 0 : parseInt(x[0]));
				var ch = parseInt($('td#'+i).next().text())-parseInt(x[0]);
				if(ch>0) ch = '<font color=green size=1>+'+ch+'</font>';
				else if(ch<0) ch ='<font color=red size=1>'+ch+'</font>'
				else ch='';
				var m = $('td#'+i).next().clone()
					.attr('id','res')
					.each(function(){
						if($(this).find('span').length>0) $(this).find('span').html('<font color=gray>'+x[0]+'</font>'+(x[1]!=undefined ? ' <img height=10 src=system/img/g/'+x[1]+'.gif>' :'')+'<sup>'+ch+'</sup>')
						else $(this).html('<font color=gray>'+x[0]+'</font>'+(x[1]!=undefined ? ' <img height=10 src=system/img/g/'+x[1]+'.gif>' :'')+'<sup>'+ch+'</sup>')
					})
				$('td#'+i).after(m);
			}
			break;
		case 'int':
		case 'u21':
			var x=data[i].split('.');
			$('td#'+i).after('<td nowrap><font color=gray>'+(x[0]>0 ? 'матчей '+x[0]+', голов '+x[1] : '')+'</font></td>');
			break;
		case 'pname':
			var x=data[i].split('|');
			$('td#'+i).after('<td nowrap>'+(x[0]==''?'':'<img height="12" src="system/img/flags/mod/'+x[0]+'.gif"> <a href="plug.php?'+x[2]+'"><b>'+x[1]+'</b></a>')+'</td>');
			break;
		default: 
			$('td#'+i).after('<td nowrap><font color=gray>'+data[i]+'</font></td>');
		}
	}
	$('td[id^="ss"]').attr('colSpan',sknum+2);
	$('#s').after('<td class=back1 id=res>'+ssn+'</td>');

	return false
}

function UrlValue(key,url){
	var pf = (url ? url.split('?',2)[1] : location.search.substring(1)).split('&')
	for (n in pf) {
		if (pf[n].split('=')[0] == key) return pf[n].split('=')[1];
	}
	return false
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

$().ready(function() {
/**/
	if($('table#hd1').length==0) {
		debug('old roster: exit');
		return false;
	}
	if(UrlValue('t')=='plast' || UrlValue('t')=='plast2') return false

	debug('размер0:'+$('table:eq(0)').attr('width'))
	var bbig = false
	if($('table:eq(0)').attr('width')>=1000) {
		bbig = true
		$('table.border:eq(2)').attr('width',$('table:eq(0)').attr('width')-200)
	}

//	$('td.back4 table table tr[bgcolor=#a3de8f]').removeAttr('bgcolor').addClass('back3')

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
/**/
/**
	for(i in skillnames){
		sklfr[skillnames[i].rlong] = skillnames[i]
		sklfr[skillnames[i].rlong].elong = i
	}
	sklfr['Игра на выходах'] = sklfr['Игра головой']
/**/

	// get player skills

/**/
	var skillsum = 0
	$('table#skills td:even').each(function(){
		var skilleng   = $(this).attr('id');
		var skillname  = $(this).html();
		var skillvalue = parseInt($(this).next().html().replace('<b>',''))
		var skillarrow = ''
		if(skilleng=='s') players[0].sumskills = skillvalue;
		else{
			if ($(this).next().find('img').attr('src') != undefined){
				skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
			}
		}
		players[0][skilleng] = skillvalue + skillarrow;

		//$('td.back4').append(skillname+':'+skilleng+':'+skillvalue+skillarrow+'<br>')
	})
	if(players[0].marking==undefined) players[0].marking = '??'
	if(players[0].corners==undefined) players[0].corners = '??'
	if(players[0].heading==undefined) players[0].heading = '??'
	if(players[0].handling==undefined) players[0].handling = '??'
	if(players[0].reflexes==undefined) players[0].reflexes = '??'

	//get player header info

	var name = $('table#hd1 td:first font').html();
	if (name.indexOf(' ')!=-1){
		players[0].firstname = name.split(' ',1)[0]
		players[0].secondname = name.replace(players[0].firstname+' ' ,'')
	} else {
		players[0].firstname = ''
		players[0].secondname = name
	}	
	players[0].nation = parseInt($('table#hd1 td:eq(1) img').attr('src').split('mod/')[1]);
	players[0].natfull = $('table#hd1 td:eq(2) font').html().split('<br>')[0];

	var mnat = $('table#hd1 td:eq(3) font').html().split('<br>');
	if(mnat[0]!=''){
		players[0].internationalapps  = parseInt(mnat[0].split(' ')[1]);
		players[0].internationalgoals = parseInt(mnat[0].split(' ')[3]);
	}else{
		players[0].internationalapps  = 0;
		players[0].internationalgoals = 0;
	}
	if(mnat[1]!=undefined){
		players[0].u21apps  = parseInt(mnat[1].split(' ')[1])
		players[0].u21goals = parseInt(mnat[1].split(' ')[3])
	}else{
		players[0].u21apps  = 0;
		players[0].u21goals = 0;
	}

	players[0].form = ($('table#hd1').next().find('tr:first td:first b').text()=='' ? 0 : parseInt($('table#hd1').next().find('tr:first td:first b').text()));
	players[0].morale = ($('table#hd1').next().find('tr:first th:first').text()=='' ? 0 : parseInt($('table#hd1').next().find('tr:first th:first').text()));

	players[0].team = ''
	players[0].t = UrlValue('t')

	if (players[0].t =='p2') {
		players[0].team = 'свободный'
	} else {
		if($('table#hd1').next().find('tr:first font').length>0){
			players[0].team		= $('table#hd1').next().find('tr:first font:first').text()
			players[0].teamid	= UrlValue('j',$('table#hd1').next().find('tr:first a:first').attr('href'))
			players[0].teamhash = UrlValue('z',$('table#hd1').next().find('tr:first a:first').attr('href'))
		}
	}

	// школяр!
	if (players[0].t == 'yp' || players[0].t == 'yp2') {
		players[0].flag = 5;
	}
	players[0].id  = UrlValue('j');
	players[0].hash = UrlValue('z');
	if($('a:[href^="plug.php?p=tr&t=ncyf&n=yf"]').length>0){
		//значит молодежь
		players[0].flag = 7;
	}

	players[0].contract = 0;
	players[0].wage = 0;
	players[0].value = 0;
	players[0].valuech = 0;

	players[0].newpos = '';

	$('table#hd2 table tr').each(function(){
		var xname = $(this).find('td:first').html();
		var xvalue= $(this).find('td:last b').html();
		debug(xname+':'+xvalue);
		switch(xname){
			case 'Возраст:': players[0].age = parseInt(xvalue);break;
			case 'Позиция:': players[0].position = xvalue;break;
			case 'Номинал:': if(xvalue!='') players[0].value = xvalue.replace(/,/g,'').replace('$','');break;
			case 'Контракт:':
				if(xvalue!=''){
					players[0].contract = parseInt(xvalue);
					players[0].wage = xvalue.split('г. ')[1].replace(/,/g,'').replace('$','');
				}
				break;
		}
	})
	if($('table#stat').length>0){
		$('table#stat tr:gt(0)').each(function(i, val){
			players[0]['ig'+i] = parseInt($(val).find('td:eq(1)').text())
			players[0]['gl'+i] = parseInt($(val).find('td:eq(2)').text())
			players[0]['ps'+i] = parseInt($(val).find('td:eq(3)').text())
			players[0]['im'+i] = parseInt($(val).find('td:eq(4)').text())
			players[0]['sr'+i] = parseFloat(($(val).find('td:eq(5)').text() == '' ? 0 : $(val).find('td:eq(5)').text()))
			if(i!=1){
				players[0]['zk'+i] = ($(val).find('td:eq(6)').text()=='' ? ' ' : parseInt($(val).find('td:eq(6)').text()))
				players[0]['kk'+i] = ($(val).find('td:eq(7)').text()=='' ? ' ' : parseInt($(val).find('td:eq(7)').text()))
			}
		})
	}else{
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

	players[0].sale = 0;
	if($('table#hd2').parent().find('div:last').text()!=''){
		debug('info:'+$('table#hd2').parent().find('div:last').text())
		var xinfo = $('table#hd2').parent().find('div:last i').html().split('<br>');
		for(i in xinfo){
			if(xinfo[i].indexOf('Выставлен на трансфер')!=-1){
				players[0].sale = 1 //parseInt(xinfo[i].split('<b>')[1])
			}
		}
	}

	var mm = ''
	// fill poss masive

	var text3 = ''
	text3 += '<br><b>Номинал+</b>: <b><sup><a href="#" onClick="alert(\'Корректировка номинала получена с помощью оценки сделок предыдущего ТО по игрокам данной категории (позиция, возраст, номинал, некоторые профы)\')">?</a></sup></b><br>'
	text3 += '<div id="SValue"><a href="javascript:void(RelocateGetNomData())">Показать</a></div>'
	text3 += '<br><a id="remember" href="javascript:void(RememberPl(0))">'+('Запомнить игрока').fontsize(1)+'</a><br>'
	text3 += '<div id="compare"></div><br><br>'
	text3 += '<b>Сила&nbsp;игрока</b><div id=str>'
	text3 += '<i><font size=1>сходите в Состав+</font></i>'
	text3 += '</div>'

	// Modify page and fill data
	$('td.back4 script').remove()
	$('body table.border:has(td.back4)').appendTo( $('td#crabglobalcenter') );
	$('#crabrighttable').addClass('border') 
	$("#crabright").html(text3)
	$("#mydiv").hide()
	$('center:eq(1) ~ br:first').before('<div id="th0"><a id="th0" href="javascript:void(ShowTable(0))">&ndash;</a></div>').remove()
	$('center:eq(2) ~ br').before('<div id="th1"><a id="th1" href="javascript:void(ShowTable(1))">&ndash;</a></div>').remove()

//	$('td.back4 table table:eq(1)').attr('id','stat')

	// добавим ссылку на заметки
	if(UrlValue('t')!='yp') $("#crabright").append("<br><a href=\"javascript:hist('"+players[0].id+"','n')\">Заметки</a>")

	// Get info from Global or Session Storage
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

	GetValue();
	ShowAdaptation(players[0].natfull);
	RelocateGetNomData();
	GetData('positions');
	printStrench();

}, false)
