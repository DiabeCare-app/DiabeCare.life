// --- Dark / Light Mode ---
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const siteLogo = document.getElementById("siteLogo");

function updateLogoForTheme() {
  if (!siteLogo) return;

  const isDark = body.classList.contains("dark");
  const nextLogo = isDark ? siteLogo.dataset.darkLogo : siteLogo.dataset.lightLogo;

  if (nextLogo) {
    siteLogo.src = nextLogo;
  }
}

function updateThemeButton() {
  if (!themeToggle) return;

  const isDark = body.classList.contains("dark");

  themeToggle.innerHTML = isDark
    ? '<span class="theme-toggle-icon">☀</span>'
    : '<span class="theme-toggle-icon">☾</span>';

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
}

const savedTheme = localStorage.getItem("diabecare-theme");

if (savedTheme === "dark") {
  body.classList.add("dark");
}

updateLogoForTheme();
updateThemeButton();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");

    const isDark = body.classList.contains("dark");
    localStorage.setItem("diabecare-theme", isDark ? "dark" : "light");

    updateLogoForTheme();
    updateThemeButton();
  });
}

// --- Reveal Animation ---
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// --- Animated Counters ---
const counters = document.querySelectorAll("[data-count]");

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count || 0);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 32));

      const timer = setInterval(() => {
        current += step;

        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        counter.textContent = current;
      }, 28);

      counterObserver.unobserve(counter);
    });
  }, { threshold: 0.6 });

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => {
    counter.textContent = counter.dataset.count || "0";
  });
}

// --- Active Navbar Link While Scrolling ---
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

// --- Cursor Glow ---
const cursorGlow = document.querySelector(".cursor-glow");

if (cursorGlow) {
  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

// --- App Screens Console ---
const screenData = {
  splash: {
    title: "Splash",
    count: 1,
    description: "The first loading screen that introduces the DiabeCare brand."
  },
  login: {
    title: "Login",
    count: 1,
    description: "Secure sign in screen for existing users."
  },
  signup: {
    title: "Sign Up",
    count: 1,
    description: "Account creation and setup starting screen."
  },
  dashboard: {
    title: "Dashboard",
    count: 3,
    description: "Home screen with glucose status, quick actions, and follow-up reminders."
  },
  glucose: {
    title: "Check Glucose",
    count: 4,
    description: "Blood glucose entry and reading flow."
  },
  foods: {
    title: "Food Library",
    count: 7,
    description: "Food browsing, packaged food, and carbohydrate counting screens."
  },
  foodscale: {
    title: "Food Scale",
    count: 4,
    description: "Weight-based carbohydrate calculation screens."
  },
  insulin: {
    title: "Insulin Guidance",
    count: 6,
    description: "Insulin guidance and meal decision screens."
  },
  dailylog: {
    title: "Daily Log",
    count: 1,
    description: "Daily records for readings, meals, notes, and decisions."
  },
  weekly: {
    title: "Weekly Overview",
    count: 2,
    description: "Weekly glucose overview and summary screens."
  },
  guardian: {
    title: "Guardian Mode",
    count: 8,
    description: "Guardian monitoring, linking, and support screens."
  },
  ai: {
    title: "AI Insights",
    count: 2,
    description: "Smart insight and pattern summary screens."
  },
  settings: {
    title: "Settings",
    count: 3,
    description: "User preferences, thresholds, security, and profile settings."
  }
};

const screenTabs = document.querySelectorAll(".screen-tab");
const activeScreenImage = document.getElementById("activeScreenImage");
const screenTitle = document.getElementById("screenTitle");
const screenDescription = document.getElementById("screenDescription");
const screenPageButtons = document.getElementById("screenPageButtons");

let currentScreen = "splash";
let currentPage = 1;

function getScreenImagePath(screenKey, pageNumber) {
  return `${screenKey}-${pageNumber}.png`;
}

function renderPageButtons(count) {
  if (!screenPageButtons) return;

  screenPageButtons.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = i;
    button.className = i === currentPage ? "page-dot active" : "page-dot";
    button.setAttribute("aria-label", `Open page ${i}`);

    button.addEventListener("click", () => {
      showScreen(currentScreen, i);
    });

    screenPageButtons.appendChild(button);
  }
}

function showScreen(screenKey, pageNumber = 1) {
  const data = screenData[screenKey];

  if (!data || !activeScreenImage) return;

  currentScreen = screenKey;
  currentPage = pageNumber;

  screenTabs.forEach((tab) => {
    const isActive = tab.dataset.screen === screenKey;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  activeScreenImage.classList.remove("image-missing");
  activeScreenImage.style.opacity = "0";
  activeScreenImage.style.transform = "translateY(10px) scale(0.985)";

  setTimeout(() => {
    const nextImage = getScreenImagePath(screenKey, pageNumber);

    activeScreenImage.src = nextImage;
    activeScreenImage.name = screenKey;
    activeScreenImage.alt = `${data.title} page ${pageNumber} preview`;

    if (screenTitle) screenTitle.textContent = data.title;
    if (screenDescription) screenDescription.textContent = data.description;

    activeScreenImage.style.opacity = "1";
    activeScreenImage.style.transform = "translateY(0) scale(1)";
  }, 120);

  renderPageButtons(data.count);
}

if (activeScreenImage) {
  activeScreenImage.addEventListener("error", () => {
    activeScreenImage.classList.add("image-missing");
  });
}

screenTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showScreen(tab.dataset.screen, 1);
  });
});

showScreen("splash", 1);

// --- Soft 3D Card Hover ---
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    const rotateX = (0.5 - (y / rect.height)) * 6;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
