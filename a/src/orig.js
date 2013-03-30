/*
-- shim support --
var b = document.body;
var c = document.getElementsByTagName('canvas')[0];
var a = c.getContext('2d');
*/
// var a,b,c;

//
// config
//

// we don't need no stinking canvas
// b.removeChild(c);
c.height=0;
// c.style.display='none';

var default_hash=[{w:"Math.sin(s*0.014*C(s,3))*C(s,4)",g:"!(s%4)"},{w:"0.7*N(s,6)*C(s,14)+0.6*N(s,10)*C(s,9)",g:"!((s+4)%8)"},{w:"0.4*N(s,2)*C(s,36)",g:"s%4!=2"},{w:"0.3*N(s,1)*C(s,9)+0.33*N(s,1)*C(s,19)",g:"(s+2)%4==0||s==20"},{w:"0.5*((s/600)%1-0.5)*C(s,30)",g:"s%5!=2"},{w:"((s>>6)&11+(s>>5)&9)/12*C(s,5)",g:"s%3==2"}];


var	d = document;
var	w = window;
var m = Math;
var	i;
var	step = 0;
var	DEBUG = false;
var	SAMPLELENGTH = 44100; // ~0.5s
var	NOISELENGTH = 9000;
var	wl = w.location;
var	wlh = wl.hash;

var	context = new webkitAudioContext();
var comp = context.createDynamicsCompressor();
with(comp) {
	// comp.ratio.value = 35.0;
	// comp.release.value = 0.5;
	attack.value = 0.05;
	threshold.value = -10;
	connect(context.destination);
}

var	CHANGE='change';
var	CLICK='click';
var	INPUT='input';
var	DIV='div';
var	BUTTON='button';
var INNERHTML='innerHTML';

function createElement(tagname, parent, innertext, _event, fn) {
	var el = d.createElement(tagname);
	parent.appendChild(el);
	innertext && (el.innerText = innertext);
	fn && el.addEventListener(_event, fn.bind(el));
	return el;
}

function createfunc(expr) {
	try {
		var fn = new Function(['C','N','s'], 'return '+expr);

		var noisetable = [];
		var i = NOISELENGTH;
		while (i--)
			 noisetable.push(m.random());

		function curve(t, power) {
			t/=SAMPLELENGTH;
			if (t<0) t=0;
			if (t>1) t=1;
			return m.pow(1-t, power);
		}

		function noise(t, res) {
			return noisetable[~~(t / res) % NOISELENGTH];
		}

		return fn.bind(w, curve, noise);
	} catch(e) {
	 // 	console.error(W, e);
	}
}

function Track(data) {
	data.t = this;
	// console.log('track data', data);
	var n = createElement(DIV, tracksel, '');
	var __buffer = context.createBuffer(1, SAMPLELENGTH, 48000);

	function renderwave() {
		var buf = __buffer.getChannelData(0);
		var fn = createfunc(data.w);
		for(var t=0; t<SAMPLELENGTH; t++)
			buf[t] = fn(t);
	}

	var b = createElement(INPUT, n, '', CHANGE, function() {
		data.g = this.value;
		savehash();
	});
	b.size = 40;
	b.value = data.g;

	var c = createElement(INPUT, n, '', CHANGE, function() {
		data.w = this.value;
		renderwave();
		savehash();
	});
	c.size = 99;
	c.value = data.w;
	/*
	createElement(BUTTON, n, 'X', CLICK, function() {
		var row = config.indexOf(data);
		config.splice(row, 1);
		n.parentNode.removeChild(n);
		savehash();
	});
	*/
	renderwave();

	data.f = function() {
		if (createfunc(data.g)(step)) {
			with(context.createBufferSource()){
				buffer = __buffer;
				connect(comp);
				start(0);
			}
		}
	}
}

createElement('h1', b, 'SEQ1K');

var tracksel = createElement(DIV, b);

/*
createElement(BUTTON, b, 'Add', CLICK, function() {
	var o = { g: '0',  w: '0' }
	new Track(o);
	config.push(o);
	savehash();
});
*/
var config = ((wlh == '') ? default_hash : eval(wlh.substr(1)));//.split('$');
config.map(function(o) {
	new Track(o);
});
for(var i=config.length; i<10; i++) {
	var o = { g: '0',  w: '0' }
	new Track(o);
	config.push(o);
}

var savehash = function() {
	var ha = config.map(function(x) {
		return {g:x.g, w:x.w};
	});
	wl.hash = JSON.stringify(ha);
};

setInterval(function() {
	config.map(function(x) { x.f(); });
	step=(step+1)%256;
}, 130);