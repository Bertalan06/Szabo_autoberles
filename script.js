document.addEventListener('DOMContentLoaded', function () {
    const topBar = document.querySelector('.top-bar');
    const hero = document.getElementById('hero');

    if (!topBar || !hero) return;

    // show the small top-bar when the hero is mostly out of view
    let threshold = Math.max(120, hero.offsetHeight - 80);

    function updateThreshold() {
        threshold = Math.max(120, hero.offsetHeight - 80);
    }

    function onScroll() {
        if (window.scrollY > threshold) {
            topBar.classList.add('show');
        } else {
            topBar.classList.remove('show');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
        updateThreshold();
        onScroll();
    });

    // init
    updateThreshold();
    onScroll();
});


// Finom gyorsítás-lassítás (ease-in-out)
const easeInOutCubic = t => (t < 0.5)
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

let rafId = null;
let cancelByUser = null;

// Megszakítás felhasználói interakcióra (egérgörgő, érintés, billentyű)
function attachCancelOnUserInput() {
    const cancel = () => {
        if (rafId) cancelAnimationFrame(rafId);
        detach();
    };
    const opts = { passive: true };
    window.addEventListener('wheel', cancel, opts);
    window.addEventListener('touchstart', cancel, opts);
    window.addEventListener('keydown', cancel, opts);
    cancelByUser = cancel;

    function detach() {
        window.removeEventListener('wheel', cancel, opts);
        window.removeEventListener('touchstart', cancel, opts);
        window.removeEventListener('keydown', cancel, opts);
        cancelByUser = null;
    }
}

/**
 * Lassan görget "durationMs" ideig, kb. "speedPxPerSec" sebességgel, irány: 1=le, -1=fel
 * Ease-in-out görbével: nem ugrik, szépen indul és áll meg.
 */
function timedSmoothScroll({ durationMs = 3000, speedPxPerSec = 300, direction = 1 } = {}) {
    // Hozzáférhetőség: ha a felhasználó kéri a kevesebb animációt, azonnal lépünk a végpozícióra.
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const startY = window.pageYOffset;
    const doc = document.documentElement;
    const maxY = Math.max(0, doc.scrollHeight - window.innerHeight);

    // Elvileg bejárandó teljes távolság (sebesség * idő), iránnyal
    const totalDistance = speedPxPerSec * (durationMs / 1000) * direction;
    // Cél pozíciót clampeljük, nehogy túlfusson felül vagy alul
    const targetY = Math.min(maxY, Math.max(0, startY + totalDistance));
    const actualDistance = targetY - startY; // ha a clamp miatt rövidebb lett

    // Ha nincs hová menni, kilépünk
    if (Math.abs(actualDistance) < 1) return;

    if (prefersReduced) {
        // Nincs animáció, csak azonnal oda
        window.scrollTo({ top: targetY, behavior: 'auto' });
        return;
    }

    const startTime = performance.now();
    attachCancelOnUserInput();

    function frame(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / durationMs);     // 0..1
        const eased = easeInOutCubic(t);                 // 0..1, finom görbe
        const y = startY + actualDistance * eased;

        window.scrollTo(0, y);

        if (t < 1) {
            rafId = requestAnimationFrame(frame);
        } else {
            // vége – takarítás
            if (cancelByUser) cancelByUser(); // detach listenerek
        }
    }

    rafId = requestAnimationFrame(frame);
}

// Gombok eseménykezelői
document.getElementById('scroll-down')?.addEventListener('click', () => {
    timedSmoothScroll({
        durationMs: 3000,  // 3 másodperc
        speedPxPerSec: 300, // lassú
        direction: 1        // lefelé
    });
});

document.getElementById('scroll-up')?.addEventListener('click', () => {
    timedSmoothScroll({
        durationMs: 3000,
        speedPxPerSec: 300,
        direction: -1       // felfelé
    });
});



