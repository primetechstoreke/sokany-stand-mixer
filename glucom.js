/* =====================================================
   GLUCOMETER LANDING PAGE - SCRIPTS
   1. FAQ accordion   2. Order form + pop-up
   3. Count-up stats  4. Scroll reveal  5. Sticky bar
===================================================== */

/* ---------- 1. FAQ ACCORDION ---------- */
document.querySelectorAll(".faq-item").forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
        const wasOpen = item.classList.contains("open");

        // close everything
        document.querySelectorAll(".faq-item").forEach(i => {
            i.classList.remove("open");
            i.querySelector(".faq-answer").style.maxHeight = null;
        });

        // open the clicked one (unless it was already open)
        if (!wasOpen) {
            item.classList.add("open");
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});


/* ---------- 2. ORDER FORM ---------- */
const form = document.getElementById("orderForm");
const submitBtn = form.querySelector("button[type='submit']");
const modal = document.getElementById("customModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalBtn = document.getElementById("modalBtn");

function showModal(title, message, type = "success") {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove("modal-success", "modal-error");
    modal.classList.add(type === "success" ? "modal-success" : "modal-error");
    modal.classList.add("active");
}

modalBtn.addEventListener("click", () => modal.classList.remove("active"));
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("active"); });

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const fullname = formData.get("fullname").trim();
    const phone = formData.get("phone").trim();
    const location = formData.get("location").trim();
    const altPhone = formData.get("alternative_phone").trim();

    const phoneRegex = /^[0-9+\-\s]{7,15}$/;   // numbers, +, - and spaces

    if (!fullname || !phone || !location) {
        showModal("Missing Fields", "Please fill in all required fields.", "error");
        return;
    }
    if (!phoneRegex.test(phone)) {
        showModal("Invalid Phone", "Enter a valid phone number.", "error");
        return;
    }
    if (altPhone && !phoneRegex.test(altPhone)) {
        showModal("Invalid Alternative Phone", "Enter a valid alternative phone number.", "error");
        return;
    }

    // stop double-clicks while sending
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
    })
    .then(response => {
        if (response.ok) {
            showModal("Order Received", "Thank you! We will contact you shortly to confirm delivery.", "success");
            form.reset();
        } else {
            showModal("Submission Failed", "Something went wrong. Please try again.", "error");
        }
    })
    .catch(() => showModal("Network Error", "Check your internet connection and try again.", "error"))
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Confirm My Order";
    });
});


/* ---------- 3. COUNT-UP STATS ---------- */
// Numbers come from data-count="..." in the HTML. Edit them there.
const counters = document.querySelectorAll("[data-count]");
const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        const start = performance.now();
        const duration = 1400; // milliseconds

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(target * progress);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
    });
}, { threshold: 0.6 });
counters.forEach(c => countObserver.observe(c));


/* ---------- 4. SCROLL REVEAL (benefit cards) ---------- */
const cards = document.querySelectorAll(".benefit-card");
cards.forEach((c, i) => { c.classList.add("reveal"); c.style.transitionDelay = (i * 0.1) + "s"; });
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
cards.forEach(c => revealObserver.observe(c));


/* ---------- 5. STICKY BAR: hide when the order form is on screen ---------- */
const stickyBar = document.getElementById("stickyBar");
new IntersectionObserver(entries => {
    stickyBar.classList.toggle("hide", entries[0].isIntersecting);
}, { threshold: 0.15 }).observe(document.getElementById("order"));
