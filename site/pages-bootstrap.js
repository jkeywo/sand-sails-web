// Pages serves the compressed Wasm only through this release's service worker.
(async () => {
  const worker = navigator.serviceWorker;
  if (!worker || query.get('sw') === '0') {
    fail('This web release needs its service worker. Open the game again with service workers enabled.');
    return;
  }

  const release = pageMeta('ue-pages-release');
  const params = new URLSearchParams({release});
  if (query.get('swranges')) params.set('ranges', query.get('swranges'));
  params.set('isolate', '1');
  if (pageMeta('ue-sw-late-fill') === 'early') params.set('late', 'early');
  if (pageMeta('ue-sw-waves') === '1') params.set('waves', '1');
  const url = new URL('sw.js?' + params, location.href).href;

  try {
    const registration = await worker.register(url, {updateViaCache: 'none'});
    const deadline = performance.now() + 30000;
    let askedForClaim = false;
    while (worker.controller?.scriptURL !== url || worker.controller.state !== 'activated') {
      if (!askedForClaim && registration.active?.scriptURL === url) {
        registration.active.postMessage({type: 'claim'});
        askedForClaim = true;
      }
      if (performance.now() >= deadline) throw new Error('The current release worker did not take control');
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    const reloadKey = 'sand-sails.pages-isolation';
    if (!crossOriginIsolated) {
      if (sessionStorage.getItem(reloadKey) === release) throw new Error('The game tab could not be isolated');
      sessionStorage.setItem(reloadKey, release);
      location.reload();
      return;
    }
    sessionStorage.removeItem(reloadKey);
    const loader = document.createElement('script');
    loader.src = 'wasm-loader.js?release=' + release;
    loader.onerror = () => fail('The current web loader could not be downloaded. Reload to retry.');
    document.body.appendChild(loader);
  } catch (error) {
    console.log('Pages startup: ' + error);
    fail('The web release could not finish preparing this tab. Reload to retry.');
  }
})();
