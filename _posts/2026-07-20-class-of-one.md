---
layout: post
title: "Class of One: Podcast feed from NotebookLM summaries"
date: "2026-07-20"
categories: Podcast
---

Podcasts are a good first pass to get oriented on a topic. I can convert some of my technical reading goals into podcasts then I can grok them better when I decide to go deeper into it.

Google's NotebookLM (Gemini Notebook now), has an Audio Overviews feature that turns a pile of source material into a two-host, podcast-style conversation. That solved the content half of the problem. What it didn't give me was a way to get that audio into my podcast app, sitting next to everything else I already listen to.

So I built a small pipeline: upload the generated audio to a public store via webapp, turn that into a podcast RSS feed, and subscribe to it in Pocket Casts like any other show. I call it **Class of One**, since I am the only audience.

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Permanent+Marker&display=swap" rel="stylesheet">
<style>
  .flow-diagram, .arch-diagram{
    --paper:#F6F1E3;
    --ink:#2c3c66;
    --ink-title:#16213f;
    --red:#b23b32;
  }
  html[data-theme="dark"] .flow-diagram,
  html[data-theme="dark"] .arch-diagram{
    --paper:#242424;
    --ink:#b9c6e6;
    --ink-title:#e7ecfa;
    --red:#e0574a;
  }
  .flow-diagram{
    font-family:'Caveat',cursive;
    color:var(--ink);
  }
  .flow-diagram *{box-sizing:border-box;}
  .flow-diagram .page{
    position:relative;
    width:100%;
    max-width:1100px;
    margin:0 auto;
    background:transparent;
    padding:20px 24px 24px;
  }
  .flow-diagram .stage{position:relative;z-index:3;margin-top:14px;}
  .flow-diagram .flow{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:0;
    align-items:start;
    position:relative;
  }
  .flow-diagram .step{
    position:relative;
    display:flex;flex-direction:column;align-items:center;
    padding:6px 8px 4px;
    text-align:center;
  }
  .flow-diagram .disc{
    position:relative;
    width:clamp(96px,15vw,148px);
    height:clamp(96px,15vw,148px);
    display:flex;align-items:center;justify-content:center;
  }
  .flow-diagram .disc svg{width:100%;height:100%;overflow:visible;}
  .flow-diagram .badge{
    position:absolute;top:-6px;left:50%;transform:translateX(-135%) rotate(-8deg);
    font-family:'Permanent Marker';color:var(--red);font-size:1.15rem;
    background:var(--paper);border:2px solid var(--red);border-radius:50%;
    width:34px;height:34px;display:flex;align-items:center;justify-content:center;
    line-height:1;z-index:4;box-shadow:1px 1px 0 rgba(178,59,50,.25);
  }
  .flow-diagram .step-label{font-family:'Permanent Marker';font-size:clamp(.85rem,1.7vw,1.05rem);
    color:var(--ink-title);margin-top:6px;line-height:1.05;max-width:170px;}
  .flow-diagram .step-note{font-size:1.15rem;color:var(--ink);opacity:.8;margin-top:1px;line-height:1;}
  .flow-diagram .connectors{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;}
  @media (max-width:760px){
    .flow-diagram .page{padding:16px 14px 20px;}
    .flow-diagram .flow{grid-template-columns:1fr 1fr;row-gap:30px;column-gap:8px;}
    .flow-diagram .connectors{display:none;}
    .flow-diagram .step-label{max-width:150px;}
  }
  .arch-diagram{
    font-family:'Caveat',cursive;
    color:var(--ink);
  }
  .arch-diagram *{box-sizing:border-box;}
  .arch-diagram .page{
    position:relative;
    width:100%;
    max-width:1080px;
    margin:0 auto;
    padding:26px 24px;
  }
  .arch-diagram .arch{
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:clamp(52px,8vw,104px);
  }
  .arch-diagram .overlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:visible;}
  .arch-diagram .gate{
    position:relative;
    z-index:1;
    padding:16px 26px 22px;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:10px;
  }
  .arch-diagram .gate-head{display:flex;align-items:center;gap:9px;}
  .arch-diagram .gate-head svg{width:30px;height:30px;overflow:visible;flex:0 0 auto;}
  .arch-diagram .gate-title{font-family:'Permanent Marker',cursive;font-weight:400;color:var(--red);
    font-size:clamp(1rem,2vw,1.3rem);line-height:1;letter-spacing:.3px;}
  .arch-diagram .gate-sub{font-family:'Caveat';font-size:1.15rem;color:var(--ink);opacity:.72;margin-top:-4px;}
  .arch-diagram .gate-body{
    display:flex;align-items:center;justify-content:center;
    gap:clamp(46px,6vw,86px);
  }
  .arch-diagram .node{display:flex;flex-direction:column;align-items:center;text-align:center;z-index:1;}
  .arch-diagram .node .icon{width:clamp(78px,11vw,104px);height:clamp(70px,10vw,92px);display:flex;align-items:center;justify-content:center;}
  .arch-diagram .node .icon svg{width:100%;height:100%;overflow:visible;}
  .arch-diagram .node .name{font-family:'Permanent Marker';font-weight:400;color:var(--ink-title);
    font-size:clamp(.82rem,1.5vw,1rem);line-height:1.05;margin-top:7px;}
  .arch-diagram .node .meta{font-family:'Caveat';font-size:1.15rem;color:var(--ink);opacity:.78;line-height:1;margin-top:1px;}
  .arch-diagram .store{display:flex;flex-direction:column;align-items:center;text-align:center;z-index:1;}
  .arch-diagram .store .icon{width:clamp(96px,13vw,128px);height:clamp(96px,13vw,128px);display:flex;align-items:center;justify-content:center;}
  .arch-diagram .store .icon svg{width:100%;height:100%;overflow:visible;}
  .arch-diagram .store .name{font-family:'Permanent Marker';color:var(--ink-title);font-weight:400;
    font-size:clamp(.9rem,1.7vw,1.12rem);margin-top:6px;line-height:1;}
  .arch-diagram .store .files{font-family:'Caveat';font-size:1.18rem;color:var(--ink);opacity:.8;
    margin-top:3px;line-height:1.15;max-width:180px;}
  .arch-diagram .store .files .dot{color:var(--red);}
  @media (max-width:720px){
    .arch-diagram .page{padding:20px 14px;}
    .arch-diagram .arch{flex-direction:column;gap:clamp(52px,12vw,84px);}
  }
  @media (max-width:430px){
    .arch-diagram .gate-body{flex-direction:column;gap:52px;}
  }
