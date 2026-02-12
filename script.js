// ===== CONSTANTS =====
const TOTAL_PAGES = 604;

// ===== TRANSLATIONS =====
const translations = {
  en: {
    subtitle: '"Keep track khatam journey"',
    currentPage: "Current Page",
    placeholderCurrent: "Enter current Quran pages",
    targetDate: "Target Finish Date",
    errorCurrent: "Please enter your current page.",
    errorValidDate: "Please enter a valid target date.",
    calculate: "Calculate",
    futureSuggestions: "Future Suggestions :",
    dailyPages: "Daily Pages",
    dailyPrayer: "Daily Pages (per Prayer)",
    todaysPlan: "Today's Plan :",
    juzCompleted: "Juz Completed",
    pagesLeft: "Pages Left",
    daysLeft: "Days Left",
    countdown: "Countdown :",
    recalculate: "Recalculate",
    madeBy: "Made by",
  },
  my: {
    subtitle: '"Jejak perjalanan khatam anda"',
    currentPage: "Halaman Semasa",
    placeholderCurrent: "Masukkan halaman Al-Quran semasa",
    targetDate: "Tarikh Sasaran Selesai",
    errorCurrent: "Sila masukkan halaman semasa anda.",
    errorValidDate: "Sila masukkan tarikh sasaran yang sah.",
    calculate: "Kira",
    futureSuggestions: "Cadangan Masa Depan :",
    dailyPages: "Halaman Harian",
    dailyPrayer: "Halaman Harian (setiap Solat)",
    todaysPlan: "Rancangan Hari Ini :",
    juzCompleted: "Juz Telah Dibaca",
    pagesLeft: "Halaman Berbaki",
    daysLeft: "Hari Berbaki",
    countdown: "Kiraan Detik :",
    recalculate: "Kira Semula",
    madeBy: "Dibuat oleh",
  }
};

let currentLang = localStorage.getItem("lang") || "en";

// ===== ELEMENTS =====
const inputView = document.getElementById("inputView");
const resultView = document.getElementById("resultView");
const errorEl = document.getElementById("inputError");
const inputProgressCircle = document.getElementById("inputProgressCircle");
const resultProgressCircle = document.getElementById("resultProgressCircle");
const pagesInputField = document.getElementById("pagesInput");

// ===== QUOTES PRESET =====
const quotes = {
  en: [
    "“The most beloved deeds to Allah are those done consistently, even if small.” — Sahih al-Bukhari & Sahih Muslim",
    "“Take on only as much as you can do, for Allah does not grow weary until you do.” — Sahih al-Bukhari",
    "“Do not belittle any good deed, even meeting your brother with a cheerful face.” — Sahih Muslim",
    "“Give charity, even if it is a smile.” — Sahih Muslim",
    "“The strong believer is better and more beloved to Allah than the weak believer…” — Sahih Muslim"
  ],
  my: [
    "“Amalan yang paling dicintai Allah ialah amalan yang dilakukan secara berterusan walaupun sedikit.” — Sahih al-Bukhari & Sahih Muslim",
    "“Lakukanlah amalan sekadar kemampuan kamu, kerana Allah tidak jemu sehingga kamu jemu.” — Sahih al-Bukhari",
    "“Janganlah kamu meremehkan apa-apa kebaikan, walaupun sekadar bertemu saudaramu dengan wajah yang ceria.” — Sahih Muslim",
    "“Bersedekahlah, walaupun hanya dengan senyuman.” — Sahih Muslim",
    "“Mukmin yang kuat lebih baik dan lebih dicintai Allah daripada mukmin yang lemah…” — Sahih Muslim"
  ]
};

// ===== LANGUAGE SWITCHER =====
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  document.getElementById("langDisplay").textContent = lang.toUpperCase();
  displayCurrentDate();
  displayRandomQuote();
}

function toggleLanguage() {
  const newLang = currentLang === "en" ? "my" : "en";
  setLanguage(newLang);
}

