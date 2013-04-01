var expressions = [
	{
		// kickdrum
		gate: "!(s%4)",
		wave: "m.sin(s/99*C(s,1))*C(s,2)"
	},
	{
		// snare
		gate: "!(s%6)", //s%8==4",
		//	wave: "(N(s/7)+N(s/5))/2*C(s,12)",
		//	wave: '(((s>>2)&(s>>8))%9)/9*C(s,9)',
		wave: '((s>>9)&s>>8)%2*C(s,9)'
	},
	{
		// closed hihat
		gate: "1",
		wave: "N(s)*C(s,49)/3",
	},
	{
		// open hihat
		gate: "s%4==2",
		wave: "N(s)*C(s,9)/3"
	},
	{
		// bass
		gate: "1",
		// wave: "((s/600)%1-0.5)*C(s,20)/2"
		wave: "((s>>8)%4)*C(s,30)/4"
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



