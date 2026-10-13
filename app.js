(() => {
  'use strict';
  const APP_VERSION = '0.0.1';
  const $ = id => document.getElementById(id);
  const canvas = $('worldCanvas');
  const ctx = canvas.getContext('2d');
  const bubble = $('speechBubble');
  const modal = $('modalBackdrop');
  const modalArt = $('modalArt');
  const modalTitle = $('modalTitle');
  const modalText = $('modalText');
  const modalChoices = $('modalChoices');
  const modalAction = $('modalAction');
  let selected = 'rex';
  let soundOn = true;
  let activity = null;
  let animationTime = 0;
  let animationMode = 'idle';
  let lastFrame = 0;
  let audioContext = null;
  let deviceScale = 1;
  let canvasW = 600, canvasH = 300;
  const dinoData = {
    rex: {name:'Rex', full:'Tyrannosaurus rex', color:'#55c97c', dark:'#29995b', light:'#a2efae', accent:'#f7d66e', emoji:'🦖', greeting:'Hi! I’m Rex. Roar-some to meet you!', fact:'Rex was a meat-eating dinosaur with a very big head and strong legs.', sound:180},
    trixie: {name:'Trixie', full:'Triceratops', color:'#ffa76e', dark:'#e9794e', light:'#ffd0a2', accent:'#fff1be', emoji:'🦕', greeting:'Hello! I’m Trixie. Want to play?', fact:'Triceratops had three horns and a big bony frill around its head.', sound:230},
    benny: {name:'Benny', full:'Brachiosaurus', color:'#65c5ed', dark:'#369bc9', light:'#a8e5fa', accent:'#ffe49b', emoji:'🦕', greeting:'Hello up there! I’m Benny!', fact:'Brachiosaurus had a long neck to help it reach tall plants.', sound:260}
  };
  function resizeCanvas(){
    const rect = canvas.getBoundingClientRect();
    deviceScale = Math.min(window.devicePixelRatio || 1, 2);
    canvasW = Math.max(1, rect.width); canvasH = Math.max(1, rect.height);
    canvas.width = Math.round(canvasW * deviceScale); canvas.height = Math.round(canvasH * deviceScale);
    ctx.setTransform(deviceScale,0,0,deviceScale,0,0);
    drawWorld();
  }
  function roundedRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
  function ellipse(x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}
  function path(points,fill,stroke,lineWidth=2){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.lineJoin='round';ctx.stroke();}}
  function gradient(x,y,r,top,bottom){const g=ctx.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,top);g.addColorStop(1,bottom);return g;}
  function drawCloud(x,y,s){ctx.fillStyle='rgba(255,255,255,.82)';ellipse(x,y,s*1.1,s*.42,ctx.fillStyle);ellipse(x-s*.42,y-s*.12,s*.52,s*.42,ctx.fillStyle);ellipse(x+s*.1,y-s*.28,s*.57,s*.52,ctx.fillStyle);}
  function drawPlant(x,y,s){ctx.save();ctx.translate(x,y);ctx.strokeStyle='#3b9a5f';ctx.lineWidth=3*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-18*s);ctx.stroke();ctx.fillStyle='#69c982';for(const a of [-1,1]){ctx.beginPath();ctx.ellipse(a*6*s,-12*s,8*s,3.5*s,a*.5,0,Math.PI*2);ctx.fill();}ctx.restore();}
  function drawEgg(x,y,s,cracked=false){ctx.save();ctx.translate(x,y);ctx.rotate(-.12);ctx.shadowColor='rgba(56,95,63,.16)';ctx.shadowBlur=6;ctx.shadowOffsetY=3;ctx.fillStyle='#fff9e6';ctx.beginPath();ctx.ellipse(0,0,10*s,14*s,0,0,Math.PI*2);ctx.fill();ctx.shadowColor='transparent';ctx.fillStyle='#f5c979';ellipse(-3*s,-3*s,2*s,2*s,ctx.fillStyle);ellipse(4*s,4*s,2*s,2*s,ctx.fillStyle);if(cracked){ctx.strokeStyle='#dca64e';ctx.lineWidth=1.8*s;ctx.beginPath();ctx.moveTo(-1*s,-13*s);ctx.lineTo(2*s,-5*s);ctx.lineTo(-2*s,0);ctx.lineTo(3*s,6*s);ctx.stroke();}ctx.restore();}
  function drawDino(kind,x,y,s,mode='idle',phase=0){
    const d=dinoData[kind]; ctx.save();ctx.translate(x,y+Math.sin(phase*2.1)*((mode==='dance')?7:2));ctx.scale(s,s);
    const bob=mode==='dance'?Math.sin(phase*6)*.07:0;ctx.rotate(bob);
    // soft ground shadow
    ellipse(0,5,53,10,'rgba(51,113,75,.17)');
    if(kind==='rex'){
      // tail, body and little arms
      path([[-29,-38],[-59,-51],[-43,-29],[-26,-23]],gradient(-42,-39,20,d.light,d.dark),d.dark,2.4);
      ellipse(-2,-29,34,30,gradient(0,-35,43,d.light,d.color));
      // feet
      roundedRect(-28,-8,18,17,7,d.dark);roundedRect(8,-8,19,17,7,d.dark);
      ellipse(-19,8,15,5,d.dark);ellipse(18,8,15,5,d.dark);
      // head
      ellipse(17,-60,25,25,gradient(15,-72,35,'#9aefab',d.color));
      roundedRect(17,-54,29,17,8,d.color);
      // spikes
      path([[-9,-75],[-2,-88],[4,-74]],d.accent,d.dark,1.3);path([[1,-80],[8,-93],[13,-75]],d.accent,d.dark,1.3);
      // eyes and smile
      ellipse(25,-66,7,8,'#fff');ellipse(27,-65,3.5,4.5,'#24483b');ellipse(28,-67,1.3,1.5,'#fff');
      ctx.strokeStyle='#225a3e';ctx.lineWidth=2;ctx.beginPath();ctx.arc(29,-49,8,.2,1.5);ctx.stroke();
      // belly
      ellipse(6,-22,19,21,'#c4f0a6');
      // tiny arms
      path([[12,-34],[20,-29],[16,-22],[10,-27]],d.light,d.dark,1.5);
    } else if(kind==='trixie'){
      // tail and body
      path([[-31,-30],[-53,-42],[-43,-22],[-27,-18]],gradient(-40,-31,19,d.light,d.dark),d.dark,2);
      ellipse(-2,-28,36,27,gradient(0,-35,42,d.light,d.color));
      roundedRect(-27,-9,19,18,7,d.dark);roundedRect(9,-9,19,18,7,d.dark);ellipse(-18,8,14,5,d.dark);ellipse(19,8,14,5,d.dark);
      // frill
      ctx.beginPath();ctx.ellipse(19,-57,30,28,-.1,0,Math.PI*2);ctx.fillStyle=gradient(18,-63,36,d.light,d.color);ctx.fill();ctx.strokeStyle=d.dark;ctx.lineWidth=2.5;ctx.stroke();
      // frill dots
      ellipse(5,-75,3,3,d.accent);ellipse(29,-78,3,3,d.accent);ellipse(42,-58,3,3,d.accent);ellipse(6,-49,3,3,d.accent);
      // horns
      path([[0,-71],[-7,-89],[7,-75]],'#fff1cf',d.dark,1.8);path([[24,-76],[31,-91],[34,-73]],'#fff1cf',d.dark,1.8);
      // face muzzle
      ellipse(31,-52,21,16,gradient(28,-58,25,'#ffd2a0',d.color));ellipse(38,-53,3,3,d.dark);
      ellipse(25,-62,7,8,'#fff');ellipse(27,-61,3.5,4.5,'#24483b');ellipse(28,-63,1.3,1.5,'#fff');
      ctx.strokeStyle='#9c4d36';ctx.lineWidth=2;ctx.beginPath();ctx.arc(37,-45,7,.1,1.4);ctx.stroke();
    } else {
      // tail and body
      path([[-28,-26],[-52,-38],[-44,-19],[-25,-17]],gradient(-40,-29,18,d.light,d.dark),d.dark,2);
      ellipse(-2,-25,35,26,gradient(0,-32,40,d.light,d.color));
      roundedRect(-26,-9,18,18,7,d.dark);roundedRect(9,-9,18,18,7,d.dark);ellipse(-17,8,14,5,d.dark);ellipse(18,8,14,5,d.dark);
      // tall neck and head
      ctx.beginPath();ctx.moveTo(9,-32);ctx.quadraticCurveTo(16,-50,18,-68);ctx.quadraticCurveTo(17,-79,28,-81);ctx.lineTo(40,-77);ctx.lineTo(38,-65);ctx.quadraticCurveTo(28,-65,29,-53);ctx.lineTo(26,-29);ctx.closePath();ctx.fillStyle=gradient(15,-55,29,d.light,d.color);ctx.fill();ctx.strokeStyle=d.dark;ctx.lineWidth=2;ctx.stroke();
      ellipse(32,-79,19,14,gradient(29,-85,25,d.light,d.color));roundedRect(37,-78,16,9,5,d.color);
      ellipse(36,-83,6.5,7,'#fff');ellipse(38,-82,3,4,'#24483b');ellipse(39,-84,1.2,1.4,'#fff');
      ctx.strokeStyle=d.dark;ctx.lineWidth=2;ctx.beginPath();ctx.arc(47,-72,5,.2,1.5);ctx.stroke();
      // belly
      ellipse(1,-19,19,17,'#b7e9f8');
    }
    // blush and sparkle
    if(kind!=='benny') ellipse(36,-48,5,3,'#ff9b9b');
    if(mode==='dance'){ctx.save();ctx.rotate(Math.sin(phase*6)*.2);ctx.fillStyle='#fff2a6';ctx.font='bold 18px system-ui';ctx.fillText('♪',-53,-68);ctx.fillText('✦',45,-95);ctx.restore();}
    if(mode==='eat'){ctx.fillStyle='#fff2a6';ctx.font='bold 15px system-ui';ctx.fillText('♥',43,-92);}
    ctx.restore();
  }
  function drawWorld(){
    if(!ctx||!canvasW)return;
    const w=canvasW,h=canvasH;
    const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#9edcff');sky.addColorStop(.65,'#d8f6ff');sky.addColorStop(1,'#e7f8d0');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
    // sun
    ellipse(w*.83,h*.22,25,25,'#ffdf78');ellipse(w*.83,h*.22,32,32,'rgba(255,225,123,.24)');
    drawCloud(w*.18,h*.2,.7);drawCloud(w*.53,h*.14,.52);
    // distant hills
    ctx.fillStyle='#9ddda8';ctx.beginPath();ctx.moveTo(0,h*.63);ctx.quadraticCurveTo(w*.17,h*.37,w*.37,h*.62);ctx.quadraticCurveTo(w*.62,h*.39,w*.78,h*.6);ctx.quadraticCurveTo(w*.9,h*.47,w,h*.57);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill();
    // ground
    const grd=ctx.createLinearGradient(0,h*.6,0,h);grd.addColorStop(0,'#82d58a');grd.addColorStop(1,'#b8e99a');ctx.fillStyle=grd;ctx.fillRect(0,h*.63,w,h*.37);
    // pond
    ellipse(w*.82,h*.79,w*.11,h*.055,'#80d7ef');ellipse(w*.82,h*.78,w*.075,h*.022,'rgba(255,255,255,.55)');
    // distant trees
    for(let i=0;i<7;i++){const x=(i*91+22)%w;const y=h*.61+(i%2)*8;ctx.fillStyle='#5cb978';roundedRect(x-4,y-30,8,34,4,'#8aaf70');ellipse(x,y-34,17,20,['#62c47a','#72d28b','#4fb777'][i%3]);}
    // plants and flowers
    for(let i=0;i<12;i++){const x=(i*53+12)%w;const y=h*.88+(i%3)*8;drawPlant(x,y,0.55+(i%3)*.13);if(i%3===0){ellipse(x+7,y-8,3,3,'#ffb4c1');ellipse(x+7,y-8,1,1,'#ffdf79');}}
    // little path
    ctx.fillStyle='rgba(255,238,183,.6)';ctx.beginPath();ctx.moveTo(w*.27,h);ctx.quadraticCurveTo(w*.4,h*.78,w*.55,h*.79);ctx.quadraticCurveTo(w*.63,h*.78,w*.7,h);ctx.closePath();ctx.fill();
    // egg nest
    ellipse(w*.16,h*.86,24,8,'#b9854d');ellipse(w*.16,h*.84,20,7,'#d6a467');drawEgg(w*.16,h*.82,.72,activity==='egg');
    // three dinos with selected character prominent in front
    const positions={rex:[w*.34,h*.77,.82],trixie:[w*.57,h*.77,.78],benny:[w*.76,h*.76,.72]};
    const order=['rex','trixie','benny'].filter(k=>k!==selected).concat(selected);
    for(const k of order){const p=positions[k];drawDino(k,p[0],p[1],p[2],k===selected?animationMode:'idle',animationTime+(k==='trixie'?1.4:k==='benny'?2.2:0));}
    // ground sparkle
    ctx.fillStyle='rgba(255,255,255,.9)';ctx.font='bold 14px system-ui';ctx.fillText('✦',w*.1,h*.7);ctx.fillText('✦',w*.9,h*.65);
  }
  function animate(now){if(!lastFrame)lastFrame=now;const dt=Math.min(.05,(now-lastFrame)/1000);lastFrame=now;animationTime+=dt;drawWorld();requestAnimationFrame(animate);}
  function speak(text){bubble.textContent=text;if(!soundOn)return;try{if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const d=dinoData[selected];const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.setValueAtTime(d.sound,audioContext.currentTime);osc.frequency.exponentialRampToValueAtTime(d.sound*1.25,audioContext.currentTime+.12);gain.gain.setValueAtTime(.0001,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.08,audioContext.currentTime+.025);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.22);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.23);}catch(e){/* Audio is an enhancement; gameplay still works without it. */}}
  function selectDino(kind,announce=true){selected=kind;document.querySelectorAll('.dino-choice').forEach(b=>b.classList.toggle('selected',b.dataset.dino===kind));animationMode='hello';drawWorld();if(announce)speak(dinoData[kind].greeting);}
  function openModal({art,title,text,choices=[],action="Let's go!",onAction=null}){modalArt.textContent=art;modalTitle.textContent=title;modalText.textContent=text;modalChoices.innerHTML='';modalAction.textContent=action;modalAction.onclick=()=>{if(onAction)onAction();else closeModal();};choices.forEach(c=>{const b=document.createElement('button');b.className='choice-button';b.textContent=c.label;b.onclick=()=>c.onClick();modalChoices.appendChild(b);});modal.classList.remove('hidden');}
  function closeModal(){modal.classList.add('hidden');activity=null;animationMode='idle';drawWorld();}
  function doEgg(){activity='egg';animationMode='egg';openModal({art:'🥚',title:'A little surprise!',text:'Tap the egg to help it hatch. Who could be inside?',action:'Hatch the egg!',onAction:()=>{modalArt.textContent='✨';modalTitle.textContent='Crack, crack, CRACK!';modalText.textContent='A tiny dinosaur is coming out!';modalAction.textContent='Meet the baby!';modalAction.onclick=()=>{const keys=Object.keys(dinoData);const born=keys[Math.floor(Math.random()*keys.length)];selectDino(born,false);modalArt.textContent=dinoData[born].emoji;modalTitle.textContent='Hello, baby '+dinoData[born].name+'!';modalText.textContent='You helped a dinosaur hatch. '+dinoData[born].greeting;modalAction.textContent='Hooray!';modalAction.onclick=closeModal;celebrate();};celebrate();}});}
  function doFeed(){activity='feed';animationMode='eat';openModal({art:'🥬',title:'Rumble, rumble!',text:'Our dinosaur is hungry. What should we try feeding it?',choices:[{label:'🥬 Leaf',onClick:()=>feedAnswer(true,'A crunchy leaf. Yum!')},{label:'🍓 Berry',onClick:()=>feedAnswer(true,'A juicy berry. Delicious!')},{label:'🪨 Rock',onClick:()=>feedAnswer(false,'That’s a rock! Let’s choose something yummy.')}],action:'Try a food',onAction:()=>{}});}
  function feedAnswer(good,msg){if(good){modalArt.textContent='😋';modalTitle.textContent='Yum, yum!';modalText.textContent=msg+' '+dinoData[selected].name+' is happy!';modalChoices.innerHTML='';modalAction.textContent='More play!';modalAction.onclick=closeModal;animationMode='eat';celebrate();}else{modalArt.textContent='🤔';modalTitle.textContent='Hmm…';modalText.textContent=msg;modalAction.textContent='Try again';modalAction.onclick=doFeed;}}
  function doLearn(){activity='learn';const target=['rex','trixie','benny'][Math.floor(Math.random()*3)];const targetData=dinoData[target];openModal({art:'🌈',title:'Can you find '+targetData.name+'?',text:'Tap the right dinosaur! Look for '+targetData.full+'.',choices:Object.keys(dinoData).map(k=>({label:dinoData[k].emoji+' '+dinoData[k].name,onClick:()=>{if(k===target){selectDino(k,false);modalArt.textContent='⭐';modalTitle.textContent='You found '+targetData.name+'!';modalText.textContent=targetData.fact;modalChoices.innerHTML='';modalAction.textContent='Hooray!';modalAction.onclick=closeModal;celebrate();}else{modalArt.textContent='💚';modalTitle.textContent='Good trying!';modalText.textContent='Let’s have another look. Can you find '+targetData.name+'?';modalAction.textContent='Try again';modalAction.onclick=doLearn;}}})),action:'Choose a dinosaur',onAction:()=>{}});}
  function doDance(){activity='dance';animationMode='dance';openModal({art:'🎵',title:'Dance time!',text:dinoData[selected].name+' is ready to wiggle. Can you dance too?',action:'Wiggle, wiggle!',onAction:()=>{animationMode='dance';modalArt.textContent='💃';modalTitle.textContent='Great dancing!';modalText.textContent='Wiggle, wiggle, ROAR! You are a dino dance star.';modalAction.textContent='Dance again';modalAction.onclick=doDance;celebrate();}});}
  function celebrate(){if(!soundOn)return;try{if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();[523,659,784].forEach((f,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.frequency.value=f;o.type='sine';g.gain.setValueAtTime(.0001,audioContext.currentTime+i*.09);g.gain.exponentialRampToValueAtTime(.055,audioContext.currentTime+i*.09+.025);g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+i*.09+.18);o.connect(g);g.connect(audioContext.destination);o.start(audioContext.currentTime+i*.09);o.stop(audioContext.currentTime+i*.09+.2);});}catch(e){}}
  document.querySelectorAll('.dino-choice').forEach(b=>b.addEventListener('click',()=>selectDino(b.dataset.dino)));
  document.querySelectorAll('.activity-card').forEach(b=>b.addEventListener('click',()=>({egg:doEgg,feed:doFeed,learn:doLearn,dance:doDance}[b.dataset.activity])()));
  $('soundToggle').addEventListener('click',()=>{soundOn=!soundOn;$('soundToggle').textContent=soundOn?'🔊':'🔇';$('soundToggle').title=soundOn?'Sound on':'Sound off';if(soundOn)speak('Sound is on!');else bubble.textContent='Sound is off. Tap to turn it back on.';});
  $('modalClose').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  $('parentButton').addEventListener('click',()=>openModal({art:'💚',title:'Grown-ups corner',text:'Dino World v'+APP_VERSION+' is an early family-testing prototype. It does not need an account and does not intentionally collect personal information. Please supervise little explorers while testing.',action:'Back to play'}));
  canvas.addEventListener('click',e=>{const rect=canvas.getBoundingClientRect();const x=e.clientX-rect.left;const rel=x/rect.width;if(rel<.45)selectDino('rex');else if(rel<.68)selectDino('trixie');else selectDino('benny');});
  $('versionLabel').textContent='v'+APP_VERSION;
  window.addEventListener('resize',resizeCanvas,{passive:true});resizeCanvas();requestAnimationFrame(animate);

  // PWA install and automatic update support. The app checks on open and every 60 seconds.
  const toast=$('updateToast');let reloading=false;
  function showToast(msg){toast.textContent=msg;toast.classList.remove('hidden');setTimeout(()=>toast.classList.add('hidden'),4200);}
  async function registerUpdater(){
    if(!('serviceWorker' in navigator))return;
    try{
      const registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
      registration.update().catch(()=>{});
      registration.addEventListener('updatefound',()=>{
        const worker=registration.installing;if(!worker)return;
        worker.addEventListener('statechange',()=>{
          if(worker.state==='installed'&&navigator.serviceWorker.controller){showToast('Dino World is updating…');worker.postMessage({type:'SKIP_WAITING'});}
        });
      });
      navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)return;reloading=true;window.location.reload();});
      checkRemoteVersion(registration);
      setInterval(()=>checkRemoteVersion(registration),60000);
    }catch(e){console.warn('Offline support could not be enabled in this browser.',e);}
  }
  async function checkRemoteVersion(registration){
    try{
      const response=await fetch('./version.json?check='+Date.now(),{cache:'no-store'});if(!response.ok)return;
      const data=await response.json();if(!data.version||data.version===APP_VERSION)return;
      showToast('A new Dino World version is available. Updating…');
      await registration.update();
      if(registration.waiting)registration.waiting.postMessage({type:'SKIP_WAITING'});
    }catch(e){/* Offline: keep playing; the next check runs when connectivity returns. */}
  }
  if(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')registerUpdater();
})();
