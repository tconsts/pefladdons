// ==UserScript==
// @name           peflplayer
// @namespace      pefl
// @description    modification player page and school boys
// @include        http://*pefl.*/plug.php?p=refl&t=p*
// @include        http://*pefl.*/plug.php?p=refl&t=yp*
// @require			crab_funcs_db.js
// @require			crab_funcs_std.js
// @require			crab_funcs_pls.js
// @encoding	   windows-1251
// ==/UserScript==
/**/

let isOldRoster = false,
url = new Url();

var players = [];
players[0] = [];

var sklfr = [];
var compare = false;
var mh = false;
var total_check_players = 0;
var maxSkill = 15;


var ups = {
    "a0e": "-2",
    "a1e": "-1",
    "a2e": "1",
    "a3e": "2",
    "a5e": "3",
    "a6e": "-3",
    "next": "-3",
    "last": "3",
    "undefined": "0"
}

function printStrench() {
    if (positions.length === 0) return false;
    let poses = [];
    for (let f in positions) {
        for (let j in positions[f].pls) {
            if (positions[f].pls[j].id0) {
                let srt = (positions[f].pls[j].srt !== undefined
                    ? positions[f].pls[j].srt
                    : positions[f].pls[j]['!srt']);
                let plx = {};
                plx.name = positions[f].name;
                plx.filter = positions[f].filter;
                plx.srt = srt + (positions[f].pls[j].posf ? 1000 : 0) + (positions[f].pls[j].posfempty ? -2000 : 0);
                plx.strench = srt;
                if (!isNaN(plx.srt)) poses.push(plx);
            }
        }
    }
    poses = poses.sort(sSrt);
    let hidden = 0;
    let txt = '';
    for (let i in poses) {
        if (poses[i].srt < 1000 && hidden === 0) hidden = 1;
        if (hidden === 1) {
            hidden = 2;
            txt += '<a id="mya" href="javascript:void(OpenAll())">...</a><br><div id="mydiv" style="display: none;">';
        }
        if (poses[i].srt < -500 && hidden === 2) {
            hidden = 3;
            txt += '</div><div>';
        }
        txt += (String(poses[i].name)[0] === '!'
            ? ''
            : '<div title="' + poses[i].filter + '">' + (poses[i].strench).toFixed(2) + ': ' + (poses[i].name).replace(/\s/g, '&nbsp;') + '</div>')
    }
    txt += '</div>';
    $('div#str').html(txt)
}

function sSrt(i, ii) { // по убыванию
    let s = (i.srt !== undefined ? 'srt' : '!srt')
    if (i[s] < ii[s]) return 1
    else if (i[s] > ii[s]) return -1
    return 0
}

function GetData(dataName) {
    var needsave = false
    var data = []
    var head = list[dataName].split(',')
    var text1 = String(localStorage[dataName])
    if (text1 !== 'undefined' && text1 !== 'null') {
        var text = text1.split('#')
        var numpos = 0
        for (i in text) {
            var x = text[i].split('|')
            var curt = {}
            var num = 0
            for (j in head) {
                curt[head[j]] = (x[num] !== undefined ? x[num] : '')
                num++
            }
            data[numpos] = curt
            numpos++
        }
        switch (dataName) {
            case 'positions':
                positions = data;
                let isk = data[0].koff !== undefined ? parseFloat(data[0].koff.match(/idealsk\=([0-9]+)/)[1]) : plskillmax;
                plskillmax =  !isNaN(isk) ? isk : plskillmax;
                let iage = data[0].koff !== undefined ? parseFloat(data[0].koff.match(/idealage\=([0-9]+)/)[1]) : "";
                skillnames['age'].strmax =  !isNaN(iage) ? iage : 40;
                let ival = data[0].koff !== undefined ? parseFloat(data[0].koff.match(/idealval\=([0-9]+)/)[1]) : "";
                skillnames['value'].strmax =  !isNaN(ival) ? ival : 50000000;
                break
            default:
                return false
        }
        for (i = 1; i < positions.length; i++) {
            countPosition(i)
        }
    }
}

function filterPosition(plpos, flpos) {
    var pos = flpos.split(' ')
    var pos0 = false
    var pos1 = false
    if (pos[1] === undefined) {
        pos1 = true
        if (plpos.indexOf(pos[0]) !== -1) pos0 = true
    } else {
        for (k = 0; k < 3; k++) if (plpos.indexOf(pos[0][k]) !== -1) pos0 = true
        pos1arr = pos[1].split('/')
        for (k in pos1arr) if ((plpos.indexOf(pos1arr[k]) !== -1)) pos1 = true
    }
    return (pos0 && pos1)
}

function countPosition(posnum) {
    var ps = positions[posnum]
    ps.strmax = countStrength(ps.koff)[0];
    var pls = []

    //TODO надо зарефакторить
    var j=0;
    var pl = {};
    if (parseInt(j) === 0) {
        pl.id0 = true
    }
    pl.id = players[j].id
    var pkoff = ps.koff.split(',')
    for (h in pkoff) {
        var koff = String(pkoff[h].split('=')[0])
        if (skillnames[koff] === undefined) for (l in skillnames) if (skillnames[l].rshort === koff.replace(/\!/g, '')) koff = koff.replace(skillnames[l].rshort, l)
        pl[koff] = (players[j][koff.replace(/\!/g, '')] === undefined ? 0 : players[j][koff.replace(/\!/g, '')])
    }
    pl.posf = filterPosition(players[j].position, ps.filter)
    if (ps.filter === '') pl.posfempty = true
    var s = (pl.srt != undefined ? 'srt' : (pl['!srt'] != undefined ? '!srt' : ''))
    if (s != '' && pl[s] != undefined) pl[s] = (ps.strmax === 0 ? 0 : (countStrength(ps.koff,players[j])[0] / ps.strmax) * 100)

    pls.push(pl)

    positions[posnum].pls = pls.sort(sSrt)
}

function RelocateGetNomData(arch) {
    if (arch === undefined) arch = '';
    if (localStorage.getnomdata !== undefined && String(localStorage.getnomdata).indexOf('1.1$') !== -1) {
        GetNomData(0)
        //GetFinish('getnomdata', true)
    } else {
        const top = (localStorage.datatop !== undefined ? localStorage.datatop : 9885110); //9107893
        const url_top = 'm=posts' + arch + '&p=' + top;

        if ($('#debval').length === 0) $('td.back4').prepend('<div style="display: none;" id=debval></div>')
        $('div#debval').load('forums.php?' + url_top + ' td.back3:contains(#CrabNom1.1.' + top + '#) blockquote pre', function () {
            if ($('#debval').html() === '' && arch === '') {
                RelocateGetNomData('&arch=1')
            } else {
                $('div#debval').find('hr').remove()
                var data = $('#debval pre').html().split('#').map(function (val, i) {
                    return val.split('<br>').map(function (val2, i2) {
                        return $.grep(val2.split('	'), function (num, index) {
                            return !isNaN(index)
                        })
                    })
                })
                let text = '';
                let nm = []
                for (let i in data) {
                    var x = []
                    for (let j in data[i]) x[j] = data[i][j].join('!')
                    nm[i] = x.join('|')
                }
                text = nm.join('#')
                localStorage.getnomdata = '1.1$' + text.replace('Code', '')
                GetNomData(0)
                //GetFinish('getnomdata', true)
            }
        })
    }
}

function GetNomData(id) {
    var sdata = []
    var pl = players[id]
    var tkp = 0
    var fp = {}
    var svalue = 0
    var kpkof = 1.1
    var plnom = []
    nm = String(localStorage.getnomdata).split('$')[1].split('#')
    for (i in nm) {
        sdata[i] = []
        x = nm[i].split('|')
        for (j in x) {
            sdata[i][j] = x[j].split('!')
        }
    }
    kpkof = parseFloat(sdata[0][0][0])

    var saleAge = 0
    var ages = (sdata[0][0][1] + ',100').split(',')
    for (i in ages) if (pl.age < ages[i]) {
        saleAge = i;
        break;
    }

    var saleValue = 0
    var vals = ('0,' + sdata[0][0][2] + ',100000').split(',')
    for (i in vals) if (pl.value < vals[i] * 1000) {
        saleValue = i - 1;
        break;
    }

    fp.av = parseFloat(sdata[0][saleValue + 1][0])
    fp.mn = parseFloat(sdata[0][saleValue + 1][1])
    fp.mx = parseFloat(sdata[0][saleValue + 1][2])
    var saleNom = ''
    var t = 0
    for (i = 1; i < sdata.length; i++) {
        for (n in sdata[i]) {
            if (isNaN(parseInt(sdata[i][n][0])) && Std.trim(sdata[i][n][0]) != '') {
                t++
                plnom[t] = {psum: 0, tkp: sdata[i][saleValue][saleAge]}

                var pos1 = (sdata[i][n][0].split(' ')[1] != undefined ? sdata[i][n][0].split(' ')[0] : '')
                if (pos1 === '') plnom[t].pos1 = true
                else for (h in pos1) if (pl.position.indexOf(pos1[h]) != -1) plnom[t].pos1 = true

                var pos2 = (sdata[i][n][0].split(' ')[1] === undefined ? Std.trim(sdata[i][n][0].split(' ')[0]) : sdata[i][n][0].split(' ')[1]).split('/')
                for (h in pos2) if (pl.position.indexOf(pos2[h]) != -1) plnom[t].pos2 = true

                if (plnom[t].pos1 && plnom[t].pos2) {
                    plnom[t].psum = 1
                    plnom[t].id = t
                    plnom[t].pos = sdata[i][n][0]
                    var count = 0
                    for (j = 1; j < sdata[i][n].length; j++) {
                        var kof = parseFloat(sdata[i][n][j].split('-')[0])
                        var skil = parseInt(pl[sdata[i][n][j].split('-')[1]])
                        //var skil = parseInt(pl[skl[sdata[i][n][j].split('-')[1]]])
                        if (!isNaN(skil)) {
                            plnom[t].psum = plnom[t].psum * Math.pow((skil < 1 ? 1 : skil), kof)
                            count += kof
                        }
                    }
                    plnom[t].psum = Math.pow(plnom[t].psum, 1 / count)
                }
            }
        }
    }
    plnom = plnom.sort(sNomPsum)
    fp.res = plnom[0].psum / fp.av
    fp.res = (fp.res < fp.mn ? fp.mn : (fp.res > fp.mx ? fp.mx : fp.res))
    tkp = plnom[0].tkp / 100
    if (plnom[1].psum != 0 && ((plnom[0].psum / plnom[1].psum) < kpkof)) {
        tkp = Math.max(plnom[0].tkp, plnom[1].tkp) / 100
    }
    svalue = parseInt(pl.value * tkp * fp.res);
    svalue = (svalue === 0 ? 1000 : svalue);
    $('div#SValue').html('~<font size=2>' + Player.currencyToString(svalue) + '</font>');
}

function sNomPsum(i, ii) { // Сортировка
    if (i.psum < ii.psum) return 1
    else if (i.psum > ii.psum) return -1
    else return 0
}

function cl(skl) {
    return parseInt(String(skl).split('.')[0])
}

function GetPlayerCleanSkillz(pl) {
    return {
        'pace': cl(pl.pace),
        'vision': cl(pl.vision),
        'passing': cl(pl.passing),
        'dribbling': cl(pl.dribbling),
        'crossing': cl(pl.crossing),
        'finishing': cl(pl.finishing),
        'longshots': cl(pl.longshots),
        'technique': cl(pl.technique),
        'leadership': cl(pl.leadership),
        'heading': cl(pl.heading),
        'strength': cl(pl.strength),
        'positioning': cl(pl.positioning),
        'tackling': cl(pl.tackling),
        'marking': cl(pl.marking),
        'stamina': cl(pl.stamina),
        'workrate': cl(pl.workrate),
        'corners': cl(pl.corners),
        'freekicks': cl(pl.freekicks),
        'handling': cl(pl.handling),
        'reflexes': cl(pl.reflexes),
    }
}

