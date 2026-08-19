/**
 * partials.js
 * Loads the canonical netbar and footer from /main/assets/partials/ so every
 * page on the hub site stays in sync automatically instead of hand-copying
 * the same markup into index.html, about/index.html, and pack/index.html.
 *
 * Usage on a page:
 *   <div id="netbar-placeholder"></div>
 *   ... page content ...
 *   <div id="footer-placeholder"></div>
 *   <script src="/main/assets/js/partials.js"></script>
 *
 * Edit the actual netbar/footer markup in assets/partials/*.html — never
 * inline it back into individual pages.
 *
 * NOTE: because this fetch is asynchronous, #netbar will not exist in the
 * DOM at page-parse time. Any script that references it (see script.js and
 * about/index.html's inline nav script) must look it up lazily and listen
 * for the `partials:loaded` event fired below, rather than caching a
 * reference to it immediately.
 */

async function loadPartial(url, mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return false;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    mount.outerHTML = await res.text();
    return true;
  } catch (err) {
    // Fails closed: on a broken fetch the placeholder div is simply left
    // empty rather than breaking the rest of the page.
    console.warn(`[partials] failed to load ${url}:`, err);
    return false;
  }
}

(async function initPartials() {
  await loadPartial('/main/assets/partials/netbar.html', 'netbar-placeholder');
  await loadPartial('/main/assets/partials/footer.html', 'footer-placeholder');

  document.dispatchEvent(new CustomEvent('partials:loaded'));
})();
