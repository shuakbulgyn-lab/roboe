/* AccentWithUs robot mascot: real-time 3D (raw WebGL, no libraries). Add: <script src="accent-robot.js"></script> */
(function(){
if(window.__accentRobot)return;window.__accentRobot=1;
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,DPR=Math.min(window.devicePixelRatio||1,2),CW=190,CH=240;
var box=document.createElement('div');
box.style.cssText='position:fixed;right:14px;bottom:10px;width:'+CW+'px;height:'+(CH+80)+'px;z-index:9999;pointer-events:none;font:600 14px/1.35 system-ui,-apple-system,Segoe UI,sans-serif';
box.innerHTML='<div id="ar-b" style="position:absolute;left:-110px;right:0;top:0;background:#fff;color:#0b2e6b;border:2px solid #19b5e8;border-radius:16px;padding:9px 12px;box-shadow:0 6px 20px rgba(0,40,90,.22);opacity:0;transform:translateY(6px);transition:.3s"></div>'+
'<div id="ar-s" style="position:absolute;left:38px;bottom:2px;width:114px;height:16px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,40,80,.38),transparent)"></div>'+
'<canvas id="ar-c" aria-label="Robot mascot" style="position:absolute;left:0;bottom:0;width:'+CW+'px;height:'+CH+'px;pointer-events:auto;cursor:pointer"></canvas>'+
'<button id="ar-x" aria-label="Hide robot" style="position:absolute;right:2px;top:92px;width:24px;height:24px;border:0;border-radius:50%;background:rgba(11,46,107,.75);color:#fff;font:16px/24px sans-serif;cursor:pointer;pointer-events:auto;padding:0">\u00d7</button>';
document.body.appendChild(box);
var cv=box.querySelector('#ar-c'),bub=box.querySelector('#ar-b'),shd=box.querySelector('#ar-s');
box.querySelector('#ar-x').onclick=function(){box.remove();dead=1;if(window.AccentCoach)window.AccentCoach.destroy()};
cv.width=CW*DPR;cv.height=CH*DPR;var dead=0;
var gl=cv.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true});
if(!gl){box.remove();return}
function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
function prog(v,f){var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);return p}
var P1=prog('attribute vec3 aP,aN;uniform mat4 uVP,uM;uniform vec3 uS;varying vec3 vN,vW;void main(){vec4 w=uM*vec4(aP*uS,1.);vW=w.xyz;vN=mat3(uM)*(aN/uS);gl_Position=uVP*w;}',
'precision mediump float;varying vec3 vN,vW;uniform vec3 uC,uE,uCam;uniform float uSh,uSp;void main(){vec3 N=normalize(vN),V=normalize(uCam-vW),L1=normalize(vec3(-.5,.8,.7)),L2=normalize(vec3(.8,.1,.5));'+
'vec3 amb=mix(vec3(.62,.66,.72),vec3(1.,1.,1.),N.y*.5+.5);vec3 c=uC*(amb*.58+max(dot(N,L1),0.)*.52+max(dot(N,L2),0.)*.16);'+
'float sp=pow(max(dot(N,normalize(L1+V)),0.),uSh)*uSp;float rim=pow(1.-max(dot(N,V),0.),3.);c+=vec3(sp)+vec3(.25,.8,1.)*rim*.3+uE;gl_FragColor=vec4(c,1.);}');
var P2=prog('attribute vec3 aP;attribute vec2 aT;uniform mat4 uVP,uM;uniform vec3 uS;varying vec2 vT;void main(){vT=aT;gl_Position=uVP*uM*vec4(aP*uS,1.);}',
'precision mediump float;varying vec2 vT;uniform sampler2D uTex;void main(){gl_FragColor=texture2D(uTex,vT);}');
function mul(a,b){var o=new Float32Array(16);for(var i=0;i<4;i++)for(var j=0;j<4;j++){var s=0;for(var k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s}return o}
function X(){var m=arguments[0];for(var i=1;i<arguments.length;i++)m=mul(m,arguments[i]);return m}
function T(x,y,z){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1])}
function Rx(a){var c=Math.cos(a),s=Math.sin(a);return new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1])}
function Ry(a){var c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1])}
function Rz(a){var c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1])}
function persp(f,a,n,r){var t=1/Math.tan(f/2);return new Float32Array([t/a,0,0,0,0,t,0,0,0,0,(r+n)/(n-r),-1,0,0,2*r*n/(n-r),0])}
function buf(t,d){var b=gl.createBuffer();gl.bindBuffer(t,b);gl.bufferData(t,d,gl.STATIC_DRAW);return b}
function mesh(pos,nor,idx){return{p:buf(gl.ARRAY_BUFFER,new Float32Array(pos)),n:buf(gl.ARRAY_BUFFER,new Float32Array(nor)),i:buf(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx)),c:idx.length}}
function sphere(sg,rg){var p=[],ix=[];for(var y=0;y<=rg;y++)for(var x=0;x<=sg;x++){var u=x/sg*6.2832,v=y/rg*3.14159;p.push(Math.cos(u)*Math.sin(v),Math.cos(v),Math.sin(u)*Math.sin(v))}
 for(y=0;y<rg;y++)for(x=0;x<sg;x++){var a=y*(sg+1)+x,b=a+sg+1;ix.push(a,b,a+1,b,b+1,a+1)}return mesh(p,p,ix)}
