// ==UserScript==
// @name           pefltv
// @namespace      pefl
// @description    tv without flash
// @include        http://*pefl.*/tvgame.php?*
// @version        0.2
// @author         Stason
// ==/UserScript==


var source = 'http://pefladdons.googlecode.com/svn/trunk/';
var tv_counter = 0;
var comments = [];
var speed_selected = 1;
if(localStorage.tv_speed != undefined && localStorage.tv_speed)
	speed_selected = localStorage.tv_speed;
var speed = [];
speed[1] = 4000;
speed[2] = 2000;
speed[4] = 1000;
var play = false;
var p_interval = null;

function showcomment() {
	if(play) {
		if(typeof comments[tv_counter] == 'undefined') {
			clearTimeout(p_interval);
			play = false;
		}
		var comment = comments[tv_counter].split('=');
		$('#tv_box .div_minute').html(comment[0]+' минута');
		$('#tv_box .div_comment').html(comment[1]);
		tv_counter++;
		p_interval = setTimeout('showcomment()', speed[speed_selected]);
	}
}

function randomNumber (m,n) {
  m = parseInt(m);
  n = parseInt(n);
  return Math.floor( Math.random() * (n - m + 1) ) + m;
}

function getNoflashTV() {
	
	var rand_n = randomNumber(10000, 99999);
	var geturl = 'gamenew.php?'+rand_n;
	
	$.get(geturl, {}, function(data){

		var dataarray = data.split('&');
		var i = 0;
		for (var key in dataarray) {
			var regexp = /g(\d+)_\d+\=(.*)/g;
			var matches = regexp.exec(dataarray[key]);
			if(matches) {
				comments[i] = matches[1]+'='+matches[2];
				i++;
			}
		}
	
		$('body').removeAttr("marginwidth");
		$('body').removeAttr("marginwidth");
		$('body').removeAttr("marginheight");
		$('body').removeAttr("bgcolor");
		$('body').removeAttr("bottommargin");
		$('body').removeAttr("rightmargin");
		$('body').removeAttr("topmargin");
		$('body').removeAttr("leftmargin");
		$('body').css({'background-color' : '#C9F8B7'});
		
		$('body').html('<div id="tv_box"><div class="div_play"><a href="#" id="play_button" title="Play"> </a></div><div class="div_speed"><a href="#" id="speed_button" title="1x"> </a></div><div class="div_minute"></div><div class="div_comment"></div></div>');
		$('.div_play').css({ 'width' : '50%', 'float' : 'left' });
		$('.div_play a').css({ 'width' : '30px', 'height' : '30px', 'background-image' : "url("+source+"tv/Play.jpg)", "display" : "block"});
		$('.div_speed ').css({ 'width' : '50%', 'float' : 'right'});
		$('.div_speed a').css({ 'width' : '30px', 'height' : '30px', 'background-image' : "url("+source+"tv/Speed.jpg)", "display" : "block", 'float' : 'right' });
		if(speed_selected == 2) {
			$('.div_speed a').css({'background-position' : "0 -30px"});
		}
		if(speed_selected == 4) {
			$('.div_speed a').css({'background-position' : "0 -60px"});
		}
		$('.div_minute').css({ 'text-align' : 'center', 'font-weight' : 'bold', 'clear' : 'both' });
		$('.div_comment').css({ 'text-align' : 'center' });
		$('#tv_box .div_play a').click(function(){
			if($(this).attr("title") == 'Play') {
				p_interval = setTimeout('showcomment()', speed[speed_selected]);
				play = true;
				$(this).attr("title", 'Pause');
				$(this).css({'background-position' : "0 -30px"});
			} else {
				clearTimeout(p_interval);
				play = false;
				$(this).attr("title", 'Play');
				$(this).css({'background-position' : "0 0"});
			}
			return false;
		});
		$('#tv_box .div_speed a').click(function(){
			speed_selected = 1;
			var val = $(this).attr("title");
			if(val == '1x') {
				speed_selected = 2;
				if(play) {
					clearTimeout(p_interval);
					p_interval = setTimeout('showcomment()', speed[speed_selected]);
				}
				$(this).attr("title", '2x');
				$(this).css({'background-position' : "0 -30px"});
			}
			if(val == '2x') {
				speed_selected = 4;
				if(play) {
					clearTimeout(p_interval);
					p_interval = setTimeout('showcomment()', speed[speed_selected]);
				}
				$(this).attr("title", '4x');
				$(this).css({'background-position' : "0 -60px"});
			}
			if(val == '4x') {
				speed_selected = 1;
				if(play) {
					clearTimeout(p_interval);
					p_interval = setTimeout('showcomment()', speed[speed_selected]);
				}
				$(this).attr("title", '1x');
				$(this).css({'background-position' : "0 0"});
			}
			localStorage.tv_speed = speed_selected;
			return false;
		});
	});
	return false;
}

$('body').prepend('<p><a href="#" onclick="return getNoflashTV();">Смотреть матч без flash</a></p>');