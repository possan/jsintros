var expressions = [
	{
		// kickdrum
		gate: "!(s%4)",
		// wave: "Math.sin(t*150.0*curve(t,1)/22050.0)*curve(t,6)+Math.sin(t*200.0/22050.0)*curve(t,26)"
		wave: "Math.sin(t*150.0*curve(t,1)/22050.0)*curve(t,16)+Math.sin(t*150.0/22050.0)*curve(t,15)"
	},
	{
		// snare
		gate: "!((s+4)%8)",
		wave: "0.7*noise(t,6)*curve(t,14)+0.6*noise(t,10)*curve(t,9)",
	},
	{
		// closed hihat
		gate: "s%4!=2",
		wave: "0.4*noise(t,2)*curve(t,36)",
	},
	{
		// open hihat
		gate: "(s+2)%4==0||s==20",
		wave: "0.3*noise(t,1)*curve(t,9)+0.33*noise(t,1)*curve(t,19)"
	},
	{
		// fx 1
		gate: "s%5!=2",
		wave: "0.5*((t/600)%1-0.5)*curve(t,30)"
	},
	{
		// fx 2
		gate: "s%3==2",
		wave: "((t>>6)&11+(t>>5)&9)/12*curve(t,5)"
	}
];

var all = [];
for(var i=0; i<expressions.length; i++) {
	all.push(expressions[i].gate);
	all.push(expressions[i].wave);
}

var str = all.join('$');
str = str.replace(new RegExp('[ ]+'), '');
// str = '#'+str;
console.log('var default_hash='+JSON.stringify(str)+';\n');



