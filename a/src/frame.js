//x

var fs = require('fs');
var Encoder = require('node-html-encoder').Encoder;

if (process.argv.length != 4) {
	console.log('syntax: node frame.js input.html output.html');
	return;
}

function escapeRegExp2(str) {
	str = str.replace(/[\n]/g, "\\n");
	str = str.replace(/[\r]/g, "\\r");
	str = str.replace(/[\t]/g, "\\t");
	str = str.replace(/[\']/g, "\\\'");
	str = str.replace(/[\"]/g, "\\\"");
	return str;
}

function escapeRegExp(str) {
 	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

console.log(process.argv);

var code = fs.readFileSync(process.argv[2], 'utf8');
var encoder = new Encoder('entity');
// code = escapeRegExp(code);
code = escapeRegExp2(code);
code = encoder.htmlEncode(code);
var encoded = code;

var output = '';

output += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">\n';
output += '<html><head><title>JS1k, 1k demo submission</title></head><frameset onload="document.getElementsByTagName(\'frame\')[1].contentWindow.focus();" rows="30px,*">\n';
output += '<frame marginwidth="0" marginheight="0" frameborder="0" noresize="no" src="javascript:\'&lt;p&gt;topframe\'" />\n';
output += '<frame marginwidth="0" marginheight="0" frameborder="0" noresize="no" src="javascript:\''+encoded+'\'" />\n';
output += '</frameset></html>\n';





fs.writeFileSync(process.argv[3], output, 'utf8');


