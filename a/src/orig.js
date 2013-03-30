
// c.height=0;
// c.tagName ='div';
m = Math;
var ev = eval;
var	step = 0;
var	SAMPLELENGTH = 44100;
var	wl = window.location;

var	context = new webkitAudioContext();
var comp = context.createDynamicsCompressor();
// with(comp) {
// attack.value = 0.01;
// threshold.value = -9;
comp.connect(context.destination);
// }

var	CHANGE='change';
var	CLICK='click';
var	INPUT='input';
var	DIV='div';
var EMPTY='';
var BPM_AND_STEPS = 128;
function createElement(tagname, parent, innertext, _event, fn) {
	var el = document.createElement(tagname);
	parent.appendChild(el);
	innertext && (el.innerHTML = innertext);
	fn && el.addEventListener(_event, fn);
	return el;
}

var tracksel = createElement(DIV, b);

var noisetable = [];
var i = SAMPLELENGTH;
while (i--)
	 noisetable.push(m.random());

var config = wl.hash ? ev(wl.hash.substr(1)) : default_hash;

setInterval(function() {
	config.map(function(x) { x.f(); });
	step++;step%=BPM_AND_STEPS;
}, BPM_AND_STEPS);

config.map(function(o) {
	new Track(o);
});

for(var i=config.length; i<9; i++) {
	var o = {g: 0,  w:0 };
	new Track(o);
	config.push(o);
}

function Track(data) {
	data.t = this;
	var node = createElement(DIV, tracksel);
	var __buffer = context.createBuffer(1, SAMPLELENGTH, SAMPLELENGTH);
	var gs=[];

	function renderwave() {

		C = function(t, power) {
			if (t<0) return 1;
			t/=SAMPLELENGTH;
			if (t>1) return 0;
			return m.pow(1-t, power);
		}

		N = function(t) {
			return noisetable[~~t % SAMPLELENGTH];
		}

		var buf = __buffer.getChannelData(0);
		for(s=0; s<SAMPLELENGTH; s++) {
			buf[s] = ev(data.w);
			gs[s] = ev(data.g);
		}

		wl.hash = JSON.stringify(config);
	}

	var _b = createElement(INPUT, node, EMPTY, CHANGE, function() {
		data.g = _b.value;
		renderwave();
	});
	_b.size = 40;
	_b.value = data.g;

	var _c = createElement(INPUT, node, EMPTY, CHANGE, function() {
		data.w = _c.value;
		renderwave();
	});
	_c.size = 99;
	_c.value = data.w;

	renderwave();

	data.f = function() {
		if (gs[step]) {
			with(context.createBufferSource()) {
				buffer = __buffer;
				connect(comp);
				start(0);
			}
		}
	}
}

