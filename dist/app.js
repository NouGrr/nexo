'use strict';
const apps=[{id:'pixo',name:'Pixo',icon:'✦',description:'Retouche photo simplifiée',keywords:'image photo retoucher recadrer convertir',url:'https://nougrr.github.io/pixo-editor/'},{id:'doxo',name:'Doxo',icon:'▤',description:'Modification de PDF',keywords:'document pdf modifier annoter organiser',url:'https://nougrr.github.io/doxo/'},{id:'vixo',name:'Vixo',icon:'▷',description:'Montage vidéo simplifié',keywords:'video vidéo montage couper audio gif exporter',url:'https://nougrr.github.io/vixo-editor/'}];
const $=s=>document.querySelector(s);
const storage={get(key){try{return localStorage.getItem('nexo-'+key)}catch{return null}},set(key,value){try{localStorage.setItem('nexo-'+key,value)}catch{}}};
const letters={N:['10001','11001','11001','10101','10011','10011','10001'],E:['11111','10000','10000','11110','10000','10000','11111'],X:['10001','10001','01010','00100','01010','10001','10001'],O:['01110','10001','10001','10001','10001','10001','01110']};
const ns='http://www.w3.org/2000/svg';
'NEXO'.split('').forEach((l,i)=>letters[l].forEach((row,y)=>row.split('').forEach((on,x)=>{const circle=document.createElementNS(ns,'circle');circle.setAttribute('cx',14+i*82+x*13);circle.setAttribute('cy',7+y*9);circle.setAttribute('r','3');circle.setAttribute('class',on==='1'?'logo-dot':'logo-grid');circle.setAttribute('fill',on==='1'?'#d8c9f0':'#ffffff07');$('#dot-logo').appendChild(circle)})));
function updateTheme(light){document.body.classList.toggle('light',light);$('#theme').setAttribute('aria-label',light?'Activer le thème sombre':'Activer le thème clair');document.querySelector('meta[name="theme-color"]').content=light?'#f1f0ec':'#101116';storage.set('theme',light?'light':'dark')}
updateTheme(storage.get('theme')==='light');$('#theme').addEventListener('click',()=>updateTheme(!document.body.classList.contains('light')));
function remember(app){storage.set('recent',app.id);showRecent(app)}
function showRecent(app){if(!app)return;$('#recent').hidden=false;$('#recent-link').href=app.url;$('#recent-name').textContent=app.name;$('#recent-link').dataset.app=app.id}
showRecent(apps.find(a=>a.id===storage.get('recent')));
document.addEventListener('click',e=>{const link=e.target.closest('a[data-app]');if(link){const app=apps.find(a=>a.id===link.dataset.app);if(app)remember(app)}});
const dialog=$('#search-dialog'),input=$('#search-input');let selected=0;let filtered=apps;
function renderResults(){const query=input.value.trim().toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');filtered=apps.filter(a=>(a.name+' '+a.keywords).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(query));selected=Math.min(selected,Math.max(0,filtered.length-1));const results=$('#search-results');results.replaceChildren();filtered.forEach((app,i)=>{const link=document.createElement('a');link.href=app.url;link.target='_blank';link.rel='noopener noreferrer';link.dataset.app=app.id;link.classList.toggle('selected',i===selected);const icon=document.createElement('span');icon.textContent=app.icon;const label=document.createElement('div');const name=document.createElement('strong');name.textContent=app.name;const description=document.createElement('small');description.textContent=app.description;label.append(name,description);const arrow=document.createElement('span');arrow.textContent='↗';link.append(icon,label,arrow);link.addEventListener('click',()=>dialog.close());results.appendChild(link)});$('#no-results').hidden=filtered.length>0}
function openSearch(){selected=0;input.value='';renderResults();dialog.showModal();input.focus()}
$('#search-open').addEventListener('click',openSearch);$('#search-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});input.addEventListener('input',()=>{selected=0;renderResults()});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();selected=(selected+(e.key==='ArrowDown'?1:-1)+filtered.length)%Math.max(1,filtered.length);renderResults()}if(e.key==='Enter'&&e.target===input&&filtered[selected]){e.preventDefault();$('#search-results').children[selected].click()}});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(dialog.open)dialog.close();else openSearch();return}if(dialog.open||e.metaKey||e.ctrlKey||e.altKey||e.target.closest('input,textarea,[contenteditable]'))return;const index=['1','2','3'].indexOf(e.key);if(index>=0){e.preventDefault();document.querySelector('[data-app="'+apps[index].id+'"]').click()}});
$('#back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));

// Native scrolling drives the scene; wheel, touch and keyboard keep their usual behavior.
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const intro=$('.hero'),introStage=$('.hero-stage'),logo=$('.core'),introCopy=$('.hero-copy');
const chapters=[intro,$('#applications'),$('#philosophie')];
const chapterLinks=[...document.querySelectorAll('.chapter-nav a')];
const reveals=[...document.querySelectorAll('.section-heading,.app-card,.philosophy-title,.principles article')];
let framePending=false;
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
function updateScrollScene(){
  framePending=false;
  const viewport=window.innerHeight;
  const introRect=intro.getBoundingClientRect();
  const progress=clamp(-introRect.top/Math.max(1,intro.offsetHeight-introStage.offsetHeight));
  const reduced=motionPreference.matches;
  document.body.classList.toggle('motion-ready',!reduced);
  logo.style.transform=reduced?'':`translate(-50%,-50%) rotateY(${progress*360}deg) rotateZ(${Math.sin(progress*Math.PI)*-8}deg)`;
  introCopy.style.translate=reduced?'':`0 ${-progress*32}px`;
  introCopy.style.opacity=reduced?'':String(1-progress*.45);
  for(const element of reveals){
    const rect=element.getBoundingClientRect();
    const index=element.classList.contains('app-card')?[...element.parentElement.children].indexOf(element):0;
    const stagger=window.innerWidth>760?index*35:0;
    const value=clamp((viewport*.94-rect.top-stagger)/Math.min(230,viewport*.3));
    // Keep focused links readable even if reached by keyboard before scrolling settles.
    element.style.setProperty('--reveal',reduced||element.contains(document.activeElement)?'1':value.toFixed(3));
  }
  let active=0;
  chapters.forEach((chapter,index)=>{if(chapter.getBoundingClientRect().top<=viewport*.45)active=index});
  chapterLinks.forEach((link,index)=>{if(index===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
}
function requestScrollScene(){if(!framePending){framePending=true;requestAnimationFrame(updateScrollScene)}}
addEventListener('scroll',requestScrollScene,{passive:true});
addEventListener('resize',requestScrollScene);
addEventListener('focusin',requestScrollScene);
motionPreference.addEventListener('change',requestScrollScene);
updateScrollScene();
