const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");
const brandCards = document.querySelectorAll(".brand-card");
const sections = document.querySelectorAll("section[id]");
const aboutSlider = document.querySelector(".about-slider");

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        const isExpanded = menuToggle.classList.toggle("active");
        navbar.classList.toggle("active", isExpanded);
        menuToggle.setAttribute("aria-expanded", String(isExpanded));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.classList.remove("active");
            navbar.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

if (brandCards.length > 0) {
    const brandObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                brandObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    brandCards.forEach((card, index) => {
        card.classList.add("reveal");
        card.style.transitionDelay = `${index * 0.06}s`;
        brandObserver.observe(card);
    });
}

if (aboutSlider) {
    const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            aboutSlider.classList.toggle("is-active", entry.isIntersecting);
        });
    }, {
        threshold: 0.2
    });

    sliderObserver.observe(aboutSlider);
}

const updateBrandReveal = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    brandCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const revealStart = viewportHeight * 0.92;
        const revealEnd = viewportHeight * 0.28;
        const progress = (revealStart - rect.top) / (revealStart - revealEnd);
        const clampedProgress = Math.max(0, Math.min(1, progress));

        card.style.setProperty("--brand-reveal", clampedProgress.toFixed(3));
    });
};

const updateActiveSection = () => {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 160;

        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });

    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentSection}`;
        link.classList.toggle("active", isActive);
    });
};

let ticking = false;

const runScrollUpdates = () => {
    updateBrandReveal();
    updateActiveSection();
    ticking = false;
};

const requestScrollUpdates = () => {
    if (ticking) {
        return;
    }

    ticking = true;
    window.requestAnimationFrame(runScrollUpdates);
};

updateBrandReveal();
updateActiveSection();

window.addEventListener("scroll", requestScrollUpdates, { passive: true });
window.addEventListener("resize", requestScrollUpdates, { passive: true });
