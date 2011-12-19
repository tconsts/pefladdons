// Скрипт потерял актуальность, реализовано в проекте.

$().ready(function(){
	if (navigator.userAgent.indexOf('Firefox') != -1) delete globalStorage[location.hostname].peflnnlist
	// UrlValue refresh=true список игроков с предложеными контрактами, тут надо получить имена к id
	// t=chn - Изменить предложение, надо подписать имя
	// t=ctrn страница предожения контракта (не только ненужного)
	// t=scout - список с листа скаута, подписать урлы
	// t=list - тут торги по игроку
}, false);