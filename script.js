const c=document.getElementById("garden"),x=c.getContext("2d",{alpha:false});
let W=0,H=0,D=1,t=0,last=performance.now(),lastDraw=0,nextAuto=0;
const F=[],P=[],S=[];
const R=(a,b)=>Math.random()*(b-a)+a,C=(v,a,b)=>Math.max(a,Math.min(b,v));
let mobile=false,targetFrame=1000/45,bg=null;

function resize(){
  W=innerWidth;H=innerHeight;mobile=W<700;
  D=Math.min(devicePixelRatio||1,mobile?1:1.25);
  c.width=Math.floor(W*D);c.height=Math.floor(H*D);
  c.style.width=W+"px";c.style.height=H+"px";
  x.setTransform(D,0,0,D,0,0);
  targetFrame=1000/(mobile?36:45);
  makeBackground();stars();seed();
}
function makeBackground(){
  bg=document.createElement("canvas");bg.width=Math.max(1,Math.floor(W*D));bg.height=Math.max(1,Math.floor(H*D));
  const b=bg.getContext("2d");b.setTransform(D,0,0,D,0,0);
  b.fillStyle="#030003";b.fillRect(0,0,W,H);
  const g=b.createRadialGradient(W*.5,H*.72,0,W*.5,H*.72,H*.78);
  g.addColorStop(0,"rgba(135,5,40,.23)");g.addColorStop(.5,"rgba(70,0,25,.09)");g.addColorStop(1,"rgba(0,0,0,0)");
  b.fillStyle=g;b.fillRect(0,0,W,H);
}
function stars(){
  S.length=0;let n=C(Math.floor(W*H/25000),18,45);
  while(n--)S.push({x:R(0,W),y:R(H*.16,H),r:R(.45,1.2),p:R(0,6.28)});
}
function flower(px,gy,sc=R(.75,1.1),delay=0){
  F.push({x:px,y:gy,s:sc,d:delay,a:0,h:R(334,352),n:Math.floor(R(7,10)),ph:R(0,6.28),sw:R(2,6),burst:false});
  const cap=mobile?34:46;if(F.length>cap)F.shift();
}
function seed(){
  F.length=0;
  const layers=mobile?
    [{n:7,y1:.27,y2:.53,s1:.72,s2:.94},{n:8,y1:.46,y2:.74,s1:.78,s2:1.02},{n:10,y1:.66,y2:.98,s1:.88,s2:1.14}]:
    [{n:10,y1:.24,y2:.52,s1:.72,s2:.98},{n:12,y1:.43,y2:.73,s1:.80,s2:1.08},{n:15,y1:.64,y2:.98,s1:.90,s2:1.20}];
  layers.forEach((L,li)=>{
    for(let i=0;i<L.n;i++){
      const band=(i+.5)/L.n;
      flower(C(W*band+R(-W/L.n*.28,W/L.n*.28),20,W-20),R(H*L.y1,H*L.y2),R(L.s1,L.s2),i*.08+li*.16+R(0,.3));
    }
  });
}
function stem(f,g){
  const h=C(135*f.s*g,58,165),sw=Math.sin(t*.72+f.ph)*f.sw;
  x.save();x.translate(f.x,f.y);x.scale(f.s,f.s);
  x.strokeStyle="rgba(63,122,69,.78)";x.lineWidth=1.8;x.lineCap="round";
  x.beginPath();x.moveTo(0,0);x.bezierCurveTo(sw*.15,-h*.3,sw,-h*.67,sw*.55,-h);x.stroke();
  if(g>.3){
    const q=C((g-.3)/.7,0,1);
    [-1,1].forEach((side,j)=>{
      x.save();x.translate(sw*.25,-h*(j?.63:.43));x.rotate(side*.62);
      x.globalAlpha=.64*q;x.fillStyle="#397846";x.beginPath();x.ellipse(9,0,14*q,4.5*q,0,0,6.283);x.fill();x.restore();
    });
  }
  x.restore();return{x:f.x+sw*.55*f.s,y:f.y-h*f.s};
}
function head(f,p,b){
  x.save();x.translate(p.x,p.y);x.scale(f.s,f.s);
  const L=30*b,w=11*b;
  // No shadowBlur per petal: major performance saving.
  for(let layer=0;layer<2;layer++){
    const n=f.n+(layer?2:0);
    for(let i=0;i<n;i++){
      x.save();x.rotate(i*6.283/n+(layer?.18:0));
      x.fillStyle=`hsla(${f.h+(layer?5:0)},90%,${layer?67:74}%,${layer?.62:.9})`;
      x.beginPath();x.ellipse(0,-L*(layer?.42:.58),w*(layer?.74:1),L*(layer?.70:1),0,0,6.283);x.fill();x.restore();
    }
  }
  x.fillStyle="#ffd36b";x.beginPath();x.arc(0,0,5.2,0,6.283);x.fill();x.restore();
}
function burst(px,py){
  const count=mobile?4:6;
  for(let i=0;i<count;i++){
    const a=R(0,6.283),s=R(12,42);
    P.push({x:px,y:py,vx:Math.cos(a)*s,vy:Math.sin(a)*s-16,l:1,z:R(1,2.5),heart:Math.random()<.18});
  }
  const cap=mobile?60:90;if(P.length>cap)P.splice(0,P.length-cap);
}
function heart(p){
  const s=p.z*1.5;x.save();x.translate(p.x,p.y);x.globalAlpha=p.l;x.fillStyle="#ff6ea9";
  x.beginPath();x.moveTo(0,s);x.bezierCurveTo(-s*1.4,0,-s,-s,0,-s*.3);x.bezierCurveTo(s,-s,s*1.4,0,0,s);x.fill();x.restore();
}
function frame(now){
  requestAnimationFrame(frame);
  if(document.hidden)return;
  if(now-lastDraw<targetFrame)return;
  const dt=Math.min((now-last)/1000,.05);last=now;lastDraw=now;t+=dt;

  if(bg)x.drawImage(bg,0,0,W,H);
  for(const s of S){
    x.globalAlpha=.13+Math.sin(t*.25+s.p)*.07;x.fillStyle="#ff9fc8";
    x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fill();
  }x.globalAlpha=1;

  for(const f of F){
    f.a+=dt;if(f.a<f.d)continue;
    const local=f.a-f.d,grow=1-Math.exp(-local*1.12),p=stem(f,grow),b=C((grow-.48)/.52,0,1);
    if(b>0){head(f,p,b);if(!f.burst&&b>.55){burst(p.x,p.y);f.burst=true}}
  }
  for(let i=P.length-1;i>=0;i--){
    const p=P[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy-=1.5*dt;p.vx*=.99;p.l-=dt*.55;
    if(p.heart)heart(p);else{x.globalAlpha=p.l;x.fillStyle="#ff78b1";x.beginPath();x.arc(p.x,p.y,p.z,0,6.283);x.fill();x.globalAlpha=1}
    if(p.l<=0)P.splice(i,1);
  }
  if(t>nextAuto){
    flower(R(W*.04,W*.96),R(H*.27,H*.98),R(.78,1.16),0);
    nextAuto=t+R(2.2,3.5);
  }
}
c.addEventListener("pointerdown",e=>flower(e.clientX,C(e.clientY+R(40,90),H*.23,H*.99),R(.82,1.18),0));

function open(id){
  const e=document.getElementById(id);
  e.classList.remove("open"); void e.offsetWidth;
  e.classList.add("open");e.setAttribute("aria-hidden","false");
}
function close(id){const e=document.getElementById(id);e.classList.remove("open");e.setAttribute("aria-hidden","true")}
/* =====================================================
   CINEMATIC PAGE NAVIGATION
===================================================== */

const pageTransition = document.getElementById("pageTransition");

let transitionRunning = false;


/*
   Generic cinematic transition

   currentPage = page currently visible
   changePage  = function that opens/closes the next page
   nextPage    = page that should animate in
*/

function cinematicTransition(currentPage, changePage, nextPage) {

  if (transitionRunning) return;

  transitionRunning = true;


  /* Animate current page away */

  if (currentPage) {
    currentPage.classList.add("transition-page-out");
  }


  /* Bring cinematic overlay in */

  if (pageTransition) {

    pageTransition.classList.remove("active");

    void pageTransition.offsetWidth;

    pageTransition.classList.add("active");
  }


  /*
     Switch pages while screen is covered
  */

  setTimeout(() => {

    if (currentPage) {
      currentPage.classList.remove("transition-page-out");
    }

    changePage();


    /*
       Animate new page in
    */

    if (nextPage) {

      nextPage.classList.remove("transition-page-in");

      void nextPage.offsetWidth;

      nextPage.classList.add("transition-page-in");

    }

  }, 650);


  /*
     Clean animation classes
  */

  setTimeout(() => {

    if (nextPage) {
      nextPage.classList.remove("transition-page-in");
    }

    if (pageTransition) {
      pageTransition.classList.remove("active");
    }

    transitionRunning = false;

  }, 1900);

}


/* =====================================================
   FOR YOU → LOVE LETTER
===================================================== */

document.getElementById("letterBtn").onclick = () => {

  const app = document.getElementById("app");
  const letter = document.getElementById("letter");

  cinematicTransition(

    app,

    () => {
      open("letter");
    },

    letter

  );

};


/* =====================================================
   CLOSE LOVE LETTER → FOR YOU
===================================================== */

document.querySelector('[data-close="letter"]').onclick = () => {

  const letter = document.getElementById("letter");
  const app = document.getElementById("app");

  cinematicTransition(

    letter,

    () => {
      close("letter");
    },

    app

  );

};


/* =====================================================
   LOVE LETTER → MEMORIES
===================================================== */

document.getElementById("memoriesBtn").onclick = () => {

  const letter = document.getElementById("letter");
  const memories = document.getElementById("memories");

  cinematicTransition(

    letter,

    () => {

      close("letter");
      open("memories");

      /*
         Start memories from the top
      */

      memories.scrollTop = 0;

    },

    memories

  );

};


/* =====================================================
   CLOSE MEMORIES → FOR YOU
===================================================== */

document.querySelector('[data-close="memories"]').onclick = () => {

  const memories = document.getElementById("memories");
  const app = document.getElementById("app");

  cinematicTransition(

    memories,

    () => {
      close("memories");
    },

    app

  );

};


/* =====================================================
   V15 — SECRET NOTE + FINALE + BLOOM AGAIN
===================================================== */

// V16 — five hidden “Reasons I Love You” hearts.
document.querySelectorAll(".reason-heart").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const note=btn.nextElementSibling;
    if(!note || !note.classList.contains("reason-note")) return;
    const shown=note.classList.toggle("show");
    btn.classList.toggle("revealed",shown);
    btn.setAttribute("aria-expanded",String(shown));
    note.setAttribute("aria-hidden",String(!shown));
  });
});