// ===== RANDOM QUOTE =====
function displayRandomQuote() {
  const quoteEl = document.getElementById("dailyQuote");
  if (!quoteEl) return;

  const currentQuotes = quotes[currentLang];
  const randomIndex = Math.floor(Math.random() * currentQuotes.length);
  quoteEl.textContent = currentQuotes[randomIndex];
}

// ===== CIRCLE UPDATE =====
function updateCircle(circle, value, total) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  const offset = circumference - (value / total) * circumference;
  circle.style.strokeDashoffset = offset;
}

// ===== LIVE PROGRESS UPDATE =====
pagesInputField.addEventListener("input", function () {
  let value = parseInt(this.value);

  if (isNaN(value) || value < 0) value = 0;
  if (value > TOTAL_PAGES) value = TOTAL_PAGES;

  document.getElementById("pageValueInput").textContent = value;
  updateCircle(inputProgressCircle, value, TOTAL_PAGES);
});

// ===== NUMBER ANIMATION =====
function animateNumber(id, target) {
  const el = document.getElementById(id);
  let current = 0;
  const increment = Math.ceil(target / 40);

  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = current;
  }, 20);
}

// ===== CALCULATE FUNCTION =====
function calculateAndShowResult() {
  const pagesInput = document.getElementById("pagesInput"); // current page
  const targetDateInput = document.getElementById("targetDateInput");
  const diffTimeEl = document.getElementById("diffTime");

  let currentPage = parseInt(pagesInput.value);

  // ===== VALIDATION =====

  if (isNaN(currentPage) || currentPage < 0) {
    errorEl.textContent = translations[currentLang].errorCurrent;
    errorEl.style.display = "block";
    return;
  }


  const targetDate = new Date(targetDateInput.value);
  if (isNaN(targetDate.getTime())) {
    errorEl.textContent = translations[currentLang].errorValidDate;
    errorEl.style.display = "block";
    return;
  }

  errorEl.style.display = "none";

  // Clamp values safely
  currentPage = Math.min(Math.max(currentPage, 0), TOTAL_PAGES);

  // ===== DATE CALCULATION =====

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const timeDiff = targetDate - today;
  const daysRemaining = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

  // ===== CORE CALCULATIONS =====

  const pagesLeft = TOTAL_PAGES - currentPage;

  // 1️⃣ DAILY PAGES (Fixed required average)
  const dailySuggested = Math.ceil(pagesLeft / daysRemaining);

  // 2️⃣ JUZ COMPLETED (Approx 20 pages per Juz)
  const juzCompleted = Math.floor(currentPage / 20);

  // 3️⃣ DAILY PER PRAYER (Based on required average)
  const dailyPerPrayer = Math.ceil(dailySuggested / 5);

  // ===== UPDATE UI =====

  document.getElementById("pageValueInput").textContent = currentPage;
  document.getElementById("pageValueResult").textContent = currentPage;

  updateCircle(inputProgressCircle, currentPage, TOTAL_PAGES);

  inputView.classList.add("hidden");
  resultView.classList.remove("hidden");

  animateNumber("pagesLeft", pagesLeft);

  if (diffTimeEl) animateNumber("diffTime", daysRemaining);

  animateNumber("juzCompleted", juzCompleted);
  animateNumber("dailyPages", dailySuggested);
  animateNumber("dailyPrayerPages", dailyPerPrayer);

  setTimeout(() => {
    updateCircle(resultProgressCircle, currentPage, TOTAL_PAGES);
  }, 150);

  displayRandomQuote();
}




// ===== RETURN TO INPUT VIEW =====
function showInputView() {
  resultView.classList.add("hidden");
  inputView.classList.remove("hidden");
}

// ===== DISPLAY CURRENT DATE (AUTO LOCALE) =====
function displayCurrentDate() {
  const dateEl = document.getElementById("currentDate");
  if (!dateEl) return;

  const today = new Date();
  const locale = currentLang === "my" ? "ms-MY" : "en-US";

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  dateEl.textContent = today.toLocaleDateString(locale, options);
}

// Initial Setup
setLanguage(currentLang);





