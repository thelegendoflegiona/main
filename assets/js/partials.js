/**
 * partials.js
 * Loads the canonical sitenav, netbar, and footer from /main/assets/partials/
 * so every page on the hub site stays in sync automatically instead of
 * hand-copying the same markup into index.html, about/index.html, and
 * pack/index.html.
 *
 * Usage on a page:
 *   <div id="sitenav-placeholder"></div>
 *   <div id="netbar-placeholder"></div>
 *   ... page content ...
 *   <div id="footer-placeholder"></div>
 *   <script src="/main/assets/js/partials.js"></script>
 *
 * Edit the actual sitenav/netbar/footer markup in assets/partials/*.html —
 * never inline it back into individual pages.
 *
 * NOTE: because this fetch is asynchronous, #sitenav/#netbar/#hamburger/
 * #mobileMenu will not exist in the DOM at page-parse time. Any script that
 * references them (see script.js) must look them up lazily and listen for
 * the `partials:loaded` event fired below, rather than caching a reference
 * immediately.
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

// Marks the sitenav/mobile-menu link matching the current page as active.
// Only applies to page-type links (no "#" fragment) — hash links are
// homepage section anchors, not distinct pages, so they're left alone.
function applyActiveNav() {
  const here = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.sitenav-links a[href], .mobile-menu a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href.includes('#')) return;
    let hrefPath;
    try {
      hrefPath = new URL(href, location.origin).pathname;
    } catch {
      return;
    }
    if (hrefPath === here) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
}

(async function initPartials() {
  await loadPartial('/main/assets/partials/sitenav.html', 'sitenav-placeholder');
  await loadPartial('/main/assets/partials/netbar.html', 'netbar-placeholder');
  await loadPartial('/main/assets/partials/footer.html', 'footer-placeholder');

  applyActiveNav();
  document.dispatchEvent(new CustomEvent('partials:loaded'));
})();
