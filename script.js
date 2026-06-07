/* ─── BOOT SCREEN ─── */
        const boot = document.getElementById('boot');
        const delays = [0, 300, 600, 900, 1200];
        delays.forEach((d, i) => {
            setTimeout(() => document.getElementById('bl' + i).classList.add('show'), d);
        });
        document.getElementById('boot-bar').style.width = '100%';
        setTimeout(() => {
            boot.classList.add('out');
            setTimeout(() => boot.remove(), 600);
        }, 2100);

        /* ─── MATRIX ─── */
        const canvas = document.getElementById('mtx');
        const ctx = canvas.getContext('2d');
        function resizeMtx() { canvas.width = innerWidth; canvas.height = innerHeight }
        resizeMtx(); addEventListener('resize', resizeMtx);
        const CHARS = '01アイウエオカサシ<>/\\|{}#@!';
        let cols, drops;
        function initMtx() {
            cols = Math.floor(canvas.width / 16);
            drops = Array.from({ length: cols }, () => Math.random() * -80);
        }
        initMtx(); addEventListener('resize', initMtx);
        function drawMtx() {
            ctx.fillStyle = 'rgba(6,12,24,.07)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = '13px JetBrains Mono';
            drops.forEach((y, i) => {
                const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
                const bright = y < 4;
                ctx.fillStyle = bright ? 'rgba(0,204,255,.85)' : 'rgba(0,204,255,.13)';
                ctx.fillText(ch, i * 16, y * 16);
                if (y * 16 > canvas.height && Math.random() > .975) drops[i] = 0;
                drops[i] += .45;
            });
        }
        setInterval(drawMtx, 45);

        /* ─── CURSOR ─── */
        const cur = document.getElementById('cur'), ring = document.getElementById('cur-ring');
        let mx = 0, my = 0, rx = 0, ry = 0;
        addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.transform = `translate(${mx - 3.5}px,${my - 3.5}px)` });
        (function anim() { rx += (mx - rx) * .12; ry += (my - ry) * .12; ring.style.transform = `translate(${rx - 14}px,${ry - 14}px)`; requestAnimationFrame(anim) })();
        document.querySelectorAll('a,button,.sk-card,.proj,.stat,.cert').forEach(el => {
            el.addEventListener('mouseenter', () => { ring.style.width = '42px'; ring.style.height = '42px'; ring.style.borderColor = 'rgba(0,204,255,.8)' });
            el.addEventListener('mouseleave', () => { ring.style.width = '28px'; ring.style.height = '28px'; ring.style.borderColor = 'rgba(0,204,255,.5)' });
        });

        /* ─── TYPEWRITER ─── */
        const roles = ['CS Undergraduate', 'Aspiring DevOps Engineer', 'Linux Enthusiast', 'Python Automator', 'WordPress Developer'];
        let ri = 0, ci = 0, del = false;
        const tel = document.getElementById('typed');
        function type() {
            const w = roles[ri];
            tel.textContent = w.substring(0, del ? ci - 1 : ci + 1);
            del ? ci-- : ci++;
            if (!del && ci === w.length) setTimeout(() => del = true, 2000);
            else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length }
            setTimeout(type, del ? 60 : 105);
        }
        setTimeout(type, 2400);

        /* ─── NAV SCROLL ─── */
        const nav = document.getElementById('nav');
        addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));

        /* ─── ACTIVE NAV ─── */
        const secs = document.querySelectorAll('#about, #skills, #experience, #projects, #certifications, #education, #contact');
        const links = document.querySelectorAll('.nav-links a');
        addEventListener('scroll', () => {
            let cur2 = '';
            secs.forEach(s => { if (scrollY >= s.offsetTop - 200) cur2 = s.id });
            links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur2));
        });
        /* ─── MOBILE HAMBURGER MENU ─── */
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }

        /* ─── SCROLL REVEAL ─── */
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') });
        }, { threshold: .1 });
        document.querySelectorAll('.fu').forEach(el => obs.observe(el));

        /* ─── SKILL BARS ─── */
        const barObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.width = e.target.dataset.pct + '%';
                    barObs.unobserve(e.target);
                }
            });
        }, { threshold: .5 });
        document.querySelectorAll('.sk-fill').forEach(b => barObs.observe(b));

        /* ─── STATS COUNTER ─── */
        function countUp(el) {
            const target = parseInt(el.dataset.count);
            const suf = el.dataset.suffix || '';
            if (!target) return;
            const dur = 1400; const start = performance.now();
            (function update(now) {
                const p = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target) + suf;
                if (p < 1) requestAnimationFrame(update);
            })(start);
        }
        const counterObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting && e.target.dataset.count) {
                    countUp(e.target); counterObs.unobserve(e.target);
                }
            });
        }, { threshold: .8 });
        document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

        /* ─── STATUS BAR TIME ─── */
        function updateTime() {
            const t = new Date().toLocaleTimeString('en-US', { hour12: false });
            const el = document.getElementById('sbar-time');
            if (el) { el.innerHTML = `<span class="sb-acc">TIME:</span> ${t}` }
        }
        updateTime(); setInterval(updateTime, 1000);
