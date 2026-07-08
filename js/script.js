const header = document.querySelector(".header");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".nav-link a");
const ctaButton = document.querySelector(".cta-button");

menuButton.addEventListener("click", () => {
    header.classList.toggle("is-open");
    document.body.classList.toggle("no-scroll");
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        header.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
    });
});

ctaButton.addEventListener("click", () => {
    header.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
});

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