const oneLastThingBtn=document.getElementById("oneLastThingBtn");
const foreverFinale=document.getElementById("foreverFinale");
const kissBtn=document.getElementById("kissBtn");
const kissSurprise=document.getElementById("kissSurprise");
const homeBtn=document.getElementById("homeBtn");

if(oneLastThingBtn && foreverFinale){
  oneLastThingBtn.addEventListener("click",()=>{
    const memories=document.getElementById("memories");
    cinematicTransition(memories,()=>{
      close("memories");
      foreverFinale.classList.add("open");
      foreverFinale.setAttribute("aria-hidden","false");
      foreverFinale.scrollTop=0;
    },foreverFinale);
  });
}

if(kissBtn && kissSurprise){
  kissBtn.addEventListener("click",()=>{
    kissBtn.disabled=true;
    kissBtn.textContent="For you 😘";
    kissSurprise.classList.add("show");
    kissSurprise.setAttribute("aria-hidden","false");
    if(homeBtn)homeBtn.classList.add("ready");
    if(nextChapterBtn)nextChapterBtn.classList.add("ready");
  });
}

/* =====================================================
   V17 — HOLD TO REVEAL • OPEN WHEN • CHAPTER 4
===================================================== */
const holdLoveBtn=document.getElementById("holdLoveBtn");
const holdLoveReveal=document.getElementById("holdLoveReveal");
let holdTimer=null,holdDone=false;
if(holdLoveBtn && holdLoveReveal){
  const startHold=e=>{
    if(holdDone)return;
    if(e && e.cancelable)e.preventDefault();
    holdLoveBtn.classList.add("holding");
    clearTimeout(holdTimer);
    holdTimer=setTimeout(()=>{
      holdDone=true;holdLoveBtn.classList.remove("holding");
      holdLoveBtn.querySelector(".hold-label").textContent="Forever held ❤️";
      holdLoveReveal.classList.add("show");
      holdLoveReveal.setAttribute("aria-hidden","false");
    },2000);
  };
  const cancelHold=()=>{if(holdDone)return;clearTimeout(holdTimer);holdLoveBtn.classList.remove("holding")};
  holdLoveBtn.addEventListener("pointerdown",startHold);
  holdLoveBtn.addEventListener("pointerup",cancelHold);
  holdLoveBtn.addEventListener("pointercancel",cancelHold);
  holdLoveBtn.addEventListener("pointerleave",cancelHold);
}

