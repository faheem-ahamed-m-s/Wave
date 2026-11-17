const C='wave-v20',F=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith((async()=>{
  const c=await caches.open(C),cached=await c.match(e.request,{ignoreSearch:true});
  const doc=e.request.mode==='navigate'||e.request.destination==='document';
  const net=fetch(e.request,doc?{cache:'no-cache'}:undefined).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r});
  if(!cached)return net;
  if(!doc){net.catch(()=>{});return cached}
  return Promise.race([net.catch(()=>cached),new Promise(r=>setTimeout(()=>r(cached),2500))]);
 })());
});
