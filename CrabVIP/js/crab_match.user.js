// ==UserScript==
// @name           peflmatch
// @namespace      pefl
// @description    match page modification
// @include        https://*pefl.*/*&t=if&*
// ==/UserScript==


$().ready(function() {
	dobaviti_ikonku_gola();
	pokazati_uglovye();
	pokazati_penaliti();
 	dobaviti_ikonki_karto4ek();
	pokazati_shtrafnye();
	zameniti_ikonku_zamen();
	dobaviti_ikonku_travmy();
	pokazati_ofsaidy();
	pokazati_smeny_taktik();
	dobavlennoe_vremea();
 
}, false);

function pokazati_uglovye(){
	var uglovye = ['Боковой судья показывает на угловой...','зарабатывает угловой...','Судья назначает угловой удар...','Мяч покидает пределы поля... Угловой...','Судья показывает, что нужно выполнить угловой удар...'];
	 
	 for (i=0;i<uglovye.length;i++){
		 var img_uglovoi = $("<p class='uglovoi'/>" );
		 $('p.key:contains('+uglovye[i]+')').append(img_uglovoi);
		 $('p.key:contains('+uglovye[i]+')').css({'padding-bottom':'28px'});
	 }
}

function pokazati_shtrafnye(){
	var shtrafnye = ['Арбитр дает штрафной в пользу команды','Штрафной удар в пользу команды','Штрафной в пользу команды','Штрафной удар...','выполняет штрафной удар...','... Штрафной...',' пробьет штрафной...','Назначен штрафной...'];
	 
	 for (i=0;i<shtrafnye.length;i++){
		 var img_shtrafnoi = $("<p class='shtrafnoi'/>" );
		 $('p.key:contains('+shtrafnye[i]+')').append(img_shtrafnoi);
		 $('p.key:contains('+shtrafnye[i]+')').css({'padding-bottom':'28px'});
		 
		 $('p.full:contains('+shtrafnye[i]+')').append(img_shtrafnoi);
		 $('p.full:contains('+shtrafnye[i]+')').css({'padding-bottom':'28px'});
	 }
}

function pokazati_ofsaidy(){
	var ofsaidy = ['Но боковой арбитр уже поднял флажок. Вне игры.','Лайнсмен показывает, что','Но боковой судья уже поднял флажок.','оказался в офсайде.','попал в офсайд.'];
	 
	 for (i=0;i<ofsaidy.length;i++){
		 var img_offside = $("<p class='offside'/>" );
		 $('p.key:contains('+ofsaidy[i]+')').append(img_offside);
		 $('p.key:contains('+ofsaidy[i]+')').css({'padding-bottom':'28px'});
		 
		 $('p.full:contains('+ofsaidy[i]+')').append(img_offside);
		 $('p.full:contains('+ofsaidy[i]+')').css({'padding-bottom':'28px'});
	 }
}

function zameniti_ikonku_zamen(){
	var ikonka = 'system/img/g/on.gif';
	var img_zamena = $("<p class='zamena' />" );
	$('p.key span img[src="'+ikonka+'"]').parent().parent().append(img_zamena);
	$('p.key span img[src="'+ikonka+'"]').parent().parent().css({'padding-bottom':'28px'});
//	$('p.key span img[src="'+ikonka+'"]').remove();
}

function dobaviti_ikonku_gola(){
	var ikonka = 'system/img/refl/ball.gif';
	var img_goal = $("<p class='goal'/>" );
	$('p.key span img[src="'+ikonka+'"]').parent().parent().append(img_goal);
	$('p.key span img[src="'+ikonka+'"]').parent().parent().css({'padding-bottom':'28px'});
}

function dobaviti_ikonku_travmy(){
	var ikonka = 'system/img/refl/krest.gif';
	var img_travma = $("<p class='travma'/>" );
	$('p.key span img[src="'+ikonka+'"]').parent().parent().append(img_travma);
	$('p.key span img[src="'+ikonka+'"]').parent().parent().css({'padding-bottom':'28px'});
}

function dobaviti_ikonki_karto4ek(){
	var ikonka = 'system/img/refl/yel.gif';
	var img_jeltaia = $("<p class='jeltaia'/>" );
	$('p.key span img[src="'+ikonka+'"]').parent().parent().append(img_jeltaia);
	$('p.key span img[src="'+ikonka+'"]').parent().parent().css({'padding-bottom':'28px'});
	
	var ikonka = 'system/img/refl/red.gif';
	var img_krasnaia = $("<p class='krasnaia'/>" );
	$('p.key span img[src="'+ikonka+'"]').parent().parent().append(img_krasnaia);
	$('p.key span img[src="'+ikonka+'"]').parent().parent().css({'padding-bottom':'28px'});
}

function pokazati_penaliti(){
	var penki = ['Назначается пенальти!!!...','Пенальти!...','Арбитр указывает на одиннадцатиметровую отметку!...','Судья назначает пенальти!!','Судья назначает 11-метровый!!!'];
	 
	 for (i=0;i<penki.length;i++){
		 var img_penaliti = $("<p class='penaliti'/>" );
		 $('p.key:contains('+penki[i]+')').append(img_penaliti);
		 $('p.key:contains('+penki[i]+')').css({'padding-bottom':'28px'});
	 }
}

function pokazati_smeny_taktik() {
	var img_smena = $("<p class='smena_taktiki'/>" );
	$('p.key:contains("(*)")').append(img_smena);
	$('p.key:contains("(*)")').css({'padding-bottom':'28px'});
}

function dobavlennoe_vremea(){
	var dobavl_komment = ['К основному времени матча добавлен','Судья добавляет','Главный судья добавляет к основному времени матча','Запасной судья поднимает табличку'];
	 
	 for (i=0;i<dobavl_komment.length;i++){
		 var img_extra = $("<p class='extra_time'/>" );
		 $('p.key:contains('+dobavl_komment[i]+')').append(img_extra);
		 $('p.key:contains('+dobavl_komment[i]+')').css({'padding-bottom':'28px'});
	 }
}