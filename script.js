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