function GetPolygonSkillGroups(pl) {
    var p = GetPlayerCleanSkillz(pl);
    var skill_labels = [
        ['энерг.', -22, 5],
        ['передачи', -22, 3],
        ['владение', -15, -1],
        ['дриблинг', -24, -1],
        ['удары', -17, 0],
        ['скор.', 0, 3],
        ['голов.', -15, 8],
        ['позиц.', -20, 8],
        ['отбор', -10, 8],
        ['мощь', -7, 7],
    ];
    var skill_groups = [
        [p.stamina, p.workrate],  //энергия
        [p.passing, p.crossing],  //пасы
        [p.vision, p.technique],  //владение
        [p.dribbling], //дрибл
        [p.finishing, p.longshots],  //удар
        [p.pace],  // скор.
        [p.heading],  //головой ил на выходах
        [p.positioning],  //поз.
        [p.tackling],  //отбор
        [p.strength],  //физика
    ];
    if (pl.position === 'GK') {
        skill_labels[3][0] = 'руками';
        skill_groups[3] = [[p.handling]];  //руками
        skill_labels[4][0] = 'реакц.';
        skill_groups[4] = [[p.reflexes]];  //реакц.
        skill_labels[6][0] = 'на выход.';
    }
    var skill_groups_merged = [];
    for (var i = 0; i < skill_labels.length; i += 1)
        skill_groups_merged[i] = [skill_labels[i][0], skill_groups[i], skill_labels[i][1], skill_labels[i][2]];
    return skill_groups_merged;
}

function ShowPolygonCheckPlayer(nn) {
    pl = players[nn];
    var ctx = document.getElementById('polygon').getContext('2d');

    var skill_groups = GetPolygonSkillGroups(pl);

    var numberOfSides = skill_groups.length;
    var size = 80;
    var Xcenter = 90;
    var Ycenter = 90;

    ctx.beginPath();
    switch (total_check_players) {
        case 1: ctx.strokeStyle = "#a22"; break;
        case 2: ctx.strokeStyle = "#22a"; break;
        case 3: ctx.strokeStyle = "#2aa"; break;
        default: ctx.strokeStyle = "#555";
    }
    ctx.lineWidth = 1;
    for (var i = 0; i < numberOfSides; i += 1) {
        var j = i + 1;
        if (j >= numberOfSides) j=0;
        var v1 = 0;
        var v2 = 0;
        for (s in skill_groups[i][1]) v1 += skill_groups[i][1][s];
        for (s in skill_groups[j][1]) v2 += skill_groups[j][1][s];
        v1 = (v1 / skill_groups[i][1].length) * size / maxSkill;
        v2 = (v2 / skill_groups[j][1].length) * size / maxSkill;
        ctx.moveTo(Xcenter + v1 * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + v1 * Math.sin(i * 2 * Math.PI / numberOfSides));
        ctx.lineTo(Xcenter + v2 * Math.cos(j * 2 * Math.PI / numberOfSides), Ycenter + v2 * Math.sin(j * 2 * Math.PI / numberOfSides));
    }
    ctx.stroke();
}

function ShowPolygon() {
    var pl = players[0];
    var ctx = document.getElementById('polygon').getContext('2d');

    var skill_groups = GetPolygonSkillGroups(pl);

    var numberOfSides = skill_groups.length;
    var size = 80;
    var Xcenter = 90;
    var Ycenter = 90;

    for (var k = 3; k > 0; k -= 1) {
        switch (k) {
            case 3: ctx.fillStyle = "#a3de8f"; break;
            case 2: ctx.fillStyle = "#c4de8f"; break;
            case 1: ctx.fillStyle = "#ded78f"; break;
        }
        ctx.beginPath();
        ctx.moveTo(Xcenter + size * k * Math.cos(0) / 3, Ycenter + size * k * Math.sin(0) / 3);
        for (var i = 0; i < numberOfSides; i += 1) {
            var j = i + 1;
            if (j >= numberOfSides) j=0;
            ctx.lineTo(Xcenter + size * k * Math.cos(j * 2 * Math.PI / numberOfSides) / 3, Ycenter + size * k * Math.sin(j * 2 * Math.PI / numberOfSides) / 3);
        }
        ctx.closePath();
        ctx.fill();
    }

    ctx.strokeStyle = "#c8c8c8";
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1;
    for (var k = maxSkill; k > 0; k -= 1) {
        ctx.beginPath();
        ctx.moveTo(Xcenter + size * k * Math.cos(0) / maxSkill, Ycenter + size * k * Math.sin(0) / maxSkill);
        for (var i = 0; i < numberOfSides; i += 1) {
            var j = i + 1;
            if (j >= numberOfSides) j=0;
            ctx.lineTo(Xcenter + size * k * Math.cos(j * 2 * Math.PI / numberOfSides) / maxSkill, Ycenter + size * k * Math.sin(j * 2 * Math.PI / numberOfSides) / maxSkill);
        }
        ctx.stroke();
    }

    ctx.strokeStyle = "#000000";
    ctx.fillStyle = '#000000';
    ctx.font = "9px Arial";
    for (var i = 0; i < numberOfSides; i += 1) {
        ctx.fillText(skill_groups[i][0], Xcenter + 90 * Math.cos(i * 2 * Math.PI / numberOfSides) + skill_groups[i][2], Ycenter + 90 * Math.sin(i * 2 * Math.PI / numberOfSides) + skill_groups[i][3]);
    }

    ctx.beginPath();
    for (var i = 0; i < numberOfSides; i += 1) {
        var j = i + 1;
        if (j >= numberOfSides) j=0;
        var v1 = 0;
        var v2 = 0;
        for (s in skill_groups[i][1]) v1 += skill_groups[i][1][s];
        for (s in skill_groups[j][1]) v2 += skill_groups[j][1][s];
        v1 = (v1 / skill_groups[i][1].length) * size / maxSkill;
        v2 = (v2 / skill_groups[j][1].length) * size / maxSkill;
        ctx.moveTo(Xcenter + v1 * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + v1 * Math.sin(i * 2 * Math.PI / numberOfSides));
        ctx.lineTo(Xcenter + v2 * Math.cos(j * 2 * Math.PI / numberOfSides), Ycenter + v2 * Math.sin(j * 2 * Math.PI / numberOfSides));
    }
    ctx.stroke();
}

function ResetPolygon() {
    total_check_players = 0;
    PrintPlayers();
    ShowPolygon();
    $("td#thx a").unbind("click.mynamespace");
    return false;
}

function ShowAdaptation(plnat, tnat) {
    if (String(localStorage.mycountry) != 'undefined' && plnat != undefined && plnat != ' ') {
        $.getScript("js/adaptation5.en.js", function () {
            var peflnation = {
                'Албания': 1,
                'Алжир': 2,
                'Восточное Самоа': 3,
                'Андорра': 4,
                'Ангола': 5,
                'Ангуилла': 6,
                'Антигуа': 7,
                'Аргентина': 8,
                'Армения': 9,
                'Аруба': 10,
                'Австралия': 11,
                'Австрия': 12,
                'Азербайджан': 13,
                'Багамы': 14,
                'Бахрейн': 15,
                'Бангладеш': 16,
                'Барбадос': 17,
                'Беларусь': 18,
                'Бельгия': 19,
                'Белиз': 20,
                'Бенин': 21,
                'Бермуды': 22,
                'Бутан': 23,
                'Боливия': 24,
                'Босния': 25,
                'Ботсвана': 26,
                'Бразилия': 27,
                'Виргинские о-ва': 28,
                'Бруней': 29,
                'Болгария': 30,
                'Буркина Фасо': 31,
                'Бурунди': 32,
                'Комбоджа': 34,
                'Камерун': 35,
                'Канада': 36,
                'Кабо-Верде': 37,
                'Каймановы о-ва': 38,
                'ЦАР': 39,
                'Чад': 40,
                'Чили': 41,
                'Китай': 42,
                'Тайвань': 43,
                'Колумбия': 44,
                'Конго': 45,
                'О-ва Кука': 46,
                'Коста Рика': 47,
                'Хорватия': 48,
                'Куба': 49,
                'Кипр': 50,
                'Чехия': 51,
                'Дания': 53,
                'Джибути': 54,
                'Доминика': 55,
                'Доминиканская р-ка': 56,
                'Эквадор': 58,
                'Египет': 59,
                'Сальвадор': 60,
                'Англия': 61,
                'Экв. Гвинея': 62,
                'Эритрея': 63,
                'Эстония': 64,
                'Эфиопия': 65,
                'Македония': 66,
                'Фарерские о-ва': 67,
                'Фиджи': 68,
                'Финляндия': 69,
                'Франция': 70,
                'Габон': 71,
                'Гамбия': 72,
                'Грузия': 73,
                'Германия': 74,
                'Гана': 75,
                'Греция': 76,
                'Гренада': 77,
                'Гуам': 78,
                'Гватемала': 79,
                'Гвинея': 80,
                'Гвинея-Бисау': 81,
                'Гайана': 82,
                'Гаити': 83,
                'Голландия': 84,
                'Гондурас': 85,
                'Гон-Конг': 86,
                'Венгрия': 87,
                'Исландия': 88,
                'Индия': 89,
                'Индонезия': 90,
                'Иран': 91,
                'Ирак': 92,
                'Ирландия': 93,
                'Израиль': 94,
                'Италия': 95,
                'Кот`д`Ивуар': 96,
                'Ямайка': 97,
                'Япония': 98,
                'Иордания': 99,
                'Казахстан': 100,
                'Кения': 101,
                'Кувейт': 102,
                'Киргизия': 103,
                'Лаос': 104,
                'Латвия': 105,
                'Ливан': 106,
                'Лесото': 107,
                'Либерия': 108,
                'Ливия': 109,
                'Лихтенштейн': 110,
                'Литва': 111,
                'Люксембург': 112,
                'Макао': 113,
                'Мадагаскар': 114,
                'Малави': 115,
                'Малайзия': 116,
                'Мальдивы': 117,
                'Мали': 118,
                'Мальта': 119,
                'Мавритания': 120,
                'Маврикий': 121,
                'Мексика': 122,
                'Молдова': 123,
                'Монголия': 124,
                'Монсеррат': 125,
                'Марокко': 126,
                'Мозамбик': 127,
                'Мьянмар': 128,
                'Северная Ирландия': 129,
                'Намибия': 130,
                'Непал': 131,
                'Кюрасао': 132,
                'Новая Каледония': 133,
                'Новая Зеландия': 134,
                'Никарагуа': 135,
                'Нигер': 136,
                'Нигерия': 137,
                'Северная Корея': 138,
                'Норвегия': 139,
                'Оман': 140,
                'Пакистан': 141,
                'Палестина': 142,
                'Панама': 143,
                'Папуа Новая Гвинея': 144,
                'Парагвай': 145,
                'Перу': 147,
                'Филиппины': 148,
                'Польша': 149,
                'Португалия': 150,
                'Пуэрто-Рико': 151,
                'Катар': 152,
                'ДР Конго': 153,
                'Румыния': 154,
                'Россия': 155,
                'Руанда': 156,
                'Зап. Самоа': 157,
                'Сан-Марино': 158,
                'Томе': 159,
                'Саудовская Аравия': 160,
                'Шотландия': 161,
                'Сенегал': 162,
                'Сейшельские о-ва': 163,
                'Сьерра-Леоне': 164,
                'Сингапур': 165,
                'Словакия': 166,
                'Словения': 167,
                'Соломоновы о-ва': 168,
                'Сомали': 169,
                'ЮАР': 170,
                'Южная Корея': 171,
                'Испания': 172,
                'Шри-Ланка': 173,
                'Сент-Киттс': 174,
                'Лусия': 175,
                'Сент-Винсент': 176,
                'Судан': 177,
                'Суринам': 178,
                'Свазиленд': 179,
                'Швеция': 180,
                'Швейцария': 181,
                'Сирия': 182,
                /**'Таити':183,    //дублируется 216ым/**/'Таджикистан': 184,
                'Танзания': 185,
                'Таиланд': 186,
                'Того': 188,
                'Тонга': 189,
                'Тринидад и Тобаго': 190,
                'Тунис': 191,
                'Турция': 192,
                'Туркменистан': 193,
                'Каикос': 194,
                'ОАЭ': 195,
                'США': 196,
                'Уганда': 199,
                'Украина': 200,
                'Уругвай': 201,
                'Узбекистан': 202,
                'Вануату': 203,
                'Венесуэла': 204,
                'Вьетнам': 205,
                'Уэльс': 207,
                'Йемен': 208,
                'Сербия': 209,
                'Заир': 153,
                /** 210, эт щас ДР Конго - поэтому сошлемся на его id/**/
                'Замбия': 211,
                'Зимбабве': 212,
                'Гваделупа': 213,
                'Черногория': 214,
                'Коморские острова': 215,
                'Таити': 216,
                'Афганистан': 217
            }
            var peflcountry = {
                1: 0,
                2: 1,
                8: 2,
                9: 3,
                11: 4,
                12: 5,
                13: 6,
                18: 7,
                19: 8,
                24: 9,
                25: 10,
                27: 11,
                30: 12,
                41: 13,
                42: 14,
                44: 15,
                47: 16,
                48: 17,
                50: 18,
                51: 19,
                53: 20,
                58: 21,
                59: 22,
                61: 23,
                64: 24,
                66: 25,
                69: 26,
                70: 27,
                73: 28,
                74: 29,
                76: 30,
                84: 31,
                87: 32,
                88: 33,
                91: 34,
                93: 35,
                94: 36,
                95: 37,
                98: 38,
                100: 39,
                105: 40,
                111: 41,
                122: 42,
                123: 43,
                126: 44,
                129: 45,
                137: 46,
                139: 47,
                145: 48,
                147: 49,
                149: 50,
                150: 51,
                152: 52,
                154: 53,
                155: 54,
                160: 55,
                161: 56,
                166: 57,
                167: 58,
                170: 59,
                171: 60,
                172: 61,
                180: 62,
                181: 63,
                191: 64,
                192: 65,
                195: 66,
                196: 67,
                200: 68,
                201: 69,
                202: 70,
                204: 71,
                96: 72,
                207: 73,
                209: 74,
                214: 75
            }
            var ad = s_adaptationMap[peflnation[plnat]][peflcountry[parseInt(localStorage.mycountry)]]
            var adperc1 = '%';
            var adperc2 = '%';
            var txt = '<table width=100%><tr align=left><td>Адаптация</td><th>' + plnat + '</th></tr>';
            txt += '<tr align=left><th nowrap>' + localStorage.mycountry.split('.')[1] + '</th><td nowrap>' + (ad === 100 ? '99,9' : (ad * 6 + 20) / 10 + '%-' + (ad * 6 + 400) / 10) + '% (' + ad + ')</td></tr>'
            if (tnat != undefined && tnat != parseInt(localStorage.mycountry)) {
                var tad = s_adaptationMap[peflnation[plnat]][peflcountry[tnat]]
                for (i in peflnation) if (parseInt(peflnation[i]) === parseInt(tnat)) var natname = i;
                txt += '<tr align=left><th>' + natname + '</th><td>' + (tad === 100 ? '99,9' : (tad * 6 + 20) / 10 + '%-' + (tad * 6 + 400) / 10) + '% (' + tad + ')</td></tr>'
            }
            txt += '</table>';
            $("#crabright").append('<br><br>' + txt)
        });
    }
}

