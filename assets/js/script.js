/* ═══════════════════════════════════════════════════
   THE LEGEND OF LEGIONA — MAIN SITE SCRIPT
   /main/assets/js/script.js
   ═══════════════════════════════════════════════════ */
    // ════════════════════════════════════════════════════════════════
    //  LAYER 1 — SCROLL PROGRESS BAR
    // ════════════════════════════════════════════════════════════════
    const progressBar = document.getElementById('scroll-progress');
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? scrollTop / docHeight : 0;
        progressBar.style.transform = `scaleX(${pct})`;
    }

    // ════════════════════════════════════════════════════════════════
    //  NAV
    // ════════════════════════════════════════════════════════════════
    const sitenav = document.getElementById('sitenav');
    const netbar  = document.getElementById('netbar');
    const NETBAR_H = 32;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        sitenav.classList.toggle('scrolled', y > 60);
        if (y > NETBAR_H) { netbar.classList.add('hidden'); sitenav.classList.add('nb-hidden'); }
        else { netbar.classList.remove('hidden'); sitenav.classList.remove('nb-hidden'); }
        updateProgress();
    }, { passive: true });

    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
    });
    function closeMobile() {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) closeMobile();
    });

    // ════════════════════════════════════════════════════════════════
    //  REVEAL OBSERVER
    // ════════════════════════════════════════════════════════════════
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('in'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ════════════════════════════════════════════════════════════════
    //  LAYER 2 — CUSTOM CURSOR (desktop only)
    // ════════════════════════════════════════════════════════════════
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isDesktop) {
        const dot  = document.getElementById('cur-dot');
        const ring = document.getElementById('cur-ring');
        let mx = -100, my = -100, rx = -100, ry = -100;
        let raf;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top  = my + 'px';
            dot.style.opacity = '1';
            ring.style.opacity = '0.8';
            if (!raf) raf = requestAnimationFrame(animRing);
        });

        function animRing() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            raf = requestAnimationFrame(animRing);
        }

        // Hover states
        const interactiveEls = 'a, button, .tilt-card, input, textarea, [role="button"]';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveEls)) {
                dot.classList.add('active'); ring.classList.add('active');
                const isCta = e.target.closest('.btn-primary, .nav-cta');
                dot.classList.toggle('on-cta', !!isCta);
                ring.classList.toggle('on-cta', !!isCta);
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveEls)) {
                dot.classList.remove('active','on-cta');
                ring.classList.remove('active','on-cta');
            }
        });

        // Hide when leaving window
        document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='0.8'; });
    }

    // ════════════════════════════════════════════════════════════════
    //  LAYER 3 — ANIMATED STAT COUNTERS
    // ════════════════════════════════════════════════════════════════
    function animateCounter(el) {
        const target  = parseInt(el.dataset.target);
        const from    = parseInt(el.dataset.from) || 0;
        const suffix  = el.dataset.suffix || '';
        const duration = target > 100 ? 1800 : 1200;
        const startTime = performance.now();

        function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(from + (target - from) * easeOut(progress));
            el.textContent = value.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.num[data-target]').forEach(el => animateCounter(el));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsStrip = document.getElementById('statsStrip');
    if (statsStrip) statsObserver.observe(statsStrip);

    // ════════════════════════════════════════════════════════════════
    //  LAYER 4 — 3D CARD TILT (desktop only)
    // ════════════════════════════════════════════════════════════════
    if (isDesktop) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width  / 2;
                const cy = rect.top  + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width  / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);

                // Limit tilt to ±8deg for subtlety
                const rotX = -dy * 8;
                const rotY =  dx * 8;

                card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
                card.style.transition = 'transform 0.05s linear, box-shadow 0.25s';

                // Shimmer position via CSS vars
                const px = ((e.clientX - rect.left) / rect.width)  * 100;
                const py = ((e.clientY - rect.top)  / rect.height) * 100;
                card.style.setProperty('--mx', px + '%');
                card.style.setProperty('--my', py + '%');
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s';
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    // ════════════════════════════════════════════════════════════════
    //  LAYER 5 — HERO TYPEWRITER + SCRAMBLE
    // ════════════════════════════════════════════════════════════════
    // Typewriter on hero eyebrow
    const eyebrow = document.getElementById('heroEyebrow');
    const eyebrowText = 'THE SUS // EST. 2023 // SOVEREIGN NATION // SKYXION: ALTAËR ERA';
    let twIndex = 0;

    function typeWriter() {
        if (twIndex <= eyebrowText.length) {
            eyebrow.textContent = eyebrowText.slice(0, twIndex);
            twIndex++;
            setTimeout(typeWriter, twIndex === 1 ? 600 : 28);
        }
    }
    setTimeout(typeWriter, 900); // Start after hero animates in

    // Text scramble on "Legend"
    const scrambleEl = document.getElementById('scrambleTarget');
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&';
    const ORIGINAL = 'Legend';

    function scramble(el, finalText, duration) {
        const startTime = performance.now();
        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const revealedCount = Math.floor(progress * finalText.length);
            let result = '';
            for (let i = 0; i < finalText.length; i++) {
                if (i < revealedCount) {
                    result += finalText[i];
                } else {
                    result += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }
            el.textContent = result;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = finalText;
        }
        requestAnimationFrame(tick);
    }

    // Trigger scramble after page loads
    setTimeout(() => scramble(scrambleEl, ORIGINAL, 900), 1400);

    // Re-scramble on hover (addictive — try it)
    scrambleEl.addEventListener('mouseenter', () => {
        scramble(scrambleEl, ORIGINAL, 600);
    });

    // ════════════════════════════════════════════════════════════════
    //  LAYER 6 — MAGNETIC CTA BUTTON
    // ════════════════════════════════════════════════════════════════
    if (isDesktop) {
        const ctaBtn = document.getElementById('ctaBtn');
        if (ctaBtn) {
            ctaBtn.addEventListener('mousemove', (e) => {
                const rect = ctaBtn.getBoundingClientRect();
                const cx = rect.left + rect.width  / 2;
                const cy = rect.top  + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width  / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                // Magnetic pull — max 6px
                ctaBtn.style.transform = `translate(${dx * 6}px, ${dy * 6}px) translateY(-2px)`;
                // Track mouse position for light effect
                const px = ((e.clientX - rect.left) / rect.width)  * 100;
                const py = ((e.clientY - rect.top)  / rect.height) * 100;
                ctaBtn.style.setProperty('--mx', px + '%');
                ctaBtn.style.setProperty('--my', py + '%');
            });
            ctaBtn.addEventListener('mouseleave', () => {
                ctaBtn.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), background 0.25s, box-shadow 0.25s';
                ctaBtn.style.transform = '';
                setTimeout(() => { ctaBtn.style.transition = ''; }, 400);
            });
        }
    }

    // ════════════════════════════════════════════════════════════════
    //  LAYER 7 — KONAMI CODE EASTER EGG
    // ════════════════════════════════════════════════════════════════
    const KONAMI = [38,38,40,40,37,39,37,39,66,65]; // ↑↑↓↓←→←→BA
    let kSeq = [];
    const konamiOverlay = document.getElementById('konami-overlay');
    const konamiLog     = document.getElementById('konami-log');

    const konamiLines = [
        '> KONAMI SEQUENCE DETECTED...',
        '> VERIFYING OPERATOR CREDENTIALS...',
        '> IDENTITY CONFIRMED: FAIZ4224',
        '> RANK: FIRST PRESIDENT // FOUNDING LEADER',
        '> CLEARANCE LEVEL: SIGMA (MAXIMUM)',
        '> ACCESSING CLASSIFIED NATIONAL RECORDS...',
        '> TLSRL STATUS: OPERATIONAL [4,800+ BLOCKS]',
        '> TLCC TWIN TOWERS: SECURED',
        '> ISC THREAT MONITOR: NO ACTIVE THREATS',
        '> NATIONAL FARMS: ALL SYSTEMS NOMINAL',
        '> WELCOME BACK, PRESIDENT. THE LOL STANDS STRONG.'
    ];

    document.addEventListener('keydown', (e) => {
        kSeq.push(e.keyCode);
        if (kSeq.length > KONAMI.length) kSeq.shift();
        if (kSeq.join(',') === KONAMI.join(',')) {
            konamiOverlay.classList.add('active');
            konamiLog.innerHTML = '';
            konamiLines.forEach((line, i) => {
                const span = document.createElement('span');
                span.className = 'log-line';
                span.textContent = line;
                span.style.animationDelay = (i * 0.22) + 's';
                konamiLog.appendChild(span);
            });
            kSeq = [];
        }
    });

    function closeKonami() {
        konamiOverlay.classList.remove('active');
    }
    konamiOverlay.addEventListener('click', (e) => {
        if (e.target === konamiOverlay) closeKonami();
    });

    // ════════════════════════════════════════════════════════════════
    //  INTERACTIVE TIMELINE
    // ════════════════════════════════════════════════════════════════
    (function () {
        const ERAS = [
            { date:"2023 // EARLY", badge:"ORIGIN", badgeClass:"", title:"The Sus Founded", desc:"Faiz4224, ItzDynozz & Imii Kun form the original squad in Skyxion. Three founders, one shared vision. EhekSquad joined during this era, though their exact status as citizens, allies, or residents was never formally defined — The Sus had no governance structure yet.", accent:"" },
            { date:"2023", badge:"GOLDEN ERA", badgeClass:"", title:"Renamed & Reborn", desc:"Renamed \"The Legend of Legiona.\" The nation rapidly becomes the most modern and wealthiest in all of Skyxion. Under President Faiz4224, The LoL thrives in economy, infrastructure, and innovation.", accent:"" },
            { date:"MAY 6, 2023", badge:"DEMOCRACY", badgeClass:"", title:"First Presidential Election", desc:"The LoL holds its first democratic election. UltraX2020 and the Parti Harapan Rakyat The LoL (PHRTL) win, becoming the 2nd President — a significant milestone and turning point in national governance.", accent:"" },
            { date:"2023 // CRISIS", badge:"CONFLICT", badgeClass:"badge-chaos", title:"Chaos & Conflict", desc:"Internal strife erupts under UltraX2020. The LoL City sign is bombed. TLCC is attacked by drones. Political chaos grips the nation — the darkest and most turbulent chapter in the history of Legiona.", accent:"accent-chaos" },
            { date:"NOV 8, 2023", badge:"REBIRTH", badgeClass:"", title:"Resistance & Recovery", desc:"UltraX2020 resigns. Faiz4224 resumes leadership. Infrastructure projects launch, security is reinforced. The intelligence body TLIO — predecessor to ISC — is established to defend The LoL from future threats.", accent:"" },
            { date:"2025–2026", badge:"CURRENT ERA", badgeClass:"badge-current", title:"The Modern Era", desc:"TLIO is reborn as the Internal Security Control (ISC). The Skyxion: Altaer era begins. The LoL stands today as a symbol of perseverance and innovation. The greatest chapter is still being written.", accent:"accent-gold" }
        ];

        let current = 0, transitioning = false;
        const fill = document.getElementById('itlFill'), panel = document.getElementById('itlPanel'),
              content = document.getElementById('itlContent'), dateEl = document.getElementById('itlDate'),
              badgeEl = document.getElementById('itlBadge'), titleEl = document.getElementById('itlTitle'),
              descEl = document.getElementById('itlDesc'), ghostEl = document.getElementById('itlGhost'),
              counter = document.getElementById('itlCounter'), prevBtn = document.getElementById('itlPrev'),
              nextBtn = document.getElementById('itlNext'), nodes = document.querySelectorAll('.itl-node');

        function pad(n) { return String(n).padStart(2,'0'); }
        function updateFill(i) { fill.style.width = ERAS.length > 1 ? (i/(ERAS.length-1))*100+'%' : '0%'; }

        function goTo(index) {
            if (transitioning || index === current || index < 0 || index >= ERAS.length) return;
            transitioning = true;
            const dir = index > current ? 1 : -1;
            const era = ERAS[index];
            content.style.setProperty('--itl-exit-y', dir > 0 ? '-8px' : '8px');
            content.classList.add('is-exiting');
            setTimeout(() => {
                dateEl.textContent = era.date; badgeEl.textContent = era.badge;
                badgeEl.className = 'itl-badge ' + era.badgeClass;
                titleEl.textContent = era.title; descEl.textContent = era.desc;
                ghostEl.textContent = pad(index+1); counter.textContent = pad(index+1)+' / '+pad(ERAS.length);
                panel.className = 'itl-panel '+(era.accent||'');
                nodes.forEach((n,i) => n.classList.toggle('active', i===index));
                updateFill(index);
                prevBtn.disabled = index === 0; nextBtn.disabled = index === ERAS.length-1;
                current = index;
                content.style.setProperty('--itl-enter-y', dir > 0 ? '8px' : '-8px');
                content.classList.remove('is-exiting'); content.classList.add('is-entering');
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    content.classList.remove('is-entering');
                    setTimeout(() => { transitioning = false; }, 320);
                }));
            }, 290);
        }

        nodes.forEach((n,i) => n.addEventListener('click', () => goTo(i)));
        prevBtn.addEventListener('click', () => goTo(current-1));
        nextBtn.addEventListener('click', () => goTo(current+1));

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            const s = document.getElementById('history');
            if (!s) return;
            const r = s.getBoundingClientRect();
            if (r.top > window.innerHeight || r.bottom < 0) return;
            e.preventDefault();
            goTo(e.key === 'ArrowLeft' ? current-1 : current+1);
        });

        let tStartX = 0;
        panel.addEventListener('touchstart', (e) => { tStartX = e.touches[0].clientX; }, { passive:true });
        panel.addEventListener('touchend',   (e) => { const d = tStartX - e.changedTouches[0].clientX; if (Math.abs(d) > 48) goTo(d > 0 ? current+1 : current-1); }, { passive:true });
        updateFill(0); prevBtn.disabled = true;
    })();
