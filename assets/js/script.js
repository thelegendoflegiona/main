/* ═══════════════════════════════════════════════════
   THE LEGEND OF LEGIONA — MAIN SITE SCRIPT
   /main/assets/js/script.js
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── 1. SCROLL PROGRESS BAR ─────────────────────── */
    const scrollBar = document.getElementById('scroll-progress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        if (scrollBar) scrollBar.style.transform = `scaleX(${progress})`;
    }

    /* ── 2. CUSTOM CURSOR ───────────────────────────── */
    const curDot  = document.getElementById('cur-dot');
    const curRing = document.getElementById('cur-ring');
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let cursorVisible = false;

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        if (curDot)  { curDot.style.left  = mouseX + 'px'; curDot.style.top  = mouseY + 'px'; }
        if (curRing) { curRing.style.left = ringX  + 'px'; curRing.style.top = ringY  + 'px'; }
        requestAnimationFrame(animateCursor);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        if (!cursorVisible) {
            cursorVisible = true;
            if (curDot)  { curDot.style.opacity  = '1'; }
            if (curRing) { curRing.style.opacity = '1'; }
        }
    });

    document.addEventListener('mouseleave', () => {
        if (curDot)  curDot.style.opacity  = '0';
        if (curRing) curRing.style.opacity = '0';
        cursorVisible = false;
    });

    // Hover states
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (curDot)  curDot.classList.add('active');
            if (curRing) curRing.classList.add('active');
            const isCta = el.classList.contains('btn-primary') || el.classList.contains('nav-cta');
            if (isCta) {
                if (curDot)  curDot.classList.add('on-cta');
                if (curRing) curRing.classList.add('on-cta');
            }
        });
        el.addEventListener('mouseleave', () => {
            if (curDot)  { curDot.classList.remove('active', 'on-cta'); }
            if (curRing) { curRing.classList.remove('active', 'on-cta'); }
        });
    });

    animateCursor();

    /* ── 3. NETWORK BAR + SITENAV SCROLL BEHAVIOUR ──── */
    const netbar  = document.getElementById('netbar');
    const sitenav = document.getElementById('sitenav');
    let lastScrollY = 0;
    let netbarHidden = false;

    function handleScroll() {
        const scrollY = window.scrollY;
        updateScrollProgress();

        // Sitenav glass effect
        if (sitenav) sitenav.classList.toggle('scrolled', scrollY > 40);

        // Hide netbar on scroll down, show on scroll up
        if (netbar) {
            if (scrollY > lastScrollY && scrollY > 80 && !netbarHidden) {
                netbar.classList.add('hidden');
                if (sitenav) sitenav.classList.add('nb-hidden');
                netbarHidden = true;
            } else if (scrollY < lastScrollY && netbarHidden) {
                netbar.classList.remove('hidden');
                if (sitenav) sitenav.classList.remove('nb-hidden');
                netbarHidden = false;
            }
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ── 4. HERO EYEBROW TYPEWRITER ─────────────────── */
    const heroEyebrow = document.getElementById('heroEyebrow');
    const eyebrowText = 'THE LEGEND OF LEGIONA // SKYXION : ALTAËR ERA';
    if (heroEyebrow) {
        let i = 0;
        const typeInterval = setInterval(() => {
            heroEyebrow.textContent = eyebrowText.slice(0, ++i);
            if (i >= eyebrowText.length) clearInterval(typeInterval);
        }, 35);
    }

    /* ── 5. TEXT SCRAMBLE EFFECT ─────────────────────── */
    const scrambleTarget = document.getElementById('scrambleTarget');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%';
    function scramble(el, finalText, duration) {
        if (!el) return;
        let frame = 0;
        const totalFrames = duration / 16;
        const interval = setInterval(() => {
            let result = '';
            for (let c = 0; c < finalText.length; c++) {
                if (frame / totalFrames > c / finalText.length) {
                    result += finalText[c];
                } else {
                    result += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            el.textContent = result;
            if (++frame >= totalFrames) {
                el.textContent = finalText;
                clearInterval(interval);
            }
        }, 16);
    }

    setTimeout(() => scramble(scrambleTarget, 'Legend', 900), 600);

    /* ── 6. HERO PARALLAX GLOW ───────────────────────── */
    const heroGlow = document.getElementById('heroGlow');
    document.addEventListener('mousemove', (e) => {
        if (!heroGlow) return;
        const xPct = (e.clientX / window.innerWidth  - 0.5) * 18;
        const yPct = (e.clientY / window.innerHeight - 0.5) * 12;
        heroGlow.style.transform = `translate(${xPct}px, ${yPct}px)`;
    });

    /* ── 7. MAGNETIC BUTTONS ─────────────────────────── */
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
            const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
            btn.style.setProperty('--mx', x + '%');
            btn.style.setProperty('--my', y + '%');
        });
    });

    /* ── 8. 3D TILT CARDS ────────────────────────────── */
    function initTilt(el) {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top)  / rect.height;
            const tiltX = (y - 0.5) * -8;
            const tiltY = (x - 0.5) *  8;
            el.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
            el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
            el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    }

    document.querySelectorAll('.tilt-card').forEach(initTilt);

    /* ── 9. SCROLL REVEAL ────────────────────────────── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ── 10. STAT COUNTERS ───────────────────────────── */
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const from   = parseInt(el.dataset.from,   10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(from + (target - from) * eased);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const statsStrip = document.getElementById('statsStrip');
    let statsAnimated = false;

    if (statsStrip) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsAnimated) {
                statsAnimated = true;
                document.querySelectorAll('.stat-block .num').forEach(animateCounter);
                statsObserver.disconnect();
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsStrip);
    }

    /* ── 11. INTERACTIVE TIMELINE ────────────────────── */
    const eras = [
        {
            date:  '2023 // EARLY',
            badge: 'ORIGIN',
            badgeClass: '',
            accentClass: '',
            title: 'The Sus Founded',
            desc:  'Faiz4224, ItzDynozz & Imii Kun form the original squad in Skyxion. Three founders, one shared vision. EhekSquad joined during this era, though their exact status was never formally defined — The Sus had no governance structure yet.',
            ghost: '01',
            nodeClass: ''
        },
        {
            date:  '2023 // LATE',
            badge: 'REBIRTH',
            badgeClass: '',
            accentClass: '',
            title: 'Renamed & Reborn',
            desc:  'At the proposal of Imii Kun, the nation is renamed "The Legend of Legiona." A new flag, a new identity, and the foundations of proper governance are laid for the first time.',
            ghost: '02',
            nodeClass: ''
        },
        {
            date:  'MAY 6, 2023',
            badge: 'DEMOCRACY',
            badgeClass: '',
            accentClass: '',
            title: 'First Presidential Election',
            desc:  'The first democratic election is held. UltraX2020 of the PHRTL party wins, becoming the first elected President of The LoL. A historic milestone — The LoL becomes the first Skyxion nation to hold democratic elections.',
            ghost: '03',
            nodeClass: ''
        },
        {
            date:  '2023 // CRISIS',
            badge: 'CRISIS',
            badgeClass: 'badge-chaos',
            accentClass: 'accent-chaos',
            title: 'Chaos & Political Crisis',
            desc:  'UltraX2020 resigns from the presidency under mounting political pressure. The LoL City sign is bombed. A TNT attack destroys the TLCC. With governance in collapse, Faiz4224 steps back in to restore order.',
            ghost: '04',
            nodeClass: 'itl-chaos'
        },
        {
            date:  'NOV 8, 2023',
            badge: 'RECOVERY',
            badgeClass: '',
            accentClass: '',
            title: 'Resistance & Recovery',
            desc:  'Faiz4224 retakes leadership and begins the rebuilding process. The ISC (formerly TLIO) is reformed as the primary intelligence and security agency. National infrastructure projects resume under a new administration.',
            ghost: '05',
            nodeClass: ''
        },
        {
            date:  '2025 – 2026',
            badge: 'PRESENT',
            badgeClass: 'badge-current',
            accentClass: 'accent-gold',
            title: 'The Modern Era',
            desc:  'The LoL enters the Altaër Era — the most prosperous chapter in its history. The national website ecosystem launches across nine sub-domains. TL Railways spans 4,800+ blocks. Paiz® Corp expands to five subsidiaries.',
            ghost: '06',
            nodeClass: 'itl-gold'
        }
    ];

    const itlPanel   = document.getElementById('itlPanel');
    const itlContent = document.getElementById('itlContent');
    const itlFill    = document.getElementById('itlFill');
    const itlGhost   = document.getElementById('itlGhost');
    const itlDate    = document.getElementById('itlDate');
    const itlBadge   = document.getElementById('itlBadge');
    const itlTitle   = document.getElementById('itlTitle');
    const itlDesc    = document.getElementById('itlDesc');
    const itlPrev    = document.getElementById('itlPrev');
    const itlNext    = document.getElementById('itlNext');
    const itlCounter = document.getElementById('itlCounter');
    const itlNodes   = document.querySelectorAll('.itl-node');

    let currentEra = 0;
    let isTransitioning = false;

    function setEra(index, direction) {
        if (isTransitioning || index === currentEra) return;
        isTransitioning = true;

        const exitY = direction > 0 ? '-7px' : '7px';
        const enterY = direction > 0 ? '7px' : '-7px';

        itlContent.style.setProperty('--itl-exit-y', exitY);
        itlContent.classList.add('is-exiting');

        setTimeout(() => {
            currentEra = index;
            const era = eras[index];

            // Update content
            itlDate.textContent  = era.date;
            itlTitle.textContent = era.title;
            itlDesc.textContent  = era.desc;
            itlGhost.textContent = era.ghost;
            itlBadge.textContent = era.badge;
            itlBadge.className   = 'itl-badge ' + era.badgeClass;
            itlPanel.className   = 'itl-panel ' + era.accentClass;

            // Progress fill
            const pct = (index / (eras.length - 1)) * 100;
            itlFill.style.width = pct + '%';

            // Nodes
            itlNodes.forEach((n, i) => {
                n.classList.toggle('active', i === index);
            });

            // Counter
            itlCounter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(eras.length).padStart(2, '0');

            // Buttons
            itlPrev.disabled = index === 0;
            itlNext.disabled = index === eras.length - 1;

            // Animate in
            itlContent.style.setProperty('--itl-enter-y', enterY);
            itlContent.classList.remove('is-exiting');
            itlContent.classList.add('is-entering');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    itlContent.classList.remove('is-entering');
                    isTransitioning = false;
                });
            });
        }, 280);
    }

    // Node buttons
    itlNodes.forEach((node, i) => {
        node.addEventListener('click', () => {
            const dir = i > currentEra ? 1 : -1;
            setEra(i, dir);
        });
    });

    // Prev / Next
    if (itlPrev) itlPrev.addEventListener('click', () => { if (currentEra > 0) setEra(currentEra - 1, -1); });
    if (itlNext) itlNext.addEventListener('click', () => { if (currentEra < eras.length - 1) setEra(currentEra + 1, 1); });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && currentEra < eras.length - 1) setEra(currentEra + 1,  1);
        if (e.key === 'ArrowLeft'  && currentEra > 0)               setEra(currentEra - 1, -1);
    });

    // Touch/swipe
    let touchStartX = 0;
    if (itlPanel) {
        itlPanel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        itlPanel.addEventListener('touchend',   (e) => {
            const delta = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(delta) > 40) {
                if (delta > 0 && currentEra < eras.length - 1) setEra(currentEra + 1,  1);
                if (delta < 0 && currentEra > 0)               setEra(currentEra - 1, -1);
            }
        }, { passive: true });
    }

    // Initialise fill at 0
    if (itlFill) itlFill.style.width = '0%';

    /* ── 12. HAMBURGER MOBILE MENU ───────────────────── */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
        });
    }

    window.closeMobile = function () {
        if (hamburger)  hamburger.classList.remove('open');
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (hamburger)  hamburger.setAttribute('aria-expanded', 'false');
    };

    /* ── 13. KONAMI CODE EASTER EGG ──────────────────── */
    const KONAMI = [38,38,40,40,37,39,37,39,66,65];
    let konamiIndex = 0;
    const konamiOverlay = document.getElementById('konami-overlay');
    const konamiLog     = document.getElementById('konami-log');

    const logLines = [
        '> IDENTITY: SIGMA CLEARANCE CONFIRMED',
        '> ACCESSING: BLACK HOUSE SECURE TERMINAL',
        '> LOCATION: [CLASSIFIED] — ALTAËR SECTOR',
        '> STATUS: ALL SYSTEMS OPERATIONAL',
        '> TIP: The next election is closer than you think.',
    ];

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === KONAMI[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === KONAMI.length) {
                konamiIndex = 0;
                openKonami();
            }
        } else {
            konamiIndex = 0;
        }
    });

    function openKonami() {
        if (!konamiOverlay) return;
        konamiOverlay.classList.add('active');
        if (konamiLog) {
            konamiLog.innerHTML = '';
            logLines.forEach((line, i) => {
                const span = document.createElement('span');
                span.className = 'log-line';
                span.textContent = line;
                span.style.animationDelay = (i * 0.18) + 's';
                konamiLog.appendChild(span);
            });
        }
    }

    window.closeKonami = function () {
        if (konamiOverlay) konamiOverlay.classList.remove('active');
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeKonami();
    });

    /* ── 14. SMOOTH ANCHOR LINKS ─────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 92; // nav height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                window.closeMobile();
            }
        });
    });

    /* ── INIT ─────────────────────────────────────────── */
    updateScrollProgress();

})();
