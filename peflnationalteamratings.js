// ==UserScript==
// @name           peflnationalteamratings
// @namespace      pefl
// @description    national teams ratings page modification
// @include        http://*pefl.*/plug.php?p=rating&t=sb2&j=*
// @version	       1.0
// ==/UserScript==

var flagMap = [];
flagMap[1] = 'ee';
	
}

var TableToForum = {
	
	buttonSelector: '',
	codeWrapperSelector: '',
	tableSelector: '',
	
	init: function(params) {
		this.buttonSelector = params.buttonSelector;
		this.codeWrapperSelector = params.codeWrapperSelector;
		this.tableSelector = params.tableSelector;
		
		$(this.buttonSelector).click(TableToForum.generateCode);
	},
	
	generateCode: function() {
		var html = '<textarea cols="50" rows="30">';
		html += '[table]';
		html += TableToForum.htmlToForum( $(TableToForum.tableSelector).html() );
		html += '[/table]';
		
		html += '\r\n\r\n[center]--------------- [url=forums.php?m=posts&q=173605]Крабовый VIP[/url] ---------------[/center]';
		
		html += '</textarea>';
		
		$(TableToForum.codeWrapperSelector).html(html);
	},
	
	htmlToForum: function(html) {
		var txt = '';
		txt = html.replace(/\</g, '[');
		txt = txt.replace(/\>/g, ']');
		
		// remove [tbody] & [/tbody]
		txt = txt.replace(/\[\/?tbody\]/ig, '');
		
		// change width="\"15%\"" to width=15%, and height="\"15%\"" to height=15%
		txt = txt.replace(/ (width|height)\=[^\]\d]*(\d+)\%[^\]]*\]/ig, function(match, attrName, percentage) {
			return ' ' + attrName + '=' + percentage + '%]';
		});
		
		// change [a href="url"]anchor[/a] to [url=url]anchor[/url]
		txt = txt.replace(/\[a href\=\"([^\]]*)\"\]([^\[]*)\[\/a\]/ig, function(match, link, anchorText) {
			return '[url='+ link + ']' + anchorText + '[/url]';
		});
		
		// change [img src="url"] to [img]url[/img]
		txt = txt.replace(/\[img\ src\=\"([^\]]*)\"]/ig, function(match, link) {
			return '[img]' + link + '[/img]';
		});
		
		// change bgcolor="#777777" to bgcolor=#777777
		txt = txt.replace(/bgcolor\=\"([^\"]+)\"/ig, function(match, bgcolor) {
			if (bgcolor == "#a3de8f") {
				bgcolor = "#C9F8B7";
			}
			return 'bgcolor='+bgcolor;
		});
		
		// change [th] to [td][b] & [/th] to [/b][/td]
		txt = txt.replace(/\[th([^\]]*)\]/ig, function(match, inner) {
			return '[td'+ inner + '][b]';
		});
		txt = txt.replace(/\[\/th\]/ig, function(match) {
			return '[/b][/td]';
		});
		
		// change ="left" to =left
		txt = txt.replace(/ align\=\"(left|center|right)\"/ig, function(match, alignment) {
			return ' align=' + alignment;
		});
		
		// change [br] to '<br />';
		txt = txt.replace(/\[br\]/ig, '\r\n');
		
		txt = txt.replace(/\" width\=\"30/ig, '');
		
		txt = txt.replace(/\" height\=\"12/ig, '');
		
		// fix flags
		// temporary fix: remove flags
		txt = txt.replace(/\[img\]system\/img\/flags\/\d+\.gif\[\/img\]/ig, '');
		
		return txt;
	}
	
}

$().ready(function() {
	$('td.back4').append('<input type="button" class="code-to-forum" value="Код для форума" /><div class="code2forum"></div>');
	TableToForum.init({buttonSelector: '.code-to-forum', codeWrapperSelector: '.code2forum', tableSelector: 'td.back4 table table'});
/**/
}, false);