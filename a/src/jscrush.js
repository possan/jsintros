/* b.innerHTML="
Javascript â¤ source<br>
<textarea rows=12 cols=80></textarea>
<br>
<button>CRUSH</button>
<b></b>
<br><textarea rows=12 cols=80></textarea>
"+b.innerHTML;
*/

// based on: https://gist.github.com/nikhilm/2393861

var fs = require('fs');
Q=[];
 
for(i=127;--i;i-10&&i-13&&i-34&&i-39&&i-92&&Q.push(String.fromCharCode(i)))
    ;
 
 /*
setTimeout(function() {
    b.children[1].value = b.children[9].innerHTML;
    L()
});
 */

var src = fs.readFileSync(process.argv[2], 'utf8');// 'console.log(\'hello\');';

// b.children[3].onclick = 
var L = function(s) {
    i = s = src.replace(/([\r\n]|^)\s*\/\/.*|[\r\n]+\s*/g,'').replace(/\\/g,'\\\\');
    B=s.length/2;
    m='';
    for(S=encodeURI(i).replace(/%../g,'i').length;;m=c+m) {
        for (c=0,i=122;!c&&--i;!~s.indexOf(Q[i])&&(c=Q[i]))
            ;
        if (!c)
            break;
        for (o={},M=N=e=Z=t=0; ++t<=B; )
            for (i=0;++i<s.length-t;)
                if (!o[x=s.substr(j=i,t)])
                    if (~(j=s.indexOf(x,j+t)))
                        for (Z=t,o[x]=1;~j;o[x]++)
                            j=s.indexOf(x,j+t);
        B=Z;
        for (i in o) {
            j=encodeURI(i).replace(/%../g,'i').length;
            if (j=(R=o[i])*j-R-j-1)
                if(j>M||j==M&&R>N)
                    M=j,N=R,e=i
        }
 
        if (!e)
            break;
        s=s.split(e).join(c)+c+e
    }
    c = s.split('"').length < s.split("'").length ? (B='"',/"/g) : (B="'",/'/g);
    i /* b.children[6].value*/ = '_=' + B + s.replace(c,'\\'+B) +B + ';for(Y=0;$=' + B + m + B + '[Y++];)with(_.split($))_=join(pop());eval(_)';

    console.log(i);
/* 
    i = encodeURI(i).replace(/%../g,'i').length;
    // b.children[4].innerHTML = 
    console.log(
     S + 'B to ' + i + 'B (' + (i=i-S) + 'B, ' + ((i/S*1e4|0)/100)+'%)'
     ) */
}

L();


