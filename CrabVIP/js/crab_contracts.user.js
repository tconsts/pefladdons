// ==UserScript==
// @name           peflcontracts
// @namespace      pefl
// @description    contracts modification
// @include        https://*pefl.*/plug.php?p=fin&t=ctr&*
// @include        https://*pefl.*/plug.php?p=tr&*
// @require			crab_funcs_db.js
// @encoding	   windows-1251
// ==/UserScript==

var teams = []

$().ready(function() {
	console.log('run crab_contract...');
	var t = UrlValue('t')
	var p = UrlValue('p')
	if(p=='tr'){
		if(t=='nc' || t=='ctrf'){
		/**
			$('td.back4').append('form:<br>')
				$("form").submit(function() {
				$('td.back4').append($("input:eq(0)").val()+'<br>')
				$('td.back4').append($("select:first").val()+'<br>')
				return false;
	    	});
		/**/
		}else if(t=='staff' || t=='alist' || t=='nlist' || t=='tlist' || t=='free'){
			$('td.back4 table tr[bgcolor]').addClass('back3').removeAttr('bgcolor')
		}else if(t=='transfers' || t=='transfers3' || t=='transfers4') {
			// fix table colors
			$('td.back4 table tr[bgcolor]').addClass('back3').removeAttr('bgcolor')
			GetTeams(parseInt(localStorage.mycountry),localStorage.mycountry.split('.')[1])
		}
	} else if(p=='fin'){
		// fix table colors
		$('td.back4 table table tr[bgcolor]').addClass('back3').removeAttr('bgcolor')

		if(!UrlValue('j')) showSchoolers();

		// расчет и отображение суммы увольнения и подсчет суммы зарплат
		var szp=0
		$('td.back4 table table tr').each(function(){
			var wage = parseInt($(this).find('td:eq(2)').html());
			var cnt = parseInt($(this).find('td:eq(3)').html());
			if(!isNaN(wage)) {
				szp += wage
				$(this).find('td:last:not(.sch)').after('<td width=5% align=right>'+((wage*cnt*25)/1000).toFixed(3)+'$</td>')
			}
		})
		var szptxt = '<hr><table width=100% id=sum><tr><td width=5%></td><td width=30% class=back3><b>Точная сумма зарплат:</b></td><td width=10% ALIGN=right class=back3><b>'+String((szp/1000).toFixed(3)).replace('.',',')+'$</b></td><td colspan=2></td></tr></table>';
		$('td.back4 table table:last').after(szptxt)
		$('td.back4').append('<br>*  - последняя колонка показывает сумму компенсации при увольнении')
		$('td.back4').append('<br>** - для учета в подсчете школьников сходите в школу<br><br>')
		if(UrlValue('j')) showSponsers()

		var tables = [];
		$('td.back4 table > table').each(function(i,val){
			if($(val).attr('id')==undefined || $(val).attr('id')=='') $(val).attr('id','x'+i);
			tables.push($(val).attr('id'));
		})
		var text = '</script><script type="text/javascript" src="js/fcode2.js"></script>';
		text+='<div align=right><a href="javascript:void(ShowCode([],\''+tables.join(',')+'\',\'forumcode\'))">код для форума</a></div>';
		$('td.back4 table table:first').before(text);
	}
});

function showSchoolers(){
	if(localStorage.schoolers!=undefined) { 
		var schoolers = JSON.parse(localStorage.schoolers);
		var schtable = '<hr>Школа:<hr><table width=100% id=sch>';
		if (schoolers.length > 0) {
			for(i in schoolers){
				var pl = schoolers[i];
				var num = parseInt(i,10)+1;
				schtable += '<tr>'
					+ '<td width=5%>'+num+'</td>'
					+ '<td width=30%><a href="'+pl.url+'">'+pl.name+'</a></td>'
					+ '<td width=10% align=right>100$</td>'
					+ '<td width=5%  align=center>'+ (pl.age > 20 ? 1 : 21-parseInt(pl.age)) + 'г.</td>'
					+ '<td></td>'
					+ '<td width=5% align=right class=sch>0$</td>'
					+ '</tr>';
			}
		}
		schtable += '</table>';
		$('td.back4 table table:eq(0)').after(schtable)
		$('table#sch tr:odd').addClass('back3')
	}

}

