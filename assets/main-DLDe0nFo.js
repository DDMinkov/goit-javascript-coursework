import{a as O}from"./vendor-Dl2X3eg5.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const g of a.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&s(g)}).observe(document,{childList:!0,subtree:!0});function r(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=r(n);fetch(n.href,a)}})();function B(){const e=window.location.pathname;document.querySelectorAll(".nav-link").forEach(r=>{r.classList.remove("active");const s=r.getAttribute("href");(e.includes("favorites.html")&&s.includes("favorites.html")||(e==="/"||e.includes("index.html"))&&s.includes("index.html"))&&r.classList.add("active")})}const I="https://your-energy.b.goit.study/api",h=O.create({baseURL:I}),T=async()=>(await h.get("/quote")).data,M=async(e,t=1,r=12)=>(await h.get("/filters",{params:{filter:e,page:t,limit:r}})).data,j=async e=>(await h.get("/exercises",{params:e})).data,x="daily-quote";async function b(){const e=document.getElementById("quote-container");if(!e)return;const t=new Date().toLocaleDateString(),r=JSON.parse(localStorage.getItem(x));if(r&&r.date===t){L(e,r.quote,r.author);return}try{const s=await T(),n={...s,date:t};localStorage.setItem(x,JSON.stringify(n)),L(e,s.quote,s.author)}catch(s){console.error("Quote error:",s)}}function L(e,t,r){const s=e.querySelector(".quote-text"),n=e.querySelector(".quote-author");s&&(s.textContent=t),n&&(n.textContent=r)}const d=document.getElementById("exercise-grid"),N=document.getElementById("filter-list"),w=document.getElementById("exercises-title"),u=document.getElementById("search-form"),p=document.getElementById("pagination");let o={view:"categories",filter:"Muscles",category:"",keyword:"",page:1,limit:12};async function F(){f(),N.addEventListener("click",e=>{e.target.tagName==="BUTTON"&&(document.querySelectorAll(".filter-btn").forEach(t=>t.classList.remove("active")),e.target.classList.add("active"),o.view="categories",o.filter=e.target.dataset.filter,o.page=1,A(),f())}),u.addEventListener("submit",e=>{e.preventDefault(),o.keyword=e.target.elements.keyword.value.trim(),o.page=1,m()}),d.addEventListener("click",e=>{const t=e.target.closest(".category-item");t&&(o.view="exercises",o.category=t.dataset.name,o.page=1,o.keyword="",P())}),p.addEventListener("click",e=>{e.target.classList.contains("page-btn")&&(o.page=parseInt(e.target.dataset.page),o.view==="categories"?f():m(),window.scrollTo({top:d.offsetTop-100,behavior:"smooth"}))})}async function f(){try{const e=await M(o.filter,o.page,o.limit);H(e.results),E(e.totalPages)}catch(e){console.error(e)}}async function m(){const e=o.filter.toLowerCase().replace(" ","");try{const t=await j({[e]:o.category,keyword:o.keyword,page:o.page,limit:10});R(t.results),E(t.totalPages)}catch(t){console.error(t)}}function H(e){d.innerHTML=e.map(t=>`
    <li class="category-item" data-name="${t.name}">
      <div class="category-card" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${t.imgURL}')">
         <h3>${t.name}</h3>
         <p>${t.filter}</p>
      </div>
    </li>
  `).join("")}function R(e){if(e.length===0){d.innerHTML='<li class="no-results">No exercises found.</li>';return}d.innerHTML=e.map(t=>`
    <li class="exercise-card">
      <div class="card-top">
        <span class="workout-tag">WORKOUT</span>
        <span class="rating">${t.rating.toFixed(1)} ⭐</span>
        <button class="start-btn" data-id="${t._id}">Start ➔</button>
      </div>
      <h3 class="exercise-name">${t.name}</h3>
      <div class="card-info">
        <p><span>Burned calories:</span> ${t.burnedCalories} / 3 min</p>
        <p><span>Body part:</span> ${t.bodyPart}</p>
        <p><span>Target:</span> ${t.target}</p>
      </div>
    </li>
  `).join("")}function E(e){if(e<=1){p.innerHTML="";return}let t="";for(let r=1;r<=e;r++)t+=`<button class="page-btn ${r===o.page?"active":""}" data-page="${r}">${r}</button>`;p.innerHTML=t}function A(){w.textContent="Exercises",u.classList.add("is-hidden"),u.reset(),o.keyword=""}function P(){w.innerHTML=`Exercises / <span class="category-accent">${o.category}</span>`,u.classList.remove("is-hidden"),m()}const _="https://your-energy.b.goit.study/api/exercises",v="favorite-exercises",i=document.querySelector("#exercise-modal"),c=document.querySelector("#rating-modal"),S=document.querySelector("#exercise-grid")||document.querySelector("#favorites-grid");let l=null;S&&S.addEventListener("click",async e=>{const t=e.target.closest(".start-btn");if(!t)return;const r=t.dataset.id;try{const n=await(await fetch(`${_}/${r}`)).json();l=n,D(n),i.classList.remove("is-hidden"),document.body.style.overflow="hidden"}catch(s){console.error("Failed to load exercise details:",s)}});function D(e){i&&(i.querySelector(".js-exercise-img").src=e.gifUrl,i.querySelector(".js-exercise-title").textContent=e.name,i.querySelector(".js-rating-value").textContent=e.rating.toFixed(1),i.querySelector(".js-target").textContent=e.target,i.querySelector(".js-bodyPart").textContent=e.bodyPart,i.querySelector(".js-equipment").textContent=e.equipment,i.querySelector(".js-popular").textContent=e.popularity,i.querySelector(".js-calories").textContent=`${e.burnedCalories}/${e.time} min`,i.querySelector(".js-description").textContent=e.description,C(e.rating,i.querySelector(".js-stars")),q())}function q(){const e=i.querySelector(".add-fav-btn");if(!e||!l)return;(JSON.parse(localStorage.getItem(v))||[]).some(s=>s._id===l._id)?e.innerHTML='Remove from favorites <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>':e.innerHTML=`Add to favorites <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"/>`}function J(){let e=JSON.parse(localStorage.getItem(v))||[];const t=e.findIndex(r=>r._id===l._id);t===-1?e.push(l):e.splice(t,1),localStorage.setItem(v,JSON.stringify(e)),q(),document.getElementById("favorites-grid")&&location.reload()}function C(e,t){if(!t)return;const r=Math.round(e);let s="";for(let n=1;n<=5;n++){const a=n<=r?"#EEA10C":"rgba(244, 244, 244, 0.2)";s+=`<span style="color: ${a}; cursor: pointer; font-size: 18px;">★</span>`}t.innerHTML=s}i&&i.addEventListener("click",e=>{(e.target.closest(".modal-close-btn")||e.target===i)&&(i.classList.add("is-hidden"),document.body.style.overflow="auto"),e.target.closest(".give-rating-btn")&&(i.classList.add("is-hidden"),c.classList.remove("is-hidden"),$(0)),e.target.closest(".add-fav-btn")&&J()});if(c){const e=c.querySelector(".rating-form");c.addEventListener("click",r=>{(r.target.closest("[data-rating-modal-close]")||r.target===c)&&(c.classList.add("is-hidden"),document.body.style.overflow="auto")}),e&&e.addEventListener("submit",r=>{r.preventDefault(),c.classList.add("is-hidden"),document.body.style.overflow="auto",e.reset(),console.log("Rating modal closed via Send button.")});const t=c.querySelector(".js-rating-stars");t.addEventListener("click",r=>{if(r.target.tagName!=="SPAN")return;const a=Array.from(t.children).indexOf(r.target)+1;$(a)})}function $(e){const t=c.querySelector(".js-rating-number"),r=c.querySelector(".js-rating-stars");t&&(t.textContent=e.toFixed(1)),C(e,r)}const y="favorite-exercises";document.addEventListener("DOMContentLoaded",()=>{b(),k(),U()});function k(){const e=document.getElementById("favorites-grid"),t=document.getElementById("fav-empty"),r=JSON.parse(localStorage.getItem(y))||[];if(r.length===0){e.innerHTML="",t.classList.remove("is-hidden");return}t.classList.add("is-hidden");const s=r.map(n=>`
    <li class="exercise-card">
      <div class="card-top">
        <div class="workout-tag">WORKOUT</div>
        <div style="display: flex; gap: 8px; margin-left: auto; align-items: center;">
            <button class="delete-btn" data-id="${n._id}" aria-label="Remove from favorites" style="background:none; border:none; padding: 0; cursor:pointer;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
            <button class="start-btn" data-id="${n._id}">
              Start ➔
              <svg width="16" height="16"><use href="./img/sprite.svg#icon-arrow"></use></svg>
            </button>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 8px;">
        <h3 class="exercise-name">${n.name}</h3>
      </div>

      <div class="card-info">
        <p>Burned calories: <span>${n.burnedCalories} / ${n.time} min</span></p>
        <p>Body part: <span>${n.bodyPart}</span></p>
        <p>Target: <span>${n.target}</span></p>
      </div>
    </li>
  `).join("");e.innerHTML=s}function U(){document.getElementById("favorites-grid").addEventListener("click",t=>{const r=t.target.closest(".delete-btn");if(!r)return;const s=r.dataset.id;K(s)})}function K(e){let t=JSON.parse(localStorage.getItem(y))||[];t=t.filter(r=>r._id!==e),localStorage.setItem(y,JSON.stringify(t)),k()}document.addEventListener("DOMContentLoaded",()=>{B(),b(),F()});
//# sourceMappingURL=main-DLDe0nFo.js.map
