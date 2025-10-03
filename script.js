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

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}
document.addEventListener("DOMContentLoaded", function () {
    const imgs = document.querySelectorAll('.card-img-top');
    const imgOverlay = document.getElementById('imgOverlay');
    const overlayImg = document.getElementById('overlayImg');

    // Only open overlay when the image itself (with .card-img-top) is clicked
    imgs.forEach(imgEl => {
        imgEl.addEventListener('click', function (e) {
            e.stopPropagation(); // prevent clicks bubbling to parent card
            const src = imgEl.src || imgEl.getAttribute('src');
            overlayImg.src = src;
            imgOverlay.style.display = 'flex';
        });
    });

    imgOverlay.addEventListener('click', function () {
        imgOverlay.style.display = 'none';
        overlayImg.src = '';
    });

    // Centralized hide function for the image overlay
    function hideImgOverlay() {
        if (imgOverlay.style.display !== 'none') {
            imgOverlay.style.display = 'none';
            overlayImg.src = '';
        }
    }

    // Hide overlay on any key press
    document.addEventListener('keydown', function () {
        hideImgOverlay();
    });

    // Hide overlay on scroll / wheel / touchmove / pointer down
    window.addEventListener('wheel', function () {
        hideImgOverlay();
    }, { passive: true });

    window.addEventListener('scroll', function () {
        hideImgOverlay();
    }, { passive: true });

    document.addEventListener('touchmove', function () {
        hideImgOverlay();
    }, { passive: true });
});
document.addEventListener('DOMContentLoaded', function () {
    const gomb = document.getElementById('toggleBtn');
    const fr = document.getElementById('firstRow');
    const sr = document.getElementById('secondRow');
    if (gomb && fr && sr) {
        gomb.addEventListener('click', function () {
            if (fr.classList.contains('d-none')) {
                fr.classList.remove('d-none');
                sr.classList.add('d-none');
            } else {
                fr.classList.add('d-none');
                sr.classList.remove('d-none');
            }
        });
    }
});

/* form */
(() => {
    const form = document.getElementById('rentalForm');
    const startInput = document.getElementById('rentalStart');
    const endInput = document.getElementById('rentalEnd');
    const birthInput = document.getElementById('birthDate');
    const phoneInput = document.getElementById('phone');
    const summaryEl = document.getElementById('rentalSummary');
    const alertEl = document.getElementById('formAlert');

    // Helper: dátum -> YYYY-MM-DD
    const toYMD = (d) => {
        const z = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
    };

    // Helper: különbség napokban (end - start)
    function diffDays(startStr, endStr) {
        const s = new Date(startStr);
        const e = new Date(endStr);
        s.setHours(0, 0, 0, 0);
        e.setHours(0, 0, 0, 0);
        return Math.max(0, Math.round((e - s) / 86400000)); // 86 400 000 ms/nap
    }

    // Mai nap (min a bérléshez)
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayStr = toYMD(today);
    if (startInput) startInput.min = todayStr;
    if (endInput) endInput.min = todayStr;

    // 18+ korlátozás (max születési dátum)
    if (birthInput) {
        const adult = new Date(today);
        adult.setFullYear(adult.getFullYear() - 18);
        birthInput.max = toYMD(adult);

        birthInput.addEventListener('input', () => {
            const b = new Date(birthInput.value);
            if (!birthInput.value) return;
            const age = adult.getFullYear() - b.getFullYear() -
                ((adult.getMonth() < b.getMonth() || (adult.getMonth() === b.getMonth() && adult.getDate() < b.getDate())) ? 1 : 0);
            if (age < 18) {
                birthInput.setCustomValidity('A bérléshez legalább 18 évesnek kell lenned.');
            } else {
                birthInput.setCustomValidity('');
            }
        });
    }

    // Bérlés vége nem lehet a kezdet előtt
    function syncEndMin() {
        if (!startInput?.value) return;
        endInput.min = startInput.value;
        if (endInput.value && endInput.value < endInput.min) {
            endInput.value = endInput.min;
        }
        updateSummary();
    }
    startInput?.addEventListener('change', syncEndMin);
    endInput?.addEventListener('change', updateSummary);

    // Telefonszám: szóközök/kötőjelek eltüntetése input közben (opcionális normalizálás)
    phoneInput?.addEventListener('input', () => {
        // Engedélyezzük a + jelet az elején, a többit tisztítjuk
        const raw = phoneInput.value;
        const cleaned = raw.replace(/(?!^\+)[^\d]/g, ''); // csak a legelső + marad
        phoneInput.value = cleaned.startsWith('+') ? '+' + cleaned.replace(/^\+/, '') : cleaned;
    });

    // Élő összegzés frissítése
    function updateSummary() {
        if (!summaryEl) return;
        const s = startInput?.value;
        const e = endInput?.value;
        if (s && e) {
            const d = diffDays(s, e);
            const days = d === 1 ? '1 nap' : `${d} nap`;
            const sHu = new Date(s).toLocaleDateString('hu-HU');
            const eHu = new Date(e).toLocaleDateString('hu-HU');
            summaryEl.innerHTML = `<i class="fa-regular fa-clock me-1"></i> Időtartam: <strong>${sHu}</strong> → <strong>${eHu}</strong> (${days})`;
        } else {
            summaryEl.innerHTML = `<i class="fa-regular fa-clock me-1"></i> Válaszd ki a dátumokat a bérlés időtartamához.`;
        }
    }
    updateSummary(); // kezdeti állapot

    // Bootstrap 5 egyéni validáció + anime.js animációk
    form?.addEventListener('submit', (e) => {
        // DEMÓ: maradjunk az oldalon. Ha tényleges beküldést szeretnél, vedd ki a preventDefault-ot.
        e.preventDefault();

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            // Rázás invalid mezőkre (anime.js)
            if (window.anime) {
                const invalids = form.querySelectorAll(':invalid');
                window.anime({
                    targets: invalids,
                    translateX: [{ value: -6 }, { value: 6 }, { value: 0 }],
                    duration: 300,
                    easing: 'easeInOutSine'
                });
            }
            return;
        }

        form.classList.add('was-validated');

        // Gomb animáció
        const submitBtn = form.querySelector('button[type="submit"]');
        const icon = submitBtn?.querySelector('.btn-icon i');
        submitBtn?.setAttribute('disabled', 'true');

        if (window.anime && icon) {
            window.anime({
                targets: icon,
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                duration: 800,
                easing: 'easeInOutQuad'
            });
        }

        // Siker üzenet megjelenítése
        if (alertEl) {
            alertEl.classList.remove('d-none');
            if (window.anime) {
                window.anime({
                    targets: alertEl,
                    opacity: [0, 1],
                    translateY: [-8, 0],
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
        }

        // DEMÓ: 1.2s után reset + gomb engedélyezés
        setTimeout(() => {
            form.reset();
            form.classList.remove('was-validated');
            submitBtn?.removeAttribute('disabled');
            updateSummary();
        }, 1200);
    });

    // Belépő animáció a mezőkre (anime.js)
    const items = document.querySelectorAll('#rentalForm .form-item');
    if (window.anime && items.length) {
        window.anime({
            targets: items,
            opacity: [0, 1],
            translateY: [16, 0],
            duration: 600,
            delay: window.anime.stagger(70),
            easing: 'easeOutCubic'
        });
    }
})();

