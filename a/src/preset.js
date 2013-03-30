var expressions = [
	{
		// kickdrum
		gate: "!(s%4)",
		// wave: "Math.sin(t*150.0*C(t,1)/22050.0)*C(t,6)+Math.sin(t*200.0/22050.0)*C(t,26)"
		wave: "Math.sin(s*0.014*C(s,3))*C(s,4)"
		// }	wave: "Math.sin(s*150.0*C(s,1)/22050.0)*C(s,16)+Math.sin(s*150.0/22050.0)*C(s,15)"
	},
	{
		// snare
		gate: "!((s+4)%8)",
		wave: "0.7*N(s,6)*C(s,14)+0.6*N(s,10)*C(s,9)",
	},
	{
		// closed hihat
		gate: "s%4!=2",
		wave: "0.4*N(s,2)*C(s,36)",
	},
	{
		// open hihat
		gate: "(s+2)%4==0||s==20",
		wave: "0.3*N(s,1)*C(s,9)+0.33*N(s,1)*C(s,19)"
	},
	{
		// fx 1
		gate: "s%5!=2",
		wave: "0.5*((s/600)%1-0.5)*C(s,30)"
	},
	{
		// fx 2
		gate: "s%3==2",
		wave: "((s>>6)&11+(s>>5)&9)/12*C(s,5)"
	}
];

var all = [];
for(var i=0; i<expressions.length; i++) {
	all.push(expressions[i].gate);
	all.push(expressions[i].wave);
}

var str = all.join('$');
str = str.replace(new RegExp('[ ]+'), '');

var json =JSON.stringify(expressions.map(function(x) {
	return {w:x.wave,g:x.gate};
}));
json = json.replace(new RegExp('\"w\"', 'g'), 'w');
json = json.replace(new RegExp('\"g\"', 'g'), 'g');
console.log('var default_hash='+json+';\n');

// str = '#'+str;
// console.log('var default_hash='+JSON.stringify(str)+';\n');
// console.log('//  default_hash=\"'+window.atob(str)+'\";\n');