function cone(sg){var p=[],n=[],ix=[];for(var i=0;i<=sg;i++){var u=i/sg*6.2832,c=Math.cos(u),s=Math.sin(u),l=Math.SQRT2;p.push(c,0,s,0,1,0);n.push(c/l,1/l,s/l,c/l,1/l,s/l)}
 for(i=0;i<sg;i++)ix.push(i*2,i*2+1,i*2+2,i*2+1,i*2+3,i*2+2);return mesh(p,n,ix)}
var SP=sphere(40,28),CN=cone(32);
var quad=buf(gl.ARRAY_BUFFER,new Float32Array([-.85,-.425,0,0,0,.85,-.425,0,1,0,-.85,.425,0,0,1,.85,.425,0,1,1]));
var U={};['uVP','uM','uS','uC','uE','uCam','uSh','uSp'].forEach(function(n){U[n]=gl.getUniformLocation(P1,n)});
var U2={vp:gl.getUniformLocation(P2,'uVP'),m:gl.getUniformLocation(P2,'uM'),t:gl.getUniformLocation(P2,'uTex'),s:gl.getUniformLocation(P2,'uS')};
var ac=document.createElement('canvas');ac.width=128;ac.height=170;(function(){var a=ac.getContext('2d'),g=a.createLinearGradient(0,0,0,170);g.addColorStop(0,'#7fe3ff');g.addColorStop(1,'#1f9be0');a.fillStyle=g;a.shadowColor='#4fd0ff';a.shadowBlur=10;a.beginPath();a.moveTo(64,10);a.lineTo(118,160);a.lineTo(64,118);a.lineTo(10,160);a.closePath();a.fill()})();
var tex=gl.createTexture(),tex2=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
[tex,tex2].forEach(function(t){gl.bindTexture(gl.TEXTURE_2D,t);[[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]].forEach(function(a){gl.texParameteri(gl.TEXTURE_2D,a[0],a[1])})});
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.bindTexture(gl.TEXTURE_2D,tex2);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,ac);
gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
var CAM=[0,0.65,9.5],VP=mul(persp(.52,CW/CH,1,30),T(-CAM[0],-CAM[1],-CAM[2]));
var WH=[.93,.95,.98],DK=[.06,.08,.12],CY=[.2,.72,.97],CYE=[.08,.4,.55];
function D(m,M,S,col,em,s,sp){gl.useProgram(P1);gl.uniformMatrix4fv(U.uVP,false,VP);gl.uniform3fv(U.uCam,CAM);gl.uniformMatrix4fv(U.uM,false,M);gl.uniform3fv(U.uS,S);gl.uniform3fv(U.uC,col);gl.uniform3fv(U.uE,em||[0,0,0]);gl.uniform1f(U.uSh,s||30);gl.uniform1f(U.uSp,sp==null?.35:sp);
 var a=gl.getAttribLocation(P1,'aP'),b=gl.getAttribLocation(P1,'aN');gl.bindBuffer(gl.ARRAY_BUFFER,m.p);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ARRAY_BUFFER,m.n);gl.enableVertexAttribArray(b);gl.vertexAttribPointer(b,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.i);gl.drawElements(gl.TRIANGLES,m.c,gl.UNSIGNED_SHORT,0)}
