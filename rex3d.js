import * as THREE from 'three';
(() => {
  'use strict';
  const hero = document.getElementById('mainDino');
  const stage = document.querySelector('.scene-visual');
  if (!hero || !stage || !window.WebGLRenderingContext) return;
  let renderer, camera, scene, rex, bodyRig, headPivot, jawPivot, tailRoot;
  let legs = [], arms = [], tails = [], lids = [], mode = 'idle', modeStart = 0, clock = new THREE.Clock(), paused = false;
  const material = (color, roughness=.65, metalness=0) => new THREE.MeshStandardMaterial({color, roughness, metalness});
  const green=material('#79c92d'), lightGreen=material('#a2e844'), darkGreen=material('#368b27'), belly=material('#f4d99a'), bellyLine=material('#d9b96c'), white=material('#fff7df'), iris=material('#a85a1d',.3), black=material('#171d16',.2), nostril=material('#244b1c'), mouth=material('#632c26'), tongue=material('#ee6f79'), claw=material('#55402c');
  function ball(parent,name,pos,scale,mat,seg=24){const m=new THREE.Mesh(new THREE.SphereGeometry(1,seg,Math.max(12,seg>>1)),mat);m.name=name;m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function capsule(parent,name,a,b,r,mat){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),d=vb.clone().sub(va);const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.01,d.length()-2*r),4,10),mat);m.name=name;m.position.copy(va.add(vb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.castShadow=true;parent.add(m);return m;}
  function build(){
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(34,1,.1,60);camera.position.set(0,2.45,8.8);camera.lookAt(0,2.05,0);
    scene.add(new THREE.HemisphereLight(0xf4ffff,0x49633a,2.0));
    const key=new THREE.DirectionalLight(0xfff1d0,2.5);key.position.set(-3,7,6);scene.add(key);
    const fill=new THREE.DirectionalLight(0x72caff,1.15);fill.position.set(4,4,-5);scene.add(fill);
    rex=new THREE.Group();scene.add(rex);bodyRig=new THREE.Group();rex.add(bodyRig);
    ball(bodyRig,'torso',[0,1.65,0],[.83,1.03,.63],green);ball(bodyRig,'chest',[0,1.52,.48],[.56,.86,.22],belly);ball(bodyRig,'hips',[0,.96,-.02],[.82,.66,.59],green);
    for(let i=0;i<6;i++)ball(bodyRig,'belly-plate',[0,.98+i*.205,.682-Math.abs(i-2.5)*.012],[.39,.09,.045],bellyLine,20);
    for(const side of [-1,1])for(let i=0;i<9;i++)ball(bodyRig,'flank-spot',[side*(.69-(i%3)*.035),1.2+(i%4)*.27,-.42+Math.floor(i/4)*.24],[.12,.08,.035],darkGreen,14);
    legs=[];for(const side of [-1,1]){const pivot=new THREE.Group();pivot.position.set(side*.52,.9,0);bodyRig.add(pivot);ball(pivot,'thigh',[0,-.12,.03],[.38,.53,.39],green);capsule(pivot,'shin',[0,-.35,.05],[side*.02,-.78,.17],.19,lightGreen);ball(pivot,'foot',[side*.02,-.78,.3],[.32,.16,.42],green);for(let c=-1;c<=1;c++)ball(pivot,'toe',[side*.02+c*.18,-.82,.58],[.095,.09,.16],claw,14);legs.push(pivot);}
    arms=[];for(const side of [-1,1]){const pivot=new THREE.Group();pivot.position.set(side*.57,1.95,.36);bodyRig.add(pivot);capsule(pivot,'upper-arm',[0,0,0],[side*.11,-.25,.05],.17,green);capsule(pivot,'forearm',[side*.11,-.22,.06],[side*.18,-.38,.18],.13,lightGreen);for(let k=0;k<2;k++)capsule(pivot,'finger',[side*.18,-.35,.17+k*.06],[side*.2,-.45,.22+k*.06],.035,claw);arms.push(pivot);}
    ball(bodyRig,'neck',[0,2.42,.05],[.52,.68,.5],green);headPivot=new THREE.Group();headPivot.position.set(0,2.72,.24);bodyRig.add(headPivot);
    ball(headPivot,'skull',[0,.26,.1],[.78,.72,.66],green);ball(headPivot,'snout',[0,.03,.68],[.78,.39,.68],lightGreen);ball(headPivot,'lower-jaw',[0,-.3,.72],[.66,.17,.56],green);
    jawPivot=new THREE.Group();jawPivot.position.set(0,-.18,.78);headPivot.add(jawPivot);ball(jawPivot,'mouth-interior',[0,-.03,.12],[.53,.12,.4],mouth);ball(jawPivot,'tongue',[0,-.11,.32],[.25,.055,.17],tongue);
    for(let i=0;i<5;i++){const x=-.38+i*.19;const tooth=new THREE.Mesh(new THREE.ConeGeometry(.055,.13,10),white);tooth.position.set(x,-.015,.43);tooth.rotation.x=Math.PI;jawPivot.add(tooth);const lower=new THREE.Mesh(new THREE.ConeGeometry(.045,.105,10),white);lower.position.set(x,-.07,.43);jawPivot.add(lower);}
    lids=[];for(const side of [-1,1]){ball(headPivot,'eyeball',[side*.43,.46,.59],[.23,.28,.16],white);ball(headPivot,'iris',[side*.43+.025,.45,.735],[.145,.18,.065],iris);ball(headPivot,'pupil',[side*.43+.035,.46,.788],[.082,.115,.035],black);ball(headPivot,'eye-glint',[side*.43+.005,.52,.817],[.035,.045,.018],white,12);const lid=ball(headPivot,'eyelid',[side*.43,.55,.68],[.245,.02,.17],green);lids.push(lid);ball(headPivot,'brow',[side*.43,.72,.56],[.27,.08,.13],darkGreen);}
    for(const side of [-1,1])ball(headPivot,'nostril',[side*.29,.11,1.23],[.065,.045,.025],nostril,14);
    tailRoot=new THREE.Group();tailRoot.position.set(0,1.24,-.48);bodyRig.add(tailRoot);tails=[];let parent=tailRoot;const lengths=[.55,.52,.47,.42,.36,.3];for(let i=0;i<lengths.length;i++){const seg=new THREE.Group();seg.position.set(0,0,-(i===0?0:lengths[i-1]*.78));parent.add(seg);const r=.37-i*.047;ball(seg,'tail-segment',[0,0,-lengths[i]*.48],[r*.9,r*.85,lengths[i]*.75],i%2?green:lightGreen,20);if(i>1)ball(seg,'tail-spot',[0,r*.65,-lengths[i]*.48],[r*.38,.035,r*.22],darkGreen,12);tails.push(seg);parent=seg;}
  }
  let canvas, imageRect;
  function positionCanvas(){if(!canvas||!renderer)return;const r=hero.getBoundingClientRect(),s=stage.getBoundingClientRect();canvas.style.left=(r.left-s.left)+'px';canvas.style.top=(r.top-s.top)+'px';canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';renderer.setSize(Math.max(1,Math.round(r.width)),Math.max(1,Math.round(r.height)),false);camera.aspect=Math.max(.1,r.width)/Math.max(.1,r.height);camera.updateProjectionMatrix();}
  function setVisible(on){const visible=!!on&&!!renderer;hero.classList.toggle('rex3d-hidden',visible);canvas.style.display=visible?'block':'none';stage.classList.toggle('rex3d-ready',visible);if(visible)positionCanvas();}
  function setMode(next){mode=next||'idle';modeStart=clock.elapsedTime;}
  function animate(){requestAnimationFrame(animate);if(!renderer)return;const t=clock.getElapsedTime(),u=t-modeStart;if(!paused){bodyRig.position.y=.035*Math.sin(t*2.4);bodyRig.scale.y=1+.012*Math.sin(t*2.1);bodyRig.scale.x=1-.006*Math.sin(t*2.1);headPivot.rotation.z=.025*Math.sin(t*1.25);headPivot.rotation.x=.025*Math.sin(t*1.7);tailRoot.rotation.y=.2*Math.sin(t*1.8);tails.forEach((seg,i)=>{seg.rotation.y=.16*Math.sin(t*2.3-i*.5);seg.rotation.x=.08*Math.sin(t*2-i*.45)});arms.forEach((a,i)=>{a.rotation.x=.05*Math.sin(t*2+i);a.rotation.z=(i===0?1:-1)*(.04+.035*Math.sin(t*2))});legs.forEach((l,i)=>l.rotation.x=.025*Math.sin(t*2+i*Math.PI));jawPivot.rotation.x=0;lids.forEach(l=>{l.scale.y=.02;l.position.y=.55});const bp=t%4.3;if(bp>3.98&&bp<4.13){const f=Math.sin((bp-3.98)/.15*Math.PI);lids.forEach(l=>{l.scale.y=.02+.25*f;l.position.y=.55-.11*f});}
      if(mode==='happy'||mode==='dance'){bodyRig.position.y+=.13*Math.abs(Math.sin(u*(mode==='dance'?7:8)));headPivot.rotation.z=.1*Math.sin(u*5);arms.forEach((a,i)=>a.rotation.z+=(i===0?-.35:.35)*Math.abs(Math.sin(u*8)));}
      if(mode==='roar'){jawPivot.rotation.x=-.65*(.5+.5*Math.sin(u*9));headPivot.rotation.x=-.14;}
      if(mode==='jump'){bodyRig.position.y+=Math.max(0,Math.sin(u*4.2))*.8;legs.forEach(l=>l.rotation.x=-.65*Math.max(0,Math.sin(u*4.2)));arms.forEach((a,i)=>a.rotation.z+=(i===0?-.5:.5)*.7);}
      if(mode==='blink'){const f=u<.18?Math.sin(u/.18*Math.PI):0;lids.forEach(l=>{l.scale.y=.02+.25*f;l.position.y=.55-.11*f});if(u>.55)setMode('idle');}
      if(mode==='tail'){tailRoot.rotation.y=.65*Math.sin(u*5);tails.forEach((seg,i)=>seg.rotation.y=.35*Math.sin(u*5-i*.7));}
      if(mode==='look'){headPivot.rotation.y=.48*Math.sin(u*1.7);headPivot.rotation.z=.06*Math.sin(u*2);}
      if(mode==='walk'){legs.forEach((l,i)=>l.rotation.x=.48*Math.sin(u*6+i*Math.PI));arms.forEach((a,i)=>a.rotation.x=.3*Math.sin(u*6+i*Math.PI));bodyRig.position.y+=.045*Math.abs(Math.sin(u*6));}
      if(u>2.5&&['happy','jump','roar','tail','look','dance'].includes(mode))setMode('idle');}
    renderer.render(scene,camera);}
  try{
    build();
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
    canvas=renderer.domElement;canvas.className='rex3d-canvas';canvas.setAttribute('role','button');canvas.setAttribute('aria-label','Tap Rex to react');stage.appendChild(canvas);
    window.DinoRex3D={setVisible,setMode,pause(){paused=true;},resume(){paused=false;}};
    positionCanvas();setVisible(hero.dataset.dino==='rex');
    canvas.addEventListener('pointerdown',()=>{setMode('happy');hero.click();});window.addEventListener('resize',positionCanvas,{passive:true});
    if('ResizeObserver'in window){new ResizeObserver(positionCanvas).observe(stage);new ResizeObserver(positionCanvas).observe(hero);}
    window.dispatchEvent(new Event('dino-rex3d-ready'));animate();
  }catch(err){console.warn('Dino World 3D Rex unavailable; using original artwork.',err);if(canvas)canvas.remove();hero.classList.remove('rex3d-hidden');stage.classList.remove('rex3d-ready');}
})();
