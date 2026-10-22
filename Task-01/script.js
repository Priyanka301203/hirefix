
/* ==========================================
   ELEMENTS
========================================== */

const slider = document.querySelector(".slider");
const track = document.querySelector(".customer-service");
const cards = track ? [...track.querySelectorAll(".client-service")] : [];
const dots = [...document.querySelectorAll(".dots div")];
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

/* ==========================================
   SLIDER SETTINGS
========================================== */

const gap = 20;
let currentIndex = 0;
let isAnimating = false;
let isPaused = false;
let timer;

function getVisibleCardsCount() {
    const width = window.innerWidth;

    if (width <= 600) return 1;
    if (width <= 900) return 2;

    return 3;
}

/* ==========================================
   CARD WIDTH
========================================== */

function setCardWidth() {
    if (!slider || !track || cards.length === 0) return;

    const sliderWidth = slider.clientWidth;
    const visibleCards = getVisibleCardsCount();

    const cardWidth =
        (sliderWidth - gap * (visibleCards - 1)) / visibleCards;

    track.querySelectorAll(".client-service").forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.flexShrink = "0";
    });
}

/* ==========================================
   CLONES
========================================== */

function createClones() {
    if (!track || cards.length === 0) return;

    track.querySelectorAll(".clone").forEach(clone => {
        clone.remove();
    });

    const visibleCards = getVisibleCardsCount();

    cards.slice(0, visibleCards).forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add("clone");
        track.appendChild(clone);
    });
}

/* ==========================================
   MOVE SLIDER
========================================== */

function getStep() {
    if (!cards.length) return 0;

    return cards[0].offsetWidth + gap;
}

function moveSlider() {
    if (!track) return;

    track.style.transform =
        `translateX(-${currentIndex * getStep()}px)`;
}

/* ==========================================
   DOTS
========================================== */

function updateDots() {
    dots.forEach(dot => dot.classList.remove("active"));

    if (dots.length > 0) {
        const dotIndex = currentIndex % dots.length;
        dots[dotIndex]?.classList.add("active");
    }
}

/* ==========================================
   NEXT SLIDE
========================================== */

function nextSlide() {
    if (!track || cards.length === 0) return;
    if (isAnimating || isPaused) return;

    isAnimating = true;
    currentIndex++;

    track.style.transition = "transform 1.2s ease-in-out";
    moveSlider();
    updateDots();

    if (currentIndex === cards.length) {
        setTimeout(() => {
            track.style.transition = "none";
            currentIndex = 0;
            moveSlider();
            updateDots();

            requestAnimationFrame(() => {
                isAnimating = false;
            });
        }, 1200);
    } else {
        setTimeout(() => {
            isAnimating = false;
        }, 1200);
    }
}

/* ==========================================
   PREVIOUS SLIDE
========================================== */

function previousSlide() {
    if (!track || cards.length === 0) return;
    if (isAnimating || isPaused) return;

    isAnimating = true;

    if (currentIndex === 0) {
        track.style.transition = "none";
        currentIndex = cards.length;
        moveSlider();
        track.offsetHeight;
    }

    currentIndex--;

    track.style.transition = "transform 1.2s ease-in-out";
    moveSlider();
    updateDots();

    setTimeout(() => {
        isAnimating = false;
    }, 1200);
}

/* ==========================================
   AUTO SLIDER
========================================== */

function startSlider() {
    clearInterval(timer);

    if (track && cards.length > 0) {
        timer = setInterval(() => {
            nextSlide();
        }, 3000);
    }
}

if (track) {
    track.addEventListener("pointerdown", () => {
        isPaused = true;
    }, { passive: true });

    track.addEventListener("pointerup", () => {
        isPaused = false;
    });

    track.addEventListener("pointercancel", () => {
        isPaused = false;
    });

    track.addEventListener("pointerleave", () => {
        isPaused = false;
    });
}

/* ==========================================
   SLIDER BUTTONS
========================================== */

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        nextSlide();
        startSlider();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        previousSlide();
        startSlider();
    });
}

/* ==========================================
   DOT CLICK
========================================== */

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        if (!track || isAnimating) return;

        currentIndex = index;

        track.style.transition = "transform 1.2s ease-in-out";
        moveSlider();
        updateDots();
        startSlider();
    });
});

/* ==========================================
   RESIZE
========================================== */

window.addEventListener("resize", () => {
    if (!track || !slider) return;

    createClones();
    setCardWidth();

    track.style.transition = "none";
    moveSlider();
});

/* ==========================================
   INITIALIZE SLIDER
========================================== */

if (track && slider && cards.length > 0) {
    createClones();
    setCardWidth();
    startSlider();
}

/* ==========================================
   CARD CLICK
========================================== */

if (track) {
    track.querySelectorAll(".client-service").forEach(card => {
        card.addEventListener("click", function (e) {
            if (window.innerWidth <= 768) return;

            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;

            if (clickX < rect.width / 2) {
                nextSlide();
            } else {
                previousSlide();
            }

            startSlider();
        });
    });
}

/* ==========================================
   PROGRESS BAR ANIMATION
========================================== */

const progressBars = document.querySelectorAll(".line");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const bar = entry.target;
            const value = bar.value;

            bar.value = 0;

            let current = 0;

            const animation = setInterval(() => {
                current++;
                bar.value = current;

                if (current >= value) {
                    clearInterval(animation);
                }
            }, 20);

            observer.unobserve(bar);
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));
}

/* ==========================================
   HAMBURGER MENU
   THREE LINES <-> CROSS
========================================== */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navmenu");

if (menuBtn && navMenu) {

    // Menu open / close karne ke liye toggle switch
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        menuBtn.classList.toggle("active");
        navMenu.classList.toggle("active");

        const isOpen = menuBtn.classList.contains("active");

        menuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );

        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close when clicking outside (Menu ke bahar touch karne par band hoga)
    document.addEventListener("click", (e) => {
        if (
            !navMenu.contains(e.target) &&
            !menuBtn.contains(e.target)
        ) {
            menuBtn.classList.remove("active");
            navMenu.classList.remove("active");

            menuBtn.setAttribute("aria-label", "Open menu");
            menuBtn.setAttribute("aria-expanded", "false");
        }
    });

    
    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", (e) => {
            

            if (link.parentElement.classList.contains("dropdown")) {
                e.preventDefault(); 
    
                const submenu = link.parentElement.querySelector(".submenu");
                if (submenu) {
                    const isDisplayed = window.getComputedStyle(submenu).display === "block";
                    submenu.style.display = isDisplayed ? "none" : "block";
                }
            } else {
                menuBtn.classList.remove("active");
                navMenu.classList.remove("active");

                menuBtn.setAttribute("aria-label", "Open menu");
                menuBtn.setAttribute("aria-expanded", "false");
            }
        });
    });
}
document.querySelectorAll("#navmenu .dropdown > a").forEach(link => {
    link.addEventListener("click", function (e) {
        const submenu = this.nextElementSibling;

        if (submenu && submenu.classList.contains("submenu")) {
            e.preventDefault();
            this.parentElement.classList.toggle("open");
        }
    });
});
  
  
  const buttons = document.querySelectorAll(
    ".btn button, .btn-2 button, .btn-3 button"
);

const popupForm = document.querySelector(".popup-form");

buttons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();
        popupForm.style.display = "block";
    });
});

const searchIcon = document.querySelector(".search");
const searchBar = document.querySelector(".search-bar");
const closeSearch = document.querySelector(".close-search");

searchIcon.addEventListener("click", function () {
    searchBar.classList.add("active");
});

closeSearch.addEventListener("click", function () {
    searchBar.classList.remove("active");
});