// ---- face (drawn on a 2D canvas, used as a texture on the visor) ----
var fc=document.createElement('canvas');fc.width=512;fc.height=256;var f=fc.getContext('2d');
function face(blink,happy,tk){f.clearRect(0,0,512,256);f.lineCap='round';f.shadowColor='#2fd6ff';f.shadowBlur=26;
 [-1,1].forEach(function(sd){var cx=256+sd*140,cy=96;
  if(happy>.5){f.strokeStyle='#8cf0ff';f.lineWidth=15;f.beginPath();f.arc(cx,cy+22,38,Math.PI*1.12,Math.PI*1.88);f.stroke()}
  else{var g=f.createRadialGradient(cx,cy,2,cx,cy,56);g.addColorStop(0,'#f2ffff');g.addColorStop(.5,'#5fe3ff');g.addColorStop(1,'#1ea5e6');f.fillStyle=g;f.beginPath();f.ellipse(cx,cy,56,Math.max(3,24*(1-blink)),sd*-.22,0,6.3);f.fill()}});
 var my=176,dp=14+34*happy;f.strokeStyle='#8cf0ff';f.lineWidth=8;f.beginPath();f.moveTo(206,my);f.quadraticCurveTo(256,my+dp,306,my);f.stroke();
 if(happy>.7){f.fillStyle='rgba(60,210,255,'+((happy-.7)*2.4).toFixed(2)+')';f.beginPath();f.moveTo(212,my+3);f.quadraticCurveTo(256,my+dp,300,my+3);f.quadraticCurveTo(256,my+dp*.55,212,my+3);f.fill()}if(tk>.06){var oh=6+36*tk;f.shadowBlur=12;f.fillStyle='rgba(12,90,140,.96)';f.beginPath();f.ellipse(256,my+10+oh*.35,40,oh*.5,0,0,6.3);f.fill();f.strokeStyle='#8cf0ff';f.lineWidth=6;f.stroke()}}
