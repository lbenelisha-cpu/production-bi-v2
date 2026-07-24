if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./service-worker.js?v=4.6.9', { updateViaCache: 'none' });
      await reg.update();
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if(reloading) return;
        reloading = true;
        location.reload();
      });
    } catch(e) { console.warn(e); }
  });
}
