if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise((async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()}))),r.then((()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]}))},r=(r,s)=>{Promise.all(r.map(e)).then((e=>s(1===e.length?e[0]:e)))},s={require:Promise.resolve(r)};self.define=(r,i,t)=>{s[r]||(s[r]=Promise.resolve().then((()=>{let s={};const n={uri:location.origin+r.slice(1)};return Promise.all(i.map((r=>{switch(r){case"exports":return s;case"module":return n;default:return e(r)}}))).then((e=>{const r=t(...e);return s.default||(s.default=r),s}))})))}}define("./sw.js",["./workbox-66de5ee0"],(function(e){"use strict";importScripts("https://cdn.jsdelivr.net/npm/workbox-sw@6.1.5/build/workbox-sw.min.js"),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"index.html",revision:"37084f4fab5c73d31700aab90c18c4bb"},{url:"index.webmanifest",revision:"90a3d9eb1764e5e0e1ab520c49d0f320"},{url:"src.4602cdd9.js",revision:"77da9f393761e475070892a18ded9e28"},{url:"src.4e86659c.css",revision:"7f6abe24864eb830ae79c2372f0c1f91"}],{}),e.cleanupOutdatedCaches()}));
//# sourceMappingURL=sw.js.map