const missMeBtn=document.getElementById("missMeBtn");
const missMeNote=document.getElementById("missMeNote");
if(missMeBtn && missMeNote){
  missMeBtn.addEventListener("click",()=>{
    const shown=missMeNote.classList.toggle("open");
    missMeBtn.setAttribute("aria-expanded",String(shown));
    missMeNote.setAttribute("aria-hidden",String(!shown));
  });
}

const nextChapterBtn=document.getElementById("nextChapterBtn");
const chapterFour=document.getElementById("chapterFour");
const chapterBloomBtn=document.getElementById("chapterBloomBtn");
if(nextChapterBtn && chapterFour){
  nextChapterBtn.addEventListener("click",()=>{
    cinematicTransition(foreverFinale,()=>{
      foreverFinale.classList.remove("open");
      foreverFinale.setAttribute("aria-hidden","true");
      chapterFour.classList.add("open");
      chapterFour.setAttribute("aria-hidden","false");
    },chapterFour);
  });
}
if(chapterBloomBtn && chapterFour){
  chapterBloomBtn.addEventListener("click",()=>{
    cinematicTransition(chapterFour,()=>{
      chapterFour.classList.remove("open");
      chapterFour.setAttribute("aria-hidden","true");
      window.scrollTo({top:0,behavior:"auto"});
    },document.getElementById("app"));
  });
}

