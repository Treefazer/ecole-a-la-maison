/* École à la maison : fonctionne hors ligne, se met à jour dès qu'internet est là */
const CACHE="ecole-v4";
const FICHIERS=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/apple-touch-icon.png","icons/favicon-32.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FICHIERS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  if(r.mode==="navigate"||r.url.endsWith("/index.html")){
    e.respondWith(fetch(r).then(rep=>{const c=rep.clone();caches.open(CACHE).then(x=>x.put("index.html",c));return rep;}).catch(()=>caches.match("index.html")));
    return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(rep=>{const c=rep.clone();caches.open(CACHE).then(x=>x.put(r,c));return rep;})));
});