async function SetValue(vl, vlch) {
    if (url.t === 'p') {
        if (ff) {
            var text1 = String(localStorage['players']).split('#');
            for (i in text1) {
                if (parseInt(text1[i].split('|')[0]) === players[0].id) {
                    var text2 = text1[i].split('|');
                    text2[7] = vl;
                    text2[8] = vlch;
                    text1[i] = text2.join('|');
                }
            }
            localStorage['players'] = text1.join('#');
        } else {
            // Если web db without connect, пытаемся это сделать
            if (!db) {
                await DBConnect();
            }

            // Если запись об игроке есть -> обновляем его цену
            const player = await getByKey('players', players[0].id);
            if (player !== undefined) {
                await setByName('players', 'value', vl);
                await setByName('players', 'valuech', vlch);
            }
        }
    }
}

async function GetValue() {
    if (localStorage.myteamid === players[0].teamid) {
        var list = {'players': 'id,tid,num,form,morale,fchange,mchange,value,valuech,name'}
        var head = list['players'].split(',')
        if (ff) {
            var text1 = String(localStorage['players'])
            if (text1 !== 'undefined') {
                var text = text1.split('#')
                for (i in text) {
                    var x = text[i].split('|')
                    var curt = {}
                    var num = 0
                    for (j in head) {
                        curt[head[j]] = (x[num] !== undefined ? x[num] : '')
                        num++
                    }
                    if (curt['id'] === players[0].id) UpdateValue(parseInt(curt['value']), parseInt(curt['valuech']))
                }
            }
        } else {
            // Если indexedDb not init, пытаемся это сделать
            if (!db) {
                await DBConnect();
            }

            // Получаем все данные из необходимой таблицы
            const requestResult = await getAll('players');
            // Если есть данные какие-либо данные в хранилище
            if (requestResult !== undefined && requestResult.length > 0) {
                for (let i = 0; i < requestResult.length; i++) {
                    let row = requestResult[i];
                    if (row['id'] === players[0].id) {
                        UpdateValue(row['value'], row['valuech']);
                    }
                }
            }
        }
    }
}

function UpdateValue(vl, vlch) {
    if (vl === 0) {
        SetValue(players[0].value, 0)
    } else {
        if (vl !== players[0].value) {
            players[0].valuech = players[0].value - vl
            SetValue(players[0].value, players[0].valuech)
        } else {
            players[0].valuech = vlch
        }
        if (players[0].valuech !== 0 && !isNaN(players[0].valuech)) PrintValue(players[0].valuech)
    }
}

function PrintValue(vlch) {
    /**
     var ttext = $('td.back4 table center:first').html().split('<br>')
     for(i in ttext){
		if(ttext[i].indexOf('Номинал')!=-1) ttext[i]=ttext[i]+(vlch==0?'':' <sup>'+(vlch>0 ? '<font color=green>+'+vlch/1000 : '<font color=red>'+vlch/1000)+'</font></sup>')
	}
     $('td.back4 table center:first').html(ttext.join('<br>'))
     /**/
}

function ShowCar(n) {
    if ($('a#th2').html() === '+') {
        $('tr#carpl' + n).show()
        $('a#th2').html('&ndash;')
    } else {
        $('tr#carpl' + n).hide()
        $('a#th2').html('+')
    }
}

function ShowTable(n) {
    var style = $('td.back4 table table:not(#plheader):eq(' + n + ')').attr('style')
    if (style === "display: none" || style == "display: none;" || style === "display: none; ") {
        $('td.back4 table table:not(#plheader):eq(' + n + ')').show()
        $('a#th' + n).html('&ndash;')
    } else {
        $('td.back4 table table:not(#plheader):eq(' + n + ')').hide()
        $('a#th' + n).html('+')
    }
}

function hist(rcode, rtype) {
    window.open('hist.php?id=' + rcode + '&t=' + rtype, 'История', 'toolbar=0,location=0,directories=0,menuBar=0,resizable=0,scrollbars=yes,width=480,height=512,left=16,top=16');
}


function sSkills(i, ii) { // Сортировка
    if (i[0] < ii[0]) return 1
    else if (i[0] > ii[0]) return -1
    else return 0
}

function ShowAll() {
    $('td.back4 table:first table:not(#plheader):first td').each(function () {
        $(this).removeAttr('class').find('img').removeAttr('style')
    })
}

function ShowSkills(skl) {
    ShowAll()
    if (compare === true) {
        $('td.back4 table:first table:not(#plheader):first td').each(function (i, val) {
            if (i % 3 === 0 && skl.indexOf($(val).find('script').remove().end().html().replace(/<!-- [а-я] -->/g, '')) === -1) {
                $(val).attr('class', 'back1')
                    .next().attr('class', 'back1').find('img').hide().end()
                    .next().attr('class', 'back1').find('img').hide();
            }
        })
    } else {
        $('td.back4 table:first table:not(#plheader):first td:even').each(function () {
            if (skl.indexOf($(this).find('script').remove().end().html().replace(/<!-- [а-я] -->/g, '')) === -1) {
                $(this).attr('class', 'back1')
                    .next().attr('class', 'back1').find('img').hide();
            }
        })
    }
}

function OpenAll() {
    if ($("#mydiv").attr('style')) $("#mydiv").removeAttr('style')
    else $("#mydiv").hide()
}

function RememberPl(x) {
	getPlayers()
    // Save player in local storage
    let mark = 1;
    let text = '';
    for (let k in players) {
        if (players[k].id === undefined || (parseInt(players[k].id) === parseInt(x) && k > 0 ) || k > 25) continue;
		if (parseInt(k) === 0 && parseInt(x) > 0) continue;
		if (parseInt(k) > 0 && parseInt(x) === 0 && parseInt(players[k].id) == parseInt(players[0].id)) continue;
        for (let i in players[k]) {
            text += i + '_' + mark + '=' + players[k][i] + ',';
        }
        mark++
    }
    localStorage.peflplayer = text;
	PrintPlayers()
}

function PrintPlayers(cur) {
	getPlayers();
    $('div#compare').empty()
    let htmltext = '<table border=0 width=100% rules=none>';
    for (i = 0; i < players.length; i++) {
        if ((i > 0 || cur === 0) && players[i].secondname !== undefined) {
            var secname = String(players[i].secondname).split(' ')
            var fname = String(players[i].firstname)
			var plhref = (players[i].t === undefined
				? ''
				: ' href="plug.php?p=refl&t=' + players[i].t + (players[i].k !== undefined? '&k='+players[i].k : '') + '&j=' + players[i].id + '&z=' + players[i].hash + '"')
            htmltext += '<tr><td nowrap><font size=1>'
            htmltext += '<a id="compare' + i + '" href="javascript:void(CheckPlayer' + (isOldRoster ? 'Old' : '') + '(' + i + '))"><</a>|'
            htmltext += '<a href="javascript:void(RememberPl(' + players[i].id + '))">x</a>|'
            htmltext += '<a' + (players[i].t === 'yp' ? '' : ' href="javascript:hist(\'' + players[i].id + '\',\'n\')"') + '>и</a>|'
            htmltext += '<font color="' + (players[i].secondname === players[0].secondname ? '#000' : '#aaa') + '" id="cc_compare' + i + '">cc'+players[i].sumskills + '</font>|'
            htmltext += '<a' + plhref + ' title="id'+players[i].id+'">' + (players[i].t !== 'yp' ? secname[secname.length - 1] : 'шкл') + '</a>' + (players[i].t === undefined || players[i].t === 'yp' ? '<sup>' + players[i].position + '</sup>' : '')
            htmltext += '</font></td></tr>'
        }
    }
    htmltext += '</table>'
    $('div#compare').append(htmltext)
}