</style>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <filter id="rough" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="7" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="rough2" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="19" result="n2"/>
      <feDisplacementMap in="SourceGraphic" in2="n2" scale="3.5"/>
    </filter>
  </defs>
</svg>
<div class="flow-diagram">
  <div class="page">
    <div class="stage">
      <div class="flow" id="flow">
        <svg class="connectors" id="connectors" preserveAspectRatio="none"></svg>
        <div class="step" data-step="0">
          <div class="disc">
            <span class="badge">1</span>
            <svg viewBox="0 0 120 120">
              <g filter="url(#rough)" fill="none" stroke="var(--ink)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="60" cy="60" r="52" stroke-dasharray="1 0" opacity="0.9"/>
                <rect x="49" y="28" width="22" height="40" rx="11" fill="var(--paper)"/>
                <path d="M42 56 a18 18 0 0 0 36 0"/>
                <line x1="60" y1="74" x2="60" y2="86"/>
                <line x1="49" y1="86" x2="71" y2="86"/>
                <path d="M84 44 q7 16 0 32" stroke="var(--red)" stroke-width="3.4"/>
                <path d="M92 38 q11 22 0 44" stroke-width="3"/>
              </g>
            </svg>
          </div>
          <div class="step-label">Generate audio</div>
          <div class="step-note">Gemini Notebook</div>
        </div>
        <div class="step" data-step="1">
          <div class="disc">
            <span class="badge">2</span>
            <svg viewBox="0 0 120 120">
              <g filter="url(#rough)" fill="none" stroke="var(--ink)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="60" cy="60" r="52"/>
                <rect x="34" y="38" width="52" height="44" rx="6" fill="var(--paper)"/>
                <line x1="34" y1="50" x2="86" y2="50"/>
                <circle cx="41" cy="44" r="2"/><circle cx="48" cy="44" r="2"/><circle cx="55" cy="44" r="2"/>
                <line x1="60" y1="74" x2="60" y2="56"/>
                <path d="M52 63 l8 -8 l8 8"/>
                <line x1="47" y1="76" x2="73" y2="76"/>
              </g>
            </svg>
          </div>
          <div class="step-label">Upload</div>
          <div class="step-note">via the webapp</div>
        </div>
        <div class="step" data-step="2">
          <div class="disc">
            <span class="badge">3</span>
            <svg viewBox="0 0 120 120">
              <g filter="url(#rough)" fill="none" stroke="var(--ink)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="60" cy="60" r="52"/>
                <ellipse cx="60" cy="42" rx="20" ry="7" fill="var(--paper)"/>
                <path d="M40 42 v22 a20 7 0 0 0 40 0 v-22"/>
                <path d="M40 53 a20 7 0 0 0 40 0"/>
                <path d="M50 78 a14 14 0 0 1 14 14" stroke="var(--red)" stroke-width="3.6"/>
                <path d="M50 70 a22 22 0 0 1 22 22" stroke-width="3"/>
                <circle cx="50" cy="90" r="2.6" fill="var(--red)" stroke="none"/>
              </g>
            </svg>
          </div>
          <div class="step-label">RSS rebuilds</div>
          <div class="step-note">in the background</div>
        </div>
        <div class="step" data-step="3">
          <div class="disc">
            <span class="badge">4</span>
            <svg viewBox="0 0 120 120">
              <g filter="url(#rough)" fill="none" stroke="var(--ink)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="60" cy="60" r="52"/>
                <path d="M38 66 v-6 a22 22 0 0 1 44 0 v6"/>
                <rect x="34" y="64" width="12" height="20" rx="5" fill="var(--paper)"/>
                <rect x="74" y="64" width="12" height="20" rx="5" fill="var(--paper)"/>
                <path d="M70 40 a12 12 0 1 0 4 9" stroke="var(--red)" stroke-width="3.4"/>
                <path d="M74 34 l1 9 l-9 -2" stroke="var(--red)" stroke-width="3.4"/>
              </g>
            </svg>
          </div>
          <div class="step-label">Refresh</div>
          <div class="step-note">Pocket Casts</div>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
