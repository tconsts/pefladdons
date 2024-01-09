/**
 * Function and varibles for scripts with players
 * player, sostav and more..
 */

class Player {
    value = 1000;
    wage = 0;
    
    /** 
     * @param {boolean} full
     * @returns {string}
     */
    valueToString(full) { return Player.currencyToString(this.value, full ?? false); }
    /** 
     * @param {boolean} full
     * @returns {string}
     */
     wageToString(full) { return Player.currencyToString(this.wage, full ?? true); }
    /**
     * @param {number} value
     * @param {boolean} full
     * @returns {string}
     */
    static currencyToString(value, full) {
        full = full ?? false;
        value = parseInt(value) || 0;
        let nums = 0, postfix = '$';
        if (!full) {
            if (value >= 1000) {
                postfix = 'т$';
                value = value/1000; // тысячи
            }
            if (value >= 1000) {
                postfix = 'м$';
                nums = 1;
                value = value/1000; // миллионы
            }
        }
        return value.toLocaleString("en-US",{maximumFractionDigits: nums}) + postfix;
    }
}

let positions = [],
plskillmax = 15,
skillnames = {
	sor:{rshort:'срт',rlong:'Сортировка',hidden:true},
    sostav: {rshort: 'зв', rlong: 'Игрок в заявке?', strmax: 0},
    flag: {rshort: 'фл', rlong: 'Информационный флаг'},
    fre: {rshort: 'иш', rlong: 'Исполнители штрафных',str:true},
    frh: {rshort: 'ин', rlong: 'Исполнители навесов',str:true,state:3},
    cor: {rshort: 'иу', rlong: 'Исполнители угловых',str:true},
    pen: {rshort: 'пн', rlong: 'Исполнители пенальти',str:true},
    cap: {rshort: 'кп', rlong: 'Капитаны',str:true},
  
    school: {rshort: 'шкл', rlong: 'Школьник?', strmax: 0, strinvert: 1},
    srt: {rshort: 'сила', rlong: 'В % от идеала', type: 'float'},
    stdat: {rshort: 'са', rlong: 'Идет на стд. атаки'},
    stdbk: {rshort: 'со', rlong: 'Идет на стд. обороны'},
    nation: {rshort: 'кСт', rlong: 'Код страны'},
	natflag:{rshort:'фс',rlong:'Флаг страны',type:'flag'},
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
	miss:{rshort:'пп',rlong:'Пропустил матчей',str:true},
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
},
list = {
	positions: 'id,filter,name,num,koff,order'
}

function checkKoff(kf0){
	let res = kf0.replace(/!/g,'');
	if (skillnames[res] === undefined) {
        Std.debug("checkKoff(kf0=%s)",kf0,)
		let custom = true;
		for (let h in skillnames) {
			if (skillnames[h].rshort === res) {
				custom = false;
				res = h;
			}
		}
		if (custom) {
			skillnames[res] = {}
			skillnames[res].rshort = res;
			skillnames[res].rlong = 'Custom параметр';
			skillnames[res].type = 'custom';
		}
	}
	return res;
}

function clcFr(s0,clcNum) {
    if (clcNum >= 100) {
        console.warn('Count limit(50) is exceeded, current formula: %s, return 0',s0);
        return 0;
    }

	let regexpRemBracket = new RegExp('\\(([-]?[0-9]+[.]?[0-9]*)\\)','g'),
    s = s0.replace(regexpRemBracket,"$1");

    $.each(["*","/","+","-"], function (index, value) {
        let rexp = new RegExp('([-]?[0-9]+[.]?[0-9]*)\\' + value + '([-]?[0-9]+[.]?[0-9]*)');
        let m_res, m = s.match(rexp);
        if (m !== null) {
            switch (value) {
                case "*": m_res = parseFloat(m[1])*parseFloat(m[2]); break;
                case "/": m_res = parseFloat(m[1])/parseFloat(m[2]); break;
                case "+": m_res = parseFloat(m[1])+parseFloat(m[2]); break;
                case "-": m_res = parseFloat(m[1])-parseFloat(m[2]); break;
            }
            s = s.replace(m[0],m_res).replace(regexpRemBracket,"$1");
            return false;
        }
    });
    $.each([">","<"], function (index, value) {
        let rexp = new RegExp('\\(([-]?[0-9]+[.]?[0-9]*)\\'+value+'([-]?[0-9]+[.]?[0-9]*)\\?([-]?[0-9]+[.]?[0-9]*)\\:([-]?[0-9]+[.]?[0-9]*)\\)');
        let m_res, m = s.match(rexp);
        if (m !== null) {
            switch (value) {
                case ">": m_res = parseFloat(m[1])>parseFloat(m[2]) ? parseFloat(m[3]) : parseFloat(m[4]); break;
                case "<": m_res = parseFloat(m[1])<parseFloat(m[2]) ? parseFloat(m[3]) : parseFloat(m[4]); break;
            }
            s = s.replace(m[0],m_res).replace(regexpRemBracket,"$1");
            return false;
        }
    });

    if (s === s0) return s;
    return clcFr(s,clcNum++);
}

function countStrength(pkoff,pl) {
    const regxpFrm = new RegExp('=([0-9а-яА-Яa-zA-Z()+*\\-/.:?<>]+)','g');
    let res = [],    
    formula_sort = '(' + pkoff.match(regxpFrm).join(')+(').replace(/=/g,'').replace(/\s/g,'') + ')',
    formula_strn = formula_sort,
    formula_keys = [...new Set(formula_sort.match(/[а-яА-Яa-zA-Z]+/g))]
    //names = pkoff.match(/([a-zA-Zа-яА-Я]+)=/g);
    //names = $.map(names, function(i) { return i.replace('=','');});

    $.each(formula_keys, function (index, value) {
        const reg = new RegExp(value, "g");
        let found = false, skval_sort = 0, skval_strn = 0;
        for (let p in skillnames) { 
            let skill = skillnames[p];
            if ((skill.rshort ?? p) === value) {
                let skval = (
                    pl === undefined
                        ? skill.strmax ?? plskillmax
                        : parseFloat(pl[p]) || 0
                );
                skval = skval - (skill.strinvert ?? 0);                
                skval_sort = isNaN(skval) ? 0 : skval;
                skval_strn = !skill.str || isNaN(skval) ? 0 : skval;
                found = true;
                break;
            }
        }
        if (!found) {
            let skval = (
                pl === undefined ? plskillmax : parseFloat(pl[value]) || 0
            );
            console.warn("Key %s not found in skillnames, replaced by %s",value,skval);
            skval_sort = skval;
            skval_strn = skval;
        }
        formula_sort = formula_sort.replace(reg, "(" + skval_sort  + ")");
        formula_strn = formula_strn.replace(reg, "(" + skval_strn + ")");
    });

    res.push(clcFr(formula_strn,0));
    if (formula_strn !== formula_sort) res.push(clcFr(formula_sort,0));
    return res;
}