function CheckPlayerOld(nn) {
    // console.log("CheckPlayerOld", nn, total_check_players);
    if (players[nn].secondname === players[0].secondname)
        return;
    if (total_check_players >= 3)
        return;
    total_check_players += 1;
    // Get data and compare players
    ShowAll()
    $('a#codeforforum').show()

//	$('a[id="th2"]').html('+')
    $('div#kar, div#plst, #th2, table#ph0, table#plst, table#debug').remove()

    $('td.back4').prepend('<div align="right">(<a href="' + window.location.href + '">x</a>)&nbsp;</div>')
    $('a#remember, a[id^="compare"]').removeAttr('href')
    compare = true

    var header = '<table width=100% id="plheader">'
    // имя, команда
    header += '<tr align=center><td width=50% valign=top>'
    header += '<b>' + players[0].firstname + ' ' + players[0].secondname + '</b>'
    header += (players[0].teamid !== undefined ? ' (<a href="plug.php?p=refl&t=k&j=' + players[0].teamid + '&z=' + players[0].teamhash + '">' : ' (')
    header += players[0].team
    header += (players[0].teamid !== undefined ? '</a>)' : ')')
    header += '</td>'
    header += '<td width=50% valign=top>'
    header += '<b>' + players[nn].firstname + ' ' + players[nn].secondname + '</b>'
    header += (players[nn].teamid !== undefined ? ' (<a href="plug.php?p=refl&t=k&j=' + players[nn].teamid + '&z=' + players[nn].teamhash + '">' : ' (')
    header += players[nn].team
    header += (players[nn].teamid !== undefined ? '</a>)' : ')')
    header += '</td></tr>'
    // возраст, гражданство, игры за сборные
    header += '<tr align=center><td valign=top>'
    header += players[0].age + ' лет' + (players[0].natfull !== ' ' ? ', ' + players[0].natfull : '')
    if (parseInt(players[0].internationalapps) !== 0
        || parseInt(players[nn].internationalapps) !== 0
        || parseInt(players[0].u21apps) !== 0
        || parseInt(players[nn].u21apps) !== 0) {
        header += ', ' + players[0].internationalapps + '(' + players[0].u21apps + ') матчей, ' + players[0].internationalgoals + '(' + players[0].u21goals + ') голов'
    }
    header += '</td>'
    header += '<td valign=top>'
    header += players[nn].age + ' лет' + (players[nn].natfull !== ' ' ? ', ' + players[nn].natfull : '')
    if (parseInt(players[0].internationalapps) !== 0
        || parseInt(players[nn].internationalapps) !== 0
        || parseInt(players[0].u21apps) !== 0
        || parseInt(players[nn].u21apps) !== 0) {
        header += ', ' + players[nn].internationalapps + '(' + players[nn].u21apps + ') матчей, ' + players[nn].internationalgoals + '(' + players[nn].u21goals + ') голов'
    }
    header += '</td></tr>'
    //контракты
    header += '<tr align=center>'
        + '<td>' + players[0].wage !== 0 ? players[0].contract + ' г. по ' + Player.currencyToString(players[0].wage,true) + ' в ИД' : ' ' + '</td>'
        + '<td>' + players[nn].wage !== 0 ? players[nn].contract + ' г. по ' + Player.currencyToString(players[nn].wage,true) + ' в ИД' : ' ' + '</td></tr>';

    // Номиналы
    if (players[0].value !== 0 || players[nn].value !== 0) {
        header += '<tr align=center>'
            + '<td>' + players[0].value !== 0 ? 'Номинал: ' +  Player.currencyToString(players[0].value) : ' ' + '</td>'
            + '<td>' + players[nn].value !== 0 ? 'Номинал: ' +  Player.currencyToString(players[nn].value) : ' ' + '</td></tr>';
    }
    // позиция
    header += '<tr align=center><td>'
    header += '<b>' + players[0].position + '</b>'
    if (players[0].newpos !== '' && players[0].newpos !== undefined) header += ' (' + players[0].newpos + ')'
    header += '</td>'
    header += '<td>'
    header += '<b>' + players[nn].position + '</b>'
    if (players[nn].newpos !== '' && players[nn].newpos !== undefined) header += ' (' + players[nn].newpos + ')'
    header += '</td></tr>'
    // умения
    header += '<tr align=center><td>'
    header += 'сс=' + players[0].sumskills
    header += '</td>'
    header += '<td>'
    header += 'сс=' + players[nn].sumskills
    header += '</td></tr>'

    header += '</table>'

    $('td.back4 table:first center:first').remove()
    $('div#th0').before(header)

    var skillupsumm = 0
    var skillupsumm2 = 0
    // Skills:
    $('td.back4 table:first table:not(#plheader):first td:even').each(function (i, val) {
        var skillname = sklfr[$(val).text()].elong
        var skillvalue0 = players[0][skillname]
        var skillvalue1 = (players[nn][skillname] === undefined ? '??' : players[nn][skillname])
        var skillup0 = parseInt(skillvalue0) * 7 + parseInt(ups[String(skillvalue0).split('.')[1]])
        var skillup1 = parseInt(skillvalue1) * 7 + parseInt(ups[String(skillvalue1).split('.')[1]])
        var skillup2 = parseInt(skillvalue1) * 7 + parseInt(ups[(String(skillvalue1).split('.')[1] === 'next' ? 'a1e' : String(skillvalue1).split('.')[1])])
        var raz = parseInt(skillvalue0) - parseInt(skillvalue1)
        skillupsumm += skillup0 - skillup1
        skillupsumm2 += skillup0 - skillup2
        var razcolor = 'red'
        if (raz === 0 || isNaN(raz)) raz = '&nbsp;&nbsp;&nbsp;&nbsp;'
        else if (raz > 0) {
            raz = '+' + raz
            razcolor = 'green'
        }
        var skilltext0 = String(skillvalue0).split('.')[0]
        skilltext0 += '<sup><font color="' + razcolor + '">' + raz + '</font></sup>'
        if (String(skillvalue0).split('.')[1]) {
            skilltext0 += ' <img height="12" src="system/img/g/' + String(skillvalue0).split('.')[1] + '.gif">'
        }
        var skilltext = '<td width=10%>'
        skilltext += String(skillvalue1).split('.')[0]
        if (String(skillvalue1).split('.')[1]) {
            skilltext += ' <img height="12" src="system/img/g/' + String(skillvalue1).split('.')[1] + '.gif">'
        }
        skilltext += '</td>'
        $(val)
            .next().attr('width', '10%')
            .html(skilltext0)
            .after(skilltext)
    })
    if (players[0].id === players[nn].id && (players[0].t === 'yp' || players[0].t === 'yp2')) {
        var skilltext = '<tr><td colspan=6>&nbsp;</td></tr>'
        skilltext += '<tr><td colspan=6 align=center><b>Изменения</b> (апы): '
        skilltext += '<font color=' + (skillupsumm < 0 ? 'red' : 'green') + '>' + (skillupsumm > 0 ? '+' : '') + skillupsumm + '</font>'
        skilltext += '</td></tr>'
        skilltext += '<tr><td colspan=6 align=center><b>зел = жел</b> (апы): '
        skilltext += '<font color="' + (skillupsumm2 < 0 ? 'red' : 'green') + '">' + (skillupsumm2 > 0 ? '+' : '') + skillupsumm2 + '</font>'
        skilltext += '</td></tr>'
        skilltext += '<tr><td colspan=6>&nbsp;</td></tr>'
        $('td.back4 table:first table:not(#plheader):eq(0)').append(skilltext)
    }

    $('td.back4 table:first table:not(#plheader):eq(1) tr:first td:gt(0)').attr('colspan', '3').attr('align', 'center')
    $('td.back4 table:first table:not(#plheader):eq(1) tr:gt(0)').each(function (i, val) {
        if (i !== 1) $(val).find('td:eq(7)').after('<td' + (i == 0 ? ' rowspan=2' : '') + '>' + (players[nn]['kk' + i] != undefined ? players[nn]['kk' + i] : '?') + '</td><td' + (i == 0 ? ' rowspan=2' : '') + ' class=back1 width=1%> </td>')
        if (i !== 1) $(val).find('td:eq(6)').after('<td' + (i == 0 ? ' rowspan=2' : '') + '>' + (players[nn]['zk' + i] != undefined ? players[nn]['zk' + i] : '?') + '</td><td' + (i == 0 ? ' rowspan=2' : '') + ' class=back1 width=1%> </td>')

        $(val).find('td:eq(5)').after('<td>' + (parseFloat(players[nn]['sr' + i]) == 0 || players[nn]['sr' + i] == undefined ? '0,00' : String((parseFloat(players[nn]['sr' + i])).toFixed(2)).replace('.', ',')) + '</td><td class=back1 width=1%> </td>')
        $(val).find('td:eq(4)').after('<td>' + (players[nn]['im' + i] != undefined ? players[nn]['im' + i] : '?') + '</td><td class=back1 width=1%> </td>')
        $(val).find('td:eq(3)').after('<td>' + (players[nn]['ps' + i] != undefined ? players[nn]['ps' + i] : '?') + '</td><td class=back1 width=1%> </td>')
        $(val).find('td:eq(2)').after('<td>' + (players[nn]['gl' + i] != undefined ? players[nn]['gl' + i] : '?') + '</td><td class=back1 width=1%> </td>')
        $(val).find('td:eq(1)').after('<td>' + (players[nn]['ig' + i] != undefined ? players[nn]['ig' + i] : '?') + '</td><td class=back1 width=1%> </td>').before('<td class=back1 width=1%> </td>')
    })

    ShowPolygonCheckPlayer(nn);

    switch (total_check_players) {
        case 1: $("font#cc_compare"+nn).css('color', '#a22'); break;
        case 2: $("font#cc_compare"+nn).css('color', '#22a'); break;
        case 3: $("font#cc_compare"+nn).css('color', '#2aa'); break;
        default: $("font#cc_compare"+nn).css('color', '#555');
    }

    $("td#thx a").bind('click.mynamespace', function(e) {
        ResetPolygon();
    });

    return false
}