if(homeBtn){
  homeBtn.onclick=()=>{
    cinematicTransition(foreverFinale,()=>{
      foreverFinale.classList.remove("open");
      foreverFinale.setAttribute("aria-hidden","true");
      window.scrollTo({top:0,behavior:"auto"});
    },document.getElementById("app"));
  };
}

addEventListener("resize",resize);
document.addEventListener("visibilitychange",()=>{last=performance.now();lastDraw=0});
resize();requestAnimationFrame(frame);


// V13 — background music.
// Mobile browsers require a user gesture before audible playback.
// The first tap/click on the Blossom page attempts playback; the floating button
// always lets the visitor play/pause explicitly.
const bgMusic=document.getElementById("bgMusic");
const musicBtn=document.getElementById("musicBtn");
const musicLabel=musicBtn.querySelector(".music-label");
let musicStarted=false,fadeTimer=null;
bgMusic.volume=0;

function setMusicUI(playing){
  musicBtn.classList.toggle("playing",playing);
  musicBtn.setAttribute("aria-label",playing?"Pause background music":"Play background music");
  musicLabel.textContent=playing?"Pause music":"Play music";
}
function fadeMusic(target=.34,duration=1600){
  clearInterval(fadeTimer);
  const start=bgMusic.volume,startAt=performance.now();
  fadeTimer=setInterval(()=>{
    const p=Math.min(1,(performance.now()-startAt)/duration);
    bgMusic.volume=start+(target-start)*p;
    if(p>=1)clearInterval(fadeTimer);
  },50);
}
async function startMusic(){
  if(!bgMusic.paused){setMusicUI(true);return}
  try{
    await bgMusic.play();
    musicStarted=true;
    fadeMusic(.34,1600);
    setMusicUI(true);
  }catch(_){ setMusicUI(false); }
}
function pauseMusic(){
  clearInterval(fadeTimer);
  bgMusic.pause();
  setMusicUI(false);
}
musicBtn.addEventListener("click",e=>{
  e.stopPropagation();
  bgMusic.paused?startMusic():pauseMusic();
});
document.addEventListener("pointerdown",()=>{
  if(!musicStarted&&bgMusic.paused)startMusic();
},{once:true});
bgMusic.addEventListener("play",()=>setMusicUI(true));
bgMusic.addEventListener("pause",()=>setMusicUI(false));