(function(){
  const stepEls = Array.from(document.querySelectorAll('.flow-diagram .step'));
  const discEls = stepEls.map(el => el.querySelector('.disc'));
  const svg = document.querySelector('.flow-diagram #connectors');
  const NS = "http://www.w3.org/2000/svg";
  const INK = getComputedStyle(document.querySelector('.flow-diagram')).getPropertyValue('--ink').trim();
  function pathBetween(x1,y1,x2,y2){
    const mx = (x1+x2)/2;
    const dip = 10 + Math.sin(x1)*4;
    return `M ${x1} ${y1} C ${mx} ${y1+dip}, ${mx} ${y2+dip}, ${x2} ${y2}`;
  }
  function drawConnectors(){
    const flow = document.querySelector('.flow-diagram #flow');
    if(!flow) return;
    const fRect = flow.getBoundingClientRect();
    if(!fRect.width) return;
    svg.setAttribute('viewBox', `0 0 ${fRect.width} ${fRect.height}`);
    svg.innerHTML = '';
    const discs = discEls.map(el=>el.getBoundingClientRect());
    for(let i=0;i<discs.length-1;i++){
      const a = discs[i], b = discs[i+1];
      if(Math.abs(a.top - b.top) > 8) continue;
      const x1 = a.right - fRect.left - 6;
      const y1 = a.top + a.height/2 - fRect.top;
      const x2 = b.left - fRect.left + 6;
      const y2 = b.top + b.height/2 - fRect.top;
      const p = document.createElementNS(NS,'path');
      p.setAttribute('d', pathBetween(x1,y1,x2,y2));
      p.setAttribute('fill','none');
      p.setAttribute('stroke', INK);
      p.setAttribute('stroke-width','2.6');
      p.setAttribute('stroke-linecap','round');
      p.setAttribute('stroke-dasharray','3 12');
      p.setAttribute('filter','url(#rough2)');
      p.setAttribute('opacity','0.85');
      svg.appendChild(p);
      const ah = document.createElementNS(NS,'path');
      ah.setAttribute('d', `M ${x2-9} ${y2-6} L ${x2} ${y2} L ${x2-9} ${y2+6}`);
      ah.setAttribute('fill','none');
      ah.setAttribute('stroke', INK);
      ah.setAttribute('stroke-width','2.6');
      ah.setAttribute('stroke-linecap','round');
      ah.setAttribute('stroke-linejoin','round');
      ah.setAttribute('filter','url(#rough2)');
      svg.appendChild(ah);
    }
  }
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(drawConnectors); }
  window.addEventListener('load', drawConnectors);
  window.addEventListener('resize', ()=>{ clearTimeout(window.__rz); window.__rz=setTimeout(drawConnectors,150); });
  drawConnectors();
})();
</script>


