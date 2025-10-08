document.addEventListener("DOMContentLoaded", function () {
    const imgs = document.querySelectorAll('.card-img-top');
    const imgOverlay = document.getElementById('imgOverlay');
    const overlayImg = document.getElementById('overlayImg');
    document.getElementById("secondRow").style.display = "none";

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
//validalas

function validateForm() {
    document.getElementById("overlay").style.display = "block";
    let name = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let car = document.getElementById("selectedCarInput").value;
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;

    let name_zone = document.getElementById("fullName");
    let email_zone = document.getElementById("email");
    let phone_zone = document.getElementById("phone");
    let car_zone = document.getElementById("selectedCarInput");
    let startDate_zone = document.getElementById("startDate");
    let endDate_zone = document.getElementById("endDate");

    // Speciális karakterek listája
    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ';', ':', '"', "'", '<', '>', ',', '.', '?', '/'];

    // Kisbetűs ábécé generálása
    const kisBetuk = [];
    for (let i = 97; i <= 122; i++) {
        kisBetuk.push(String.fromCharCode(i)); // ASCII: a = 97, z = 122
    }

    // Nagybetűs ábécé generálása
    const nagyBetuk = [];
    for (let i = 65; i <= 90; i++) {
        nagyBetuk.push(String.fromCharCode(i)); // ASCII: A = 65, Z = 90
    }
    // Egyszerű validációs szabályok
    let nameValid = name.trim().length >= 3;
    let emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    let phoneValid = /^\+?[0-9]{7,15}$/.test(phone);
    let carValid = car.trim() !== "";
    let startDateValid = startDate !== "";
    let endDateValid = endDate !== "" && endDate >= startDate;
}


//overlayek
function torol() {
    document.getElementById("firstRow").style.display = "block";
    document.getElementById("secondRow").style.display = "none";
    selectedCarText.innerHTML = "";
    selectedCarExtra.innerHTML = "";
}
function bezar() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("firstRow").style.display = "block";
    document.getElementById("secondRow").style.display = "none";

}
function change_overlay(car, kep) {
    document.getElementById("firstRow").style.display = "none";
    document.getElementById("secondRow").style.display = "block";
    let name = car;
    let image = kep;
    const div1 = document.createElement("div");
    const p1 = document.createElement("p");
    const img1 = document.createElement("img");
    img1.src = image;
    img1.width = 300;
    img1.style.borderRadius = "10px";
    p1.innerText = "A kiválasztott autó: " + name;
    const ki_text = document.getElementById("selectedCarText");
    const ki_kep = document.getElementById("selectedCarExtra");
    ki_kep.appendChild(img1);
    ki_text.appendChild(p1);
}