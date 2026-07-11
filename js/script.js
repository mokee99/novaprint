document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const preloader = document.querySelector(".preloader");
    const preloaderNumber = document.querySelector(".preloader-number");
    const heroImage = document.querySelector(".hero-image img");

    if (!preloader || !preloaderNumber) {
        body.classList.remove("is-loading");
        return;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let currentProgress = 0;
    let progressInterval;

    function updateProgress(value) {
        currentProgress = Math.min(Math.round(value), 100);

        preloaderNumber.textContent = currentProgress;

        const normalizedProgress = currentProgress / 100;

        const glowScale = 0.25 + normalizedProgress * 0.75;
        const glowOpacity = 0.2 + normalizedProgress * 0.7;

        preloader.style.setProperty(
            "--loader-scale",
            glowScale.toFixed(3)
        );

        preloader.style.setProperty(
            "--loader-opacity",
            glowOpacity.toFixed(3)
        );
    }

    function waitForHeroImage() {
        if (!heroImage) {
            return Promise.resolve();
        }

        if (heroImage.complete && heroImage.naturalWidth > 0) {
            if (typeof heroImage.decode === "function") {
                return heroImage.decode().catch(() => {});
            }

            return Promise.resolve();
        }

        return new Promise((resolve) => {
            heroImage.addEventListener("load", resolve, {
                once: true
            });

            heroImage.addEventListener("error", resolve, {
                once: true
            });
        });
    }

    function waitForFonts() {
        if (document.fonts && document.fonts.ready) {
            return document.fonts.ready.catch(() => {});
        }

        return Promise.resolve();
    }

    function minimumLoadingTime() {
        const duration = prefersReducedMotion ? 0 : 1800;

        return new Promise((resolve) => {
            window.setTimeout(resolve, duration);
        });
    }

    function startFakeProgress() {
        progressInterval = window.setInterval(() => {
            if (currentProgress >= 90) {
                window.clearInterval(progressInterval);
                return;
            }

            let increase = 1;

            if (currentProgress < 30) {
                increase = Math.random() * 3 + 1;
            } else if (currentProgress < 65) {
                increase = Math.random() * 2 + 0.5;
            } else {
                increase = Math.random() + 0.2;
            }

            updateProgress(
                Math.min(currentProgress + increase, 90)
            );
        }, 45);
    }

    function completeProgress() {
        return new Promise((resolve) => {
            if (prefersReducedMotion) {
                updateProgress(100);
                resolve();
                return;
            }

            const startingProgress = currentProgress;
            const duration = 550;
            const startTime = performance.now();

            function animateProgress(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easedProgress =
                    1 - Math.pow(1 - progress, 3);

                const value =
                    startingProgress +
                    (100 - startingProgress) * easedProgress;

                updateProgress(value);

                if (progress < 1) {
                    window.requestAnimationFrame(animateProgress);
                } else {
                    updateProgress(100);
                    resolve();
                }
            }

            window.requestAnimationFrame(animateProgress);
        });
    }

    function revealPage() {
        window.setTimeout(() => {
            body.classList.add("intro-reveal");
            preloader.classList.add("is-revealing");

            window.setTimeout(() => {
                body.classList.remove("is-loading");
                preloader.classList.add("is-hidden");
            }, prefersReducedMotion ? 0 : 1450);

            window.setTimeout(() => {
                preloader.remove();
            }, prefersReducedMotion ? 0 : 2000);
        }, prefersReducedMotion ? 0 : 180);
    }

    async function initializePreloader() {
        updateProgress(0);
        startFakeProgress();

        await Promise.all([
            waitForHeroImage(),
            waitForFonts(),
            minimumLoadingTime()
        ]);

        window.clearInterval(progressInterval);

        await completeProgress();

        revealPage();
    }

    initializePreloader();
});

/* =========================
   NAVIGATION MENU
========================= */


const header = document.querySelector(".header");
const menuButton = document.querySelector(".menu-button");
const navbarLogo = document.querySelector(".navbar-logo");
const navLinks = document.querySelectorAll(".nav-link a");
const ctaButton = document.querySelector(".cta-button");

function closeMenu() {
    header.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
}

function navigateToSection(link, event) {
    const targetId = link.getAttribute("href");

    if (!targetId || !targetId.startsWith("#")) {
        return;
    }

    const targetSection = document.querySelector(targetId);

    if (!targetSection) {
        return;
    }

    event.preventDefault();

    closeMenu();

    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.pushState(null, "", targetId);
        });
    });
}

if (header && menuButton) {
    menuButton.addEventListener("click", () => {
        const menuIsOpen = header.classList.toggle("is-open");

        document.body.classList.toggle("no-scroll", menuIsOpen);
    });
}

if (navbarLogo) {
    navbarLogo.addEventListener("click", (event) => {
        navigateToSection(navbarLogo, event);
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        navigateToSection(link, event);
    });
});

if (ctaButton) {
    ctaButton.addEventListener("click", (event) => {
        navigateToSection(ctaButton, event);
    });
}


const servicesSection = document.querySelector(".section-services");
const serviceCards = document.querySelectorAll(".services-card");

if (servicesSection && serviceCards.length > 0) {
  servicesSection.classList.add("services-animations-enabled");

  serviceCards.forEach((card, index) => {
    card.style.setProperty("--services-delay", `${index * 100}ms`);
  });

  const servicesObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  serviceCards.forEach((card) => {
    servicesObserver.observe(card);
  });
}

const aboutSection = document.querySelector(".section-about");

if (aboutSection) {
  aboutSection.classList.add("about-animations-enabled");

  const aboutObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  aboutObserver.observe(aboutSection);
}

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        faqItems.forEach((faqItem) => {
            faqItem.classList.remove("is-open");
        });

        if (!isOpen) {
            item.classList.add("is-open");
        }
    });
});

const contactSection = document.querySelector(".section-contact");

if (contactSection) {
  contactSection.classList.add("contact-animations-enabled");

  const contactObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  contactObserver.observe(contactSection);
}

/* =========================
   NETLIFY CONTACT FORM
========================= */

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    const submitButton = contactForm.querySelector(".form-submit");
    const defaultButtonText = submitButton.textContent;

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        contactForm.classList.remove("is-error");

        submitButton.disabled = true;
        submitButton.textContent = "SENDING...";

        const formData = new FormData(contactForm);

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(formData).toString()
            });

            if (!response.ok) {
                throw new Error("Form submission failed");
            }

            contactForm.reset();
            contactForm.classList.add("is-success");
        } catch (error) {
            console.error("Contact form error:", error);

            contactForm.classList.add("is-error");

            submitButton.disabled = false;
            submitButton.textContent = defaultButtonText;
        }
    });
}