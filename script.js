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