// ---- state ----
var talk=0,talkOn=0,moodT=null,quiet=0,bt=0;var mx=0,my=0,hover=0,waveEnd=0,nextWave=900,blinkAt=2500,blinkT=-1,happy=.3,wv=0,t0=performance.now(),say=0;
window.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();mx=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/500));my=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/3)/400))});
cv.onmouseenter=function(){hover=1};cv.onmouseleave=function(){hover=0};
var PH=['Hi! Let\u2019s practise accents!','\u041f\u0440\u0438\u0432\u0435\u0442! \u0414\u0430\u0432\u0430\u0439 \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0430\u043a\u0446\u0435\u043d\u0442\u044b!','Try \u201ctomato\u201d in four accents!','\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439 \u0441\u043b\u043e\u0432\u043e tomato \u0432 \u0447\u0451\u0442\u044b\u0440\u0451\u0445 \u0430\u043a\u0446\u0435\u043d\u0442\u0430\u0445!'];
function wave(now,txt){waveEnd=now+3400;bub.textContent=PH[txt==null?(say++)%PH.length:txt];bub.style.opacity=1;bub.style.transform='none';setTimeout(function(){bub.style.opacity=0;bub.style.transform='translateY(6px)'},3600)}
cv.onclick=function(){if(window.AccentCoach)window.AccentCoach.toggle();else wave(performance.now()-t0+0)};
var yaw=0,pit=0;
function frame(now){if(dead)return;requestAnimationFrame(frame);var t=(now-t0)/1000,ms=now-t0;
 if(!RM&&!quiet&&ms>nextWave){wave(ms);nextWave=ms+11000}
 var waving=ms<waveEnd;wv+=((waving?1:0)-wv)*.12;happy+=((moodT!=null?moodT:((waving||hover)?1:.3))-happy)*.1;talk+=((talkOn?(.55+.45*Math.sin(t*15)):0)-talk)*.35;
 if(ms>blinkAt&&blinkT<0){blinkT=ms;blinkAt=ms+2200+Math.random()*3000}
 var bl=0;if(blinkT>=0){var k=(ms-blinkT)/160;if(k>=1)blinkT=-1;else bl=Math.sin(k*3.14159)}
 yaw+=(mx-yaw)*.08;pit+=(my-pit)*.08;var am=RM?.2:1;
 var bob=Math.sin(t*1.7)*.09*am;shd.style.transform='scaleX('+(1-bob*.9).toFixed(3)+')';shd.style.opacity=(.9-bob).toFixed(2);
 var body=X(T(0,bob,0),Ry(yaw*.45+Math.sin(t*.8)*.1*am));
 gl.viewport(0,0,cv.width,cv.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 // torso
 var tor=X(body,T(0,-.45,0));D(SP,tor,[.85,.8,.7],WH,0,60,.5);
 function Q(tx,M,S){gl.useProgram(P2);gl.bindTexture(gl.TEXTURE_2D,tx);gl.uniformMatrix4fv(U2.vp,false,VP);gl.uniformMatrix4fv(U2.m,false,M);gl.uniform3fv(U2.s,S);gl.uniform1i(U2.t,0);var a=gl.getAttribLocation(P2,'aP'),b=gl.getAttribLocation(P2,'aT');gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(b);gl.vertexAttribPointer(b,2,gl.FLOAT,false,20,12);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
 Q(tex2,X(tor,T(0,-.08,.73),Rx(-.08)),[.5,.95,1]);
 // arms
 [1,-1].forEach(function(s){var th=s*.2+Math.sin(t*1.7+s)*.04*am;if(s>0)th+=(2.5+Math.sin(t*10)*.32-th)*wv;
  var sh=X(tor,T(s*.9,.1,0),Rz(th));D(SP,X(sh,T(0,-.42,0)),[.21,.46,.21],WH,0,60,.5);D(SP,X(sh,T(0,-.42,.15)),[.1,.22,.05],CY,CYE);D(SP,X(sh,T(0,-.95,.02)),[.2,.2,.2],DK,0,80,.9)});
 // head
 var hd=X(body,T(0,1.15,0),Ry(yaw*.7),Rx(pit*.45),Rz(Math.sin(t*3)*.07*wv));
 D(SP,hd,[1.25,.98,1.05],WH,0,70,.6);
 D(SP,X(hd,T(0,-.02,.8)),[1,.6,.36],DK,0,90,1);
 [1,-1].forEach(function(s){var h=X(hd,T(s*.82,.78,0),Rz(-s*.35));D(CN,h,[.3,1.15,.12],WH,0,60,.5);D(SP,X(h,T(0,.3,.08)),[.18,.05,.06],CY,CYE);D(SP,X(h,T(0,.62,.06)),[.11,.045,.05],CY,CYE);
  D(SP,X(hd,T(s*1.2,-.02,0)),[.2,.34,.34],WH,0,60,.5);D(SP,X(hd,T(s*1.38,-.02,0)),[.05,.17,.17],CY,CYE)});
 D(SP,X(hd,T(0,.88,.5),Rx(-.52)),[.5,.035,.12],CY,CYE,20,.2);D(SP,X(hd,T(-.5,.78,.5),Rx(-.4),Rz(.3)),[.2,.03,.1],CY,CYE);D(SP,X(hd,T(.5,.78,.5),Rx(-.4),Rz(-.3)),[.2,.03,.1],CY,CYE);
 face(bl,happy,talk);gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,fc);Q(tex,X(hd,T(0,-.02,1.175)),[1,1,1])}
var hideB=function(){bub.style.opacity=0;bub.style.transform='translateY(6px)'};
window.AccentRobot={say:function(txt,ms){clearTimeout(bt);bub.textContent=txt;bub.style.opacity=1;bub.style.transform='none';if(ms)bt=setTimeout(hideB,ms)},hide:function(){clearTimeout(bt);hideB()},talking:function(on){talkOn=on?1:0},mood:function(v){moodT=v},wave:function(){waveEnd=performance.now()-t0+2600},quiet:function(q){quiet=q?1:0}};
requestAnimationFrame(frame);
})();

