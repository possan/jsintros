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
b.removeChild(c);

var default_hash="!(s%4)$Math.sin(t*150.0*curve(t,1)/22050.0)*curve(t,16)+Math.sin(t*150.0/22050.0)*curve(t,15)$(s+4)%8==0||s==31$0.7*noise(t,6)*curve(t,14)+0.6*noise(t,10)*curve(t,9)$s%4!=2$0.4*noise(t,2)*curve(t,36)$(s+2)%4==0||s==20$0.3*noise(t,1)*curve(t,9)+0.33*noise(t,1)*curve(t,19)$s%5!=2$0.5*((t/600)%1-0.5)*curve(t,30)$s%3==2$0.5*((t/150)%1-0.5)*curve(t,20)";

var	d = document;
var	w = window;
var	i;
var	step = 0;
var	DEBUG = false;
var	COLUMNS = 32;
var	SAMPLELENGTH = 48000; // ~0.5s
var	NOISELENGTH = SAMPLELENGTH;
var	ROWS = 6;
var	config = [];
var	wl = w.location;
var	wlh = wl.hash;
var	context = new webkitAudioContext();
var	comp = context.createDynamicsCompressor();
var	noisetable=[];
var	tracksel;
var	add;
var	title;
var	tracks;
var CHANGE='change';
var	CLICK='click';
var	INPUT='input';
var	DIV='div';
var	BUTTON='button';

function loadhash(ee) {
	// console.log('loadhash event', ee);
	var s = wlh.replace('#', '')
	if (s == '') s = w.btoa(default_hash);
	//	if (wlh == '') wlh = '#' + default_hash;
	// console.log('s', s);
	config = w.atob(s).split('$');
	// console.log('new config', config);
	createalltracks();
}

function createElement(tagname, parent, event, fn) {
	var el = d.createElement(tagname);
	if (parent) parent.appendChild(el);
	if (event) el.addEventListener(event, fn);
	return el;
}

function appendChild(parent, child) {
	parent.appendChild(child);
}

function curve(t, power) {
	if (t<0) t=0;
	t/=SAMPLELENGTH;
	if (t>1) t=1;
	// t=Math.max(t,0);
	// t = Math.min(t / SAMPLELENGTH, 1);
	return Math.pow(1-t, power);
}

function noise(t, res) {
	return noisetable[(Math.floor(t/res) % NOISELENGTH)];
}

function updatehash() {
	var ha = [], ha2;
	tracks.forEach(function(t) {
		t.store(ha);
	});
	ha2 = ha.join('$');
	history.pushState(null, null, '#'+w.btoa(ha2));
}

function createfunc(key, expr) {
	var fn = new Function(['curve','noise',key], 'return '+expr);
	return fn;
	return fn.bind(w, curve, noise);
}

function Track(parent, index, gateexpr, waveexpr) {
	var self = this,
		muted = false;

	var G = gateexpr;
	var W = waveexpr;

	var n = createElement(DIV, parent);
	n.innerHTML = '#' + (1+index);

	this.buffer = context.createBuffer(1, SAMPLELENGTH, 48000);

	function renderwave() {
		var buf = self.buffer.getChannelData(0);
		try {
			var fn = createfunc('t', W);
			var t = 0;
			while (t < SAMPLELENGTH) {
				// buf[t] = eval(self.W);
		 		buf[t] = fn(curve, noise, t);// eval(self.G);
				t ++;
			}
		} catch(e) {
		 	console.error(W, e);
		}
		console.log(buf);
	}

	function evalgate() {
		var r;
		try {
			var fn = createfunc('s', G);
		 	r = fn(curve, noise, step);// eval(self.G);
		} catch(e) {
			console.error(G, e);
		}
		return r;
	}

	var a = createElement(INPUT, n, CHANGE, function() {
		muted = !a.checked;
	});
	a.setAttribute('type', 'checkbox');
	a.checked = true;

	var b = createElement(INPUT, n, CHANGE, function() {
		G = b.value;
		// updategates();
		updatehash();
	});
	b.size = 50;
	b.value = G;

	var c = createElement(INPUT, n, CHANGE, function() {
		W = c.value;
		renderwave();
		updatehash();
	});
	c.size = 130;
	c.value = W;
	// c.value = waveexpr;

	var d = createElement(BUTTON, n, CLICK, function() {
		config.splice(index*2, 2);
		createalltracks();
		updatehash();
	});
	d.innerText = 'Delete';

	renderwave();

	// this.n = n;

	this.store = function(target) {
		target.push(G, W);
	}

	this.fire = function() {
		// console.log('eval track step', index, step, G);
		if (muted) return;
		if (!evalgate()) return;
		// fire!
		// console.log('play sound!', self.buffer);
		var source = context.createBufferSource();
		source.buffer = self.buffer;
		source.connect(comp);
		source.start(0);
	}
}

function createalltracks() {
	// create tracks from config
	tracks = [];
	tracksel.innerHTML = '';
	var o = 0;
	for(var j=0; j<config.length/2; j++) {
		tracks[j] = new Track(tracksel, j, config[o++], config[o++]);
	}
}

function _tick() {
	// console.log('tick.');
	tracks.forEach(function(t) { t.fire(); });
	step += 1;
	step %= 16;
	setTimeout(_tick, 140);
}















/*
comp.ratio.value = 35.0;
comp.attack.value = 0.05;
comp.release.value = 0.5;
comp.threshold.value = -10;
*/
comp.connect(context.destination);

i = NOISELENGTH;
while (i--)
	 noisetable.push(Math.random());




//
// Prepare the DOM
//

title = createElement('h1', b);
title.innerHTML = 'SEQ1K';

tracksel = createElement(DIV, b);

add = createElement(BUTTON, b, CLICK, function() {
	config.push('!(s%4)', '0');
	createalltracks();
	updatehash();
});
add.innerText = 'Add track';

// styles = createElement('style', b);
// styles2 = createElement('style', b);

window.onhashchange = loadhash;

loadhash();

_tick();