function CheckPlayer(nn) {
    // console.log("CheckPlayer", nn, players[nn], total_check_players);
    if (players[nn].secondname === players[0].secondname)
        return;
    if (total_check_players >= 3)
        return;
    total_check_players += 1;

    // Get data and compare players
    let season = 0;
    let data = {};
    for (i in players[nn]) {
        switch (i) {
            case 'sumskills':
            case 's':
            case 'ss0':
            case 't':
            case 'k':
            case 'flag':
            case 'team':
            case 'teamid':
            case 'teamhash':
            case 'teamnat':
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
            case 'firstname':
                break;
            case 'secondname':
                data['pname'] = (players[nn].nation !== undefined
                    ? players[nn].nation
                    : 217) + '|' + players[nn]['firstname'] + ' ' + players[nn][i] + '|p=refl&t=' + players[nn]['t'] + '&j=' + players[nn]['id'] + '&z=' + players[nn]['hash'];
                break;
            case 'internationalapps':
                data['int'] = players[nn][i] + '.' + players[nn]['internationalgoals'];
                break;
            case 'u21apps':
                data['u21'] = players[nn][i] + '.' + players[nn]['u21goals'];
                break;
            case 'value':
                data[i] = (players[nn][i] === 0 ? '' : Player.currencyToString(players[nn][i]));
                break;
            case 'wage':
                data[i] = Player.currencyToString(players[nn][i],true);
                break;
            default:
                data[i] = String(players[nn][i]);
        }
    }
    var cur = {
        'pname': '<img height="12" src="system/img/flags/mod/' + players[0].nation + '.gif"> ' + '<b>' + players[0]['firstname'] + ' ' + players[0]['secondname'] + '</b>',
        'age': players[0]['age'],
        'value': (players[0].value === 0 ? '' : Player.currencyToString(players[0].value)),
        'int': 'матчей ' + players[0]['internationalapps'] + ', голов ' + players[0]['internationalgoals'],
        'u21': 'матчей ' + players[0]['u21apps'] + ', голов ' + players[0]['u21goals'],
        'position': players[0]['position'],
        'wage': Player.currencyToString(players[0].wage,true),
		'foot': players[0]['foot'],
        'curseason': localStorage.season
    }

    $('table#stat,span#err,#dcode1').hide();
    $('#dcode1').html('');
    $('table#res,table#skills').show();

    if (sknum > 2) {
        sknum = 0;
        $('table[id^="res"], td[id^="res"]').remove();
    }
    if (sknum === undefined || sknum === 0) {
        $('table#stat').before('<table id=res class=back1 align=center width=70% cellpadding=2 cellspacing=1><tr><td nowrap id=thx align=center class=back2>[<a href="javascript:void(SkReset())"><font color=red>Х</font> сбросить</a>]</td></tr></table>');
    }
    sknum++;
    $('td#thx').after('<td nowrap width=30%>' + (season != 0 ? '<b>' + season + ' сезон</b>' : ' ') + '</td>');
    var ssn = 0;
    if (data['pname'] === undefined) data['pname'] = '';

    for (i in data) {
		// console.log('go data[i]',i,data[i])
        let nm = (lc[i] === undefined ? i : lc[i].rn);
        let statTd = $('td#' + i);

        if (i !== '' && statTd.length === 0) {
            $('table#res').prepend('<tr class=back2><td nowrap id=' + i + '>' + nm + '</td><td nowrap>' + (cur[i] !== undefined ? cur[i] : '') + '</td></tr>');
			statTd = $('td#' + i);
        }
        switch (i) {
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
                if (statTd.length > 0) {
                    var x = data[i].split('.');
                    x[0] = parseInt(x[0], 10);
                    if (isNaN(x[0])) {
                        x[0] = '??';
                        ch = '';
                    } else {
                        var ch = parseInt(statTd.next().text(), 10) - x[0];
                        if (ch > 0) ch = '<font color=green size=1>+' + ch + '</font>';
                        else if (ch < 0) ch = '<font color=red size=1>' + ch + '</font>';
                        else ch = '';
                    }
                    var m = statTd.next().clone()
                        .attr('id', 'res_' + i + nn)
                        .each(function () {
                            if ($(this).find('span').length > 0) {
                                $(this).find('span:first').html(
                                        '<font color=gray>'
                                        + x[0]
                                        + '</font>'
                                        + (x[1] !== undefined ? ' <img height=10 src=system/img/g/' + x[1] + '.gif>' : '')
                                        + '<sup>'
                                        + ch
                                        + '</sup>'
                                );
                                $(this).find('span.arrow').html('');
                            } else {
                                $(this).html(
                                    '<font color=gray>'
                                    + x[0]
                                    + '</font>'
                                    + (x[1] != undefined ? ' <img height=10 src=system/img/g/' + x[1] + '.gif>' : '')
                                    + '<sup>'
                                    + ch
                                    + '</sup>'
                                );
                            }
                        });
                    statTd.after(m);
                }
                break;
            case 'int':
            case 'u21':
                var x = data[i].split('.');
                statTd.after('<td nowrap><font color=gray>' + (x[0] > 0 ? 'матчей ' + x[0] + ', голов ' + x[1] : '') + '</font></td>');
                break;
            case 'pname':
                var x = data[i].split('|');
                statTd.after('<td nowrap>' + (x[0] === '' ? '' : '<img height="12" src="system/img/flags/mod/' + x[0] + '.gif"> <a href="plug.php?' + x[2] + '"><b>' + x[1] + '</b></a>') + '</td>');
                break;
            default:
                if (i === '') console.error('Error: i is empty with data=' + data[i]);
                else statTd.after('<td nowrap><font color=gray>' + data[i] + '</font></td>');
        }
    }
    $('td[id^="ss"]').attr('colSpan', 2 + sknum);
    $('#s').after('<td class=back1 id=res_s' + nn + '>' + players[nn].sumskills + '</td>');

    ShowPolygonCheckPlayer(nn);

    switch (total_check_players) {
        case 1: $("font#cc_compare"+nn).css('color', '#a22'); break;
        case 2: $("font#cc_compare"+nn).css('color', '#22a'); break;
        case 3: $("font#cc_compare"+nn).css('color', '#2aa'); break;
        default: $("font#cc_compare"+nn).css('color', '#555');
    }

    $("td#thx a").bind('click.mynamespace', function(e) {
        ResetPolygon();
    });

    return false
}