function showSponsers(){
	debug('showSponsers()')
	var page0 = $('td.back4').html().split('Макс. фонд зарплат: ')[1]
	var maxwage = parseInt((page0.split('$')[0]).replace(/\,/g,''))
	var fortrans = parseInt(page0.split(': ')[1].split('$')[0].replace(/\,/g,''))
	var finances = parseInt(page0.split('/ ')[1].split('$')[0].replace(/\,/g,''))
	debug('showSponsers:maxwage='+maxwage+':fortrans='+fortrans+':finanses='+finances)
	sponsers = 0
	if(fortrans==finances || fortrans == 0){
		sponsers = (finances<=0 ? maxwage : maxwage*100/130)/1000
	}else{
		
	}
	sptext = '<br>Спонсоры: '+(sponsers>999 ? String(parseFloat(sponsers/1000).toFixed(3)).replace(/\./g,',') : parseInt(sponsers))+',000$'
	debug('showSponsers:sponsers='+sponsers+':sptext='+sptext)
	if(sponsers!=0) $('td.back4 table table:last').after(sptext)
}

async function GetTeams(nid, nname) {
		debug('GetTeams:nid='+nid+':nname='+nname)
		if (ff) {
			debug('GetTeams as FF')
			let list = {'teams':'tid,my,did,num,tdate,tplace,ncode,nname,tname,mname,ttask,tvalue,twage,tss,avTopSumSkills,age,pnum,tfin,screit,scbud,ttown,sname,ssize,mid'}
			let head = list['teams'].split(',')
			let text1 = String(localStorage['teams'])
			if (text1 != 'undefined'){
				var text = text1.split('#')
				for (let i in text) {
					var x = text[i].split('|')
					var curt = {}
					var num = 0
					for (let j in head) {
						curt[head[j]] = (x[num]!=undefined ? x[num] : '')
						num++
					}

					teams[parseInt(curt['tid'])] = curt['nname'];
				}
				MarkMyCountry(nid,nname)
			}
		} else {
			// Если indexedDb not init, пытаемся это сделать
			if (!db) {
				await DBConnect();
			}

			// Получаем все данные из необходимой таблицы
			const requestResult = await getAll('teams');
			// Если есть данные какие либо данные в хранилище
			if (requestResult !== undefined && requestResult.length > 0) {
				for (let i = 0; i < requestResult.length; i++) {
					let row = requestResult[i];
					teams[parseInt(row['tid'])] = row['nname'];
				}

				MarkMyCountry(nid,nname);
			}
		}
}

function MarkMyCountry(nid,nname){
	debug('MarkMyCountry:nid='+nid+':nname='+nname)
$.getScript("js/adaptation.en.js", function() {
	var peflcountry={1:0,2:1,8:2,9:3,11:4,12:5,13:6,18:7,19:8,24:9,25:10,27:11,30:12,41:13,42:14,44:15,47:16,48:17,50:18,51:19,53:20,58:21,59:22,61:23,64:24,66:25,69:26,70:27,73:28,74:29,76:30,84:31,87:32,88:33,91:34,93:35,94:36,95:37,98:38,100:39,105:40,111:41,122:42,123:43,126:44,129:45,137:46,139:47,145:48,147:49,149:50,150:51,152:52,154:53,155:54,160:55,161:56,166:57,167:58,170:59,171:60,172:61,180:62,181:63,191:64,192:65,195:66,196:67,200:68,201:69,202:70,204:71,96:72,207:73,209:74,214:75}
	$('span.text2b').html('Помечены команды: <img src="system/img/flags/'+nid+'.gif" width="20"></img> '+nname)
	var t0=0
	var t1=0
	var t2=0
	$('td.back4 table table tr:eq(0) td').each(function(k,kval){
		if($(kval).text().trim()=='Нац')	t0=k
		if($(kval).text().trim()=='Откуда')	t1=k
		if($(kval).text().trim()=='Куда')	t2=k
	})
	debug('MarkMyCountry:t1='+t1+':t2='+t2)
	$('td.back4 table table tr:gt(0)').each(function(k,kval){
		$(kval).find('td:eq('+t1+'), td:eq('+t2+')').each(function(t,tval){
			if(nname==teams[parseInt(Url.value('j',$(tval).find('a')[0]))]) {

				debug('MarkMyCountry:'+k+':teamid='+parseInt(Url.value('j',$(tval).find('a')[0]))+':nname='+teams[parseInt(Url.value('j',$(tval).find('a')[0]))])
				$(tval).find('a').attr('style','border-bottom:1px solid blue').end()
					.attr('bgcolor','D3D7CF')
					.parent().removeAttr('class').attr('bgcolor','white')
				if(t==1){
					var npid = parseInt($(kval).find('td:eq('+t0+') img').attr('src').split('flags/')[1].split('.')[0])
					$(kval).find('td:eq('+t2+')').append(' ('+s_adaptationMap[npid][peflcountry[nid]]+'0%'+')')
				}
			}
		})
	})
});
}