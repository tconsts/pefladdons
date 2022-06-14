/**
 * Function and varibles for scripts with players
 * player, sostav and more..
 */

let positions = [],
plskillmax = 15,
skillnames = {
	sor:{rshort:'срт',rlong:'Сортировка',hidden:true},
    sostav: {rshort: 'зв', rlong: 'Игрок в заявке?', strmax: 0},
    flag: {rshort: 'фл', rlong: 'Информационный флаг'},
    pfre: {rshort: 'иш', rlong: 'Исполнители штрафных',str:true},
    pcor: {rshort: 'иу', rlong: 'Исполнители угловых',str:true},
    ppen: {rshort: 'пн', rlong: 'Исполнители пенальти',str:true},
    pcap: {rshort: 'кп', rlong: 'Капитаны',str:true},
  
    school: {rshort: 'шкл', rlong: 'Школьник?', strmax: 0, strinvert: 1},
    srt: {rshort: 'сила', rlong: 'В % от идеала', type: 'float'},
    stdat: {rshort: 'са', rlong: 'Идет на стд. атаки'},
    stdbk: {rshort: 'со', rlong: 'Идет на стд. обороны'},
    nation: {rshort: 'кСт', rlong: 'Код страны'},
	natflag:{rshort:'фс',rlong:'Флаг страны',type:'flag',state:3},
    teamnat: {rshort: 'кCт', rlong: 'Код страны'},
    natfull: {rshort: 'стр', rlong: 'Страна', align: 'left', nowrap: '1'},
    sname:{rshort:'Фам',rlong:'Фамилия',align:'left',nowrap:'1'},
	fname:{rshort:'Имя',rlong:'Имя',align:'left',nowrap:'1'},
    age: {rshort: 'взр', rlong: 'Возраст', str: true, strmax: 40},
    id: {rshort: 'id', rlong: 'id игрока'},
	value: {rshort: 'ном', rlong: 'Номинал', type: 'value',str:true, strmax: 50000000},
	morale: {rshort: 'мрл', rlong: 'Мораль', str: true, strmax: 100},
    form: {rshort: 'фрм', rlong: 'Форма', str: true, strmax: 100},
	inj: {rshort: 'трв', rlong: 'Травма', str: true, strmax: 0, strinvert: 20},
    sus: {rshort: 'дсв', rlong: 'Дисквалификация', str: true, strmax: 0, strinvert: 20},
    syg: {rshort: 'сыг', rlong: 'Сыгранность', str: true, strmax: 20},
	miss:{rshort:'пп',rlong:'Пропустил матчей',str:true,state:3},
	position: {rshort: 'Поз', rlong: 'Позиция', align: 'left', nowrap: '1'},    
	//skills
    corners: {rshort: 'уг', rlong: 'Угловые', str: true},
    crossing: {rshort: 'нв', rlong: 'Навесы', str: true},
    dribbling: {rshort: 'др', rlong: 'Дриблинг', str: true},
    finishing: {rshort: 'уд', rlong: 'Удары', str: true},
    freekicks: {rshort: 'шт', rlong: 'Штрафные', str: true},
    handling: {rshort: 'ру', rlong: 'Игра руками', str: true},
    heading: {rshort: 'гл', rlong: 'Игра головой', str: true},
    leadership: {rshort: 'лд', rlong: 'Лидерство', str: true},
    longshots: {rshort: 'ду', rlong: 'Дальние удары', str: true},
    marking: {rshort: 'по', rlong: 'Перс. опека', str: true},
    pace: {rshort: 'ск', rlong: 'Скорость', str: true},
    passing: {rshort: 'пс', rlong: 'Игра в пас', str: true},
    positioning: {rshort: 'вп', rlong: 'Выбор позиции', str: true},
    reflexes: {rshort: 'ре', rlong: 'Реакция', str: true},
    stamina: {rshort: 'вн', rlong: 'Выносливость', str: true},
    strength: {rshort: 'мщ', rlong: 'Мощь', str: true},
    tackling: {rshort: 'от', rlong: 'Отбор мяча', str: true},
    vision: {rshort: 'ви', rlong: 'Видение поля', str: true},
    workrate: {rshort: 'рб', rlong: 'Работоспособность', str: true},
    technique: {rshort: 'тх', rlong: 'Техника', str: true},
	//depricated
	natfull:{rshort:'стр',rlong:'Страна',align:'left',nowrap:'1',state:2},
	internationalapps:{rshort:'иСб',rlong:'Игр за сборную',str:true,strmax:500, state:2},
	internationalgoals:{rshort:'гСб',rlong:'Голов за сборную',str:true,strmax:500, state:2},
	contract:{rshort:'кнт',rlong:'Контракт',str:true,strmax:5, state:2},
	wage:{rshort:'зрп',rlong:'Зарплата',str:true,strmax:100,strinvert:100100, state:2}
},
list = {
	positions: 'id,filter,name,num,koff,order'
}

function clcFr(s0,clcNum) {
	let m,
    regexpRemBracket = new RegExp('\\(([\-]?[0-9]+[\\.]?[0-9]*)\\)','g'),
    s = s0.replace(regexpRemBracket,"$1");

    $.each(["*","/","+","-"], function (index, value) {
        rexp = new RegExp('([\\-]?[0-9]+[\\.]?[0-9]*)([\\' + value + '])([\\-]?[0-9]+[\\.]?[0-9]*)');
        m = s.match(rexp);
        if (m !== null) {
            switch (value) {
                case "*": s = s.replace(m[0],(parseFloat(m[1])*parseFloat(m[3]))).replace(regexpRemBracket,"$1");break;
                case "/": s = s.replace(m[0],(parseFloat(m[1])/parseFloat(m[3]))).replace(regexpRemBracket,"$1");break;
                case "+": s = s.replace(m[0],(parseFloat(m[1])+parseFloat(m[3]))).replace(regexpRemBracket,"$1");break;
                case "-": s = s.replace(m[0],(parseFloat(m[1])-parseFloat(m[3]))).replace(regexpRemBracket,"$1");break;
            }
            return false;
        }
    })		
    if (s === s0) return s;
    if (clcNum >= 50) return 0;
    clcNum++;
    return clcFr(s,clcNum);
}