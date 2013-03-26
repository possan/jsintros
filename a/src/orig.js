/*
-- shim support --
var b = document.body;
var c = document.getElementsByTagName('canvas')[0];
var a = c.getContext('2d');
*/

//
// config
//

var DEBUG = false;

var COLUMNS = 32;
var SAMPLELENGTH = 50000; // ~0.5s

var ROWS = 6;
var names = [
	"Kickdrum",
	"Snare",
	"HH",
	"OH",
	"Effect1",
	"Effect2"];

var muted = [0,0,0,0,0,0];

var expressions = [

	// kickdrum
	"Math.sin(t*150.0/22050.0)*curve(t,6) + Math.sin(t*200.0/22050.0)*curve(t,26)",

	// snare
	// "0.7*noise(t,5)*curve(t,14) + 0.6*noise(t,70)*curve(t,9)",
	"0.7*noise(t,6)*curve(t,14) + 0.6*noise(t,10)*curve(t,9)",

	// closed hihat
	"0.4*noise(t,2)*curve(t,36)",

	// open hihat
	"0.3*noise(t,1)*curve(t,9) + 0.33*noise(t,1)*curve(t,19)",

	// fx1
	"0.5*Math.sin(t/13)*Math.pow(1-t/40000,5)",

	// fx2
	"1*noise(t,1)*curve(t,7)"
];

var gateexpressions = [
	// kickdrum
	"s%4==0||s==29",
	// snare
	"(s+4)%8==0||s==31",
	// closed hihat
	"s%4!=2",
	// open hihat
	"(s+2)%4==0||s==20",
	// fx 1
	"(s+7)%16==0||s==29",
	// fx 2
	"s==16"
];

//
// init
//

// grid
var grid = [];
for(var i=0; i<ROWS*COLUMNS; i++) grid.push(0);

// dom
// var d = document;

// audio
var context = new webkitAudioContext();

// effect chain
var comp = context.createDynamicsCompressor();
comp.connect(context.destination);

// sounds
var soundbuffers = [];

var noisetable = [];
for (var i=0; i<100000; i++)
	noisetable.push(Math.random());

function curve(t, power) {
	t = Math.max(t, 0);
	t = Math.min(t / SAMPLELENGTH, 1);
	return Math.pow(1-t, power);
}

function noise(t, res) {
	return noisetable[(Math.floor(t/res)%100000)];
}


function rendersound(r) {
	try {
		var fn = new Function(["t","noise","curve"], "return "+expressions[r]);
		var buffer = context.createBuffer(1, SAMPLELENGTH, 44100);
		var buf = buffer.getChannelData(0);
		for (i = 0; i < SAMPLELENGTH; i++)
			buf[i] = fn(i,noise,curve);
		soundbuffers[r] = buffer;
	} catch(e) {
		console.error(e);
	}
}

for (var r=0; r<ROWS; r++) rendersound(r);

// sounds

var styles = document.createElement('style');
document.body.appendChild(styles);
var styles2 = document.createElement('style');
document.body.appendChild(styles2);

// functions

// grid default pattern

function updategates() {
	var st = '';
	for (var r=0; r<ROWS; r++) {
		var fn = new Function(["s"], "return "+gateexpressions[r]);
		for(var i=0; i<COLUMNS; i++) {
			var g = fn(i);
			grid[r*COLUMNS+i] = g;
			if (g)
				st += '.r'+r+'c'+i+' { color: #f00; } ';
		}
	}
	styles2.innerHTML = st;
}

updategates();


// we don't need a canvas
document.body.removeChild(c); // smaller than c.style.display = 'none';

var x = document.createElement('div');

x.innerHTML = 'xyz';

b.appendChild(x);


var _step = -1;


function step() {

	// debug
	if (DEBUG) console.log('step #' + _step);

	// fire sounds!
	for(var r=0; r<ROWS; r++) {
		if (grid[r*COLUMNS+_step] && !muted[r]) {
			if (DEBUG) console.log('play sample #' + r);
			var source = context.createBufferSource();
			source.buffer = soundbuffers[r];
			source.connect(comp);
			source.start(0);
		}
	}

	// update ui
	var st = '';
	for(var c=0; c<COLUMNS; c++) {
		// colcb[c].checked = (c == _step);
		if (c == _step)
			st += '.c'+c+' { background-color: #ff0; } ';
	}
	styles.innerHTML = st;

	// step forward
	_step ++;
	_step %= COLUMNS;
}

var colcb = [];

function createstep(r, c) {
	var o =r*COLUMNS+c;
	var cb = document.createElement('span');
	cb.className = 'c'+c+' r'+r+'c'+c;
	cb.innerHTML = '[x] ';
	/*
	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.checked = grid[o];
	cb.addEventListener('click', function() {
		grid[o] = cb.checked;
	});
	*/
	return cb;
}

function renderrow(r) {
	var rowel = document.createElement('div');

	var enabled = document.createElement('input');
	enabled.setAttribute('type', 'checkbox');
	enabled.checked = true;
	enabled.addEventListener('change', function() {
		muted[r] = !enabled.checked;
		rendersound(r);
	});
	rowel.appendChild(enabled);

	var code2 = document.createElement('input');
	code2.size = 50;
	code2.value = gateexpressions[r];
	code2.addEventListener('change', function() {
		gateexpressions[r] = code2.value;
		updategates();
	});
	rowel.appendChild(code2);

	var code = document.createElement('input');
	code.size = 100;
	code.value = expressions[r];
	code.addEventListener('change', function() {
		expressions[r] = code.value;
		rendersound(r);
	});
	rowel.appendChild(code);

	// rowel.appendChild(document.createElement('br'));

	for(var c=0; c<COLUMNS; c++) {
		rowel.appendChild(
			createstep(r, c)
		);
	}

	return rowel;
}

function render() {
	var pageel = document.createElement('div');
	/*
	var rowel = document.createElement('div');
	for(var c=0; c<COLUMNS; c++) {
		var cb = document.createElement('input');
		cb.setAttribute('type', 'radio');
		colcb.push(cb);
		rowel.appendChild(cb);
	}
	pageel.appendChild(rowel);
	*/
	for(var r=0; r<ROWS; r++) pageel.appendChild(renderrow(r));

	// b.innerHTML = '';
	b.appendChild(pageel);
}

render();

// setInterval(render, 1000);
setInterval(step, 125);