/* =====================================================
   ANNIVERSARY INTRO → FOR YOU
===================================================== */

const anniversaryIntro =
    document.getElementById("anniversaryIntro");

const beginStoryBtn =
    document.getElementById("beginStoryBtn");


if (anniversaryIntro && beginStoryBtn) {

    beginStoryBtn.addEventListener("click", async () => {

        /* Prevent double-clicking */
        beginStoryBtn.disabled = true;


        /* -----------------------------------------
           START MUSIC
        ----------------------------------------- */

        const bgMusic =
            document.getElementById("bgMusic");

        if (bgMusic) {

            try {

                bgMusic.volume = 0.35;

                await bgMusic.play();

            } catch (error) {

                console.log(
                    "Browser blocked audio temporarily."
                );

            }

        }


        /* -----------------------------------------
           PHASE 1
           Anniversary page begins disappearing
        ----------------------------------------- */

        anniversaryIntro.classList.add("leaving");


        /* -----------------------------------------
           PHASE 2
           Start revealing For You
        ----------------------------------------- */

        setTimeout(() => {

            document.body.classList.remove(
                "anniversary-active"
            );

            document.body.classList.add(
                "story-entering"
            );

        }, 1050);


        /* -----------------------------------------
           PHASE 3
           Remove anniversary overlay
        ----------------------------------------- */

        setTimeout(() => {

            anniversaryIntro.remove();

        }, 1850);


        /* -----------------------------------------
           PHASE 4
           Finish transition
        ----------------------------------------- */

        setTimeout(() => {

            document.body.classList.remove(
                "story-entering"
            );

            window.scrollTo(0, 0);

        }, 3300);

    });

}

/* =====================================================
   V16 — LIVE RELATIONSHIP COUNTER • 16 OCTOBER 2023
===================================================== */
(function relationshipCounter(){
  const timeEl=document.getElementById("relationshipTime");
  const daysEl=document.getElementById("relationshipDays");
  if(!timeEl || !daysEl) return;

  const start=new Date(2023,9,16); // month is zero-based: 9 = October
  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  if(today < start){
    timeEl.textContent="Our story begins on 16 October 2023 ♡";
    daysEl.textContent="";
    return;
  }

  let years=today.getFullYear()-start.getFullYear();
  let months=today.getMonth()-start.getMonth();
  let days=today.getDate()-start.getDate();
  if(days<0){
    months--;
    const prevMonthDays=new Date(today.getFullYear(),today.getMonth(),0).getDate();
    days+=prevMonthDays;
  }
  if(months<0){ years--; months+=12; }

  const totalDays=Math.floor((today-start)/86400000);
  const parts=[];
  if(years) parts.push(`${years} ${years===1?"year":"years"}`);
  if(months) parts.push(`${months} ${months===1?"month":"months"}`);
  if(days || !parts.length) parts.push(`${days} ${days===1?"day":"days"}`);
  timeEl.textContent=parts.join(" • ")+" together";
  daysEl.textContent=`${totalDays.toLocaleString()} days of us ♡`;
})();
