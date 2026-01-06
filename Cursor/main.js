document.addEventListener("DOMContentLoaded", () => {

  // ========= FORCE PAGE TO TOP ON REFRESH =========
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  // ========= FOOTER YEAR =========
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ========= MOBILE MENU =========
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenuToggle.classList.toggle("active");
      mainNav.classList.toggle("active");

      document.body.style.overflow =
        mainNav.classList.contains("active") ? "hidden" : "";
    });
  }

  // ========= SMOOTH SCROLL =========
  document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {
      anchor.addEventListener("click", e => {
        const target = document.querySelector(
          anchor.getAttribute("href")
        );

        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

  // ========= SCROLL ANIMATIONS =========
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  // ========= EMAILJS (SAFE LOAD) =========
  const form = document.querySelector(".contact-form");
  const submitBtn = form?.querySelector("button[type='submit']");

  if (window.emailjs) {
    emailjs.init("iBs0Y-1b5fq-9NiYC");
  }

  if (!form || !submitBtn) {
    console.warn("Contact form not found — skipping EmailJS");
  } else {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      if (!data.name || !data.email || !data.message) {
        alert("Please fill in all required fields.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending...";

      emailjs
        .sendForm("service_2450yfq", "template_j86e1se", this)
        .then(() => {
          alert("✅ Your enquiry has been sent.");
          form.reset();
        })
        .catch(() => {
          alert("❌ Message failed. Please contact +974 7783 9955");
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Get Your Quote</span>
            <svg width="20" height="20">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>`;
        });
    });
  }

  // ========= LOADER =========
  setTimeout(() => {
    const loader = document.querySelector(".ms-loader");
    if (!loader) return;

    loader.style.opacity = "0";
    loader.style.transform = "scale(0.96)";
    loader.style.transition = "all .45s ease";

    setTimeout(() => loader.remove(), 450);
  }, 900);

});


// ========= REVEAL ANIMATIONS =========
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target); // animate once only
      }
    });
  },
  { threshold: 0.2 }
);

revealEls.forEach(el => revealObserver.observe(el));

// ========= HERO VIDEO + SLIDES =========
const videos = [
  "hero.mp4",
  "hero-2.mp4", 
  "hero-3.mp4"
];

const slides = [
  {
    kicker: "Trading • Industrial Supply • Hospitality • Safety Solutions",
    title: "Reliable Trading & Contracting Solutions",
    sub: "For industrial, hospitality & infrastructure projects",
    body: "Master Tech Trading & Contracting connects global suppliers with regional buyers, delivering high-quality products, technical expertise, and end-to-end logistics."
  },
  {
    kicker: "Branding • Hospitality • Safety Flooring",
    title: "End-to-End Project Supply Solutions",
    sub: "From product sourcing to logistics & delivery",
    body: "We ensure reliable sourcing, quality control, and timely delivery across multiple industries and project environments."
  },
  {
    kicker: "Partnership • Reliability • Long-Term Commitment",
    title: "Growing Together With Qatar's Evolving Industries",
    sub: "Delivering value through quality, service and responsible sourcing",
    body: "Our approach is built on trust, consistency and accountability — supporting sustainable business collaboration."
  }
];

const videoA = document.querySelector(".video-a");
const videoB = document.querySelector(".video-b");
const heroText = document.querySelector(".hero-text");
const kickerEl = document.querySelector(".hero-kicker");
const titleEl = document.querySelector("h1");
const subEl = document.querySelector(".hero-sub");
const bodyEl = document.querySelector(".hero-body");

let index = 0;
let active = videoA;
let next = videoB;

/* ---------- TEXT TRANSITION ---------- */
function setSlide(i) {
  heroText.classList.remove("fade-in");
  heroText.classList.add("fade-out");

  setTimeout(() => {
    kickerEl.textContent = slides[i].kicker;
    titleEl.textContent = slides[i].title;
    subEl.textContent = slides[i].sub;
    bodyEl.textContent = slides[i].body;

    heroText.classList.remove("fade-out");
    heroText.classList.add("fade-in");
  }, 750);
}

/* ---------- VIDEO CROSSFADE ---------- */
function playNext() {
  index = (index + 1) % videos.length;

  next.src = videos[index];
  next.load();
  next.preload = 'auto';

  next.oncanplay = () => {
    next.classList.add("visible");
    active.classList.remove("visible");

    // Swap active/next references
    [active, next] = [next, active];

    setSlide(index);

    // Exactly 5 seconds per video
    setTimeout(playNext, 5000);
  };

  next.onerror = () => {
    console.warn(`Failed to load video: ${videos[index]}`);
    next.src = "fallback-hero.jpg";
    next.classList.add("visible");
    active.classList.remove("visible");
    [active, next] = [next, active];
    setSlide(index);
    setTimeout(playNext, 5000);
  };
};

/* ---------- INITIAL LOAD ---------- */
function startHero() {
  if (!videoA || !videoB || !heroText) {
    console.error("Hero elements not found");
    return;
  }

  active.src = videos[0];
  active.load();
  active.preload = 'auto';

  active.oncanplay = () => {
    active.classList.add("visible");
    setSlide(0);
    heroText.classList.add("fade-in");
    
    // Start 5-second cycle
    setTimeout(playNext, 5000);
  };

  active.onerror = () => {
    console.error(`Failed to load first video: ${videos[0]}`);
  };
}

  startHero();