/* ============ Accent Coach: the robot becomes a pronunciation trainer ============ */
(function(){
var AR=window.AccentRobot;if(!AR||window.AccentCoach)return;
var ACC=[["en-GB","British","uk"],["en-US","American","us"],["en-AU","Australian","au"],["en-CA","Canadian","ca"]];
var LES=[
{n:"Warm-up: the word water",it:[{t:"water",tips:{uk:"Say a clear t in the middle and do not say the r at the end: WAW-tuh.",us:"The t becomes a quick d and the r at the end is pronounced: WAH-der.",au:"Quick d in the middle, no r at the end, long open vowel: WAW-duh.",ca:"Quick d like in American English, and the r is pronounced: WAH-der."}},{t:"Can I have some water, please?"}]},
{n:"The TH sounds",it:[{t:"think",tip:"Put the tip of your tongue between your teeth and blow air. No voice."},{t:"this",tip:"Tongue between the teeth again, but now use your voice."},{t:"three",tip:"Not “tree” and not “free”: tongue between the teeth."},{t:"that",tip:"Voiced th: feel the buzz of your voice."},{t:"weather",tip:"The th in the middle is voiced, like in this."}]},
{n:"The R sound",it:[{t:"car",tips:{uk:"In British English the r after a vowel is silent: KAH.",us:"In American English the r is pronounced: KAR.",au:"In Australian English the r after a vowel is silent: KAH.",ca:"In Canadian English the r is pronounced: KAR."}},{t:"girl",tip:"Curl your tongue back a little for the r and do not touch the roof of your mouth."},{t:"very",tip:"Start with a v (teeth on the lip), not a w."},{t:"red",tip:"Lips slightly rounded, tongue does not touch anything."}]},
{n:"Short and long vowels",it:[{t:"ship",tip:"A short, relaxed vowel."},{t:"sheep",tip:"Long vowel: smile and hold the sound."},{t:"bit",tip:"Short vowel."},{t:"beat",tip:"Long vowel."},{t:"full",tip:"Short vowel, lips slightly rounded."},{t:"fool",tip:"Long vowel, lips more rounded."}]},
{n:"Path and dance",it:[{t:"path",tips:{uk:"British: a long open vowel, PAHTH.",us:"American: a short a like in cat, PATH.",au:"Australian: usually a long open vowel, PAHTH (it varies).",ca:"Canadian: a short a like in cat, PATH."}},{t:"dance",tips:{uk:"British: DAHNS.",us:"American: DANS with a short a.",au:"Australian: often DAHNS (it varies).",ca:"Canadian: DANS with a short a."}},{t:"bath",tip:"Compare it with path in the other accents."}]},
{n:"Sentences (shadowing)",it:[{t:"I like potato soup.",tip:"Say it smoothly, with a steady rhythm."},{t:"Could you say that again, please?",tip:"Stress could, say and again."},{t:"It is a beautiful day, isn’t it?",tip:"Your voice goes up a little at the end."},{t:"Can I get a cup of tea, please?",tip:"Link the words: cup-of-tea."}]}
];
var SR=window.SpeechRecognition||window.webkitSpeechRecognition,syn=window.speechSynthesis;
var S={a:1,l:0,i:0,open:0,scores:[],best:null};
try{var sa=+localStorage.getItem('ac_acc');if(sa>=0&&sa<4)S.a=sa}catch(e){}
var css=document.createElement('style');css.textContent='#acp{position:fixed;right:214px;bottom:12px;width:350px;max-height:min(78vh,620px);overflow:auto;z-index:9998;background:#fff;color:#0b2e6b;border:2px solid #19b5e8;border-radius:18px;box-shadow:0 10px 34px rgba(0,40,90,.3);font:500 15px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;display:none}#acp *{box-sizing:border-box}#acp .h{background:linear-gradient(135deg,#1f35a8,#0a1558);color:#fff;padding:10px 14px;border-radius:15px 15px 0 0;font-weight:700;display:flex;justify-content:space-between;align-items:center}#acp .h button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer}#acp .b{padding:12px 14px}#acp .ac{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:9px}#acp .ac button,#acp .bt{border:0;border-radius:999px;padding:7px 12px;font:700 13px system-ui;cursor:pointer;background:#e3ebfb;color:#0b2e6b}#acp .ac button.on{background:#1f35a8;color:#fff}#acp select{width:100%;padding:8px;border-radius:10px;border:2px solid #cfe0ff;font:600 14px system-ui;margin-bottom:10px;color:#0b2e6b;background:#fff}#acp .t{font-size:30px;font-weight:800;text-align:center;margin:8px 0 2px;word-break:break-word}#acp .tip{background:#eef7ff;border-left:4px solid #19b5e8;border-radius:8px;padding:8px 10px;font-size:14px;margin:8px 0}#acp .row{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}#acp .bt.p{background:#e0457b;color:#fff}#acp .bt.g{background:#1f9d63;color:#fff}#acp .bt:disabled{opacity:.45}#acp .fb{min-height:44px;font-size:14px}#acp .sc{font-size:26px;font-weight:800}#acp .pg{height:6px;background:#e3ebfb;border-radius:4px;overflow:hidden;margin:6px 0}#acp .pg i{display:block;height:100%;background:#19b5e8}#acp .nt{font-size:12px;color:#586292;margin-top:8px}@media(max-width:700px){#acp{right:8px;left:8px;width:auto;bottom:332px;max-height:50vh}}';
document.head.appendChild(css);
var P=document.createElement('div');P.id='acp';P.setAttribute('role','dialog');P.setAttribute('aria-label','Accent coach');document.body.appendChild(P);
function esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function cur(){return LES[S.l].it[S.i]}
function tipOf(it){var k=ACC[S.a][2];return (it.tips&&it.tips[k])||it.tip||''}
function render(){var L=LES[S.l],it=cur(),h='<div class="h"><span>🤖 Accent Coach</span><button id="acx" aria-label="Close">×</button></div><div class="b"><div class="ac">'+ACC.map(function(a,i){return '<button data-a="'+i+'" class="'+(i===S.a?'on':'')+'">'+a[1]+'</button>'}).join('')+'</div><select id="acl" aria-label="Lesson">'+LES.map(function(l,i){return '<option value="'+i+'"'+(i===S.l?' selected':'')+'>'+esc(l.n)+'</option>'}).join('')+'</select>'+
 '<div class="pg"><i style="width:'+((S.i+1)/L.it.length*100)+'%"></i></div><div class="nt">Item '+(S.i+1)+' of '+L.it.length+'</div><div class="t">'+esc(it.t)+'</div><div class="tip">💡 '+esc(tipOf(it)||'Listen first, then repeat after me.')+'</div>'+
 '<div class="row"><button class="bt p" id="acl1">🔊 Listen</button><button class="bt" id="acs">🐢 Slow</button>'+(SR?'<button class="bt g" id="acm">🎤 Your turn</button>':'<button class="bt g" id="acok">✔ I said it</button>')+'<button class="bt" id="acn">Next ▶</button></div><div class="fb" id="acf" aria-live="polite"></div>'+
 '<div class="nt">'+(SR?'The score shows how well the computer understood you. It is not a pronunciation grade.':'Speech recognition is not available here. Use Chrome for scores. Say the word aloud and press “I said it”.')+' The voice comes from your device and can differ from a real speaker.</div></div>';
 P.innerHTML=h}
function voice(l){var vs=syn?syn.getVoices():[];return vs.find(function(x){return x.lang.replace('_','-')===l})||vs.find(function(x){return x.lang.indexOf('en')===0&&x.lang.indexOf(l.slice(3))>0})}
function speak(txt,rate,cb){if(!syn){cb&&cb();return}syn.cancel();var u=new SpeechSynthesisUtterance(txt.replace(/’/g,"'"));u.lang=ACC[S.a][0];u.rate=rate;var v=voice(u.lang);if(v)u.voice=v;u.onstart=function(){AR.talking(1)};u.onend=u.onerror=function(){AR.talking(0);cb&&cb()};syn.speak(u)}
function say(m,ms){AR.say(m,ms||0)}
function fb(h){var e=document.getElementById('acf');if(e)e.innerHTML=h}
function norm(s){return s.toLowerCase().replace(/[^a-z0-9' ]/g,'').replace(/\s+/g,' ').trim()}
function lev(a,b){var m=[],i,j;for(i=0;i<=a.length;i++)m[i]=[i];for(j=0;j<=b.length;j++)m[0][j]=j;for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return m[a.length][b.length]}
function sim(a,b){a=norm(a.replace(/’/g,"'"));b=norm(b);var L=Math.max(a.length,b.length)||1;return Math.round(100*(1-lev(a,b)/L))}
function result(sc,heard){var it=cur(),msg,tip=tipOf(it);S.scores[S.l+'-'+S.i]=sc;
 if(sc>=85){AR.mood(1);AR.wave();msg='Great! Score '+sc+'%.';fb('<div class="sc">'+sc+'% ⭐</div>I heard: “'+esc(heard)+'”. Great job!')}
 else if(sc>=55){AR.mood(.55);msg='Almost! Listen once more and try again.';fb('<div class="sc">'+sc+'%</div>I heard: “'+esc(heard)+'”. Almost there. '+(tip?'<br>💡 '+esc(tip):''))}
 else{AR.mood(0);msg='Let’s try again, slowly.';fb('<div class="sc">'+sc+'%</div>I heard: “'+esc(heard||'nothing')+'”. Press 🐢 Slow, listen, and try again.')}
 say(msg);setTimeout(function(){AR.mood(null)},3500)}
function listen(){if(!SR)return;if(syn)syn.cancel();var rc=new SR();rc.lang=ACC[S.a][0];rc.interimResults=false;rc.maxAlternatives=3;say('I am listening… say: '+cur().t);fb('🎤 Listening…');
 rc.onresult=function(e){var best=0,txt='';for(var k=0;k<e.results[0].length;k++){var tr=e.results[0][k].transcript,sc=sim(cur().t,tr);if(sc>=best){best=sc;txt=tr}}result(best,txt)};
 rc.onerror=function(e){fb('Could not hear you ('+esc(e.error)+'). Allow the microphone and try again.');say('I could not hear you. Try again!')};try{rc.start()}catch(x){}}
function next(){var L=LES[S.l];if(S.i+1<L.it.length){S.i++;render();say('Next one! Press Listen.')}else{var arr=L.it.map(function(_,i){return S.scores[S.l+'-'+i]}).filter(function(x){return x!=null}),avg=arr.length?Math.round(arr.reduce(function(a,b){return a+b},0)/arr.length):null;
  S.i=0;render();AR.mood(1);AR.wave();var m='Lesson complete!'+(avg!=null?' Average '+avg+'%.':'')+' Choose another lesson or accent.';fb('<div class="sc">'+(avg!=null?avg+'% ':'')+'🎉</div>'+m);say(m);setTimeout(function(){AR.mood(null)},3500)}}
P.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
 if(b.id==='acx'){close()}else if(b.dataset.a!==undefined){S.a=+b.dataset.a;try{localStorage.setItem('ac_acc',S.a)}catch(x){}render();say('Now we practise '+ACC[S.a][1]+' English.')}
 else if(b.id==='acl1'){var it=cur();say('Listen: '+it.t);fb('');speak(it.t,.9,function(){say(SR?'Your turn! Press 🎤.':'Now say it aloud.')})}
 else if(b.id==='acs'){var it2=cur();say('Slowly: '+it2.t);speak(it2.t,.55,function(){say(SR?'Your turn! Press 🎤.':'Now say it aloud.')})}
 else if(b.id==='acm'){listen()}
 else if(b.id==='acok'){var m='Good! Press Next.';AR.mood(1);AR.wave();fb(m);say(m);setTimeout(function(){AR.mood(null)},2500)}
 else if(b.id==='acn'){next()}});
P.addEventListener('change',function(e){if(e.target.id==='acl'){S.l=+e.target.value;S.i=0;render();say('Lesson: '+LES[S.l].n+'. Press Listen!')}});
function open(){S.open=1;P.style.display='block';render();AR.quiet(1);say('Hi! I am your accent coach. Pick an accent and a lesson, then press Listen.');AR.wave()}
function close(){S.open=0;P.style.display='none';AR.quiet(0);AR.hide();AR.mood(null);if(syn)syn.cancel()}
window.AccentCoach={toggle:function(){S.open?close():open()},open:open,close:close,destroy:function(){close();P.remove()}};
})();