function CodeForForum() {
    var x = '<div align="right">(<a href="' + window.location.href + '">x</a>)&nbsp;</div>'
    var pl = players[0]
    var ptype = url.t;
    var skillsshow = ($('a#th0').html() !== '+')
    var seasonstatshow = ($('a#th1').html() !== '+')
    var fullstatshow = ($('a#th2').html() !== '+')
    var lastplstatshow = (!($('a#plst').length > 0 && $('a#plst').html() === '+'))

    $('td.back4 table:first table:not(#plheader):first img').removeAttr('style')
    x += '<br><hr><b>Полный вариант</b>:<br>'
    x += '<textarea rows="20" cols="80" readonly="readonly" id="CodeForForum">'
    x += '[spoiler]'
    x += '[table width=100% bgcolor=#C9F8B7][tr][td]\n[center]'
    if (compare === true) {
        x += $('table#plheader')
            .find('a:contains("интересуются")').removeAttr('href').end()
            .find('a[id="th0"]').remove().end()
            .find('center, b, td').removeAttr('id').end()
            .find('img').removeAttr('width').end()
            .html()
            .replace('\/flags\/', '/flags/mod/')
            .replace(/img src="/g, 'img]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/\<a\>интересуются\<\/a\>/g, 'интересуются')
            .replace(/<!-- [а-я] -->/g, '')
            .replace(/<tbody>/g, '<table width=100%>')
            .replace(/tbody/g, 'table')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/a href=\"/g, 'url=')
            .replace(/\/a/g, '/url')
            .replace(/\&amp\;/g, '&')
            .replace(/"/g, '')
            .replace(/\[br\]/g, '\n')
//		x += '\n'

    } else {
//		x += '[url=plug.php?' + location.search.substring(1) + ']#[/url] [b]'
        x += '[url=plug.php?p=refl&t=' + pl.t + '&j=' + pl.id + '&z=' + pl.hash + ']#[/url] [b]'
        x += $('td.back4 table center:first b:first')
            .find('a[id="th0"]').remove().end()
            .find('img').removeAttr('width').end()
            .html()
            .replace('\/flags\/', '/flags/mod/')
            .replace(/img src="/g, 'img height=12]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/\<a\>интересуются\<\/a\>/g, 'интересуются')
            .replace(/<!-- [а-я] -->/g, '')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/a href=\"/g, 'url=')
            .replace(/\/a/g, '/url')
            .replace(/\&amp\;/g, '&')
            .replace(/"/g, '')
            .replace(/\[br\]/g, '\n')
            //			.replace(/\[sup\]/g,'(')
            //			.replace(/\[\/sup\]/g,')')
            .replace(/font /g, '')
            .replace(/font/g, 'color')
        if (ptype === 'yp' || ptype === 'yp2') x += '[/b]\n' + pl.position + '[b]'
        if (pl.newpos !== '' && pl.newpos !== undefined) x += '[/b] (' + pl.newpos + ')[b]'
        x += '\n\nУмения[/b](сс=' + pl.sumskills
        x += (pl.flag === 5 ? ', школьник' : '')
        x += (pl.flag === 7 ? ', молодёжь' : '')
        x += (pl.t === 'p2' ? ', свободный' : '')
        x += ')[/center]'

    }

    // skills
    if (skillsshow) {
        x += '\n'
        x += $('td.back4 table table:not(#plheader):first')
            .find('tr.back2').removeAttr('class').end()
            .find('tr.back3').removeAttr('class').attr('bgcolor', '#A3DE8F').end()
            .find('td.back1').removeAttr('class').attr('bgcolor', '#C9F8B7').end()
            .find('img').removeAttr('ilo-full-src').end()        // fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
            //			.find('sup').remove().end()
            .html()
            .replace(/<!-- [а-я] -->/g, '')
            .replace(/<tbody>/g, '<table width=100%>')
            .replace(/tbody/g, 'table')
            .replace(/<font /g, '[')
            .replace(/\/font/g, '/color')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/ height=\"12\"/g, '')
            .replace(/img src="/g, 'img height=10]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/"/g, '')
            .replace(/\n/g, '')
    }
    var y = x

    // stat of season
    if (seasonstatshow && (ptype === 'p' || ptype === 'pp')) {
        x += '\n[center][b]Статистика сезона[/b][/center]\n'
        x += $('table#stat')
            .find('tr.back2').removeAttr('class').end()
            .find('tr.back3').removeAttr('class').attr('bgcolor', '#A3DE8F').end()
            .find('td.back1').removeAttr('class').attr('bgcolor', '#C9F8B7').end()
            .find('img').removeAttr('ilo-full-src').end()        // fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
            .html()
            .replace(/<!-- [а-я] -->/g, '')
            .replace(/<tbody>/g, '<table width=100%>')
            .replace(/tbody/g, 'table')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/img src="/g, 'img height=10]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/"/g, '')
            .replace(/\[td\]\[\/td\]/g, '[td] [/td]')
    }
    // fullstat
    if ($('table#ph0').html() != null && fullstatshow && (ptype === 'p' || ptype === 'pp')) {
        x += '\n[center][b][url=hist.php?id=' + pl.id + '&t=p]Карьера[/url][/b][/center]\n'
        x += $('table#ph0')
            .find('tr.back2').removeAttr('class').end()
            .find('tr.back3').removeAttr('class').attr('bgcolor', '#A3DE8F').end()
            .find('img')
            .removeAttr('ilo-full-src')        // fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
            .removeAttr('width')
            .end()
            .find('a#th2').remove().end()
            .find('tr').removeAttr('style').removeAttr('id').end()
            .html()
            .replace(/<!-- [а-я] -->/g, '')
            .replace(/<tbody>/g, '<table width=100%>')
            .replace(/tbody/g, 'table')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/img src="/g, 'img]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/"/g, '')
            .replace(/\[td\]\[\/td\]/g, '[td] [/td]')
    }
    if ($('table#plst').html() != null && lastplstatshow) {
        x += '\n[center][b]Последние матчи[/b][/center]\n'
        x += $('table#plst')
            .find('tr.back2').removeAttr('class').end()
            .find('tr.back3').removeAttr('class').attr('bgcolor', '#A3DE8F').end()
            .find('td.back1').removeAttr('class').attr('bgcolor', '#C9F8B7').end()
            .find('img')
            .removeAttr('ilo-full-src')        // fix: http://forum.mozilla-russia.org/viewtopic.php?id=8933
            .removeAttr('width')
            .end()
            .find('tr').removeAttr('style').removeAttr('id').end()
            .html()
            .replace(/<tbody>/g, '<table width=100%>')
            .replace(/tbody/g, 'table')
            .replace(/<font /g, '[')
            .replace(/\/font/g, '/color')
            .replace(/a href=\"/g, 'url=')
            .replace(/\/a/g, '/url')
            .replace(/\</g, '[')
            .replace(/\>/g, ']')
            .replace(/img src="/g, 'img]')
            .replace(/.gif/g, '.gif[/img')
            .replace(/.png/g, '.png[/img')
            .replace(/"/g, '')
            .replace('[img]system/img/refl/krest.gif[/img]', '[color=red][b]Т[/b][/color]')
        //.replace(/\[td\]\[\/td\]/g,'[td] [/td]')
    }

    x += '[/td][/tr][/table]'
    x += '\n\n'
    x += '[center]--------------- [url=forums.php?m=posts&q=173605]Крабовый VIP[/url] ---------------[/center]\n';
    x += '[/spoiler]'
    x += '</textarea><hr>'
    $('td.back4').html(x)
    $('td#crabglobalright').empty()

    return true
}

function lp(txt) {
    let num = 19 - txt.length;
    for (let i = 0; i < num; i++) txt += '_';

    return txt
}

function getJSONlocalStorage(dataname) {
    if (String(localStorage[dataname]) !== 'undefined') {
        let data = []
        let data2 = JSON.parse(localStorage[dataname]);
        switch (dataname) {
            case 'matchespl2':
                for (let k in data2) {
                    data[k] = []
                    for (let l in data2[k]) {
                        if (data2[k][l].id !== undefined) data[k][data2[k][l].id] = data2[k][l]
                        else data[k][l] = data2[k][l]
                    }
                }
                return data
            default:
                return data2
        }
    } else {
        return false
    }
}

function ShowLastStats() {
    debug('LastStats()')
    $('a#codeforforum').show()
    if ($('table#plst tr').length === 0) {
        var matches = getJSONlocalStorage('matches2')
        matches.sort(function (a, b) {
            if (a != null && b != null) return (((a.dt == undefined ? (a.hnm != undefined && a.anm != undefined ? 0 : 100000000) : a.dt) + a.id * 0.0000001) - ((b.dt == undefined ? (b.hnm != undefined && b.anm != undefined ? 0 : 100000000) : b.dt) + b.id * 0.0000001))
        })
        var matchespl = getJSONlocalStorage('matchespl2')
        var html = '<tr><td>нет данных</td></tr>'
        if (matches && matchespl) {
            html = ''
            var num = 1
            for (i in matchespl) {
                var mpl = matchespl[i]
//				debug(String(players[0].firstname)[0]+'.'+players[0].secondname + ':'+i)
                if (i == String(players[0].firstname)[0] + '.' + players[0].secondname) {
                    var matchpos = [, 'GK', ,
                        , , 'SW', , ,
                        'R DF', 'C DF', 'C DF', 'C DF', 'L DF',
                        'R DM', 'C DM', 'C DM', 'C DM', 'L DM',
                        'R M', 'C M', 'C M', 'C M', 'L M',
                        'R AM', 'C AM', 'C AM', 'C AM', 'L AM',
                        , 'FW', 'FW', 'FW', ,
                        , 'FW', 'FW', 'FW', ,
                        'L AM', 'C AM', 'C AM', 'C AM', 'R AM',
                        'L M', 'C M', 'C M', 'C M', 'R M',
                        'L DM', 'C DM', 'C DM', 'C DM', 'R DM',
                        'L DF', 'C DF', 'C DF', 'C DF', 'R DF',
                        , , 'SW', , ,
                        , 'GK']

                    for (j in matches) {
                        var mch = matches[j]
                        if (mpl[mch.id] != undefined) {
                            var mchpl = mpl[mch.id]
                            var date = '&nbsp;'
                            if (mch.dt != undefined) {
                                var dt = new Date(mch.dt * 100000)
                                mdate = parseInt(dt.getDate())
                                mmonth = parseInt(dt.getMonth()) + 1
                                date = (mdate < 10 ? '0' : '') + mdate + '.' + (mmonth < 10 ? 0 : '') + mmonth//+ '.'+dt.getFullYear()
                            }
                            var type = '&nbsp;'
                            if (mch.tp != undefined) {
                                switch (mch.tp) {
                                    case 't':
                                        type = 'Товарищеский';
                                        break;
                                    //case 'c': type='Кубок'
                                    default:
                                        type = mch.tp
                                }
                            }
                            var t1 = (mch.hnm == undefined ? '<b>' + players[0].team + '</b>' : mch.hnm)
                            var t2 = (mch.anm == undefined ? '<b>' + players[0].team + '</b>' : mch.anm)
                            var t1u = ''
                            var t2u = ''
                            if (mch.ust != undefined) {
                                var ust = mch.ust.split('.')
                                t1u = (ust[1] == undefined || ust[1] == 'h' ? (ust[0] == 'p' ? '(прд)' : '(акт)').fontcolor('red') : '') //p.h a.h p
                                t2u = (ust[1] == undefined || ust[1] == 'a' ? (ust[0] == 'p' ? '(прд)' : '(акт)').fontcolor('red') : '') //p.a a.a p
                            }
                            var minute = (mchpl.m == undefined ? (mch.m == undefined ? '&nbsp;' : mch.m) : mchpl.m)
                            var im = (mchpl.im != undefined ? true : false)
                            var mark = (mchpl.mr != undefined ? (im ? '<b>' : '') + mchpl.mr + (im ? '</b>' : '') : '&nbsp;')
                            var cp = (mchpl.cp != undefined ? 'кэп' : '') + '&nbsp;'
                            //var goals	= (mchpl.g!=undefined ? '<img src="system/img/refl/ball.gif" width=10></img>'+(mchpl.g==2 ? '<img src="system/img/refl/ball.gif" width=10></img>' : (mchpl.g>2 ? '('+mchpl.g+')' : '')) : '&nbsp;')
                            var goals = (mchpl.g != undefined ? mchpl.g : '&nbsp;')
                            var cards = (mchpl.cr != undefined ? '<img src="system/img/gm/' + mchpl.cr + '.gif"></img>' : '&nbsp;')
//							cards		= cards + (mchpl.t==1 ? '&nbsp;<font color=red><b>T</b></font>':'')
                            cards = cards + (mchpl.t == 1 ? '&nbsp;<img src="system/img/refl/krest.gif" width=10></img>' : '')
                            var inz = (mchpl['in'] != undefined ? '<img src="system/img/gm/in.gif"></img>' : (minute < mch.m ? '<img src="system/img/gm/out.gif"></img>' : '&nbsp;'))
                            var pos = '&nbsp;'
                            if (mchpl.ps != undefined) {
                                pos = ''
                                var posarr = String(mchpl.ps).split(':')
                                for (n in posarr) {
                                    var posname = matchpos[parseInt(posarr[n])]
                                    var red1 = ''
                                    var red2 = ''
                                    if (players[0].position && !filterPosition(players[0].position, posname)) {
                                        red1 = '<font color=red>'
                                        red2 = '</font>'
                                    }
                                    pos += (n == 0 ? '' : ',') + red1 + posname + red2
                                }
                            }
                            minute = minute + '\''

                            var tr = '<tr class=back3>'
                            tr += '<td align=right>' + date + '</td>'
                            tr += '<td align=right>' + inz + minute + '</td>'
                            tr += '<td>' + pos + '</td>'
                            tr += '<td align=right>' + mark + '</td>'
                            tr += '<td align=center>' + goals + '</td>'
                            tr += '<td>' + cards + cp + '</td>'
                            //tr += '<td><img src="system/img/w'+(mch.w==undefined?0:mch.w)+'.png"></img> '+(mch.n!=undefined?'N':'')+'</td>'
                            tr += '<td align=right>' + t1 + t1u + '</td>'
                            tr += '<td align=center>' + (mch.h != undefined ? '<a href="plug.php?p=refl&t=if&j=' + mch.id + '&z=' + mch.h + '">' : '') + mch.res + (mch.h != undefined ? '</a>' : '') + '</td>'
                            tr += '<td>' + t2 + t2u + '</td>'
                            //tr += '<td>'+type+'</td>'
                            tr += '</tr>'
                            html = tr + html
                            num++
                        }
                    }
                    html = '<tr class=back2 height=20><td>N</td><td>мин</td><td>поз</td><td>рейт</td><td>голы</td><td>&nbsp;</td>'
                        //		+'<td>&nbsp;</td>'
                        + '<td colspan=3 align=center>матч</td>'
                        //		+'<td>турнир</td>'
                        + '</tr>'
                        + html
                    break
                }
            }
        }
        $('table#plst').append(html)
    }
    if ($('a#plst').html() == '+') {
        $('table#plst tr').show()
        $('a#plst').html('&ndash;')
    } else {
        $('table#plst tr').hide()
        $('a#plst').html('+')
    }
}

function doOldRoster() {

    if (url.t === 'plast' || url.t === 'plast2') return false

    drawEars();

    $('td.back4 table table tr[bgcolor=#a3de8f]').removeAttr('bgcolor').addClass('back3')

    for (i in skillnames) {
        sklfr[skillnames[i].rlong] = skillnames[i]
        sklfr[skillnames[i].rlong].elong = i
    }
    sklfr['Игра на выходах'] = sklfr['Игра головой']

    // get player skills
    var skillsum = 0
    $('td.back4 table:first table:first td:even').each(function () {
        var skillarrow = ''
        var skillname = $(this).find('script').remove().end().html().replace(/<!-- [а-я] -->/g, '');
        var skillvalue = parseInt($(this).next().find('script').remove().end().html().replace('<b>', ''));
        if ($(this).next().find('img').attr('src') != undefined) {
            skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
        }
        skillsum += (isNaN(skillvalue) ? 0 : skillvalue);
        if (sklfr[skillname] != undefined) players[0][sklfr[skillname].elong] = skillvalue + skillarrow;
    })
    if (players[0].heading == undefined) players[0].heading = '??'
    if (players[0].handling == undefined) players[0].handling = '??'
    if (players[0].reflexes == undefined) players[0].reflexes = '??'

    players[0].sumskills = skillsum

    //add sum of skills to page
    $('td.back4 table center:first').append('<span class="forumcodetrigger">(сс=' + String(skillsum) + ')</span>')

    //get player header info
    var ms = $('td.back4 table center:first').html().replace('<b>', '').replace('</b>', '').replace(/<!-- [а-я] -->/g, '').split('<br>', 6)
    var j = 0

    var name = ms[j].split(' (', 1)[0].split(' <', 1)[0]
    if (name.indexOf(' ') != -1) {
        players[0].firstname = name.split(' ', 1)[0]
        players[0].secondname = name.replace(players[0].firstname + ' ', '')
    } else {
        players[0].firstname = ''
        players[0].secondname = name
    }

    players[0].team = ''
    players[0].sale = 0

    players[0].t = url.t
    let urlTeam = new Url($('td.back4 a:first')[0]);
    if (url.t== 'p' || url.t == 'pp') {
        players[0].team = $('td.back4 a:first').text()
        players[0].teamid = urlTeam.j;
        players[0].teamhash = urlTeam.z;
    } else if (url.t == 'p2') {
        players[0].team = 'свободный'
    }
    // школяр!
    if (url.t == 'yp' || url.t == 'yp2') {
        players[0].flag = 5
    }
    players[0].id = url.j;
    players[0].hash = url.z;
    if ($('a:[href^="plug.php?p=tr&t=ncyf&n=yf"]').length > 0) {
        //значит молодежь
        players[0].flag = 7
    }

    j++
    if (ms[j].indexOf('в аренде') != -1) j++
    players[0].age = +ms[j].split(' ', 1)[0]
    if (ms[j].indexOf('(матчей') > -1) {
        players[0].natfull = ms[j].split(', ', 2)[1].split(' (', 1)[0]
        players[0].internationalapps = +ms[j].split(', ', 2)[1].split('матчей ', 2)[1]
        players[0].internationalgoals = +ms[j].split(', ', 3)[2].split(' ', 2)[1].replace(')', '')
        if (ms[j].indexOf('U21') > -1) {
            players[0].u21apps = +ms[j].split('/ U21 матчей ', 2)[1].split(',', 1)[0]
            players[0].u21goals = +ms[j].split('/ U21 матчей ', 2)[1].split(', голов ', 2)[1].replace(')', '')
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
    if (ms[j].indexOf('Контракт:') != -1) {
        players[0].contract = +ms[j].split(' ', 4)[1]
        players[0].wage = +ms[j].split(' ', 4)[3].replace(/,/g, '').replace('$', '')
        j++
    } else {
        if (url.t == 'yp' || url.t == 'yp2') {
            players[0].contract = 21 - players[0].age
            players[0].wage = 100
        } else {
            players[0].contract = 0
            players[0].wage = 0
        }
    }
    if (ms[j].indexOf('Номинал:') != -1) {
        players[0].value = +ms[j].split(' ', 2)[1].replace(/,/g, '').replace('$', '')
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

    $('td.back4 table:first table:eq(1) tr:gt(0)').each(function (i, val) {
        players[0]['ig' + i] = parseInt($(val).find('td:eq(1)').text())
        players[0]['gl' + i] = parseInt($(val).find('td:eq(2)').text())
        players[0]['ps' + i] = parseInt($(val).find('td:eq(3)').text())
        players[0]['im' + i] = parseInt($(val).find('td:eq(4)').text())
        players[0]['sr' + i] = parseFloat(($(val).find('td:eq(5)').text() == '' ? 0 : $(val).find('td:eq(5)').text()))
    })

    players[0].newpos = ''
    // get post-info
    var ms2 = $('td.back4 > center:first').html()
    if (ms2 != null) {
        if (ms2.indexOf('New pos:') != -1) {
            var x = ms2.split('New pos: ');
            players[0].newpos = x[1].split('<')[0]
            if (x[2] != undefined) players[0].newpos = players[0].newpos + ' ' + x[2].split('<')[0]
            if (x[3] != undefined) players[0].newpos = players[0].newpos + ' ' + x[3].split('<')[0]
            $('td.back4 table center:first b:first').after(' (' + players[0].newpos + ')')
        }

        var j2 = 0
        ms2 = ms2.replace(/<!-- [а-я] -->/g, '').split('<br>')
        players[0].form = +ms2[j2].split(': ', 2)[1].split('%', 1)[0]
        players[0].morale = +ms2[j2].split(': ', 3)[2].replace('%</i>', '')
        j2++;
        j2++;
        j2++;
        j2++
        // Национальные турниры:
        if (ms2[j2].split(': ', 2)[0] === 'Дисквалифицирован') j2++
        players[0].zk0 = +ms2[j2].split(': ', 2)[1]
        j2++
        players[0].kk0 = +ms2[j2].split(': ', 2)[1]
        j2++;
        j2++;
        j2++
        // Международные турниры:
        if (ms2[j2].split(': ', 2)[0] === 'Дисквалифицирован') j2++
        players[0].zk2 = +ms2[j2].split(': ', 2)[1]
        j2++
        players[0].kk2 = +ms2[j2].split(': ', 2)[1]
        j2++;
        j2++;
        j2++
        // Сборная:
        if (ms2[j2].split(': ', 2)[0] === 'Дисквалифицирован') j2++
        players[0].zk3 = +ms2[j2].split(': ', 2)[1]
        j2++
        players[0].kk3 = +ms2[j2].split(': ', 2)[1]

        players[0].zk4 = ' ';
        players[0].kk4 = ' ';

        $('td.back4 table:first table:eq(1) tr:first')
            .find('td:eq(0)').attr('width', '27%').end()
            .find('td:eq(1)').attr('width', '10%').end()
            .find('td:gt(1)').attr('width', '13%').end()
            .find('td:last').attr('width', '8%').end()
            .append('<td width=8%>ЖК <img src="system/img/gm/y.gif"></img></td><td width=8%>КК <img src="system/img/gm/r.gif"></img></td>')
        $('td.back4 table:first table:eq(1) tr:gt(0)').each(function (i, val) {
            if (i === 0) $(val).append('<td rowspan=2>' + players[0].zk0 + '</td><td rowspan=2>' + players[0].kk0 + '</td>')
            else if (i === 2) $(val).append('<td>' + players[0].zk2 + '</td><td>' + players[0].kk2 + '</td>')
            else if (i === 3) $(val).append('<td>' + players[0].zk3 + '</td><td>' + players[0].kk3 + '</td>')
            else if (i === 4) $(val).append('<td></td><td></td>')
        })
    } else {
        players[0].form = 0
        players[0].morale = 0
        for (i = 0; i <= 4; i++) {
            players[0]['ig' + i] = 0
            players[0]['gl' + i] = 0
            players[0]['ps' + i] = 0
            players[0]['im' + i] = 0
            players[0]['sr' + i] = 0
            players[0]['zk' + i] = 0
            players[0]['kk' + i] = 0
        }

    }

    var mm = ''
    // fill poss masive

    var text3 = ''
    text3 += '<br><b>Карта умений: </b><b><sup><a href="#" onClick="alert(\'Карта умений игрока была создана по мотивам Football Manager. Отображает в графическом виде умения игрока в различных категориях:\\n\\n  отбор: Отбор мяча\\n  мощь: Мощь\\n  энерг.: (Выносливость+Работоспособность)/2\\n  передачи: (Пас+Навес)/2\\n  владение: (Видение поля+Техника)/2\\n  дриблинг: Дриблинг\\n  удары: (Удар+Дальний удар)/2\\n  скор.: Скорость\\n  голов.:  Игра головой\\n  позиц.: Выбор позиции\')">?</a></sup></b><br>';
    text3 += '<canvas id="polygon" width="181" height="181"></canvas><br>';
    text3 += '<br><b>Номинал+</b>: <b><sup><a href="#" onClick="alert(\'Корректировка номинала получена с помощью оценки сделок предыдущего ТО по игрокам данной категории (позиция, возраст, номинал, некоторые профы)\')">?</a></sup></b><br>'
    text3 += '<div id="SValue"><a href="javascript:void(RelocateGetNomData())">Показать</a></div>'
    text3 += '<br><a id="remember" href="javascript:void(RememberPl(0))">' + ('Запомнить игрока').fontsize(1) + '</a><br>'
    text3 += '<div id="compare"></div>'
    text3 += '<br><br><a id="codeforforum" href="javascript:void(CodeForForum())" style="display:none">' + ('Код для форума').fontsize(1) + '</a><br><br>'
    text3 += '<b>Сила&nbsp;игрока</b><div id=str>'
    text3 += '<i><font size=1>сходите в Состав+</font></i>'
    text3 += '</div>'

    var hidden = 0
    var pfs3pre = ''
    var pflinkpre = ''

    // Modify page and fill data
    $('td.back4 script').remove()
    $('body table.border:has(td.back4)').appendTo($('td#crabglobalcenter'));
    $('#crabrighttable').addClass('border')
    $("#crabright").html(text3)
    $("#mydiv").hide()
    $('center:eq(1) ~ br:first').before('<div id="th0"><a id="th0" href="javascript:void(ShowTable(0))">&ndash;</a></div>').remove()
    $('center:eq(2) ~ br').before('<div id="th1"><a id="th1" href="javascript:void(ShowTable(1))">&ndash;</a></div>').remove()

    $('td.back4 table table:eq(1)').attr('id', 'stat')

    // 1 апреля
    if (players[0].teamid == parseInt(localStorage.myteamid)) {
        delete localStorage.oneid
        var statsplayer = '<br><div id="plst" align=center>Последние матчи</div>'
        statsplayer += '<div id="plst"><a id="plst" href="javascript:void(ShowLastStats())">+</a></div>'
        statsplayer += '<table width=100% id="plst"></table>'
        $('td.back4 table table:eq(1)').after(statsplayer)
    }

    // добавим ссылку на заметки
    if (url.t != 'yp') $('td.back4' + (url.t != 'yp2' ? ' center:last' : '')).append("<br><a href=\"javascript:hist('" + players[0].id + "','n')\">Заметки</a>")

    getPlayers();
    if (players.length > 1) PrintPlayers();
    GetValue()
    ShowAdaptation(players[0].natfull)
    ShowPolygon()
    RelocateGetNomData()
    GetData('positions')
    printStrench()

    $('.forumcodetrigger').click(function () {
        $('a#codeforforum').show();
    });
    /**/
}

function doNewRoster() {
    if (url.t == 'plast' || url.t == 'plast2') {
        return false;
    }

    // берем мерку какой сезон
    if ($('a[href*=SavePl]').length > 0) {
        var ses = parseInt($('a[href*=SavePl]').prev().prev().prev().text(), 10);
        if (!isNaN(ses)) localStorage.season = ses;
    }


    //пририсовываем справа панель
    drawEars();

    // get player skills
    $('table#skills td[id]').each(function () {
        var skilleng = $(this).attr('id');
        var skillname = $(this).html();
		var skillvalue = parseInt(String($(this).next().find('span.skills').html()).replace('<b>', ''))
        var skillarrow = ''
        if (skilleng == 's') players[0].sumskills = parseInt(String($(this).next().find('span').html()).replace('<b>', ''));
        else {
            if ($(this).next().find('img').attr('src') != undefined) {
                skillarrow = '.' + $(this).next().find('img').attr('src').split('/')[3].split('.')[0] 		// "system/img/g/a0n.gif"
            }
        }
        if (skilleng != '' && skilleng != 'ss0') players[0][skilleng] = (isNaN(skillvalue) ? '??' : skillvalue + skillarrow);
    })
    if (players[0].marking == undefined) players[0].marking = '??'
    if (players[0].corners == undefined) players[0].corners = '??'
    if (players[0].heading == undefined) players[0].heading = '??'
    if (players[0].handling == undefined) players[0].handling = '??'
    if (players[0].reflexes == undefined) players[0].reflexes = '??'

    //get player header info

    var name = $('table#hd1 td:first font').html();
	if (name.indexOf('.') != -1) { //remove number
		name = name.split('. ',2)[1]
	}
    if (name.indexOf(' ') != -1) {
        players[0].firstname = name.split(' ', 1)[0]
        players[0].secondname = name.replace(players[0].firstname + ' ', '')
    } else {
        players[0].firstname = ''
        players[0].secondname = name
    }
    players[0].nation = parseInt($('table#hd1 td:eq(1) img').attr('src').split('mod/')[1]);
    players[0].natfull = $('table#hd1 td:eq(2) font').html().split('<br>')[0];

    var mnat = $('table#hd1 td:eq(3) font').html().split('<br>');
    if (mnat[0] != '') {
        players[0].internationalapps = parseInt(mnat[0].split(' ')[1]);
        players[0].internationalgoals = parseInt(mnat[0].split(' ')[3]);
    } else {
        players[0].internationalapps = 0;
        players[0].internationalgoals = 0;
    }
    if (mnat[1] != undefined) {
        players[0].u21apps = parseInt(mnat[1].split(' ')[1])
        players[0].u21goals = parseInt(mnat[1].split(' ')[3])
    } else {
        players[0].u21apps = 0;
        players[0].u21goals = 0;
    }

    players[0].form = ($('table#hd1').next().find('tr:first td:first b').text() == '' ? 0 : parseInt($('table#hd1').next().find('tr:first td:first b').text()));
    players[0].morale = ($('table#hd1').next().find('tr:first th:first').text() === '' ? 0 : parseInt($('table#hd1').next().find('tr:first th:first').text()));

    players[0].team = ''
    players[0].t = url.t
    if (url.k !== undefined) players[0].k = url.k

    if (url.t === 'p2') {
        players[0].team = 'свободный'
    } else {
        let urlTeam = new Url($('table#hd1').next().find('tr:first a:first')[0]);
        if ($('table#hd1').next().find('tr:first font').length > 0) {
            players[0].team = $('table#hd1').next().find('tr:first font:first').text()
            players[0].teamid = urlTeam.j
            players[0].teamhash = urlTeam.z
            players[0].teamnat = parseInt($('table#hd1').next().find('tr:first img:first').attr('src').split('mod/')[1])
        }
    }

    // школяр!
    if (url.t === 'yp' || url.t === 'yp2') {
        players[0].flag = 5;
    }
    players[0].id = url.j;
    players[0].hash = url.z;
    if ($('a:[href^="plug.php?p=tr&t=ncyf&n=yf"]').length > 0) {
        //значит молодежь
        players[0].flag = 7;
    }

    players[0].contract = 0;
    players[0].wage = 0;
    players[0].value = 0;
    players[0].valuech = 0;

    players[0].newpos = '';

    $('table#hd2 table tr').each(function () {
        let xname = $(this).find('td:first').text().replace(/\d+/g, '');
        let xvalue = $(this).find('td:last b').html();
        switch (xname) {
            case 'Возраст:':
                players[0].age = parseInt(xvalue);
                break;
            case 'Позиция:':
                // Решение небольшой проблемы на пограничных позициях.
                // Например игрок может играть C MF и C AM, но в позиции у него указывается только C AM
                if (xvalue.trim() === 'GK') {
                    players[0].position = xvalue;
                    break;
                }

                let [side, pos] = xvalue.split(' ');
                // Фикс небольших проблем с определением позиции, у переучек.
                let posArr = pos.replace(/\(.*/g,'').split('/');
                let correctPositionsArray = [];

                posArr.forEach(item => {
                    switch (item) {
                        case 'DM':
                            correctPositionsArray.push('MF');
                            correctPositionsArray.push(item);
                            break;
                        case 'AM':
                            correctPositionsArray.push('MF');
                            correctPositionsArray.push(item);
                            break;
                        default:
                            correctPositionsArray.push(item);
                            break;
                    }
                });
                // Склеиваем обратно
                let correctPositionsJoined =  correctPositionsArray.join('/');

                const correctSidesAndPos = side + ' ' + correctPositionsJoined;

                players[0].position = correctSidesAndPos;
                break;
            case 'Номинал:':
                if (xvalue !== '') players[0].value = xvalue.replace(/,/g, '').replace('$', '');
                break;
            case 'Контракт:':
                if (xvalue !== '') {
                    players[0].contract = parseInt(xvalue);
                    players[0].wage = xvalue.split('г. ')[1].replace(/,/g, '').replace('$', '');
                }
                break;
            case 'Раб. нога:':
                players[0].foot = xvalue;
                break;
        }
    });
    if ($('table#stat').length > 0) {
        $('table#stat tr:gt(0)').each(function (i, val) {
            players[0]['ig' + i] = parseInt($(val).find('td:eq(1)').text())
            players[0]['gl' + i] = parseInt($(val).find('td:eq(2)').text())
            players[0]['ps' + i] = parseInt($(val).find('td:eq(3)').text())
            players[0]['im' + i] = parseInt($(val).find('td:eq(4)').text())
            players[0]['sr' + i] = parseFloat(($(val).find('td:eq(5)').text() === '' ? 0 : $(val).find('td:eq(5)').text()))
            if (i !== 1) {
                players[0]['zk' + i] = ($(val).find('td:eq(6)').text() === '' ? ' ' : parseInt($(val).find('td:eq(6)').text()))
                players[0]['kk' + i] = ($(val).find('td:eq(7)').text() === '' ? ' ' : parseInt($(val).find('td:eq(7)').text()))
            }
        })
    } else {
        for (i = 0; i <= 4; i++) {
            players[0]['ig' + i] = 0
            players[0]['gl' + i] = 0
            players[0]['ps' + i] = 0
            players[0]['im' + i] = 0
            players[0]['sr' + i] = 0
            players[0]['zk' + i] = 0
            players[0]['kk' + i] = 0
        }
    }

    players[0].sale = 0;
    if ($('table#hd2').parent().find('div:last').text() !== '') {
        var xinfo = $('table#hd2').parent().find('div:last i').html().split('<br>');
        for (i in xinfo) {
            if (xinfo[i].indexOf('Выставлен на трансфер') !== -1) {
                players[0].sale = 1 //parseInt(xinfo[i].split('<b>')[1])
            }
        }
    }

    var mm = ''
    // fill poss masive

    var text3 = ''
    text3 += '<br><b>Карта умений: </b><b><sup><a href="#" onClick="alert(\'Карта умений игрока была создана по мотивам Football Manager. Отображает в графическом виде умения игрока в различных категориях:\\n\\n  отбор: Отбор мяча\\n  мощь: Мощь\\n  энерг.: (Выносливость+Работоспособность)/2\\n  передачи: (Пас+Навес)/2\\n  владение: (Видение поля+Техника)/2\\n  дриблинг: Дриблинг\\n  удары: (Удар+Дальний удар)/2\\n  скор.: Скорость\\n  голов.:  Игра головой\\n  позиц.: Выбор позиции\')">?</a></sup></b><br>';
    text3 += '<canvas id="polygon" width="181" height="181"></canvas><br>';
    text3 += '<br><b>Номинал+</b>: <b><sup><a href="#" onClick="alert(\'Корректировка номинала получена с помощью оценки сделок предыдущего ТО по игрокам данной категории (позиция, возраст, номинал, некоторые профы)\')">?</a></sup></b><br>'
    text3 += '<div id="SValue"><a href="javascript:void(RelocateGetNomData())">Показать</a></div>'
    text3 += '<br><a id="remember" href="javascript:void(RememberPl(0))">' + ('Запомнить игрока').fontsize(1) + '</a><br>'
    text3 += '<div id="compare"></div><br><br>'
    text3 += '<b>Сила&nbsp;игрока</b><div id=str>'
    text3 += '<i><font size=1>сходите в Состав+</font></i>'
    text3 += '</div>'

    // Modify page and fill data
    $('td.back4 script').remove()
    $('body table.border:has(td.back4)').appendTo($('td#crabglobalcenter'));
    $('#crabrighttable').addClass('border')
    $("#crabright").html(text3)
    $("#mydiv").hide()
    $('center:eq(1) ~ br:first').before('<div id="th0"><a id="th0" href="javascript:void(ShowTable(0))">&ndash;</a></div>').remove()
    $('center:eq(2) ~ br').before('<div id="th1"><a id="th1" href="javascript:void(ShowTable(1))">&ndash;</a></div>').remove()

//	$('td.back4 table table:eq(1)').attr('id','stat')

    // добавим ссылку на заметки
    if (url.t !== 'yp') $("#crabright").append("<br><a href=\"javascript:hist('" + players[0].id + "','n')\">Заметки</a>")

    getPlayers();
    if (players.length > 1) PrintPlayers();
    GetValue();
    ShowAdaptation(players[0].natfull, players[0].teamnat);
    ShowPolygon();
    RelocateGetNomData();
    GetData('positions');
    printStrench();

}

function getPlayers() {
    // Get info from Global or Session Storage
    players.splice(1,25);
    let text1 = String(localStorage.peflplayer);
    if (text1 !== 'undefined' && text1 !== '') {
        let pl = text1.split(',');
        for (let i in pl) {
            let key = pl[i].split('=');
            let pn = (key[0].split('_')[1] === undefined ? 2 : key[0].split('_')[1]);
			if(players[pn] === undefined) players[pn] = [];
            if (key[0].split('_')[0] !== '' && !isNaN(pn)) {
                players[pn][key[0].split('_')[0]] = key[1];
            }
        }
    }
}

function DrowCompareAdvanced(data,season){
  var arrowsName = [];
  arrowsName['a6n.gif'] = 0; arrowsName['a6s.gif'] = 0; arrowsName['a6e.gif'] = 0;
  arrowsName['next.gif'] = 0; arrowsName['next.gif'] = 0;
  arrowsName['a0n.gif'] = 1; arrowsName['a0s.gif'] = 1; arrowsName['a0e.gif'] = 1;
  arrowsName['a1n.gif'] = 2; arrowsName['a1s.gif'] = 2; arrowsName['a1e.gif'] = 2;
  arrowsName['a0n.png'] = 3; arrowsName['a0s.png'] = 3; arrowsName['a0e.png'] = 3;
  arrowsName['a2n.gif'] = 4; arrowsName['a2s.gif'] = 4; arrowsName['a2e.gif'] = 4;
  arrowsName['a3n.gif'] = 5; arrowsName['a3s.gif'] = 5; arrowsName['a3e.gif'] = 5;
  arrowsName['a5n.gif'] = 6; arrowsName['a5s.gif'] = 6; arrowsName['a5e.gif'] = 6;
  arrowsName['last.gif'] = 6; arrowsName['last.gif'] = 6;
  var totalUp = 0, totalDown = 0;

  $('table#stat,span#err,#dcode1').hide();
  $('#dcode1').html('');
  $('table#res,table#skills').show();
  if(sknum==3){
    sknum=0;
    $('table[id^="res"], td[id^="res"]').remove();
  }
  if(sknum==0) $('table#stat').before('<table id=res class=back1 align=center width=70% cellpadding=2 cellspacing=1><tr><td nowrap id=thx align=center class=back2>[<a href="javascript:void(SkReset())"><font color=red>Х</font> сбросить</a>]</td></tr></table>');
  sknum++;
  $('td#thx').after('<td nowrap>'+(season!=0 ? '<b>'+season+' сезон</b>' : ' ')+'</td>');
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
          if(data['position']=='GK') {
            if ((i!='marking')&&(i!='corners')&&($('td#'+i).find('span.skills').length==0)) ssn = ssn+(isNaN(parseInt(x[0])) ? 0 : parseInt(x[0]));
          } else {
            if ((i!='reflexes')&&(i!='handling')&&($('td#'+i).find('span.skills').length==0)) ssn = ssn+(isNaN(parseInt(x[0])) ? 0 : parseInt(x[0]));
          }
          var ch = parseInt($('td#'+i).next().find('span.skills').text())-parseInt(x[0]);
          if(ch>0) ch = '<font color=green size=1>+'+ch+'</font>';
          else if(ch<0) ch ='<font color=red size=1>'+ch+'</font>'
          else ch='';
          if (i != 'leadership') {
            if ($('td#'+i).next().find('img').length > 0) {
              var currentSkillArrow = $('td#'+i).next().find('img').attr('src');
              currentSkillArrow = currentSkillArrow.replace(/system\/img\/g\//, '')
            } else {
              var currentSkillArrow = 'a0n.png';
            }

            var currentSkill = parseInt($('td#'+i).next().text());
            var newSkill = parseInt(x[0]);
            var newSkillPart;
            if (x[1]) {
              newSkillPart = arrowsName[x[1] + '.gif'];
            } else {
              newSkillPart = arrowsName['a0n.png'];
            }
            var currentSkillPart = arrowsName[currentSkillArrow] || 0;
            var skillArrowChange = (currentSkill*7+currentSkillPart) - (newSkill*7+newSkillPart);
            if (skillArrowChange < 0) {
              totalDown += skillArrowChange;
            } else {
              totalUp += skillArrowChange;
            }
            // стрелкоапы по каждому скиллу
            ch += '<font color=gray>('+(skillArrowChange>0?'+':'')+skillArrowChange+')<font>';
          }

          var m = $('td#'+i).next().clone()
            .attr('id','res')
            .find('span.arrow,span.form').remove().end()
            .each(function(){
              if($(this).find('span.skills').length>0) $(this).find('span.skills').html('<font color=gray>'+x[0]+'</font>'+(x[1]!=undefined ? ' <img height=10 src=system/img/g/'+x[1]+'.gif>' :'')+'<sup>'+ch+'</sup>')
              else $(this).html('<font color=gray>'+x[0]+'</font>'+(x[1]!=undefined ? ' <img height=10 src=system/img/g/'+x[1]+'.gif>' :'')+'<sup>'+ch+'</sup>')
            });
	  m.find('sup>font>font').remove();
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
      case 'age':
        if(season!=0 && cur!=undefined && cur['curseason']!=undefined && cur['age']!=undefined){
          $('td#'+i).after('<td nowrap><font color=gray>'+(parseInt(cur['age'])+season-parseInt(cur['curseason']))+'</font></td>');
        }else{
          $('td#'+i).after('<td nowrap><font color=gray>'+data[i]+'</font></td>');
        }
        break;
      default:
        $('td#'+i).after('<td nowrap><font color=gray>'+data[i]+'</font></td>');
    }
  }
  $('td[id^="ss"]').attr('colSpan',sknum+2);
  $('#s').after('<td class=back1 id=res>'+ssn+'</td>');

  if($('td#upNdown').length==0){
    $('table#res td#pname').parent().after('<tr class=back2><td nowrap id="upNdown">Стрелкоапы</td><td nowrap></td></tr>');
  }
  $('td#upNdown').after('<td nowrap><font color=gray>+'+totalUp+(totalDown==0?'-':'')+totalDown+'='+(totalUp+totalDown)+'</font></td>');
}

$().ready(function () {
  DrowCompare = DrowCompareAdvanced;
    Std.debug('url t=%s p=%s',url.t, Url.value('p'));
    if ($('table#hd1').length === 0) {
        isOldRoster = true;
        doOldRoster();
    } else {
        doNewRoster();
    }
}, false)
