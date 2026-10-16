const C='foxtv-v2';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET') return;
 const shell=u.origin===location.origin||u.href===SHELL[5];
 if(!shell) return; // streams go straight to the network
 if(e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')){
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
 } else e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