## Architecture

Underneath the webapp is one [Cloudflare Pages](https://developers.cloudflare.com/pages/) project, serving both the static frontend and the upload/publish API (as [Pages Functions](https://developers.cloudflare.com/pages/functions/)). The only storage is a single (public) [R2 bucket](https://developers.cloudflare.com/r2/) (Cloudflare version of S3). It holds the audio files, the cover art, the episode list, and the generated `feed.xml`. The webapp is protected by [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/access-controls/) so that only I can upload the episodes.

<div class="arch-diagram">
  <div class="page">
    <div class="arch" id="arch">
      <svg class="overlay" id="overlay" preserveAspectRatio="none"></svg>
      <div class="gate" id="gate">
        <div class="gate-head">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <g filter="url(#rough)" fill="none" stroke="var(--red)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="18" width="22" height="17" rx="3.5" fill="var(--paper)"/>
              <path d="M13 18 v-4 a7 7 0 0 1 14 0 v4"/>
              <line x1="20" y1="24" x2="20" y2="29"/>
            </g>
          </svg>
          <span class="gate-title">Cloudflare Access</span>
        </div>
        <div class="gate-sub">one login in front of everything</div>
        <div class="gate-body">
          <div class="node" id="nodeA">
            <div class="icon">
              <svg viewBox="0 0 110 96">
                <g filter="url(#rough)" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="10" y="14" width="90" height="68" rx="8" fill="var(--paper)"/>
                  <line x1="10" y1="32" x2="100" y2="32"/>
                  <circle cx="20" cy="23" r="2.3"/><circle cx="28" cy="23" r="2.3"/><circle cx="36" cy="23" r="2.3"/>
                  <line x1="40" y1="32" x2="40" y2="82"/>
                  <line x1="52" y1="46" x2="88" y2="46"/>
                  <line x1="52" y1="58" x2="88" y2="58"/>
                  <line x1="52" y1="70" x2="74" y2="70"/>
                </g>
              </svg>
            </div>
            <div class="name">Pages</div>
            <div class="meta">dashboard</div>
          </div>
          <div class="node" id="nodeB">
            <div class="icon">
              <svg viewBox="0 0 110 96">
                <g filter="url(#rough)" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="10" y="14" width="90" height="68" rx="8" fill="var(--paper)"/>
                  <line x1="10" y1="32" x2="100" y2="32"/>
                  <circle cx="20" cy="23" r="2.3"/><circle cx="28" cy="23" r="2.3"/><circle cx="36" cy="23" r="2.3"/>
                  <path d="M44 44 l-11 12 l11 12"/>
                  <path d="M66 44 l11 12 l-11 12"/>
                  <line x1="59" y1="42" x2="51" y2="70" stroke="var(--red)" stroke-width="3.4"/>
                </g>
              </svg>
            </div>
            <div class="name">Pages Functions</div>
            <div class="meta">/api/*</div>
          </div>
        </div>
      </div>
      <div class="store" id="store">
        <div class="icon">
          <svg viewBox="0 0 120 120">
            <g filter="url(#rough)" fill="none" stroke="var(--ink)" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="60" cy="30" rx="34" ry="11" fill="var(--paper)"/>
              <path d="M26 30 v58 a34 11 0 0 0 68 0 v-58"/>
              <path d="M26 49 a34 11 0 0 0 68 0"/>
              <path d="M26 68 a34 11 0 0 0 68 0"/>
            </g>
          </svg>
        </div>
        <div class="name">R2 bucket</div>
        <div class="files">audio <span class="dot">·</span> images <span class="dot">·</span> episode list <span class="dot">·</span> feed.xml</div>
      </div>
    </div>
  </div>
</div>
<script>
(function(){
  const arch = document.getElementById('arch');
  const svg = document.getElementById('overlay');
  const gate = document.getElementById('gate');
  const nodeA = document.getElementById('nodeA');
  const nodeB = document.getElementById('nodeB');
  const store = document.getElementById('store');
  const NS = "http://www.w3.org/2000/svg";
  const wrapper = document.querySelector('.arch-diagram');
  const cs = getComputedStyle(wrapper);
  const INK = cs.getPropertyValue('--ink').trim();
  const RED = cs.getPropertyValue('--red').trim();
  function box(el, a){
    const r = el.getBoundingClientRect();
    return {
      x:r.left-a.left, y:r.top-a.top, w:r.width, h:r.height,
      right:r.right-a.left, bottom:r.bottom-a.top,
      cx:r.left-a.left+r.width/2, cy:r.top-a.top+r.height/2
    };
  }
  function path(d, stroke, dash, w){
    const p = document.createElementNS(NS,'path');
    p.setAttribute('d', d);
    p.setAttribute('fill','none');
    p.setAttribute('stroke', stroke);
    p.setAttribute('stroke-width', w);
    p.setAttribute('stroke-linecap','round');
    p.setAttribute('stroke-linejoin','round');
    if(dash) p.setAttribute('stroke-dasharray', dash);
    p.setAttribute('filter','url(#rough2)');
    svg.appendChild(p);
    return p;
  }
  function roundRect(x,y,w,h,r){
    return `M ${x+r} ${y} H ${x+w-r} Q ${x+w} ${y} ${x+w} ${y+r} V ${y+h-r} `+
           `Q ${x+w} ${y+h} ${x+w-r} ${y+h} H ${x+r} Q ${x} ${y+h} ${x} ${y+h-r} `+
           `V ${y+r} Q ${x} ${y} ${x+r} ${y} Z`;
  }
  function arrow(a, b){
    const dx = b.cx - a.cx, dy = b.cy - a.cy;
    let x1,y1,x2,y2,dir;
    if(Math.abs(dx) >= Math.abs(dy)){
      y1 = a.cy; y2 = b.cy;
      if(dx >= 0){ x1 = a.right + 3; x2 = b.x - 5; dir='r'; }
      else       { x1 = a.x - 3;     x2 = b.right + 5; dir='l'; }
    } else {
      x1 = a.cx; x2 = b.cx;
      if(dy >= 0){ y1 = a.bottom + 3; y2 = b.y - 5; dir='d'; }
      else       { y1 = a.y - 3;      y2 = b.bottom + 5; dir='u'; }
    }
    let d;
    if(dir==='r'||dir==='l'){
      const mx=(x1+x2)/2, dip=7;
      d = `M ${x1} ${y1} C ${mx} ${y1+dip}, ${mx} ${y2+dip}, ${x2} ${y2}`;
    } else {
      const my=(y1+y2)/2, dip=7;
      d = `M ${x1} ${y1} C ${x1+dip} ${my}, ${x2+dip} ${my}, ${x2} ${y2}`;
    }
    path(d, INK, '3 11', '2.7');
    let head;
    if(dir==='r') head=`M ${x2-9} ${y2-6} L ${x2} ${y2} L ${x2-9} ${y2+6}`;
    else if(dir==='l') head=`M ${x2+9} ${y2-6} L ${x2} ${y2} L ${x2+9} ${y2+6}`;
    else if(dir==='d') head=`M ${x2-6} ${y2-9} L ${x2} ${y2} L ${x2+6} ${y2-9}`;
    else head=`M ${x2-6} ${y2+9} L ${x2} ${y2} L ${x2+6} ${y2+9}`;
    path(head, INK, null, '2.7');
  }
  function draw(){
    const a = arch.getBoundingClientRect();
    if(!a.width) return;
    svg.setAttribute('viewBox', `0 0 ${a.width} ${a.height}`);
    svg.innerHTML = '';
    const g = box(gate, a);
    path(roundRect(g.x+3, g.y+3, g.w-6, g.h-6, 16), RED, '9 8', '2.6');
    arrow(box(nodeA, a), box(nodeB, a));
    arrow(g, box(store, a));
  }
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(draw); }
  window.addEventListener('load', draw);
  window.addEventListener('resize', ()=>{ clearTimeout(window.__rz); window.__rz=setTimeout(draw,150); });
  draw();
})();
</script>

No database, no separate backend process to keep running. Publishing writes straight to R2. Pocket Casts reads the feed straight from R2 (hence the bucket is public).

## The result

I wanted the webapp to feel like a school notebook. So it borrows straight from a paper metaphor with a graph-paper grid, a coral margin rule running the height of the page, and three punch-hole circles down the left edge like a ring binder. Typography carries the notebook idea further.

Here is how the webapp turned out:

{% include figure image_path="/assets/2026-07/dashboard.png" caption="The Class of One publish dashboard." %}

Add episode details, hit publish, and a few seconds later it's a new episode in Pocket Casts.

You can try the dashboard yourself at [class-of-one.vercel.app](https://class-of-one.vercel.app/). It's a demo: hitting publish just plays the animation, nothing actually gets fed anywhere.
