// Fallback XLSX loader — if CDN blocked (e.g. Safari opening local file), load from alternative source
(async function(){
  if(typeof XLSX === 'undefined' || window._xlsxLoadError){
    try {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    } catch(e){
      // Both CDNs failed — XLSX import won't work but rest of app will
      console.warn('XLSX library could not be loaded. Excel import disabled.');
    }
  }
})();
