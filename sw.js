// Faster opening: keep the app page and Firebase scripts on the phone, refresh them quietly in the background.
const V="bc-v3";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  const mine=u.origin===location.origin&&(r.mode==="navigate"||/\/(index\.html|manifest\.json|icon-\d+\.png)?$/.test(u.pathname));
  const gs=u.hostname==="www.gstatic.com"&&u.pathname.includes("/firebasejs/");
  if(!mine&&!gs)return;
  e.respondWith((async()=>{
    const c=await caches.open(V),hit=await c.match(r);
    const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return (await net)||Response.error();
  })());
});
